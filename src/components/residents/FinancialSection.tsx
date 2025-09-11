import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Download, FileText, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { useResidents, Bill, Payment } from '@/hooks/useResidents';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinancialSectionProps {
  className?: string;
}

const FinancialSection: React.FC<FinancialSectionProps> = ({ className }) => {
  const {
    bills,
    payments,
    pendingDebts,
    downloadBill,
    downloadPaymentHistory,
    downloadDebtStatement
  } = useResidents();

  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [billDialogOpen, setBillDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('current');

  const currentBills = bills.filter(bill => {
    const billDate = new Date(bill.dueDate);
    const currentDate = new Date();
    return billDate.getMonth() === currentDate.getMonth() && 
           billDate.getFullYear() === currentDate.getFullYear();
  });

  const pastBills = bills.filter(bill => {
    const billDate = new Date(bill.dueDate);
    const currentDate = new Date();
    return billDate < currentDate && 
           (billDate.getMonth() !== currentDate.getMonth() || 
            billDate.getFullYear() !== currentDate.getFullYear());
  });

  const handleDownloadBill = async (billId: string) => {
    try {
      await downloadBill(billId);
      toast.success('Boleto baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao baixar boleto');
    }
  };

  const handleDownloadPaymentHistory = async () => {
    try {
      await downloadPaymentHistory();
      toast.success('Histórico de pagamentos baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao baixar histórico');
    }
  };

  const handleDownloadDebtStatement = async () => {
    try {
      await downloadDebtStatement();
      toast.success('Extrato de débitos baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao baixar extrato');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Vencido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const totalPendingAmount = pendingDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaidThisYear = payments
    .filter(payment => new Date(payment.date).getFullYear() === new Date().getFullYear())
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaidThisYear)}</p>
                <p className="text-sm text-gray-600">Pago este ano</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPendingAmount)}</p>
                <p className="text-sm text-gray-600">Débitos pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{currentBills.length}</p>
                <p className="text-sm text-gray-600">Boletos atuais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boletos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Boletos e 2ª Via
          </CardTitle>
          <CardDescription>Acesse seus boletos atuais e de meses anteriores</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Boletos Atuais</TabsTrigger>
              <TabsTrigger value="past">Meses Anteriores</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-4">
              {currentBills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum boleto atual disponível</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentBills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{bill.description}</h4>
                          {getStatusBadge(bill.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Vencimento: {formatDate(bill.dueDate)}</span>
                          <span>Valor: {formatCurrency(bill.amount)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedBill(bill);
                            setBillDialogOpen(true);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadBill(bill.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              {pastBills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum boleto anterior encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastBills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{bill.description}</h4>
                          {getStatusBadge(bill.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Vencimento: {formatDate(bill.dueDate)}</span>
                          <span>Valor: {formatCurrency(bill.amount)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedBill(bill);
                            setBillDialogOpen(true);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadBill(bill.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          2ª Via
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>Visualize todos os pagamentos realizados</CardDescription>
          </div>
          <Button variant="outline" onClick={handleDownloadPaymentHistory}>
            <Download className="h-4 w-4 mr-2" />
            Baixar Histórico
          </Button>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum pagamento registrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{payment.description}</h4>
                    <p className="text-sm text-gray-600">Data: {formatDate(payment.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                  </div>
                </div>
              ))}
              {payments.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={handleDownloadPaymentHistory}>
                    Ver histórico completo
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extrato de Débitos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Extrato de Débitos</CardTitle>
            <CardDescription>Pendências financeiras da sua unidade</CardDescription>
          </div>
          <Button variant="outline" onClick={handleDownloadDebtStatement}>
            <Download className="h-4 w-4 mr-2" />
            Baixar Extrato
          </Button>
        </CardHeader>
        <CardContent>
          {pendingDebts.length === 0 ? (
            <div className="text-center py-8 text-green-100">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <p className="text-green-800 font-medium">Parabéns! Não há débitos pendentes</p>
              <p className="text-green-600 text-sm">Sua unidade está em dia com os pagamentos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDebts.map((debt) => (
                <div key={debt.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium text-red-800">{debt.description}</h4>
                    <p className="text-sm text-red-600">Vencimento: {formatDate(debt.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">{formatCurrency(debt.amount)}</p>
                    <Badge className="bg-red-100 text-red-800">
                      {Math.floor((new Date().getTime() - new Date(debt.dueDate).getTime()) / (1000 * 60 * 60 * 24))} dias
                    </Badge>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Total de Débitos:</span>
                <span className="text-xl font-bold text-red-600">{formatCurrency(totalPendingAmount)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para visualizar boleto */}
      <Dialog open={billDialogOpen} onOpenChange={setBillDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Boleto</DialogTitle>
            <DialogDescription>
              Informações completas do boleto selecionado
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <p className="text-sm">{selectedBill.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedBill.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valor</Label>
                  <p className="text-sm font-medium">{formatCurrency(selectedBill.amount)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vencimento</Label>
                  <p className="text-sm">{formatDate(selectedBill.dueDate)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Código de Barras</Label>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded">{selectedBill.barcode}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Referência</Label>
                  <p className="text-sm">{selectedBill.reference}</p>
                </div>
              </div>
              <Separator />
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={() => handleDownloadBill(selectedBill.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Boleto
                </Button>
                <Button variant="outline" onClick={() => setBillDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <label className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

export default FinancialSection;