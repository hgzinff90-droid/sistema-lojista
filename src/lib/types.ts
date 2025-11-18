// Types para o sistema Lojista X

export type UserRole = 'owner' | 'seller';

export type PlanType = 'free' | 'pro';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Plan {
  type: PlanType;
  maxProducts: number | null; // null = ilimitado
  maxSalesPerDay: number | null;
  maxEmployees: number | null;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  profit: number; // calculado automaticamente
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  cpf?: string;
  totalSpent: number;
  purchaseHistory: Sale[];
  createdAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  customerId?: string;
  customerName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  profit: number;
  sellerId: string;
  sellerName: string;
  date: Date;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'seller';
  createdAt: Date;
}

export type ExpenseCategory = 
  | 'merchandise'
  | 'employees'
  | 'rent'
  | 'utilities'
  | 'essential'
  | 'unnecessary'
  | 'other';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  description: string;
  createdAt: Date;
}

export interface DashboardStats {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  topProducts: Array<{ name: string; quantity: number }>;
  topCustomers: Array<{ name: string; totalSpent: number }>;
}
