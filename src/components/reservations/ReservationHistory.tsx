import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Search, Filter, CheckCircle, XCircle, AlertCircle, Eye, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Tipos baseados nas especificações
interface HistoricalReservation {
  id: string;
  area_name: string;
  area_type: string;
  date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  purpose: string;
  status: 'completed' | 'cancelled' | 'no_show';
  total_amount: number;
  payment_method: string;
  payment_status: 'paid' | 'pending' | 'refunded';
  created_at: string;
  special_requests?: string;
  rating?: number;
  review?: string;
  extra_items?: string[];
}

interface ReservationHistoryProps {
  userId?: string;
}

// Dados mockados para demonstração
const mockHistoricalReservations: HistoricalReservation[] = [
  {
    id: '1',
    area_name: 'Salão de Festas',
    area_type: 'Evento',
    date: '2024-01-15',
    start_time: '14:00',
    end_time: '18:00',
    guest_count: 25,
    purpose: 'Aniversário de 15 anos',
    status: 'completed',
    total_amount: 320.00,
    payment_method: 'PIX',
    payment_status: 'paid',
    created_at: '2024-01-10',
    rating: 5,
    review: 'Excelente espaço, muito bem conservado!',
    extra_items: ['Sistema de som', 'Decoração básica']
  },
  {
    id: '2',
    area_name: 'Churrasqueira',
    area_type: 'Lazer',
    date: '2024-01-08',
    start_time: '11:00',
    end_time: '15:00',
    guest_count: 12,
    purpose: 'Reunião familiar',
    status: 'completed',
    total_amount: 160.00,
    payment_method: 'Cartão de Crédito',
    payment_status: 'paid',
    created_at: '2024-01-05',
    rating: 4,
    review: 'Boa experiência, mas poderia ter mais utensílios.',
    extra_items: ['Mesa adicional']
  },
  {
    id: '3',
    area_name: 'Quadra de Tênis',
    area_type: 'Esporte',
    date: '2023-12-20',
    start_time: '08:00',
    end_time: '10:00',
    guest_count: 4,
    purpose: 'Jogo entre amigos',
    status: 'cancelled',
    total_amount: 80.00,
    payment_method: 'PIX',
    payment_status: 'refunded',
    created_at: '2023-12-18',
    special_requests: 'Cancelado devido à chuva'
  },
  {
    id: '4',
    area_name: 'Piscina',
    area_type: 'Lazer',
    date: '2023-12-10',
    start_time: '13:00',
    end_time: '17:00',
    guest_count: 8,
    purpose: 'Festa infantil',
    status: 'no_show',
    total_amount: 200.00,
    payment_method: 'Boleto',
    payment_status: 'paid',
    created_at: '2023-12-05'
  },
  {
    id: '5',
    area_name: 'Salão de Festas',
    area_type: 'Evento',
    date: '2023-11-25',
    start_time: '19:00',
    end_time: '23:00',
    guest_count: 40,
    purpose: 'Confraternização da empresa',
    status: 'completed',
    total_amount: 450.00,
    payment_method: 'PIX',
    payment_status: 'paid',
    created_at: '2023-11-20',
    rating: 5,
    review: 'Perfeito para eventos corporativos!',
    extra_items: ['Sistema de som', 'Mesa adicional', 'Cadeiras extras (10 unidades)']
  }
];

