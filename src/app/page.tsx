'use client';

import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package,
  Users,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpgradeBanner } from '@/components/custom/upgrade-banner';
import { mockData, calculateDailyStats, calculateWeeklyStats, calculateMonthlyStats, getTopProducts, getTopCustomers } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';

export default function DashboardPage() {
  const { sales, customers, products } = mockData;
  const currentPlan = mockData.currentPlan;
  
  const dailyStats = calculateDailyStats(sales);
  const weeklyStats = calculateWeeklyStats(sales);
  const monthlyStats = calculateMonthlyStats(sales);
  
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  
  const topProducts = getTopProducts(sales, 5);
  const topCustomers = getTopCustomers(customers, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Banner de Upgrade para Plano Free */}
      {currentPlan === 'free' && (
        <UpgradeBanner 
          message="Você está no plano Free. Atualize para o plano Pro e tenha tudo ilimitado por apenas R$49,90/mês!"
        />
      )}

      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Visão geral do seu negócio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Vendas Diárias */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Vendas Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dailyStats.count}</div>
              <p className="text-sm text-green-100 mt-1">
                {formatCurrency(dailyStats.revenue)}
              </p>
            </CardContent>
          </Card>

          {/* Vendas Semanais */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Vendas (7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{weeklyStats.count}</div>
              <p className="text-sm text-emerald-100 mt-1">
                {formatCurrency(weeklyStats.revenue)}
              </p>
            </CardContent>
          </Card>

          {/* Faturamento Total */}
          <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Faturamento Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-sm text-teal-100 mt-1">
                {sales.length} vendas
              </p>
            </CardContent>
          </Card>

          {/* Lucro Total */}
          <Card className="bg-gradient-to-br from-lime-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Lucro Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalProfit)}</div>
              <p className="text-sm text-lime-100 mt-1">
                Margem: {((totalProfit / totalRevenue) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Vendas Mensais */}
        <Card className="mb-8 shadow-lg border-green-200 bg-white hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              Vendas Mensais (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-slate-900">{monthlyStats.count}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Faturamento</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyStats.revenue)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Lucro</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(monthlyStats.profit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produtos e Clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Produtos Mais Vendidos */}
          <Card className="shadow-lg border-green-200 bg-white hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Package className="h-5 w-5 text-green-600" />
                Produtos Mais Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-900">{product.name}</span>
                      </div>
                      <span className="text-sm text-slate-600">{product.quantity} vendidos</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">Nenhuma venda registrada</p>
              )}
            </CardContent>
          </Card>

          {/* Clientes que Mais Compram */}
          <Card className="shadow-lg border-green-200 bg-white hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Users className="h-5 w-5 text-emerald-600" />
                Clientes que Mais Compram
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topCustomers.length > 0 ? (
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-900">{customer.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(customer.totalSpent)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">Nenhum cliente cadastrado</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Aviso Plano Free */}
        {currentPlan === 'free' && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    Você está no Plano Free
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Aproveite todos os recursos ilimitados do Lojista X por apenas <strong>R$49,90/mês</strong>:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 mb-4">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Vendas ilimitadas por dia
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Produtos ilimitados no estoque
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Funcionários ilimitados
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Acesso completo a todas as métricas
                    </li>
                  </ul>
                  <a 
                    href="/planos"
                    className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    Fazer Upgrade Agora
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
