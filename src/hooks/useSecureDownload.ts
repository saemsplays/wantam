
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSecureDownload() {
  const [loading, setLoading] = useState(false);

  const getSecureDownloadUrl = async (bucketName: string, filePath: string, expiresIn: number = 3600) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw error;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error creating secure download URL:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getSecureDownloadUrl, loading };
}
