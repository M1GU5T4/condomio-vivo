import { createContext, useContext, useState } from "react";

interface TestProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'tenant' | 'owner' | 'syndic' | 'admin';
  apartment_number?: string;
  building_id?: string;
  is_active: boolean;
}

interface TestAuthContextType {
  profile: TestProfile | null;
  setTestRole: (role: 'tenant' | 'owner' | 'syndic' | 'admin') => void;
}

const TestAuthContext = createContext<TestAuthContextType | undefined>(undefined);

export function TestAuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<TestProfile>({
    id: 'test-1',
    user_id: 'test-user-1',
    full_name: 'Administrador Teste',
    email: 'admin@teste.com',
    phone: '(11) 99999-9999',
    role: 'admin',
    apartment_number: undefined,
    building_id: 'building-1',
    is_active: true
  });

  const setTestRole = (role: 'tenant' | 'owner' | 'syndic' | 'admin') => {
    setProfile(prev => ({
      ...prev!,
      role,
      full_name: role === 'admin' ? 'Administrador Teste' : 
                role === 'syndic' ? 'Síndico Teste' :
                role === 'owner' ? 'Proprietário Teste' : 'Inquilino Teste',
      apartment_number: role === 'admin' ? undefined : '101'
    }));
  };

  return (
    <TestAuthContext.Provider value={{
      profile,
      setTestRole,
    }}>
      {children}
    </TestAuthContext.Provider>
  );
}

export function useTestAuth() {
  const context = useContext(TestAuthContext);
  if (context === undefined) {
    throw new Error('useTestAuth must be used within a TestAuthProvider');
  }
  return context;
}

// Componente para alternar entre perfis durante o teste
export function RoleToggler() {
  const { profile, setTestRole } = useTestAuth();
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-semibold mb-2">Teste de Perfis</h3>
      <p className="text-xs text-gray-600 mb-2">Atual: {profile?.role} - {profile?.full_name}</p>
      <div className="flex gap-2">
        <button 
          onClick={() => setTestRole('admin')} 
          className={`px-2 py-1 text-xs rounded ${profile?.role === 'admin' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
        >
          Admin
        </button>
        <button 
          onClick={() => setTestRole('syndic')} 
          className={`px-2 py-1 text-xs rounded ${profile?.role === 'syndic' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Síndico
        </button>
        <button 
          onClick={() => setTestRole('owner')} 
          className={`px-2 py-1 text-xs rounded ${profile?.role === 'owner' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Proprietário
        </button>
        <button 
          onClick={() => setTestRole('tenant')} 
          className={`px-2 py-1 text-xs rounded ${profile?.role === 'tenant' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
        >
          Inquilino
        </button>
      </div>
    </div>
  );
}