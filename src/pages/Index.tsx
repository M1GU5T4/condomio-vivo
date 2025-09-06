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
        return <div className="p-6"><h2 className="text-2xl font-bold">Reservas</h2><p className="text-muted-foreground mt-2">Sistema de reserva de áreas comuns em desenvolvimento...</p></div>;
      case "analytics":
        return <div className="p-6"><h2 className="text-2xl font-bold">Relatórios e Análises</h2><p className="text-muted-foreground mt-2">Dashboard de consumo e análises em desenvolvimento...</p></div>;
      case "residents":
        return <div className="p-6"><h2 className="text-2xl font-bold">Gestão de Moradores</h2><p className="text-muted-foreground mt-2">Cadastro e gestão de moradores em desenvolvimento...</p></div>;
      case "building":
        return <div className="p-6"><h2 className="text-2xl font-bold">Informações do Edifício</h2><p className="text-muted-foreground mt-2">Dados e configurações do condomínio em desenvolvimento...</p></div>;
      
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
