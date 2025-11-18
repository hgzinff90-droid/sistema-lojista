// Store local para dados do sistema (simulação de banco de dados)
import { Product, Customer, Sale, Employee, Expense, PlanType } from './types';

// Dados mockados para demonstração
export const mockData = {
  currentPlan: 'free' as PlanType,
  
  products: [
    {
      id: '1',
      name: 'Camiseta Básica',
      category: 'Vestuário',
      quantity: 50,
      purchasePrice: 15,
      salePrice: 35,
      profit: 20,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Calça Jeans',
      category: 'Vestuário',
      quantity: 30,
      purchasePrice: 45,
      salePrice: 120,
      profit: 75,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      name: 'Tênis Esportivo',
      category: 'Calçados',
      quantity: 20,
      purchasePrice: 80,
      salePrice: 200,
      profit: 120,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ] as Product[],

  customers: [
    {
      id: '1',
      name: 'João Silva',
      phone: '(11) 98765-4321',
      address: 'Rua das Flores, 123',
      cpf: '123.456.789-00',
      totalSpent: 1250.00,
      purchaseHistory: [],
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '2',
      name: 'Maria Santos',
      phone: '(11) 91234-5678',
      address: 'Av. Principal, 456',
      totalSpent: 890.00,
      purchaseHistory: [],
      createdAt: new Date('2024-01-12'),
    },
  ] as Customer[],

  sales: [
    {
      id: '1',
      productId: '1',
      productName: 'Camiseta Básica',
      customerId: '1',
      customerName: 'João Silva',
      quantity: 3,
      unitPrice: 35,
      totalPrice: 105,
      profit: 60,
      sellerId: 'owner',
      sellerName: 'Proprietário',
      date: new Date(),
    },
    {
      id: '2',
      productId: '2',
      productName: 'Calça Jeans',
      customerId: '2',
      customerName: 'Maria Santos',
      quantity: 2,
      unitPrice: 120,
      totalPrice: 240,
      profit: 150,
      sellerId: 'owner',
      sellerName: 'Proprietário',
      date: new Date(Date.now() - 86400000),
    },
  ] as Sale[],

  employees: [
    {
      id: '1',
      name: 'Carlos Vendedor',
      email: 'carlos@loja.com',
      password: '123456',
      role: 'seller' as const,
      createdAt: new Date('2024-01-05'),
    },
  ] as Employee[],

  expenses: [
    {
      id: '1',
      title: 'Aluguel Janeiro',
      category: 'rent' as const,
      amount: 2500,
      date: new Date('2024-01-05'),
      description: 'Aluguel da loja',
      createdAt: new Date('2024-01-05'),
    },
    {
      id: '2',
      title: 'Conta de Luz',
      category: 'utilities' as const,
      amount: 350,
      date: new Date('2024-01-10'),
      description: 'Energia elétrica',
      createdAt: new Date('2024-01-10'),
    },
  ] as Expense[],
};

// Funções helper para cálculos
export function calculateDailyStats(sales: Sale[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });

  return {
    count: todaySales.length,
    revenue: todaySales.reduce((sum, sale) => sum + sale.totalPrice, 0),
    profit: todaySales.reduce((sum, sale) => sum + sale.profit, 0),
  };
}

export function calculateWeeklyStats(sales: Sale[]) {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weekSales = sales.filter(sale => new Date(sale.date) >= weekAgo);

  return {
    count: weekSales.length,
    revenue: weekSales.reduce((sum, sale) => sum + sale.totalPrice, 0),
    profit: weekSales.reduce((sum, sale) => sum + sale.profit, 0),
  };
}

export function calculateMonthlyStats(sales: Sale[]) {
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const monthSales = sales.filter(sale => new Date(sale.date) >= monthAgo);

  return {
    count: monthSales.length,
    revenue: monthSales.reduce((sum, sale) => sum + sale.totalPrice, 0),
    profit: monthSales.reduce((sum, sale) => sum + sale.profit, 0),
  };
}

export function getTopProducts(sales: Sale[], limit = 5) {
  const productMap = new Map<string, { name: string; quantity: number }>();
  
  sales.forEach(sale => {
    const existing = productMap.get(sale.productId);
    if (existing) {
      existing.quantity += sale.quantity;
    } else {
      productMap.set(sale.productId, {
        name: sale.productName,
        quantity: sale.quantity,
      });
    }
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export function getTopCustomers(customers: Customer[], limit = 5) {
  return [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit)
    .map(c => ({ name: c.name, totalSpent: c.totalSpent }));
}
