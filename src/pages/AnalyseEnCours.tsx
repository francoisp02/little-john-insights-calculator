import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Loader2, Brain, Calculator, TrendingUp } from 'lucide-react';
import littleJohnLogo from '../assets/LOGO_LITTLE_JOHN_NOIR_DEGRADE_RVB.png';

export const AnalyseEnCours = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/contact-confirmation');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 text-center">
            <div className="mb-8">
              <img src={littleJohnLogo} alt="Little John" className="h-12 mx-auto mb-6" />
            </div>

            <div className="space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin" />
              </div>

              <div>
                <h1 className="text-headline text-primary mb-4">
                  Votre analyse personnalisée est en cours de préparation…
                </h1>
                <p className="text-body text-muted-foreground">
                  Nos algorithmes analysent vos données pour vous fournir des recommandations précises
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center space-y-2 opacity-60 animate-pulse">
                  <Brain className="h-8 w-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Analyse</span>
                </div>
                <div className="flex flex-col items-center space-y-2 opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <Calculator className="h-8 w-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Calculs</span>
                </div>
                <div className="flex flex-col items-center space-y-2 animate-pulse" style={{ animationDelay: '1s' }}>
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Optimisation</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-[loading_3s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};