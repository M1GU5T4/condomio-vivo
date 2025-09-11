import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  color: string;
  unitId: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  unitId: string;
}

export interface Bill {
  id: string;
  month: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  type: string;
  unitId: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  description: string;
  method: string;
  unitId: string;
}

export interface Reservation {
  id: string;
  area: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  unitId: string;
}

export interface Ticket {
  id: string;
  title: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  date: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  unitId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'package' | 'announcement' | 'warning' | 'maintenance' | 'financial';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
  details?: string;
}

export interface NotificationSettings {
  packages: boolean;
  announcements: boolean;
  maintenance: boolean;
  financial: boolean;
}

export interface ResidentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartment: string;
  block: string;
  cpf: string;
  emergencyContact: string;
  profileImage?: string;
}

export interface UseResidentsReturn {
  // Data
  residentData: ResidentData | null;
  vehicles: Vehicle[];
  pets: Pet[];
  bills: Bill[];
  payments: Payment[];
  reservations: Reservation[];
  tickets: Ticket[];
  notifications: Notification[];
  
  // Loading states
  loading: boolean;
  
  // Actions
  updateResidentData: (data: Partial<ResidentData>) => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'unitId'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  removeVehicle: (id: string) => Promise<void>;
  addPet: (pet: Omit<Pet, 'id' | 'unitId'>) => Promise<void>;
  updatePet: (id: string, pet: Partial<Pet>) => Promise<void>;
  removePet: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  downloadBill: (billId: string) => Promise<void>;
  downloadDocument: (type: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useResidents = (): UseResidentsReturn => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // State for all resident data
  const [residentData, setResidentData] = useState<ResidentData | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    packages: true,
    announcements: true,
    maintenance: true,
    financial: true
  });

  // Mock data - In a real app, this would come from an API
  const mockResidentData: ResidentData = {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    apartment: '101',
    block: 'A',
    cpf: '123.456.789-00',
    emergencyContact: '(11) 88888-8888'
  };

  const mockVehicles: Vehicle[] = [
    { id: '1', plate: 'ABC-1234', model: 'Honda Civic', color: 'Preto', unitId: '1' },
    { id: '2', plate: 'XYZ-5678', model: 'Toyota Corolla', color: 'Branco', unitId: '1' }
  ];

  const mockPets: Pet[] = [
    { id: '1', name: 'Rex', type: 'Cão', breed: 'Golden Retriever', unitId: '1' }
  ];

  const mockBills: Bill[] = [
    { id: '1', month: 'Janeiro 2024', amount: 450.00, dueDate: '2024-01-10', status: 'paid', type: 'Condomínio', unitId: '1' },
    { id: '2', month: 'Fevereiro 2024', amount: 450.00, dueDate: '2024-02-10', status: 'paid', type: 'Condomínio', unitId: '1' },
    { id: '3', month: 'Março 2024', amount: 450.00, dueDate: '2024-03-10', status: 'pending', type: 'Condomínio', unitId: '1' },
    { id: '4', month: 'Janeiro 2024', amount: 85.00, dueDate: '2024-01-15', status: 'overdue', type: 'Taxa Extra', unitId: '1' }
  ];

  const mockPayments: Payment[] = [
    { id: '1', date: '2024-01-08', amount: 450.00, description: 'Condomínio - Janeiro 2024', method: 'PIX', unitId: '1' },
    { id: '2', date: '2024-02-07', amount: 450.00, description: 'Condomínio - Fevereiro 2024', method: 'Boleto', unitId: '1' },
    { id: '3', date: '2023-12-10', amount: 450.00, description: 'Condomínio - Dezembro 2023', method: 'Débito Automático', unitId: '1' }
  ];

  const mockReservations: Reservation[] = [
    { id: '1', area: 'Salão de Festas', date: '2024-03-15', time: '19:00-23:00', status: 'confirmed', unitId: '1' },
    { id: '2', area: 'Churrasqueira', date: '2024-03-22', time: '12:00-18:00', status: 'pending', unitId: '1' },
    { id: '3', area: 'Quadra de Tênis', date: '2024-02-28', time: '08:00-10:00', status: 'confirmed', unitId: '1' }
  ];

  const mockTickets: Ticket[] = [
    { id: '1', title: 'Vazamento no banheiro', category: 'Manutenção', status: 'resolved', date: '2024-02-15', priority: 'high', description: 'Vazamento na torneira do banheiro', unitId: '1' },
    { id: '2', title: 'Problema na fechadura', category: 'Segurança', status: 'in_progress', date: '2024-03-01', priority: 'medium', description: 'Fechadura da porta principal com defeito', unitId: '1' },
    { id: '3', title: 'Solicitação de segunda via de cartão', category: 'Administrativo', status: 'open', date: '2024-03-05', priority: 'low', description: 'Perdi o cartão de acesso', unitId: '1' }
  ];

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Encomenda Chegou',
      message: 'Sua encomenda da Amazon chegou na portaria',
      type: 'package',
      priority: 'medium',
      read: false,
      createdAt: '2024-01-15T10:30:00Z',
      details: 'Encomenda de livros - Retirar na portaria até 18h'
    },
    {
      id: '2',
      title: 'Manutenção Programada',
      message: 'Manutenção do elevador social agendada para amanhã',
      type: 'maintenance',
      priority: 'high',
      read: false,
      createdAt: '2024-01-14T15:00:00Z',
      details: 'Das 8h às 12h - Use o elevador de serviço'
    },
    {
      id: '3',
      title: 'Boleto Disponível',
      message: 'Boleto de condomínio de Janeiro já está disponível',
      type: 'financial',
      priority: 'medium',
      read: true,
      createdAt: '2024-01-10T09:00:00Z'
    },
    {
      id: '4',
      title: 'Comunicado Importante',
      message: 'Nova regra para uso da piscina nos finais de semana',
      type: 'announcement',
      priority: 'low',
      read: false,
      createdAt: '2024-01-12T14:20:00Z',
      details: 'Horário de funcionamento alterado: 8h às 20h'
    },
    {
      id: '5',
      title: 'Aviso de Segurança',
      message: 'Atenção: não deixe a porta do prédio aberta',
      type: 'warning',
      priority: 'high',
      read: false,
      createdAt: '2024-01-13T16:45:00Z',
      details: 'Por segurança, sempre certifique-se de que a porta está fechada'
    },
    {
      id: '6',
      title: 'Segunda Encomenda',
      message: 'Nova encomenda dos Correios na portaria',
      type: 'package',
      priority: 'medium',
      read: true,
      createdAt: '2024-01-11T11:15:00Z'
    }
  ];

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be API calls
        // For now, we'll use mock data with a small delay to simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setResidentData(mockResidentData);
        setVehicles(mockVehicles);
        setPets(mockPets);
        setBills(mockBills);
        setPayments(mockPayments);
        setReservations(mockReservations);
        setTickets(mockTickets);
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error loading resident data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, mockResidentData, mockVehicles, mockPets, mockBills, mockPayments, mockReservations, mockTickets, mockNotifications]);

  // Update resident data
  const updateResidentData = async (data: Partial<ResidentData>) => {
    try {
      // In a real app, this would be an API call
      setResidentData(prev => prev ? { ...prev, ...data } : null);
      console.log('Resident data updated:', data);
    } catch (error) {
      console.error('Error updating resident data:', error);
      throw error;
    }
  };

  // Vehicle management
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'unitId'>) => {
    try {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: Date.now().toString(),
        unitId: residentData?.id || '1'
      };
      setVehicles(prev => [...prev, newVehicle]);
      console.log('Vehicle added:', newVehicle);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  };

  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    try {
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...vehicle } : v));
      console.log('Vehicle updated:', id, vehicle);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  };

  const removeVehicle = async (id: string) => {
    try {
      setVehicles(prev => prev.filter(v => v.id !== id));
      console.log('Vehicle removed:', id);
    } catch (error) {
      console.error('Error removing vehicle:', error);
      throw error;
    }
  };

  // Pet management
  const addPet = async (pet: Omit<Pet, 'id' | 'unitId'>) => {
    try {
      const newPet: Pet = {
        ...pet,
        id: Date.now().toString(),
        unitId: residentData?.id || '1'
      };
      setPets(prev => [...prev, newPet]);
      console.log('Pet added:', newPet);
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    }
  };

  const updatePet = async (id: string, pet: Partial<Pet>) => {
    try {
      setPets(prev => prev.map(p => p.id === id ? { ...p, ...pet } : p));
      console.log('Pet updated:', id, pet);
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    }
  };

  const removePet = async (id: string) => {
    try {
      setPets(prev => prev.filter(p => p.id !== id));
      console.log('Pet removed:', id);
    } catch (error) {
      console.error('Error removing pet:', error);
      throw error;
    }
  };

  // Notification management
  const markNotificationAsRead = async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      console.log('Notification marked as read:', id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      console.log('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = async (notificationId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const deleteAllNotifications = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setNotifications([]);
  };

  const updateNotificationSettings = async (newSettings: NotificationSettings): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setNotificationSettings(newSettings);
  };

  // Document downloads
  const downloadBill = async (billId: string) => {
    try {
      // In a real app, this would generate and download the bill PDF
      console.log('Downloading bill:', billId);
      // Simulate download
      const bill = bills.find(b => b.id === billId);
      if (bill) {
        // Create a mock download
        const element = document.createElement('a');
        element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Boleto: ${bill.type} - ${bill.month}\nValor: R$ ${bill.amount.toFixed(2)}\nVencimento: ${bill.dueDate}`);
        element.download = `boleto-${bill.month.replace(' ', '-').toLowerCase()}.txt`;
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (error) {
      console.error('Error downloading bill:', error);
      throw error;
    }
  };

  const downloadDocument = async (type: string) => {
    try {
      console.log('Downloading document:', type);
      // In a real app, this would download the specific document
      // For now, just simulate the download
      const element = document.createElement('a');
      element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Documento: ${type}\nMorador: ${residentData?.name}\nUnidade: ${residentData?.apartment} - Bloco ${residentData?.block}`);
      element.download = `${type.toLowerCase().replace(' ', '-')}.txt`;
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  };

  // Refresh all data
  const refreshData = async () => {
    try {
      setLoading(true);
      // In a real app, this would refetch all data from the API
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Data
    residentData,
    vehicles,
    pets,
    bills,
    payments,
    reservations,
    tickets,
    notifications,
    notificationSettings,
    
    // Loading state
    loading,
    
    // Actions
    updateResidentData,
    addVehicle,
    updateVehicle,
    removeVehicle,
    addPet,
    updatePet,
    removePet,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    updateNotificationSettings,
    downloadBill,
    downloadDocument,
    refreshData
  };
};

export default useResidents;