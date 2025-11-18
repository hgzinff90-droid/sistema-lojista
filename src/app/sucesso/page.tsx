'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SucessoPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula verificação da sessão
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Verificando pagamento...
            </h2>
            <p className="text-slate-600">
              Aguarde enquanto confirmamos sua assinatura
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-slate-600 mb-6">
              Bem-vindo ao Plano Pro do Lojista X! 🎉
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-slate-900 mb-2">
              O que você ganhou:
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Vendas ilimitadas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Produtos ilimitados
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Funcionários ilimitados
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Métricas avançadas completas
              </li>
            </ul>
          </div>

          <Button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6"
          >
            Ir para o Dashboard
          </Button>

          {sessionId && (
            <p className="text-xs text-slate-500 mt-4">
              ID da Sessão: {sessionId}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
