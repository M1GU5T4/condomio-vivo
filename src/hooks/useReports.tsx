import { useState, useCallback } from 'react';

export interface ReportFilters {
  month: string;
  year: string;
  condominiumId?: string;
}

export interface ReportMetrics {
  saudeFinanceira: number;
  statusFinanceiro: 'positivo' | 'negativo' | 'neutro';
  taxaInadimplencia: number;
  statusInadimplencia: 'baixa' | 'media' | 'alta';
  eficienciaOperacional: number;
  statusOperacional: 'excelente' | 'bom' | 'regular' | 'ruim';
  engajamentoComunidade: number;
  statusEngajamento: 'alto' | 'medio' | 'baixo';
}

export interface FinancialData {
  receitas: number;
  despesas: number;
  resultado: number;
  principaisDespesas: Array<{ categoria: string; valor: number }>;
  receitasPorCategoria: Array<{ categoria: string; valor: number }>;
  evolucaoMensal: Array<{ mes: string; receitas: number; despesas: number }>;
}

export interface ReservationData {
  areaMaisUtilizada: { nome: string; reservas: number };
  areaMenosUtilizada: { nome: string; reservas: number };
  totalHoras: number;
  taxaOcupacao: number;
  ranking: Array<{ area: string; reservas: number; ocupacao: number }>;
  evolucaoSemanal: Array<{ semana: string; reservas: number }>;
}

export interface OperationalData {
  chamadosAbertos: number;
  chamadosFechados: number;
  chamadosAndamento: number;
  tempoMedioPrimeiraResposta: string;
  tempoMedioResolucao: string;
  categoriaMaisFrequente: { nome: string; quantidade: number };
  distribuicaoCategorias: Array<{ categoria: string; quantidade: number }>;
  satisfacaoMedia: number;
  slaAtendimento: number;
}

export interface CommunicationData {
  totalComunicados: number;
  totalEnquetes: number;
  taxaParticipacaoEnquetes: number;
  comunicadoMaisVisualizado: string;
  engajamentoPorTipo: Array<{ tipo: string; visualizacoes: number }>;
  horariosMaisAtivos: Array<{ horario: string; atividade: number }>;
}

export interface AccessControlData {
  novosVisitantes: number;
  novosPrestadores: number;
  totalAcessos: number;
  acessosPorPeriodo: Array<{ periodo: string; acessos: number }>;
  visitantesMaisFrequentes: Array<{ nome: string; visitas: number }>;
}

export interface ReportData {
  id: string;
  condominio: string;
  mesAno: string;
  dataGeracao: string;
  resumoExecutivo: {
    principaisAcontecimentos: string;
    manutencoesCriticas: string;
    comunicadosAltoImpacto: string;
    decisoesEnquetes: string;
    eventosComunitarios: string;
  };
  metricas: ReportMetrics;
  financeiro: FinancialData;
  reservas: ReservationData;
  operacional: OperationalData;
  comunicacao: CommunicationData;
  controleAcesso: AccessControlData;
  insights: {
    tendenciasIdentificadas: string[];
    recomendacoesProximoMes: string[];
    pontosAtencao: string[];
  };
  proximasAcoes: string[];
}

export interface ReportTemplate {
  id: string;
  nome: string;
  descricao: string;
  secoes: string[];
  formato: 'completo' | 'resumido' | 'executivo';
}

