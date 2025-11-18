'use client';

import { useState } from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PlanosPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      // Cria a sessão de checkout no Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: 'prod_TRS7wtfsgEcyYI',
          priceId: 'price_1QpxXXXXXXXXXXXX', // Você precisará criar um Price ID no Stripe Dashboard
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redireciona para o checkout do Stripe
        window.location.href = data.url;
      } else {
        alert('Erro ao criar sessão de pagamento. Tente novamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Escolha Seu Plano
          </h1>
          <p className="text-lg text-slate-600">
            Desbloqueie todo o potencial do Lojista X
          </p>
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Free */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-2xl text-slate-900">Plano Free</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900">R$ 0</span>
                <span className="text-slate-600">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Até 10 vendas por dia</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Até 50 produtos no estoque</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Até 3 funcionários</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Métricas básicas</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                disabled
              >
                Plano Atual
              </Button>
            </CardContent>
          </Card>

          {/* Plano Pro */}
          <Card className="border-2 border-green-500 shadow-2xl relative overflow-hidden">
            {/* Badge Recomendado */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Recomendado
            </div>

            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-b">
              <CardTitle className="text-2xl">Plano Pro</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 49,90</span>
                <span className="text-green-100">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-900 font-semibold">Vendas ilimitadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-900 font-semibold">Produtos ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-900 font-semibold">Funcionários ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-900 font-semibold">Métricas avançadas completas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-900 font-semibold">Suporte prioritário</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-900 font-semibold">Relatórios personalizados</span>
                </li>
              </ul>
              <Button 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-lg shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  'Fazer Upgrade Agora'
                )}
              </Button>
              <p className="text-center text-sm text-slate-600 mt-4">
                Pagamento seguro via Stripe
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Garantia */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                🔒 Pagamento 100% Seguro
              </h3>
              <p className="text-slate-700">
                Processamento seguro via Stripe. Cancele quando quiser, sem taxas adicionais.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
