import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, 
  Plus, 
  Send, 
  Eye, 
  Calendar,
  BarChart3,
  Users,
  MessageSquare
} from "lucide-react";

export function CommunicationCenter() {
  const announcements = [
    {
      id: 1,
      title: "Manutenção no Sistema de Água",
      content: "Informamos que haverá manutenção no sistema de água no dia 15/01...",
      status: "published",
      date: "2024-01-10",
      views: 89,
      type: "maintenance"
    },
    {
      id: 2,
      title: "Assembleia Ordinária - Janeiro 2024",
      content: "Convocamos todos os condôminos para a assembleia ordinária...",
      status: "scheduled",
      date: "2024-01-20",
      views: 0,
      type: "assembly"
    },
    {
      id: 3,
      title: "Nova Política de Visitantes",
      content: "A partir do dia 01/02, entrará em vigor a nova política...",
      status: "draft",
      date: "2024-01-08",
      views: 0,
      type: "policy"
    }
  ];

  const polls = [
    {
      id: 1,
      title: "Escolha da cor para pintura do hall",
      description: "Votação para definir a nova cor do hall de entrada",
      status: "active",
      votes: 45,
      endDate: "2024-01-25",
      options: ["Azul Claro", "Bege", "Cinza Moderno"]
    },
    {
      id: 2,
      title: "Horário da academia",
      description: "Definir novo horário de funcionamento da academia",
      status: "closed",
      votes: 78,
      endDate: "2024-01-15",
      options: ["6h-22h", "7h-23h", "24h"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-success/10 text-success border-success/20";
      case "scheduled": return "bg-info/10 text-info border-info/20";
      case "draft": return "bg-warning/10 text-warning border-warning/20";
      case "active": return "bg-primary/10 text-primary border-primary/20";
      case "closed": return "bg-muted/10 text-muted-foreground border-muted/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published": return "Publicado";
      case "scheduled": return "Agendado";
      case "draft": return "Rascunho";
      case "active": return "Ativa";
      case "closed": return "Encerrada";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Central de Anúncios</h1>
          <p className="text-muted-foreground">Gerencie comunicados e enquetes</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-primary to-primary-dark">
            <Plus className="h-4 w-4 mr-2" />
            Nova Enquete
          </Button>
          <Button className="bg-gradient-to-r from-success to-success-dark">
            <Megaphone className="h-4 w-4 mr-2" />
            Novo Comunicado
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Comunicados Ativos</p>
                <p className="text-2xl font-bold text-primary">12</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Leitura</p>
                <p className="text-2xl font-bold text-success">89%</p>
              </div>
              <Eye className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enquetes Ativas</p>
                <p className="text-2xl font-bold text-info">3</p>
              </div>
              <BarChart3 className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Participação</p>
                <p className="text-2xl font-bold text-warning">67%</p>
              </div>
              <Users className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Comunicados Recentes
            </CardTitle>
            <CardDescription>Gerencie anúncios e informativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                    <Badge className={getStatusColor(announcement.status)}>
                      {getStatusText(announcement.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {announcement.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {announcement.views} visualizações
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      {announcement.status === "draft" && (
                        <Button size="sm">
                          <Send className="h-3 w-3 mr-1" />
                          Publicar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Polls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Enquetes
            </CardTitle>
            <CardDescription>Colete opiniões dos moradores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {polls.map((poll) => (
                <div key={poll.id} className="p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{poll.title}</h3>
                    <Badge className={getStatusColor(poll.status)}>
                      {getStatusText(poll.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {poll.description}
                  </p>
                  <div className="space-y-2 mb-3">
                    {poll.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {poll.votes} votos
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Até {poll.endDate}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Resultados
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}