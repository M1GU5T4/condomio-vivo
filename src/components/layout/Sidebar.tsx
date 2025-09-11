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
  ChevronRight,
  Home,
  Megaphone,
  Clipboard,
  DollarSign,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedAccess } from "@/components/RoleBasedAccess";

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

const syndicNavigationItems = [
  { id: "syndic-dashboard", label: "Painel de Controle", icon: Home },
  { id: "syndic-communication", label: "Central de Anúncios", icon: Megaphone },
  { id: "syndic-tickets", label: "Gestão de Chamados", icon: Clipboard },
  { id: "syndic-financial", label: "Gestão Financeira", icon: DollarSign },
  { id: "syndic-services", label: "Gestão de Serviços", icon: Settings },
];

const adminNavigationItems = [
  { id: "admin-residents", label: "Gestão de Moradores", icon: Users },
  { id: "admin-building", label: "Gestão do Edifício", icon: Building2 },
  { id: "admin-system", label: "Configurações", icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile } = useAuth();

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

        <nav className="space-y-4">
          {/* Área do Morador - Visível para todos */}
          <RoleBasedAccess allowedRoles={['tenant', 'owner', 'syndic', 'admin']}>
            <div>
              {!isCollapsed && <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Área do Morador</h3>}
              <div className="space-y-2">
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
              </div>
            </div>
          </RoleBasedAccess>

          {/* Área do Síndico - Visível apenas para síndicos e admins */}
          <RoleBasedAccess allowedRoles={['syndic', 'admin']}>
            <div>
              {!isCollapsed && <h3 className="text-xs font-semibold text-accent-foreground uppercase tracking-wider mb-2">Área do Síndico</h3>}
              <div className="space-y-2">
                {syndicNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start transition-all duration-200",
                        isCollapsed ? "px-2" : "px-4",
                        isActive && "bg-success text-success-foreground shadow-md"
                      )}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Button>
                  );
                })}
              </div>
            </div>
          </RoleBasedAccess>

          {/* Área do Administrador - Visível apenas para admins */}
          <RoleBasedAccess allowedRoles={['admin']}>
            <div>
              {!isCollapsed && <h3 className="text-xs font-semibold text-destructive-foreground uppercase tracking-wider mb-2">Área do Administrador</h3>}
              <div className="space-y-2">
                {adminNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start transition-all duration-200",
                        isCollapsed ? "px-2" : "px-4",
                        isActive && "bg-destructive text-destructive-foreground shadow-md"
                      )}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Button>
                  );
                })}
              </div>
            </div>
          </RoleBasedAccess>
        </nav>
      </div>
    </aside>
  );
}