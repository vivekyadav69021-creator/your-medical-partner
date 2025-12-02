
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
    description: "Focus on inhale & exhale to calm the mind.",
    tags:["breath","beginner"]
  },
  { 
    id: 'body_10', 
    title: 'Body Scan (10 min)', 
    duration_min: 10, 
    icon: 'scan',
    audio_url: 'https://storage.googleapis.com/studiopaas-test-assets/meditation-guided-10.mp3',
    description: "Progressive attention from toes to head for sleep.",
    tags:["body-scan","intermediate"]
  },
  { 
    id: 'mantra_8', 
    title: 'Mantra Meditation (8 min)', 
    duration_min: 8, 
    icon: 'repeat',
    audio_url: 'https://storage.googleapis.com/studiopaas-test-assets/meditation-guided-8.mp3',
    description: "Use a short mantra (e.g., 'Om') to focus the mind.",
    tags:["mantra","ancient"]
  },
  { 
    id: 'kindness_12', 
    title: 'Loving-Kindness (12 min)', 
    duration_min: 12, 
    icon: 'heart',
    audio_url: 'https://storage.googleapis.com/studiopaas-test-assets/meditation-guided-12.mp3',
    description: "Cultivate compassion for yourself and others.",
    tags:["compassion","intermediate"]
  },
    { 
    id: 'walking_15', 
    title: 'Walking Meditation (15 min)', 
    duration_min: 15, 
    icon: 'footprints',
    audio_url: 'https://storage.googleapis.com/studiopaas-test-assets/meditation-guided-15.mp3',
    description: "Mindful movement practice for awareness.",
    tags:["walking","mindfulness"]
  },
  { 
    id: 'visualization_7', 
    title: 'Visualization (7 min)', 
    duration_min: 7, 
    icon: 'image',
    audio_url: 'https://storage.googleapis.com/studiopaas-test-assets/meditation-guided-7.mp3',
    description: "Imagine a peaceful scene to foster deep relaxation.",
    tags:["visualization","beginner"]
  }
];

export const learnCollections: LearnCollection[] = [
  { id: 'patanjali_overview', title: 'Patanjali Yoga-Sutras', desc: '4 chapters: Samadhi, Sadhana, Vibhuti, Kaivalya' },
];


