import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  author: string;
  apartment: string;
  createdAt: string;
  commentsCount: number;
}

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-warning text-warning-foreground";
      case "in-progress":
        return "bg-info text-info-foreground";
      case "resolved":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Aberto";
      case "in-progress":
        return "Em Andamento";
      case "resolved":
        return "Resolvido";
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return priority;
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md cursor-pointer bg-gradient-card" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base line-clamp-1">{ticket.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={cn("text-xs", getPriorityColor(ticket.priority))}>
              {getPriorityText(ticket.priority)}
            </Badge>
            <Badge className={cn("text-xs", getStatusColor(ticket.status))}>
              {getStatusText(ticket.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {ticket.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{ticket.author} - {ticket.apartment}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{ticket.createdAt}</span>
            </div>
          </div>
          
          {ticket.commentsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{ticket.commentsCount}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}