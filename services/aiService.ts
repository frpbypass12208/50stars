// Powered by OnSpace.AI
import { getSupabaseClient } from '@/template';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { MOCK_PROMPTS } from '@/constants/config';

export interface GenerationResult {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  url: string;
  thumbnail: string;
  createdAt: Date;
  enhanced: boolean;
  predictionId?: string;
}

export interface EnhanceResult {
  originalUrl: string;
  enhancedUrl: string;
  mode: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

async function invokeFunction<T>(name: string, body: object): Promise<T> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let msg = error.message;
    if (error instanceof FunctionsHttpError) {
      try {
        const text = await error.context?.text();
        msg = text || msg;
      } catch {
        // ignore
      }
    }
    throw new Error(msg);
  }
  return data as T;
}

export const aiService = {
  async generateImage(prompt: string): Promise<GenerationResult> {
    const data = await invokeFunction<{ url: string; thumbnail: string }>('generate-image', {
      prompt,
      aspectRatio: '1:1',
    });

    return {
      id: generateId(),
      type: 'image',
      prompt,
      url: data.url,
      thumbnail: data.thumbnail,
      createdAt: new Date(),
      enhanced: false,
    };
  },

  async createVideoTask(prompt: string): Promise<string> {
    const data = await invokeFunction<{ id: string; status: string }>('generate-video', {
      action: 'create',
      prompt,
    });
    return data.id;
  },

  async checkVideoStatus(predictionId: string): Promise<{
    status: string;
    progress?: number;
    storage_url?: string;
    error?: string;
  }> {
    return invokeFunction('generate-video', {
      action: 'check',
      predictionId,
    });
  },

  async enhanceImage(imageUrl: string, mode: string): Promise<EnhanceResult> {
    // Enhancement uses image generation to apply style improvement
    const enhancePrompt = `Ultra high quality enhancement of: ${imageUrl}. Apply ${mode} processing: increase resolution, reduce noise, enhance details, improve sharpness and colors. Professional quality result.`;
    const data = await invokeFunction<{ url: string; thumbnail: string }>('generate-image', {
      prompt: enhancePrompt,
      aspectRatio: '1:1',
    });

    return {
      originalUrl: imageUrl,
      enhancedUrl: data.url,
      mode,
    };
  },

  getSuggestedPrompts(): string[] {
    return [...MOCK_PROMPTS].sort(() => Math.random() - 0.5).slice(0, 4);
  },
};
