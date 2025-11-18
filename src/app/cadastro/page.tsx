'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Store, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validações
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@gmail.com')) {
      setError('Por favor, use um email Gmail válido');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    // Simular cadastro (em produção, conectar com backend/Supabase)
    setTimeout(() => {
      // Verificar se usuário já existe
      const existingUsers = JSON.parse(localStorage.getItem('lojistaX_users') || '[]');
      const userExists = existingUsers.find((u: any) => u.email === formData.email);

      if (userExists) {
        setError('Este email já está cadastrado');
        setIsLoading(false);
        return;
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // Em produção, usar hash
        plan: 'free',
        createdAt: new Date().toISOString(),
      };

      // Salvar na lista de usuários
      existingUsers.push(newUser);
      localStorage.setItem('lojistaX_users', JSON.stringify(existingUsers));

      // Fazer login automático
      const userData = {
        email: newUser.email,
        name: newUser.name,
        plan: newUser.plan,
        loginDate: new Date().toISOString(),
      };

      localStorage.setItem('lojistaX_user', JSON.stringify(userData));
      localStorage.setItem('lojistaX_isAuthenticated', 'true');

      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-green-200">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Store className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-slate-900">{APP_NAME}</CardTitle>
            <p className="text-slate-600 mt-2">Crie sua conta gratuitamente</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCadastro} className="space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Nome Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email Gmail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botão de Cadastro */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg shadow-lg"
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta Grátis'}
            </Button>

            {/* Link para Login */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                  Faça login
                </Link>
              </p>
            </div>

            {/* Voltar */}
            <Link 
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para login
            </Link>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 text-center w-full">
        <p className="text-sm text-slate-600">
          © 2024 {APP_NAME}. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
