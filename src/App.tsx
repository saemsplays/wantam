
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import TaxBill2025 from "./pages/TaxBill2025";
import BudgetBill2025 from "./pages/BudgetBill2025";
import InvestmentBill2025 from "./pages/InvestmentBill2025";
import DigitalEconomyBill2025 from "./pages/DigitalEconomyBill2025";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tax-bill-2025" element={<TaxBill2025 />} />
            <Route path="/budget-bill-2025" element={<BudgetBill2025 />} />
            <Route path="/investment-bill-2025" element={<InvestmentBill2025 />} />
            <Route path="/digital-economy-bill-2025" element={<DigitalEconomyBill2025 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ScrollToTop />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
