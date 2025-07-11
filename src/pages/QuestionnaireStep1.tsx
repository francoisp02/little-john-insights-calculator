import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SliderInput } from '@/components/SliderInput';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import littleJohnLogo from '../assets/LOGO_LITTLE_JOHN_NOIR_DEGRADE_RVB.png';
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
  return <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <img src={littleJohnLogo} alt="Little John" className="h-8" />
        </div>


        {/* Progress */}
        <div className="max-w-5xl mx-auto mb-8">
          <Progress value={50} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <Card className="p-10">
            <div className="text-center mb-8">
              <h1 className="text-headline text-primary mb-2">Analyse personnalisée </h1>
              <p className="text-body text-muted-foreground">
                Parlez-nous de votre organisation actuelle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SliderInput label="Nombre d'extranets assureurs" value={formData.extranetsCount} onChange={value => setFormData({
              ...formData,
              extranetsCount: value
            })} min={1} max={7} step={1} unit="" />

              <SliderInput label="Temps de collecte de l'état de parc par dossier" value={formData.collectParc} onChange={value => setFormData({
              ...formData,
              collectParc: value
            })} min={0.25} max={2} step={0.25} unit="h" />

              <SliderInput label="Temps de collecte et travail des RI par dossier" value={formData.collectRI} onChange={value => setFormData({
              ...formData,
              collectRI: value
            })} min={0.25} max={2.5} step={0.25} unit="h" />

              <SliderInput label="Temps moyen de saisie par extranet" value={formData.saisieExtranet} onChange={value => setFormData({
              ...formData,
              saisieExtranet: value
            })} min={0.2} max={1.5} step={0.1} unit="h" />
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Button variant="outline" onClick={handleBack} size="lg" className="flex items-center gap-2 min-w-[200px]">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <Button onClick={handleSubmit} size="lg" className="flex items-center gap-2 min-w-[200px]">
                Poursuivre l'analyse
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};