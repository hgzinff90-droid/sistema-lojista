// Constantes do sistema Lojista X

export const APP_NAME = 'Lojista X';
export const APP_DESCRIPTION = 'Sistema completo para gestão de lojas e vendas';

// Planos
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    maxProducts: 10,
    maxSalesPerDay: 1,
    maxEmployees: 1,
    features: [
      '1 venda por dia',
      'Máximo 10 produtos',
      '1 funcionário vendedor',
      'Dashboard básico',
    ],
  },
  pro: {
    name: 'Pro',
    price: 49.90,
    maxProducts: null,
    maxSalesPerDay: null,
    maxEmployees: null,
    features: [
      'Vendas ilimitadas',
      'Produtos ilimitados',
      'Funcionários ilimitados',
      'Dashboard completo',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
  },
};

// Menu de navegação
export const MENU_ITEMS = [
  {
    name: 'Dashboard',
    href: '/',
    icon: 'LayoutDashboard',
  },
  {
    name: 'Estoque',
    href: '/estoque',
    icon: 'Package',
  },
  {
    name: 'Clientes',
    href: '/clientes',
    icon: 'Users',
  },
  {
    name: 'Vendas',
    href: '/vendas',
    icon: 'ShoppingCart',
  },
  {
    name: 'Funcionários',
    href: '/funcionarios',
    icon: 'UserCog',
  },
  {
    name: 'Gastos',
    href: '/gastos',
    icon: 'Receipt',
  },
];

// Formatação de moeda
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Formatação de data
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

// Formatação de data e hora
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}
