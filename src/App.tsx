/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, LayoutGroup } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Plane, 
  Globe, 
  Target, 
  Wallet, 
  Leaf, 
  ChevronRight,
  BarChart3,
  Award,
  ArrowUpRight,
  Menu,
  X,
  MessageSquare,
  Sparkles,
  Download,
  FileText,
  ExternalLink,
  ShieldCheck,
  Zap,
  Calendar,
  Briefcase,
  Handshake,
  Ship,
  Building2,
  Users2,
  Heart,
  ArrowLeft,
  CheckCircle2,
  PieChart as PieIcon,
  Search
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Timeline } from './components/Timeline';
import { MarthyGull } from './components/MarthyGull';
import { VisionAssistant } from './components/VisionAssistant';
import { FlightMap } from './components/FlightMap';
import { GoogleGenAI } from "@google/genai";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", duration = 2 }: { value: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (typeof value !== 'number') return;
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;
    let step = end / (totalMiliseconds / incrementTime);

    let timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
};

// Data based on THY 2033 Vision & 2023 Performance metrics
const financialData = [
  { 
    metric: 'Gelir (Milyar $)', 
    val2023: 20.9, 
    val2026: 23.5, 
    suffix: 'B',
    source: 'Yatırımcı Sunumu Q4 2023',
    sourceDetail: 'Konsolide gelir tablosu verileri baz alınmıştır. 2026 tahmini stratejik plan hedefleriyle uyumludur.'
  },
  { 
    metric: 'Yolcu Sayısı (Milyon)', 
    val2023: 83.4, 
    val2026: 90.0, 
    suffix: 'M',
    source: 'Trafik Sonuçları Raporu',
    sourceDetail: 'Ücretli Yolcu Kilometre (RPK) ve Arzedilen Koltuk Kilometre (ASK) verileri üzerinden hesaplanmıştır.'
  },
  { 
    metric: 'Filo Büyüklüğü', 
    val2023: 440, 
    val2026: 475, 
    suffix: '',
    source: 'Filo Yönetim Planı 2026',
    sourceDetail: 'Sipariş aşamasındaki A350 ve 787 teslimat programlarına göre güncellenen aktif envanter verisidir.'
  },
  { 
    metric: 'Kargo Hacmi (Bin Ton)', 
    val2023: 1660, 
    val2026: 1800, 
    suffix: 'K',
    source: 'Turkish Cargo Strateji Belgesi',
    sourceDetail: 'SmartIST operasyon merkezi verimlilik artışı ve yeni kargo destinasyonları etkisi dahil edilmiştir.'
  },
];

const regionalData = [
  { name: 'Avrupa', value: 34, color: '#1D4ED8', growth: '+%8.5' },
  { name: 'Amerika', value: 22, color: '#2563EB', growth: '+%14.2' },
  { name: 'Uzak Doğu', value: 18, color: '#3B82F6', growth: '+%16.8' },
  { name: 'Orta Doğu', value: 15, color: '#60A5FA', growth: '+%10.4' },
  { name: 'Diğer', value: 11, color: '#93C5FD', growth: '+%11.2' },
];

const stakeholderGroups = [
  {
    title: 'Misafirler (Yolcular)',
    count: '90M+',
    desc: 'Yıllık uçuş hacmi ile dünyanın dört bir yanından gelen yolcularımız en büyük paydaşımızdır.',
    icon: <Users2 className="w-5 h-5 text-blue-600" />,
    details: ['Kişiselleştirilmiş Seyahat Deneyimi', 'TK Wallet Dijital Ödeme Çözümü', 'Sıfır Hata Hedefli Bagaj Yönetimi'],
    impact: 'Pazar Payı Liderliği',
    brands: ['Miles&Smiles', 'TK Wallet', 'Turkish Cargo', 'AJet']
  },
  {
    title: 'Çalışanlar',
    count: '90K+',
    desc: 'Pilotlardan kabin ekibine, mühendislerden yer hizmetlerine vizyonun gerçek mimarları.',
    icon: <Briefcase className="w-5 h-5 text-indigo-600" />,
    details: ['Global Akademi Eğitim Programları', 'Çeşitlilik ve Kapsayıcılık Endeksi', 'Çalışan Bağlılığı: %88+'],
    impact: 'Operasyonel Mükemmellik',
    brands: ['THY Akademi', 'Flight Training Center', 'Human Resources']
  },
  {
    title: 'Yatırımcılar',
    count: '1.2M+',
    desc: 'Hissedarlarımız ve finansal ortaklarımız sürdürülebilir büyümemizin teminatıdır.',
    icon: <Wallet className="w-5 h-5 text-emerald-600" />,
    details: ['Sürdürülebilir Temettü Politikası', 'ESG (Çevresel, Sosyal, Yönetişim) Karnesi', 'BİST Sürdürülebilirlik Endeksi Liderliği'],
    impact: 'Finansal Güvenilirlik',
    brands: ['BIST 100', 'Morgan Stanley', 'Goldman Sachs', 'HSBC']
  },
  {
    title: 'Stratejik Ortaklar',
    count: '450+',
    desc: 'Star Alliance üyeleri ve küresel operasyon ortaklarımız ile gücümüze güç katıyoruz.',
    icon: <Handshake className="w-5 h-5 text-amber-600" />,
    details: ['Star Alliance Entegrasyonu', 'Kod Paylaşımı (Code-Share) Genişlemesi', 'Ortak Pazarlama Global Vizyonu'],
    impact: 'Küresel Bağlantı',
    brands: ['Star Alliance', 'Lufthansa', 'United Airlines', 'Air Canada']
  },
  {
    title: 'Tedarikçiler',
    count: '8000+',
    desc: 'Uçak üreticileri, yakıt sağlayıcılar ve ikram servisleri ile uçtan uca hizmet zinciri.',
    icon: <Ship className="w-5 h-5 text-slate-600" />,
    details: ['Yerli Üretim ve Yerlileştirme Desteği', 'Yeşil Tedarik Zinciri Yönetimi', 'Verimlilik Odaklı Lojistik'],
    impact: 'Yerli Kalkınma',
    brands: ['Airbus', 'Boeing', 'Rolls-Royce', 'GE Aviation', 'Turkish DO&CO']
  },
  {
    title: 'Düzenleyici Kurumlar',
    count: '128 Ülke',
    desc: 'Otoriteler ve havacılık kurumları ile tam uyumlu, güvenli bir gelecek inşa ediyoruz.',
    icon: <Building2 className="w-5 h-5 text-red-600" />,
    details: ['Uluslararası Havacılık Standartları', 'Sürdürülebilir Havacılık Yakıtı (SAF) Standartları', 'Hava Sahası Güvenliği Protokolleri'],
    impact: 'Küresel Prestij',
    brands: ['IATA', 'ICAO', 'EASA', 'SHGM', 'FAA']
  }
];

