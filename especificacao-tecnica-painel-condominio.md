# Especificação Técnica Completa - Módulo Painel do Condomínio

## 1. Visão Geral

Este documento apresenta a especificação técnica completa para o módulo "Painel do Condomínio" do SaaS de gestão de condomínios. O módulo serve como hub central de informações e interação da comunidade, substituindo um simples mural de avisos estático.

### Stack Tecnológica
- **Backend**: Node.js (NestJS) com PostgreSQL (Prisma ORM)
- **Frontend**: React com TypeScript e Material-UI
- **Autenticação**: JWT (já implementada)
- **Modelos Existentes**: User, Condominium, Unit

## 2. Modelos de Dados (Prisma Schema)

### Enums

```prisma
enum PostPriority {
  NORMAL
  URGENTE
  CRITICO
}

enum PostAudienceType {
  ALL           // Todos os moradores
  BLOCK         // Bloco específico
  UNIT          // Unidade específica
  CUSTOM        // Lista customizada de usuários
}

enum DocumentCategory {
  REGIMENTO
  ATA
  BALANCETE
  COMUNICADO
  CONTRATO
  OUTROS
}

enum ClassifiedStatus {
  ACTIVE
  SOLD
  EXPIRED
  REMOVED
}

enum ClassifiedCategory {
  VENDA
  SERVICO
  DOACAO
  TROCA
}

enum LostFoundStatus {
  LOST      // Item perdido
  FOUND     // Item encontrado
  CLAIMED   // Item devolvido/reclamado
}
```

### Modelos Principais

```prisma
model Post {
  id          String      @id @default(cuid())
  title       String
  content     String
  priority    PostPriority @default(NORMAL)
  publishedAt DateTime    @default(now())
  expiresAt   DateTime?
  isActive    Boolean     @default(true)
  
  // Relacionamentos
  authorId      String
  author        User        @relation(fields: [authorId], references: [id])
  condominiumId String
  condominium   Condominium @relation(fields: [condominiumId], references: [id])
  
  // Audiência e visualizações
  audiences PostAudience[]
  views     PostView[]
  
  // Metadados
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("posts")
}

model PostAudience {
  id     String            @id @default(cuid())
  type   PostAudienceType
  
  // Relacionamentos
  postId String
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  // Campos opcionais para segmentação
  blockNumber String? // Para type BLOCK
  unitId      String? // Para type UNIT
  unit        Unit?   @relation(fields: [unitId], references: [id])
  
  // Para audiência customizada
  userId String?
  user   User?  @relation(fields: [userId], references: [id])
  
  @@unique([postId, type, blockNumber])
  @@unique([postId, type, unitId])
  @@unique([postId, userId])
  @@map("post_audiences")
}

model PostView {
  id       String   @id @default(cuid())
  viewedAt DateTime @default(now())
  
  // Relacionamentos
  postId String
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId String
  user   User   @relation(fields: [userId], references: [id])
  
  @@unique([postId, userId])
  @@map("post_views")
}

model Document {
  id          String           @id @default(cuid())
  title       String
  description String?
  category    DocumentCategory
  fileName    String
  filePath    String
  fileSize    Int
  mimeType    String
  
  // Relacionamentos
  uploadedById  String
  uploadedBy    User        @relation(fields: [uploadedById], references: [id])
  condominiumId String
  condominium   Condominium @relation(fields: [condominiumId], references: [id])
  
  // Metadados
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("documents")
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String
  startDate   DateTime
  endDate     DateTime?
  location    String?
  imageUrl    String?
  maxAttendees Int?
  
  // Relacionamentos
  organizerId   String
  organizer     User        @relation(fields: [organizerId], references: [id])
  condominiumId String
  condominium   Condominium @relation(fields: [condominiumId], references: [id])
  
  // RSVPs
  rsvps EventRSVP[]
  
  // Metadados
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("events")
}

model EventRSVP {
  id         String   @id @default(cuid())
  attending  Boolean  @default(true)
  guestCount Int      @default(1)
  notes      String?
  
  // Relacionamentos
  eventId String
  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)
  userId  String
  user    User   @relation(fields: [userId], references: [id])
  
  // Metadados
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([eventId, userId])
  @@map("event_rsvps")
}

model ClassifiedAd {
  id          String             @id @default(cuid())
  title       String
  description String
  category    ClassifiedCategory
  price       Decimal?           @db.Decimal(10, 2)
  status      ClassifiedStatus   @default(ACTIVE)
  images      String[]           // Array de URLs das imagens
  
  // Relacionamentos
  authorId      String
  author        User        @relation(fields: [authorId], references: [id])
  condominiumId String
  condominium   Condominium @relation(fields: [condominiumId], references: [id])
  
  // Metadados
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  expiresAt DateTime?
  
  @@map("classified_ads")
}

model LostAndFoundItem {
  id          String          @id @default(cuid())
  title       String
  description String
  status      LostFoundStatus
  foundLocation String?
  imageUrl    String?
  
  // Relacionamentos
  reporterId    String
  reporter      User        @relation(fields: [reporterId], references: [id])
  condominiumId String
  condominium   Condominium @relation(fields: [condominiumId], references: [id])
  
  // Para quando o item é devolvido
  claimedById String?
  claimedBy   User?   @relation("ClaimedItems", fields: [claimedById], references: [id])
  claimedAt   DateTime?
  
  // Metadados
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("lost_and_found_items")
}
```

### Extensões aos Modelos Existentes

```prisma
// Adicionar aos modelos existentes:

model User {
  // ... campos existentes
  
  // Relacionamentos com o Painel do Condomínio
  posts           Post[]
  postViews       PostView[]
  postAudiences   PostAudience[]
  documents       Document[]
  events          Event[]
  eventRSVPs      EventRSVP[]
  classifiedAds   ClassifiedAd[]
  lostFoundItems  LostAndFoundItem[]
  claimedItems    LostAndFoundItem[] @relation("ClaimedItems")
}

model Condominium {
  // ... campos existentes
  
  // Relacionamentos com o Painel do Condomínio
  posts           Post[]
  documents       Document[]
  events          Event[]
  classifiedAds   ClassifiedAd[]
  lostFoundItems  LostAndFoundItem[]
}

model Unit {
  // ... campos existentes
  
  // Relacionamentos com o Painel do Condomínio
  postAudiences PostAudience[]
}
```

## 3. Design da API (Endpoints RESTful)

### Autenticação e Autorização
- Todos os endpoints requerem autenticação JWT
- Verificação de role (SINDICO/MORADOR) conforme necessário
- Verificação de pertencimento ao condomínio

### Módulo A: Comunicação Centralizada

#### Posts (Mural Digital)
```
POST   /api/posts                    - (SINDICO) - Cria novo post
GET    /api/posts                    - (MORADOR, SINDICO) - Lista posts visíveis
GET    /api/posts/:id                - (MORADOR, SINDICO) - Detalhes do post
PUT    /api/posts/:id                - (SINDICO) - Atualiza post
DELETE /api/posts/:id                - (SINDICO) - Remove post
POST   /api/posts/:id/view           - (MORADOR) - Marca como lido
GET    /api/posts/:id/views          - (SINDICO) - Lista quem leu
POST   /api/posts/:id/audience       - (SINDICO) - Define audiência
```

#### Documentos
```
POST   /api/documents                - (SINDICO) - Upload documento
GET    /api/documents                - (MORADOR, SINDICO) - Lista documentos
GET    /api/documents/:id            - (MORADOR, SINDICO) - Download documento
PUT    /api/documents/:id            - (SINDICO) - Atualiza documento
DELETE /api/documents/:id            - (SINDICO) - Remove documento
GET    /api/documents/categories     - (MORADOR, SINDICO) - Lista categorias
```

### Módulo B: Vida em Comunidade

