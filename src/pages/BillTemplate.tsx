
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mail, FileText, CheckCircle, User, AlertTriangle, Shield, Scale, Users, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const billData = {
  'tax-laws-amendment-2024': {
    title: 'Tax Laws (Amendment) Bill 2024',
    description: 'Amendments to existing tax legislation affecting individual and corporate taxation',
    objections: [
      'Violation of Article 43 - Right to Economic and Social Rights',
      'Disproportionate burden on low-income households',
      'Lack of adequate public participation as required by Article 118(1)'
    ],
    letterTemplate: `Dear Clerk of the National Assembly and Members of the Finance Committee,

RE: MEMORANDUM OF OBJECTION TO THE TAX LAWS (AMENDMENT) BILL 2024

Following the invitation by the National Assembly to submit comments on the above. Recognizing the Sovereignty of the People and Supremacy of the Constitution as under Chapter 1 of the Constitution of Kenya 2010, Rights and Fundamental Freedoms as provided under Chapter 4 of the Bill of Rights, Leadership and Integrity of State Officers as under Chapter 6, the Role of the Legislature under Chapter 8.

Pursuant to Articles 10(2), 118(1) of the Constitution 2010 that mandates Public Participation in any Legislative Process I wish to submit my Memoranda as follows:

1. REJECTION OF PROPOSED TAX RATE INCREASES

This amendment violates the economic and social rights guaranteed under Article 43 of the Constitution of Kenya 2010.
The proposed tax increases will disproportionately burden middle and low-income households, affecting their ability to access basic necessities.

2. CONCERNS ABOUT IMPLEMENTATION TIMELINE

The rushed implementation timeline does not allow for adequate public consultation as mandated by Article 118(1) of the Constitution.
Citizens require sufficient time to understand and provide meaningful input on tax policy changes.

In conclusion, I call for the withdrawal of this Bill as it fails to meet constitutional requirements for public participation and threatens the economic welfare of Kenyan citizens.

Yours Faithfully,

[USER_NAME_PLACEHOLDER]

Citizen of Kenya`
  },
  // Add other bills here with similar structure
};

const BillTemplate: React.FC = () => {
  const { billId } = useParams<{ billId: string }>();
  const [userName, setUserName] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState({
    clerk: true,
    financeCommittee: true
  });
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  const currentBill = billData[billId as keyof typeof billData];

  useEffect(() => {
    if (currentBill) {
      setSubject(`RE: MEMORANDUM OF OBJECTION TO THE ${currentBill.title.toUpperCase()}`);
      setMessageBody(currentBill.letterTemplate);
    }
  }, [currentBill]);

  if (!currentBill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Bill Not Found</h2>
            <p className="text-gray-600 mb-4">The bill you're looking for doesn't exist.</p>
            <a href="/">
              <Button>Back to Finance Bill</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recipients = {
    clerk: {
      name: "Clerk of the National Assembly",
      email: "cna@parliament.go.ke"
    },
    financeCommittee: {
      name: "Finance Committee of the National Assembly", 
      email: "financecommitteena@parliament.go.ke"
    }
  };

  const handleRecipientChange = (recipient: string, checked: boolean) => {
    setSelectedRecipients(prev => ({
      ...prev,
      [recipient]: checked
    }));
  };

  const getSelectedRecipientEmails = () => {
    const emails: string[] = [];
    if (selectedRecipients.clerk) emails.push(recipients.clerk.email);
    if (selectedRecipients.financeCommittee) emails.push(recipients.financeCommittee.email);
    return emails;
  };

  const handleSendEmail = async () => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name to complete the objection letter",
        variant: "destructive"
      });
      return;
    }

    if (!selectedRecipients.clerk && !selectedRecipients.financeCommittee) {
      toast({
        title: "Select Recipients",
        description: "Please select at least one recipient",
        variant: "destructive"
      });
      return;
    }

    const selectedEmails = getSelectedRecipientEmails();
    const to = selectedEmails.join(',');
    const encodedSubject = encodeURIComponent(subject);
    const personalizedMessage = messageBody.replace('[USER_NAME_PLACEHOLDER]', userName.trim());
    const encodedBody = encodeURIComponent(personalizedMessage);
    
    const mailtoLink = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening Your Email App",
      description: "Your objection letter is ready to send! Review and click send in your email app.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <a href="/" className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Finance Bill
          </a>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Object to the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
              {currentBill.title}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {currentBill.description}
          </p>
        </div>

        <div className="space-y-8">
          {/* Key Objections */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Key Constitutional Objections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentBill.objections.map((objection, index) => (
                  <li key={index} className="flex items-start gap-2 text-amber-800">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>{objection}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Your Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                Your Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userName">Full Name *</Label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Enter your full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-600" />
                Send To
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg">
                  <Checkbox
                    id="clerk"
                    checked={selectedRecipients.clerk}
                    onCheckedChange={(checked) => handleRecipientChange('clerk', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="clerk" className="flex-1 cursor-pointer">
                    <div className="font-semibold">{recipients.clerk.name}</div>
                    <div className="text-sm text-gray-600">{recipients.clerk.email}</div>
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg">
                  <Checkbox
                    id="financeCommittee"
                    checked={selectedRecipients.financeCommittee}
                    onCheckedChange={(checked) => handleRecipientChange('financeCommittee', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="financeCommittee" className="flex-1 cursor-pointer">
                    <div className="font-semibold">{recipients.financeCommittee.name}</div>
                    <div className="text-sm text-gray-600">{recipients.financeCommittee.email}</div>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-purple-600" />
                Email Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="font-medium"
              />
            </CardContent>
          </Card>

          {/* Letter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-indigo-600" />
                Your Objection Letter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={messageBody.replace(
                  '[USER_NAME_PLACEHOLDER]',
                  userName || '[Your Name Will Appear Here]'
                )}
                onChange={(e) => {
                  const newValue = e.target.value.replace(
                    userName || '[Your Name Will Appear Here]',
                    '[USER_NAME_PLACEHOLDER]'
                  );
                  setMessageBody(newValue);
                }}
                rows={20}
                className="text-sm leading-relaxed font-mono resize-none"
              />
            </CardContent>
          </Card>

          {/* Send Button */}
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Button
                  onClick={handleSendEmail}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold"
                >
                  <Send className="mr-3 h-6 w-6" />
                  Send Objection Letter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillTemplate;
