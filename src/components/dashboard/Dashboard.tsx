import { StatsCard } from "./StatsCard";
import { TicketCard } from "./TicketCard";
import { RecentActivity } from "./RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Wrench, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Users,
  Calendar,
  Plus
} from "lucide-react";

const mockTickets = [
  {
    id: "1",
    title: "Problema no elevador social",
    description: "O elevador está fazendo ruídos estranhos e às vezes trava entre os andares. Precisa de manutenção urgente.",
    status: "open" as const,
    priority: "high" as const,
    author: "Carlos Santos",
    apartment: "Apt. 805",
    createdAt: "2h atrás",
    commentsCount: 3
  },
  {
    id: "2",
    title: "Vazamento na área da piscina",
    description: "Há água acumulada próximo aos vestiários da piscina.",
    status: "in-progress" as const,
    priority: "medium" as const,
    author: "Ana Costa",
    apartment: "Apt. 302",
    createdAt: "1 dia atrás",
    commentsCount: 1
  },
  {
    id: "3",
    title: "Lâmpada queimada na garagem",
    description: "Lâmpada do setor B da garagem precisa ser substituída.",
    status: "resolved" as const,
    priority: "low" as const,
    author: "João Silva",
    apartment: "Apt. 1201",
    createdAt: "3 dias atrás",
    commentsCount: 0
  }
];

export function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-xl p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold mb-2">Bem-vinda, Maria!</h2>
        <p className="text-primary-foreground/80">
          Aqui está um resumo das atividades do seu condomínio hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Chamados Abertos"
          value={12}
          description="3 de alta prioridade"
          icon={MessageSquare}
          trend={{ value: -8, isPositive: true }}
          variant="warning"
        />
        <StatsCard
          title="Serviços Agendados"
          value={8}
          description="Esta semana"
          icon={Calendar}
          trend={{ value: 15, isPositive: true }}
          variant="info"
        />
        <StatsCard
          title="Taxa de Resolução"
          value="94%"
          description="Chamados resolvidos"
          icon={CheckCircle}
          trend={{ value: 5, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="Moradores Ativos"
          value={245}
          description="De 300 unidades"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Chamados Recentes
              </CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Chamado
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTickets.map((ticket) => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket}
                    onClick={() => console.log("Open ticket", ticket.id)}
                  />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                Ver Todos os Chamados
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="gradient" className="h-20 flex-col space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span>Criar Comunicado</span>
            </Button>
            <Button variant="secondary" className="h-20 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Reservar Área</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>Ver Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}