import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  UserPlus, 
  Home, 
  Phone, 
  Mail, 
  Car, 
  Heart,
  MapPin,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartment: string;
  block: string;
  role: 'owner' | 'tenant';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  moveInDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  vehicles: {
    id: string;
    plate: string;
    model: string;
    color: string;
  }[];
  pets: {
    id: string;
    name: string;
    type: string;
    breed: string;
  }[];
  documents: {
    cpf: string;
    rg: string;
    hasContract: boolean;
  };
}

const mockResidents: Resident[] = [
  {
    id: '1',
    name: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-9999',
    apartment: '101',
    block: 'A',
    role: 'owner',
    status: 'active',
    avatar: '/placeholder.svg',
    moveInDate: '2023-01-15',
    emergencyContact: {
      name: 'João Silva',
      phone: '(11) 88888-8888',
      relationship: 'Cônjuge'
    },
    vehicles: [
      { id: '1', plate: 'ABC-1234', model: 'Honda Civic', color: 'Prata' }
    ],
    pets: [
      { id: '1', name: 'Rex', type: 'Cachorro', breed: 'Golden Retriever' }
    ],
    documents: {
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      hasContract: true
    }
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 77777-7777',
    apartment: '205',
    block: 'B',
    role: 'tenant',
    status: 'active',
    moveInDate: '2023-06-10',
    emergencyContact: {
      name: 'Ana Oliveira',
      phone: '(11) 66666-6666',
      relationship: 'Mãe'
    },
    vehicles: [],
    pets: [],
    documents: {
      cpf: '987.654.321-00',
      rg: '98.765.432-1',
      hasContract: true
    }
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 55555-5555',
    apartment: '302',
    block: 'A',
    role: 'owner',
    status: 'pending',
    moveInDate: '2024-01-05',
    emergencyContact: {
      name: 'Pedro Costa',
      phone: '(11) 44444-4444',
      relationship: 'Irmão'
    },
    vehicles: [
      { id: '2', plate: 'XYZ-5678', model: 'Toyota Corolla', color: 'Branco' }
    ],
    pets: [
      { id: '2', name: 'Mimi', type: 'Gato', breed: 'Persa' }
    ],
    documents: {
      cpf: '456.789.123-00',
      rg: '45.678.912-3',
      hasContract: false
    }
  }
];

export function AdminResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.apartment.includes(searchTerm) ||
                         resident.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || resident.status === filterStatus;
    const matchesRole = filterRole === 'all' || resident.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><AlertCircle className="h-3 w-3 mr-1" />Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Shield className="h-3 w-3 mr-1" />Proprietário</Badge>;
      case 'tenant':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Inquilino</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleStatusChange = (residentId: string, newStatus: string) => {
    setResidents(prev => prev.map(resident => 
      resident.id === residentId ? { ...resident, status: newStatus as 'ativo' | 'inativo' | 'pendente' } : resident
    ));
    toast.success('Status do morador atualizado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Moradores</h1>
          <p className="text-muted-foreground">Visualize e gerencie informações dos moradores</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Morador
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total de Moradores</p>
                <p className="text-2xl font-bold text-blue-900">{residents.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Ativos</p>
                <p className="text-2xl font-bold text-green-900">{residents.filter(r => r.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-900">{residents.filter(r => r.status === 'pending').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Proprietários</p>
                <p className="text-2xl font-bold text-purple-900">{residents.filter(r => r.role === 'owner').length}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, apartamento ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="owner">Proprietário</SelectItem>
                <SelectItem value="tenant">Inquilino</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Residents List */}
      <div className="grid gap-4">
        {filteredResidents.map((resident) => (
          <Card key={resident.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={resident.avatar} alt={resident.name} />
                    <AvatarFallback>{resident.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{resident.name}</h3>
                      {getStatusBadge(resident.status)}
                      {getRoleBadge(resident.role)}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        Apto {resident.apartment} - Bloco {resident.block}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {resident.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {resident.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Desde {new Date(resident.moveInDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedResident(resident)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={resident.avatar} alt={resident.name} />
                            <AvatarFallback>{resident.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {resident.name}
                        </DialogTitle>
                        <DialogDescription>
                          Informações detalhadas do morador
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                          <TabsTrigger value="contact">Contato</TabsTrigger>
                          <TabsTrigger value="assets">Veículos & Pets</TabsTrigger>
                          <TabsTrigger value="documents">Documentos</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="personal" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Nome Completo</Label>
                              <p className="text-sm">{resident.name}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Unidade</Label>
                              <p className="text-sm">Apartamento {resident.apartment} - Bloco {resident.block}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Tipo de Morador</Label>
                              <div className="mt-1">{getRoleBadge(resident.role)}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Status</Label>
                              <div className="mt-1">{getStatusBadge(resident.status)}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Data de Mudança</Label>
                              <p className="text-sm">{new Date(resident.moveInDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="contact" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Email</Label>
                              <p className="text-sm">{resident.email}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Telefone</Label>
                              <p className="text-sm">{resident.phone}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="text-sm font-medium text-gray-700">Contato de Emergência</Label>
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium">{resident.emergencyContact.name}</p>
                                <p className="text-sm text-gray-600">{resident.emergencyContact.phone}</p>
                                <p className="text-sm text-gray-600">{resident.emergencyContact.relationship}</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="assets" className="space-y-4">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Car className="h-4 w-4" />
                                Veículos Cadastrados
                              </Label>
                              {resident.vehicles.length > 0 ? (
                                <div className="mt-2 space-y-2">
                                  {resident.vehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm font-medium">{vehicle.plate}</p>
                                      <p className="text-sm text-gray-600">{vehicle.model} - {vehicle.color}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 mt-2">Nenhum veículo cadastrado</p>
                              )}
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                Animais de Estimação
                              </Label>
                              {resident.pets.length > 0 ? (
                                <div className="mt-2 space-y-2">
                                  {resident.pets.map((pet) => (
                                    <div key={pet.id} className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm font-medium">{pet.name}</p>
                                      <p className="text-sm text-gray-600">{pet.type} - {pet.breed}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 mt-2">Nenhum animal cadastrado</p>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="documents" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">CPF</Label>
                              <p className="text-sm">{resident.documents.cpf}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">RG</Label>
                              <p className="text-sm">{resident.documents.rg}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Contrato</Label>
                              <div className="mt-1">
                                {resident.documents.hasContract ? (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Assinado
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 border-red-200">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Pendente
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                  
                  <Select 
                    value={resident.status} 
                    onValueChange={(value) => handleStatusChange(resident.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResidents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum morador encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou termo de busca.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}