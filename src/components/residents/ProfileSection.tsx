import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Heart, User, Camera } from 'lucide-react';
import { useResidents, Vehicle, Pet } from '@/hooks/useResidents';
import { toast } from 'sonner';

interface ProfileSectionProps {
  className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ className }) => {
  const {
    residentData,
    vehicles,
    pets,
    updateResidentData,
    addVehicle,
    updateVehicle,
    removeVehicle,
    addPet,
    updatePet,
    removePet
  } = useResidents();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: residentData?.name || '',
    email: residentData?.email || '',
    phone: residentData?.phone || '',
    emergencyContact: residentData?.emergencyContact || ''
  });

  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState({
    plate: '',
    model: '',
    color: ''
  });
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Pet form state
  const [petForm, setPetForm] = useState({
    name: '',
    type: '',
    breed: ''
  });
  const [petDialogOpen, setPetDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleSaveProfile = async () => {
    try {
      await updateResidentData(formData);
      setEditMode(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: residentData?.name || '',
      email: residentData?.email || '',
      phone: residentData?.phone || '',
      emergencyContact: residentData?.emergencyContact || ''
    });
    setEditMode(false);
  };

  const handleAddVehicle = async () => {
    try {
      if (!vehicleForm.plate || !vehicleForm.model || !vehicleForm.color) {
        toast.error('Preencha todos os campos do veículo');
        return;
      }

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleForm);
        toast.success('Veículo atualizado com sucesso!');
      } else {
        await addVehicle(vehicleForm);
        toast.success('Veículo adicionado com sucesso!');
      }

      setVehicleForm({ plate: '', model: '', color: '' });
      setVehicleDialogOpen(false);
      setEditingVehicle(null);
    } catch (error) {
      toast.error('Erro ao salvar veículo');
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      plate: vehicle.plate,
      model: vehicle.model,
      color: vehicle.color
    });
    setVehicleDialogOpen(true);
  };

  const handleRemoveVehicle = async (vehicleId: string) => {
    try {
      await removeVehicle(vehicleId);
      toast.success('Veículo removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover veículo');
    }
  };

  const handleAddPet = async () => {
    try {
      if (!petForm.name || !petForm.type || !petForm.breed) {
        toast.error('Preencha todos os campos do pet');
        return;
      }

      if (editingPet) {
        await updatePet(editingPet.id, petForm);
        toast.success('Pet atualizado com sucesso!');
      } else {
        await addPet(petForm);
        toast.success('Pet adicionado com sucesso!');
      }

      setPetForm({ name: '', type: '', breed: '' });
      setPetDialogOpen(false);
      setEditingPet(null);
    } catch (error) {
      toast.error('Erro ao salvar pet');
    }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setPetForm({
      name: pet.name,
      type: pet.type,
      breed: pet.breed
    });
    setPetDialogOpen(true);
  };

  const handleRemovePet = async (petId: string) => {
    try {
      await removePet(petId);
      toast.success('Pet removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover pet');
    }
  };

  if (!residentData) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-gray-500">Carregando dados do perfil...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil Pessoal */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Perfil Pessoal</CardTitle>
              <CardDescription>Gerencie suas informações pessoais</CardDescription>
            </div>
            <div className="flex space-x-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    Salvar
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={residentData.profileImage} />
                <AvatarFallback className="text-lg">
                  {residentData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {editMode && (
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Alterar Foto
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!editMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!editMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!editMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency">Contato de Emergência</Label>
                <Input 
                  id="emergency" 
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  disabled={!editMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Unidade */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Unidade</CardTitle>
            <CardDescription>Dados do seu apartamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Apartamento:</span>
              <Badge variant="secondary">{residentData.apartment}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bloco:</span>
              <Badge variant="secondary">{residentData.block}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">CPF:</span>
              <span className="text-sm text-gray-600">{residentData.cpf}</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status da Unidade</h4>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Veículos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Veículos Cadastrados
            </CardTitle>
            <CardDescription>Gerencie os veículos da sua unidade</CardDescription>
          </div>
          <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => {
                setEditingVehicle(null);
                setVehicleForm({ plate: '', model: '', color: '' });
              }}>
                Adicionar Veículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
                </DialogTitle>
                <DialogDescription>
                  {editingVehicle ? 'Atualize as informações do veículo' : 'Adicione um novo veículo à sua unidade'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa</Label>
                  <Input 
                    id="plate" 
                    placeholder="ABC-1234" 
                    value={vehicleForm.plate}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, plate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input 
                    id="model" 
                    placeholder="Honda Civic" 
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input 
                    id="color" 
                    placeholder="Preto" 
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={handleAddVehicle}>
                    {editingVehicle ? 'Atualizar Veículo' : 'Cadastrar Veículo'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setVehicleDialogOpen(false);
                    setEditingVehicle(null);
                    setVehicleForm({ plate: '', model: '', color: '' });
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum veículo cadastrado</p>
              <p className="text-sm">Clique em "Adicionar Veículo" para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{vehicle.plate}</Badge>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveVehicle(vehicle.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                  <p className="font-medium">{vehicle.model}</p>
                  <p className="text-sm text-gray-600">{vehicle.color}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Animais de Estimação */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Animais de Estimação
            </CardTitle>
            <CardDescription>Cadastre seus pets</CardDescription>
          </div>
          <Dialog open={petDialogOpen} onOpenChange={setPetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => {
                setEditingPet(null);
                setPetForm({ name: '', type: '', breed: '' });
              }}>
                Adicionar Pet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPet ? 'Editar Pet' : 'Cadastrar Animal de Estimação'}
                </DialogTitle>
                <DialogDescription>
                  {editingPet ? 'Atualize as informações do pet' : 'Adicione um novo pet à sua unidade'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="petName">Nome</Label>
                  <Input 
                    id="petName" 
                    placeholder="Rex" 
                    value={petForm.name}
                    onChange={(e) => setPetForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="petType">Tipo</Label>
                  <Input 
                    id="petType" 
                    placeholder="Cão" 
                    value={petForm.type}
                    onChange={(e) => setPetForm(prev => ({ ...prev, type: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Raça</Label>
                  <Input 
                    id="breed" 
                    placeholder="Golden Retriever" 
                    value={petForm.breed}
                    onChange={(e) => setPetForm(prev => ({ ...prev, breed: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={handleAddPet}>
                    {editingPet ? 'Atualizar Pet' : 'Cadastrar Pet'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setPetDialogOpen(false);
                    setEditingPet(null);
                    setPetForm({ name: '', type: '', breed: '' });
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {pets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum pet cadastrado</p>
              <p className="text-sm">Clique em "Adicionar Pet" para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div key={pet.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{pet.name}</h4>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditPet(pet)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemovePet(pet.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{pet.type} - {pet.breed}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;