#### Eventos
```
POST   /api/events                   - (SINDICO) - Cria evento
GET    /api/events                   - (MORADOR, SINDICO) - Lista eventos
GET    /api/events/:id               - (MORADOR, SINDICO) - Detalhes do evento
PUT    /api/events/:id               - (SINDICO) - Atualiza evento
DELETE /api/events/:id               - (SINDICO) - Remove evento
POST   /api/events/:id/rsvp          - (MORADOR) - Confirma presença
PUT    /api/events/:id/rsvp          - (MORADOR) - Atualiza RSVP
DELETE /api/events/:id/rsvp          - (MORADOR) - Cancela RSVP
GET    /api/events/:id/attendees     - (SINDICO) - Lista confirmados
```

#### Classificados
```
POST   /api/classifieds              - (MORADOR) - Cria classificado
GET    /api/classifieds              - (MORADOR, SINDICO) - Lista classificados
GET    /api/classifieds/:id          - (MORADOR, SINDICO) - Detalhes do classificado
PUT    /api/classifieds/:id          - (MORADOR - próprio) - Atualiza classificado
DELETE /api/classifieds/:id          - (MORADOR - próprio, SINDICO) - Remove classificado
POST   /api/classifieds/:id/contact  - (MORADOR) - Contata anunciante
PUT    /api/classifieds/:id/status   - (MORADOR - próprio) - Atualiza status
```

#### Achados e Perdidos
```
POST   /api/lost-found               - (MORADOR) - Reporta item
GET    /api/lost-found               - (MORADOR, SINDICO) - Lista itens
GET    /api/lost-found/:id           - (MORADOR, SINDICO) - Detalhes do item
PUT    /api/lost-found/:id           - (MORADOR - próprio) - Atualiza item
DELETE /api/lost-found/:id           - (MORADOR - próprio, SINDICO) - Remove item
POST   /api/lost-found/:id/claim     - (MORADOR) - Reivindica item
```

### Endpoints Auxiliares
```
GET    /api/dashboard/stats          - (SINDICO) - Estatísticas do painel
GET    /api/notifications            - (MORADOR, SINDICO) - Notificações
PUT    /api/notifications/:id/read   - (MORADOR, SINDICO) - Marca como lida
```

### Códigos de Status HTTP
- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autenticado
- **403**: Não autorizado
- **404**: Não encontrado
- **409**: Conflito (ex: já leu o post)
- **422**: Entidade não processável
- **500**: Erro interno

### Paginação
```
GET /api/posts?page=1&limit=10&sort=publishedAt&order=desc
```

## 4. Estrutura de Componentes Frontend (React)

### Hierarquia de Componentes

