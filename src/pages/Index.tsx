import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SyndicDashboard } from "@/components/syndic/SyndicDashboard";
import { CommunicationCenter } from "@/components/syndic/CommunicationCenter";
import { TicketManagement } from "@/components/syndic/TicketManagement";
import { FinancialManagement } from "@/components/syndic/FinancialManagement";
import { ServiceManagement } from "@/components/syndic/ServiceManagement";
import { CommunicationPage } from "@/components/communication/CommunicationPage";
import { ServicesPage } from "@/components/services/ServicesPage";
import DocumentsPage from '@/components/documents/DocumentsPage';
import { ResidentsPage } from '@/components/residents/ResidentsPage';
import { AdminResidentsPage } from '@/components/admin/AdminResidentsPage';
import ReservationsPage from '@/components/reservations/ReservationsPage';
import { BuildingPage } from '@/components/building/BuildingPage';
import ReportsPage from '@/components/reports/ReportsPage';

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      // Área do Morador
      case "dashboard":
        return <Dashboard />;
      case "communications":
        return <CommunicationPage />;
      case "services":
        return <ServicesPage />;
      case "documents":
        return <DocumentsPage />;
      case "bookings":
        return <ReservationsPage />;
      case "analytics":
        return <ReportsPage />;
      case "residents":
        return <ResidentsPage />;
      case "building":
        return <BuildingPage />;
      
      // Área do Síndico
      case "syndic-dashboard":
        return <SyndicDashboard />;
      case "syndic-communication":
        return <CommunicationCenter />;
      case "syndic-tickets":
        return <TicketManagement />;
      case "syndic-financial":
        return <FinancialManagement />;
      case "syndic-services":
        return <ServiceManagement />;
      
      // Área do Administrador
      case "admin-residents":
        return <AdminResidentsPage />;
      case "admin-building":
        return <div className="p-6"><h2 className="text-2xl font-bold">Gestão do Edifício</h2><p className="text-muted-foreground mt-2">Configurações avançadas do condomínio em desenvolvimento...</p></div>;
      case "admin-system":
        return <div className="p-6"><h2 className="text-2xl font-bold">Configurações do Sistema</h2><p className="text-muted-foreground mt-2">Configurações gerais do sistema em desenvolvimento...</p></div>;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
