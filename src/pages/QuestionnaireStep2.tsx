import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SliderInput } from '@/components/SliderInput';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import littleJohnLogo from '../assets/little-john-logo.png';

export const QuestionnaireStep2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contractsPerMonth: 15,
    averagePremium: 0,
    conversionRate: 80,
    employeeCount: '',
    hourlyRate: 27
  });

  const handleSubmit = () => {
    // Store step 2 data in localStorage
    localStorage.setItem('questionnaireStep2', JSON.stringify(formData));
    navigate('/analyse-en-cours');
  };

  const handleBack = () => {
    navigate('/questionnaire-step-1');
  };

  const isFormValid = formData.averagePremium > 0 && formData.employeeCount.trim() !== '';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <img src={littleJohnLogo} alt="Little John" className="h-8" />
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Étape 2 sur 2</span>
            <span className="text-sm text-muted-foreground">100%</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-headline text-primary mb-2">
                Analyse personnalisée - Étape 2
              </h1>
              <p className="text-body text-muted-foreground">
                Dernières informations pour personnaliser votre analyse
              </p>
            </div>

            <div className="space-y-8">
              <SliderInput
                label="Nombre de contrats signés par mois"
                value={formData.contractsPerMonth}
                onChange={(value) => setFormData({ ...formData, contractsPerMonth: value })}
                min={3}
                max={40}
                step={1}
                unit=""
                description="Volume mensuel de nouveaux contrats"
              />

              <div className="space-y-2">
                <Label htmlFor="averagePremium" className="text-sm font-medium">
                  Prime moyenne TTC d'un contrat flotte automobile (€) *
                </Label>
                <Input
                  id="averagePremium"
                  type="number"
                  value={formData.averagePremium || ''}
                  onChange={(e) => setFormData({ ...formData, averagePremium: parseFloat(e.target.value) || 0 })}
                  placeholder="Ex: 2500"
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Montant moyen des primes de vos contrats flotte
                </p>
              </div>

              <SliderInput
                label="Taux de conversion sur prospect rencontré"
                value={formData.conversionRate}
                onChange={(value) => setFormData({ ...formData, conversionRate: value })}
                min={0}
                max={100}
                step={5}
                unit="%"
                description="Pourcentage de prospects qui deviennent clients"
              />

              <div className="space-y-2">
                <Label htmlFor="employeeCount" className="text-sm font-medium">
                  Nombre d'employés *
                </Label>
                <Input
                  id="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                  placeholder="Ex: 5"
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Effectif total de votre entreprise
                </p>
              </div>

              <SliderInput
                label="Taux horaire (€)"
                value={formData.hourlyRate}
                onChange={(value) => setFormData({ ...formData, hourlyRate: value })}
                min={15}
                max={35}
                step={1}
                unit="€"
                description="Coût horaire moyen dans votre entreprise"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSubmit}
                size="lg"
                disabled={!isFormValid}
                className="flex items-center gap-2 min-w-[200px]"
              >
                Lancer l'analyse approfondie
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {!isFormValid && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                * Veuillez remplir tous les champs obligatoires
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};