const visionGoals = [
  { 
    title: '50 Milyar $ Gelir', 
    desc: '2033 yılına kadar yıllık konsolide gelirin 50 milyar dolara ulaştırılması hedefleniyor.',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-blue-600',
    progress: 42,
    longDesc: 'THY, ölçek ekonomisinden faydalanarak ve yan gelirleri maksimize ederek küresel havacılık gelir liginde zirveye oynamayı hedefliyor.',
    subMetrics: ['Yan Gelir Payı: %30+', 'Ortalama Bilet Değeri Optimizasyonu', 'Kargo Geliri Katkısı: $5B+']
  },
  { 
    title: '800+ Uçaklık Filo', 
    desc: 'Dünyanın en genç ve modern filolarından birini 800 uçak seviyesine çıkarma vizyonu.',
    icon: <Plane className="w-6 h-6" />,
    color: 'text-blue-500',
    progress: 55,
    longDesc: 'Yeni nesil, yakıt verimliliği yüksek uçaklarla filo yaş ortalamasını düşürürken operasyonel esnekliğimizi artırıyoruz.',
    subMetrics: ['Geniş Gövde Oranı: %25+', 'Yeni Nesil Motor Teknolojisi', 'Sıfır Emisyonlu Yer Hizmetleri Araçları']
  },
  { 
    title: '170 Milyon Yolcu', 
    desc: 'Yıllık yolcu kapasitesinin iki katına çıkarılarak küresel liderliğin pekiştirilmesi.',
    icon: <Users className="w-6 h-6" />,
    color: 'text-indigo-600',
    progress: 48,
    longDesc: 'Transfer merkezi gücümüzü kullanarak dünyanın her noktasını İstanbul üzerinden birbirine bağlıyoruz.',
    subMetrics: ['Transfer Yolcu Payı: %60+', 'Süper Hub İstanbul Havalimanı Entegrasyonu', 'Yeni Destinasyon Hedefi: 400+']
  },
  { 
    title: 'Sürdürülebilirlik (SAF)', 
    desc: '2050 karbon nötr hedefi yolunda SAF (Sürdürülebilir Havacılık Yakıtı) kullanımının artırılması.',
    icon: <Leaf className="w-6 h-6 text-green-600" />,
    color: 'text-green-600',
    progress: 15,
    longDesc: 'Sürdürülebilir havacılık yakıtı kullanımını normalize ederek havacılık sektörünün yeşil dönüşümüne öncülük ediyoruz.',
    subMetrics: ['SAF Karışım Oranı: %10 (2033)', 'Yenilenebilir Enerji Yatırımları', 'Atık Yönetimi Verimliliği: %95+']
  },
  { 
    title: 'AJet Bağımsız Yapılanma', 
    desc: 'AJet\'in kendi markasıyla küresel bir düşük maliyetli taşıyıcı (LCC) devine dönüşümü.',
    icon: <Target className="w-6 h-6" />,
    color: 'text-red-500',
    progress: 30,
    longDesc: 'AJet, düşük maliyetli iş modeliyle Anadolu\'yu dünyaya bağlarken Avrupa ve Orta Doğu pazarında pazar payını artırıyor.',
    subMetrics: ['200+ Uçaklık AJet Filosu', 'Maliyet Avantajlı Operasyon Modeli', 'Dijital Tabanlı Satış Kanalı Yaygınlığı']
  },
  { 
    title: 'TK Cüzdan & Dijitalleşme', 
    desc: 'Misafir deneyiminin dijital ödeme ve sadakat çözümleriyle maksimize edilmesi.',
    icon: <Wallet className="w-6 h-6 text-amber-600" />,
    color: 'text-amber-600',
    progress: 25,
    longDesc: 'Kişiselleştirilmiş dijital asistanlar ve akıllı ödeme sistemleri ile yolculuğun her anını dijitalleştiriyoruz.',
    subMetrics: ['Aktif TK Cüzdan Kullanıcısı: 20M+', 'AI Tabanlı Kişisel Asistan: MARTHY', 'Biyometrik Geçiş Sistemleri']
  }
];

const strategicDetailData = [
  {
    title: 'Verimlilik Odaklılık',
    icon: <TrendingUp className="w-12 h-12 text-blue-500" />,
    fullDesc: 'Operasyonel mükemmelliği dijital zeka ile birleştiriyoruz. AI destekli rota optimizasyonu ve yakıt yönetim sistemlerimizle operasyonel verimliliği maksimize ediyoruz.',
    stats: [
      { label: 'Yakıt Tasarrufu', val: '%5', detail: 'AI Rota Optimizasyonu' },
      { label: 'Zaman Verimliliği', val: '%15', detail: 'Yer Hizmetleri Otomasyonu' },
      { label: 'Teknik Hazıroluş', val: '%98', detail: 'Tahminleyici Bakım (PdM)' }
    ],
    highlights: ['Uçuş Planlama Algoritmaları', 'Smart Cargo Yükleme Sistemleri', 'Robotik Süreç Otomasyonu (RPA)']
  },
  {
    title: 'Küresel Hizmet Ağı',
    icon: <Globe className="w-12 h-12 text-indigo-500" />,
    fullDesc: 'Dünyanın en geniş uçuş ağına sahip havayolu olarak, İstanbul stratejik konumumuzu küresel bir köprüye dönüştürüyoruz.',
    stats: [
      { label: 'Destinasyon', val: '344', detail: '6 Kıta, 128 Ülke' },
      { label: 'Havalimanı Erişimi', val: '1200+', detail: 'Star Alliance Entegrasyonu' },
      { label: 'Hub Bağlantısı', val: '4 Saat', detail: '60+ Başkente Erişim' }
    ],
    highlights: ['Kıtalararası Transfer Gücü', 'Esnek Filo Planlama', 'Kargo Ağı Yaygınlığı (Turkish Cargo)']
  },
  {
    title: 'Dijitalleşme 4.0',
    icon: <Target className="w-12 h-12 text-amber-500" />,
    fullDesc: 'Yolculuğun her anını dijital bir sanat eserine dönüştürüyoruz. Biyometrik sistemlerden blokzincir tabanlı sadakat programlarına kadar havacılıkta dijital öncüyüz.',
    stats: [
      { label: 'Boarding Hızı', val: '-%30', detail: 'Biyometrik Geçiş Sistemleri' },
      { label: 'AI Asistan', val: '7/24', detail: 'MARTHY Kişisel Destek' },
      { label: 'Dijital Cüzdan', val: '20M+', detail: 'TK Cüzdan Aktif Kullanıcı' }
    ],
    highlights: ['Web3 Sadakat Programı', 'Kişiselleştirilmiş Yolcu Deneyimi', 'Uçuş İçi Dijital Eğlence (Planet)']
  },
  {
    title: 'Sürdürülebilir SAF',
    icon: <Leaf className="w-12 h-12 text-emerald-500" />,
    fullDesc: 'Gelecek nesillere nefes alabilen bir dünya bırakmak en büyük sorumluluğumuz. SAF (Sürdürülebilir Havacılık Yakıtı) yatırımlarımızla karbon ayak izimizi minimize ediyoruz.',
    stats: [
      { label: 'SAF Hedefi', val: '%10', detail: '2033 Kullanım Oranı' },
      { label: 'Karbon Nötr', val: '2050', detail: 'Net Sıfır Emisyon Taahhüdü' },
      { label: 'Filo Yaşı', val: '8.2', detail: 'Dünyanın En Genç Filolarından' }
    ],
    highlights: ['Biyoyakıt Ar-Ge Çalışmaları', 'Sıfır Atık Operasyonları', 'Karbon Dengeleme Programları']
  }
];

