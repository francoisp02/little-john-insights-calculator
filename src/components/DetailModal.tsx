import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    contractsPerMonth: number;
    averagePremium: number;
    timeWithoutLittleJohn: number;
    annualCommission: number;
    timeSaved: number;
    insuranceType: string;
  };
}

type RevenueRange = '0-300K' | '300K-500K' | '500K-750K' | '750K-1M' | '1M-2M' | '2M-5M' | '+5M';

export const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, currentData }) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [employees, setEmployees] = useState(5);
  const [insuranceShare, setInsuranceShare] = useState(30);
  const [revenueRange, setRevenueRange] = useState<RevenueRange>('500K-750K');
  const [isRevenueDropdownOpen, setIsRevenueDropdownOpen] = useState(false);
  
  // Contact form
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const revenueOptions: RevenueRange[] = ['0-300K', '300K-500K', '500K-750K', '750K-1M', '1M-2M', '2M-5M', '+5M'];

  const handleSubmitAnalysis = () => {
    setShowContactForm(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Contact form submitted:', contactData);
    alert('Merci ! Nous vous enverrons l\'analyse approfondie par mail.');
    onClose();
    setShowContactForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-headline text-foreground">
              {showContactForm ? 'Demande d\'analyse approfondie' : 'Analyse détaillée'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-variant rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          {!showContactForm ? (
            <>
              {/* Current Results Summary */}
              <div className="card-premium mb-8 bg-primary-soft">
                <h3 className="text-title mb-4 text-primary">Vos résultats actuels</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-caption text-muted-foreground">Commission annuelle</p>
                    <p className="text-xl font-semibold text-primary">
                      {currentData.annualCommission.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground">Temps économisé/mois</p>
                    <p className="text-xl font-semibold text-accent">
                      {currentData.timeSaved.toFixed(1)} heures
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Parameters */}
              <div className="space-y-6 mb-8">
                <h3 className="text-title text-foreground">Paramètres complémentaires</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-body font-medium text-foreground mb-3">
                      Nombre d'employés
                    </label>
                    <input
                      type="number"
                      value={employees}
                      onChange={(e) => setEmployees(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      min="1"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-medium text-foreground mb-3">
                      Part des {currentData.insuranceType} dans vos contrats (%)
                    </label>
                    <input
                      type="number"
                      value={insuranceShare}
                      onChange={(e) => setInsuranceShare(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-body font-medium text-foreground mb-3">
                    Chiffre d'affaires annuel
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsRevenueDropdownOpen(!isRevenueDropdownOpen)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-left flex justify-between items-center hover:bg-surface-variant transition-colors duration-200"
                    >
                      {revenueRange}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isRevenueDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isRevenueDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-large py-2 z-10 animate-scale-in">
                        {revenueOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setRevenueRange(option);
                              setIsRevenueDropdownOpen(false);
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

              {/* CTA */}
              <div className="text-center">
                <button
                  onClick={handleSubmitAnalysis}
                  className="btn-primary w-full"
                >
                  Estimer l'impact de l'IA sur mon cabinet
                </button>
              </div>
            </>
          ) : (
            /* Contact Form */
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <p className="text-body text-muted-foreground mb-6">
                Nous allons vous envoyer l'analyse approfondie par mail.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-body font-medium text-foreground mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-body font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-body font-medium text-foreground mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-body font-medium text-foreground mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  rows={4}
                  value={contactData.message}
                  onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-vertical"
                  placeholder="Précisez vos besoins ou questions spécifiques..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="btn-secondary flex-1"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Recevoir l'analyse
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};