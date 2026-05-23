'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

interface Depoimento {
  nome: string;
  texto: string;
  estrelas: number;
}

const depoimentos: Depoimento[] = [
  {
    nome: 'Samara Suelane',
    texto: 'A melhor loja de roupas de Brasilia, atendimento maravilhoso e roupas lindissimas de qualidade. Ja compro a mais de 3 anos com ela, perfeita!',
    estrelas: 5,
  },
  {
    nome: 'Bruna Lima',
    texto: 'Eu sou completamente apaixonada pela loja. Vendedora atenciosa e com energia boa, alem das roupas terem excelente qualidade e serem pecas diferentes do que vemos por ai!',
    estrelas: 5,
  },
  {
    nome: 'Kezia Fernandes',
    texto: 'Sou cliente ha mais de 10 anos e indico de olhos fechados! Sempre muito dedicada, atenciosa e prestativa. Atendimentos exclusivos e pecas maravilhosas.',
    estrelas: 5,
  },
  {
    nome: 'Fernanda Dos Santos',
    texto: 'Atendimento simplesmente maravilhoso! Sempre sou muito bem recebida, com muita atencao, educacao e carinho. As roupas sao de excelente qualidade, com modelos lindos e super atuais.',
    estrelas: 5,
  },
  {
    nome: 'Veronica Maria',
    texto: 'Roupas lindas, corte bom, veste a gente como princesa. Nunca fui tao bem tratada e tao bem vestida. Tanto CARINHO quanto na Audacia Modas, podem ir sem medo!',
    estrelas: 5,
  },
  {
    nome: 'Catarina Pereira',
    texto: 'A loja e simplesmente linda e cheirosa, roupas unicas e um atendimento impecavel!',
    estrelas: 5,
  },
  {
    nome: 'Luciana Freitas',
    texto: 'Michelle uma pessoa muito amorosa que sabe ouvir e agradar os seus clientes... So pecas lindas e de otima qualidade.',
    estrelas: 5,
  },
  {
    nome: 'Edna Silva',
    texto: 'Uma excelente profissional, Michele e uma pessoa muito atenciosa. Amo comprar com ela, super indico! Suas mercadorias sao de otima qualidade e preco bom. Quem compra sempre volta!',
    estrelas: 5,
  },
  {
    nome: 'Debora Luiza Tavares',
    texto: 'Atendimento SUPER atencioso, simplesmente a melhor de Santa Maria e regiao!',
    estrelas: 5,
  },
  {
    nome: 'Ana Maria',
    texto: 'Excelente atendimento. Roupas de otima qualidade. Super recomendo!',
    estrelas: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
    'from-fuchsia-500 to-pink-600',
    'from-lime-500 to-green-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function TestimonialsSection() {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-audacia-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white/60 text-sm tracking-wide">Google</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            O que nossas <span className="text-gold-gradient">clientes</span> dizem
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Depoimentos reais de quem ja viveu a experiencia Audacia Modas
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {depoimentos.map((dep, index) => (
            <motion.div
              key={dep.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-audacia-gold/25 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-audacia-gold/10 group-hover:text-audacia-gold/20 transition-colors" />

              {/* Stars */}
              <StarRating count={dep.estrelas} />

              {/* Text */}
              <p className="text-white/75 text-sm leading-relaxed mt-3 mb-4 font-light">
                &ldquo;{dep.texto}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(dep.nome)} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                  {getInitials(dep.nome)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{dep.nome}</p>
                  <p className="text-white/30 text-[10px] tracking-wider uppercase">Cliente verificada</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href={siteConfig.linkEndereco}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/50 hover:text-audacia-gold hover:border-audacia-gold/30 transition-all duration-300 text-sm tracking-wide"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Ver todas as avaliacoes no Google
          </a>
        </motion.div>
      </div>
    </section>
  );
}
