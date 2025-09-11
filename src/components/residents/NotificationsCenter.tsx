import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Package, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X, 
  Eye, 
  EyeOff,
  Trash2,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useResidents, Notification } from '@/hooks/useResidents';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationsCenterProps {
  className?: string;
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ className }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    notificationSettings,
    updateNotificationSettings
  } = useResidents();

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'package':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'announcement':
        return <Info className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'maintenance':
        return <Settings className="h-5 w-5 text-orange-600" />;
      case 'financial':
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationTypeBadge = (type: string) => {
    switch (type) {
      case 'package':
        return <Badge className="bg-blue-100 text-blue-800">Encomenda</Badge>;
      case 'announcement':
        return <Badge className="bg-green-100 text-green-800">Comunicado</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Aviso</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800">Manutenção</Badge>;
      case 'financial':
        return <Badge className="bg-purple-100 text-purple-800">Financeiro</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Baixa</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      toast.success('Notificação marcada como lida');
    } catch (error) {
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('Todas as notificações foram marcadas como lidas');
    } catch (error) {
      toast.error('Erro ao marcar todas as notificações como lidas');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      toast.success('Notificação excluída');
    } catch (error) {
      toast.error('Erro ao excluir notificação');
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotifications();
      toast.success('Todas as notificações foram excluídas');
    } catch (error) {
      toast.error('Erro ao excluir todas as notificações');
    }
  };

  const handleUpdateSettings = async (newSettings: { email: boolean; push: boolean; sms: boolean; categories: string[] }) => {
    try {
      await updateNotificationSettings(newSettings);
      toast.success('Configurações atualizadas');
    } catch (error) {
      toast.error('Erro ao atualizar configurações');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (selectedTab) {
      case 'unread':
        return !notification.read;
      case 'packages':
        return notification.type === 'package';
      case 'announcements':
        return notification.type === 'announcement';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const packageNotifications = notifications.filter(n => n.type === 'package').length;
  const announcementNotifications = notifications.filter(n => n.type === 'announcement').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumo das Notificações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                <p className="text-sm text-gray-600">Não lidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{packageNotifications}</p>
                <p className="text-sm text-gray-600">Encomendas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Info className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{announcementNotifications}</p>
                <p className="text-sm text-gray-600">Comunicados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Central de Notificações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Central de Notificações
            </CardTitle>
            <CardDescription>Acompanhe todas as notificações da sua unidade</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurações de Notificações</DialogTitle>
                  <DialogDescription>
                    Personalize como você recebe as notificações
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações de Encomendas</h4>
                      <p className="text-sm text-gray-600">Receba avisos quando chegarem encomendas</p>
                    </div>
                    <Button 
                      variant={notificationSettings?.packages ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateSettings({ ...notificationSettings, packages: !notificationSettings?.packages })}
                    >
                      {notificationSettings?.packages ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Comunicados Gerais</h4>
                      <p className="text-sm text-gray-600">Receba comunicados da administração</p>
                    </div>
                    <Button 
                      variant={notificationSettings?.announcements ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateSettings({ ...notificationSettings, announcements: !notificationSettings?.announcements })}
                    >
                      {notificationSettings?.announcements ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Avisos de Manutenção</h4>
                      <p className="text-sm text-gray-600">Receba avisos sobre manutenções programadas</p>
                    </div>
                    <Button 
                      variant={notificationSettings?.maintenance ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateSettings({ ...notificationSettings, maintenance: !notificationSettings?.maintenance })}
                    >
                      {notificationSettings?.maintenance ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações Financeiras</h4>
                      <p className="text-sm text-gray-600">Receba avisos sobre boletos e pagamentos</p>
                    </div>
                    <Button 
                      variant={notificationSettings?.financial ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateSettings({ ...notificationSettings, financial: !notificationSettings?.financial })}
                    >
                      {notificationSettings?.financial ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <Eye className="h-4 w-4 mr-2" />
                Marcar Todas como Lidas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleDeleteAllNotifications}>
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todas
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Não Lidas ({unreadCount})</TabsTrigger>
              <TabsTrigger value="packages">Encomendas ({packageNotifications})</TabsTrigger>
              <TabsTrigger value="announcements">Comunicados ({announcementNotifications})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="space-y-4 mt-6">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma notificação encontrada</p>
                  <p className="text-sm">Você está em dia com todas as notificações!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                        !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className={`font-medium ${
                                !notification.read ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{formatDate(notification.createdAt)}</span>
                              {getNotificationTypeBadge(notification.type)}
                              {getPriorityBadge(notification.priority)}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1 ml-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedNotification(notification);
                              setNotificationDialogOpen(true);
                              if (!notification.read) {
                                handleMarkAsRead(notification.id);
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog para visualizar notificação */}
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && getNotificationIcon(selectedNotification.type)}
              {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedNotification && formatDate(selectedNotification.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {getNotificationTypeBadge(selectedNotification.type)}
                {getPriorityBadge(selectedNotification.priority)}
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Mensagem</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>
              {selectedNotification.details && (
                <div>
                  <h4 className="font-medium mb-2">Detalhes Adicionais</h4>
                  <p className="text-sm text-gray-600">
                    {selectedNotification.details}
                  </p>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  ID: {selectedNotification.id}
                </div>
                <div className="flex space-x-2">
                  {!selectedNotification.read && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        handleMarkAsRead(selectedNotification.id);
                        setNotificationDialogOpen(false);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Lida
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => setNotificationDialogOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationsCenter;