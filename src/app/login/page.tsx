'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@gmail.com')) {
      setError('Por favor, use um email Gmail válido');
      setIsLoading(false);
      return;
    }

    // Simular login (em produção, conectar com backend/Supabase)
    setTimeout(() => {
      // Salvar dados do usuário no localStorage
      const userData = {
        email,
        name: email.split('@')[0],
        plan: 'free',
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
            <p className="text-slate-600 mt-2">Entre com sua conta Gmail</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email Gmail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botão de Login */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg shadow-lg"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Links */}
            <div className="text-center space-y-2">
              <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Esqueceu sua senha?
              </a>
              <p className="text-sm text-slate-600">
                Não tem uma conta?{' '}
                <a href="/cadastro" className="text-green-600 hover:text-green-700 font-medium">
                  Cadastre-se
                </a>
              </p>
            </div>
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
