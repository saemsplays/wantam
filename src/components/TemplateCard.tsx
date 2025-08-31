
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Calendar } from "lucide-react";
import { VerificationBadge } from "./VerificationBadge";

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    description?: string;
    template_name?: string;
    subject?: string;
    use_count?: number;
    uses_count?: number;
    views_count?: number;
    created_at: string;
    is_verified?: boolean;
    user_name?: string;
  };
  onView: (id: string) => void;
  onUse: (id: string) => void;
}

export function TemplateCard({ template, onView, onUse }: TemplateCardProps) {
  const displayTitle = template.title || template.template_name || template.subject || "Untitled";
  const displayDescription = template.description || "No description available";
  const useCount = template.use_count || template.uses_count || 0;
  const viewCount = template.views_count || 0;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{displayTitle}</CardTitle>
          <VerificationBadge isVerified={template.is_verified || false} />
        </div>
        <CardDescription className="line-clamp-3">
          {displayDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {useCount}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(template.created_at).toLocaleDateString()}
          </span>
        </div>
        
        {template.user_name && (
          <div className="mb-3">
            <Badge variant="outline" className="text-xs">
              By {template.user_name}
            </Badge>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(template.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            onClick={() => onUse(template.id)}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            Use
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
