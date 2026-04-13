export interface SiteConfig {
  nomeLoja: string;
  whatsappDDIeDDD: string;
  linkInstagram: string;
  arrobaInstagram: string;
  enderecoCompleto: string;
  linkEndereco: string;
  hero: {
    tituloParte1: string;
    tituloParte2: string;
    tituloParte3: string;
    subtitulo: string;
  };
}

export const siteConfig: SiteConfig = {
  nomeLoja: "Audácia Modas",
  whatsappDDIeDDD: "5561998851403",
  linkInstagram: "https://www.instagram.com/lojaaudaciamoda?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  arrobaInstagram: "@lojaaudaciamoda",
  enderecoCompleto: "Santa Maria Norte - DF",
  linkEndereco: "https://maps.app.goo.gl/WAUnjuntNJrFP35W6",
  hero: {
    tituloParte1: "Audácia Modas:",
    tituloParte2: "Vista sua",
    tituloParte3: "Essência.",
    subtitulo: "Descubra a coleção exclusiva que combina elegância contemporânea com o toque clássico que você merece. Vista-se de confiança."
  }
};
