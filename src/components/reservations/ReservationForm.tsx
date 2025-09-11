import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CreditCard, AlertCircle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

// Tipos baseados nas especificações
interface ReservationFormData {
  area_id: string;
  date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  purpose: string;
  special_requests: string;
  accepts_terms: boolean;
  payment_method: 'pix' | 'boleto' | 'credit_card';
  extra_items: string[];
}

interface CommonArea {
  id: string;
  name: string;
  description: string;
  capacity: number;
  hourly_rate: number;
  available_hours: {
    start: string;
    end: string;
  };
  rules: string[];
  amenities: string[];
}

interface ExtraItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface ReservationFormProps {
  selectedArea?: CommonArea;
  selectedDate?: Date;
  onSubmit: (data: ReservationFormData) => void;
  onCancel: () => void;
}

// Dados mockados
const mockAreas: CommonArea[] = [
  {
    id: '1',
    name: 'Salão de Festas',
    description: 'Amplo salão para eventos e comemorações',
    capacity: 50,
    hourly_rate: 80.00,
    available_hours: { start: '08:00', end: '23:00' },
    rules: ['Não é permitido fumar', 'Música até 22h', 'Limpeza obrigatória'],
    amenities: ['Som ambiente', 'Ar condicionado', 'Cozinha equipada']
  },
  {
    id: '2',
    name: 'Churrasqueira',
    description: 'Área gourmet com churrasqueira e pia',
    capacity: 20,
    hourly_rate: 40.00,
    available_hours: { start: '06:00', end: '22:00' },
    rules: ['Limpeza obrigatória', 'Não deixar brasas acesas'],
    amenities: ['Churrasqueira', 'Pia', 'Bancada']
  }
];

const extraItems: ExtraItem[] = [
  { id: '1', name: 'Mesa adicional', price: 25.00, description: 'Mesa redonda para 8 pessoas' },
  { id: '2', name: 'Cadeiras extras (10 unidades)', price: 30.00, description: 'Conjunto de 10 cadeiras' },
  { id: '3', name: 'Sistema de som', price: 50.00, description: 'Equipamento de som profissional' },
  { id: '4', name: 'Decoração básica', price: 75.00, description: 'Decoração temática simples' }
];

