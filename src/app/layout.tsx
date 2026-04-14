import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Audácia Modas | Vista sua Essência',
  description:
    'Audácia Modas: moda feminina premium com atendimento personalizado. Descubra a coleção exclusiva em Santa Maria Norte - DF. Fale conosco pelo WhatsApp!',
  keywords:
    'moda feminina, boutique, Santa Maria Norte, Brasília, DF, roupas femininas, moda premium, Audácia Modas',
  openGraph: {
    type: 'website',
    title: 'Audácia Modas | Vista sua Essência',
    description:
      'Moda feminina premium com atendimento personalizado. Sua nova peça favorita está aqui! 👗✨',
    locale: 'pt_BR',
    images: ['/images/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audácia Modas | Vista sua Essência',
    description:
      'Moda feminina premium com atendimento personalizado. Sua nova peça favorita está aqui! 👗✨',
    images: ['/images/logo.png'],
  },
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-audacia-rose font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
