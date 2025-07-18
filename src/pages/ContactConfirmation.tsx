import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import littleJohnLogo from '../assets/little-john-logo.png';

export const ContactConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get questionnaire data from localStorage
      const step1Data = JSON.parse(localStorage.getItem('questionnaireStep1') || '{}');
      const step2Data = JSON.parse(localStorage.getItem('questionnaireStep2') || '{}');
      
      const completeData = {
        ...step1Data,
        ...step2Data,
        contact: formData,
        timestamp: new Date().toISOString()
      };

      console.log('Envoi des données pour traitement:', completeData);

      // Appel de l'Edge Function pour traiter l'analyse
      const { data, error } = await supabase.functions.invoke('process-analysis', {
        body: completeData,
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du traitement');
      }

      console.log('Analyse traitée avec succès:', data);
      
      // Clear localStorage
      localStorage.removeItem('questionnaireStep1');
      localStorage.removeItem('questionnaireStep2');
      
      setIsSubmitted(true);
      
      toast({
        title: "Succès !",
        description: "Votre analyse a été envoyée par email et votre profil créé.",
      });

    } catch (error: any) {
      console.error('Erreur lors du traitement:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du traitement de votre demande.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/analyse-en-cours');
  };

  const handleNewAnalysis = () => {
    navigate('/');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-12 text-center">
              <div className="mb-8">
                <img src={littleJohnLogo} alt="Little John" className="h-12 mx-auto mb-6" />
              </div>

              <div className="space-y-6">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
                
                <div>
                  <h1 className="text-headline text-primary mb-4">
                    Merci ! Votre analyse est en route
                  </h1>
                  <p className="text-body text-muted-foreground">
                    Vous recevrez votre analyse détaillée et vos recommandations personnalisées 
                    dans votre boîte mail sous peu.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 mt-8">
                  <h3 className="font-semibold text-foreground mb-2">Ce que vous allez recevoir :</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 text-left">
                    <li>• Votre analyse personnalisée complète</li>
                    <li>• Un audit des points les plus optimisables</li>
                    <li>• Des recommandations concrètes pour votre activité</li>
                    <li>• Un plan d'action prioritaire</li>
                  </ul>
                </div>

                <Button onClick={handleNewAnalysis} size="lg" className="mt-8">
                  Faire une nouvelle analyse
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-4">
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

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <Mail className="h-12 w-12 mx-auto text-primary mb-4" />
              <h1 className="text-headline text-primary mb-2">
                Recevez votre analyse détaillée
              </h1>
              <p className="text-body text-muted-foreground">
                Votre rapport personnalisé sera envoyé directement dans votre boîte mail, 
                accompagné d'un audit sur les leviers d'optimisation de votre entreprise.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jean"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean.dupont@exemple.fr"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nom de l'entreprise"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (optionnel)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Des questions spécifiques ou des précisions à ajouter ?"
                  rows={3}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Confidentialité garantie</p>
                  <p>Vos données ne seront jamais transmises à des tiers. Elles sont uniquement utilisées pour personnaliser votre analyse et vous recontacter si nécessaire.</p>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Traitement en cours..." : "Recevoir mon analyse"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};