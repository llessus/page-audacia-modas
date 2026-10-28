'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Clock } from 'lucide-react';
import type { ReactNode } from 'react';

interface BioLinkButtonProps {
  href: string;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  disabled?: boolean;
  badgeText?: string;
  ariaLabel?: string;
}

export function BioLinkButton({
  href,
  title,
  subtitle,
  icon,
  variant = 'secondary',
  external = false,
  disabled = false,
  badgeText,
  ariaLabel,
}: BioLinkButtonProps) {
  const isPrimary = variant === 'primary';

  if (disabled) {
    return (
      <div
        aria-disabled="true"
        aria-label={`${title} (${badgeText ?? 'Em breve'})`}
        className="relative w-full min-h-[68px] px-4 sm:px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/15 text-white/45 flex items-center justify-between cursor-not-allowed select-none saturate-0"
      >
        <span className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 text-white/40 flex items-center justify-center shrink-0">
          {icon}
        </span>

        <span className="flex flex-col items-center text-center px-2 min-w-0 flex-1">
          {badgeText && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 mb-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/70">
              <Clock className="w-2.5 h-2.5" />
              {badgeText}
            </span>
          )}
          <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-white/50">
            {title}
          </span>
          {subtitle && (
            <span className="text-[11px] sm:text-xs text-white/40 mt-0.5">
              {subtitle}
            </span>
          )}
        </span>

        <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white/25">
          <ChevronRight className="w-5 h-5" />
        </span>
      </div>
    );
  }

  const baseClasses = isPrimary
    ? 'btn-shimmer group relative w-full min-h-[64px] px-4 sm:px-5 py-3.5 rounded-2xl bg-gold-gradient text-[#23141d] shadow-[0_6px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.55)] flex items-center justify-between transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
    : 'group relative w-full min-h-[62px] px-4 sm:px-5 py-3.5 rounded-2xl glassmorphism hover:glassmorphism-gold border border-audacia-gold/30 hover:border-audacia-gold/60 flex items-center justify-between transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-audacia-gold';

  const content = (
    <>
      <span
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
          isPrimary
            ? 'bg-[#23141d]/15 text-[#23141d]'
            : 'bg-audacia-gold/15 border border-audacia-gold/30 text-audacia-gold-light'
        }`}
      >
        {icon}
      </span>

      <span className="flex flex-col items-center text-center px-3 min-w-0 flex-1">
        <span
          className={`text-sm sm:text-base tracking-wide ${
            isPrimary
              ? 'font-extrabold uppercase tracking-wider text-[#23141d]'
              : 'font-semibold text-white group-hover:text-audacia-gold-light transition-colors'
          }`}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className={`text-xs mt-0.5 ${
              isPrimary ? 'font-semibold text-[#23141d]/85' : 'text-white/70'
            }`}
          >
            {subtitle}
          </span>
        )}
      </span>

      <span
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ${
          isPrimary ? 'text-[#23141d]' : 'text-white/60 group-hover:text-audacia-gold-light'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </span>
    </>
  );

  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.985 }}>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel ?? title}
          className={baseClasses}
        >
          {content}
        </a>
      ) : (
        <Link href={href} aria-label={ariaLabel ?? title} className={baseClasses}>
          {content}
        </Link>
      )}
    </motion.div>
  );
}
