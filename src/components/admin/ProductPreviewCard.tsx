'use client';

import { Flame, ImageIcon, Star } from 'lucide-react';
import { formatBRL } from '@/lib/format';
import { CORES_DISPONIVEIS } from '@/types/produto';

export interface PreviewData {
  nome: string;
  preco: number;
  categoria: string;
  imagem: string | null;
  destaque: boolean;
  tamanhos: string[];
  cores: string[];
  /** -1 = ilimitado, 0 = esgotado, 1-2 = últimas peças */
  quantidade: number;
}

/** Réplica leve do card do catálogo público, atualizada em tempo real pelo formulário. */
export function ProductPreviewCard({ data }: { data: PreviewData }) {
  const esgotado = data.quantidade === 0;
  const ultimas = !esgotado && data.quantidade > 0 && data.quantidade <= 2;

  return (
    <div className="rounded-[1.5rem] glassmorphism p-2.5" aria-label="Pré-visualização da peça">
      <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-audacia-gold/70">
        Pré-visualização
      </p>
      <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 ${esgotado ? 'opacity-60 saturate-[0.4]' : ''}`}>
        {data.imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.imagem} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/20">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Sem foto</span>
          </div>
        )}
        {ultimas ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-2.5 py-1 text-[10px] font-bold text-white">
            <Flame className="h-3 w-3" /> ÚLTIMAS PEÇAS
          </span>
        ) : (
          data.destaque &&
          !esgotado && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-audacia-gold/90 px-2.5 py-1 text-[10px] font-bold text-audacia-rose-dark">
              <Star className="h-3 w-3 fill-current" /> DESTAQUE
            </span>
          )
        )}
        {esgotado && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-red-500/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white">
              Esgotado
            </span>
          </span>
        )}
      </div>
      <div className="px-2 pb-1 pt-3 text-center">
        <p className="mb-1 truncate font-serif text-base text-white">{data.nome.trim() || 'Nome da peça'}</p>
        <p className="mb-2 text-[10px] uppercase tracking-widest text-white/40">{data.categoria}</p>
        {(data.tamanhos.length > 0 || data.cores.length > 0) && (
          <div className="mb-2 flex flex-wrap items-center justify-center gap-1">
            {data.tamanhos.map((t) => (
              <span key={t} className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-bold text-white/40">
                {t}
              </span>
            ))}
            {data.cores.map((c) => (
              <span
                key={c}
                title={c}
                className="h-3.5 w-3.5 rounded-full border border-white/20"
                style={{ backgroundColor: CORES_DISPONIVEIS.find((cd) => cd.nome === c)?.hex ?? '#888' }}
              />
            ))}
          </div>
        )}
        <p className="font-bold text-audacia-gold">{formatBRL(data.preco)}</p>
      </div>
    </div>
  );
}

