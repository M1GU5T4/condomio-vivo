import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Download,
  Send,
  CreditCard,
  FileText,
  Calendar,
  User
} from "lucide-react";

export function FinancialManagement() {
  const financialStats = [
    {
      title: "Receita do Mês",
      value: "R$ 45.678",
      description: "Janeiro 2024",
      icon: TrendingUp,
      trend: { value: 12, isPositive: true },
      variant: "success" as const
    },
    {
      title: "Inadimplência",
      value: "R$ 12.450",
      description: "15 apartamentos",
      icon: AlertTriangle,
      trend: { value: 8, isPositive: false },
      variant: "warning" as const
    },
    {
      title: "Despesas",
      value: "R$ 38.902",
      description: "Operacionais + Extras",
      icon: TrendingDown,
      trend: { value: 5, isPositive: false },
      variant: "info" as const
    },
    {
      title: "Saldo",
      value: "R$ 94.326",
      description: "Reserva de emergência",
      icon: DollarSign,
      trend: { value: 15, isPositive: true },
      variant: "default" as const
    }
  ];

  const defaulters = [
    {
      apartment: "Apt 1205",
      owner: "Maria Silva",
      amount: "R$ 1.850,00",
      months: 2,
      lastContact: "2024-01-10",
      status: "contacted"
    },
    {
      apartment: "Apt 807",
      owner: "João Santos",
      amount: "R$ 925,00",
      months: 1,
      lastContact: "2024-01-08",
      status: "pending"
    },
    {
      apartment: "Apt 502",
      owner: "Carlos Rodrigues",
      amount: "R$ 2.775,00",
      months: 3,
      lastContact: "2024-01-05",
      status: "legal"
    },
    {
      apartment: "Apt 304",
      owner: "Ana Costa",
      amount: "R$ 925,00",
      months: 1,
      lastContact: "2024-01-12",
      status: "contacted"
    }
  ];

  const expenses = [
    { category: "Limpeza", amount: "R$ 8.500", percentage: 22 },
    { category: "Segurança", amount: "R$ 12.000", percentage: 31 },
    { category: "Manutenção", amount: "R$ 6.750", percentage: 17 },
    { category: "Administração", amount: "R$ 5.200", percentage: 13 },
    { category: "Utilities", amount: "R$ 4.850", percentage: 12 },
    { category: "Outros", amount: "R$ 1.602", percentage: 5 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "contacted": return "bg-info/10 text-info border-info/20";
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "legal": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "contacted": return "Contatado";
      case "pending": return "Pendente";
      case "legal": return "Jurídico";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão Financeira</h1>
          <p className="text-muted-foreground">Controle financeiro e inadimplência</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button className="bg-gradient-to-r from-success to-success-dark">
            <FileText className="h-4 w-4 mr-2" />
            Gerar Balancete
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => (
          <Card key={index} className={`transition-all duration-200 hover:shadow-md ${
            stat.variant === "success" ? "border-success/20 bg-gradient-to-br from-success/5 to-success/10" :
            stat.variant === "warning" ? "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10" :
            stat.variant === "info" ? "border-info/20 bg-gradient-to-br from-info/5 to-info/10" :
            "border-primary/20 bg-gradient-card"
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                stat.variant === "success" ? "text-success bg-success/10" :
                stat.variant === "warning" ? "text-warning bg-warning/10" :
                stat.variant === "info" ? "text-info bg-info/10" :
                "text-primary bg-primary/10"
              }`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              {stat.trend && (
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    stat.trend.isPositive ? "text-success" : "text-destructive"
                  }`}>
                    {stat.trend.isPositive ? "+" : ""}{stat.trend.value}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs. mês anterior</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Defaulters List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Inadimplência
              </CardTitle>
              <CardDescription>
                Controle de moradores em atraso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defaulters.map((defaulter, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{defaulter.apartment}</h3>
                        <p className="text-sm text-muted-foreground">{defaulter.owner}</p>
                      </div>
                      <Badge className={getStatusColor(defaulter.status)}>
                        {getStatusText(defaulter.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Valor:</span>
                        <div className="font-medium text-destructive">{defaulter.amount}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Meses:</span>
                        <div className="font-medium">{defaulter.months}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Último contato:</span>
                        <div className="font-medium">{defaulter.lastContact}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Send className="h-3 w-3 mr-1" />
                          Contatar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.map((expense, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{expense.category}</span>
                      <span className="font-medium">{expense.amount}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${expense.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20" variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Gerar 2ª Via de Boletos
              </Button>
              
              <Button className="w-full justify-start bg-gradient-to-r from-warning/10 to-warning/5 hover:from-warning/20 hover:to-warning/10 border border-warning/20" variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Enviar Lembretes
              </Button>
              
              <Button className="w-full justify-start bg-gradient-to-r from-success/10 to-success/5 hover:from-success/20 hover:to-success/10 border border-success/20" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Relatório Mensal
              </Button>
              
              <Button className="w-full justify-start bg-gradient-to-r from-info/10 to-info/5 hover:from-info/20 hover:to-info/10 border border-info/20" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Assembleia
              </Button>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-lg font-bold text-success">142</div>
                  <div className="text-xs text-muted-foreground">Pagos em Dia</div>
                </div>
                
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <div className="text-lg font-bold text-warning">15</div>
                  <div className="text-xs text-muted-foreground">Em Atraso</div>
                </div>
                
                <div className="text-center p-3 bg-info/10 rounded-lg">
                  <div className="text-lg font-bold text-info">91%</div>
                  <div className="text-xs text-muted-foreground">Taxa de Adimplência</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}