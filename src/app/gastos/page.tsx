'use client';

import { useState } from 'react';
import { Receipt, Plus, Pencil, Trash2, Search, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockData } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';
import { Expense, ExpenseCategory } from '@/lib/types';

const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: 'merchandise', label: 'Mercadorias' },
  { value: 'employees', label: 'Funcionários' },
  { value: 'rent', label: 'Aluguel' },
  { value: 'utilities', label: 'Contas (Luz, Água, Internet)' },
  { value: 'essential', label: 'Gastos Essenciais' },
  { value: 'unnecessary', label: 'Gastos Inúteis' },
  { value: 'other', label: 'Outros' },
];

export default function GastosPage() {
  const [expenses, setExpenses] = useState(mockData.expenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '' as ExpenseCategory,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingExpense) {
      // Editar gasto existente
      setExpenses(expenses.map(exp =>
        exp.id === editingExpense.id
          ? {
              ...exp,
              title: formData.title,
              category: formData.category,
              amount: parseFloat(formData.amount),
              date: new Date(formData.date),
              description: formData.description,
            }
          : exp
      ));
    } else {
      // Adicionar novo gasto
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        description: formData.description,
        createdAt: new Date(),
      };
      setExpenses([...expenses, newExpense]);
    }

    // Reset form
    setFormData({
      title: '',
      category: '' as ExpenseCategory,
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setEditingExpense(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      category: expense.category,
      amount: expense.amount.toString(),
      date: new Date(expense.date).toISOString().split('T')[0],
      description: expense.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este gasto?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  // Calcular totais
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Gastos por categoria
  const expensesByCategory = expenseCategories.map(cat => ({
    ...cat,
    total: expenses
      .filter(exp => exp.category === cat.value)
      .reduce((sum, exp) => sum + exp.amount, 0),
  }));

  // Gastos mensais
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  }).reduce((sum, exp) => sum + exp.amount, 0);

  // Gastos anuais
  const yearlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getFullYear() === currentYear;
  }).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Gastos</h1>
          <p className="text-slate-600 mt-2">Controle todos os gastos da sua loja</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalExpenses)}</div>
              <p className="text-sm text-red-100 mt-1">{expenses.length} registros</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gastos Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(monthlyExpenses)}</div>
              <p className="text-sm text-orange-100 mt-1">
                {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gastos Anuais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(yearlyExpenses)}</div>
              <p className="text-sm text-purple-100 mt-1">{currentYear}</p>
            </CardContent>
          </Card>
        </div>

        {/* Gastos por Categoria */}
        <Card className="mb-8 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expensesByCategory.map((cat) => (
                <div key={cat.value} className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">{cat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(cat.total)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar gastos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                onClick={() => {
                  setEditingExpense(null);
                  setFormData({
                    title: '',
                    category: '' as ExpenseCategory,
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Gasto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? 'Editar Gasto' : 'Adicionar Novo Gasto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Aluguel Janeiro"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as ExpenseCategory })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Detalhes sobre o gasto..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingExpense ? 'Salvar Alterações' : 'Adicionar Gasto'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Expenses Table */}
        <Card className="shadow-lg bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-700">Data</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Título</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Categoria</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Descrição</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Valor</th>
                    <th className="text-center p-4 font-semibold text-slate-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 text-sm text-slate-600">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 font-medium text-slate-900">{expense.title}</td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {expenseCategories.find(c => c.value === expense.category)?.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                        {expense.description}
                      </td>
                      <td className="p-4 text-right font-bold text-red-600">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(expense)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(expense.id)}
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

              {filteredExpenses.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Nenhum gasto registrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
