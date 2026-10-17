import type { MetadataRoute } from 'next';
import { translations } from '@/lib/i18n/translations';

export default function manifest(): MetadataRoute.Manifest {
  const locale = translations.en;

  return {
    name: locale.manifest_name,
    short_name: 'FarmSync',
    description: locale.manifest_description,
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#173426',
    theme_color: '#173426',
    lang: 'en-IN',
    dir: 'ltr',
    categories: ['agriculture', 'business', 'productivity', 'utilities'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
