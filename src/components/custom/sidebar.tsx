'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  UserCog, 
  Receipt,
  Menu,
  X,
  Store,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Estoque',
    href: '/estoque',
    icon: Package,
  },
  {
    name: 'Clientes',
    href: '/clientes',
    icon: Users,
  },
  {
    name: 'Vendas',
    href: '/vendas',
    icon: ShoppingCart,
  },
  {
    name: 'Funcionários',
    href: '/funcionarios',
    icon: UserCog,
  },
  {
    name: 'Gastos',
    href: '/gastos',
    icon: Receipt,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // Não mostrar sidebar na página de login
  if (pathname === '/login' || pathname === '/cadastro') {
    return null;
  }

  useEffect(() => {
    const userData = localStorage.getItem('lojistaX_user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name || user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lojistaX_user');
    localStorage.removeItem('lojistaX_isAuthenticated');
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-green-50 transition-colors border border-green-200"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-green-700" />
        ) : (
          <Menu className="h-6 w-6 text-green-700" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-green-600 to-emerald-700 text-white transition-transform duration-300 ease-in-out shadow-2xl',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-green-500/30">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Store className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{APP_NAME}</h1>
                <p className="text-xs text-green-100">Sistema de Gestão</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-green-500/30">
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-green-100">Plano Free</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-white text-green-700 shadow-lg font-semibold'
                      : 'text-green-50 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-green-500/30 space-y-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-green-100 mb-1">Plano Atual</p>
              <p className="text-sm font-semibold text-white">Free</p>
              <Link
                href="/planos"
                className="mt-2 block text-center text-xs bg-white text-green-700 py-2 rounded-md hover:bg-green-50 transition-all font-semibold"
              >
                Fazer Upgrade
              </Link>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-white hover:bg-red-500/30 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}
