import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Your Medical Partner',
    short_name: 'MediMate',
    description: 'Your Digital Health Companion with AI Insights',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#FDFBFF',
    theme_color: '#2488E8',
    orientation: 'portrait',
    icons: [
      {
        src: 'https://picsum.photos/seed/medimate-192/192/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://picsum.photos/seed/medimate-512/512/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
    // Essential for Android App Banner to trigger
    categories: ['medical', 'health'],
    shortcuts: [
      {
        name: 'AI Assistant',
        url: '/health-assistant',
        icons: [{ src: 'https://picsum.photos/seed/shortcut-ai/96/96', sizes: '96x96' }]
      },
      {
        name: 'Scanner',
        url: '/disease-scanner',
        icons: [{ src: 'https://picsum.photos/seed/shortcut-scan/96/96', sizes: '96x96' }]
      }
    ]
  };
}
