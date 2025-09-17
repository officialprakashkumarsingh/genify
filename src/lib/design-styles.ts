export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

export const designStyles: DesignStyle[] = [
  {
    id: 'minimalistic',
    name: 'Minimalistic',
    description: 'Clean, simple design with lots of whitespace',
    systemPrompt: 'Create a minimalistic design with clean lines, plenty of whitespace, simple typography, and a neutral color palette. Focus on simplicity and functionality.'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold typography',
    systemPrompt: 'Create a modern design with bold typography, geometric shapes, contemporary color schemes, and sleek interfaces. Use modern CSS features and clean layouts.'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Business-oriented, corporate aesthetic',
    systemPrompt: 'Create a professional, corporate design suitable for business applications. Use conservative colors, structured layouts, and formal typography.'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic and expressive with vibrant colors',
    systemPrompt: 'Create a creative, artistic design with vibrant colors, unique layouts, creative typography, and expressive visual elements. Be bold and innovative.'
  },
  {
    id: 'dark',
    name: 'Dark Theme',
    description: 'Dark background with light text',
    systemPrompt: 'Create a dark theme design with dark backgrounds, light text, and appropriate contrast. Use dark grays, blacks, and accent colors that work well in dark mode.'
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Vintage-inspired design elements',
    systemPrompt: 'Create a retro/vintage design with nostalgic elements, classic typography, muted colors, and design patterns reminiscent of past decades.'
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    description: 'Sci-fi inspired with neon accents',
    systemPrompt: 'Create a futuristic design with sci-fi elements, neon colors, high-tech aesthetics, and modern geometric patterns. Think cyberpunk and space-age design.'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and refined appearance',
    systemPrompt: 'Create an elegant, sophisticated design with refined typography, luxurious color palettes, and graceful layouts. Focus on beauty and sophistication.'
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Fun and colorful with rounded elements',
    systemPrompt: 'Create a playful, fun design with bright colors, rounded corners, friendly typography, and whimsical elements. Make it joyful and engaging.'
  },
  {
    id: 'material',
    name: 'Material Design',
    description: 'Google Material Design principles',
    systemPrompt: 'Create a design following Google Material Design principles with elevation, shadows, bold colors, and consistent spacing. Use material design components and patterns.'
  }
];

export function getDesignStyleById(id: string): DesignStyle | undefined {
  return designStyles.find(style => style.id === id);
}