import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, Copy, Eye, Share2, FileText, Plus, X, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  slug: string | null;
  title: string;
  body: string;
  metadata: any;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  views_count: number;
  uses_count: number;
  is_verified?: boolean;
}

interface TemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    title?: string;
    body?: string;
    subject?: string;
  };
}

export const TemplateCreator: React.FC<TemplateCreatorProps> = ({
  isOpen,
  onClose,
  initialData
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [customSlug, setCustomSlug] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');

  // Dynamic sections
  const [recipientsTitle, setRecipientsTitle] = useState('Send To');
  const [recipientsDescription, setRecipientsDescription] = useState('Select who should receive your objection letter');
  const [subjectTitle, setSubjectTitle] = useState('Email Subject');
  const [subjectDescription, setSubjectDescription] = useState('The subject line for your objection email');
  const [letterTitle, setLetterTitle] = useState('Your Objection Letter');
  const [letterDescription, setLetterDescription] = useState('Review and edit your formal objection letter. The letter cites specific constitutional violations and legal grounds.');
  const [keyObjections, setKeyObjections] = useState([
    'VAT on essential goods (Art 43 violation)',
    'Digital lending tax expansion (Art 27 violation)',
    'Privacy rights erosion (Art 31 violation)'
  ]);
  const [newObjection, setNewObjection] = useState('');
  const [isAddingObjection, setIsAddingObjection] = useState(false);

  const generateSlug = (titleText: string) => {
    return titleText
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const addObjection = () => {
    if (!newObjection.trim()) return;
    setKeyObjections(prev => [...prev, newObjection.trim()]);
    setNewObjection('');
    setIsAddingObjection(false);
  };

  const removeObjection = (index: number) => {
    setKeyObjections(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveTemplate = async () => {
    if (!title.trim() || !body.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and body for your template",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const slug = customSlug || generateSlug(title);
      const metadata = {
        subject: subject || '',
        tags: ['finance-bill', 'objection'],
        originalApp: 'civiceducationke',
        sections: {
          recipientsTitle,
          recipientsDescription,
          subjectTitle,
          subjectDescription,
          letterTitle,
          letterDescription,
          keyObjections
        }
      };

      const { data, error } = await supabase
        .from('templates')
        .insert({
          title,
          body,
          slug,
          metadata,
          is_public: isPublic,
          created_by: user?.id || null,
          is_verified: false // New templates start as unverified
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "URL Already Taken",
            description: "This URL slug is already in use. Please choose a different one.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      if (data) {
        const url = `${window.location.origin}/template/${data.slug || data.id}`;
        setShareableUrl(url);
        setShowShareDialog(true);

        toast({
          title: "Template Saved!",
          description: "Your shareable template has been created successfully.",
        });
      }

    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast({
        title: "Link Copied!",
        description: "The shareable link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the link above.",
        variant: "destructive"
      });
    }
  };

  const handlePreview = () => {
    if (shareableUrl) {
      window.open(shareableUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Create Shareable Template
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Template Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Finance Bill 2025 Objection Template"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Email Subject (Optional)</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Default email subject line"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="customSlug">Custom URL (Optional)</Label>
                  <Input
                    id="customSlug"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="e.g., finance-bill-objection-2025"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Will be: wantam.lovable.app/template/{customSlug || generateSlug(title)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Sections Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Section Configuration</CardTitle>
                <p className="text-sm text-gray-600">Customize the titles and descriptions for each section</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recipients Section */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recipients Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipientsTitle">Section Title</Label>
                      <Input
                        id="recipientsTitle"
                        value={recipientsTitle}
                        onChange={(e) => setRecipientsTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientsDescription">Description</Label>
                      <Input
                        id="recipientsDescription"
                        value={recipientsDescription}
                        onChange={(e) => setRecipientsDescription(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Section */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-gray-900">Subject Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subjectTitle">Section Title</Label>
                      <Input
                        id="subjectTitle"
                        value={subjectTitle}
                        onChange={(e) => setSubjectTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subjectDescription">Description</Label>
                      <Input
                        id="subjectDescription"
                        value={subjectDescription}
                        onChange={(e) => setSubjectDescription(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Letter Section */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-gray-900">Letter Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="letterTitle">Section Title</Label>
                      <Input
                        id="letterTitle"
                        value={letterTitle}
                        onChange={(e) => setLetterTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="letterDescription">Description</Label>
                      <Input
                        id="letterDescription"
                        value={letterDescription}
                        onChange={(e) => setLetterDescription(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Key Objections */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Key Objections</Label>
                      <Button
                        onClick={() => setIsAddingObjection(true)}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Objection
                      </Button>
                    </div>

                    {isAddingObjection && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter new objection"
                          value={newObjection}
                          onChange={(e) => setNewObjection(e.target.value)}
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && addObjection()}
                        />
                        <Button onClick={addObjection} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsAddingObjection(false);
                            setNewObjection('');
                          }} 
                          size="sm" 
                          variant="outline"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="space-y-2">
                      {keyObjections.map((objection, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm">{objection}</span>
                          <Button
                            onClick={() => removeObjection(index)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="body">Message Body</Label>
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter the template message content here..."
                    rows={15}
                    className="mt-1 font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isPublic">Make this template publicly accessible</Label>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-yellow-500" />
                  <span>Templates start as unverified and require admin approval</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveTemplate}
                  disabled={isSaving || !title.trim() || !body.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Template'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Template Created Successfully!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600">
              Your template has been saved and is ready to share. Anyone with this link can use your template:
            </p>

            <div className="bg-gray-50 p-3 rounded-lg break-all text-sm">
              {shareableUrl}
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleCopyLink} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
