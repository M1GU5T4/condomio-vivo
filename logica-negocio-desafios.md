# Considerações de Lógica de Negócio e Desafios Técnicos

Este documento aborda os principais desafios lógicos e técnicos do módulo Painel do Condomínio, apresentando soluções detalhadas para cada problema identificado.

---

## 1. Desafio: Sistema de Confirmação de Leitura de Posts

### Problema
Como garantir que a confirmação de leitura seja registrada apenas uma vez por usuário, evitando duplicatas e mantendo a integridade dos dados de engajamento?

### Solução Implementada

**Backend (API)**:
```typescript
// POST /api/condominiums/:condominiumId/posts/:postId/view
async markPostAsRead(userId: string, postId: string) {
  try {
    // Verifica se já existe um registro de visualização
    const existingView = await prisma.postView.findUnique({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    });
    
    // Se já existe, retorna sem criar duplicata
    if (existingView) {
      return { success: true, message: 'Post já foi marcado como lido' };
    }
    
    // Cria novo registro de visualização
    await prisma.postView.create({
      data: {
        postId,
        userId,
        viewedAt: new Date()
      }
    });
    
    return { success: true, message: 'Post marcado como lido' };
  } catch (error) {
    throw new Error('Erro ao marcar post como lido');
  }
}
```

**Considerações Adicionais**:
- Constraint única no banco (`@@unique([postId, userId])`) previne duplicatas a nível de BD
- Endpoint idempotente: múltiplas chamadas não causam efeitos colaterais
- Auditoria completa com timestamp de visualização

---

## 2. Desafio: Segmentação de Audiência para Posts

### Problema
Como implementar um sistema flexível que permita ao síndico criar posts direcionados para:
- Todos os moradores
- Um bloco específico
- Uma unidade específica

### Solução Implementada

**Modelo de Dados**:
```prisma
model PostAudience {
  id          String            @id @default(cuid())
  type        PostAudienceType  // TODOS, BLOCO_ESPECIFICO, UNIDADE_ESPECIFICA
  blockNumber String?           // Preenchido quando type = BLOCO_ESPECIFICO
  unitId      String?           // Preenchido quando type = UNIDADE_ESPECIFICA
  
  postId String
  post   Post   @relation(fields: [postId], references: [id])
  unit   Unit?  @relation(fields: [unitId], references: [id])
}
```

**Lógica de Filtragem (Backend)**:
```typescript
async getVisiblePosts(userId: string, condominiumId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { unit: true }
  });
  
  const posts = await prisma.post.findMany({
    where: {
      condominiumId,
      isActive: true,
      OR: [
        // Posts para todos
        {
          audiences: {
            some: { type: 'TODOS' }
          }
        },
        // Posts para o bloco do usuário
        {
          audiences: {
            some: {
              type: 'BLOCO_ESPECIFICO',
              blockNumber: user.unit?.blockNumber
            }
          }
        },
        // Posts específicos para a unidade do usuário
        {
          audiences: {
            some: {
              type: 'UNIDADE_ESPECIFICA',
              unitId: user.unitId
            }
          }
        }
      ]
    },
    include: {
      author: true,
      audiences: true,
      views: {
        where: { userId }
      }
    }
  });
  
  return posts;
}
```

---

## 3. Desafio: Sistema de RSVP com Controle de Capacidade

### Problema
Como gerenciar confirmações de presença em eventos respeitando a capacidade máxima e permitindo lista de espera?

### Solução Implementada

**Lógica de RSVP**:
```typescript
async rsvpEvent(userId: string, eventId: string, isAttending: boolean, guestCount: number = 1) {
  return await prisma.$transaction(async (tx) => {
    // Busca o evento com RSVPs atuais
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: {
        rsvps: {
          where: { isAttending: true }
        }
      }
    });
    
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    
    // Calcula participantes confirmados
    const confirmedAttendees = event.rsvps.reduce(
      (total, rsvp) => total + rsvp.guestCount, 0
    );
    
    // Verifica RSVP existente
    const existingRSVP = await tx.eventRSVP.findUnique({
      where: {
        eventId_userId: { eventId, userId }
      }
    });
    
    if (isAttending) {
      const totalRequested = guestCount;
      const currentConfirmed = existingRSVP?.isAttending ? existingRSVP.guestCount : 0;
      const newTotal = confirmedAttendees - currentConfirmed + totalRequested;
      
      // Verifica capacidade
      if (event.maxAttendees && newTotal > event.maxAttendees) {
        throw new Error(`Capacidade excedida. Vagas disponíveis: ${event.maxAttendees - confirmedAttendees + currentConfirmed}`);
      }
    }
    
    // Cria ou atualiza RSVP
    const rsvp = await tx.eventRSVP.upsert({
      where: {
        eventId_userId: { eventId, userId }
      },
      update: {
        isAttending,
        guestCount: isAttending ? guestCount : 0,
        updatedAt: new Date()
      },
      create: {
        eventId,
        userId,
        isAttending,
        guestCount: isAttending ? guestCount : 0
      }
    });
    
    return rsvp;
  });
}
```

