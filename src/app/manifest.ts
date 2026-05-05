
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Your Medical Partner',
    short_name: 'MediMate',
    description: 'Your Digital Health Companion with AI Insights',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFBFF',
    theme_color: '#2488E8',
    icons: [
      {
        src: 'https://picsum.photos/seed/app-icon/192/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://picsum.photos/seed/app-icon-512/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
