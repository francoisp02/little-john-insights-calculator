import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SliderInput } from './SliderInput';
import { AnimatedCounter } from './AnimatedCounter';
import { DetailModal } from './DetailModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import littleJohnLogo from '../assets/LOGO_LITTLE_JOHN_NOIR_DEGRADE_RVB.png';

type InsuranceType = 'flotte automobile' | 'RC Pro' | 'Multirisque';

export const Calculator = () => {
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('flotte automobile');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Inputs
  const [contractsPerMonth, setContractsPerMonth] = useState(15);
  const [averagePremium, setAveragePremium] = useState(14500);
  const [timeWithoutLittleJohn, setTimeWithoutLittleJohn] = useState(3);
  
  // Calculated outputs
  const [annualCommission, setAnnualCommission] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  
  const insuranceOptions: InsuranceType[] = ['flotte automobile', 'RC Pro', 'Multirisque'];
  
  // Dynamic limits based on insurance type
  const getLimits = () => {
    if (insuranceType === 'RC Pro') {
      return {
        contracts: { min: 0, max: 700, step: 1 },
        premium: { min: 15, max: 15000, step: 50 },
        time: { min: 0.08, max: 2, step: 0.08 }
      };
    }
    // Default limits for other insurance types
    return {
      contracts: { min: 0, max: 30, step: 1 },
      premium: { min: 7000, max: 25000, step: 500 },
      time: { min: 1.5, max: 5, step: 0.25 }
    };
  };

  const limits = getLimits();

  // Adjust values when insurance type changes
  useEffect(() => {
    const newLimits = getLimits();
    
    // Adjust values to fit within new limits
    if (contractsPerMonth > newLimits.contracts.max) {
      setContractsPerMonth(newLimits.contracts.max);
    } else if (contractsPerMonth < newLimits.contracts.min) {
      setContractsPerMonth(newLimits.contracts.min);
    }
    
    if (averagePremium > newLimits.premium.max) {
      setAveragePremium(newLimits.premium.max);
    } else if (averagePremium < newLimits.premium.min) {
      setAveragePremium(newLimits.premium.min);
    }
    
    if (timeWithoutLittleJohn > newLimits.time.max) {
      setTimeWithoutLittleJohn(newLimits.time.max);
    } else if (timeWithoutLittleJohn < newLimits.time.min) {
      setTimeWithoutLittleJohn(newLimits.time.min);
    }
  }, [insuranceType]);
  
  useEffect(() => {
    // Pourcentage de productivité gagné grâce à Little John (interne, pas affiché)
    const productivityPercentage = 0.20 - (3 - timeWithoutLittleJohn) / 25;
    
    // Chiffre d'affaires additionnel: (nombre/0.8) × % productivité × prime moyenne × 12 × 0.15
    const additionalRevenue = (contractsPerMonth / 0.8) * productivityPercentage * averagePremium * 12 * 0.15;
    setAnnualCommission(additionalRevenue);
    
    // Temps économisé: (-(nombre/0.8 × 0.66h) - (nombre/0.8 × temps moyen))/7 - toujours positif
    const timeWithLittleJohn = (contractsPerMonth / 0.8) * 0.66;
    const timeWithoutTool = (contractsPerMonth / 0.8) * timeWithoutLittleJohn;
    const saved = Math.abs(-(timeWithLittleJohn - timeWithoutTool)) / 7;
    setTimeSaved(saved);
  }, [contractsPerMonth, averagePremium, timeWithoutLittleJohn]);

  return (
    <div className="min-h-screen bg-gradient-surface py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={littleJohnLogo} 
              alt="Little John" 
              className="h-16 w-auto"
            />
          </div>
          <div className="text-headline text-foreground max-w-4xl mx-auto leading-relaxed">
            Découvrez combien de temps un salarié économise et combien vous gagnerez grâce à Little John pour{' '}
            <span className="dropdown-inline cursor-default">
              {insuranceType}
            </span>
          </div>
        </div>

        {/* Main Calculator */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Side - Inputs */}
          <div className="space-y-8 animate-slide-up">
            <div className="card-premium">
              <h2 className="text-title mb-8 text-foreground">Paramètres de votre activité</h2>
              
              <div className="space-y-8">
                <SliderInput
                  label="Nombre de contrats signés par mois"
                  value={contractsPerMonth}
                  onChange={setContractsPerMonth}
                  min={limits.contracts.min}
                  max={limits.contracts.max}
                  step={limits.contracts.step}
                  unit=""
                />
                
                <SliderInput
                  label={`Prime moyenne HT d'un contrat ${insuranceType} (€)`}
                  value={averagePremium}
                  onChange={setAveragePremium}
                  min={limits.premium.min}
                  max={limits.premium.max}
                  step={limits.premium.step}
                  unit="€"
                  formatValue={(value) => value.toLocaleString('fr-FR')}
                />
                
                <SliderInput
                  label="Temps moyen passé par contrat sans Little John (heures)"
                  value={timeWithoutLittleJohn}
                  onChange={setTimeWithoutLittleJohn}
                  min={limits.time.min}
                  max={limits.time.max}
                  step={limits.time.step}
                  unit="h"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-premium">
              <h2 className="text-title mb-8 text-foreground">Impact de Little John</h2>
              
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-body text-muted-foreground mb-2">Temps économisé :</p>
                  <div className="text-display text-accent">
                    <AnimatedCounter value={timeSaved} precision={1} /> jours / mois
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-body text-muted-foreground mb-2">Chiffre d'affaires additionnel grâce à Little John :</p>
                  <div className="text-headline text-primary">
                    <AnimatedCounter value={annualCommission} /> € / an
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Summary */}
            <div className="card-premium bg-primary-soft border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-body text-primary leading-relaxed">
                  <strong>Économisez {timeSaved.toFixed(1)} jours par mois</strong> et générez{' '}
                  <strong>{annualCommission.toLocaleString('fr-FR')} € de chiffre d'affaires additionnel annuel</strong>{' '}
                  grâce à Little John.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => window.location.href = '/questionnaire-step-1'}
            className="btn-primary"
          >
            Analyse détaillée
          </button>
        </div>

        {/* Detail Modal */}
        <DetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          currentData={{
            contractsPerMonth,
            averagePremium,
            timeWithoutLittleJohn,
            annualCommission,
            timeSaved,
            insuranceType
          }}
        />
      </div>
    </div>
  );
};