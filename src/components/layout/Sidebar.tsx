import { 
  LayoutDashboard, 
  MessageSquare, 
  Wrench, 
  FileText, 
  Calendar,
  BarChart3,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "communications", label: "Comunicação", icon: MessageSquare },
  { id: "services", label: "Serviços", icon: Wrench },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "bookings", label: "Reservas", icon: Calendar },
  { id: "analytics", label: "Relatórios", icon: BarChart3 },
  { id: "residents", label: "Moradores", icon: Users },
  { id: "building", label: "Edifício", icon: Building2 },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border h-full transition-all duration-300 ease-smooth",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto mb-4 hover:bg-accent"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  isCollapsed ? "px-2" : "px-4",
                  isActive && "bg-gradient-primary text-primary-foreground shadow-md"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}