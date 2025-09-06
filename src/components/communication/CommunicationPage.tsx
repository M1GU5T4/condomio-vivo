import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  MessageCircle, 
  FileText, 
  Plus,
  Users,
  Clock,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react";

// Mock data para enquetes
const mockPolls = [
  {
    id: "1",
    title: "Horário de funcionamento da piscina",
    description: "Qual o melhor horário para funcionamento da piscina nos finais de semana?",
    status: "active",
    endDate: "2024-01-15",
    totalVotes: 45,
    options: [
      { id: "1", text: "8h às 18h", votes: 20 },
      { id: "2", text: "9h às 19h", votes: 15 },
      { id: "3", text: "10h às 20h", votes: 10 }
    ]
  },
  {
    id: "2",
    title: "Reforma da área de lazer",
    description: "Aprovação do orçamento para reforma da área de lazer infantil",
    status: "closed",
    endDate: "2024-01-10",
    totalVotes: 78,
    options: [
      { id: "1", text: "Aprovar orçamento", votes: 52 },
      { id: "2", text: "Rejeitar orçamento", votes: 26 }
    ]
  }
];

// Mock data para fórum
const mockForumTopics = [
  {
    id: "1",
    title: "Problema com barulho no 5º andar",
    author: "Maria Silva",
    apartment: "Apt. 302",
    createdAt: "2h atrás",
    replies: 8,
    lastReply: "30 min atrás",
    category: "Reclamações",
    isResolved: false
  },
  {
    id: "2",
    title: "Sugestão: Horário de silêncio",
    author: "João Santos",
    apartment: "Apt. 1205",
    createdAt: "1 dia atrás",
    replies: 15,
    lastReply: "2h atrás",
    category: "Sugestões",
    isResolved: false
  },
  {
    id: "3",
    title: "Organização de festa junina",
    author: "Ana Costa",
    apartment: "Apt. 805",
    createdAt: "3 dias atrás",
    replies: 23,
    lastReply: "1 dia atrás",
    category: "Eventos",
    isResolved: true
  }
];

// Mock data para documentos
const mockDocuments = [
  {
    id: "1",
    title: "Regulamento Interno",
    description: "Regulamento interno do condomínio atualizado em 2024",
    category: "Regulamentos",
    uploadDate: "2024-01-01",
    fileSize: "2.5 MB",
    fileType: "PDF",
    downloads: 156
  },
  {
    id: "2",
    title: "Ata da Assembleia - Janeiro 2024",
    description: "Ata da assembleia ordinária realizada em janeiro",
    category: "Atas",
    uploadDate: "2024-01-15",
    fileSize: "1.8 MB",
    fileType: "PDF",
    downloads: 89
  },
  {
    id: "3",
    title: "Manual da Piscina",
    description: "Instruções de uso e horários da área de lazer",
    category: "Manuais",
    uploadDate: "2024-01-10",
    fileSize: "850 KB",
    fileType: "PDF",
    downloads: 234
  },
  {
    id: "4",
    title: "Orçamento Anual 2024",
    description: "Previsão orçamentária para o ano de 2024",
    category: "Financeiro",
    uploadDate: "2023-12-20",
    fileSize: "3.2 MB",
    fileType: "PDF",
    downloads: 67
  }
];

export function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("polls");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-hero rounded-xl p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold mb-2">Central de Comunicação</h2>
        <p className="text-primary-foreground/80">
          Participe das enquetes, discussões e acesse documentos importantes do condomínio.
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="polls" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Enquetes
          </TabsTrigger>
          <TabsTrigger value="forum" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Fórum
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Central de Documentos
          </TabsTrigger>
        </TabsList>

        {/* Enquetes Tab */}
        <TabsContent value="polls" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Enquetes Ativas</h3>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova Enquete
            </Button>
          </div>

          <div className="grid gap-6">
            {mockPolls.map((poll) => (
              <Card key={poll.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{poll.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">{poll.description}</p>
                    </div>
                    <Badge variant={poll.status === "active" ? "default" : "secondary"}>
                      {poll.status === "active" ? "Ativa" : "Encerrada"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {poll.options.map((option) => {
                      const percentage = (option.votes / poll.totalVotes) * 100;
                      return (
                        <div key={option.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{option.text}</span>
                            <span className="text-sm text-muted-foreground">
                              {option.votes} votos ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {poll.totalVotes} votos
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Encerra em {poll.endDate}
                        </span>
                      </div>
                      {poll.status === "active" && (
                        <Button size="sm">
                          Votar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Fórum Tab */}
        <TabsContent value="forum" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Discussões do Fórum</h3>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tópico
            </Button>
          </div>

          <div className="grid gap-4">
            {mockForumTopics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{topic.title}</h4>
                        {topic.isResolved && (
                          <Badge variant="outline" className="text-success border-success">
                            Resolvido
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>Por {topic.author} • {topic.apartment}</span>
                        <span>{topic.createdAt}</span>
                        <Badge variant="secondary">{topic.category}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {topic.replies} respostas
                        </span>
                        <span className="text-muted-foreground">
                          Última resposta: {topic.lastReply}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Central de Documentos Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Central de Documentos</h3>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Documento
            </Button>
          </div>

          <div className="grid gap-4">
            {mockDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-lg">{doc.title}</h4>
                        <Badge variant="outline">{doc.category}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{doc.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Enviado em {doc.uploadDate}</span>
                        <span>{doc.fileSize} • {doc.fileType}</span>
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {doc.downloads} downloads
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}