import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Wrench, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "message" | "ticket" | "booking" | "document" | "resolved" | "alert";
  title: string;
  description: string;
  user: string;
  timestamp: string;
  apartment?: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "ticket",
    title: "Novo chamado aberto",
    description: "Problema no elevador social",
    user: "Carlos Santos",
    apartment: "Apt. 805",
    timestamp: "2 min atrás"
  },
  {
    id: "2",
    type: "resolved",
    title: "Chamado resolvido",
    description: "Lâmpada da garagem substituída",
    user: "Administração",
    timestamp: "15 min atrás"
  },
  {
    id: "3",
    type: "booking",
    title: "Nova reserva",
    description: "Salão de festas reservado",
    user: "Ana Costa",
    apartment: "Apt. 302",
    timestamp: "1h atrás"
  },
  {
    id: "4",
    type: "message",
    title: "Novo comunicado",
    description: "Assembleia ordinária agendada",
    user: "Síndico",
    timestamp: "2h atrás"
  },
  {
    id: "5",
    type: "alert",
    title: "Manutenção programada",
    description: "Limpeza da caixa d'água amanhã",
    user: "Administração",
    timestamp: "3h atrás"
  }
];

export function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message":
        return MessageSquare;
      case "ticket":
        return Wrench;
      case "booking":
        return Calendar;
      case "document":
        return FileText;
      case "resolved":
        return CheckCircle;
      case "alert":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "message":
        return "text-info bg-info/10";
      case "ticket":
        return "text-warning bg-warning/10";
      case "booking":
        return "text-secondary bg-secondary/10";
      case "document":
        return "text-muted-foreground bg-muted/10";
      case "resolved":
        return "text-success bg-success/10";
      case "alert":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  return (
    <Card className="bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", getActivityColor(activity.type))}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-foreground">
                      {activity.user}
                    </span>
                    {activity.apartment && (
                      <Badge variant="outline" className="text-xs">
                        {activity.apartment}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}