---

## 4. Desafio: Sistema de Contato Anônimo para Classificados

### Problema
Como permitir que moradores entrem em contato sobre classificados sem expor dados pessoais publicamente?

### Solução Implementada

**Sistema de Mensagens Internas**:
```typescript
// Modelo para mensagens internas
model InternalMessage {
  id        String   @id @default(cuid())
  subject   String
  content   String   @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  
  // Relacionamentos
  senderId    String
  sender      User   @relation("SentMessages", fields: [senderId], references: [id])
  recipientId String
  recipient   User   @relation("ReceivedMessages", fields: [recipientId], references: [id])
  
  // Referência opcional ao classificado
  classifiedAdId String?
  classifiedAd   ClassifiedAd? @relation(fields: [classifiedAdId], references: [id])
}

// Endpoint para contato
async contactClassifiedSeller(senderId: string, adId: string, message: string) {
  const ad = await prisma.classifiedAd.findUnique({
    where: { id: adId },
    include: { author: true }
  });
  
  if (!ad) {
    throw new Error('Anúncio não encontrado');
  }
  
  // Impede auto-contato
  if (ad.authorId === senderId) {
    throw new Error('Não é possível entrar em contato com seu próprio anúncio');
  }
  
  // Cria mensagem interna
  const internalMessage = await prisma.internalMessage.create({
    data: {
      subject: `Interesse no anúncio: ${ad.title}`,
      content: message,
      senderId,
      recipientId: ad.authorId,
      classifiedAdId: adId
    }
  });
  
  // Envia notificação (email/push)
  await notificationService.sendNotification({
    userId: ad.authorId,
    type: 'NEW_MESSAGE',
    title: 'Nova mensagem sobre seu anúncio',
    content: `Alguém demonstrou interesse no seu anúncio "${ad.title}"`
  });
  
  return internalMessage;
}
```

---

## 5. Desafio: Gerenciamento de Arquivos e Storage

### Problema
Como gerenciar upload, armazenamento e acesso seguro a documentos e imagens do condomínio?

### Solução Implementada

**Estratégia de Storage**:
```typescript
class FileStorageService {
  private readonly allowedMimeTypes = {
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    images: ['image/jpeg', 'image/png', 'image/webp']
  };
  
  private readonly maxFileSizes = {
    documents: 10 * 1024 * 1024, // 10MB
    images: 5 * 1024 * 1024      // 5MB
  };
  
  async uploadDocument(file: Express.Multer.File, userId: string, condominiumId: string) {
    // Validações
    this.validateFile(file, 'documents');
    
    // Gera nome único
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;
    const filePath = `condominiums/${condominiumId}/documents/${fileName}`;
    
    // Upload para S3/storage
    const uploadResult = await this.storageProvider.upload({
      key: filePath,
      body: file.buffer,
      contentType: file.mimetype
    });
    
    // Salva metadados no banco
    const document = await prisma.document.create({
      data: {
        title: file.originalname,
        fileName: file.originalname,
        filePath: uploadResult.key,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedById: userId,
        condominiumId,
        category: 'OUTROS' // Será atualizado pelo usuário
      }
    });
    
    return document;
  }
  
  async getSecureDownloadUrl(documentId: string, userId: string) {
    // Verifica permissões
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        condominium: {
          units: {
            some: {
              residents: {
                some: { id: userId }
              }
            }
          }
        }
      }
    });
    
    if (!document) {
      throw new Error('Documento não encontrado ou sem permissão');
    }
    
    // Gera URL assinada temporária (15 minutos)
    const signedUrl = await this.storageProvider.getSignedUrl({
      key: document.filePath,
      expires: 15 * 60 // 15 minutos
    });
    
    return signedUrl;
  }
}
```

---

## 6. Desafio: Sistema de Notificações Inteligentes

