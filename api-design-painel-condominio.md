# API Design - Painel do Condomínio

Este documento especifica todos os endpoints RESTful necessários para o módulo Painel do Condomínio.

## Autenticação e Autorização

- **MORADOR**: Usuário com role "MORADOR"
- **SINDICO**: Usuário com role "SINDICO"
- **ADMIN**: Usuário com role "ADMIN"
- Todos os endpoints requerem autenticação JWT
- Parâmetros de rota: `:condominiumId` sempre validado contra o condomínio do usuário

---

## Módulo A: Comunicação Centralizada

### 1. Posts do Mural Digital

#### Operações CRUD de Posts
```
POST /api/condominiums/:condominiumId/posts
Autorização: SINDICO, ADMIN
Descrição: Cria um novo post no mural
Body: { title, content, priority, audienceType, blockNumber?, unitId?, expiresAt? }
```

```
GET /api/condominiums/:condominiumId/posts
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Lista posts visíveis para o usuário (com paginação)
Query: ?page=1&limit=10&priority=URGENTE&unreadOnly=true
```

```
GET /api/condominiums/:condominiumId/posts/:postId
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Obtém detalhes de um post específico
```

```
PUT /api/condominiums/:condominiumId/posts/:postId
Autorização: SINDICO, ADMIN (apenas autor do post)
Descrição: Atualiza um post existente
Body: { title?, content?, priority?, expiresAt? }
```

```
DELETE /api/condominiums/:condominiumId/posts/:postId
Autorização: SINDICO, ADMIN (apenas autor do post)
Descrição: Remove um post (soft delete)
```

#### Operações de Visualização
```
POST /api/condominiums/:condominiumId/posts/:postId/view
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Marca um post como lido pelo usuário
```

```
GET /api/condominiums/:condominiumId/posts/:postId/views
Autorização: SINDICO, ADMIN
Descrição: Lista usuários que visualizaram o post
```

```
GET /api/condominiums/:condominiumId/posts/analytics
Autorização: SINDICO, ADMIN
Descrição: Estatísticas de visualização dos posts
```

### 2. Biblioteca de Documentos

```
POST /api/condominiums/:condominiumId/documents
Autorização: SINDICO, ADMIN
Descrição: Faz upload de um novo documento
Body: FormData com arquivo e metadados
```

```
GET /api/condominiums/:condominiumId/documents
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Lista documentos por categoria
Query: ?category=REGIMENTO_INTERNO&page=1&limit=10
```

```
GET /api/condominiums/:condominiumId/documents/:documentId
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Obtém metadados de um documento
```

```
GET /api/condominiums/:condominiumId/documents/:documentId/download
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Download do arquivo do documento
```

```
PUT /api/condominiums/:condominiumId/documents/:documentId
Autorização: SINDICO, ADMIN
Descrição: Atualiza metadados do documento
Body: { title?, description?, category?, isPublic? }
```

```
DELETE /api/condominiums/:condominiumId/documents/:documentId
Autorização: SINDICO, ADMIN
Descrição: Remove um documento
```

### 3. Calendário de Manutenções

```
POST /api/condominiums/:condominiumId/maintenance
Autorização: SINDICO, ADMIN
Descrição: Cria um evento de manutenção
Body: { title, description, startDate, endDate, location?, type }
```

```
GET /api/condominiums/:condominiumId/maintenance
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Lista manutenções programadas
Query: ?startDate=2024-01-01&endDate=2024-12-31&type=LIMPEZA
```

---

## Módulo B: Vida em Comunidade

### 4. Agenda de Eventos

#### Operações CRUD de Eventos
```
POST /api/condominiums/:condominiumId/events
Autorização: SINDICO, ADMIN
Descrição: Cria um novo evento
Body: { name, description, startDate, endDate?, location?, imageUrl?, maxAttendees? }
```

```
GET /api/condominiums/:condominiumId/events
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Lista eventos (futuros e passados)
Query: ?upcoming=true&page=1&limit=10
```

```
GET /api/condominiums/:condominiumId/events/:eventId
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Obtém detalhes de um evento específico
```

```
PUT /api/condominiums/:condominiumId/events/:eventId
Autorização: SINDICO, ADMIN (apenas organizador)
Descrição: Atualiza um evento
Body: { name?, description?, startDate?, endDate?, location?, maxAttendees? }
```

