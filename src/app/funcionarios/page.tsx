'use client';

import { useState } from 'react';
import { UserCog, Plus, Pencil, Trash2, Search, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockData } from '@/lib/store';
import { Employee } from '@/lib/types';
import { UpgradeBanner } from '@/components/custom/upgrade-banner';

export default function FuncionariosPage() {
  const [employees, setEmployees] = useState(mockData.employees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const currentPlan = mockData.currentPlan;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar limite do plano Free
    if (currentPlan === 'free' && employees.length >= 1 && !editingEmployee) {
      alert('Você atingiu o limite de 1 funcionário no plano Free. Faça upgrade para o plano Pro!');
      return;
    }

    if (editingEmployee) {
      // Editar funcionário existente
      setEmployees(employees.map(e =>
        e.id === editingEmployee.id
          ? {
              ...e,
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }
          : e
      ));
    } else {
      // Adicionar novo funcionário
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'seller',
        createdAt: new Date(),
      };
      setEmployees([...employees, newEmployee]);
    }

    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
    });
    setEditingEmployee(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: employee.password,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {currentPlan === 'free' && employees.length >= 1 && (
        <UpgradeBanner 
          message="Você atingiu o limite de 1 funcionário no plano Free. Faça upgrade para funcionários ilimitados!"
        />
      )}

      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Funcionários</h1>
          <p className="text-slate-600 mt-2">Gerencie sua equipe de vendedores</p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{employees.length}</div>
              {currentPlan === 'free' && (
                <p className="text-sm text-purple-100 mt-1">Limite: 1 funcionário</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vendedores Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{employees.length}</div>
              <p className="text-sm text-blue-100 mt-1">Função: Vendedor</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar funcionários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                onClick={() => {
                  setEditingEmployee(null);
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                  });
                }}
                disabled={currentPlan === 'free' && employees.length >= 1}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail (Gmail)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="funcionario@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-700">
                    <strong>Função:</strong> Vendedor
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Vendedores podem apenas registrar vendas e visualizar métricas básicas.
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  {editingEmployee ? 'Salvar Alterações' : 'Adicionar Funcionário'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {employee.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-1">Vendedor</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-slate-500 mb-1">Cadastrado em</p>
                  <p className="text-sm font-medium text-slate-700">
                    {new Date(employee.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(employee)}
                    className="flex-1"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(employee.id)}
                    className="flex-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <Card className="shadow-lg bg-white">
            <CardContent className="text-center py-12">
              <UserCog className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhum funcionário encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