### Problema
Como implementar um sistema de notificações que seja relevante sem ser invasivo?

### Solução Implementada

**Estratégia de Notificações**:
```typescript
class NotificationService {
  private readonly notificationRules = {
    POST_URGENT: {
      immediate: true,
      channels: ['push', 'email'],
      frequency: 'once'
    },
    POST_NORMAL: {
      immediate: false,
      channels: ['push'],
      frequency: 'daily_digest'
    },
    EVENT_REMINDER: {
      immediate: false,
      channels: ['push', 'email'],
      schedule: '24h_before'
    },
    NEW_CLASSIFIED: {
      immediate: false,
      channels: ['push'],
      frequency: 'weekly_digest'
    }
  };
  
  async processNotification(type: string, data: any) {
    const rule = this.notificationRules[type];
    
    if (rule.immediate) {
      await this.sendImmediateNotification(type, data, rule.channels);
    } else {
      await this.scheduleNotification(type, data, rule);
    }
  }
  
  async sendImmediateNotification(type: string, data: any, channels: string[]) {
    const recipients = await this.getRecipients(type, data);
    
    for (const recipient of recipients) {
      // Verifica preferências do usuário
      const preferences = await this.getUserNotificationPreferences(recipient.id);
      
      for (const channel of channels) {
        if (preferences[channel]) {
          await this.sendToChannel(channel, recipient, data);
        }
      }
    }
  }
}
```

---

## 7. Considerações de Performance

### Indexação de Banco de Dados
```sql
-- Índices essenciais para performance
CREATE INDEX idx_posts_condominium_active ON posts(condominium_id, is_active, created_at DESC);
CREATE INDEX idx_post_views_user_post ON post_views(user_id, post_id);
CREATE INDEX idx_events_condominium_date ON events(condominium_id, start_date);
CREATE INDEX idx_classifieds_condominium_active ON classified_ads(condominium_id, is_active, created_at DESC);
CREATE INDEX idx_documents_condominium_category ON documents(condominium_id, category);
```

### Cache Strategy
```typescript
// Cache para dados frequentemente acessados
class CacheService {
  async getCachedPosts(condominiumId: string, userId: string) {
    const cacheKey = `posts:${condominiumId}:${userId}`;
    
    let posts = await this.redis.get(cacheKey);
    
    if (!posts) {
      posts = await this.postsService.getVisiblePosts(userId, condominiumId);
      await this.redis.setex(cacheKey, 300, JSON.stringify(posts)); // 5 minutos
    }
    
    return JSON.parse(posts);
  }
  
  async invalidatePostsCache(condominiumId: string) {
    const pattern = `posts:${condominiumId}:*`;
    const keys = await this.redis.keys(pattern);
    
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

---

## 8. Considerações de Segurança

### Validação de Permissões
```typescript
class SecurityService {
  async validateCondominiumAccess(userId: string, condominiumId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        unit: {
          condominiumId
        }
      }
    });
    
    if (!user) {
      throw new UnauthorizedException('Usuário não pertence a este condomínio');
    }
    
    return user;
  }
  
  async validatePostAccess(userId: string, postId: string) {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        OR: [
          // Post público para todos
          {
            audiences: {
              some: { type: 'TODOS' }
            }
          },
          // Post para o bloco/unidade do usuário
          {
            audiences: {
              some: {
                OR: [
                  {
                    type: 'BLOCO_ESPECIFICO',
                    blockNumber: {
                      in: await this.getUserBlocks(userId)
                    }
                  },
                  {
                    type: 'UNIDADE_ESPECIFICA',
                    unit: {
                      residents: {
                        some: { id: userId }
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    });
    
    if (!post) {
      throw new ForbiddenException('Acesso negado a este post');
    }
    
    return post;
  }
}
```

---

## Conclusão

Esses desafios e soluções cobrem os aspectos mais críticos do módulo Painel do Condomínio:

1. **Integridade de Dados**: Prevenção de duplicatas e consistência
2. **Flexibilidade**: Sistema de audiência adaptável
3. **Escalabilidade**: Cache e indexação adequados
4. **Segurança**: Validação rigorosa de permissões
5. **Usabilidade**: Notificações inteligentes e contato anônimo
6. **Performance**: Otimizações de banco e cache

Cada solução foi projetada considerando a escalabilidade, manutenibilidade e experiência do usuário, garantindo que o sistema seja robusto e eficiente mesmo com o crescimento da base de usuários.