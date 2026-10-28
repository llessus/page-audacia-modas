export interface HorarioDia {
  /** 0 = Domingo, 1 = Segunda, ..., 6 = Sábado */
  abre: number; // hora cheia ou decimal (ex: 9 = 09:00)
  fecha: number; // ex: 19 = 19:00
}

/**
 * Configurações rápidas da página /bio.
 * Edite aqui o banner de campanha, horário de funcionamento e depoimentos curtos.
 */
export const BIO_CONFIG = {
  campanha: {
    badge: 'Nova Coleção',
    titulo: 'Peças exclusivas da semana ✨',
    subtitulo:
      'Looks selecionados com caimento impecável. Atendimento personalizado pelo WhatsApp ou em nossa loja física.',
    ctaTexto: 'Explorar novidades',
    ctaHref: '/catalogo#catalogo',
  },

  /**
   * Horário de funcionamento (fuso America/Sao_Paulo - Brasília).
   * null = fechado no dia.
   */
  horarios: {
    0: null, // Domingo: fechado
    1: { abre: 9, fecha: 19 }, // Segunda
    2: { abre: 9, fecha: 19 }, // Terça
    3: { abre: 9, fecha: 19 }, // Quarta
    4: { abre: 9, fecha: 19 }, // Quinta
    5: { abre: 9, fecha: 19 }, // Sexta
    6: { abre: 9, fecha: 18 }, // Sábado
  } as Record<number, HorarioDia | null>,

  provaSocial: {
    notaMedia: '5,0',
    clientesAtendidas: '+500 clientes satisfeitas em Santa Maria e região',
    depoimentos: [
      {
        nome: 'Samara Suelane',
        texto: 'A melhor loja de roupas de Brasília! Atendimento maravilhoso e peças lindíssimas.',
      },
      {
        nome: 'Kezia Fernandes',
        texto: 'Sou cliente há mais de 10 anos e indico de olhos fechados! Peças maravilhosas.',
      },
      {
        nome: 'Veronica Maria',
        texto: 'Roupas lindas, corte bom, veste a gente como princesa. Podem ir sem medo!',
      },
    ],
  },
};

/** Calcula se a loja está aberta agora no fuso de Brasília (America/Sao_Paulo). */
export function getStoreOpenStatus(): { isOpen: boolean; label: string } {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(now);

    const weekdayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    const wk = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 12);
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
    const currentDecimal = hour + minute / 60;

    const schedule = BIO_CONFIG.horarios[weekdayMap[wk] ?? 1];
    if (!schedule) {
      return { isOpen: false, label: 'Fechada agora • Seg a Sáb' };
    }

    const isOpen = currentDecimal >= schedule.abre && currentDecimal < schedule.fecha;
    return {
      isOpen,
      label: isOpen
        ? `Aberta agora • até ${schedule.fecha}h`
        : `Fechada agora • Abre às ${schedule.abre}h`,
    };
  } catch {
    return { isOpen: true, label: 'Atendimento Online' };
  }
}

