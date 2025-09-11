import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar, 
  History, 
  Settings, 
  BarChart3,
  Clock,
  Eye,
  Share2,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import MonthlyReportGenerator from './MonthlyReportGenerator';
import useReports, { ReportData, ReportTemplate } from '@/hooks/useReports';

const ReportsPage: React.FC = () => {
  const {
    reports,
    templates,
    isLoading,
    error,
    getReportHistory,
    getTemplates,
    exportReport,
    clearError
  } = useReports();

  const [activeTab, setActiveTab] = useState('generator');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    getTemplates();
    getReportHistory(10);
  }, [getTemplates, getReportHistory]);

  const handleExport = async (reportId: string, format: 'pdf' | 'excel' | 'markdown') => {
    try {
      const url = await exportReport(reportId, format);
      // Simular download
      window.open(url, '_blank');
    } catch (err) {
      console.error('Erro ao exportar:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positivo':
      case 'excelente':
      case 'alto':
      case 'baixa':
        return 'bg-green-100 text-green-800';
      case 'bom':
      case 'medio':
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'negativo':
      case 'ruim':
      case 'baixo':
      case 'alta':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = reports.filter(report => 
    report.condominio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.mesAno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Central de Relatórios</h1>
              <p className="text-blue-100">Geração automática e análise de dados condominiais</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {reports.length} relatórios gerados
            </Badge>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <Button variant="outline" size="sm" onClick={clearError}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Gerar Relatório
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Gerador de Relatórios */}
        <TabsContent value="generator">
          <MonthlyReportGenerator />
        </TabsContent>

        {/* Histórico de Relatórios */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Histórico de Relatórios
                  </CardTitle>
                  <CardDescription>
                    Visualize e gerencie relatórios anteriores
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar relatórios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-md text-sm"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Carregando relatórios...</div>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum relatório encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Tente ajustar os filtros de busca' : 'Gere seu primeiro relatório na aba "Gerar Relatório"'}
                  </p>
                  <Button onClick={() => setActiveTab('generator')}>
                    Gerar Primeiro Relatório
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{report.condominio}</h3>
                          <p className="text-muted-foreground">{report.mesAno}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(report.metricas.statusFinanceiro)}>
                            {report.metricas.statusFinanceiro}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(report.dataGeracao)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-sm text-green-700 font-medium">Saúde Financeira</div>
                          <div className="text-lg font-bold text-green-800">
                            {formatCurrency(report.metricas.saudeFinanceira)}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-sm text-blue-700 font-medium">Inadimplência</div>
                          <div className="text-lg font-bold text-blue-800">
                            {report.metricas.taxaInadimplencia}%
                          </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-sm text-purple-700 font-medium">Eficiência</div>
                          <div className="text-lg font-bold text-purple-800">
                            {report.metricas.eficienciaOperacional}%
                          </div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded">
                          <div className="text-sm text-orange-700 font-medium">Engajamento</div>
                          <div className="text-lg font-bold text-orange-800">
                            {report.metricas.engajamentoComunidade}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Visualizar
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(report.dataGeracao)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleExport(report.id, 'pdf')}>
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleExport(report.id, 'excel')}>
                            <Download className="h-4 w-4 mr-1" />
                            Excel
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Compartilhar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Templates de Relatório
              </CardTitle>
              <CardDescription>
                Modelos pré-configurados para diferentes tipos de análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{template.nome}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.descricao}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {template.formato}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-2">Seções incluídas:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.secoes.slice(0, 3).map((secao) => (
                          <Badge key={secao} variant="secondary" className="text-xs">
                            {secao}
                          </Badge>
                        ))}
                        {template.secoes.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.secoes.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setActiveTab('generator');
                        }}
                      >
                        Usar Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics de Relatórios
              </CardTitle>
              <CardDescription>
                Estatísticas sobre a geração e uso de relatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700 font-medium">Total de Relatórios</div>
                  <div className="text-2xl font-bold text-blue-800">{reports.length}</div>
                  <div className="text-xs text-blue-600 mt-1">Este mês: +3</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700 font-medium">Templates Mais Usados</div>
                  <div className="text-2xl font-bold text-green-800">Completo</div>
                  <div className="text-xs text-green-600 mt-1">65% dos relatórios</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-700 font-medium">Tempo Médio</div>
                  <div className="text-2xl font-bold text-purple-800">2.3s</div>
                  <div className="text-xs text-purple-600 mt-1">Geração de relatório</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-700 font-medium">Exportações</div>
                  <div className="text-2xl font-bold text-orange-800">47</div>
                  <div className="text-xs text-orange-600 mt-1">PDF: 32, Excel: 15</div>
                </div>
              </div>
              
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Gráficos detalhados de analytics em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;