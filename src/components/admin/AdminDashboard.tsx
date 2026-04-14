'use client';

import { AdminForm } from '@/components/admin/AdminForm';
import { ProductCard } from '@/components/admin/ProductCard';
import { Package, LogOut, LayoutDashboard, ShoppingBag, AlertTriangle } from 'lucide-react';
import type { Produto } from '@/types/produto';

interface AdminDashboardProps {
  produtos: Produto[];
  logoutAction: () => Promise<void>;
}

export function AdminDashboard({ produtos, logoutAction }: AdminDashboardProps) {
  const totalProdutos = produtos.length;
  const disponiveis = produtos.filter(p => p.status === 'disponivel').length;
  const esgotados = totalProdutos - disponiveis;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a2433] via-audacia-rose-dark to-audacia-rose relative">
      {/* Ambient background lights */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-audacia-gold/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-audacia-rose-light/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-audacia-rose-dark/60 border-b border-audacia-gold/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-audacia-gold/20 border border-audacia-gold/30">
              <LayoutDashboard className="w-5 h-5 text-audacia-gold" />
            </div>
            <div>
              <h1 className="font-serif text-lg text-white leading-tight">Painel Admin</h1>
              <p className="text-white/40 text-xs tracking-wide">Audácia Modas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden md:flex items-center gap-1.5 text-white/50 text-xs hover:text-audacia-gold transition-colors tracking-wide"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Ver Loja
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-white/60 text-xs tracking-wide hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="glassmorphism rounded-2xl p-4 md:p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Package className="w-4 h-4 text-audacia-gold/60" />
              <span className="text-white/50 text-xs tracking-wide">Total</span>
            </div>
            <p className="text-2xl md:text-3xl font-serif text-white">{totalProdutos}</p>
          </div>
          <div className="glassmorphism rounded-2xl p-4 md:p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white/50 text-xs tracking-wide">Disponíveis</span>
            </div>
            <p className="text-2xl md:text-3xl font-serif text-emerald-400">{disponiveis}</p>
          </div>
          <div className="glassmorphism rounded-2xl p-4 md:p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-white/50 text-xs tracking-wide">Esgotados</span>
            </div>
            <p className="text-2xl md:text-3xl font-serif text-red-400">{esgotados}</p>
          </div>
        </div>

        {/* Two-column layout: Form + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          {/* Left: Upload Form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AdminForm />
          </div>

          {/* Right: Product List */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-serif text-white">Produtos Cadastrados</h2>
              <span className="px-2.5 py-1 rounded-full bg-audacia-gold/10 border border-audacia-gold/20 text-audacia-gold text-xs font-medium">
                {totalProdutos}
              </span>
            </div>

            {produtos.length === 0 ? (
              <div className="glassmorphism rounded-2xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audacia-gold/10 border border-audacia-gold/20 mb-4">
                  <AlertTriangle className="w-7 h-7 text-audacia-gold/60" />
                </div>
                <h3 className="font-serif text-white text-lg mb-2">Nenhum produto cadastrado</h3>
                <p className="text-white/50 text-sm">
                  Use o formulário ao lado para cadastrar seu primeiro produto.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {produtos.map((produto) => (
                  <ProductCard key={produto.id} produto={produto} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
