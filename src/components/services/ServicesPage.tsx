import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar,
  Package,
  Users,
  UserCheck,
  Wrench,
  Plus,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Bell,
  Send
} from "lucide-react";

// Mock data para reservas de áreas comuns
const mockReservations = [
  {
    id: "1",
    area: "Salão de Festas",
    date: "2024-01-25",
    time: "19:00 - 23:00",
    status: "confirmed",
    resident: "Maria Silva - Apt 302",
    guests: 50,
    fee: "R$ 150,00"
  },
  {
    id: "2",
    area: "Churrasqueira",
    date: "2024-01-27",
    time: "16:00 - 20:00",
    status: "pending",
    resident: "João Santos - Apt 805",
    guests: 15,
    fee: "R$ 80,00"
  },
  {
    id: "3",
    area: "Quadra Esportiva",
    date: "2024-01-28",
    time: "08:00 - 12:00",
    status: "available",
    resident: "",
    guests: 0,
    fee: "R$ 60,00"
  }
];

// Mock data para encomendas
const mockPackages = [
  {
    id: "1",
    recipient: "Ana Costa - Apt 1205",
    sender: "Amazon",
    arrivalDate: "2024-01-20",
    arrivalTime: "14:30",
    status: "delivered",
    description: "Pacote pequeno",
    location: "Portaria Principal"
  },
  {
    id: "2",
    recipient: "Carlos Rodrigues - Apt 502",
    sender: "Mercado Livre",
    arrivalDate: "2024-01-21",
    arrivalTime: "09:15",
    status: "pending_pickup",
    description: "Caixa média",
    location: "Portaria Principal"
  },
  {
    id: "3",
    recipient: "Fernanda Lima - Apt 708",
    sender: "Correios",
    arrivalDate: "2024-01-21",
    arrivalTime: "16:45",
    status: "notified",
    description: "Envelope",
    location: "Portaria Principal"
  }
];

// Mock data para prestadores de serviço
const mockServiceProviders = [
  {
    id: "1",
    name: "João Silva - Eletricista",
    category: "Elétrica",
    phone: "(11) 99999-1111",
    rating: 4.8,
    services: "Instalações elétricas, reparos, manutenção",
    availability: "Segunda a Sexta",
    price: "R$ 80,00/hora"
  },
  {
    id: "2",
    name: "Maria Santos - Diarista",
    category: "Limpeza",
    phone: "(11) 99999-2222",
    rating: 4.9,
    services: "Limpeza residencial, organização",
    availability: "Todos os dias",
    price: "R$ 120,00/dia"
  },
  {
    id: "3",
    name: "Carlos Pereira - Encanador",
    category: "Hidráulica",
    phone: "(11) 99999-3333",
    rating: 4.7,
    services: "Reparos hidráulicos, desentupimento",
    availability: "24 horas",
    price: "R$ 100,00/hora"
  }
];

// Mock data para visitantes
const mockVisitors = [
  {
    id: "1",
    name: "Pedro Oliveira",
    document: "123.456.789-00",
    visiting: "Maria Silva - Apt 302",
    date: "2024-01-21",
    time: "14:00",
    status: "authorized",
    purpose: "Visita social"
  },
  {
    id: "2",
    name: "Ana Ferreira",
    document: "987.654.321-00",
    visiting: "João Santos - Apt 805",
    date: "2024-01-21",
    time: "16:30",
    status: "pending",
    purpose: "Entrega"
  },
  {
    id: "3",
    name: "Roberto Silva",
    document: "456.789.123-00",
    visiting: "Carlos Rodrigues - Apt 502",
    date: "2024-01-22",
    time: "10:00",
    status: "scheduled",
    purpose: "Manutenção"
  }
];

