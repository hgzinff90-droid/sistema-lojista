'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockData } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';
import { Sale } from '@/lib/types';
import { UpgradeBanner } from '@/components/custom/upgrade-banner';

export default function VendasPage() {
  const [sales, setSales] = useState(mockData.sales);
  const [products, setProducts] = useState(mockData.products);
  const [customers] = useState(mockData.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentPlan = mockData.currentPlan;

  const [formData, setFormData] = useState({
    productId: '',
    customerId: '',
    quantity: '',
  });

  // Verificar quantas vendas foram feitas hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });

  const filteredSales = sales.filter(sale =>
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.customerName && sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedProduct = products.find(p => p.id === formData.productId);
  const selectedCustomer = customers.find(c => c.id === formData.customerId);

  const calculateSaleValues = () => {
    if (!selectedProduct || !formData.quantity) return null;

    const quantity = parseInt(formData.quantity);
    const totalPrice = selectedProduct.salePrice * quantity;
    const profit = selectedProduct.profit * quantity;

    return { totalPrice, profit };
  };

  const saleValues = calculateSaleValues();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar limite do plano Free
    if (currentPlan === 'free' && todaySales.length >= 1) {
      alert('Você atingiu o limite de 1 venda por dia no plano Free. Faça upgrade para o plano Pro!');
      return;
    }

    if (!selectedProduct || !saleValues) return;

    const quantity = parseInt(formData.quantity);

    // Verificar estoque
    if (selectedProduct.quantity < quantity) {
      alert('Quantidade insuficiente em estoque!');
      return;
    }

    // Criar venda
    const newSale: Sale = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      customerId: formData.customerId || undefined,
      customerName: selectedCustomer?.name,
      quantity,
      unitPrice: selectedProduct.salePrice,
      totalPrice: saleValues.totalPrice,
      profit: saleValues.profit,
      sellerId: 'owner',
      sellerName: 'Proprietário',
      date: new Date(),
    };

    setSales([newSale, ...sales]);

    // Atualizar estoque
    setProducts(products.map(p =>
      p.id === selectedProduct.id
        ? { ...p, quantity: p.quantity - quantity, updatedAt: new Date() }
        : p
    ));

    // Reset form
    setFormData({
      productId: '',
      customerId: '',
      quantity: '',
    });
    setIsDialogOpen(false);
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 md:p-8">
      {currentPlan === 'free' && todaySales.length >= 1 && (
        <UpgradeBanner 
          message="Você atingiu o limite de 1 venda por dia no plano Free. Faça upgrade para vendas ilimitadas!"
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Vendas</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">Registre e acompanhe suas vendas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{todaySales.length}</div>
              {currentPlan === 'free' && (
                <p className="text-xs sm:text-sm text-blue-100 mt-1">Limite: 1 venda/dia</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs sm:text-sm text-green-100 mt-1">{sales.length} vendas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalProfit)}</div>
              <p className="text-xs sm:text-sm text-purple-100 mt-1">
                Margem: {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar vendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 w-full sm:w-auto"
                onClick={() => {
                  setFormData({
                    productId: '',
                    customerId: '',
                    quantity: '',
                  });
                }}
                disabled={currentPlan === 'free' && todaySales.length >= 1}
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nova Venda</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product">Produto</Label>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) => setFormData({ ...formData, productId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.filter(p => p.quantity > 0).map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(product.salePrice)} (Estoque: {product.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="customer">Cliente (opcional)</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedProduct?.quantity || 999}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                  {selectedProduct && (
                    <p className="text-xs text-slate-500 mt-1">
                      Disponível em estoque: {selectedProduct.quantity}
                    </p>
                  )}
                </div>

                {saleValues && (
                  <div className="bg-green-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total da venda:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(saleValues.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Lucro:</span>
                      <span className="font-bold text-green-600">{formatCurrency(saleValues.profit)}</span>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Confirmar Venda
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sales - Mobile Cards / Desktop Table */}
        <Card className="shadow-lg bg-white">
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-700">Data</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Produto</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Cliente</th>
                    <th className="text-center p-4 font-semibold text-slate-700">Qtd</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Valor Unit.</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Total</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Lucro</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Vendedor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 text-sm text-slate-600">
                        {new Date(sale.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 font-medium text-slate-900">{sale.productName}</td>
                      <td className="p-4 text-slate-600">{sale.customerName || '-'}</td>
                      <td className="p-4 text-center">{sale.quantity}</td>
                      <td className="p-4 text-right text-slate-600">{formatCurrency(sale.unitPrice)}</td>
                      <td className="p-4 text-right font-medium text-slate-900">{formatCurrency(sale.totalPrice)}</td>
                      <td className="p-4 text-right font-bold text-green-600">{formatCurrency(sale.profit)}</td>
                      <td className="p-4 text-slate-600">{sale.sellerName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y">
              {filteredSales.map((sale) => (
                <div key={sale.id} className="p-4 hover:bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{sale.productName}</h3>
                      <p className="text-sm text-slate-600">{sale.customerName || 'Cliente não informado'}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(sale.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {sale.quantity} un
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-slate-500">Valor Unitário</p>
                      <p className="font-medium text-slate-900">{formatCurrency(sale.unitPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="font-bold text-slate-900">{formatCurrency(sale.totalPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Lucro</p>
                      <p className="font-bold text-green-600 text-lg">{formatCurrency(sale.profit)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Vendedor</p>
                      <p className="text-sm text-slate-700">{sale.sellerName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSales.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Nenhuma venda registrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
