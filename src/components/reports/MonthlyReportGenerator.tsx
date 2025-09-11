import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Wrench, 
  MessageSquare,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ReportData {
  condominio: string;
  mesAno: string;
  resumoExecutivo: {
    principaisAcontecimentos: string;
    manutencoesCriticas: string;
    comunicadosAltoImpacto: string;
    decisoesEnquetes: string;
    eventosComunitarios: string;
  };
  metricas: {
    saudeFinanceira: number;
    statusFinanceiro: 'positivo' | 'negativo' | 'neutro';
    taxaInadimplencia: number;
    statusInadimplencia: 'baixa' | 'media' | 'alta';
    eficienciaOperacional: number;
    statusOperacional: 'excelente' | 'bom' | 'regular' | 'ruim';
    engajamentoComunidade: number;
    statusEngajamento: 'alto' | 'medio' | 'baixo';
  };
  financeiro: {
    receitas: number;
    despesas: number;
    resultado: number;
    principaisDespesas: Array<{ categoria: string; valor: number }>;
  };
  reservas: {
    areaMaisUtilizada: { nome: string; reservas: number };
    areaMenosUtilizada: { nome: string; reservas: number };
    totalHoras: number;
    taxaOcupacao: number;
    ranking: Array<{ area: string; reservas: number; ocupacao: number }>;
  };
  operacional: {
    chamadosAbertos: number;
    chamadosFechados: number;
    chamadosAndamento: number;
    tempoMedioPrimeiraResposta: string;
    tempoMedioResolucao: string;
    categoriaMaisFrequente: { nome: string; quantidade: number };
    distribuicaoCategorias: Array<{ categoria: string; quantidade: number }>;
  };
  comunicacao: {
    totalComunicados: number;
    totalEnquetes: number;
    taxaParticipacaoEnquetes: number;
    comunicadoMaisVisualizado: string;
  };
  controleAcesso: {
    novosVisitantes: number;
    novosPrestadores: number;
    totalAcessos: number;
  };
}

