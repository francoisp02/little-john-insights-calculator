import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const pipedriveApiKey = Deno.env.get("PIPEDRIVE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisData {
  // Step 1 data
  digitalizationLevel: number;
  automationLevel: number;
  dataQuality: number;
  processEfficiency: number;
  
  // Step 2 data
  contractsPerMonth: number;
  averagePremium: number;
  conversionRate: number;
  employeeCount: string;
  
  // Contact data
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    message?: string;
  };
  
  timestamp: string;
}

interface CalculatedMetrics {
  digitalMaturityScore: number;
  timeEfficiencyScore: number;
  potentialMonthlySavings: number;
  additionalRevenueOpportunity: number;
  overallOptimizationScore: number;
  recommendations: string[];
}

const calculateMetrics = (data: AnalysisData): CalculatedMetrics => {
  // Calcul du score de maturité digitale
  const digitalMaturityScore = Math.round(
    (data.digitalizationLevel + data.automationLevel + data.dataQuality + data.processEfficiency) / 4
  );

  // Calcul du score d'efficacité temporelle
  const timeEfficiencyScore = Math.round(
    (data.processEfficiency + data.automationLevel) / 2
  );

  // Estimation des économies potentielles (basé sur le nombre d'employés et l'efficacité)
  const employeeMultiplier = data.employeeCount === "1-5" ? 5 : 
                           data.employeeCount === "6-20" ? 15 : 
                           data.employeeCount === "21-50" ? 35 : 50;
  
  const inefficiencyGap = 100 - data.processEfficiency;
  const potentialMonthlySavings = Math.round((employeeMultiplier * inefficiencyGap * 50) / 100);

  // Calcul du CA additionnel potentiel
  const conversionImprovement = (100 - data.conversionRate) * 0.3; // 30% d'amélioration possible
  const additionalRevenueOpportunity = Math.round(
    data.contractsPerMonth * data.averagePremium * (conversionImprovement / 100)
  );

  // Score global d'optimisation
  const overallOptimizationScore = Math.round(
    (digitalMaturityScore + timeEfficiencyScore + 
     Math.min(potentialMonthlySavings / 100, 100) + 
     Math.min(additionalRevenueOpportunity / 1000, 100)) / 4
  );

  // Recommandations personnalisées
  const recommendations = [];
  
  if (data.digitalizationLevel < 70) {
    recommendations.push("Digitaliser vos processus de souscription pour gagner en rapidité");
  }
  if (data.automationLevel < 60) {
    recommendations.push("Automatiser les tâches répétitives pour libérer du temps commercial");
  }
  if (data.dataQuality < 70) {
    recommendations.push("Améliorer la qualité de vos données pour des analyses plus précises");
  }
  if (data.conversionRate < 80) {
    recommendations.push("Optimiser votre parcours client pour améliorer la conversion");
  }
  if (data.processEfficiency < 75) {
    recommendations.push("Revoir vos processus internes pour éliminer les goulots d'étranglement");
  }

  return {
    digitalMaturityScore,
    timeEfficiencyScore,
    potentialMonthlySavings,
    additionalRevenueOpportunity,
    overallOptimizationScore,
    recommendations
  };
};

const createPipedriveContact = async (data: AnalysisData, metrics: CalculatedMetrics) => {
  try {
    // Créer le contact d'abord
    const contactResponse = await fetch(`https://api.pipedrive.com/v1/persons?api_token=${pipedriveApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${data.contact.firstName} ${data.contact.lastName}`,
        email: [{ value: data.contact.email, primary: true }],
        'custom_fields': {
          'employee_count': data.employeeCount,
          'contracts_per_month': data.contractsPerMonth,
          'average_premium': data.averagePremium,
          'conversion_rate': data.conversionRate
        }
      }),
    });

    const contactData = await contactResponse.json();
    
    if (!contactData.success) {
      throw new Error(`Erreur création contact: ${contactData.error}`);
    }

    // Créer le deal ensuite
    const dealResponse = await fetch(`https://api.pipedrive.com/v1/deals?api_token=${pipedriveApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Analyse Little John - ${data.contact.firstName} ${data.contact.lastName}`,
        person_id: contactData.data.id,
        status: 'open',
        value: Math.round(metrics.additionalRevenueOpportunity * 12), // CA annuel potentiel
        currency: 'EUR',
        'custom_fields': {
          'digital_maturity_score': metrics.digitalMaturityScore,
          'optimization_score': metrics.overallOptimizationScore,
          'monthly_savings': metrics.potentialMonthlySavings,
          'revenue_opportunity': metrics.additionalRevenueOpportunity
        }
      }),
    });

    const dealData = await dealResponse.json();
    
    if (!dealData.success) {
      throw new Error(`Erreur création deal: ${dealData.error}`);
    }

    console.log('Contact et deal créés avec succès dans Pipedrive');
    return { contactId: contactData.data.id, dealId: dealData.data.id };

  } catch (error) {
    console.error('Erreur Pipedrive:', error);
    throw error;
  }
};

