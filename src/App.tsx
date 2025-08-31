
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import BudgetBill2025 from './pages/BudgetBill2025';
import TaxBill2025 from './pages/TaxBill2025';
import InvestmentBill2025 from './pages/InvestmentBill2025';
import DigitalEconomyBill2025 from './pages/DigitalEconomyBill2025';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/budget-2025" element={<BudgetBill2025 />} />
            <Route path="/tax-2025" element={<TaxBill2025 />} />
            <Route path="/investment-2025" element={<InvestmentBill2025 />} />
            <Route path="/digital-2025" element={<DigitalEconomyBill2025 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