```
DELETE /api/condominiums/:condominiumId/events/:eventId
Autorização: SINDICO, ADMIN (apenas organizador)
Descrição: Cancela um evento
```

#### Sistema de RSVP
```
POST /api/condominiums/:condominiumId/events/:eventId/rsvp
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Confirma ou cancela presença no evento
Body: { isAttending, guestCount?, notes? }
```

```
GET /api/condominiums/:condominiumId/events/:eventId/rsvps
Autorização: SINDICO, ADMIN
Descrição: Lista confirmações de presença
```

```
GET /api/condominiums/:condominiumId/events/:eventId/attendees
Autorização: SINDICO, ADMIN
Descrição: Lista participantes confirmados
```

### 5. Classificados Internos

```
POST /api/condominiums/:condominiumId/classifieds
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Cria um novo classificado
Body: { title, description, price?, category, images?, contactInfo?, expiresAt? }
```

```
GET /api/condominiums/:condominiumId/classifieds
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Lista classificados ativos
Query: ?category=VENDA&priceMin=100&priceMax=1000&page=1&limit=10
```

```
GET /api/condominiums/:condominiumId/classifieds/:adId
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Obtém detalhes de um classificado
```

```
PUT /api/condominiums/:condominiumId/classifieds/:adId
Autorização: MORADOR, SINDICO, ADMIN (apenas autor)
Descrição: Atualiza um classificado
Body: { title?, description?, price?, status?, images? }
```

```
DELETE /api/condominiums/:condominiumId/classifieds/:adId
Autorização: MORADOR, SINDICO, ADMIN (apenas autor)
Descrição: Remove um classificado
```

```
POST /api/condominiums/:condominiumId/classifieds/:adId/contact
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Envia mensagem para o anunciante
Body: { message, contactEmail?, contactPhone? }
```

### 6. Achados e Perdidos

```
POST /api/condominiums/:condominiumId/lost-and-found
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Reporta item perdido ou encontrado
Body: { title, description, status, foundLocation?, imageUrl?, contactInfo? }
```

```
GET /api/condominiums/:condominiumId/lost-and-found
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Lista itens de achados e perdidos
Query: ?status=PERDIDO&page=1&limit=10
```

```
GET /api/condominiums/:condominiumId/lost-and-found/:itemId
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Obtém detalhes de um item
```

```
PUT /api/condominiums/:condominiumId/lost-and-found/:itemId
Autorização: MORADOR, SINDICO, ADMIN (apenas reporter)
Descrição: Atualiza status do item
Body: { status?, description?, resolvedAt? }
```

```
DELETE /api/condominiums/:condominiumId/lost-and-found/:itemId
Autorização: MORADOR, SINDICO, ADMIN (apenas reporter)
Descrição: Remove um item
```

```
POST /api/condominiums/:condominiumId/lost-and-found/:itemId/contact
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Entra em contato sobre o item
Body: { message, contactInfo }
```

---

## Endpoints Auxiliares

### Dashboard e Estatísticas
```
GET /api/condominiums/:condominiumId/dashboard
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Dados resumidos para o dashboard
Response: { unreadPosts, upcomingEvents, activeClassifieds, recentLostFound }
```

```
GET /api/condominiums/:condominiumId/analytics
Autorização: SINDICO, ADMIN
Descrição: Estatísticas gerais do painel
Response: { postEngagement, eventAttendance, classifiedsActivity }
```

### Notificações
```
GET /api/users/notifications
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Lista notificações do usuário
Query: ?unreadOnly=true&type=POST&page=1&limit=20
```

```
PUT /api/users/notifications/:notificationId/read
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Marca notificação como lida
```

### Upload de Arquivos
```
POST /api/upload/image
Autorização: MORADOR, SINDICO, ADMIN
Descrição: Upload de imagem para eventos/classificados
Body: FormData com arquivo de imagem
Response: { imageUrl }
```

---

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autenticado
- **403**: Não autorizado
- **404**: Recurso não encontrado
- **409**: Conflito (ex: já visualizou o post)
- **422**: Entidade não processável
- **500**: Erro interno do servidor

## Paginação Padrão

Todos os endpoints de listagem suportam:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máximo: 100)
- `sort`: Campo de ordenação
- `order`: Direção (asc/desc)

Response padrão:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```