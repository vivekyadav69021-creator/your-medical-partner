import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Your Medical Partner',
    short_name: 'Medical Partner',
    description: 'Your Reliable Digital Health Companion with AI Insights',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#2488E8',
    orientation: 'portrait',
    icons: [
      {
        src: 'https://storage.googleapis.com/studiopaas-test-assets/project-assets/medical-app-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://storage.googleapis.com/studiopaas-test-assets/project-assets/medical-app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
    categories: ['medical', 'health'],
    shortcuts: [
      {
        name: 'AI Assistant',
        url: '/health-assistant',
        icons: [{ src: 'https://storage.googleapis.com/studiopaas-test-assets/project-assets/medical-app-icon-192.png', sizes: '192x192' }]
      },
      {
        name: 'Scanner',
        url: '/disease-scanner',
        icons: [{ src: 'https://storage.googleapis.com/studiopaas-test-assets/project-assets/medical-app-icon-192.png', sizes: '192x192' }]
      }
    ]
  };
}
