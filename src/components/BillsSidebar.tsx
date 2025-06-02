
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ChevronDown, ChevronUp, Plus, ExternalLink } from "lucide-react";

interface Bill {
  name: string;
  year: string;
  status: string;
  path: string;
}

const relatedBills: Bill[] = [
  { name: "Tax Laws (Amendment) Bill", year: "2024", status: "Active", path: "/bills/tax-laws-amendment-2024" },
  { name: "Public Finance Management Bill", year: "2024", status: "Pending", path: "/bills/public-finance-management-2024" },
  { name: "Revenue Administration Bill", year: "2024", status: "Draft", path: "/bills/revenue-administration-2024" },
  { name: "Banking (Amendment) Bill", year: "2024", status: "Active", path: "/bills/banking-amendment-2024" },
  { name: "Capital Markets Bill", year: "2024", status: "Review", path: "/bills/capital-markets-2024" }
];

export const BillsSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const handleSuggestionSubmit = () => {
    if (suggestion.trim()) {
      console.log('Bill suggestion submitted:', suggestion);
      setSuggestion('');
      setShowSuggestionForm(false);
      // Here you would typically send to a backend or email
    }
  };

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <Card className="w-64 shadow-lg border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Related Bills
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </CardTitle>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-2 mb-4">
              {relatedBills.map((bill, index) => (
                <a
                  key={index}
                  href={bill.path}
                  className="block p-2 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
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
                    <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </a>
              ))}
            </div>

            <div className="border-t pt-3">
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
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
