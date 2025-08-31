
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  className?: string;
}

export function VerificationBadge({ isVerified, className }: VerificationBadgeProps) {
  if (!isVerified) return null;

  return (
    <Badge variant="secondary" className={`gap-1 ${className}`}>
      <CheckCircle className="h-3 w-3" />
      Verified
    </Badge>
  );
}
