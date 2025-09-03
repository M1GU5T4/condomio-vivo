import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketCard } from "@/components/dashboard/TicketCard";
import { 
  Clipboard, 
  Filter, 
  Search, 
  UserCheck, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp
} from "lucide-react";

export function TicketManagement() {
  const tickets = [
    {
      id: "1",
      title: "Vazamento no elevador social",
      description: "Água vazando no teto do elevador, necessário reparo urgente",
      status: "open" as const,
      priority: "high" as const,
      author: "Maria Silva",
      apartment: "Apt 1205",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      commentsCount: 3
    },
    {
      id: "2", 
      title: "Portão da garagem com defeito",
      description: "Portão não está abrindo completamente, moradores presos",
      status: "in-progress" as const,
      priority: "medium" as const,
      author: "João Santos",
      apartment: "Apt 807",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      commentsCount: 1
    },
    {
      id: "3",
      title: "Lâmpada queimada no hall",
      description: "Lâmpada do 3º andar queimou",
      status: "resolved" as const,
      priority: "low" as const,
      author: "Ana Costa",
      apartment: "Apt 304",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      commentsCount: 2
    },
    {
      id: "4",
      title: "Ruído excessivo do apartamento 501",
      description: "Vizinhos relatam música alta após 22h",
      status: "open" as const,
      priority: "medium" as const,
      author: "Carlos Rodrigues",
      apartment: "Apt 502",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      commentsCount: 0
    }
  ];

  const ticketStats = [
    { label: "Total", count: 47, color: "text-foreground", bgColor: "bg-accent/30" },
    { label: "Em Aberto", count: 8, color: "text-warning", bgColor: "bg-warning/10" },
    { label: "Em Progresso", count: 12, color: "text-info", bgColor: "bg-info/10" },
    { label: "Resolvidos", count: 27, color: "text-success", bgColor: "bg-success/10" }
  ];

  const assignedStaff = [
    { name: "João Zelador", department: "Manutenção", tickets: 5, avatar: "JZ" },
    { name: "Maria Portaria", department: "Segurança", tickets: 3, avatar: "MP" },
    { name: "Pedro Técnico", department: "Elétrica", tickets: 4, avatar: "PT" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Chamados</h1>
          <p className="text-muted-foreground">Controle total sobre ocorrências e solicitações</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {ticketStats.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-opacity-20`}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clipboard className="h-5 w-5" />
                Chamados Ativos
              </CardTitle>
              <CardDescription>
                Lista detalhada de todas as ocorrências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="relative">
                    <TicketCard ticket={ticket} />
                    {ticket.status === "open" && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button size="sm" variant="outline" className="h-8">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Atribuir
                        </Button>
                        <Button size="sm" className="h-8">
                          <Clock className="h-3 w-3 mr-1" />
                          Iniciar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Staff Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipe Responsável
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignedStaff.map((staff, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{staff.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{staff.name}</div>
                      <div className="text-xs text-muted-foreground">{staff.department}</div>
                    </div>
                    <Badge variant="secondary">{staff.tickets}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Métricas de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">2.3h</div>
                  <div className="text-xs text-muted-foreground">Tempo Médio de Resposta</div>
                </div>
                
                <div className="text-center p-4 bg-info/10 rounded-lg">
                  <div className="text-2xl font-bold text-info">94%</div>
                  <div className="text-xs text-muted-foreground">Taxa de Resolução</div>
                </div>
                
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">4.8</div>
                  <div className="text-xs text-muted-foreground">Avaliação Média</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Criar Chamado Urgente
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolver em Lote
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Atribuir Automaticamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}