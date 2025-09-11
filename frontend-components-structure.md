# Estrutura de Componentes React - Painel do Condomínio

Este documento define a hierarquia e responsabilidades dos componentes React para o módulo Painel do Condomínio.

## Arquitetura Geral

```
src/
├── components/
│   └── community-panel/
│       ├── CommunityPanelPage.tsx          # Página principal
│       ├── dashboard/
│       │   ├── DashboardOverview.tsx       # Visão geral do painel
│       │   └── QuickActions.tsx            # Ações rápidas
│       ├── communication/
│       │   ├── NoticeBoard.tsx             # Mural de avisos
│       │   ├── PostCard.tsx                # Card individual de post
│       │   ├── PostForm.tsx                # Formulário de criação/edição
│       │   ├── PostDetails.tsx             # Detalhes completos do post
│       │   ├── DocumentLibrary.tsx         # Biblioteca de documentos
│       │   ├── DocumentCard.tsx            # Card de documento
│       │   ├── DocumentUpload.tsx          # Upload de documentos
│       │   └── MaintenanceCalendar.tsx     # Calendário de manutenções
│       ├── community/
│       │   ├── EventsSection.tsx           # Seção de eventos
│       │   ├── EventCard.tsx               # Card de evento
│       │   ├── EventForm.tsx               # Formulário de evento
│       │   ├── EventDetails.tsx            # Detalhes do evento
│       │   ├── RSVPButton.tsx              # Botão de confirmação
│       │   ├── ClassifiedsSection.tsx      # Seção de classificados
│       │   ├── ClassifiedCard.tsx          # Card de classificado
│       │   ├── ClassifiedForm.tsx          # Formulário de classificado
│       │   ├── LostAndFoundSection.tsx     # Achados e perdidos
│       │   ├── LostFoundCard.tsx           # Card de item perdido/achado
│       │   └── LostFoundForm.tsx           # Formulário de item
│       ├── shared/
│       │   ├── FilterBar.tsx               # Barra de filtros
│       │   ├── SearchInput.tsx             # Campo de busca
│       │   ├── PaginationControls.tsx      # Controles de paginação
│       │   ├── StatusBadge.tsx             # Badge de status
│       │   ├── PriorityIndicator.tsx       # Indicador de prioridade
│       │   ├── ImageUpload.tsx             # Upload de imagens
│       │   ├── ContactModal.tsx            # Modal de contato
│       │   └── ConfirmDialog.tsx           # Dialog de confirmação
│       └── hooks/
│           ├── usePosts.ts                 # Hook para posts
│           ├── useDocuments.ts             # Hook para documentos
│           ├── useEvents.ts                # Hook para eventos
│           ├── useClassifieds.ts           # Hook para classificados
│           ├── useLostAndFound.ts          # Hook para achados/perdidos
│           └── useCommunityPanel.ts        # Hook principal
```

---

## Componentes Principais

### 1. CommunityPanelPage.tsx
**Responsabilidade**: Página principal que orquestra todo o painel

```typescript
interface CommunityPanelPageProps {
  condominiumId: string;
  userRole: 'MORADOR' | 'SINDICO' | 'ADMIN';
}

// Estrutura do componente:
<CommunityPanelPage>
  <DashboardOverview />
  <Tabs>
    <Tab label="Mural">
      <NoticeBoard />
    </Tab>
    <Tab label="Documentos">
      <DocumentLibrary />
    </Tab>
    <Tab label="Eventos">
      <EventsSection />
    </Tab>
    <Tab label="Classificados">
      <ClassifiedsSection />
    </Tab>
    <Tab label="Achados e Perdidos">
      <LostAndFoundSection />
    </Tab>
  </Tabs>
</CommunityPanelPage>
```

### 2. DashboardOverview.tsx
**Responsabilidade**: Visão geral com estatísticas e ações rápidas

```typescript
interface DashboardData {
  unreadPosts: number;
  upcomingEvents: Event[];
  activeClassifieds: number;
  recentLostFound: LostFoundItem[];
}

// Estrutura:
<DashboardOverview>
  <StatisticsCards />
  <QuickActions />
  <RecentActivity />
</DashboardOverview>
```

---

## Módulo A: Comunicação

### 3. NoticeBoard.tsx
**Responsabilidade**: Mural principal de avisos

```typescript
interface NoticeBoardProps {
  posts: Post[];
  onCreatePost?: () => void;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
  userRole: UserRole;
}

// Estrutura:
<NoticeBoard>
  <FilterBar filters={postFilters} onFilterChange={handleFilterChange} />
  <SearchInput onSearch={handleSearch} />
  {userRole === 'SINDICO' && <Button onClick={onCreatePost}>Novo Aviso</Button>}
  <PostList>
    {posts.map(post => (
      <PostCard 
        key={post.id} 
        post={post} 
        onView={handlePostView}
        onEdit={onEditPost}
        onDelete={onDeletePost}
      />
    ))}
  </PostList>
  <PaginationControls />
</NoticeBoard>
```

### 4. PostCard.tsx
**Responsabilidade**: Card individual de post com ações

```typescript
interface PostCardProps {
  post: Post;
  isRead: boolean;
  onView: (postId: string) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  showActions: boolean;
}

// Estrutura:
<PostCard>
  <CardHeader>
    <PriorityIndicator priority={post.priority} />
    <Typography variant="h6">{post.title}</Typography>
    <StatusBadge status={isRead ? 'read' : 'unread'} />
  </CardHeader>
  <CardContent>
    <Typography>{post.content}</Typography>
    <PostMetadata author={post.author} createdAt={post.createdAt} />
  </CardContent>
  <CardActions>
    <Button onClick={() => onView(post.id)}>Ver Detalhes</Button>
    {showActions && (
      <>
        <IconButton onClick={() => onEdit?.(post)}><EditIcon /></IconButton>
        <IconButton onClick={() => onDelete?.(post.id)}><DeleteIcon /></IconButton>
      </>
    )}
  </CardActions>
</PostCard>
```

### 5. DocumentLibrary.tsx
**Responsabilidade**: Biblioteca de documentos com categorização

```typescript
interface DocumentLibraryProps {
  documents: Document[];
  onUpload?: (file: File, metadata: DocumentMetadata) => void;
  userRole: UserRole;
}

// Estrutura:
<DocumentLibrary>
  <FilterBar filters={documentFilters} />
  {userRole === 'SINDICO' && <DocumentUpload onUpload={onUpload} />}
  <DocumentGrid>
    {documents.map(doc => (
      <DocumentCard 
        key={doc.id} 
        document={doc} 
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    ))}
  </DocumentGrid>
</DocumentLibrary>
```

---

## Módulo B: Vida em Comunidade

### 6. EventsSection.tsx
**Responsabilidade**: Seção de eventos com calendário

```typescript
interface EventsSectionProps {
  events: Event[];
  onCreateEvent?: () => void;
  onRSVP: (eventId: string, attending: boolean) => void;
  userRole: UserRole;
}

// Estrutura:
<EventsSection>
  <EventsHeader>
    <Typography variant="h5">Eventos do Condomínio</Typography>
    {userRole === 'SINDICO' && <Button onClick={onCreateEvent}>Novo Evento</Button>}
  </EventsHeader>
  <EventsCalendarView events={events} />
  <EventsList>
    {events.map(event => (
      <EventCard 
        key={event.id} 
        event={event} 
        onRSVP={onRSVP}
        userRSVP={getUserRSVP(event.id)}
      />
    ))}
  </EventsList>
</EventsSection>
```

### 7. ClassifiedsSection.tsx
**Responsabilidade**: Seção de classificados internos

```typescript
interface ClassifiedsSectionProps {
  classifieds: ClassifiedAd[];
  onCreateAd: () => void;
  onContactSeller: (adId: string) => void;
}

// Estrutura:
<ClassifiedsSection>
  <ClassifiedsHeader>
    <Typography variant="h5">Classificados</Typography>
    <Button onClick={onCreateAd}>Novo Anúncio</Button>
  </ClassifiedsHeader>
  <FilterBar filters={classifiedFilters} />
  <ClassifiedsGrid>
    {classifieds.map(ad => (
      <ClassifiedCard 
        key={ad.id} 
        ad={ad} 
        onContact={onContactSeller}
        onEdit={handleEdit}
      />
    ))}
  </ClassifiedsGrid>
</ClassifiedsSection>
```

### 8. LostAndFoundSection.tsx
**Responsabilidade**: Seção de achados e perdidos

```typescript
interface LostAndFoundSectionProps {
  items: LostFoundItem[];
  onReportItem: () => void;
  onContactReporter: (itemId: string) => void;
}

// Estrutura:
<LostAndFoundSection>
  <SectionHeader>
    <Typography variant="h5">Achados e Perdidos</Typography>
    <Button onClick={onReportItem}>Reportar Item</Button>
  </SectionHeader>
  <StatusTabs>
    <Tab label="Perdidos" />
    <Tab label="Encontrados" />
    <Tab label="Devolvidos" />
  </StatusTabs>
  <ItemsList>
    {items.map(item => (
      <LostFoundCard 
        key={item.id} 
        item={item} 
        onContact={onContactReporter}
        onUpdateStatus={handleStatusUpdate}
      />
    ))}
  </ItemsList>
</LostAndFoundSection>
```

---

## Componentes Compartilhados

### 9. FilterBar.tsx
**Responsabilidade**: Barra de filtros reutilizável

```typescript
interface FilterBarProps {
  filters: FilterConfig[];
  activeFilters: Record<string, any>;
  onFilterChange: (filterKey: string, value: any) => void;
  onClearFilters: () => void;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'date' | 'range' | 'checkbox';
  options?: { value: any; label: string }[];
}
```

### 10. ContactModal.tsx
**Responsabilidade**: Modal para contato entre usuários

```typescript
interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  recipientType: 'seller' | 'reporter' | 'organizer';
  itemId: string;
  onSendMessage: (message: string, contactInfo: ContactInfo) => void;
}
```

---

## Hooks Customizados

### 11. useCommunityPanel.ts
**Responsabilidade**: Hook principal para gerenciar estado do painel

```typescript
interface UseCommunityPanelReturn {
  // Posts
  posts: Post[];
  createPost: (data: CreatePostData) => Promise<void>;
  updatePost: (id: string, data: UpdatePostData) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  markPostAsRead: (id: string) => Promise<void>;
  
  // Documents
  documents: Document[];
  uploadDocument: (file: File, metadata: DocumentMetadata) => Promise<void>;
  
  // Events
  events: Event[];
  createEvent: (data: CreateEventData) => Promise<void>;
  rsvpEvent: (eventId: string, attending: boolean) => Promise<void>;
  
  // Classifieds
  classifieds: ClassifiedAd[];
  createClassified: (data: CreateClassifiedData) => Promise<void>;
  
  // Lost & Found
  lostFoundItems: LostFoundItem[];
  reportItem: (data: ReportItemData) => Promise<void>;
  
  // Loading states
  loading: {
    posts: boolean;
    documents: boolean;
    events: boolean;
    classifieds: boolean;
    lostFound: boolean;
  };
  
  // Error handling
  error: string | null;
  clearError: () => void;
}
```

---

## Padrões de Design

### 1. Composição de Componentes
- Componentes pequenos e focados em uma responsabilidade
- Props bem definidas com TypeScript
- Reutilização através de composição

### 2. Gerenciamento de Estado
- Hooks customizados para lógica de negócio
- Context API para estado global quando necessário
- React Query para cache e sincronização de dados

### 3. Tratamento de Erros
- Error boundaries para capturar erros
- Estados de loading e error em cada seção
- Feedback visual para ações do usuário

### 4. Responsividade
- Design mobile-first
- Breakpoints consistentes
- Componentes adaptáveis

### 5. Acessibilidade
- ARIA labels apropriados
- Navegação por teclado
- Contraste adequado
- Screen reader friendly

---

## Fluxo de Dados

```
CommunityPanelPage
├── useCommunityPanel() → API calls
├── Context providers (Auth, Theme, etc.)
└── Child components receive data via props
    ├── NoticeBoard → usePosts()
    ├── DocumentLibrary → useDocuments()
    ├── EventsSection → useEvents()
    ├── ClassifiedsSection → useClassifieds()
    └── LostAndFoundSection → useLostAndFound()
```

Cada seção mantém seu próprio estado local para filtros, paginação e interações específicas, enquanto o estado global é gerenciado pelos hooks customizados que fazem as chamadas para a API.