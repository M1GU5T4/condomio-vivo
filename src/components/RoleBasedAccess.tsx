import { useAuth } from "@/hooks/useAuth";

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles: Array<'tenant' | 'owner' | 'syndic' | 'admin'>;
  fallback?: React.ReactNode;
}

export function RoleBasedAccess({ children, allowedRoles, fallback = null }: RoleBasedAccessProps) {
  const { profile } = useAuth();

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}