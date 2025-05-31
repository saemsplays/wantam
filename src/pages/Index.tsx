
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mail, FileText, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState({
    clerk: true,
    financeCommittee: true
  });
  const [subject, setSubject] = useState('RE: MEMORANDUM OF OBJECTION TO THE FINANCE BILL 2025 (NATIONAL ASSEMBLY BILLS NO. 19 OF 2025)');
  const [messageBody, setMessageBody] = useState(`Dear Official,

The above subject refers;

Following the invitation by the National Assembly to submit comments on the above. Recognizing the Sovereignty of the People and Supremacy of the Constitution as under Chapter 1 of the Constitution of Kenya 2010, Rights and Fundamental Freedoms as provided under Chapter 4 of the Bill of Rights, Leadership and Integrity of State Officers as under Chapter 6, the Role of the Legislature under Chapter 8.
Pursuant to Articles 10(2), 118(1) of the Constitution 2010 that mandates Public Participation in any Legislative Process I wish to submit my Memoranda as follows:

1. REJECTION OF SECTION A, PART I OF THE 1ST SCHEDULE OF THE VALUE ADDED TAX ACT

This amendment is incompatible with the economic and social rights guaranteed under Article 43 of the Constitution of Kenya 2010.
Removing zero-rated status from essential goods will increase the cost of living and disproportionately burden low-income households.
The agricultural sector, a key economic driver, will be negatively affected, harming Kenyan households that rely on agriculture for income.


2. REJECTION OF AMENDMENTS TO SECTIONS 2 & 5 OF THE EXCISE DUTY ACT

These amendments violate the non-discrimination protections under Article 27 of the Constitution of Kenya 2010.
Expanding digital lending tax to include services offered by non-resident persons over the internet will adversely affect Kenyans who depend on digital loans for essential expenses.
While aiming to create fair competition, these changes will increase borrowing costs, making credit less accessible and leading to financial exclusion for low and middle-income Kenyans.


3. REJECTION OF AMENDMENTS TO SECTION 59A OF THE TAX PROCEDURES ACT

The deletion of subsection 1B is unconstitutional as it infringes on the right to privacy guaranteed under Article 31 of the Constitution of Kenya 2010.
This amendment would grant the Commissioner unrestricted authority to access personal and private data, including M-Pesa financial records, without necessary safeguards.
There are inadequate protections against potential overreach by the Kenya Revenue Authority, creating a risk of unauthorized access to citizens' private financial information.



In conclusion, I call for the withdrawal of this Bill as it is made in Bad Faith, ignorant to the Current Economic Needs and Political Wills of the People of Kenya, Will Entrench the Abuse of Power by the Revenue Authorities, A Dubious Attempt to Sneak in Tyranny, Reinforce Poverty, Promote Marginalization and at the end of it Will Deny Kenyans the Transformative Agenda of Vision 2030. I thus pray that you Reject it for the sake of a better Kenya.
Yours Faithfully,

……………(Your Name)……………………………..(SIGN)

Citizen of Kenya`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const recipients = {
    clerk: {
      name: "The Clerk of The National Assembly",
      email: "cna@parliament.go.ke"
    },
    financeCommittee: {
      name: "The Finance Committee of the National Assembly",
      email: "financecommitteena@parliament.go.ke"
    }
  };

  // Auto-complete email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    localStorage.setItem('userEmail', newEmail);
  };

  const handleRecipientChange = (recipient: string, checked: boolean) => {
    setSelectedRecipients(prev => ({
      ...prev,
      [recipient]: checked
    }));
  };

  const getSelectedRecipientEmails = () => {
    const emails = [];
    if (selectedRecipients.clerk) emails.push(recipients.clerk.email);
    if (selectedRecipients.financeCommittee) emails.push(recipients.financeCommittee.email);
    return emails;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
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

    if (!messageBody.includes('(Your Name)')) {
      toast({
        title: "Sign Your Message",
        description: "Please replace '(Your Name)' with your actual name in the message body",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate email sending (in real implementation, this would call your backend)
      const selectedEmails = getSelectedRecipientEmails();
      const emailData = {
        from: email,
        to: selectedEmails,
        subject: subject,
        body: messageBody
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Email submission:', emailData);
      
      setIsSubmitted(true);
      toast({
        title: "Objection Submitted Successfully!",
        description: `Your memorandum has been sent to ${selectedEmails.length} recipient(s)`,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error sending your objection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Objection Submitted Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Your memorandum against the Finance Bill 2025 has been sent to the National Assembly.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Sent to:</h3>
                <ul className="text-sm text-gray-600">
                  {selectedRecipients.clerk && <li>• The Clerk of The National Assembly</li>}
                  {selectedRecipients.financeCommittee && <li>• The Finance Committee of the National Assembly</li>}
                </ul>
              </div>
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setMessageBody(messageBody); // Keep the edited message
                }}
                variant="outline"
              >
                Submit Another Objection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Finance Bill 2025 Objection
              </h1>
              <p className="text-gray-600">
                Submit your memorandum to the National Assembly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Your Email Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                required
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Recipients Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="clerk"
                    checked={selectedRecipients.clerk}
                    onCheckedChange={(checked) => handleRecipientChange('clerk', checked as boolean)}
                  />
                  <Label htmlFor="clerk" className="text-sm font-medium">
                    {recipients.clerk.name} ({recipients.clerk.email})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="financeCommittee"
                    checked={selectedRecipients.financeCommittee}
                    onCheckedChange={(checked) => handleRecipientChange('financeCommittee', checked as boolean)}
                  />
                  <Label htmlFor="financeCommittee" className="text-sm font-medium">
                    {recipients.financeCommittee.name} ({recipients.financeCommittee.email})
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Line */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Line</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Message Body */}
          <Card>
            <CardHeader>
              <CardTitle>Your Memorandum</CardTitle>
              <p className="text-sm text-gray-600">
                Edit the message below as needed. Remember to replace "(Your Name)" with your actual name and sign at the end.
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                rows={25}
                className="text-sm leading-relaxed"
              />
            </CardContent>
          </Card>

          {/* Reminder */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-500 p-1 rounded-full mt-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Before Submitting
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    Please ensure you have replaced "(Your Name)" with your actual name and signed the message at the end.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Objection
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            Exercise your constitutional right to participate in legislative processes.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Articles 10(2), 118(1) of the Constitution of Kenya 2010
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
