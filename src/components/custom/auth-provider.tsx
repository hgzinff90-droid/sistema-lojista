'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se está no ambiente do cliente (browser)
    if (typeof window === 'undefined') {
      return;
    }

    // Verificar se está autenticado
    const isAuthenticated = localStorage.getItem('lojistaX_isAuthenticated');
    
    // Se não está autenticado e não está na página de login, redirecionar
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/cadastro') {
      router.push('/login');
    }
    
    // Se está autenticado e está na página de login, redirecionar para dashboard
    if (isAuthenticated && pathname === '/login') {
      router.push('/');
    }

    setIsLoading(false);
  }, [pathname, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