// Mock data para solicitações de serviço
const mockServiceRequests = [
  {
    id: "1",
    title: "Vazamento no banheiro",
    description: "Há um vazamento na torneira do banheiro principal",
    category: "Hidráulica",
    priority: "high",
    status: "open",
    resident: "Maria Silva - Apt 302",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20"
  },
  {
    id: "2",
    title: "Lâmpada queimada",
    description: "Lâmpada do corredor queimou",
    category: "Elétrica",
    priority: "medium",
    status: "in_progress",
    resident: "João Santos - Apt 805",
    createdAt: "2024-01-19",
    updatedAt: "2024-01-21"
  },
  {
    id: "3",
    title: "Porta com problema",
    description: "Fechadura da porta principal não está funcionando",
    category: "Manutenção Geral",
    priority: "medium",
    status: "resolved",
    resident: "Ana Costa - Apt 1205",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-20"
  }
];

export function ServicesPage() {
  const [activeTab, setActiveTab] = useState("reservations");
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [showNewVisitor, setShowNewVisitor] = useState(false);
  const [showNewRequest, setShowNewRequest] = useState(false);

  const getStatusBadge = (status: string, type: string) => {
    const statusConfig = {
      // Reservas
      confirmed: { label: "Confirmado", variant: "default" as const },
      pending: { label: "Pendente", variant: "secondary" as const },
      available: { label: "Disponível", variant: "outline" as const },
      
      // Encomendas
      delivered: { label: "Entregue", variant: "default" as const },
      pending_pickup: { label: "Aguardando Retirada", variant: "secondary" as const },
      notified: { label: "Morador Notificado", variant: "outline" as const },
      
      // Visitantes
      authorized: { label: "Autorizado", variant: "default" as const },
      scheduled: { label: "Agendado", variant: "secondary" as const },
      
      // Solicitações
      open: { label: "Aberto", variant: "destructive" as const },
      in_progress: { label: "Em Andamento", variant: "secondary" as const },
      resolved: { label: "Resolvido", variant: "default" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return config || { label: status, variant: "outline" as const };
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: "Alta", variant: "destructive" as const },
      medium: { label: "Média", variant: "secondary" as const },
      low: { label: "Baixa", variant: "outline" as const }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return config || { label: priority, variant: "outline" as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
          <p className="text-muted-foreground">Gestão completa de serviços do condomínio</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reservas Ativas</p>
                <p className="text-2xl font-bold text-primary">2</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Encomendas</p>
                <p className="text-2xl font-bold text-success">3</p>
              </div>
              <Package className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prestadores</p>
                <p className="text-2xl font-bold text-info">12</p>
              </div>
              <Users className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visitantes Hoje</p>
                <p className="text-2xl font-bold text-warning">5</p>
              </div>
              <UserCheck className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Solicitações</p>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
              <Wrench className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="reservations" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Reservas
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Encomendas
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Prestadores
          </TabsTrigger>
          <TabsTrigger value="visitors" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Visitantes
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Solicitações
          </TabsTrigger>
        </TabsList>

        {/* Reservas de Áreas Comuns */}
        <TabsContent value="reservations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Reservas de Áreas Comuns</h2>
            <Button 
              onClick={() => setShowNewReservation(!showNewReservation)}
              className="bg-gradient-to-r from-primary to-primary-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Reserva
            </Button>
          </div>

          {showNewReservation && (
            <Card>
              <CardHeader>
                <CardTitle>Nova Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Área</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salao">Salão de Festas</SelectItem>
                        <SelectItem value="churrasqueira">Churrasqueira</SelectItem>
                        <SelectItem value="quadra">Quadra Esportiva</SelectItem>
                        <SelectItem value="piscina">Área da Piscina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Horário Início</label>
                    <Input type="time" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Horário Fim</label>
                    <Input type="time" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Número de Convidados</label>
                    <Input type="number" placeholder="Ex: 20" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-success hover:bg-success/90">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Reserva
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewReservation(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockReservations.map((reservation) => {
              const statusBadge = getStatusBadge(reservation.status, "reservation");
              return (
                <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{reservation.area}</h3>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.time}</span>
                      </div>
                      {reservation.resident && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{reservation.resident}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Taxa: {reservation.fee}</span>
                      </div>
                    </div>
                    
                    {reservation.status === "available" && (
                      <Button className="w-full mt-3 bg-primary hover:bg-primary/90">
                        Reservar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Controle de Encomendas */}
        <TabsContent value="packages" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Controle de Encomendas</h2>
            <Button className="bg-gradient-to-r from-primary to-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Encomenda
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPackages.map((pkg) => {
              const statusBadge = getStatusBadge(pkg.status, "package");
              return (
                <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{pkg.sender}</h3>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{pkg.recipient}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{pkg.arrivalDate} às {pkg.arrivalTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{pkg.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{pkg.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      {pkg.status === "pending_pickup" && (
                        <Button size="sm" className="bg-warning hover:bg-warning/90">
                          <Bell className="h-3 w-3 mr-1" />
                          Notificar
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Cadastro de Prestadores */}
        <TabsContent value="providers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Prestadores de Serviço</h2>
            <Button className="bg-gradient-to-r from-primary to-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Prestador
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockServiceProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{provider.name}</h3>
                    <Badge variant="outline">{provider.category}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{provider.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span>{provider.rating}/5.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{provider.availability}</span>
                    </div>
                    <div className="font-medium text-primary">
                      {provider.price}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {provider.services}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Phone className="h-3 w-3 mr-1" />
                      Contatar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Registro de Visitantes */}
        <TabsContent value="visitors" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Registro de Visitantes</h2>
            <Button 
              onClick={() => setShowNewVisitor(!showNewVisitor)}
              className="bg-gradient-to-r from-primary to-primary-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Pré-autorizar Visitante
            </Button>
          </div>

          {showNewVisitor && (
            <Card>
              <CardHeader>
                <CardTitle>Pré-autorização de Visitante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome do Visitante</label>
                    <Input placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Documento (CPF)</label>
                    <Input placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data da Visita</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Horário Previsto</label>
                    <Input type="time" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Motivo da Visita</label>
                    <Input placeholder="Ex: Visita social, entrega, manutenção" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-success hover:bg-success/90">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Autorizar
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewVisitor(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockVisitors.map((visitor) => {
              const statusBadge = getStatusBadge(visitor.status, "visitor");
              return (
                <Card key={visitor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{visitor.name}</h3>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{visitor.visiting}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{visitor.date} às {visitor.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">CPF:</span>
                        <span>{visitor.document}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Motivo:</span>
                        <span>{visitor.purpose}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      {visitor.status === "pending" && (
                        <Button size="sm" className="bg-success hover:bg-success/90">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Autorizar
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Solicitação de Serviços */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Solicitações de Serviço</h2>
            <Button 
              onClick={() => setShowNewRequest(!showNewRequest)}
              className="bg-gradient-to-r from-primary to-primary-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Solicitação
            </Button>
          </div>

          {showNewRequest && (
            <Card>
              <CardHeader>
                <CardTitle>Nova Solicitação de Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <Input placeholder="Descreva brevemente o problema" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eletrica">Elétrica</SelectItem>
                        <SelectItem value="hidraulica">Hidráulica</SelectItem>
                        <SelectItem value="manutencao">Manutenção Geral</SelectItem>
                        <SelectItem value="limpeza">Limpeza</SelectItem>
                        <SelectItem value="seguranca">Segurança</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prioridade</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Descrição Detalhada</label>
                    <Textarea placeholder="Descreva o problema em detalhes..." rows={4} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-success hover:bg-success/90">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Solicitação
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewRequest(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockServiceRequests.map((request) => {
              const statusBadge = getStatusBadge(request.status, "request");
              const priorityBadge = getPriorityBadge(request.priority);
              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <div className="flex gap-1">
                        <Badge variant={priorityBadge.variant}>{priorityBadge.label}</Badge>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{request.resident}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Categoria:</span>
                        <span>{request.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Criado em {request.createdAt}</span>
                      </div>
                      <p className="text-muted-foreground text-xs mt-2">
                        {request.description}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalhes
                      </Button>
                      {request.status !== "resolved" && (
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <Edit className="h-3 w-3 mr-1" />
                          Atualizar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}