```
src/
├── components/
│   └── dashboard/
│       ├── DashboardPage.tsx              # Página principal
│       ├── DashboardHeader.tsx            # Cabeçalho com navegação
│       ├── DashboardStats.tsx             # Estatísticas gerais
│       │
│       ├── communication/                 # Módulo A: Comunicação
│       │   ├── NoticeBoard.tsx           # Container do mural
│       │   ├── PostCard.tsx              # Card individual de post
│       │   ├── PostForm.tsx              # Formulário de criação/edição
│       │   ├── PostDetail.tsx            # Visualização detalhada
│       │   ├── PostAudienceSelector.tsx  # Seletor de audiência
│       │   ├── PostViewers.tsx           # Lista de quem leu
│       │   ├── DocumentLibrary.tsx       # Biblioteca de documentos
│       │   ├── DocumentCard.tsx          # Card de documento
│       │   ├── DocumentUpload.tsx        # Upload de documentos
│       │   └── MaintenanceCalendar.tsx   # Calendário de manutenções
│       │
│       ├── community/                     # Módulo B: Vida em Comunidade
│       │   ├── EventsSection.tsx         # Container de eventos
│       │   ├── EventCard.tsx             # Card de evento
│       │   ├── EventForm.tsx             # Formulário de evento
│       │   ├── EventDetail.tsx           # Detalhes do evento
│       │   ├── EventRSVP.tsx             # Componente de RSVP
│       │   ├── ClassifiedsSection.tsx    # Container de classificados
│       │   ├── ClassifiedCard.tsx        # Card de classificado
│       │   ├── ClassifiedForm.tsx        # Formulário de classificado
│       │   ├── ClassifiedDetail.tsx      # Detalhes do classificado
│       │   ├── ContactForm.tsx           # Formulário de contato
│       │   ├── LostFoundSection.tsx      # Container achados/perdidos
│       │   ├── LostFoundCard.tsx         # Card de item
│       │   └── LostFoundForm.tsx         # Formulário de item
│       │
│       └── shared/                        # Componentes compartilhados
│           ├── LoadingSpinner.tsx
│           ├── ErrorBoundary.tsx
│           ├── ConfirmDialog.tsx
│           ├── ImageUpload.tsx
│           ├── FileUpload.tsx
│           ├── DatePicker.tsx
│           ├── RichTextEditor.tsx
│           ├── PriorityBadge.tsx
│           ├── StatusBadge.tsx
│           ├── UserAvatar.tsx
│           └── EmptyState.tsx
│
├── hooks/                                 # Custom Hooks
│   ├── usePosts.ts
│   ├── useDocuments.ts
│   ├── useEvents.ts
│   ├── useClassifieds.ts
│   ├── useLostFound.ts
│   ├── useNotifications.ts
│   └── usePermissions.ts
│
├── services/                              # API Services
│   ├── api.ts                            # Cliente HTTP base
│   ├── postsService.ts
│   ├── documentsService.ts
│   ├── eventsService.ts
│   ├── classifiedsService.ts
│   └── lostFoundService.ts
│
├── types/                                 # TypeScript Types
│   ├── post.types.ts
│   ├── document.types.ts
│   ├── event.types.ts
│   ├── classified.types.ts
│   └── lostFound.types.ts
│
└── utils/                                 # Utilitários
    ├── dateUtils.ts
    ├── fileUtils.ts
    ├── permissionUtils.ts
    └── validationSchemas.ts
```

### Responsabilidades dos Componentes

#### DashboardPage.tsx
- Container principal do módulo
- Gerenciamento de estado global
- Navegação entre seções
- Layout responsivo

#### Componentes de Comunicação
- **NoticeBoard**: Lista e filtragem de posts
- **PostCard**: Exibição resumida com ações
- **PostForm**: Criação/edição com validação
- **DocumentLibrary**: Organização por categorias

#### Componentes de Comunidade
- **EventsSection**: Calendário e lista de eventos
- **ClassifiedsSection**: Grid de anúncios com filtros
- **LostFoundSection**: Lista de itens com status

### Custom Hooks

```typescript
// usePosts.ts
export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPosts = useCallback(async (filters?: PostFilters) => {
    // Implementação
  }, []);
  
  const createPost = useCallback(async (data: CreatePostData) => {
    // Implementação
  }, []);
  
  const markAsRead = useCallback(async (postId: string) => {
    // Implementação
  }, []);
  
  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    markAsRead
  };
};
```

### Padrões de Design

1. **Container/Presentational Pattern**: Separação de lógica e apresentação
2. **Custom Hooks**: Reutilização de lógica de estado
3. **Error Boundaries**: Tratamento de erros
4. **Lazy Loading**: Carregamento sob demanda
5. **Memoization**: Otimização de performance

### Fluxo de Dados

1. **Estado Local**: useState para componentes simples
2. **Context API**: Estado compartilhado entre componentes
3. **Custom Hooks**: Lógica de negócio reutilizável
4. **React Query**: Cache e sincronização de dados

## 5. Considerações de Lógica de Negócio

### Desafio 1: Confirmação de Leitura de Posts

**Problema**: Evitar registros duplicados de visualização e garantir rastreamento preciso.

**Solução**:
```typescript
// Backend - PostsController
async markAsRead(postId: string, userId: string) {
  // Verificar se já existe visualização
  const existingView = await this.prisma.postView.findUnique({
    where: {
      postId_userId: {
        postId,
        userId
      }
    }
  });
  
  if (existingView) {
    throw new ConflictException('Post já foi marcado como lido');
  }
  
  // Criar nova visualização
  return this.prisma.postView.create({
    data: {
      postId,
      userId,
      viewedAt: new Date()
    }
  });
}
```

### Desafio 2: Segmentação de Audiência

**Problema**: Determinar quais posts um usuário pode visualizar baseado na audiência definida.

**Solução**:
```typescript
// Backend - PostsService
async getVisiblePosts(userId: string, condominiumId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: { unit: true }
  });
  
  return this.prisma.post.findMany({
    where: {
      condominiumId,
      isActive: true,
      OR: [
        // Posts para todos
        {
          audiences: {
            some: {
              type: 'ALL'
            }
          }
        },
        // Posts para o bloco do usuário
        {
          audiences: {
            some: {
              type: 'BLOCK',
              blockNumber: user.unit?.blockNumber
            }
          }
        },
        // Posts para a unidade específica
        {
          audiences: {
            some: {
              type: 'UNIT',
              unitId: user.unitId
            }
          }
        },
        // Posts customizados para o usuário
        {
          audiences: {
            some: {
              type: 'CUSTOM',
              userId: userId
            }
          }
        }
      ]
    },
    include: {
      author: true,
      views: {
        where: { userId }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    }
  });
}
```

### Desafio 3: Controle de Capacidade em Eventos (RSVP)

**Problema**: Evitar que mais pessoas se inscrevam do que a capacidade máxima do evento.

**Solução**:
```typescript
// Backend - EventsService
async createRSVP(eventId: string, userId: string, guestCount: number) {
  return this.prisma.$transaction(async (tx) => {
    // Buscar evento com RSVPs atuais
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: {
        rsvps: {
          where: { attending: true }
        }
      }
    });
    
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }
    
    // Verificar capacidade
    if (event.maxAttendees) {
      const currentAttendees = event.rsvps.reduce(
        (sum, rsvp) => sum + rsvp.guestCount, 
        0
      );
      
      if (currentAttendees + guestCount > event.maxAttendees) {
        throw new BadRequestException('Capacidade máxima excedida');
      }
    }
    
    // Verificar se já existe RSVP
    const existingRSVP = await tx.eventRSVP.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      }
    });
    
    if (existingRSVP) {
      throw new ConflictException('RSVP já existe para este evento');
    }
    
    // Criar RSVP
    return tx.eventRSVP.create({
      data: {
        eventId,
        userId,
        guestCount,
        attending: true
      }
    });
  });
}
```

### Desafio 4: Contato Anônimo em Classificados

**Problema**: Permitir contato entre moradores sem expor dados pessoais.

**Solução**:
```typescript
// Backend - ClassifiedsService
async sendContactMessage(classifiedId: string, senderId: string, message: string) {
  const classified = await this.prisma.classifiedAd.findUnique({
    where: { id: classifiedId },
    include: { author: true }
  });
  
  if (!classified) {
    throw new NotFoundException('Classificado não encontrado');
  }
  
  // Enviar notificação por email sem expor dados
  await this.emailService.sendClassifiedContact({
    to: classified.author.email,
    subject: `Interesse no seu anúncio: ${classified.title}`,
    template: 'classified-contact',
    data: {
      classifiedTitle: classified.title,
      message: message,
      senderUnit: await this.getUserUnit(senderId),
      replyToken: this.generateReplyToken(classifiedId, senderId)
    }
  });
  
  return { success: true, message: 'Mensagem enviada com sucesso' };
}
```

### Desafio 5: Gerenciamento de Arquivos

**Problema**: Upload, armazenamento e controle de acesso a documentos.

**Solução**:
```typescript
// Backend - DocumentsService
async uploadDocument(
  file: Express.Multer.File,
  uploaderId: string,
  metadata: DocumentMetadata
) {
  // Validar tipo de arquivo
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException('Tipo de arquivo não permitido');
  }
  
  // Validar tamanho (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    throw new BadRequestException('Arquivo muito grande');
  }
  
  // Gerar nome único
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = `documents/${metadata.condominiumId}/${fileName}`;
  
  // Upload para storage (AWS S3, Google Cloud, etc.)
  await this.storageService.upload(file.buffer, filePath);
  
  // Salvar metadados no banco
  return this.prisma.document.create({
    data: {
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      fileName: file.originalname,
      filePath: filePath,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedById: uploaderId,
      condominiumId: metadata.condominiumId
    }
  });
}
```

