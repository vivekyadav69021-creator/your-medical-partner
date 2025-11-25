
export type Meditation = {
  id: string;
  title: string;
  duration_min: number;
  audio_url: string;
  description: string;
  tags: string[];
  icon: string;
};

export type LearnCollection = {
    id: string;
    title: string;
    desc: string;
}

export const guidedMeditations: Meditation[] = [
  { 
    id: 'breath_5', 
    title: 'Breath Awareness (5 min)', 
    duration_min: 5, 
    icon: 'wind', 
    audio_url: 'https://storage.googleapis.com/studiopaas-test-assets/meditation-guided-5.mp3',
    description: "Simple breathing attention practice — focus on inhale & exhale to calm the mind.",
    tags:["breath","beginner"]
  },
  { 
    id: 'body_10', 
    title: 'Body Scan (10 min)', 
    duration_min: 10, 
    icon: 'scan',
    audio_url: 'https://storage.googleapis.com/studiopaas-test-assets/meditation-guided-10.mp3',
    description: "Progressive attention from toes to head — great for sleep and stress reduction.",
    tags:["body-scan","intermediate"]
  },
  { 
    id: 'mantra_8', 
    title: 'Mantra Meditation (8 min)', 
    duration_min: 8, 
    icon: 'repeat',
    audio_url: 'https://storage.googleapis.com/studiopaas-test-assets/meditation-guided-8.mp3',
    description: "Use a short mantra (ॐ) or a protective chant. Repeat gently with breath.",
    tags:["mantra","ancient"]
  },
];

export const learnCollections: LearnCollection[] = [
  { id: 'patanjali_overview', title: 'Patanjali Yoga-Sutras', desc: '4 chapters: Samadhi, Sadhana, Vibhuti, Kaivalya' },
  { id: 'gita_overview', title: 'Bhagavad Gita', desc: '18 chapters: Core teachings of karma, bhakti, jnana' },
];