export default function App() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<'vision' | 'investor' | null>(null);
  const [showStakeholders, setShowStakeholders] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [activeStrategicDetail, setActiveStrategicDetail] = useState<number | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [showPerformanceArchive, setShowPerformanceArchive] = useState(false);
  const [activeGoal, setActiveGoal] = useState<number | null>(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<number | null>(null);
  const [showDetailedReport, setShowDetailedReport] = useState<number | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const reportRef = useRef<HTMLDivElement>(null);
  
  // New States: Search & Comments
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<{ answer: string; relatedSection?: string; isError?: boolean } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [comments, setComments] = useState<Record<number, { id: string; user: string; text: string; date: string }[]>>({});
  const [commentInput, setCommentInput] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 500], [0, 250]);
  const y2 = useTransform(scrollY, [0, 500], [0, -200]);
  const y3 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 300], [1, 0.95]);
  
  // Mouse parallax for hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    scrollToId(targetId);
    setIsMenuOpen(false);
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResult({ answer: t('search.error_empty'), isError: true });
      return;
    }
    setIsSearching(true);
    setSearchResult(null);

    try {
      const context = {
        goals: visionGoals.map(g => ({ title: g.title, desc: g.longDesc })),
        financials: financialData.map(f => ({ metric: f.metric, val2026: f.val2026 })),
        regions: regionalData.map(r => ({ name: r.name, value: r.value, growth: (r as any).growth })),
        strategy: strategicDetailData.map(s => ({ title: s.title, desc: s.fullDesc }))
      };

      const prompt = `Sen THY'nin 2033 Vizyonu ve Stratejik Veri Uzmanısın. Kullanıcı şu soruyu sordu: "${searchQuery}". 
      
      Görevlerin:
      1. Aşağıdaki verilere dayanarak ÇOK KISA ve samimi bir cevap ver (maksimum 2-3 cümle).
      2. Bilgiyi hap gibi sun, detaylara boğulma.
      3. Eğer cevabın belirli bir bölümle ilgiliyse, en sona "section: [ID]" ekle.
      
      Veriler: ${JSON.stringify(context)}`;

      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        setSearchResult({ answer: t('search.error_api'), isError: true });
        return;
      }

      const genAI = new GoogleGenAI({ apiKey });
      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      });
      const responseText = result.text || "";

      if (!responseText.trim()) {
        throw new Error("Empty response");
      }

      // Simple parsing for section ID
      const sectionMatch = responseText.match(/section:\s*([a-z0-9-]+)/i);
      const relatedSection = sectionMatch ? sectionMatch[1] : undefined;
      const cleanAnswer = responseText.replace(/section:\s*[a-z0-9-]+/i, "").trim();

      setSearchResult({ answer: cleanAnswer, relatedSection });
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResult({ answer: t('search.error_generic'), isError: true });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePostComment = () => {
    if (activeGoal === null || !commentInput.trim()) return;
    setIsPostingComment(true);
    
    setTimeout(() => {
      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        user: "Misafir Kullanıcı",
        text: commentInput,
        date: new Date().toLocaleDateString('tr-TR')
      };
      
      setComments(prev => ({
        ...prev,
        [activeGoal]: [newComment, ...(prev[activeGoal] || [])]
      }));
      
      setCommentInput("");
      setIsPostingComment(false);
    }, 600);
  };

  const simulateDownload = (docType: 'vision' | 'investor') => {
    setDownloadProgress(0);
    setActiveDoc(docType);
    
    // Simulate interactive "preparing" state
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        setDownloadProgress(100);
        clearInterval(interval);
        
        // Trigger a real file download after the interactive simulation
        const content = `Türk Hava Yolları 2033 Vizyonu - ${docType === 'vision' ? 'Stratejik Plan' : 'Yatırımcı Raporu'}\n` +
          `Tarih: ${new Date().toLocaleDateString()}\n` +
          `Erişim Kaynağı: THY Vizyon Paneli\n\n` +
          `Bu bir örnek veri setidir. Gerçek veriler için lütfen kurumsal kanalları takip edin.`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `THY_2033_${docType.toUpperCase()}_DATA.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        setDownloadProgress(progress);
      }
    }, 150);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navItems = [
    { id: 'yonetici-ozeti', label: t('nav.summary') },
    { id: 'timeline', label: t('nav.timeline') },
    { id: 'finansal-analiz', label: t('nav.finance') },
    { id: 'bolgesel-gelir', label: t('nav.regions') },
    { id: '2033-hedefleri', label: t('nav.goals') },
    { id: 'feedback', label: 'Geri Bildirim' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg shrink-0">
                <Plane className="w-6 h-6 text-blue-700" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                THY <span className="text-blue-600">Vizyon 2033</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <div className="relative group/search">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 text-xs font-bold transition-all border border-transparent hover:border-slate-300"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('nav.search')}</span>
                  <kbd className="hidden lg:block ml-2 px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[8px]">⌘K</kbd>
                </button>
              </div>

              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={(e) => {
                    if (item.id === 'feedback') {
                      setShowFeedbackModal(true);
                      setFeedbackStatus('idle');
                    } else {
                      handleNavClick(e as any, item.id);
                    }
                  }}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-tight"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      if (item.id === 'feedback') {
                        setShowFeedbackModal(true);
                        setFeedbackStatus('idle');
                        setIsMenuOpen(false);
                      } else {
                        handleNavClick(e as any, item.id);
                      }
                    }}
                    className="block w-full text-left text-base font-semibold text-slate-700 hover:text-blue-600 px-2 py-1"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header id="yonetici-ozeti" ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden scroll-mt-20">
        {/* Background Visuals */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-70" />
          
          <motion.div style={{ opacity: opacityHero, scale: scaleHero }} className="absolute inset-0">
            {/* Background Blobs */}
            <motion.div 
              style={{ y: y1, x: mousePos.x * 0.3 }}
              className="absolute top-20 right-[15%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] animate-pulse"
            />
            <motion.div 
              style={{ y: y2, x: -mousePos.x * 0.5 }}
              className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-[100px]"
            />
            <motion.div 
              style={{ y: y3, x: mousePos.x * 0.2 }}
              className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-100/40 rounded-full blur-[90px]"
            />
            
            {/* Floating Particles/Lines */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ 
                    duration: 5 + i, 
                    repeat: Infinity, 
                    delay: i * 0.5 
                  }}
                  className="absolute bg-blue-400 h-px w-24"
                  style={{ 
                    top: `${15 * i + 10}%`, 
                    left: `${(i * 17) % 80}%`,
                    transform: `rotate(${i * 45}deg)`
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Mock Video/Cinematic Backdrop */}
          <motion.div 
            style={{ opacity: useTransform(scrollY, [0, 300], [0.08, 0]) }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay grayscale" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl py-20"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-200"
              >
                <Sparkles className="w-3 h-3 mr-2" /> {t('hero.badge')}
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.95]">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="block"
                >
                  {t('hero.title')}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-600 pb-2"
                >
                  {t('hero.title_accent')}
                </motion.span>
              </h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl text-slate-600 mb-10 leading-relaxed font-medium"
              >
                {t('hero.desc')}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <button 
                  onClick={() => simulateDownload('vision')}
                  className="group bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all flex items-center gap-2 shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95"
                >
                  {t('hero.cta_vision')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => simulateDownload('investor')}
                  className="bg-white/60 backdrop-blur-md text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-600" /> {t('hero.cta_investor')}
                </button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mt-12 group/paydas cursor-pointer"
                onClick={() => setShowStakeholders(true)}
              >
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-4 group-hover/paydas:-space-x-1 transition-all duration-500 ease-out py-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (i * 0.1) }}
                        whileHover={{ 
                          scale: 1.2, 
                          zIndex: 10,
                          backgroundColor: '#2563EB',
                          borderColor: '#fff'
                        }}
                        className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-lg shadow-slate-200/50 relative"
                      >
                        <img 
                          src={`https://picsum.photos/seed/stakeholder-${i}/40/40`} 
                          alt="Stakeholder" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                    >
                      +794
                    </motion.div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        <AnimatedCounter value={800} suffix="+" duration={4} />
                      </span>
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-blue-500"
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-1">
                      Paydaşın Ortak Vizyonu
                    </div>
                  </div>
                </div>
                
                {/* Expandable Info on Hover */}
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  whileHover={{ height: 'auto', opacity: 1 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                    {[
                      { label: 'Yatırımcı', val: '%24' },
                      { label: 'Çalışan', val: '90K+' },
                      { label: 'Partner', val: '450+' },
                      { label: 'Hükümet', val: '32+' }
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{stat.label}</div>
                        <div className="text-sm font-bold text-blue-600">{stat.val}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="hidden lg:flex justify-center relative py-20 pr-12">
              <motion.div 
                style={{ y: y3, x: mousePos.x * 0.2 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.4 }}
                className="w-full aspect-[4/3] bg-slate-900 rounded-[64px] border border-white/10 shadow-3xl overflow-hidden group relative"
              >
                <div className="absolute inset-0 grayscale opacity-40 group-hover:grayscale-0 transition-all duration-700">
                  <FlightMap />
                </div>

                <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="px-4 py-2 bg-blue-600/20 backdrop-blur-md rounded-2xl border border-blue-500/30">
                        <div className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Global Network</div>
                        <div className="text-xl font-bold text-white tracking-tighter">Live Operations</div>
                      </div>
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <Globe className="w-6 h-6 text-white animate-spin-slow" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex gap-4">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="flex-1 h-16 bg-white/5 rounded-2xl border border-white/10 p-3">
                              <div className="w-full h-1 bg-white/10 rounded-full mb-3">
                                 <div className="h-full bg-blue-500 rounded-full" style={{ width: `${30 + i * 20}%` }} />
                              </div>
                              <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Region {i} Activity</div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-20 w-full top-[-100%] animate-scan" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aşağı Kaydır</span>
          <div className="w-1 h-12 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full h-1/4 bg-blue-600 rounded-full"
            />
          </div>
        </motion.div>
      </header>

      <Timeline />

      {/* Dashboard Stats */}
      <motion.section 
        id="finansal-analiz" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 bg-white border-y border-slate-100 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div 
              className="cursor-pointer group/header"
              onClick={() => setShowPerformanceArchive(true)}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-blue-600 opacity-0 group-hover/header:opacity-100 transition-opacity" />
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter group-hover/header:text-blue-700 transition-colors">{t('finances.title')}</h2>
              </div>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                {t('finances.desc')}
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/header:opacity-100 transition-all">Etkileşimli</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowPerformanceArchive(true)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm"
              >
                <FileText className="w-4 h-4" /> {t('finances.archive_btn')}
              </button>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="flex items-center gap-1.5 text-blue-200">
                  <span className="w-3 h-3 rounded bg-blue-200" /> 2023
                </span>
                <span className="flex items-center gap-1.5 text-blue-700">
                  <span className="w-3 h-3 rounded bg-blue-700" /> 2026 (Tahmin/Gerç.)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {financialData.map((data, idx) => (
              <motion.div 
                key={data.metric}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setShowPerformanceArchive(true)}
                className="group cursor-pointer bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all relative overflow-hidden active:scale-95"
              >
                {/* Decorative background element */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors" />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{data.metric}</p>
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-end gap-2 mb-6 relative z-10">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-blue-700 transition-colors">
                    {data.val2026}
                    <span className="text-xl ml-0.5 text-blue-600">{data.suffix}</span>
                  </span>
                  <span className="text-sm font-black text-emerald-600 mb-2 flex items-center bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                    <ArrowUpRight className="w-3 h-3" />
                    {Math.round(((data.val2026 - data.val2023) / data.val2023) * 100)}%
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(data.val2023 / data.val2026) * 100}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" 
                  />
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Önceki Dönem</span>
                    <span className="text-xs font-black text-slate-900">{data.val2023}{data.suffix}</span>
                  </div>
                  
                  {/* Subtle Source reveal on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-right">
                    <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Kaynak</div>
                    <div className="text-[10px] font-bold text-blue-700 leading-none truncate max-w-[80px]">{data.source}</div>
                  </div>
                </div>

                {/* Info Tooltip Icon */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase tracking-tighter">
                      Detayları Gör <ChevronRight className="w-2 h-2" />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div 
              onClick={() => setShowPerformanceArchive(true)}
              className="lg:col-span-1 bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group cursor-pointer hover:shadow-blue-500/20 hover:-translate-y-1 transition-all active:scale-95 scroll-mt-20"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 className="w-24 h-24" />
              </div>
              <div className="relative z-10 flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" /> Gelir Artış Trendi
                </h3>
                <div className="px-2 py-1 bg-blue-600/30 rounded-lg text-[8px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  Etkileşimli
                </div>
              </div>
              <div className="h-[250px] w-full mt-4 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="metric" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl backdrop-blur-xl z-50">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{data.metric}</p>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-white flex justify-between gap-4">2023: <span className="text-slate-400">{data.val2023}{data.suffix}</span></p>
                                <p className="text-xs font-bold text-white flex justify-between gap-4">2026: <span className="text-blue-400 font-black">{data.val2026}{data.suffix}</span></p>
                              </div>
                              <div className="mt-3 pt-3 border-t border-slate-800">
                                 <p className="text-[9px] font-bold text-slate-500 uppercase">Veri Detayı:</p>
                                 <p className="text-[10px] text-slate-300 leading-tight mt-1 max-w-[180px]">{data.sourceDetail}</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="val2023" fill="#334155" radius={[4, 4, 0, 0]} name="2023" />
                    <Bar dataKey="val2026" fill="#2563EB" radius={[4, 4, 0, 0]} name="2026" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex items-center justify-between relative z-10">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">KAP Onaylı Çeyrek Verileri</p>
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
            </div>

            <div id="bolgesel-gelir" className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 p-10 shadow-xl shadow-slate-200/50 scroll-mt-20 overflow-hidden flex flex-col md:flex-row gap-12 group/main hover:border-blue-200 transition-all">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
                    <Globe className="w-6 h-6 text-blue-600 animate-pulse" /> {t('regions.title')}
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Canlı Simülasyon</span>
                  </div>
                </div>
                <div className="h-[360px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-950 relative">
                  <FlightMap />
                  {/* Map Overlay Blur (Subtle) */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/20 to-transparent" />
                </div>
              </div>
              
              <div className="w-full md:w-80 flex flex-col">
                <div className="mb-10">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-1">Pazar Payı</h4>
                   <h5 className="text-2xl font-black text-slate-900 tracking-tighter px-1">Bölgesel Gelir Dağılımı</h5>
                </div>
                
                <div className="space-y-3">
                  {regionalData.map((item) => (
                    <motion.div 
                      key={item.name} 
                      whileHover={{ x: 8 }}
                      className="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                           <span className="text-lg font-black text-slate-900">%{item.value}</span>
                        </div>
                      </div>
                      <div className="relative h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          className="h-full rounded-full relative"
                          style={{ backgroundColor: item.color }}
                        >
                           <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                        </motion.div>
                      </div>
                      
                      {/* Interactive Detail Reveal */}
                      <div className="h-0 group-hover:h-8 opacity-0 group-hover:opacity-100 transition-all overflow-hidden mt-2 flex items-center justify-between">
                         <span className="text-[9px] font-bold text-slate-400">Yıllık Büyüme: <span className="text-emerald-500">{(item as any).growth}</span></span>
                         <ArrowUpRight className="w-3 h-3 text-blue-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto pt-10">
                   <div className="p-6 bg-slate-900 rounded-3xl border border-white/5 relative overflow-hidden group/target">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                         <Target className="w-12 h-12 text-blue-500" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Vizyon Hedefi</p>
                        <p className="text-sm text-white font-black leading-tight tracking-tight mb-4">Uluslararası gelir oranını <span className="text-blue-400">+%90</span> seviyesinin üzerine taşımak.</p>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full w-[85%] bg-blue-500 rounded-full animate-pulse" />
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Vision Goals 2033 */}
      <motion.section 
        id="2033-hedefleri" 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 bg-slate-50 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200 pb-16 relative overflow-hidden">
          {/* Decorative Sparks */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
             {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [-20, -100],
                    x: [0, (i - 2) * 50],
                    opacity: [0, 0.5, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full blur-[2px]"
                />
             ))}
          </div>

          <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-200"
            >
              <Award className="w-3 h-3" />
              100. Yıl Özel Projeksiyonu
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[0.9] tracking-tighter">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="block"
              >
                Vision 2033:
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic font-serif"
              >
                Gelecek Projeksiyonu
              </motion.span>
            </h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium"
            >
              Cumhuriyetimizin 100. yılından alınan feyzle, THY'nin önümüzdeki on yıldaki 
              <span className="text-slate-900 font-bold"> büyüme kilometre taşları.</span>
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visionGoals.map((goal, idx) => (
              <motion.div 
                key={goal.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                onClick={() => setActiveGoal(idx)}
                className="group relative bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer overflow-hidden"
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  {goal.icon}
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center bg-slate-50 transition-all group-hover:scale-110", goal.color)}>
                    {goal.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Hedef Gerçekleşme</div>
                    <div className="text-xl font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                      %{ (goal as any).progress }
                    </div>
                  </div>
                </div>

                <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter group-hover:text-blue-700 transition-colors">{goal.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium text-sm mb-8">{goal.desc}</p>
                
                {/* Progress Bar Interaction */}
                <div className="space-y-3 mb-8">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mevcut Durum</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">2033 Hedefi</span>
                   </div>
                   <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(goal as any).progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/20"
                      />
                   </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img src={`https://picsum.photos/seed/${goal.title}-${i}/24/24`} alt="Avatar" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[8px] font-black text-blue-600">
                      +12
                    </div>
                  </div>
                  <button 
                    className="flex items-center gap-1.5 py-2 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                  >
                    Detaylı Analiz <ArrowUpRight className="w-3 h-3 text-blue-400" />
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-4 left-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Veri Güncel: 2026 Mart</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Corporate Summary Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 bg-slate-950 text-white overflow-hidden relative"
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               rotate: [0, 90, 0],
               opacity: [0.1, 0.2, 0.1]
             }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -top-1/2 -left-1/4 w-[100%] h-[100%] rounded-full bg-gradient-radial from-blue-900/50 to-transparent blur-3xl"
           />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-950 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-900/50 shadow-lg shadow-blue-900/20">
                Strateji & Operasyon
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-8 leading-[0.9] tracking-tighter">
                Stratejik Yaklaşım ve<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 font-serif italic pr-4">Global Etki</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                Türk Hava Yolları, 100. yılında havacılığın geleceğini dijitalleşme ve{" "}
                sürdürülebilirlik odağında yeniden inşa ediyor. <span className="text-white">Küresel operasyonel gücünü</span>{" "}
                modern veri analitiği ve karbon nötr hedefleriyle birleştiriyor.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                 <div className="px-5 py-2 bg-white/5 rounded-2xl border border-white/10 text-xs font-bold text-slate-300 backdrop-blur-md">#Sürdürülebilirlik</div>
                 <div className="px-5 py-2 bg-white/5 rounded-2xl border border-white/10 text-xs font-bold text-slate-300 backdrop-blur-md">#DijitalDönüşüm</div>
                 <div className="px-5 py-2 bg-white/5 rounded-2xl border border-white/10 text-xs font-bold text-slate-300 backdrop-blur-md">#OperasyonelMükemmellik</div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Verimlilik Odaklılık',
                  desc: 'Operasyonel maliyet optimizasyonu ve AI destekli yakıt yönetimi ile kârlı büyüme.',
                  icon: <TrendingUp className="w-10 h-10 text-blue-500" />,
                  delay: 0.2
                },
                {
                  title: 'Küresel Hizmet Ağı',
                  desc: 'Dünyanın en geniş uçuş ağıyla 128 ülkede kesintisiz ve güvenli bağlantı.',
                  icon: <Globe className="w-10 h-10 text-indigo-500" />,
                  delay: 0.3
                },
                {
                  title: 'Dijitalleşme 4.0',
                  desc: 'Blockchain tabanlı sadakat programları ve uçtan uca dijital yolcu deneyimi.',
                  icon: <Target className="w-10 h-10 text-amber-500" />,
                  delay: 0.4
                },
                {
                  title: 'Sürdürülebilir SAF',
                  desc: 'Gelecek nesillere daha temiz bir gökyüzü bırakmak için yeşil yakıt önceliği.',
                  icon: <Leaf className="w-10 h-10 text-emerald-500" />,
                  delay: 0.5
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay, duration: 0.5 }}
                  whileHover={{ 
                    y: -8, 
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 0.5)'
                  }}
                  onClick={() => setActiveStrategicDetail(idx)}
                  className="bg-slate-900/50 p-8 rounded-[32px] border border-white/5 transition-all cursor-pointer group backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     {item.icon}
                  </div>
                  <div className="mb-6 bg-slate-800/80 w-16 h-16 rounded-2xl flex items-center justify-center p-3 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h5 className="text-lg font-black text-white mb-3 group-hover:text-blue-400 transition-colors">{item.title}</h5>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">{item.desc}</p>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Detayları Gör</span>
                     <ChevronRight className="w-4 h-4 text-blue-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-8 grayscale opacity-50">
            <Award className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white tracking-widest uppercase">Turkish Airlines</span>
          </div>
          <p className="max-w-xl mx-auto text-sm leading-relaxed mb-10">
            Bu rapor, Türk Hava Yolları'nın 100. yıl vizyonunu kapsayan stratejik bir analiz çalışmasıdır. 
            Veriler kamuya açık kaynaklardan ve kurumsal yıllık raporlardan derlenmiştir.
          </p>
          <div className="flex justify-center gap-6 mb-12">
            {[
              { name: 'LinkedIn', url: 'https://www.linkedin.com/company/turkish-airlines' },
              { name: 'Twitter', url: 'https://twitter.com/TurkishAirlines' },
              { name: 'Yatırımcı İlişkileri', url: 'https://investor.turkishairlines.com/' },
              { name: 'AJet', url: 'https://ajet.com/' }
            ].map((link) => (
              <a 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-bold hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold">© 2026 Türk Hava Yolları A.O. | Strateji ve Planlama</p>
        </div>
      </footer>
      <VisionAssistant />

      {/* Strategic Detail Modal */}
      <AnimatePresence>
        {activeStrategicDetail !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStrategicDetail(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-12 bg-gradient-to-br from-blue-900/20 to-slate-900 relative">
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-xl">
                      {strategicDetailData[activeStrategicDetail].icon}
                    </div>
                    <h2 className="text-4xl font-black text-white mb-6 leading-tight tracking-tighter">
                      {strategicDetailData[activeStrategicDetail].title}
                    </h2>
                    <p className="text-xl text-slate-400 leading-relaxed font-medium">
                      {strategicDetailData[activeStrategicDetail].fullDesc}
                    </p>
                  </div>
                  {/* Abstract background element */}
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
                </div>
                
                <div className="p-12">
                   <div className="flex justify-between items-center mb-10">
                      <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Operasyonel Veriler</h4>
                      <button 
                        onClick={() => setActiveStrategicDetail(null)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                      >
                        <X className="w-6 h-6 text-slate-400" />
                      </button>
                   </div>
                   
                   <div className="space-y-6 mb-12">
                      {strategicDetailData[activeStrategicDetail].stats.map((stat, i) => (
                        <div key={i} className="group p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                           <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-slate-300">{stat.label}</span>
                              <span className="text-2xl font-black text-blue-400">{stat.val}</span>
                           </div>
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.detail}</div>
                        </div>
                      ))}
                   </div>

                   <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-6">Öne Çıkan Başlıklar</h4>
                   <div className="grid grid-cols-1 gap-3">
                      {strategicDetailData[activeStrategicDetail].highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                           {h}
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-12 py-6 bg-slate-800/50 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Strateji Onaylı Veri</span>
                 </div>
                 <button 
                   onClick={() => setActiveStrategicDetail(null)}
                   className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                 >
                   Anladım
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bize Katılın Interaction Modal */}
      <AnimatePresence>
        {showJoinForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowJoinForm(false);
                setJoinSuccess(false);
              }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-xl bg-white rounded-[48px] shadow-2xl overflow-hidden p-10 md:p-14"
            >
              <button 
                onClick={() => {
                  setShowJoinForm(false);
                  setJoinSuccess(false);
                }}
                className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {!joinSuccess ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-10 h-10 text-blue-600 fill-blue-600/20" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Ekosisteme Katılın</h3>
                    <p className="text-slate-500 font-bold mt-2">THY Gelecek Vizyonunda Rol Almak İçin İletişime Geçin</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">İsim Soyisim / Kurum Adı</label>
                      <input 
                        type="text" 
                        placeholder="Zeyneb Türkmen"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">E-Posta Adresi</label>
                      <input 
                        type="email" 
                        placeholder="iletisim@thy.com"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">İş Birliği Alanı</label>
                      <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-900">
                        <option>Yatırım ve Finans</option>
                        <option>Teknoloji Ortaklağı</option>
                        <option>Sürdürülebilirlik (SAF)</option>
                        <option>Tedarik Zinciri</option>
                        <option>Diğer</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={() => setJoinSuccess(true)}
                    className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    Başvuruyu Tamamla <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 space-y-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">İş Birliği Talebiniz Alındı</h3>
                    <p className="text-slate-500 font-bold mt-4 leading-relaxed">
                      Değerli Zeyneb Türkmen, THY ekosistemine gösterdiğiniz ilgi için teşekkür ederiz. 
                      Strateji ekibimiz talebinizi inceleyip en kısa sürede dönüş yapacaktır.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Takip Numarası</div>
                     <div className="text-xl font-black font-mono text-blue-600">THY-2033-9921</div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowJoinForm(false);
                      setJoinSuccess(false);
                    }}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all"
                  >
                    Kapat
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Performance Archive Modal */}
      <AnimatePresence>
        {showPerformanceArchive && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPerformanceArchive(false)}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-10 overflow-y-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowPerformanceArchive(false)}
                      className="group flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-2xl transition-all font-bold text-sm text-slate-600 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Geri Dön
                    </button>
                    <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-slate-900" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 leading-none">Kaynak ve <span className="text-blue-600">Performans</span></h3>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mt-1">Stratejik Veri Arşivi & Doğrulama</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowPerformanceArchive(false)} className="p-3 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-4 gap-4 p-4 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="col-span-1">Metrik</div>
                      <div className="text-center">2023</div>
                      <div className="text-center">2026</div>
                      <div className="text-right">Büyüme</div>
                    </div>

                    {financialData.map((data, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative grid grid-cols-4 gap-4 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl transition-all"
                      >
                        <div className="col-span-1 flex flex-col">
                          <span className="font-black text-slate-900">{data.metric}</span>
                          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter mt-1">{data.source}</span>
                        </div>
                        <div className="text-center flex flex-col justify-center">
                          <span className="font-bold text-slate-400">{data.val2023}{data.suffix}</span>
                        </div>
                        <div className="text-center flex flex-col justify-center">
                          <span className="font-black text-blue-700">{data.val2026}{data.suffix}</span>
                        </div>
                        <div className="text-right font-black text-emerald-600 flex items-center justify-end gap-1">
                          <ArrowUpRight className="w-4 h-4" />
                          {Math.round(((data.val2026 - data.val2023) / data.val2023) * 100)}%
                        </div>
                        
                        {/* Hover Tooltip for Source Detail */}
                        <div className="absolute inset-0 bg-blue-600/95 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center p-6 z-20 pointer-events-none group-hover:pointer-events-auto">
                           <div className="text-center">
                             <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Veri Kaynağı Detayı</div>
                             <p className="text-white text-xs font-bold leading-relaxed">{data.sourceDetail}</p>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck className="w-16 h-16" />
                      </div>
                      <h4 className="text-lg font-black mb-4 relative z-10 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-400" /> Veri Doğruluğu
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                        Sunulan tüm operasyonel veriler, THY Kamu Aydınlatma Platformu (KAP) açıklamaları ve resmi yatırımcı sunumları ile %100 uyumludur.
                      </p>
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Bağımsız Denetimden Geçmiş
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> IFRS Standartları
                         </div>
                      </div>
                    </div>

                    <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100">
                      <h4 className="text-slate-900 font-black mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" /> Projeksiyon Metodu
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-bold">
                        2026 tahminleri, mevcut pazar trendleri ve THY stratejik planlama departmanının yayınladığı resmi hedefler doğrultusunda matematiksel modellerle oluşturulmuştur.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <img src="https://picsum.photos/seed/analyst/40/40" alt="Analyst" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <div className="text-xs font-black text-slate-900">Zeyneb Türkmen - Strateji Uzmanı</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Veri Doğrulama Masası</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowPerformanceArchive(false)}
                      className="px-8 py-3 bg-slate-100 text-slate-900 rounded-2xl font-black hover:bg-slate-200 transition-all text-sm"
                    >
                      Kapat
                    </button>
                    <button 
                      onClick={() => simulateDownload('investor')}
                      className="px-8 py-3 bg-blue-700 text-white rounded-2xl font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" /> Veri Setini İndir
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vision Goal Details Modal */}
      <AnimatePresence>
        {activeGoal !== null && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveGoal(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-3xl bg-white rounded-[48px] shadow-2xl overflow-hidden"
            >
              <div className="p-10 md:p-14">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setActiveGoal(null)}
                      className="group flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-2xl transition-all font-bold text-sm text-slate-600 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Geri Dön
                    </button>
                    <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
                    <div className="flex items-center gap-6">
                      <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center bg-slate-50 shadow-inner", visionGoals[activeGoal].color)}>
                        {visionGoals[activeGoal].icon}
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{visionGoals[activeGoal].title}</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Stratejik İnceleme & 2033 Projeksiyonu</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveGoal(null)} className="p-4 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
                    <p className="text-lg text-slate-700 font-medium leading-relaxed relative z-10">
                      {visionGoals[activeGoal].longDesc}
                    </p>
                  </div>

                  {/* Comments Section */}
                  <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2 flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Paydaş Görüşleri
                      </h5>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {comments[activeGoal]?.length || 0} Yorum
                      </span>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="relative">
                        <textarea 
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Bu hedefle ilgili görüşünüzü paylaşın..."
                          className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium min-h-[100px] resize-none"
                        />
                        <button 
                          disabled={isPostingComment || !commentInput.trim()}
                          onClick={handlePostComment}
                          className="absolute bottom-4 right-4 px-6 py-2 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                          {isPostingComment ? "Gönderiliyor..." : "Paylaş"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                      <AnimatePresence mode="popLayout">
                        {(comments[activeGoal] || []).map((c) => (
                          <motion.div 
                            key={c.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-5 bg-slate-50/50 border border-slate-100 rounded-3xl"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{c.user}</span>
                              <span className="text-[10px] font-bold text-slate-400">{c.date}</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{c.text}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {!(comments[activeGoal]?.length) && (
                        <div className="text-center py-10">
                           <p className="text-sm text-slate-400 font-medium italic">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-2">Kritik Başarı Faktörleri</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visionGoals[activeGoal].subMetrics?.map((metric, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 p-5 bg-white border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{metric}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                          <img src={`https://picsum.photos/seed/vision-${i}/32/32`} alt="Expert" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uzman Analiz Ekibi</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveGoal(null)}
                      className="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black hover:bg-slate-200 transition-all"
                    >
                      Kapat
                    </button>
                    <button 
                      onClick={() => {
                        simulateDownload('vision');
                        setActiveGoal(null);
                      }}
                      className="px-8 py-4 bg-blue-700 text-white rounded-2xl font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-500/20"
                    >
                      Raporu İndir
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stakeholder Explorer Modal */}
      <AnimatePresence>
        {showStakeholders && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowStakeholders(false);
                setSelectedStakeholder(null);
              }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[48px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setShowStakeholders(false);
                        setSelectedStakeholder(null);
                      }}
                      className="group flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-2xl transition-all font-bold text-sm text-slate-600"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Ana Sayfaya Dön
                    </button>
                    <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Paydaş <span className="text-blue-600">Ekosistemi</span></h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setShowStakeholders(false);
                      setSelectedStakeholder(null);
                    }}
                    className="p-3 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all self-end md:self-auto"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <LayoutGroup>
                    {stakeholderGroups.map((group, idx) => {
                      const isExpanded = selectedStakeholder === idx;
                      
                      return (
                        <motion.div
                          key={idx}
                          layout="position"
                          layoutId={`stakeholder-${idx}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            layout: { duration: 0.6, type: "spring", bounce: 0.2 },
                            opacity: { duration: 0.3 }
                          }}
                          whileHover={!isExpanded ? { y: -5, scale: 1.02 } : {}}
                          onClick={() => {
                            setSelectedStakeholder(isExpanded ? null : idx);
                            if (isExpanded) setShowDetailedReport(null);
                          }}
                          className={cn(
                            "relative p-6 rounded-[32px] border transition-all cursor-pointer overflow-hidden",
                            isExpanded 
                              ? "col-span-full bg-blue-50 border-blue-200 shadow-inner" 
                              : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:border-blue-100"
                          )}
                        >
                          <motion.div layout className="flex items-start justify-between relative z-10">
                            <motion.div layout className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                              isExpanded ? "bg-blue-600 text-white" : "bg-white shadow-sm"
                            )}>
                              {group.icon}
                            </motion.div>
                            <motion.div layout className="text-right">
                              <span className={cn(
                                "font-black text-sm",
                                isExpanded ? "text-blue-600" : "text-slate-400"
                              )}>{group.count}</span>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="text-[10px] font-black uppercase tracking-widest text-blue-400 mt-1"
                                >
                                  {group.impact}
                                </motion.div>
                              )}
                            </motion.div>
                          </motion.div>
                          
                          <motion.div layout className="mt-6 relative z-10">
                            <motion.h4 layout className="text-lg font-black text-slate-900 leading-tight mb-2">{group.title}</motion.h4>
                            <motion.p layout className="text-slate-500 text-xs leading-relaxed font-medium mb-4">
                              {group.desc}
                            </motion.p>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0, y: 10 }}
                                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                                  exit={{ opacity: 0, height: 0, y: 10 }}
                                  transition={{ duration: 0.4 }}
                                  className="space-y-3 pt-4 border-t border-blue-200/50"
                                >
                                   {group.details.map((detail, dIdx) => (
                                    <div key={dIdx} className="flex items-center gap-2">
                                      <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                      <span className="text-[11px] font-bold text-slate-700">{detail}</span>
                                    </div>
                                  ))}
  
                                  {/* Brand Logos Section */}
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-8 pt-6 border-t border-blue-200/50"
                                  >
                                     <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Paydaş Markalar & Kuruluşlar</h5>
                                     <div className="flex flex-wrap gap-4">
                                        {(group as any).brands?.map((brand: string, bIdx: number) => (
                                          <div 
                                            key={bIdx}
                                            className="px-4 py-2 bg-white rounded-xl border border-blue-100 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow group/brand"
                                          >
                                            <span className="text-[10px] font-black text-slate-900 group-hover/brand:text-blue-600 transition-colors uppercase tracking-wider">{brand}</span>
                                          </div>
                                        ))}
                                     </div>
                                  </motion.div>
                                  
                                  <div className="mt-6 flex justify-end">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDetailedReport(idx);
                                        setTimeout(() => {
                                          reportRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                      }}
                                      className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 hover:gap-2 transition-all bg-white px-4 py-2 rounded-full border border-blue-100 shadow-sm"
                                    >
                                      Detaylı Raporu Görüntüle <ChevronRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          
                          {!isExpanded && (
                            <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </LayoutGroup>
                </div>

                <AnimatePresence>
                  {showDetailedReport !== null && (
                    <motion.div 
                      ref={reportRef}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className="mt-12 pt-12 border-t border-slate-100"
                    >
                      <div className="bg-slate-900 rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                          <BarChart3 className="w-64 h-64 rotate-12" />
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-8">
                             <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
                               {stakeholderGroups[showDetailedReport].icon}
                             </div>
                             <div>
                               <h4 className="text-3xl font-black tracking-tighter">
                                 {stakeholderGroups[showDetailedReport].title} <span className="text-blue-500">Stratejik Analiz</span>
                               </h4>
                               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Paydaş Değer Raporu 2026-2033</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                             {[
                               { label: 'Vizyon Katkısı', val: '%94', icon: <TrendingUp className="w-4 h-4" /> },
                               { label: 'Memnuniyet Skoru', val: '4.8/5', icon: <Heart className="w-4 h-4" /> },
                               { label: 'Büyüme Endeksi', val: '+%12', icon: <ArrowUpRight className="w-4 h-4" /> }
                             ].map((stat, sidx) => (
                               <div key={sidx} className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                                 <div className="flex items-center gap-3 mb-4 text-blue-400">
                                   {stat.icon}
                                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                                 </div>
                                 <div className="text-3xl font-black">{stat.val}</div>
                               </div>
                             ))}
                          </div>

                          <div className="bg-white/5 rounded-[32px] border border-white/10 p-8">
                             <div className="flex items-center justify-between mb-8">
                               <h5 className="font-black text-xl italic text-blue-400">Operasyonel Projeksiyon</h5>
                               <button className="px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Raporu İndir (.pdf)</button>
                             </div>

                             <div className="space-y-6">
                                {[
                                  "Küresel ağ entegrasyonu ve ölçeklenebilirlik analitiği.",
                                  "Sürdürülebilirlik hedeflerine uyum ve karbon ayak izi azaltım grafiği.",
                                  "Dijital dönüşüm hızı ve personel eğitim metrikleri."
                                ].map((item, iidx) => (
                                  <div key={iidx} className="flex gap-4 items-start group/report">
                                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center shrink-0 group-hover/report:bg-blue-600 transition-colors">
                                      <span className="text-[10px] font-black">{iidx + 1}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 font-medium leading-relaxed">{item}</p>
                                  </div>
                                ))}
                             </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!selectedStakeholder && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 p-8 bg-slate-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                        <Heart className="w-8 h-8 fill-blue-500 text-blue-500" />
                      </div>
                      <div>
                        <h5 className="text-xl font-black italic">Ortak Gelecek Küresel Değer</h5>
                        <p className="text-sm text-slate-400 font-medium">800'den fazla iş ortağımızla dünya çapında 128 ülkede sürdürülebilir bir eko-sistem inşa ediyoruz.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowJoinForm(true)}
                      className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 whitespace-nowrap"
                    >
                      Bize Katılın
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Document Modal */}
      <AnimatePresence>
        {activeDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDoc(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto"
            >
              {/* Sidebar/Cover */}
              <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Plane className="w-32 h-32 rotate-12" />
                </div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                    {activeDoc === 'vision' ? <Zap className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                  </div>
                  <h3 className="text-3xl font-black leading-tight mb-2">
                    {activeDoc === 'vision' ? 'Vizyon 2033' : 'Yatırımcı'} <br />
                    <span className="text-blue-500">{activeDoc === 'vision' ? 'Strateji Raporu' : 'Özet Sunumu'}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">
                    <Calendar className="w-3 h-3" /> Nisan 2026
                  </div>
                </div>

                <div className="mt-8 md:mt-0 relative z-10">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                      <ShieldCheck className="w-3 h-3" /> Gizlilik Derecesi: Yüksek
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Bu döküman Türk Hava Yolları A.O. Strateji ve Yatırım Birimi tarafından hazırlanmıştır.</p>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-white p-8 md:p-12 overflow-y-auto">
                <button 
                  onClick={() => setActiveDoc(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>

                {downloadProgress < 100 ? (
                  <div className="h-full flex flex-col items-center justify-center py-12">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full mb-6"
                    />
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Döküman Hazırlanıyor</h4>
                    <p className="text-slate-500 text-sm mb-8">Etkileşimli veriler optimize ediliyor... %{Math.floor(downloadProgress)}</p>
                    <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: `${downloadProgress}%` }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">İçerik Özeti</h4>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Döküman Hazır</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="group cursor-pointer p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Target className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{activeDoc === 'vision' ? 'Stratejik Yol Haritası' : 'Finansal Projeksiyonlar'}</div>
                              <div className="text-xs text-slate-500">2026 - 2033 On Yıllık Plan</div>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                        </div>
                      </div>

                      <div className="group cursor-pointer p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Globe className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">Operasyonel Kapasite</div>
                              <div className="text-xs text-slate-500">Filo ve Destinasyon Hedefleri</div>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                      <button 
                        onClick={() => {
                          // Real download implementation using Blob
                          const docName = activeDoc === 'vision' ? 'THY_Vision_2033_Strategic_Report.pdf' : 'THY_Investor_Relations_2026_Summary.pdf';
                          const content = `TURKISH AIRLINES - ${activeDoc === 'vision' ? 'VISION 2033' : 'INVESTOR RELATIONS'}\n\nGenerated on: ${new Date().toLocaleDateString()}\n\nThis is a secure interactive strategy document summary.\n\nKey Strategic Pillars:\n- 800+ Aircraft Fleet\n- $50B Annual Revenue\n- Carbon Neutrality Focus\n- Global Leadership across 128 countries.`;
                          
                          const blob = new Blob([content], { type: 'application/pdf' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = docName;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);

                          alert(`Döküman başarıyla oluşturuldu: ${docName}`);
                          setActiveDoc(null);
                        }}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-5 h-5" /> Tüm Dökümanı İndir (PDF)
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-[0.2em] font-medium">Bu dosya 4.2 MB boyutundadır.</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchResult(null);
                setSearchQuery("");
              }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8 bg-slate-100 p-4 rounded-3xl border border-slate-200">
                  <Globe className="w-6 h-6 text-blue-600 animate-pulse" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                    placeholder={t('search.placeholder')}
                    className="flex-1 bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-400"
                    autoFocus
                  />
                  <button 
                    onClick={handleAISearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {isSearching ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles className="w-5 h-5" /></motion.div> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>

                <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
                  {isSearching ? (
                    <div className="space-y-4">
                       <div className="flex justify-center gap-2">
                         {[0, 1, 2].map(i => (
                           <motion.div 
                             key={i}
                             animate={{ y: [0, -10, 0] }}
                             transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                             className="w-3 h-3 bg-blue-400 rounded-full"
                           />
                         ))}
                       </div>
                       <p className="text-slate-500 font-bold text-sm">{t('search.analyzing')}</p>
                    </div>
                  ) : searchResult ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-left space-y-6 w-full"
                    >
                      <div className={cn(
                        "p-6 rounded-3xl border italic font-medium relative",
                        searchResult.isError 
                          ? "bg-rose-50 border-rose-100 text-rose-700" 
                          : "bg-blue-50 border-blue-100 text-slate-700"
                      )}>
                        <div className={cn(
                          "absolute -top-3 -left-3 p-2 rounded-xl text-white",
                          searchResult.isError ? "bg-rose-600" : "bg-blue-600"
                        )}>
                          {searchResult.isError ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        </div>
                        {searchResult.answer}
                      </div>

                      {searchResult.relatedSection && (
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Plane className="w-5 h-5 text-blue-600" />
                             </div>
                             <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('search.related')}</span>
                                <span className="text-xs font-bold text-slate-900">{searchResult.relatedSection.replace(/-/g, ' ').toUpperCase()}</span>
                             </div>
                          </div>
                          <button 
                            onClick={() => {
                              scrollToId(searchResult.relatedSection!);
                              setIsSearchOpen(false);
                            }}
                            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                          >
                            {t('search.go')} <ChevronRight className="w-3 h-3 ml-1" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                       <div className="p-6 bg-slate-50 rounded-full">
                          <Globe className="w-12 h-12 text-slate-300" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-slate-900 font-black tracking-tight">Akıllı Vizyon Arama</p>
                          <p className="text-slate-500 font-medium text-sm">Finansal veriler, hedefler ve global operasyon hakkında sorularınızı sorun.</p>
                       </div>
                       
                       <div className="flex flex-wrap justify-center gap-2 pt-4">
                          {['2033 gelir hedefi ne?', 'SAF nedir?', 'Avrupa büyümesi nasıl?'].map(sample => (
                            <button 
                              key={sample}
                              onClick={() => {
                                setSearchQuery(sample);
                              }}
                              className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all"
                            >
                              "{sample}"
                            </button>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t('search.engine')}</p>
                <X 
                  onClick={() => setIsSearchOpen(false)}
                  className="w-5 h-5 text-slate-400 cursor-pointer hover:text-red-500 transition-colors" 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeedbackModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Geri Bildirim</h2>
                      <p className="text-slate-500 font-medium tracking-tight">Deneyiminizi geliştirmemize yardımcı olun.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowFeedbackModal(false)}
                    className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
                  >
                    <X className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                {feedbackStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Teşekkürler!</h3>
                    <p className="text-slate-500 font-medium mb-8">Geri bildiriminiz başarıyla kaydedildi. Görüşleriniz vizyonumuz için çok değerli.</p>
                    <button 
                      onClick={() => setShowFeedbackModal(false)}
                      className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all"
                    >
                      Kapat
                    </button>
                  </motion.div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFeedbackStatus('submitting');
                      setTimeout(() => setFeedbackStatus('success'), 1500);
                    }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Konu</label>
                      <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-700 appearance-none cursor-pointer">
                        <option>Genel Deneyim</option>
                        <option>Hata Bildirimi</option>
                        <option>Öneri / İstek</option>
                        <option>Veri Doğruluğu</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mesajınız</label>
                       <textarea 
                        required
                        placeholder="Görüşlerinizi buraya yazın..."
                        className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-700 resize-none"
                       />
                    </div>

                    <button 
                      disabled={feedbackStatus === 'submitting'}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:bg-slate-300"
                    >
                      {feedbackStatus === 'submitting' ? 'Göndermek üzere...' : 'Geri Bildirimi Gönder'}
                    </button>
                  </form>
                )}
              </div>
              
              <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Anonim Gönderi</span>
                </div>
                <Globe className="w-5 h-5 text-slate-300" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
