// Powered by OnSpace.AI
import { useState, useCallback } from 'react';
import { aiService, EnhanceResult } from '@/services/aiService';
import { MOCK_IMAGE_URLS } from '@/constants/config';

export type EnhanceStatus = 'idle' | 'enhancing' | 'success' | 'error';

export function useEnhance() {
  const [status, setStatus] = useState<EnhanceStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<EnhanceResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState('hq');
  const [error, setError] = useState<string | null>(null);

  const pickMockImage = useCallback(() => {
    const url = MOCK_IMAGE_URLS[Math.floor(Math.random() * MOCK_IMAGE_URLS.length)];
    setSelectedImage(url);
    setResult(null);
  }, []);

  const enhance = useCallback(async () => {
    if (!selectedImage) return;
    setStatus('enhancing');
    setProgress(0);
    setError(null);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 8, 90));
    }, 250);

    try {
      const res = await aiService.enhanceImage(selectedImage, selectedMode);
      clearInterval(interval);
      setProgress(100);
      setResult(res);
      setStatus('success');
    } catch {
      clearInterval(interval);
      setError('Enhancement failed. Please try again.');
      setStatus('error');
    }
  }, [selectedImage, selectedMode]);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setSelectedImage(null);
    setError(null);
  }, []);

  return {
    status, progress, result, selectedImage, selectedMode,
    setSelectedMode, pickMockImage, enhance, reset, error
  };
}
