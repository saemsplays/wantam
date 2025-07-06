import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BudgetBill2025 from "./pages/BudgetBill2025";
import TaxBill2025 from "./pages/TaxBill2025";
import InvestmentBill2025 from "./pages/InvestmentBill2025";
import DigitalEconomyBill2025 from "./pages/DigitalEconomyBill2025";
import NotFound from "./pages/NotFound";
import { TemplateViewer } from "./components/TemplateViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/template/:templateId" element={<TemplateViewer />} />
          <Route path="/budget-2025" element={<BudgetBill2025 />} />
          <Route path="/tax-2025" element={<TaxBill2025 />} />
          <Route path="/investment-2025" element={<InvestmentBill2025 />} />
          <Route path="/digital-2025" element={<DigitalEconomyBill2025 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
