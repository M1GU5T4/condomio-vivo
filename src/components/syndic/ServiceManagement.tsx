import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Calendar, 
  CheckCircle, 
  Clock, 
  User,
  MapPin,
  Phone,
  Star,
  Plus,
  Filter
} from "lucide-react";

export function ServiceManagement() {
  const pendingReservations = [
    {
      id: 1,
      area: "Salão de Festas",
      resident: "Maria Silva - Apt 1205",
      date: "2024-01-25",
      time: "19:00 - 23:00",
      guests: 50,
      status: "pending",
      fee: "R$ 150,00"
    },
    {
      id: 2,
      area: "Churrasqueira",
      resident: "João Santos - Apt 807",
      date: "2024-01-27",
      time: "16:00 - 20:00",
      guests: 15,
      status: "pending",
      fee: "R$ 80,00"
    },
    {
      id: 3,
      area: "Quadra Esportiva",
      resident: "Carlos Rodrigues - Apt 502",
      date: "2024-01-28",
      time: "08:00 - 12:00",
      guests: 8,
      status: "approved",
      fee: "R$ 60,00"
    }
  ];

  const serviceProviders = [
    {
      id: 1,
      name: "Empresa de Limpeza Premium",
      category: "Limpeza",
      contact: "(11) 99999-9999",
      rating: 4.8,
      activeContracts: 2,
      status: "active",
      lastService: "2024-01-15"
    },
    {
      id: 2,
      name: "Segurança Total",
      category: "Segurança",
      contact: "(11) 88888-8888",
      rating: 4.9,
      activeContracts: 1,
      status: "active",
      lastService: "Ongoing"
    },
    {
      id: 3,
      name: "Manutenção Express",
      category: "Manutenção",
      contact: "(11) 77777-7777",
      rating: 4.5,
      activeContracts: 3,
      status: "active",
      lastService: "2024-01-12"
    },
    {
      id: 4,
      name: "Verde Jardins",
      category: "Jardinagem",
      contact: "(11) 66666-6666",
      rating: 4.3,
      activeContracts: 1,
      status: "inactive",
      lastService: "2023-12-20"
    }
  ];

  const visitors = [
    {
      id: 1,
      name: "Pedro Silva",
      visiting: "Apt 1205",
      purpose: "Serviço de Internet",
      scheduledTime: "2024-01-23 14:00",
      status: "scheduled",
      document: "123.456.789-00"
    },
    {
      id: 2,
      name: "Ana Técnica",
      visiting: "Apt 807",
      purpose: "Reparo Ar Condicionado",
      scheduledTime: "2024-01-23 16:30",
      status: "in_building",
      document: "987.654.321-00"
    },
    {
      id: 3,
      name: "Carlos Entregador",
      visiting: "Apt 502",
      purpose: "Entrega de Móveis",
      scheduledTime: "2024-01-24 09:00",
      status: "scheduled",
      document: "456.789.123-00"
    }
  ];

  const getReservationStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-success/10 text-success border-success/20";
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "rejected": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getVisitorStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-info/10 text-info border-info/20";
      case "in_building": return "bg-success/10 text-success border-success/20";
      case "completed": return "bg-muted/10 text-muted-foreground border-muted/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success/10 text-success border-success/20";
      case "inactive": return "bg-muted/10 text-muted-foreground border-muted/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Serviços</h1>
          <p className="text-muted-foreground">Reservas, prestadores e controle de acesso</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-gradient-to-r from-primary to-primary-dark">
            <Plus className="h-4 w-4 mr-2" />
            Novo Prestador
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reservas Pendentes</p>
                <p className="text-2xl font-bold text-primary">5</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prestadores Ativos</p>
                <p className="text-2xl font-bold text-success">12</p>
              </div>
              <Settings className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visitantes Hoje</p>
                <p className="text-2xl font-bold text-info">8</p>
              </div>
              <User className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Áreas Ocupadas</p>
                <p className="text-2xl font-bold text-warning">3/8</p>
              </div>
              <MapPin className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aprovação de Reservas
            </CardTitle>
            <CardDescription>Solicitações pendentes de aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{reservation.area}</h3>
                      <p className="text-sm text-muted-foreground">{reservation.resident}</p>
                    </div>
                    <Badge className={getReservationStatusColor(reservation.status)}>
                      {reservation.status === "pending" ? "Pendente" : 
                       reservation.status === "approved" ? "Aprovado" : "Rejeitado"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Data:</span>
                      <div className="font-medium">{reservation.date}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Horário:</span>
                      <div className="font-medium">{reservation.time}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Convidados:</span>
                      <div className="font-medium">{reservation.guests}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxa:</span>
                      <div className="font-medium">{reservation.fee}</div>
                    </div>
                  </div>
                  
                  {reservation.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-success hover:bg-success/90">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aprovar
                      </Button>
                      <Button size="sm" variant="destructive">
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Providers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Prestadores de Serviço
            </CardTitle>
            <CardDescription>Empresas terceirizadas cadastradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceProviders.map((provider) => (
                <div key={provider.id} className="p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.category}</p>
                    </div>
                    <Badge className={getProviderStatusColor(provider.status)}>
                      {provider.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{provider.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-warning fill-warning" />
                      <span>{provider.rating}/5.0</span>
                      <span className="text-muted-foreground">• {provider.activeContracts} contratos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>Último serviço: {provider.lastService}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      Contratos
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visitor Registry */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Registro de Visitantes
              </CardTitle>
              <CardDescription>Controle de acesso e agendamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitors.map((visitor) => (
                  <div key={visitor.id} className="p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{visitor.name}</h3>
                        <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                      </div>
                      <Badge className={getVisitorStatusColor(visitor.status)}>
                        {visitor.status === "scheduled" ? "Agendado" : 
                         visitor.status === "in_building" ? "No Prédio" : "Finalizado"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Visitando:</span>
                        <div className="font-medium">{visitor.visiting}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Agendado para:</span>
                        <div className="font-medium">{visitor.scheduledTime}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Documento:</span>
                        <div className="font-medium">{visitor.document}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      {visitor.status === "scheduled" && (
                        <Button size="sm" className="bg-success hover:bg-success/90">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Autorizar Entrada
                        </Button>
                      )}
                      {visitor.status === "in_building" && (
                        <Button size="sm" variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Registrar Saída
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}