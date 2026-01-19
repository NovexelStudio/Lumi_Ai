export const AI_MODELS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Fast and powerful',
    icon: '✨',
    color: 'from-purple-500 to-pink-500',
    speed: 850,
    beta: false,
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Lightning fast',
    icon: '⚡',
    color: 'from-orange-500 to-red-500',
    speed: 250,
    beta: false,
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Creative & thoughtful',
    icon: '🧠',
    color: 'from-blue-500 to-cyan-500',
    speed: 750,
    beta: false,
  },
];

export function getModelColor(modelId: string) {
  const model = AI_MODELS.find(m => m.id === modelId);
  return model?.color || 'from-purple-500 to-pink-500';
}

export function getModelIcon(modelId: string) {
  const model = AI_MODELS.find(m => m.id === modelId);
  return model?.icon || '✨';
}

export function getModelName(modelId: string) {
  const model = AI_MODELS.find(m => m.id === modelId);
  return model?.name || 'AI';
}