### Desafio 6: Sistema de Notificações Inteligentes

**Problema**: Notificar usuários relevantes sem spam.

**Solução**:
```typescript
// Backend - NotificationsService
async createPostNotification(post: Post) {
  // Buscar usuários da audiência
  const targetUsers = await this.getPostAudienceUsers(post.id);
  
  // Criar notificações em lote
  const notifications = targetUsers.map(user => ({
    userId: user.id,
    type: 'NEW_POST',
    title: `Novo aviso: ${post.title}`,
    message: post.content.substring(0, 100) + '...',
    data: { postId: post.id },
    priority: post.priority === 'CRITICO' ? 'HIGH' : 'NORMAL'
  }));
  
  await this.prisma.notification.createMany({
    data: notifications
  });
  
  // Enviar push notifications para usuários com prioridade alta
  if (post.priority === 'CRITICO') {
    await this.pushService.sendBulk(
      targetUsers.map(user => user.pushToken).filter(Boolean),
      {
        title: `🚨 ${post.title}`,
        body: post.content.substring(0, 100)
      }
    );
  }
}
```

## 6. Otimizações de Performance

### Indexação do Banco de Dados

```sql
-- Índices para otimizar consultas frequentes
CREATE INDEX idx_posts_condominium_active ON posts(condominium_id, is_active, published_at DESC);
CREATE INDEX idx_post_views_user_post ON post_views(user_id, post_id);
CREATE INDEX idx_events_condominium_date ON events(condominium_id, start_date);
CREATE INDEX idx_classifieds_condominium_status ON classified_ads(condominium_id, status, created_at DESC);
CREATE INDEX idx_documents_condominium_category ON documents(condominium_id, category);
```

### Cache Strategy

```typescript
// Redis cache para dados frequentemente acessados
class CacheService {
  async getPostsCache(condominiumId: string): Promise<Post[] | null> {
    const cached = await this.redis.get(`posts:${condominiumId}`);
    return cached ? JSON.parse(cached) : null;
  }
  
  async setPostsCache(condominiumId: string, posts: Post[]): Promise<void> {
    await this.redis.setex(
      `posts:${condominiumId}`, 
      300, // 5 minutos
      JSON.stringify(posts)
    );
  }
  
  async invalidatePostsCache(condominiumId: string): Promise<void> {
    await this.redis.del(`posts:${condominiumId}`);
  }
}
```

## 7. Segurança e Permissões

### Middleware de Autorização

```typescript
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Verificar role
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso negado');
    }
    
    // Verificar pertencimento ao condomínio
    const condominiumId = request.params.condominiumId || request.body.condominiumId;
    if (condominiumId && user.condominiumId !== condominiumId) {
      throw new ForbiddenException('Acesso negado ao condomínio');
    }
    
    return true;
  }
}
```

### Validação de Dados

```typescript
// DTOs com validação
export class CreatePostDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;
  
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string;
  
  @IsEnum(PostPriority)
  priority: PostPriority;
  
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
  
  @ValidateNested({ each: true })
  @Type(() => PostAudienceDto)
  audiences: PostAudienceDto[];
}
```

## 8. Considerações de Implementação

### Fases de Desenvolvimento

1. **Fase 1**: Modelos de dados e API básica
2. **Fase 2**: Frontend básico (CRUD)
3. **Fase 3**: Funcionalidades avançadas (notificações, cache)
4. **Fase 4**: Otimizações e melhorias UX

### Testes

- **Unit Tests**: Lógica de negócio e serviços
- **Integration Tests**: APIs e banco de dados
- **E2E Tests**: Fluxos completos do usuário

### Monitoramento

- Logs estruturados
- Métricas de performance
- Alertas de erro
- Dashboard de uso

---

**Documento criado em**: Janeiro 2025  
**Versão**: 1.0  
**Autor**: Arquiteto de Software Full-Stack Sênior