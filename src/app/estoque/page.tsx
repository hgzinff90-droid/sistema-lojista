'use client';

import { useState } from 'react';
import { Package, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockData } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';
import { Product } from '@/lib/types';
import { UpgradeBanner } from '@/components/custom/upgrade-banner';

export default function EstoquePage() {
  const [products, setProducts] = useState(mockData.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const currentPlan = mockData.currentPlan;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    purchasePrice: '',
    salePrice: '',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar limite do plano Free
    if (currentPlan === 'free' && products.length >= 10 && !editingProduct) {
      alert('Você atingiu o limite de 10 produtos no plano Free. Faça upgrade para o plano Pro!');
      return;
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    const salePrice = parseFloat(formData.salePrice);
    const profit = salePrice - purchasePrice;

    if (editingProduct) {
      // Editar produto existente
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              category: formData.category,
              quantity: parseInt(formData.quantity),
              purchasePrice,
              salePrice,
              profit,
              updatedAt: new Date(),
            }
          : p
      ));
    } else {
      // Adicionar novo produto
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        purchasePrice,
        salePrice,
        profit,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts([...products, newProduct]);
    }

    // Reset form
    setFormData({
      name: '',
      category: '',
      quantity: '',
      purchasePrice: '',
      salePrice: '',
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity.toString(),
      purchasePrice: product.purchasePrice.toString(),
      salePrice: product.salePrice.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
  const potentialProfit = products.reduce((sum, p) => sum + (p.quantity * p.profit), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 md:p-8">
      {currentPlan === 'free' && products.length >= 8 && (
        <UpgradeBanner 
          message={`Você está usando ${products.length}/10 produtos do plano Free. Faça upgrade para ter produtos ilimitados!`}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Estoque</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">Gerencie seus produtos e controle o estoque</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{products.length}</div>
              {currentPlan === 'free' && (
                <p className="text-xs sm:text-sm text-blue-100 mt-1">Limite: 10 produtos</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs sm:text-sm text-green-100 mt-1">Custo total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Lucro Potencial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{formatCurrency(potentialProfit)}</div>
              <p className="text-xs sm:text-sm text-purple-100 mt-1">Se vender tudo</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar produtos..."
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
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    category: '',
                    quantity: '',
                    purchasePrice: '',
                    salePrice: '',
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="purchasePrice">Valor Pago (Custo)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Valor de Venda</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    required
                  />
                </div>

                {formData.purchasePrice && formData.salePrice && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-600">Lucro por unidade:</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(parseFloat(formData.salePrice) - parseFloat(formData.purchasePrice))}
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products - Mobile Cards / Desktop Table */}
        <Card className="shadow-lg bg-white">
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-700">Produto</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Categoria</th>
                    <th className="text-center p-4 font-semibold text-slate-700">Quantidade</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Custo</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Venda</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Lucro/Un</th>
                    <th className="text-center p-4 font-semibold text-slate-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">{product.name}</td>
                      <td className="p-4 text-slate-600">{product.category}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          product.quantity > 10 ? 'bg-green-100 text-green-700' :
                          product.quantity > 5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-600">{formatCurrency(product.purchasePrice)}</td>
                      <td className="p-4 text-right font-medium text-slate-900">{formatCurrency(product.salePrice)}</td>
                      <td className="p-4 text-right font-bold text-green-600">{formatCurrency(product.profit)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(product)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(product.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4 hover:bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{product.name}</h3>
                      <p className="text-sm text-slate-600">{product.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.quantity > 10 ? 'bg-green-100 text-green-700' :
                      product.quantity > 5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.quantity} un
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-slate-500">Custo</p>
                      <p className="font-medium text-slate-900">{formatCurrency(product.purchasePrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Venda</p>
                      <p className="font-medium text-slate-900">{formatCurrency(product.salePrice)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">Lucro por unidade</p>
                      <p className="font-bold text-green-600 text-lg">{formatCurrency(product.profit)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Nenhum produto encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
