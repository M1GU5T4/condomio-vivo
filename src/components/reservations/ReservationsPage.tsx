import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Filter, Search, Plus } from 'lucide-react';
import ReservationCalendar from './ReservationCalendar';
import ReservationForm from './ReservationForm';
import ReservationHistory from './ReservationHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Tipos baseados nas especificações técnicas
interface CommonArea {
  id: string;
  name: string;
  description: string;
  capacity: number;
  hourly_rate: number;
  images: string[];
  amenities: string[];
  rules: string[];
  available_hours: {
    start: string;
    end: string;
  };
  status: 'active' | 'maintenance' | 'inactive';
}

interface Reservation {
  id: string;
  area_id: string;
  area_name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
}

// Dados mockados baseados nas especificações
const mockAreas: CommonArea[] = [
  {
    id: '1',
    name: 'Salão de Festas',
    description: 'Amplo salão para eventos e comemorações',
    capacity: 50,
    hourly_rate: 80.00,
    images: ['/placeholder.svg'],
    amenities: ['Som ambiente', 'Ar condicionado', 'Cozinha equipada', 'Banheiros'],
    rules: ['Não é permitido fumar', 'Música até 22h', 'Limpeza obrigatória'],
    available_hours: { start: '08:00', end: '23:00' },
    status: 'active'
  },
  {
    id: '2',
    name: 'Churrasqueira',
    description: 'Área gourmet com churrasqueira e pia',
    capacity: 20,
    hourly_rate: 40.00,
    images: ['/placeholder.svg'],
    amenities: ['Churrasqueira', 'Pia', 'Bancada', 'Tomadas'],
    rules: ['Limpeza obrigatória', 'Não deixar brasas acesas'],
    available_hours: { start: '06:00', end: '22:00' },
    status: 'active'
  },
  {
    id: '3',
    name: 'Quadra Poliesportiva',
    description: 'Quadra para futebol, vôlei e basquete',
    capacity: 30,
    hourly_rate: 25.00,
    images: ['/placeholder.svg'],
    amenities: ['Iluminação', 'Redes', 'Vestiário'],
    rules: ['Uso de tênis obrigatório', 'Não é permitido comida'],
    available_hours: { start: '06:00', end: '22:00' },
    status: 'active'
  }
];

const mockReservations: Reservation[] = [
  {
    id: '1',
    area_id: '1',
    area_name: 'Salão de Festas',
    date: '2024-01-20',
    start_time: '14:00',
    end_time: '18:00',
    status: 'confirmed',
    total_amount: 320.00,
    payment_status: 'paid'
  },
  {
    id: '2',
    area_id: '2',
    area_name: 'Churrasqueira',
    date: '2024-01-25',
    start_time: '12:00',
    end_time: '16:00',
    status: 'pending',
    total_amount: 160.00,
    payment_status: 'pending'
  }
];

const ReservationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('areas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedAreaForReservation, setSelectedAreaForReservation] = useState<CommonArea | null>(null);

  const filteredAreas = mockAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewReservation = (area?: CommonArea) => {
    setSelectedAreaForReservation(area || null);
    setShowReservationForm(true);
    setActiveTab('new-reservation');
  };

  const handleReservationSubmit = (data: { area: string; date: Date; startTime: string; endTime: string; purpose: string; guests?: number; observations?: string }) => {
    console.log('Nova reserva:', data);
    // Aqui você implementaria a lógica para salvar a reserva
    setShowReservationForm(false);
    setActiveTab('my-reservations');
  };

  const handleReservationCancel = () => {
    setShowReservationForm(false);
    setSelectedAreaForReservation(null);
    setActiveTab('areas');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas de Áreas Comuns</h1>
          <p className="text-gray-600 mt-1">Gerencie suas reservas e explore as áreas disponíveis</p>
        </div>
        <Button className="bg-gradient-primary hover:shadow-glow" onClick={() => handleNewReservation()}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Reserva
        </Button>
      </div>

      {/* Navegação por Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="areas" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Áreas Disponíveis
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="new-reservation" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Reserva
          </TabsTrigger>
          <TabsTrigger value="my-reservations" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Minhas Reservas
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Tab: Áreas Disponíveis */}
        <TabsContent value="areas" className="space-y-6">
          {/* Filtros e Busca */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar áreas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                <SelectItem value="party">Salões de festa</SelectItem>
                <SelectItem value="sports">Áreas esportivas</SelectItem>
                <SelectItem value="gourmet">Áreas gourmet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid de Áreas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAreas.map((area) => (
              <Card key={area.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{area.name}</CardTitle>
                  <CardDescription>{area.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Até {area.capacity} pessoas
                    </span>
                    <span className="font-semibold text-green-600">
                      R$ {area.hourly_rate.toFixed(2)}/hora
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {area.available_hours.start} às {area.available_hours.end}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {area.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {area.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{area.amenities.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button className="w-full mt-4" onClick={() => handleNewReservation(area)}>
                    Reservar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Calendário */}
        <TabsContent value="calendar" className="space-y-6">
          <ReservationCalendar
            onDateSelect={(date) => {
              console.log('Data selecionada:', date);
              // Aqui você pode implementar a lógica para abrir o formulário de reserva
            }}
            onReservationClick={(reservation) => {
              console.log('Reserva clicada:', reservation);
              // Aqui você pode implementar a lógica para visualizar detalhes da reserva
            }}
          />
        </TabsContent>

        {/* Tab: Nova Reserva */}
        <TabsContent value="new-reservation" className="space-y-6">
          {showReservationForm ? (
            <ReservationForm
              selectedArea={selectedAreaForReservation}
              selectedDate={selectedDate}
              onSubmit={handleReservationSubmit}
              onCancel={handleReservationCancel}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecione uma área para fazer uma reserva.</p>
              <Button 
                className="mt-4 bg-gradient-primary"
                onClick={() => setActiveTab('areas')}
              >
                Ver Áreas Disponíveis
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Tab: Minhas Reservas */}
        <TabsContent value="my-reservations" className="space-y-6">
          <div className="space-y-4">
            {mockReservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{reservation.area_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(reservation.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {reservation.start_time} - {reservation.end_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status === 'confirmed' ? 'Confirmada' :
                           reservation.status === 'pending' ? 'Pendente' :
                           reservation.status === 'cancelled' ? 'Cancelada' : 'Concluída'}
                        </Badge>
                        <Badge className={getPaymentStatusColor(reservation.payment_status)}>
                          {reservation.payment_status === 'paid' ? 'Pago' :
                           reservation.payment_status === 'pending' ? 'Pendente' : 'Falhou'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-semibold">
                        R$ {reservation.total_amount.toFixed(2)}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                        {reservation.status === 'pending' && (
                          <Button variant="destructive" size="sm">
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Histórico */}
        <TabsContent value="history" className="space-y-6">
          <ReservationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsPage;