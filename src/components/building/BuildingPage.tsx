import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar,
  Settings,
  Thermometer,
  Zap,
  Droplets,
  Shield,
  Camera,
  Wifi,
  Car,
  TreePine,
  Dumbbell,
  Waves,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail
} from "lucide-react";

const buildingInfo = {
  name: "Residencial Vista Verde",
  address: "Rua das Flores, 123 - Jardim Botânico",
  cep: "22461-000",
  city: "Rio de Janeiro - RJ",
  totalUnits: 120,
  occupiedUnits: 98,
  floors: 15,
  buildingType: "Residencial",
  constructionYear: 2018,
  totalArea: "12.500 m²",
  cnpj: "12.345.678/0001-90",
  registration: "REG-2018-001234"
};

const amenities = [
  { id: 1, name: "Piscina", icon: Waves, status: "active", description: "Piscina adulto e infantil" },
  { id: 2, name: "Academia", icon: Dumbbell, status: "active", description: "Equipamentos modernos" },
  { id: 3, name: "Salão de Festas", icon: Calendar, status: "maintenance", description: "Capacidade para 80 pessoas" },
  { id: 4, name: "Playground", icon: TreePine, status: "active", description: "Área recreativa infantil" },
  { id: 5, name: "Garagem", icon: Car, status: "active", description: "150 vagas cobertas" },
  { id: 6, name: "Portaria 24h", icon: Shield, status: "active", description: "Segurança e controle de acesso" }
];

const infrastructure = [
  { name: "Energia Elétrica", icon: Zap, status: "normal", lastCheck: "Hoje, 08:00" },
  { name: "Água e Esgoto", icon: Droplets, status: "normal", lastCheck: "Ontem, 14:30" },
  { name: "Internet/Wi-Fi", icon: Wifi, status: "normal", lastCheck: "Hoje, 09:15" },
  { name: "Sistema de Segurança", icon: Camera, status: "warning", lastCheck: "Há 2 dias" },
  { name: "Climatização", icon: Thermometer, status: "normal", lastCheck: "Hoje, 07:45" }
];

const maintenanceSchedule = [
  {
    id: 1,
    service: "Limpeza da Piscina",
    date: "2024-01-25",
    time: "08:00",
    company: "AquaClean Serviços",
    status: "scheduled"
  },
  {
    id: 2,
    service: "Manutenção dos Elevadores",
    date: "2024-01-26",
    time: "14:00",
    company: "ElevaTech",
    status: "confirmed"
  },
  {
    id: 3,
    service: "Jardinagem",
    date: "2024-01-27",
    time: "09:00",
    company: "Verde Vida",
    status: "scheduled"
  }
];

const contacts = [
  {
    name: "Administração",
    phone: "(21) 3456-7890",
    email: "admin@vistaverde.com.br",
    hours: "Segunda a Sexta: 8h às 18h"
  },
  {
    name: "Portaria",
    phone: "(21) 3456-7891",
    email: "portaria@vistaverde.com.br",
    hours: "24 horas"
  },
  {
    name: "Emergência",
    phone: "(21) 9 9999-9999",
    email: "emergencia@vistaverde.com.br",
    hours: "24 horas"
  }
];

export function BuildingPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", variant: "default" as const },
      maintenance: { label: "Manutenção", variant: "secondary" as const },
      inactive: { label: "Inativo", variant: "destructive" as const },
      normal: { label: "Normal", variant: "default" as const },
      warning: { label: "Atenção", variant: "secondary" as const },
      critical: { label: "Crítico", variant: "destructive" as const },
      scheduled: { label: "Agendado", variant: "outline" as const },
      confirmed: { label: "Confirmado", variant: "default" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return config || { label: status, variant: "outline" as const };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
      case "active":
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "maintenance":
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-hero rounded-xl p-6 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              {buildingInfo.name}
            </h2>
            <p className="text-primary-foreground/80 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {buildingInfo.address}
            </p>
            <p className="text-primary-foreground/80 text-sm mt-1">
              {buildingInfo.city} - CEP: {buildingInfo.cep}
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar Informações
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unidades Ocupadas</p>
                <p className="text-2xl font-bold">{buildingInfo.occupiedUnits}/{buildingInfo.totalUnits}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(buildingInfo.occupiedUnits / buildingInfo.totalUnits) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Andares</p>
                <p className="text-2xl font-bold">{buildingInfo.floors}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Área Total</p>
                <p className="text-2xl font-bold">{buildingInfo.totalArea}</p>
              </div>
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Construção</p>
                <p className="text-2xl font-bold">{buildingInfo.constructionYear}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="amenities">Comodidades</TabsTrigger>
          <TabsTrigger value="infrastructure">Infraestrutura</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Building Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Edifício</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <p className="font-medium">{buildingInfo.buildingType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CNPJ:</span>
                    <p className="font-medium">{buildingInfo.cnpj}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Registro:</span>
                    <p className="font-medium">{buildingInfo.registration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Área Total:</span>
                    <p className="font-medium">{buildingInfo.totalArea}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contatos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
                    <h4 className="font-medium">{contact.name}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {contact.hours}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="amenities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comodidades do Condomínio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((amenity) => {
                  const Icon = amenity.icon;
                  const statusBadge = getStatusBadge(amenity.status);
                  
                  return (
                    <div key={amenity.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <h4 className="font-medium">{amenity.name}</h4>
                        </div>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{amenity.description}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status da Infraestrutura</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {infrastructure.map((item, index) => {
                  const Icon = item.icon;
                  const statusBadge = getStatusBadge(item.status);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Última verificação: {item.lastCheck}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma de Manutenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceSchedule.map((maintenance) => {
                  const statusBadge = getStatusBadge(maintenance.status);
                  
                  return (
                    <div key={maintenance.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-medium">{maintenance.service}</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(maintenance.date).toLocaleDateString('pt-BR')} às {maintenance.time}
                            </p>
                            <p className="flex items-center gap-2">
                              <Settings className="h-3 w-3" />
                              {maintenance.company}
                            </p>
                          </div>
                        </div>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}