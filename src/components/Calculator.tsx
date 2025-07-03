import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SliderInput } from './SliderInput';
import { AnimatedCounter } from './AnimatedCounter';
import { DetailModal } from './DetailModal';

type InsuranceType = 'flotte automobile' | 'RC Pro' | 'Multirisque';

export const Calculator = () => {
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('flotte automobile');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Inputs
  const [contractsPerMonth, setContractsPerMonth] = useState(15);
  const [averagePremium, setAveragePremium] = useState(14500);
  const [timeWithoutLittleJohn, setTimeWithoutLittleJohn] = useState(3);
  
  // Calculated outputs
  const [annualCommission, setAnnualCommission] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  
  const insuranceOptions: InsuranceType[] = ['flotte automobile', 'RC Pro', 'Multirisque'];
  
  useEffect(() => {
    // Commission calculation: nombre × (1/3) × 12 × prime moyenne
    const commission = contractsPerMonth * (1/3) * 12 * averagePremium;
    setAnnualCommission(commission);
    
    // Time saved calculation: (nombre × 0.75 × 40) - (nombre × 0.75 × temps moyen)
    const timeWithLittleJohn = contractsPerMonth * 0.75 * 0.5; // 30 minutes with Little John
    const timeWithoutTool = contractsPerMonth * 0.75 * timeWithoutLittleJohn;
    const saved = timeWithoutTool - timeWithLittleJohn;
    setTimeSaved(saved);
  }, [contractsPerMonth, averagePremium, timeWithoutLittleJohn]);

  return (
    <div className="min-h-screen bg-gradient-surface py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-display mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Calculatrice Little John
          </h1>
          <div className="text-headline text-foreground max-w-4xl mx-auto leading-relaxed">
            Découvrez combien de temps un salarié économise et combien vous gagnerez grâce à Little John pour{' '}
            <div className="relative inline-block">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="dropdown-inline"
              >
                {insuranceType}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg shadow-large py-2 z-10 min-w-full animate-scale-in">
                  {insuranceOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setInsuranceType(option);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-surface-variant transition-colors duration-150"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                  min={0}
                  max={30}
                  step={1}
                  unit=""
                />
                
                <SliderInput
                  label={`Prime moyenne d'un contrat ${insuranceType} (€)`}
                  value={averagePremium}
                  onChange={setAveragePremium}
                  min={7000}
                  max={25000}
                  step={500}
                  unit="€"
                  formatValue={(value) => value.toLocaleString('fr-FR')}
                />
                
                <SliderInput
                  label="Temps moyen passé par contrat sans Little John (heures)"
                  value={timeWithoutLittleJohn}
                  onChange={setTimeWithoutLittleJohn}
                  min={1.5}
                  max={5}
                  step={0.25}
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
                  <p className="text-body text-muted-foreground mb-2">Commission générée grâce à Little John :</p>
                  <div className="text-display text-primary">
                    <AnimatedCounter value={annualCommission} /> € / an
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-body text-muted-foreground mb-2">Temps économisé :</p>
                  <div className="text-headline text-accent">
                    <AnimatedCounter value={timeSaved} precision={1} /> h / mois
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
                  <strong>Économisez {timeSaved.toFixed(1)}h par mois</strong> et générez{' '}
                  <strong>{annualCommission.toLocaleString('fr-FR')} € de commissions annuelles</strong>{' '}
                  supplémentaires avec Little John.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            Découvrez comment éliminer ces coûts
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