const ReservationHistory: React.FC<ReservationHistoryProps> = ({ userId }) => {
  const [reservations, setReservations] = useState<HistoricalReservation[]>(mockHistoricalReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<HistoricalReservation | null>(null);

  // Filtros
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.area_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      
      const reservationDate = new Date(reservation.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'last_month': {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return reservationDate >= lastMonth;
        }
        case 'last_3_months': {
          const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          return reservationDate >= last3Months;
        }
        case 'last_year': {
          const lastYear = new Date(now.getFullYear() - 1, 0, 1);
          return reservationDate >= lastYear;
        }
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Estatísticas
  const stats = {
    total: reservations.length,
    completed: reservations.filter(r => r.status === 'completed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
    totalSpent: reservations
      .filter(r => r.payment_status === 'paid')
      .reduce((sum, r) => sum + r.total_amount, 0)
  };

  // Helpers
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Concluída', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      cancelled: { label: 'Cancelada', variant: 'secondary' as const, icon: XCircle, color: 'text-red-600' },
      no_show: { label: 'Não Compareceu', variant: 'destructive' as const, icon: AlertCircle, color: 'text-orange-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Pago', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pendente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      refunded: { label: 'Reembolsado', variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Reservas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {stats.totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por área ou propósito..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
                <SelectItem value="no_show">Não Compareceu</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Períodos</SelectItem>
                <SelectItem value="last_month">Último Mês</SelectItem>
                <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                <SelectItem value="last_year">Último Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-2">Nenhuma reserva encontrada</p>
              <p className="text-sm text-gray-400">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Você ainda não fez nenhuma reserva'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{reservation.area_name}</h3>
                        <p className="text-gray-600">{reservation.purpose}</p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(reservation.status)}
                        {getPaymentStatusBadge(reservation.payment_status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(reservation.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{reservation.start_time} - {reservation.end_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{reservation.guest_count} pessoas</span>
                      </div>
                    </div>
                    
                    {reservation.rating && (
                      <div className="flex items-center gap-2 mt-2">
                        {renderStars(reservation.rating)}
                        <span className="text-sm text-gray-600">({reservation.rating}/5)</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="font-semibold text-lg">R$ {reservation.total_amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{reservation.payment_method}</p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes da Reserva #{reservation.id}</DialogTitle>
                          <DialogDescription>
                            Informações completas da reserva
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedReservation && (
                          <div className="space-y-6">
                            {/* Informações Básicas */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Área</Label>
                                <p className="font-semibold">{selectedReservation.area_name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Tipo</Label>
                                <p>{selectedReservation.area_type}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Data</Label>
                                <p>{formatDate(selectedReservation.date)}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Horário</Label>
                                <p>{selectedReservation.start_time} - {selectedReservation.end_time}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Convidados</Label>
                                <p>{selectedReservation.guest_count} pessoas</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Status</Label>
                                <div className="mt-1">
                                  {getStatusBadge(selectedReservation.status)}
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            {/* Propósito */}
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Propósito</Label>
                              <p className="mt-1">{selectedReservation.purpose}</p>
                            </div>
                            
                            {/* Itens Extras */}
                            {selectedReservation.extra_items && selectedReservation.extra_items.length > 0 && (
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Itens Extras</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {selectedReservation.extra_items.map((item, index) => (
                                    <Badge key={index} variant="outline">{item}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Solicitações Especiais */}
                            {selectedReservation.special_requests && (
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Solicitações Especiais</Label>
                                <p className="mt-1">{selectedReservation.special_requests}</p>
                              </div>
                            )}
                            
                            <Separator />
                            
                            {/* Informações de Pagamento */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Valor Total</Label>
                                <p className="font-semibold text-lg">R$ {selectedReservation.total_amount.toFixed(2)}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Método de Pagamento</Label>
                                <p>{selectedReservation.payment_method}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Status do Pagamento</Label>
                                <div className="mt-1">
                                  {getPaymentStatusBadge(selectedReservation.payment_status)}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Data da Reserva</Label>
                                <p>{formatDate(selectedReservation.created_at)}</p>
                              </div>
                            </div>
                            
                            {/* Avaliação */}
                            {selectedReservation.rating && (
                              <>
                                <Separator />
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Sua Avaliação</Label>
                                  <div className="flex items-center gap-2 mt-1">
                                    {renderStars(selectedReservation.rating)}
                                    <span className="text-sm text-gray-600">({selectedReservation.rating}/5)</span>
                                  </div>
                                  {selectedReservation.review && (
                                    <p className="mt-2 text-sm italic">"{selectedReservation.review}"</p>
                                  )}
                                </div>
                              </>
                            )}
                            
                            {/* Ações */}
                            <div className="flex gap-2 pt-4">
                              <Button variant="outline" className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Baixar Comprovante
                              </Button>
                              {selectedReservation.status === 'completed' && !selectedReservation.rating && (
                                <Button className="flex-1 bg-gradient-primary">
                                  <Star className="h-4 w-4 mr-2" />
                                  Avaliar Reserva
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReservationHistory;