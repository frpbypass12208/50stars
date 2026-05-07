// Powered by OnSpace.AI
export const APP_NAME = 'AuraAI';

export const GENERATION_MODES = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;

export type GenerationMode = typeof GENERATION_MODES[keyof typeof GENERATION_MODES];

export const ENHANCE_MODES = [
  { id: 'hq', label: '4K Upscale', description: 'Upscale to ultra HD resolution' },
  { id: 'denoise', label: 'Denoise', description: 'Remove noise and artifacts' },
  { id: 'sharpen', label: 'Sharpen', description: 'Enhance edges and details' },
  { id: 'color', label: 'Color Grade', description: 'Cinematic color enhancement' },
] as const;

export const MOCK_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80',
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&q=80',
];

export const MOCK_PROMPTS = [
  'A cyberpunk city at night with neon lights',
  'Ethereal forest with glowing mushrooms',
  'Abstract geometric patterns in space',
  'Portrait of a futuristic AI being',
  'Ocean sunset with purple skies',
  'Crystal cave with bioluminescent light',
];

export const VOICE_PROMPTS = [
  'Generate an image of a sunset over mountains',
  'Create a video of waves crashing on the shore',
  'Make a photo of a futuristic city skyline',
  'Generate abstract art with blue and purple colors',
];
