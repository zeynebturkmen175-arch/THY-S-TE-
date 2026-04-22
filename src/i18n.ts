import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  tr: {
    translation: {
      "nav": {
        "summary": "Yönetici Özeti",
        "timeline": "Zaman Tüneli",
        "finance": "Finansal Analiz",
        "regions": "Bölgesel Gelir",
        "goals": "2033 Hedefleri",
        "stakeholders": "Paydaşlar",
        "search": "Strateji Ara..."
      },
      "hero": {
        "badge": "Stratejik Dönüşüm Raporu",
        "title": "Geleceğin",
        "title_accent": "Kanatları Burada",
        "desc": "1933 yılında başlayan tutku, bugün 450'den fazla uçakla dünyanın en geniş uçuş ağına dönüştü. Türk Hava Yolları, 100. yılında küresel havacılığı yeniden tanımlıyor.",
        "cta_investor": "Yatırımcı İlişkileri",
        "cta_vision": "Vizyonu Keşfet"
      },
      "search": {
        "placeholder": "THY stratejisi veya verileri hakkında sorun...",
        "analyzing": "Yapay Zeka Vizyonu Analiz Ediyor...",
        "related": "İlgili Bölüm",
        "go": "Git",
        "engine": "Yapay Zeka Destekli Strateji Motoru",
        "error_generic": "Şu an cevap veremiyorum. Lütfen sorunuzu farklı bir şekilde sormayı deneyin.",
        "error_api": "Bağlantı sırasında bir aksaklık oluştu. Lütfen biraz sonra tekrar deneyin.",
        "error_empty": "Lütfen önce bir soru yazın."
      },
      "finances": {
        "title": "Kaynak ve Performans Analizi",
        "desc": "2023-2026 Karşılaştırmalı Operasyonel Veriler",
        "archive_btn": "Arşivi Görüntüle"
      },
      "regions": {
        "title": "Küresel Operasyon ve Gelir",
        "desc": "Bölgesel bazda pazar payı ve yıllık büyüme oranları."
      },
      "chat": {
        "welcome": "Merhaba! Ben MARTHY. THY 2033 vizyonu hakkında merak ettiğiniz her şeyi bana sorabilirsiniz. Hava yollarımızın geleceğini beraber keşfedelim mi?",
        "thinking": "Düşünülüyor...",
        "placeholder": "Vizyonumuz hakkında sorun...",
        "online": "Canlı Bağlantı Aktif",
        "error_generic": "Gelecek vizyonumuza odaklanırken kısa bir teknik aksaklık yaşadım. Lütfen tekrar deneyin!",
        "error_api": "Şu an bağlantıda bir aksaklık yaşıyorum, lütfen tekrar sorar mısınız?"
      }
    }
  },
  en: {
    translation: {
      "nav": {
        "summary": "Executive Summary",
        "timeline": "Timeline",
        "finance": "Financial Analysis",
        "regions": "Regional Revenue",
        "goals": "2033 Goals",
        "stakeholders": "Stakeholders",
        "search": "Search Strategy..."
      },
      "hero": {
        "badge": "Strategic Transformation Report",
        "title": "The Future",
        "title_accent": "Has Wings Here",
        "desc": "The passion that began in 1933 has today transformed into the world's widest flight network with over 450 aircraft. Turkish Airlines is redefining global aviation in its 100th year.",
        "cta_investor": "Investor Relations",
        "cta_vision": "Explore the Vision"
      },
      "search": {
        "placeholder": "Ask about THY strategy or data...",
        "analyzing": "AI is Analyzing the Vision...",
        "related": "Related Section",
        "go": "Go",
        "engine": "AI-Powered Strategy Engine",
        "error_generic": "I can't answer right now. Please try rephrasing your question.",
        "error_api": "There was a glitch in the connection. Please try again in a moment.",
        "error_empty": "Please type a question first."
      },
      "finances": {
        "title": "Resource and Performance Analysis",
        "desc": "2023-2026 Comparative Operational Data",
        "archive_btn": "View Archive"
      },
      "regions": {
        "title": "Global Operations & Revenue",
        "desc": "Market share and annual growth rates on a regional basis."
      },
      "chat": {
        "welcome": "Hello! I am MARTHY. You can ask me anything about THY's 2033 vision. Shall we explore the future of our airline together?",
        "thinking": "Thinking...",
        "placeholder": "Ask about our vision...",
        "online": "Live Connection Active",
        "error_generic": "I encountered a minor technical glitch while focusing on our future vision. Please try again!",
        "error_api": "I'm having some connection issues right now, could you please ask again?"
      }
    }
  },
  de: {
    translation: {
      "nav": {
        "summary": "Zusammenfassung",
        "timeline": "Zeitstrahl",
        "finance": "Finanzanalyse",
        "regions": "Regionale Einnahmen",
        "goals": "Ziele 2033",
        "stakeholders": "Stakeholder",
        "search": "Strategie suchen..."
      },
      "hero": {
        "badge": "Strategischer Transformationsbericht",
        "title": "Die Zukunft",
        "title_accent": "Hat hier Flügel",
        "desc": "Die Leidenschaft, die 1933 begann, hat sich heute in das weltweit größte Flugnetz mit über 450 Flugzeugen verwandelt. Turkish Airlines definiert die globale Luftfahrt im 100. Jahr neu.",
        "cta_investor": "Investor Relations",
        "cta_vision": "Vision erkunden"
      },
      "search": {
        "placeholder": "Fragen Sie nach der THY-Strategie oder Daten...",
        "analyzing": "KI analysiert die Vision...",
        "related": "Verwandter Abschnitt",
        "go": "Gehe zu",
        "engine": "KI-gestützte Strategie-Engine",
        "error_generic": "Ich kann momentan nicht antworten. Bitte versuchen Sie, Ihre Frage anders zu formulieren.",
        "error_api": "Es gab eine Störung in der Verbindung. Bitte versuchen Sie es in birer Augenblick erneut.",
        "error_empty": "Bitte geben Sie zuerst eine Frage ein."
      },
      "finances": {
        "title": "Ressourcen- und Leistungsanalyse",
        "desc": "Vergleichende Betriebsdaten 2023-2026",
        "archive_btn": "Archiv anzeigen"
      },
      "regions": {
        "title": "Globale Aktivitäten & Einnahmen",
        "desc": "Marktanteile und jährliche Wachstumsraten auf regionaler Basis."
      },
      "chat": {
        "welcome": "Hallo! Ich bin MARTHY. Sie können mich alles über die Vision 2033 von THY fragen. Sollen wir gemeinsam die Zukunft unserer Fluggesellschaft erkunden?",
        "thinking": "Nachdenken...",
        "placeholder": "Fragen Sie nach unserer Vision...",
        "online": "Live-Verbindung aktiv",
        "error_generic": "Ich bin auf ein kleines technisches Problem gestoßen, während ich mich auf unsere Zukunftsvision konzentriert habe. Bitte versuchen Sie es erneut!",
        "error_api": "Ich habe gerade einige Verbindungsprobleme. Könnten Sie bitte noch einmal fragen?"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
