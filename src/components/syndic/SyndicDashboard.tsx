import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TicketCard } from "@/components/dashboard/TicketCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Package, 
  TrendingUp,
  Users,
  Wrench,
  Bell
} from "lucide-react";

export function SyndicDashboard() {
  const urgentTickets = [
    {
      id: "1",
      title: "Vazamento no elevador social",
      description: "Água vazando no teto do elevador",
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
      description: "Portão não está abrindo completamente",
      status: "in-progress" as const,
      priority: "medium" as const,
      author: "João Santos",
      apartment: "Apt 807",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      commentsCount: 1
    }
  ];

  const syndicStats = [
    {
      title: "Chamados em Aberto",
      value: 8,
      description: "3 com alta prioridade",
      icon: AlertTriangle,
      trend: { value: 12, isPositive: false },
      variant: "warning" as const
    },
    {
      title: "Inadimplência",
      value: "R$ 12.450",
      description: "15 apartamentos em atraso",
      icon: DollarSign,
      trend: { value: 8, isPositive: false },
      variant: "info" as const
    },
    {
      title: "Encomendas Hoje",
      value: 23,
      description: "5 ainda não retiradas",
      icon: Package,
      trend: { value: 15, isPositive: true },
      variant: "success" as const
    },
    {
      title: "Reservas Ativas",
      value: 12,
      description: "Salão de festas em destaque",
      icon: Users,
      trend: { value: 20, isPositive: true },
      variant: "default" as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel de Controle</h1>
          <p className="text-muted-foreground">Central de gestão do condomínio</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-lg">
            <Bell className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">5 alertas urgentes</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {syndicStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Chamados Urgentes
              </CardTitle>
              <CardDescription>
                Requerem atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {urgentTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent/30 rounded-lg">
                  <div className="text-2xl font-bold text-success">R$ 45.678</div>
                  <div className="text-sm text-muted-foreground">Receita do Mês</div>
                </div>
                <div className="text-center p-4 bg-accent/30 rounded-lg">
                  <div className="text-2xl font-bold text-warning">R$ 12.450</div>
                  <div className="text-sm text-muted-foreground">Em Atraso</div>
                </div>
                <div className="text-center p-4 bg-accent/30 rounded-lg">
                  <div className="text-2xl font-bold text-info">R$ 38.902</div>
                  <div className="text-sm text-muted-foreground">Despesas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-6">
          <RecentActivity />
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 text-left rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all border border-primary/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Aprovar Reservas</div>
                    <div className="text-xs text-muted-foreground">3 pendentes</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left rounded-lg bg-gradient-to-r from-success/10 to-success/5 hover:from-success/20 hover:to-success/10 transition-all border border-success/20">
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-success" />
                  <div>
                    <div className="font-medium">Atribuir Chamados</div>
                    <div className="text-xs text-muted-foreground">8 em aberto</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left rounded-lg bg-gradient-to-r from-warning/10 to-warning/5 hover:from-warning/20 hover:to-warning/10 transition-all border border-warning/20">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-warning" />
                  <div>
                    <div className="font-medium">Gerar Relatórios</div>
                    <div className="text-xs text-muted-foreground">Financeiro & Operacional</div>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}