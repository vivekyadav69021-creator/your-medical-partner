export type VideoTutorial = {
  id: string;
  title: string;
  description: string;
  thumbnailId: string;
  // videoUrl will be added later
};

export type VideoCategory = {
  id: string;
  title: string;
  description: string;
  videos: VideoTutorial[];
};

export const videoTutorialsData: VideoCategory[] = [
  {
    id: 'yoga-basics',
    title: 'Yoga Basics',
    description: 'Learn the fundamental poses and breathing techniques of yoga.',
    videos: [
      {
        id: 'vid01',
        title: 'Introduction to Yoga',
        description: 'Start your journey with the basic philosophy and benefits of yoga.',
        thumbnailId: 'meditation-hero',
      },
      {
        id: 'vid02',
        title: 'Basic Breathing (Pranayama)',
        description: 'Learn how to control your breath to calm your mind and body.',
        thumbnailId: 'meditation-hero',
      },
      {
        id: 'vid03',
        title: 'Sun Salutation (Surya Namaskar)',
        description: 'A step-by-step guide to the classic yoga warm-up sequence.',
        thumbnailId: 'meditation-hero',
      },
    ],
  },
  {
    id: 'meditation-techniques',
    title: 'Meditation Techniques',
    description: 'Explore different methods to quiet the mind and cultivate inner peace.',
    videos: [
      {
        id: 'vid04',
        title: 'Mindfulness Meditation',
        description: 'A guided session on being present in the moment.',
        thumbnailId: 'meditation-hero',
      },
      {
        id: 'vid05',
        title: 'Body Scan Meditation',
        description: 'Connect with your body and release tension with this guided scan.',
        thumbnailId: 'meditation-hero',
      },
    ],
  },
  {
    id: 'healthy-eating',
    title: 'Healthy Eating',
    description: 'Tutorials on preparing nutritious and delicious meals.',
    videos: [
      {
        id: 'vid06',
        title: 'Quick & Healthy Breakfast Ideas',
        description: 'Start your day right with these simple and nutritious breakfast recipes.',
        thumbnailId: 'meditation-hero',
      },
    ],
  },
];
