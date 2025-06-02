
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, FileText, Heart, AlertTriangle, Plus, ExternalLink, X } from "lucide-react";

export const MobileFAB: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        setIsVisible(scrollPosition > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSuggestionSubmit = () => {
    if (suggestion.trim()) {
      console.log('Bill suggestion submitted:', suggestion);
      setSuggestion('');
      setShowSuggestionForm(false);
    }
  };

  const relatedBills = [
    { name: "Tax Laws (Amendment) Bill", year: "2024", status: "Active", path: "/bills/tax-laws-amendment-2024" },
    { name: "Public Finance Management Bill", year: "2024", status: "Pending", path: "/bills/public-finance-management-2024" },
    { name: "Revenue Administration Bill", year: "2024", status: "Draft", path: "/bills/revenue-administration-2024" },
    { name: "Banking (Amendment) Bill", year: "2024", status: "Active", path: "/bills/banking-amendment-2024" },
    { name: "Capital Markets Bill", year: "2024", status: "Review", path: "/bills/capital-markets-2024" }
  ];

  if (!isVisible) return null;

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            size="sm"
          >
            <Menu className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Quick Actions</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4 mt-6">
            {/* Related Bills Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Related Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {relatedBills.map((bill, index) => (
                    <a
                      key={index}
                      href={bill.path}
                      className="block p-2 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-gray-900 leading-tight mb-1">
                            {bill.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{bill.year}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              bill.status === 'Active' ? 'bg-green-100 text-green-700' :
                              bill.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {bill.status}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </div>
                    </a>
                  ))}
                </div>

                {/* Suggest Bill Form */}
                {!showSuggestionForm ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSuggestionForm(true)}
                    className="w-full text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Suggest a Bill
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Suggest a bill for us to cover..."
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      className="text-xs resize-none"
                      rows={3}
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSuggestionForm(false)}
                        className="flex-1 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSuggestionSubmit}
                        className="flex-1 text-xs"
                        disabled={!suggestion.trim()}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <a
                href="https://www.paypal.com/ncp/payment/5HP7FN968RTH6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Heart className="h-4 w-4 mr-2" />
                  Support Us
                </Button>
              </a>
              
              <a
                href="https://ceka.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full border-blue-200">
                  <img 
                    src="/lovable-uploads/5fd566ee-5934-4cc8-a80d-a33de3e8c578.png" 
                    alt="CEKA" 
                    className="h-4 w-4 mr-2" 
                  />
                  Visit CEKA
                </Button>
              </a>
              
              <a href="/report-violations">
                <Button variant="outline" className="w-full border-red-200 text-red-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Violations
                </Button>
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
