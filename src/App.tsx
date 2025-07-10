import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { QuestionnaireStep1 } from "./pages/QuestionnaireStep1";
import { QuestionnaireStep2 } from "./pages/QuestionnaireStep2";
import { AnalyseEnCours } from "./pages/AnalyseEnCours";
import { ContactConfirmation } from "./pages/ContactConfirmation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/questionnaire-step-1" element={<QuestionnaireStep1 />} />
          <Route path="/questionnaire-step-2" element={<QuestionnaireStep2 />} />
          <Route path="/analyse-en-cours" element={<AnalyseEnCours />} />
          <Route path="/contact-confirmation" element={<ContactConfirmation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