const MonthlyReportGenerator: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data para demonstração
  const mockReportData: ReportData = {
    condominio: "Residencial Jardim das Flores",
    mesAno: "Janeiro/2024",
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
      ]
    },
    comunicacao: {
      totalComunicados: 12,
      totalEnquetes: 3,
      taxaParticipacaoEnquetes: 68,
      comunicadoMaisVisualizado: "Novas regras para uso da churrasqueira"
    },
    controleAcesso: {
      novosVisitantes: 145,
      novosPrestadores: 8,
      totalAcessos: 2340
    }
  };

  const generateReport = async () => {
    if (!selectedMonth || !selectedYear) return;
    
    setIsGenerating(true);
    // Simular chamada à API
    setTimeout(() => {
      setReportData(mockReportData);
      setIsGenerating(false);
    }, 2000);
  };

  const getStatusBadge = (status: string, type: 'financial' | 'operational' | 'engagement' | 'default') => {
    const variants = {
      financial: {
        positivo: 'default',
        negativo: 'destructive',
        neutro: 'secondary'
      },
      operational: {
        excelente: 'default',
        bom: 'secondary',
        regular: 'outline',
        ruim: 'destructive'
      },
      engagement: {
        alto: 'default',
        medio: 'secondary',
        baixo: 'outline'
      },
      default: {
        baixa: 'default',
        media: 'secondary',
        alta: 'destructive'
      }
    };
    
    return <Badge variant={variants[type][status] as 'default' | 'secondary' | 'destructive' | 'outline'}>{status}</Badge>;
  };

  const months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  const years = ['2024', '2023', '2022'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Relatório Mensal de Gestão</h1>
            <p className="text-blue-100">Análise automática dos dados do condomínio</p>
          </div>
        </div>
      </div>

      {/* Seleção de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Selecionar Período
          </CardTitle>
          <CardDescription>
            Escolha o mês e ano para gerar o relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Mês</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateReport} 
              disabled={!selectedMonth || !selectedYear || isGenerating}
              className="px-8"
            >
              {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Relatório Gerado */}
      {reportData && (
        <div className="space-y-6">
          {/* Resumo Executivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo Executivo - {reportData.mesAno}
              </CardTitle>
              <CardDescription>
                As notícias mais importantes do mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Durante o mês de {reportData.mesAno}, destacamos os seguintes acontecimentos: {reportData.resumoExecutivo.principaisAcontecimentos}. 
                  As manutenções realizadas incluíram {reportData.resumoExecutivo.manutencoesCriticas}. 
                  Os comunicados de maior impacto foram {reportData.resumoExecutivo.comunicadosAltoImpacto}. 
                  {reportData.resumoExecutivo.decisoesEnquetes}. 
                  {reportData.resumoExecutivo.eventosComunitarios}.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Painel de Métricas Principais
              </CardTitle>
              <CardDescription>
                Visão geral em 60 segundos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Saúde Financeira</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {reportData.metricas.saudeFinanceira.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(reportData.metricas.statusFinanceiro, 'financial')}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Taxa de Inadimplência</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {reportData.metricas.taxaInadimplencia}%
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(reportData.metricas.statusInadimplencia, 'default')}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Eficiência Operacional</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {reportData.metricas.eficienciaOperacional}%
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(reportData.metricas.statusOperacional, 'operational')}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Engajamento</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {reportData.metricas.engajamentoComunidade} reservas
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(reportData.metricas.statusEngajamento, 'engagement')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhamento por Área */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Área</CardTitle>
              <CardDescription>
                Análise detalhada de cada módulo da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="financial">Financeiro</TabsTrigger>
                  <TabsTrigger value="reservations">Reservas</TabsTrigger>
                  <TabsTrigger value="operational">Operacional</TabsTrigger>
                  <TabsTrigger value="communication">Comunicação</TabsTrigger>
                  <TabsTrigger value="access">Acesso</TabsTrigger>
                </TabsList>
                
                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-700 font-medium">Receitas Totais</div>
                      <div className="text-2xl font-bold text-green-800">
                        R$ {reportData.financeiro.receitas.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="text-sm text-red-700 font-medium">Despesas Totais</div>
                      <div className="text-2xl font-bold text-red-800">
                        R$ {reportData.financeiro.despesas.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 font-medium">Resultado do Mês</div>
                      <div className="text-2xl font-bold text-blue-800">
                        R$ {reportData.financeiro.resultado.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Principais Categorias de Despesa</h4>
                    <div className="space-y-2">
                      {reportData.financeiro.principaisDespesas.map((despesa, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">{index + 1}. {despesa.categoria}</span>
                          <span className="font-bold">R$ {despesa.valor.toLocaleString('pt-BR')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reservations" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-700 font-medium">Área Mais Utilizada</div>
                      <div className="text-xl font-bold text-green-800">
                        {reportData.reservas.areaMaisUtilizada.nome}
                      </div>
                      <div className="text-sm text-green-600">
                        {reportData.reservas.areaMaisUtilizada.reservas} reservas
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="text-sm text-orange-700 font-medium">Área Menos Utilizada</div>
                      <div className="text-xl font-bold text-orange-800">
                        {reportData.reservas.areaMenosUtilizada.nome}
                      </div>
                      <div className="text-sm text-orange-600">
                        {reportData.reservas.areaMenosUtilizada.reservas} reservas
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Ranking de Utilização das Áreas Comuns</h4>
                    <div className="space-y-2">
                      {reportData.reservas.ranking.map((area, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">{index + 1}. {area.area}</span>
                          <div className="text-right">
                            <div className="font-bold">{area.reservas} reservas</div>
                            <div className="text-sm text-muted-foreground">{area.ocupacao}% ocupação</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="operational" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 font-medium">Chamados Abertos</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {reportData.operacional.chamadosAbertos}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-700 font-medium">Chamados Fechados</div>
                      <div className="text-2xl font-bold text-green-800">
                        {reportData.operacional.chamadosFechados}
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="text-sm text-orange-700 font-medium">Em Andamento</div>
                      <div className="text-2xl font-bold text-orange-800">
                        {reportData.operacional.chamadosAndamento}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-medium mb-2">Tempo Médio de Primeira Resposta</div>
                      <div className="text-xl font-bold">{reportData.operacional.tempoMedioPrimeiraResposta}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-medium mb-2">Tempo Médio de Resolução</div>
                      <div className="text-xl font-bold">{reportData.operacional.tempoMedioResolucao}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Distribuição por Categoria</h4>
                    <div className="space-y-2">
                      {reportData.operacional.distribuicaoCategorias.map((categoria, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">{categoria.categoria}</span>
                          <span className="font-bold">{categoria.quantidade} ocorrências</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="communication" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 font-medium">Comunicados Publicados</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {reportData.comunicacao.totalComunicados}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-700 font-medium">Enquetes Realizadas</div>
                      <div className="text-2xl font-bold text-purple-800">
                        {reportData.comunicacao.totalEnquetes}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm font-medium mb-2">Taxa de Participação em Enquetes</div>
                    <div className="text-2xl font-bold">{reportData.comunicacao.taxaParticipacaoEnquetes}%</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Comunicado Mais Visualizado</div>
                    <div className="font-semibold">{reportData.comunicacao.comunicadoMaisVisualizado}</div>
                  </div>
                </TabsContent>
                
                <TabsContent value="access" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-700 font-medium">Novos Visitantes</div>
                      <div className="text-2xl font-bold text-green-800">
                        {reportData.controleAcesso.novosVisitantes}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 font-medium">Novos Prestadores</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {reportData.controleAcesso.novosPrestadores}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-700 font-medium">Total de Acessos</div>
                      <div className="text-2xl font-bold text-purple-800">
                        {reportData.controleAcesso.totalAcessos.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Compartilhar
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Exportar Markdown
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MonthlyReportGenerator;