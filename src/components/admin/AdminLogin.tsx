'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  loginAction: (formData: FormData) => Promise<void>;
  hasError: boolean;
}

export function AdminLogin({ loginAction, hasError }: AdminLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a2433] via-audacia-rose-dark to-audacia-rose flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-audacia-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-audacia-rose-light/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="glassmorphism-gold rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-audacia-gold/20 rounded-full blur-[60px] pointer-events-none" />

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audacia-gold/20 border border-audacia-gold/40 mb-4">
              <Lock className="w-7 h-7 text-audacia-gold" />
            </div>
            <h1 className="text-3xl font-serif text-white mb-2">
              Área <span className="text-gold-gradient">Administrativa</span>
            </h1>
            <p className="text-white/60 text-sm font-light tracking-wide">
              Audácia Modas · Painel de Gestão
            </p>
          </div>

          {/* Error */}
          {hasError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-medium text-center">
              Senha incorreta. Tente novamente.
            </div>
          )}

          {/* Form — action aponta direto pro Server Action */}
          <form
            action={async (formData) => {
              setIsLoading(true);
              await loginAction(formData);
            }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Digite a senha administrativa"
                  className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-audacia-gold/20 text-white placeholder:text-white/30 focus:outline-none focus:border-audacia-gold/60 focus:ring-1 focus:ring-audacia-gold/30 transition-all duration-300 pr-12 font-sans text-sm"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-audacia-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-audacia-rose-dark font-bold text-sm tracking-wider transition-all duration-300 shadow-gold-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-shimmer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Entrar no Painel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-white/40 text-xs hover:text-audacia-gold transition-colors tracking-wide">
              ← Voltar para o site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
