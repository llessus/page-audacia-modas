import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.nomeLoja,
    short_name: 'Audácia',
    description: 'Catálogo e Painel Administrativo Audácia Modas',
    start_url: '/',
    display: 'standalone',
    background_color: '#3a2433', // audacia-rose-dark
    theme_color: '#D4AF37', // audacia-gold
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
  };
}
