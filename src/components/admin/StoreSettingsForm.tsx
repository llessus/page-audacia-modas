'use client';

import { useState } from 'react';
import { Settings, Save, Loader2, ChevronDown } from 'lucide-react';
import { updateSiteConfig } from '@/app/actions';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import type { SiteConfig } from '@/config/siteConfig';

const inputClass =
  'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-audacia-gold/20 text-white placeholder:text-white/30 focus:outline-none focus:border-audacia-gold/60 focus:ring-1 focus:ring-audacia-gold/30 transition-all text-sm';
const labelClass = 'block text-xs font-medium text-audacia-gold/80 mb-1.5 tracking-wide';

export function StoreSettingsForm({ initial }: { initial: SiteConfig }) {
  const [open, setOpen] = useState(false);
  const [cfg, setCfg] = useState<SiteConfig>(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const set = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) =>
    setCfg((prev) => ({ ...prev, [key]: value }));
  const setHero = (key: keyof SiteConfig['hero'], value: string) =>
    setCfg((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await updateSiteConfig(cfg);
      setFeedback({ type: res.success ? 'success' : 'error', message: res.message });
    } catch {
      setFeedback({ type: 'error', message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="glassmorphism-gold rounded-[2rem] p-6 relative overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-audacia-gold/20 border border-audacia-gold/30">
            <Settings className="w-5 h-5 text-audacia-gold" />
          </span>
          <span className="text-xl font-serif text-white">Configurações da Loja</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-audacia-gold/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-sm ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="cfg-nome">Nome da loja</label>
            <input id="cfg-nome" className={inputClass} value={cfg.nomeLoja} onChange={(e) => set('nomeLoja', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="cfg-wpp">WhatsApp (DDI + DDD + número)</label>
            <input
              id="cfg-wpp"
              inputMode="numeric"
              className={inputClass}
              value={cfg.whatsappDDIeDDD}
              onChange={(e) => set('whatsappDDIeDDD', e.target.value)}
              placeholder="5561998851403"
            />
            <a
              href={buildWhatsAppLink(cfg, 'Teste de link — Audácia Modas')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-[11px] text-audacia-gold/70 hover:text-audacia-gold"
            >
              Testar link do WhatsApp ↗
            </a>
          </div>
          <div>
            <label className={labelClass} htmlFor="cfg-ig">@ do Instagram</label>
            <input id="cfg-ig" className={inputClass} value={cfg.arrobaInstagram} onChange={(e) => set('arrobaInstagram', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="cfg-iglink">Link do Instagram</label>
            <input id="cfg-iglink" type="url" className={inputClass} value={cfg.linkInstagram} onChange={(e) => set('linkInstagram', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="cfg-end">Endereço</label>
            <input id="cfg-end" className={inputClass} value={cfg.enderecoCompleto} onChange={(e) => set('enderecoCompleto', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="cfg-endlink">Link do mapa</label>
            <input id="cfg-endlink" type="url" className={inputClass} value={cfg.linkEndereco} onChange={(e) => set('linkEndereco', e.target.value)} />
          </div>

          <p className="pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-audacia-gold/60">Textos da capa</p>
          {(['tituloParte1', 'tituloParte2', 'tituloParte3'] as const).map((k, i) => (
            <div key={k}>
              <label className={labelClass} htmlFor={`cfg-${k}`}>Título — parte {i + 1}</label>
              <input id={`cfg-${k}`} className={inputClass} value={cfg.hero[k]} onChange={(e) => setHero(k, e.target.value)} />
            </div>
          ))}
          <div>
            <label className={labelClass} htmlFor="cfg-sub">Subtítulo</label>
            <textarea id="cfg-sub" rows={3} className={`${inputClass} resize-none`} value={cfg.hero.subtitulo} onChange={(e) => setHero('subtitulo', e.target.value)} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gold-gradient text-audacia-rose-dark font-bold text-sm tracking-wider shadow-gold-glow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar configurações
          </button>
        </form>
      )}
    </div>
  );
}

