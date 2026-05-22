import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Your Medical Partner',
    short_name: 'Medical Partner',
    description: 'Your Digital Health Companion with AI Insights',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#F0F7FF',
    theme_color: '#2488E8',
    orientation: 'portrait',
    icons: [
      {
        src: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=192&h=192&auto=format&fit=crop',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=512&h=512&auto=format&fit=crop',
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
        icons: [{ src: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=96&h=96&auto=format&fit=crop', sizes: '96x96' }]
      },
      {
        name: 'Scanner',
        url: '/disease-scanner',
        icons: [{ src: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=96&h=96&auto=format&fit=crop', sizes: '96x96' }]
      }
    ]
  };
}
