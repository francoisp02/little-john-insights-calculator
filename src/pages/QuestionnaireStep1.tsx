import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SliderInput } from '@/components/SliderInput';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import littleJohnLogo from '../assets/little-john-logo.png';

export const QuestionnaireStep1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    extranetsCount: 4,
    collectParc: 0.5,
    collectRI: 1,
    saisieExtranet: 0.5
  });

  const handleSubmit = () => {
    // Store step 1 data in localStorage
    localStorage.setItem('questionnaireStep1', JSON.stringify(formData));
    navigate('/questionnaire-step-2');
  };

  const handleBack = () => {
    navigate('/');
  };

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
            <span className="text-sm text-muted-foreground">Étape 1 sur 2</span>
            <span className="text-sm text-muted-foreground">50%</span>
          </div>
          <Progress value={50} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-headline text-primary mb-2">
                Analyse personnalisée - Étape 1
              </h1>
              <p className="text-body text-muted-foreground">
                Parlez-nous de votre organisation actuelle
              </p>
            </div>

            <div className="space-y-8">
              <SliderInput
                label="Nombre d'extranets assureurs"
                value={formData.extranetsCount}
                onChange={(value) => setFormData({ ...formData, extranetsCount: value })}
                min={1}
                max={7}
                step={1}
                unit=""
                description="Combien d'extranets utilisez-vous actuellement ?"
              />

              <SliderInput
                label="Temps de collecte et travail état de parc"
                value={formData.collectParc}
                onChange={(value) => setFormData({ ...formData, collectParc: value })}
                min={0.25}
                max={2}
                step={0.25}
                unit="h"
                description="Temps moyen consacré par dossier"
              />

              <SliderInput
                label="Temps de collecte et travail RI"
                value={formData.collectRI}
                onChange={(value) => setFormData({ ...formData, collectRI: value })}
                min={0.25}
                max={2.5}
                step={0.25}
                unit="h"
                description="Temps moyen pour les relevés d'informations"
              />

              <SliderInput
                label="Temps de saisie d'un extranet"
                value={formData.saisieExtranet}
                onChange={(value) => setFormData({ ...formData, saisieExtranet: value })}
                min={0.2}
                max={1.5}
                step={0.1}
                unit="h"
                description="Temps moyen de saisie par extranet"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="flex items-center gap-2 min-w-[200px]"
              >
                Poursuivre l'analyse
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};