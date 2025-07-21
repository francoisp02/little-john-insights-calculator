import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SliderInput } from '@/components/SliderInput';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import littleJohnLogo from '../assets/LOGO_LITTLE_JOHN_NOIR_DEGRADE_RVB.png';
export const QuestionnaireStep2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contractsPerMonth: 15,
    averagePremium: 15000,
    conversionRate: 80,
    employeeCount: ''
  });
  const handleSubmit = () => {
    // Store step 2 data in localStorage
    localStorage.setItem('questionnaireStep2', JSON.stringify(formData));
    navigate('/analyse-en-cours');
  };
  const handleBack = () => {
    navigate('/questionnaire-step-1');
  };
  const isFormValid = formData.averagePremium > 0;
  return <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <img src={littleJohnLogo} alt="Little John" className="h-8" />
        </div>


        {/* Progress */}
        <div className="max-w-5xl mx-auto mb-8">
          <Progress value={100} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <Card className="p-10">
            <div className="text-center mb-8">
              <h1 className="text-headline text-primary mb-2">Vous concernant</h1>
              <p className="text-body text-muted-foreground">
                Dernières informations pour personnaliser votre analyse
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SliderInput label="Nombre de contrats flotte automobile signés par mois" value={formData.contractsPerMonth} onChange={value => setFormData({
              ...formData,
              contractsPerMonth: value
            })} min={3} max={40} step={1} unit="" />

              <SliderInput label="Prime moyenne TTC d'un contrat flotte automobile (€)" value={formData.averagePremium} onChange={value => setFormData({
              ...formData,
              averagePremium: value
            })} min={7000} max={30000} step={100} unit="€" />

              <SliderInput label="Pourcentage des prospects devenant clients" value={formData.conversionRate} onChange={value => setFormData({
              ...formData,
              conversionRate: value
            })} min={0} max={100} step={5} unit="%" />

              <div className="space-y-2">
                <Label htmlFor="employeeCount" className="text-sm font-medium">
                  Effectif total de votre entreprise
                </Label>
                <Input id="employeeCount" type="number" value={formData.employeeCount} onChange={e => setFormData({
                ...formData,
                employeeCount: e.target.value
              })} placeholder="Ex: 5" className="text-lg" />
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Button variant="outline" onClick={handleBack} size="lg" className="flex items-center gap-2 min-w-[200px]">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <Button onClick={handleSubmit} size="lg" disabled={!isFormValid} className="flex items-center gap-2 min-w-[200px]">
                Lancer l'analyse approfondie
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {!isFormValid && <p className="text-sm text-muted-foreground text-center mt-4">
                * Veuillez remplir le champ Prime moyenne TTC
              </p>}
          </Card>
        </div>
      </div>
    </div>;
};