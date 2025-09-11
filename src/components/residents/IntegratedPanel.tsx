import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Calendar, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MapPin,
  Users,
  Wrench
} from 'lucide-react';
import { useResidents, Ticket, Reservation, Document } from '@/hooks/useResidents';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IntegratedPanelProps {
  className?: string;
}

const IntegratedPanel: React.FC<IntegratedPanelProps> = ({ className }) => {
  const {
    tickets,
    reservations,
    documents,
    downloadDocument,
    createTicket,
    createReservation
  } = useResidents();

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    priority: 'medium'
  });
  
  const [newReservation, setNewReservation] = useState({
    area: '',
    date: '',
    startTime: '',
    endTime: '',
    guests: 0
  });

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatDateTime = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Aberto</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800"><Wrench className="h-3 w-3 mr-1" />Em Andamento</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Resolvido</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">Fechado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getReservationStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confirmada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Baixa</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const handleDownloadDocument = async (documentId: string) => {
    try {
      await downloadDocument(documentId);
      toast.success('Documento baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao baixar documento');
    }
  };

  const handleCreateTicket = async () => {
    try {
      if (!newTicket.title || !newTicket.description) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      await createTicket(newTicket);
      setNewTicket({ title: '', description: '', category: 'maintenance', priority: 'medium' });
      setTicketDialogOpen(false);
      toast.success('Chamado criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar chamado');
    }
  };

  const handleCreateReservation = async () => {
    try {
      if (!newReservation.area || !newReservation.date || !newReservation.startTime || !newReservation.endTime) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      await createReservation(newReservation);
      setNewReservation({ area: '', date: '', startTime: '', endTime: '', guests: 0 });
      setReservationDialogOpen(false);
      toast.success('Reserva criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar reserva');
    }
  };

  const openTickets = tickets.filter(ticket => ticket.status !== 'closed');
  const recentReservations = reservations.slice(0, 3);
  const recentDocuments = documents.slice(0, 3);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumo do Painel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{openTickets.length}</p>
                <p className="text-sm text-gray-600">Chamados abertos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{reservations.length}</p>
                <p className="text-sm text-gray-600">Reservas feitas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{documents.length}</p>
                <p className="text-sm text-gray-600">Documentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
                <p className="text-sm text-gray-600">Chamados resolvidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Chamados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Histórico de Chamados
            </CardTitle>
            <CardDescription>Acompanhe o status dos seus chamados</CardDescription>
          </div>
          <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Novo Chamado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Chamado</DialogTitle>
                <DialogDescription>
                  Descreva o problema ou solicitação que você gostaria de reportar
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <input 
                    className="w-full p-2 border rounded-md"
                    placeholder="Resumo do problema"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="maintenance">Manutenção</option>
                    <option value="cleaning">Limpeza</option>
                    <option value="security">Segurança</option>
                    <option value="noise">Ruído</option>
                    <option value="other">Outros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridade</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea 
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Descreva detalhadamente o problema..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={handleCreateTicket}>
                    Criar Chamado
                  </Button>
                  <Button variant="outline" onClick={() => setTicketDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum chamado encontrado</p>
              <p className="text-sm">Clique em "Novo Chamado" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{ticket.title}</h4>
                      {getTicketStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>#{ticket.id}</span>
                      <span>Criado em: {formatDate(ticket.createdAt)}</span>
                      <span className="capitalize">{ticket.category}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              ))}
              {tickets.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    Ver todos os chamados
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Central de Reservas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Central de Reservas
            </CardTitle>
            <CardDescription>Suas reservas de áreas comuns</CardDescription>
          </div>
          <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Nova Reserva
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fazer Nova Reserva</DialogTitle>
                <DialogDescription>
                  Reserve uma área comum do condomínio
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Área</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newReservation.area}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, area: e.target.value }))}
                  >
                    <option value="">Selecione uma área</option>
                    <option value="Salão de Festas">Salão de Festas</option>
                    <option value="Churrasqueira">Churrasqueira</option>
                    <option value="Piscina">Piscina</option>
                    <option value="Quadra">Quadra</option>
                    <option value="Playground">Playground</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data</label>
                    <input 
                      type="date"
                      className="w-full p-2 border rounded-md"
                      value={newReservation.date}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Convidados</label>
                    <input 
                      type="number"
                      className="w-full p-2 border rounded-md"
                      placeholder="0"
                      value={newReservation.guests}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, guests: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hora Início</label>
                    <input 
                      type="time"
                      className="w-full p-2 border rounded-md"
                      value={newReservation.startTime}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hora Fim</label>
                    <input 
                      type="time"
                      className="w-full p-2 border rounded-md"
                      value={newReservation.endTime}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={handleCreateReservation}>
                    Fazer Reserva
                  </Button>
                  <Button variant="outline" onClick={() => setReservationDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma reserva encontrada</p>
              <p className="text-sm">Clique em "Nova Reserva" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{reservation.area}</h4>
                      {getReservationStatusBadge(reservation.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span><MapPin className="h-3 w-3 inline mr-1" />{formatDate(reservation.date)}</span>
                      <span><Clock className="h-3 w-3 inline mr-1" />{reservation.startTime} - {reservation.endTime}</span>
                      <span><Users className="h-3 w-3 inline mr-1" />{reservation.guests} convidados</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              ))}
              {reservations.length > 3 && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    Ver todas as reservas
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentos Individualizados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Individualizados
          </CardTitle>
          <CardDescription>Acesse documentos específicos da sua unidade</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento disponível</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{document.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Tipo: {document.type}</span>
                      <span>Data: {formatDate(document.createdAt)}</span>
                      <span>Tamanho: {document.size}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedDocument(document);
                        setDocumentDialogOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadDocument(document.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
              ))}
              {documents.length > 3 && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    Ver todos os documentos
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para visualizar documento */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Documento</DialogTitle>
            <DialogDescription>
              Informações completas do documento selecionado
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <p className="text-sm">{selectedDocument.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <p className="text-sm">{selectedDocument.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Criação</label>
                  <p className="text-sm">{formatDate(selectedDocument.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tamanho</label>
                  <p className="text-sm">{selectedDocument.size}</p>
                </div>
              </div>
              {selectedDocument.description && (
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <p className="text-sm">{selectedDocument.description}</p>
                </div>
              )}
              <Separator />
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={() => handleDownloadDocument(selectedDocument.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Documento
                </Button>
                <Button variant="outline" onClick={() => setDocumentDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegratedPanel;