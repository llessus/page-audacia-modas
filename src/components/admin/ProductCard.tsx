'use client';

import { useState } from 'react';
import { deleteProduct, toggleStatus } from '@/app/actions';
import { Trash2, ToggleLeft, ToggleRight, Package, Pencil } from 'lucide-react';
import Image from 'next/image';
import { EditProductModal } from '@/components/admin/EditProductModal';
import type { Produto } from '@/types/produto';

interface ProductCardProps {
  produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const isDisponivel = produto.status === 'disponivel';

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteProduct(produto.id);
    } catch {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  async function handleToggle() {
    setIsToggling(true);
    try {
      await toggleStatus(produto.id);
    } catch {
      // State will be refreshed by revalidation
    } finally {
      setIsToggling(false);
    }
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(produto.preco));

  return (
    <>
      <div className={`glassmorphism rounded-2xl overflow-hidden transition-all duration-500 group hover:shadow-gold-glow ${
        !isDisponivel ? 'opacity-60 grayscale-[30%]' : ''
      }`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={produto.imagem_url}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Status Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider backdrop-blur-md border ${
            isDisponivel
              ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
              : 'bg-red-500/20 border-red-400/40 text-red-300'
          }`}>
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isDisponivel ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {isDisponivel ? 'Disponível' : 'Esgotado'}
            </span>
          </div>

          {/* Gradient overlay bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-serif text-white text-base leading-tight mb-1">{produto.nome}</h3>
              <p className="text-audacia-gold font-semibold text-lg">{formattedPrice}</p>
            </div>
            <div className="shrink-0 p-1.5 rounded-lg bg-audacia-gold/10">
              <Package className="w-4 h-4 text-audacia-gold/60" />
            </div>
          </div>

          {/* Categoria badge */}
          {produto.categoria && (
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-audacia-gold/10 border border-audacia-gold/20 text-audacia-gold/70 mb-2">
              {produto.categoria}
            </span>
          )}

          {/* Descrição truncada */}
          {produto.descricao && (
            <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-2">
              {produto.descricao}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            {/* Toggle Status */}
            <button
              onClick={handleToggle}
              disabled={isToggling || isDeleting}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border disabled:opacity-40 disabled:cursor-not-allowed ${
                isDisponivel
                  ? 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                  : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              {isToggling ? (
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : isDisponivel ? (
                <>
                  <ToggleRight className="w-3.5 h-3.5" />
                  Esgotar
                </>
              ) : (
                <>
                  <ToggleLeft className="w-3.5 h-3.5" />
                  Disponibilizar
                </>
              )}
            </button>

            {/* Edit */}
            <button
              onClick={() => setShowEdit(true)}
              disabled={isDeleting}
              className="px-3 py-2.5 rounded-xl border border-audacia-gold/30 text-audacia-gold hover:bg-audacia-gold/10 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Editar produto"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                className="px-3 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Excluir produto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-all duration-300 disabled:opacity-40 flex items-center gap-1"
                >
                  {isDeleting ? (
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    'Sim'
                  )}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-2.5 rounded-xl border border-white/10 text-white/60 text-xs hover:bg-white/5 transition-all duration-300"
                >
                  Não
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProductModal
        produto={showEdit ? produto : null}
        onClose={() => setShowEdit(false)}
      />
    </>
  );
}