const sendAnalysisEmail = async (data: AnalysisData, metrics: CalculatedMetrics) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; }
        .metric-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .score { font-size: 2em; font-weight: bold; color: #1e40af; }
        .recommendations { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .cta-button { background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Votre Analyse Little John</h1>
          <p>Rapport personnalisé pour ${data.contact.firstName} ${data.contact.lastName}</p>
        </div>
        
        <div class="content">
          <h2>🎯 Vos Résultats d'Analyse</h2>
          
          <div class="metric-card">
            <h3>Score de Maturité Digitale</h3>
            <div class="score">${metrics.digitalMaturityScore}/100</div>
            <p>Votre niveau actuel de digitalisation des processus.</p>
          </div>
          
          <div class="metric-card">
            <h3>💰 Économies Potentielles</h3>
            <div class="score">${metrics.potentialMonthlySavings.toLocaleString()}€/mois</div>
            <p>Gains en efficacité possible avec une optimisation de vos processus.</p>
          </div>
          
          <div class="metric-card">
            <h3>📈 CA Additionnel Potentiel</h3>
            <div class="score">${metrics.additionalRevenueOpportunity.toLocaleString()}€/mois</div>
            <p>Revenus supplémentaires possible avec une meilleure conversion.</p>
          </div>
          
          <div class="metric-card">
            <h3>🚀 Score d'Optimisation Global</h3>
            <div class="score">${metrics.overallOptimizationScore}/100</div>
            <p>Votre potentiel d'amélioration global.</p>
          </div>
          
          <div class="recommendations">
            <h3>🎯 Vos Recommandations Prioritaires</h3>
            <ul>
              ${metrics.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
          
          <div style="text-align: center;">
            <p><strong>Prêt à passer à l'étape suivante ?</strong></p>
            <a href="https://calendly.com/little-john" class="cta-button">
              Planifier un rendez-vous gratuit
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Little John</strong> - Solutions d'Optimisation pour Courtiers</p>
          <p>Transformez votre activité avec nos outils dédiés</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailResponse = await resend.emails.send({
    from: "Little John <analysis@littlejohn.fr>",
    to: [data.contact.email],
    subject: `Votre analyse personnalisée est prête, ${data.contact.firstName} !`,
    html: emailHtml,
  });

  console.log("Email envoyé avec succès:", emailResponse);
  return emailResponse;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const analysisData: AnalysisData = await req.json();
    
    console.log("Traitement de l'analyse pour:", analysisData.contact.email);
    
    // 1. Calculer les métriques
    const metrics = calculateMetrics(analysisData);
    console.log("Métriques calculées:", metrics);
    
    // 2. Créer le lead dans Pipedrive
    const pipedriveResult = await createPipedriveContact(analysisData, metrics);
    console.log("Lead créé dans Pipedrive:", pipedriveResult);
    
    // 3. Envoyer l'email d'analyse
    const emailResult = await sendAnalysisEmail(analysisData, metrics);
    console.log("Email envoyé:", emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        metrics,
        pipedriveContactId: pipedriveResult.contactId,
        pipedriveDealtId: pipedriveResult.dealId,
        emailId: emailResult.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Erreur dans process-analysis:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);