const useReports = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular dados para demonstração
  const mockTemplates: ReportTemplate[] = [
    {
      id: '1',
      nome: 'Relatório Completo',
      descricao: 'Relatório detalhado com todas as seções e métricas',
      secoes: ['resumo', 'metricas', 'financeiro', 'reservas', 'operacional', 'comunicacao', 'acesso', 'insights'],
      formato: 'completo'
    },
    {
      id: '2',
      nome: 'Relatório Executivo',
      descricao: 'Resumo executivo focado em métricas principais',
      secoes: ['resumo', 'metricas', 'insights'],
      formato: 'executivo'
    },
    {
      id: '3',
      nome: 'Relatório Financeiro',
      descricao: 'Foco específico em dados financeiros e inadimplência',
      secoes: ['resumo', 'metricas', 'financeiro'],
      formato: 'resumido'
    }
  ];

  const generateReport = useCallback(async (filters: ReportFilters, templateId?: string): Promise<ReportData> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data baseado nos filtros
      const mockReport: ReportData = {
        id: `report_${Date.now()}`,
        condominio: "Residencial Jardim das Flores",
        mesAno: `${getMonthName(filters.month)}/${filters.year}`,
        dataGeracao: new Date().toISOString(),
        resumoExecutivo: {
          principaisAcontecimentos: "Manutenção preventiva do sistema de segurança e instalação de novos equipamentos na academia",
          manutencoesCriticas: "Reparo do sistema de bombeamento da piscina e manutenção dos elevadores",
          comunicadosAltoImpacto: "Novas regras para uso da churrasqueira e horários da academia",
          decisoesEnquetes: "Aprovada por 78% dos moradores a instalação de câmeras adicionais no estacionamento",
          eventosComunitarios: "Festa de Ano Novo com participação de 120 moradores"
        },
        metricas: {
          saudeFinanceira: 15420.50,
          statusFinanceiro: 'positivo',
          taxaInadimplencia: 8.5,
          statusInadimplencia: 'baixa',
          eficienciaOperacional: 92,
          statusOperacional: 'excelente',
          engajamentoComunidade: 45,
          statusEngajamento: 'alto'
        },
        financeiro: {
          receitas: 125000,
          despesas: 109579.50,
          resultado: 15420.50,
          principaisDespesas: [
            { categoria: "Folha de Pagamento", valor: 45000 },
            { categoria: "Contas de Consumo", valor: 28500 },
            { categoria: "Manutenção Preventiva", valor: 18000 }
          ],
          receitasPorCategoria: [
            { categoria: "Taxa Condominial", valor: 95000 },
            { categoria: "Multas", valor: 15000 },
            { categoria: "Aluguel de Áreas", valor: 15000 }
          ],
          evolucaoMensal: [
            { mes: "Nov", receitas: 120000, despesas: 105000 },
            { mes: "Dez", receitas: 125000, despesas: 109579.50 }
          ]
        },
        reservas: {
          areaMaisUtilizada: { nome: "Churrasqueira", reservas: 28 },
          areaMenosUtilizada: { nome: "Salão de Festas", reservas: 4 },
          totalHoras: 156,
          taxaOcupacao: 65,
          ranking: [
            { area: "Churrasqueira", reservas: 28, ocupacao: 85 },
            { area: "Academia", reservas: 22, ocupacao: 70 },
            { area: "Piscina", reservas: 18, ocupacao: 60 },
            { area: "Quadra", reservas: 12, ocupacao: 40 },
            { area: "Salão de Festas", reservas: 4, ocupacao: 25 }
          ],
          evolucaoSemanal: [
            { semana: "Sem 1", reservas: 8 },
            { semana: "Sem 2", reservas: 12 },
            { semana: "Sem 3", reservas: 15 },
            { semana: "Sem 4", reservas: 10 }
          ]
        },
        operacional: {
          chamadosAbertos: 8,
          chamadosFechados: 15,
          chamadosAndamento: 3,
          tempoMedioPrimeiraResposta: "2.5 horas",
          tempoMedioResolucao: "1.8 dias",
          categoriaMaisFrequente: { nome: "Hidráulica", quantidade: 6 },
          distribuicaoCategorias: [
            { categoria: "Hidráulica", quantidade: 6 },
            { categoria: "Elétrica", quantidade: 4 },
            { categoria: "Limpeza", quantidade: 3 },
            { categoria: "Segurança", quantidade: 2 }
          ],
          satisfacaoMedia: 4.2,
          slaAtendimento: 95
        },
        comunicacao: {
          totalComunicados: 12,
          totalEnquetes: 3,
          taxaParticipacaoEnquetes: 68,
          comunicadoMaisVisualizado: "Novas regras para uso da churrasqueira",
          engajamentoPorTipo: [
            { tipo: "Avisos Gerais", visualizacoes: 450 },
            { tipo: "Enquetes", visualizacoes: 280 },
            { tipo: "Eventos", visualizacoes: 320 }
          ],
          horariosMaisAtivos: [
            { horario: "08:00-12:00", atividade: 35 },
            { horario: "18:00-22:00", atividade: 45 },
            { horario: "12:00-18:00", atividade: 20 }
          ]
        },
        controleAcesso: {
          novosVisitantes: 145,
          novosPrestadores: 8,
          totalAcessos: 2340,
          acessosPorPeriodo: [
            { periodo: "Manhã", acessos: 680 },
            { periodo: "Tarde", acessos: 920 },
            { periodo: "Noite", acessos: 740 }
          ],
          visitantesMaisFrequentes: [
            { nome: "João Silva", visitas: 12 },
            { nome: "Maria Santos", visitas: 8 },
            { nome: "Pedro Costa", visitas: 6 }
          ]
        },
        insights: {
          tendenciasIdentificadas: [
            "Aumento de 15% no uso da churrasqueira comparado ao mês anterior",
            "Redução de 20% no tempo médio de resolução de chamados",
            "Crescimento de 25% na participação em enquetes"
          ],
          recomendacoesProximoMes: [
            "Considerar ampliar horários de funcionamento da academia",
            "Implementar sistema de agendamento online para a churrasqueira",
            "Realizar manutenção preventiva no sistema de iluminação"
          ],
          pontosAtencao: [
            "Taxa de inadimplência ainda acima da meta de 5%",
            "Baixa utilização do salão de festas pode indicar necessidade de melhorias",
            "Aumento de chamados relacionados à hidráulica requer investigação"
          ]
        },
        proximasAcoes: [
          "Campanha de conscientização sobre inadimplência",
          "Pesquisa de satisfação sobre o salão de festas",
          "Inspeção geral do sistema hidráulico do edifício",
          "Implementação de melhorias na academia baseadas no feedback dos moradores"
        ]
      };

      setCurrentReport(mockReport);
      setReports(prev => [mockReport, ...prev]);
      
      return mockReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getMonthName]);

  const getReportHistory = useCallback(async (limit?: number): Promise<ReportData[]> => {
    setIsLoading(true);
    try {
      // Simular busca de histórico
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const limitedReports = limit ? reports.slice(0, limit) : reports;
      return limitedReports;
    } catch (err) {
      setError('Erro ao buscar histórico de relatórios');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [reports]);

  const exportReport = useCallback(async (reportId: string, format: 'pdf' | 'excel' | 'markdown'): Promise<string> => {
    setIsLoading(true);
    try {
      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const report = reports.find(r => r.id === reportId) || currentReport;
      if (!report) {
        throw new Error('Relatório não encontrado');
      }

      // Retornar URL do arquivo exportado (mock)
      return `https://example.com/reports/${reportId}.${format}`;
    } catch (err) {
      setError('Erro ao exportar relatório');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [reports, currentReport]);

  const getTemplates = useCallback(async (): Promise<ReportTemplate[]> => {
    setIsLoading(true);
    try {
      // Simular busca de templates
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTemplates(mockTemplates);
      return mockTemplates;
    } catch (err) {
      setError('Erro ao buscar templates');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [mockTemplates]);

  const scheduleReport = useCallback(async (filters: ReportFilters, schedule: {
    frequency: 'monthly' | 'quarterly' | 'yearly';
    dayOfMonth?: number;
    recipients: string[];
  }): Promise<void> => {
    setIsLoading(true);
    try {
      // Simular agendamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Relatório agendado:', { filters, schedule });
    } catch (err) {
      setError('Erro ao agendar relatório');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMonthName = (month: string): string => {
    const months = {
      '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
      '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
      '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
    };
    return months[month as keyof typeof months] || month;
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    reports,
    currentReport,
    templates,
    isLoading,
    error,
    
    // Actions
    generateReport,
    getReportHistory,
    exportReport,
    getTemplates,
    scheduleReport,
    clearError,
    
    // Helpers
    getMonthName
  };
};

export default useReports;