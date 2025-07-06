
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, Copy, Eye, Share2, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const generateSlug = (titleText: string) => {
    return titleText
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
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
        originalApp: 'civiceducationke'
      };

      const { data, error } = await supabase
        .from('templates')
        .insert({
          title,
          body,
          slug,
          metadata,
          is_public: isPublic,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
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

      const url = `${window.location.origin}/template/${data.slug || data.id}`;
      setShareableUrl(url);
      setShowShareDialog(true);

      toast({
        title: "Template Saved!",
        description: "Your shareable template has been created successfully.",
      });

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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
