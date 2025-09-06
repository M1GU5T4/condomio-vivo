import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Upload, Search, Filter, Eye, Download, Share2, Clock, Users, Lock, Bell, Tag, History, FileCheck, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  version: string;
  status: 'Ativo' | 'Arquivado' | 'Rascunho';
  permissions: string[];
  tags: string[];
  views: number;
  lastViewed: string;
  sharedWith: string[];
  description: string;
}

interface DocumentVersion {
  id: string;
  version: string;
  date: string;
  author: string;
  changes: string;
  size: string;
}

interface ViewHistory {
  id: string;
  user: string;
  date: string;
  time: string;
  action: string;
}

const DocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showViewHistory, setShowViewHistory] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Mock data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Ata da Reunião - Janeiro 2024',
      category: 'Atas de Reunião',
      type: 'PDF',
      size: '2.5 MB',
      uploadDate: '2024-01-15',
      lastModified: '2024-01-16',
      version: '1.2',
      status: 'Ativo',
      permissions: ['Todos os Moradores', 'Conselho'],
      tags: ['reunião', 'janeiro', 'decisões'],
      views: 45,
      lastViewed: '2024-01-20',
      sharedWith: ['Todos os Moradores'],
      description: 'Ata da reunião ordinária de janeiro com decisões sobre obras e melhorias'
    },
    {
      id: '2',
      name: 'Regimento Interno Atualizado',
      category: 'Regimento',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-10',
      lastModified: '2024-01-12',
      version: '3.0',
      status: 'Ativo',
      permissions: ['Todos os Moradores'],
      tags: ['regimento', 'normas', 'atualização'],
      views: 128,
      lastViewed: '2024-01-19',
      sharedWith: ['Todos os Moradores'],
      description: 'Versão atualizada do regimento interno com novas normas de convivência'
    },
    {
      id: '3',
      name: 'Balancete Dezembro 2023',
      category: 'Financeiro',
      type: 'PDF',
      size: '890 KB',
      uploadDate: '2024-01-05',
      lastModified: '2024-01-05',
      version: '1.0',
      status: 'Ativo',
      permissions: ['Conselho', 'Síndico'],
      tags: ['balancete', 'dezembro', 'financeiro'],
      views: 23,
      lastViewed: '2024-01-18',
      sharedWith: ['Conselho'],
      description: 'Demonstrativo financeiro do mês de dezembro de 2023'
    },
    {
      id: '4',
      name: 'Contrato Empresa de Limpeza',
      category: 'Contratos',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2023-12-20',
      lastModified: '2024-01-08',
      version: '1.1',
      status: 'Ativo',
      permissions: ['Síndico', 'Administração'],
      tags: ['contrato', 'limpeza', 'serviços'],
      views: 12,
      lastViewed: '2024-01-17',
      sharedWith: ['Administração'],
      description: 'Contrato de prestação de serviços de limpeza renovado'
    }
  ];

  const documentVersions: DocumentVersion[] = [
    {
      id: '1',
      version: '1.2',
      date: '2024-01-16',
      author: 'João Silva (Síndico)',
      changes: 'Correção de dados e inclusão de anexo',
      size: '2.5 MB'
    },
    {
      id: '1',
      version: '1.1',
      date: '2024-01-15',
      author: 'Maria Santos (Secretária)',
      changes: 'Revisão ortográfica e formatação',
      size: '2.4 MB'
    },
    {
      id: '1',
      version: '1.0',
      date: '2024-01-15',
      author: 'João Silva (Síndico)',
      changes: 'Versão inicial do documento',
      size: '2.3 MB'
    }
  ];

  const viewHistory: ViewHistory[] = [
    {
      id: '1',
      user: 'Ana Costa - Apto 101',
      date: '2024-01-20',
      time: '14:30',
      action: 'Visualizou'
    },
    {
      id: '2',
      user: 'Carlos Oliveira - Apto 205',
      date: '2024-01-20',
      time: '10:15',
      action: 'Baixou'
    },
    {
      id: '3',
      user: 'Fernanda Lima - Apto 303',
      date: '2024-01-19',
      time: '16:45',
      action: 'Visualizou'
    },
    {
      id: '4',
      user: 'Roberto Santos - Apto 402',
      date: '2024-01-19',
      time: '09:20',
      action: 'Compartilhou'
    }
  ];

  const categories = ['all', 'Atas de Reunião', 'Regimento', 'Financeiro', 'Contratos', 'Comunicados', 'Outros'];
  const permissions = ['Todos os Moradores', 'Conselho', 'Síndico', 'Administração', 'Proprietários'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Arquivado': return 'bg-gray-100 text-gray-800';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Atas de Reunião': return 'bg-blue-100 text-blue-800';
      case 'Regimento': return 'bg-purple-100 text-purple-800';
      case 'Financeiro': return 'bg-green-100 text-green-800';
      case 'Contratos': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total de Documentos</p>
                <p className="text-2xl font-bold text-blue-900">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Documentos Ativos</p>
                <p className="text-2xl font-bold text-green-900">{documents.filter(d => d.status === 'Ativo').length}</p>
              </div>
              <FileCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Visualizações Hoje</p>
                <p className="text-2xl font-bold text-purple-900">24</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pendentes Revisão</p>
                <p className="text-2xl font-bold text-orange-900">3</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {/* Barra de Busca e Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar documentos por nome, conteúdo ou tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    {categories.slice(1).map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Documentos */}
          <div className="grid gap-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">{document.name}</h3>
                        <Badge className={getStatusColor(document.status)}>
                          {document.status}
                        </Badge>
                        <Badge className={getCategoryColor(document.category)}>
                          {document.category}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{document.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Tipo:</span> {document.type}
                        </div>
                        <div>
                          <span className="font-medium">Tamanho:</span> {document.size}
                        </div>
                        <div>
                          <span className="font-medium">Versão:</span> {document.version}
                        </div>
                        <div>
                          <span className="font-medium">Visualizações:</span> {document.views}
                        </div>
                        <div>
                          <span className="font-medium">Upload:</span> {new Date(document.uploadDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Modificado:</span> {new Date(document.lastModified).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Último acesso:</span> {new Date(document.lastViewed).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Compartilhado com:</span> {document.sharedWith.join(', ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedDocument(document)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Compartilhar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Compartilhar Documento</DialogTitle>
                            <DialogDescription>
                              Selecione com quem deseja compartilhar este documento
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Grupos de Usuários</Label>
                              <div className="space-y-2 mt-2">
                                {permissions.map((permission) => (
                                  <div key={permission} className="flex items-center space-x-2">
                                    <Checkbox id={permission} />
                                    <Label htmlFor={permission}>{permission}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="specific-users">Usuários Específicos</Label>
                              <Input id="specific-users" placeholder="Digite o nome ou apartamento..." />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setShowShareDialog(false)}>Cancelar</Button>
                              <Button onClick={() => setShowShareDialog(false)}>Compartilhar</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedDocument(document)}>
                            <History className="h-4 w-4 mr-2" />
                            Versões
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Histórico de Versões</DialogTitle>
                            <DialogDescription>
                              Versões anteriores do documento "{selectedDocument?.name}"
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {documentVersions.map((version, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-semibold">Versão {version.version}</h4>
                                    <p className="text-sm text-gray-600">{version.author}</p>
                                  </div>
                                  <div className="text-right text-sm text-gray-500">
                                    <p>{new Date(version.date).toLocaleDateString('pt-BR')}</p>
                                    <p>{version.size}</p>
                                  </div>
                                </div>
                                <p className="text-sm mb-3">{version.changes}</p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Baixar
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Restaurar
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={showViewHistory} onOpenChange={setShowViewHistory}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedDocument(document)}>
                            <Users className="h-4 w-4 mr-2" />
                            Acessos
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Histórico de Visualizações</DialogTitle>
                            <DialogDescription>
                              Registro de acessos ao documento "{selectedDocument?.name}"
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {viewHistory.map((view, index) => (
                              <div key={index} className="flex justify-between items-center p-3 border rounded">
                                <div>
                                  <p className="font-medium">{view.user}</p>
                                  <p className="text-sm text-gray-600">{view.action}</p>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  <p>{new Date(view.date).toLocaleDateString('pt-BR')}</p>
                                  <p>{view.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Novo Documento</CardTitle>
              <CardDescription>
                Faça upload de um novo documento para o sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="doc-name">Nome do Documento</Label>
                  <Input id="doc-name" placeholder="Digite o nome do documento" />
                </div>
                <div>
                  <Label htmlFor="doc-category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="doc-description">Descrição</Label>
                <Textarea id="doc-description" placeholder="Descreva o conteúdo do documento" />
              </div>
              
              <div>
                <Label htmlFor="doc-tags">Tags</Label>
                <Input id="doc-tags" placeholder="Digite as tags separadas por vírgula" />
              </div>
              
              <div>
                <Label>Permissões de Acesso</Label>
                <div className="space-y-2 mt-2">
                  {permissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox id={`upload-${permission}`} />
                      <Label htmlFor={`upload-${permission}`}>{permission}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Arraste e solte o arquivo aqui</p>
                <p className="text-gray-500 mb-4">ou clique para selecionar</p>
                <Button variant="outline">
                  Selecionar Arquivo
                </Button>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Fazer Upload</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Permissões</CardTitle>
              <CardDescription>
                Configure as permissões de acesso para diferentes grupos de usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {permissions.map((permission) => (
                  <div key={permission} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">{permission}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Pode Visualizar</Label>
                        <div className="space-y-2 mt-2">
                          {categories.slice(1).map(category => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox id={`view-${permission}-${category}`} defaultChecked />
                              <Label htmlFor={`view-${permission}-${category}`} className="text-sm">{category}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Pode Baixar</Label>
                        <div className="space-y-2 mt-2">
                          {categories.slice(1).map(category => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox id={`download-${permission}-${category}`} defaultChecked />
                              <Label htmlFor={`download-${permission}-${category}`} className="text-sm">{category}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Pode Compartilhar</Label>
                        <div className="space-y-2 mt-2">
                          {categories.slice(1).map(category => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox id={`share-${permission}-${category}`} />
                              <Label htmlFor={`share-${permission}-${category}`} className="text-sm">{category}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button>Salvar Permissões</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure quando e como os moradores serão notificados sobre documentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Notificações Automáticas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Novo documento adicionado</Label>
                        <p className="text-sm text-gray-500">Notificar quando um novo documento for publicado</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Documento atualizado</Label>
                        <p className="text-sm text-gray-500">Notificar quando um documento for modificado</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Documento compartilhado</Label>
                        <p className="text-sm text-gray-500">Notificar quando um documento for compartilhado especificamente</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Lembrete de documentos importantes</Label>
                        <p className="text-sm text-gray-500">Enviar lembretes sobre documentos que requerem atenção</p>
                      </div>
                      <Checkbox />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Configurações por Categoria</h3>
                  <div className="space-y-4">
                    {categories.slice(1).map(category => (
                      <div key={category} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{category}</h4>
                          <Checkbox defaultChecked />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Grupos a notificar</Label>
                            <div className="space-y-2 mt-2">
                              {permissions.map(permission => (
                                <div key={permission} className="flex items-center space-x-2">
                                  <Checkbox id={`notify-${category}-${permission}`} defaultChecked />
                                  <Label htmlFor={`notify-${category}-${permission}`} className="text-sm">{permission}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label>Método de notificação</Label>
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id={`email-${category}`} defaultChecked />
                                <Label htmlFor={`email-${category}`} className="text-sm">E-mail</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id={`app-${category}`} defaultChecked />
                                <Label htmlFor={`app-${category}`} className="text-sm">Notificação no App</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id={`sms-${category}`} />
                                <Label htmlFor={`sms-${category}`} className="text-sm">SMS</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Salvar Configurações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentsPage;