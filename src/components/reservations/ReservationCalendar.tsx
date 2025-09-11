import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Tipos para o calendário
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  reservations: CalendarReservation[];
}

interface CalendarReservation {
  id: string;
  area_name: string;
  start_time: string;
  end_time: string;
  status: 'available' | 'reserved' | 'maintenance';
  resident_name?: string;
}

interface ReservationCalendarProps {
  selectedAreaId?: string;
  onDateSelect?: (date: Date) => void;
  onReservationClick?: (reservation: CalendarReservation) => void;
}

// Dados mockados para demonstração
const mockReservations: { [key: string]: CalendarReservation[] } = {
  '2024-01-15': [
    {
      id: '1',
      area_name: 'Salão de Festas',
      start_time: '14:00',
      end_time: '18:00',
      status: 'reserved',
      resident_name: 'João Silva'
    },
    {
      id: '2',
      area_name: 'Churrasqueira',
      start_time: '12:00',
      end_time: '16:00',
      status: 'available'
    }
  ],
  '2024-01-20': [
    {
      id: '3',
      area_name: 'Quadra Poliesportiva',
      start_time: '08:00',
      end_time: '10:00',
      status: 'reserved',
      resident_name: 'Maria Santos'
    },
    {
      id: '4',
      area_name: 'Salão de Festas',
      start_time: '19:00',
      end_time: '23:00',
      status: 'maintenance'
    }
  ],
  '2024-01-25': [
    {
      id: '5',
      area_name: 'Churrasqueira',
      start_time: '10:00',
      end_time: '14:00',
      status: 'available'
    }
  ]
};

const areas = [
  { id: 'all', name: 'Todas as áreas' },
  { id: '1', name: 'Salão de Festas' },
  { id: '2', name: 'Churrasqueira' },
  { id: '3', name: 'Quadra Poliesportiva' }
];

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  selectedAreaId = 'all',
  onDateSelect,
  onReservationClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedArea, setSelectedArea] = useState(selectedAreaId);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Funções auxiliares para o calendário
  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const dateKey = currentDay.toISOString().split('T')[0];
      const dayReservations = mockReservations[dateKey] || [];
      
      // Filtrar reservas por área selecionada
      const filteredReservations = selectedArea === 'all' 
        ? dayReservations
        : dayReservations.filter(res => {
            const areaMap: { [key: string]: string } = {
              '1': 'Salão de Festas',
              '2': 'Churrasqueira',
              '3': 'Quadra Poliesportiva'
            };
            return res.area_name === areaMap[selectedArea];
          });
      
      days.push({
        date: currentDay,
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === today.toDateString(),
        reservations: filteredReservations
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      setSelectedDate(day.date);
      onDateSelect?.(day.date);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'reserved': return 'Reservado';
      case 'maintenance': return 'Manutenção';
      default: return 'Indefinido';
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      {/* Controles do Calendário */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-semibold min-w-48 text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-full md:w-48">
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid do Calendário */}
      <Card>
        <CardContent className="p-6">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid dos dias */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={`
                  min-h-24 p-1 border rounded-lg cursor-pointer transition-colors
                  ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                  ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                  ${selectedDate?.toDateString() === day.date.toDateString() ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}
                `}
                onClick={() => handleDateClick(day)}
              >
                <div className="text-sm font-medium mb-1">
                  {day.date.getDate()}
                </div>
                
                {/* Indicadores de reservas */}
                <div className="space-y-1">
                  {day.reservations.slice(0, 2).map((reservation) => (
                    <div
                      key={reservation.id}
                      className={`
                        text-xs px-1 py-0.5 rounded truncate cursor-pointer
                        ${getStatusColor(reservation.status)}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReservationClick?.(reservation);
                      }}
                      title={`${reservation.area_name} - ${reservation.start_time} às ${reservation.end_time}`}
                    >
                      {reservation.start_time}
                    </div>
                  ))}
                  
                  {day.reservations.length > 2 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{day.reservations.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do dia selecionado */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Reservas para {selectedDate.toLocaleDateString('pt-BR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const dateKey = selectedDate.toISOString().split('T')[0];
              const dayReservations = mockReservations[dateKey] || [];
              const filteredReservations = selectedArea === 'all' 
                ? dayReservations
                : dayReservations.filter(res => {
                    const areaMap: { [key: string]: string } = {
                      '1': 'Salão de Festas',
                      '2': 'Churrasqueira',
                      '3': 'Quadra Poliesportiva'
                    };
                    return res.area_name === areaMap[selectedArea];
                  });
              
              if (filteredReservations.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>Nenhuma reserva encontrada para este dia</p>
                  </div>
                );
              }
              
              return (
                <div className="space-y-3">
                  {filteredReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => onReservationClick?.(reservation)}
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{reservation.area_name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reservation.start_time} - {reservation.end_time}
                          </span>
                          {reservation.resident_name && (
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {reservation.resident_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusText(reservation.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              );
            })()
            }
          </CardContent>
        </Card>
      )}

      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
              <span>Reservado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
              <span>Manutenção</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationCalendar;