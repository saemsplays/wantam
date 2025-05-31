
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mail, FileText, CheckCircle, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState('');
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState({
    clerk: true,
    financeCommittee: true
  });
  const [subject, setSubject] = useState('RE: MEMORANDUM OF OBJECTION TO THE FINANCE BILL 2025 (NATIONAL ASSEMBLY BILLS NO. 19 OF 2025)');
  const [messageBody, setMessageBody] = useState(`Dear Clerk of the National Assembly and Members of the Finance Committee,

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

[Your Name Here]

Citizen of Kenya`);

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

  const handleGoogleSignIn = () => {
    // Simulate Google sign-in - in real implementation this would use Google OAuth
    const mockGoogleEmail = "user@gmail.com";
    setEmail(mockGoogleEmail);
    setIsGoogleSignedIn(true);
    localStorage.setItem('userEmail', mockGoogleEmail);
    toast({
      title: "Signed in with Google",
      description: "Your email has been auto-filled",
    });
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

  const handleSendEmail = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address or sign in with Google",
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

    if (messageBody.includes('[Your Name Here]')) {
      toast({
        title: "Complete Your Letter",
        description: "Please replace '[Your Name Here]' with your actual name",
        variant: "destructive"
      });
      return;
    }

    const selectedEmails = getSelectedRecipientEmails();
    const to = selectedEmails.join(',');
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(messageBody);
    
    const mailtoLink = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    
    console.log('Opening email client with:', { to, subject, body: messageBody });
    
    // Open email client
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening Email Client",
      description: `Launching your email app with ${selectedEmails.length} recipient(s)`,
    });
  };

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
                Submit your formal objection to the National Assembly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          
          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-blue-800 text-sm">
                <strong>Instructions:</strong> Fill in your details below and click "Send Email" to open your email client (Gmail, Outlook, etc.) with a pre-filled objection letter. You can review and modify the letter before sending.
              </p>
            </CardContent>
          </Card>

          {/* Email Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Your Email Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isGoogleSignedIn ? (
                <>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    className="text-lg"
                  />
                  <div className="text-center">
                    <span className="text-sm text-gray-500">Or</span>
                  </div>
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Sign in with Google to autofill
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Signed in: {email}</span>
                  <Button
                    onClick={() => {
                      setIsGoogleSignedIn(false);
                      setEmail('');
                    }}
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-green-600"
                  >
                    Change
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipients Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Recipients</CardTitle>
              <p className="text-sm text-gray-600">Choose who to send your objection to:</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="clerk"
                    checked={selectedRecipients.clerk}
                    onCheckedChange={(checked) => handleRecipientChange('clerk', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="clerk" className="text-sm font-medium leading-relaxed">
                    <div className="font-semibold">{recipients.clerk.name}</div>
                    <div className="text-gray-600">{recipients.clerk.email}</div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="financeCommittee"
                    checked={selectedRecipients.financeCommittee}
                    onCheckedChange={(checked) => handleRecipientChange('financeCommittee', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="financeCommittee" className="text-sm font-medium leading-relaxed">
                    <div className="font-semibold">{recipients.financeCommittee.name}</div>
                    <div className="text-gray-600">{recipients.financeCommittee.email}</div>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Line */}
          <Card>
            <CardHeader>
              <CardTitle>Email Subject</CardTitle>
              <p className="text-sm text-gray-600">You can edit the subject line if needed:</p>
            </CardHeader>
            <CardContent>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-lg font-medium"
              />
            </CardContent>
          </Card>

          {/* Message Body */}
          <Card>
            <CardHeader>
              <CardTitle>Your Objection Letter</CardTitle>
              <p className="text-sm text-gray-600">
                Review and edit the formal objection letter below. Make sure to replace "[Your Name Here]" with your actual name.
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                rows={30}
                className="text-sm leading-relaxed font-mono"
              />
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-500 p-1 rounded-full mt-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Before Sending
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    Please ensure you have replaced "[Your Name Here]" with your actual name and reviewed all the content above. 
                    Clicking "Send Email" will open your email client with the objection ready to send.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSendEmail}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-semibold"
            >
              <Send className="mr-3 h-6 w-6" />
              Send Email Now
            </Button>
          </div>

          {/* Final Review Section */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Review Your Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">From:</span> {email || "Please enter your email"}
              </div>
              <div>
                <span className="font-medium">To:</span> {
                  getSelectedRecipientEmails().length > 0 
                    ? getSelectedRecipientEmails().join(', ')
                    : "Please select recipients"
                }
              </div>
              <div>
                <span className="font-medium">Subject:</span> {subject}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className={messageBody.includes('[Your Name Here]') 
                  ? "text-red-600 ml-2" 
                  : "text-green-600 ml-2"
                }>
                  {messageBody.includes('[Your Name Here]') 
                    ? "⚠️ Please replace [Your Name Here] with your actual name"
                    : "✅ Ready to send"
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
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
