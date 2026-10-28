'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { siteConfig as defaultConfig, type SiteConfig } from '@/config/siteConfig';

const SiteConfigContext = createContext<SiteConfig>(defaultConfig);

export function SiteConfigProvider({ config, children }: { config: SiteConfig; children: ReactNode }) {
  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

/** Configuração da loja vinda do banco (com fallback para siteConfig.ts). */
export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}