const ReservationForm: React.FC<ReservationFormProps> = ({
  selectedArea,
  selectedDate,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<ReservationFormData>({
    area_id: selectedArea?.id || '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    start_time: '',
    end_time: '',
    guest_count: 1,
    purpose: '',
    special_requests: '',
    accepts_terms: false,
    payment_method: 'pix',
    extra_items: []
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validações
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.area_id) {
      newErrors.area_id = 'Selecione uma área';
    }

    if (!formData.date) {
      newErrors.date = 'Selecione uma data';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'A data deve ser futura';
      }
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Selecione o horário de início';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'Selecione o horário de término';
    }

    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        newErrors.end_time = 'O horário de término deve ser posterior ao início';
      }
    }

    const selectedAreaData = mockAreas.find(area => area.id === formData.area_id);
    if (selectedAreaData) {
      if (formData.guest_count > selectedAreaData.capacity) {
        newErrors.guest_count = `Máximo de ${selectedAreaData.capacity} pessoas`;
      }
    }

    if (formData.guest_count < 1) {
      newErrors.guest_count = 'Mínimo de 1 pessoa';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Descreva o propósito da reserva';
    }

    if (!formData.accepts_terms) {
      newErrors.accepts_terms = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cálculo do valor total
  const calculateTotal = (): number => {
    const selectedAreaData = mockAreas.find(area => area.id === formData.area_id);
    if (!selectedAreaData || !formData.start_time || !formData.end_time) return 0;

    const startHour = parseInt(formData.start_time.split(':')[0]);
    const endHour = parseInt(formData.end_time.split(':')[0]);
    const hours = endHour - startHour;
    
    const areaTotal = hours * selectedAreaData.hourly_rate;
    const extrasTotal = formData.extra_items.reduce((total, itemId) => {
      const item = extraItems.find(i => i.id === itemId);
      return total + (item?.price || 0);
    }, 0);

    return areaTotal + extrasTotal;
  };

  // Handlers
  const handleInputChange = (field: keyof ReservationFormData, value: string | number | boolean | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleExtraItemToggle = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      extra_items: prev.extra_items.includes(itemId)
        ? prev.extra_items.filter(id => id !== itemId)
        : [...prev.extra_items, itemId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit(formData);
    } catch (error) {
      console.error('Erro ao enviar reserva:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAreaData = mockAreas.find(area => area.id === formData.area_id);
  const totalAmount = calculateTotal();

  // Gerar opções de horário
  const generateTimeOptions = (start: string, end: string) => {
    const options = [];
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    
    for (let hour = startHour; hour <= endHour; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    return options;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Nova Reserva
          </CardTitle>
          <CardDescription>
            Preencha os dados para solicitar sua reserva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção de Área */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="area">Área Comum *</Label>
                <Select
                  value={formData.area_id}
                  onValueChange={(value) => handleInputChange('area_id', value)}
                >
                  <SelectTrigger className={errors.area_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAreas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{area.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            R$ {area.hourly_rate}/h
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.area_id && (
                  <p className="text-sm text-red-500">{errors.area_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={errors.date ? 'border-red-500' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date}</p>
                )}
              </div>
            </div>

            {/* Horários */}
            {selectedAreaData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Horário de Início *</Label>
                  <Select
                    value={formData.start_time}
                    onValueChange={(value) => handleInputChange('start_time', value)}
                  >
                    <SelectTrigger className={errors.start_time ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeOptions(
                        selectedAreaData.available_hours.start,
                        selectedAreaData.available_hours.end
                      ).map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.start_time && (
                    <p className="text-sm text-red-500">{errors.start_time}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">Horário de Término *</Label>
                  <Select
                    value={formData.end_time}
                    onValueChange={(value) => handleInputChange('end_time', value)}
                  >
                    <SelectTrigger className={errors.end_time ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeOptions(
                        selectedAreaData.available_hours.start,
                        selectedAreaData.available_hours.end
                      ).map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.end_time && (
                    <p className="text-sm text-red-500">{errors.end_time}</p>
                  )}
                </div>
              </div>
            )}

            {/* Número de Convidados e Propósito */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="guest_count">Número de Convidados *</Label>
                <Input
                  id="guest_count"
                  type="number"
                  min="1"
                  max={selectedAreaData?.capacity || 100}
                  value={formData.guest_count}
                  onChange={(e) => handleInputChange('guest_count', parseInt(e.target.value) || 1)}
                  className={errors.guest_count ? 'border-red-500' : ''}
                />
                {selectedAreaData && (
                  <p className="text-sm text-gray-500">
                    Capacidade máxima: {selectedAreaData.capacity} pessoas
                  </p>
                )}
                {errors.guest_count && (
                  <p className="text-sm text-red-500">{errors.guest_count}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Propósito da Reserva *</Label>
                <Input
                  id="purpose"
                  placeholder="Ex: Aniversário, reunião familiar..."
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  className={errors.purpose ? 'border-red-500' : ''}
                />
                {errors.purpose && (
                  <p className="text-sm text-red-500">{errors.purpose}</p>
                )}
              </div>
            </div>

            {/* Solicitações Especiais */}
            <div className="space-y-2">
              <Label htmlFor="special_requests">Solicitações Especiais</Label>
              <Textarea
                id="special_requests"
                placeholder="Descreva qualquer necessidade especial ou observação..."
                value={formData.special_requests}
                onChange={(e) => handleInputChange('special_requests', e.target.value)}
                rows={3}
              />
            </div>

            {/* Itens Extras */}
            <div className="space-y-4">
              <Label>Itens Extras (Opcionais)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extraItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`extra-${item.id}`}
                      checked={formData.extra_items.includes(item.id)}
                      onCheckedChange={() => handleExtraItemToggle(item.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`extra-${item.id}`} className="font-medium">
                        {item.name}
                      </Label>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm font-semibold text-green-600">
                        + R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Método de Pagamento */}
            <div className="space-y-4">
              <Label>Método de Pagamento</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'pix', label: 'PIX', icon: '💳' },
                  { value: 'boleto', label: 'Boleto', icon: '📄' },
                  { value: 'credit_card', label: 'Cartão de Crédito', icon: '💳' }
                ].map((method) => (
                  <div
                    key={method.value}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-colors
                      ${formData.payment_method === method.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => handleInputChange('payment_method', method.value)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="font-medium">{method.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo do Valor */}
            {totalAmount > 0 && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Valor da área ({formData.start_time} - {formData.end_time})</span>
                      <span>R$ {(totalAmount - formData.extra_items.reduce((total, itemId) => {
                        const item = extraItems.find(i => i.id === itemId);
                        return total + (item?.price || 0);
                      }, 0)).toFixed(2)}</span>
                    </div>
                    {formData.extra_items.length > 0 && (
                      <div className="space-y-1">
                        {formData.extra_items.map(itemId => {
                          const item = extraItems.find(i => i.id === itemId);
                          return item ? (
                            <div key={itemId} className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <span>R$ {item.price.toFixed(2)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>R$ {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Regras da Área */}
            {selectedAreaData && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Regras da {selectedAreaData.name}:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {selectedAreaData.rules.map((rule, index) => (
                      <li key={index} className="text-sm">{rule}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Aceite de Termos */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="accepts_terms"
                checked={formData.accepts_terms}
                onCheckedChange={(checked) => handleInputChange('accepts_terms', checked)}
                className={errors.accepts_terms ? 'border-red-500' : ''}
              />
              <Label htmlFor="accepts_terms" className="text-sm leading-relaxed">
                Eu aceito os termos de uso da área comum e me comprometo a seguir todas as regras estabelecidas. 
                Estou ciente de que sou responsável por qualquer dano causado durante o período da reserva.
              </Label>
            </div>
            {errors.accepts_terms && (
              <p className="text-sm text-red-500 ml-6">{errors.accepts_terms}</p>
            )}

            {/* Botões */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar Reserva
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationForm;