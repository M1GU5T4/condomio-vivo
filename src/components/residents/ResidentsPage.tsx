import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Home, 
  CreditCard, 
  FileText, 
  Bell, 
  Car, 
  Heart, 
  Download, 
  Eye, 
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  History,
  LayoutDashboard
} from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  color: string;
}

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
}

interface Bill {
  id: string;
  month: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  type: string;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  description: string;
  method: string;
}

interface Reservation {
  id: string;
  area: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  date: string;
  priority: 'low' | 'medium' | 'high';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'package' | 'announcement' | 'financial' | 'maintenance';
  date: string;
  read: boolean;
}

export const ResidentsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', plate: 'ABC-1234', model: 'Honda Civic', color: 'Preto' },
    { id: '2', plate: 'XYZ-5678', model: 'Toyota Corolla', color: 'Branco' }
  ]);
  const [pets, setPets] = useState<Pet[]>([
    { id: '1', name: 'Rex', type: 'Cão', breed: 'Golden Retriever' }
  ]);

  // Mock data
  const residentData = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    apartment: '101',
    block: 'A',
    cpf: '123.456.789-00',
    emergencyContact: '(11) 88888-8888'
  };

  const bills: Bill[] = [
    { id: '1', month: 'Janeiro 2024', amount: 450.00, dueDate: '2024-01-10', status: 'paid', type: 'Condomínio' },
    { id: '2', month: 'Fevereiro 2024', amount: 450.00, dueDate: '2024-02-10', status: 'paid', type: 'Condomínio' },
    { id: '3', month: 'Março 2024', amount: 450.00, dueDate: '2024-03-10', status: 'pending', type: 'Condomínio' },
    { id: '4', month: 'Janeiro 2024', amount: 85.00, dueDate: '2024-01-15', status: 'overdue', type: 'Taxa Extra' }
  ];

  const payments: Payment[] = [
    { id: '1', date: '2024-01-08', amount: 450.00, description: 'Condomínio - Janeiro 2024', method: 'PIX' },
    { id: '2', date: '2024-02-07', amount: 450.00, description: 'Condomínio - Fevereiro 2024', method: 'Boleto' },
    { id: '3', date: '2023-12-10', amount: 450.00, description: 'Condomínio - Dezembro 2023', method: 'Débito Automático' }
  ];

  const reservations: Reservation[] = [
    { id: '1', area: 'Salão de Festas', date: '2024-03-15', time: '19:00-23:00', status: 'confirmed' },
    { id: '2', area: 'Churrasqueira', date: '2024-03-22', time: '12:00-18:00', status: 'pending' },
    { id: '3', area: 'Quadra de Tênis', date: '2024-02-28', time: '08:00-10:00', status: 'confirmed' }
  ];

  const tickets: Ticket[] = [
    { id: '1', title: 'Vazamento no banheiro', category: 'Manutenção', status: 'resolved', date: '2024-02-15', priority: 'high' },
    { id: '2', title: 'Problema na fechadura', category: 'Segurança', status: 'in_progress', date: '2024-03-01', priority: 'medium' },
    { id: '3', title: 'Solicitação de segunda via de cartão', category: 'Administrativo', status: 'open', date: '2024-03-05', priority: 'low' }
  ];

  const notifications: Notification[] = [
    { id: '1', title: 'Encomenda Chegou', message: 'Sua encomenda da Amazon chegou na portaria', type: 'package', date: '2024-03-10 14:30', read: false },
    { id: '2', title: 'Comunicado Importante', message: 'Manutenção programada do elevador para amanhã', type: 'announcement', date: '2024-03-09 10:00', read: true },
    { id: '3', title: 'Boleto Disponível', message: 'Boleto de março já está disponível', type: 'financial', date: '2024-03-01 09:00', read: true },
    { id: '4', title: 'Manutenção Concluída', message: 'Reparo no vazamento foi concluído', type: 'maintenance', date: '2024-02-28 16:45', read: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': case 'confirmed': case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': case 'cancelled': return 'bg-red-100 text-red-800';
      case 'open': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'package': return <Package className="h-4 w-4" />;
      case 'announcement': return <Bell className="h-4 w-4" />;
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'maintenance': return <AlertCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Área do Morador</h1>
          <p className="text-gray-600 mt-1">Gerencie seu perfil e acompanhe suas informações</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            Apartamento {residentData.apartment} - Bloco {residentData.block}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Painel
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Perfil e Dados da Unidade */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Perfil Pessoal */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Perfil Pessoal</CardTitle>
                  <CardDescription>Gerencie suas informações pessoais</CardDescription>
                </div>
                <Button 
                  variant={editMode ? "default" : "outline"}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Salvar' : 'Editar'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-lg">{residentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {editMode && (
                    <Button variant="outline" size="sm">
                      Alterar Foto
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      defaultValue={residentData.name} 
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue={residentData.email} 
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      defaultValue={residentData.phone} 
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency">Contato de Emergência</Label>
                    <Input 
                      id="emergency" 
                      defaultValue={residentData.emergencyContact} 
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações da Unidade */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Unidade</CardTitle>
                <CardDescription>Dados do seu apartamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Apartamento:</span>
                  <Badge variant="secondary">{residentData.apartment}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bloco:</span>
                  <Badge variant="secondary">{residentData.block}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CPF:</span>
                  <span className="text-sm text-gray-600">{residentData.cpf}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Status da Unidade</h4>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Veículos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Veículos Cadastrados
                </CardTitle>
                <CardDescription>Gerencie os veículos da sua unidade</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Adicionar Veículo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Veículo</DialogTitle>
                    <DialogDescription>
                      Adicione um novo veículo à sua unidade
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="plate">Placa</Label>
                      <Input id="plate" placeholder="ABC-1234" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Modelo</Label>
                      <Input id="model" placeholder="Honda Civic" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Cor</Label>
                      <Input id="color" placeholder="Preto" />
                    </div>
                    <Button className="w-full">Cadastrar Veículo</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{vehicle.plate}</Badge>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                    <p className="font-medium">{vehicle.model}</p>
                    <p className="text-sm text-gray-600">{vehicle.color}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Animais de Estimação */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Animais de Estimação
                </CardTitle>
                <CardDescription>Cadastre seus pets</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Adicionar Pet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Animal de Estimação</DialogTitle>
                    <DialogDescription>
                      Adicione um novo pet à sua unidade
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="petName">Nome</Label>
                      <Input id="petName" placeholder="Rex" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="petType">Tipo</Label>
                      <Input id="petType" placeholder="Cão" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="breed">Raça</Label>
                      <Input id="breed" placeholder="Golden Retriever" />
                    </div>
                    <Button className="w-full">Cadastrar Pet</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{pet.name}</h4>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                    <p className="text-sm text-gray-600">{pet.type} - {pet.breed}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestão Financeira */}
        <TabsContent value="financial" className="space-y-6">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Boletos Pendentes</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  R$ {bills.filter(b => b.status === 'pending' || b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {bills.filter(b => b.status === 'pending' || b.status === 'overdue').length} boleto(s) pendente(s)
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos Este Ano</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {payments.filter(p => p.date.includes('2024')).reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {payments.filter(p => p.date.includes('2024')).length} pagamento(s) realizados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">10/03</div>
                <p className="text-xs text-muted-foreground">
                  Condomínio - R$ 450,00
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Boletos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Boletos e 2ª Via</CardTitle>
                <CardDescription>Acesse seus boletos atuais e anteriores</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{bill.type} - {bill.month}</p>
                      <p className="text-sm text-gray-600">Vencimento: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}</p>
                      <p className="text-lg font-bold">R$ {bill.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status === 'paid' ? 'Pago' : bill.status === 'pending' ? 'Pendente' : 'Vencido'}
                      </Badge>
                      {bill.status !== 'paid' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Pagamentos
              </CardTitle>
              <CardDescription>Detalhamento dos pagamentos realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-600">Data: {new Date(payment.date).toLocaleDateString('pt-BR')}</p>
                      <p className="text-sm text-gray-600">Método: {payment.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">R$ {payment.amount.toFixed(2)}</p>
                      <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Painel Integrado */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chamados */}
            <Card>
              <CardHeader>
                <CardTitle>Meus Chamados</CardTitle>
                <CardDescription>Histórico de solicitações abertas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{ticket.title}</h4>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status === 'open' ? 'Aberto' : 
                           ticket.status === 'in_progress' ? 'Em Andamento' : 
                           ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{ticket.category}</span>
                        <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                          {ticket.priority === 'high' ? 'Alta' : 
                           ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{new Date(ticket.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reservas */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Minhas Reservas</CardTitle>
                  <CardDescription>Áreas comuns reservadas</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Nova Reserva
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{reservation.area}</h4>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status === 'confirmed' ? 'Confirmada' : 
                           reservation.status === 'pending' ? 'Pendente' : 'Cancelada'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(reservation.date).toLocaleDateString('pt-BR')} - {reservation.time}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Atalhos Rápidos */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso direto às principais funcionalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Nova Reserva</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <AlertCircle className="h-6 w-6" />
                  <span className="text-sm">Abrir Chamado</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Download className="h-6 w-6" />
                  <span className="text-sm">Baixar Boleto</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Documentos</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Individualizados</CardTitle>
              <CardDescription>Acesse documentos específicos da sua unidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Extrato Financeiro</h4>
                  </div>
                  <p className="text-sm text-gray-600">Março 2024</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <h4 className="font-medium">Notificações</h4>
                  </div>
                  <p className="text-sm text-gray-600">Comunicados recebidos</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Comprovantes</h4>
                  </div>
                  <p className="text-sm text-gray-600">Pagamentos realizados</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Regulamento</h4>
                  </div>
                  <p className="text-sm text-gray-600">Normas do condomínio</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-indigo-600" />
                    <h4 className="font-medium">Cadastro</h4>
                  </div>
                  <p className="text-sm text-gray-600">Dados da unidade</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-red-600" />
                    <h4 className="font-medium">Veículos</h4>
                  </div>
                  <p className="text-sm text-gray-600">Cadastro de veículos</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Central de Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Central de Notificações</CardTitle>
                <CardDescription>Acompanhe comunicados e avisos personalizados</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Marcar todas como lidas
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`border rounded-lg p-4 space-y-2 ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'package' ? 'bg-orange-100 text-orange-600' :
                          notification.type === 'announcement' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'financial' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.date).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Notificação */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription>Personalize como você recebe as notificações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Encomendas</h4>
                    <p className="text-sm text-gray-600">Avisos de chegada de encomendas</p>
                  </div>
                  <Button variant="outline" size="sm">Ativo</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Comunicados</h4>
                    <p className="text-sm text-gray-600">Avisos gerais da administração</p>
                  </div>
                  <Button variant="outline" size="sm">Ativo</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Financeiro</h4>
                    <p className="text-sm text-gray-600">Lembretes de vencimento e boletos</p>
                  </div>
                  <Button variant="outline" size="sm">Ativo</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Manutenção</h4>
                    <p className="text-sm text-gray-600">Atualizações sobre chamados</p>
                  </div>
                  <Button variant="outline" size="sm">Ativo</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};