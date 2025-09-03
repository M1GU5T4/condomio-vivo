import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "communications":
        return <div className="p-6"><h2 className="text-2xl font-bold">Módulo de Comunicação</h2><p className="text-muted-foreground mt-2">Sistema de chamados, enquetes e comunicados em desenvolvimento...</p></div>;
      case "services":
        return <div className="p-6"><h2 className="text-2xl font-bold">Gestão de Serviços</h2><p className="text-muted-foreground mt-2">Agendamentos e prestadores de serviço em desenvolvimento...</p></div>;
      case "documents":
        return <div className="p-6"><h2 className="text-2xl font-bold">Central de Documentos</h2><p className="text-muted-foreground mt-2">Repositório de documentos e regulamentos em desenvolvimento...</p></div>;
      case "bookings":
        return <div className="p-6"><h2 className="text-2xl font-bold">Reservas</h2><p className="text-muted-foreground mt-2">Sistema de reserva de áreas comuns em desenvolvimento...</p></div>;
      case "analytics":
        return <div className="p-6"><h2 className="text-2xl font-bold">Relatórios e Análises</h2><p className="text-muted-foreground mt-2">Dashboard de consumo e análises em desenvolvimento...</p></div>;
      case "residents":
        return <div className="p-6"><h2 className="text-2xl font-bold">Gestão de Moradores</h2><p className="text-muted-foreground mt-2">Cadastro e gestão de moradores em desenvolvimento...</p></div>;
      case "building":
        return <div className="p-6"><h2 className="text-2xl font-bold">Informações do Edifício</h2><p className="text-muted-foreground mt-2">Dados e configurações do condomínio em desenvolvimento...</p></div>;
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
