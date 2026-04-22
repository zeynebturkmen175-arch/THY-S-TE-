import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Calendar, Star, Plane, Globe, Award, TrendingUp, Target, X, FileText, ExternalLink, History, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Local utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const milestones = [
  {
    year: '1933',
    title: 'Gökyüzündeki İlk Adımlar',
    desc: '5 uçaklık mütevazı bir filo ve 24 personel ile Devlet Hava Yolları İşletmesi olarak kuruldu.',
    icon: <Plane className="w-5 h-5" />,
    details: 'Milli Savunma Bakanlığı bünyesinde kurulan kurumumuz, Türkiye\'nin sivil havacılık serüvenini başlattı. İlk filoda 2 adet King Bird, 2 adet Junkers F-13 ve 1 adet ATH-9 bulunuyordu.',
    archiveDocs: ['1933 Telsiz Telgraf Kanunnamesi', 'İlk Filo Envanter Kayıtları', 'Milli Savunma Bakanlığı Teşkilat Şeması', 'Kuruluş Kararnamesi (Tashihli)', 'İlk Personel Özlük Dosyaları Örneği'],
    source: 'Havacılık Tarihi Araştırmaları Merkezi'
  },
  {
    year: '1947',
    title: 'Sınırları Aşan Vizyon',
    desc: 'İlk dış hat seferi Ankara-İstanbul-Atina güzergahında gerçekleştirildi.',
    icon: <Globe className="w-5 h-5" />,
    details: 'Yurt dışına açılan kanatlarımız, Türkiye\'yi dünyaya bağlayan ilk köprüyü kurdu. Atina uçuşu, küresel bir marka olma hedefimizin ilk somut adımıydı.',
    archiveDocs: ['İlk Dış Hat Bilet Koçanı (No: 001)', 'Uçuş Seyir Defteri Kayıtları', 'Atina Seferi Teknik Uçuş Planı (Flight Plan)', 'Dönemin Atina Elçiliği Yazışmaları', 'İlk Dış Hat Yolcu Manifestosu'],
    source: 'THY Müze Arşivi'
  },
  {
    year: '1955',
    title: 'Türk Hava Yolları Doğuyor',
    desc: 'Bugünkü Türk Hava Yolları A.O. markası resmi olarak tescil edildi.',
    icon: <Star className="w-5 h-5" />,
    details: 'Yeniden yapılanma süreciyle birlikte bugün gururla taşıdığımız "Türk Hava Yolları" ismi hayatımıza girdi ve modern havacılık standartlarına geçiş hızlandı.',
    archiveDocs: ['Marka Tescil Belgesi (1955)', 'İlk THY Logosu Tasarım Eskizleri', 'Resmi Gazete Kuruluş İlanı', 'Devlet Hava Yolları\'ndan THY\'ye Devir Protokolü', 'İlk THY Ana Sözleşmesi'],
    source: 'Ticaret Sicil Gazetesi Arşivi'
  },
  {
    year: '1985',
    title: 'Uzun Menzilli Dönem',
    desc: 'İlk Airbus A310 uçakları filoya katıldı, kıtalararası uçuşlar başladı.',
    icon: <TrendingUp className="w-5 h-5" />,
    details: 'Singapur ve New York gibi uzak menzilli hatların açılmasıyla THY, küresel bir oyuncu haline geldi. Teknoloji ve konforda yeni standartlar belirlendi.',
    archiveDocs: ['İlk Airbus A310 Teslimat Sertifikası', 'New York Hattı Açılış Broşürü', 'Uçuş İçi Servis Menüsü (1985)', 'Kıtalararası Uçuş Güvenlik Prosedürleri', 'A310 Pilot Teknik Eğitim El Kitabı'],
    source: 'Airbus Tarihsel Arşivi'
  },
  {
    year: '2003',
    title: 'Küresel Şahlanış',
    desc: 'Büyük dönüşüm ve büyüme stratejisi başlatıldı, hizmet kalitesi odak noktası oldu.',
    icon: <Award className="w-5 h-5" />,
    details: 'Rekabetçi stratejiler, yeni nesil uçak siparişleri ve "Dünya Daha Büyük, Keşfet" felsefesiyle yolcu sayımızda ve uçuş ağımızda rekor artışlar yaşandı.',
    archiveDocs: ['2003 Stratejik Plan Belgesi', 'Global Reklam Kampanyası Görselleri', 'Bölgesel Hub Analizi Raporu', 'Maliyet Optimizasyonu Uygulama Rehberi', 'Yolcu Deneyimi Standartları Kitapçığı'],
    source: 'THY Strateji ve Yatırımcı İlişkileri'
  },
  {
    year: '2013',
    title: 'Dünyanın Zirvesinde',
    desc: '200. uçak filoya katıldı ve dünyanın en çok noktasına uçan hava yolu olduk.',
    icon: <Target className="w-5 h-5" />,
    details: 'Avrupa\'nın en iyi hava yolu ödülleri üst üste kazanılmaya başlandı. İstanbul, küresel havacılığın merkezi (hub) konumuna yükseldi.',
    archiveDocs: ['Skytrax 5 Yıldızlı Havayolu Başarı Belgesi', '200. Uçak Özel Boyama Planı', 'Küresel Destinasyon Haritası', 'İstanbul Hub Kapasite Artış Analizi', 'Uçuş Ağı Genişleme Stratejisi (2013-2023)'],
    source: 'Skytrax Havacılık Verileri'
  },
  {
    year: '2023',
    title: 'Yüz Yıllık Miras',
    desc: 'Cumhuriyet\'in 100. yılında 400. uçağımız filoya katıldı ve 2033 vizyonu açıklandı.',
    icon: <Calendar className="w-5 h-5" />,
    details: 'Güçlü finansal yapımız ve sürdürülebilirlik hedeflerimizle havacılık tarihine damga vurduğumuz bir yıl. 2033 vizyonu ile gelecek on yılın rotası çizildi.',
    archiveDocs: ['2033 Stratejik Vizyon Belgesi (Tam Metin)', '100. Yıl Özel Operasyon Raporu', '400. Uçak (TC-LGRP) Kabul Belgesi', 'Sürdürülebilirlik Raporu 2023', 'Dijital Dönüşüm Yol Haritası (Faz 1)'],
    source: 'Türk Hava Yolları Kurumsal İletişim'
  },
  {
    year: '2033',
    title: 'Dijital ve Sürdürülebilir Gelecek',
    desc: '800+ uçaklık filo, 50 milyar $ gelir ve karbon nötr hedeflerine doğru.',
    icon: <Star className="w-6 h-6 text-amber-500" />,
    details: 'Dünyanın en değerli 3 hava yolu markasından biri olma hedefi. Yeni nesil havacılık teknolojileri, dijitalleşme ve SAF kullanımıyla havacılığın geleceğini biz tasarlıyoruz.',
    archiveDocs: ['Sıfır Emisyon Yol Haritası', 'Dijital Yolculuk 4.0 Planı', 'Ekosistem Genişleme Projeksiyonları', '50 Milyar $ Gelir Simülasyon Verileri', '800 Uçaklık Filo Dağılım Modeli'],
    source: 'THY Sürdürülebilirlik ve İnovasyon Kurulu'
  }
];

export const Timeline: React.FC = () => {
  const milestonesList = milestones || [];
  const [activeYear, setActiveYear] = useState<string>(milestonesList.length > 0 ? milestonesList[milestonesList.length - 1].year : "");
  const [showArchive, setShowArchive] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const activeMilestone = milestonesList.find(m => m.year === activeYear) || milestonesList[0] || (milestonesList.length > 0 ? milestonesList[milestonesList.length - 1] : null);

  const handleArchiveDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      
      const content = `Türk Hava Yolları Tarihsel Arşiv - ${activeMilestone.year}\n` +
        `Olay: ${activeMilestone.title}\n` +
        `Dökümanlar: ${activeMilestone.archiveDocs.join(', ')}\n` +
        `Kaynak: ${activeMilestone.source}\n\n` +
        `Sertifikalı Arşiv Kaydıdır.`;
        
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `THY_ARSIV_${activeMilestone.year}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  if (!milestonesList || milestonesList.length === 0 || !activeMilestone) return null;

  return (
    <section id="zaman-tuneli" className="py-24 bg-slate-900 text-white overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          
          {/* Left: Interactive Years */}
          <div className="w-full md:w-1/3 border-r border-slate-800 pr-8">
            <h2 className="text-3xl font-black mb-12 flex items-center gap-3">
              <Calendar className="text-blue-500" />
              Yolculuk <span className="text-blue-500">Hattı</span>
            </h2>
            
            <div className="space-y-4 relative">
              {/* Vertical Line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-800 ml-4 hidden md:block" />
              
              {Array.isArray(milestones) && milestones.map((m) => (
                <button
                  key={m.year}
                  onClick={() => setActiveYear(m.year)}
                  className={cn(
                    "relative flex items-center gap-6 w-full text-left py-3 transition-all group",
                    activeYear === m.year ? "opacity-100" : "opacity-40 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors",
                    activeYear === m.year ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-slate-800"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      activeYear === m.year ? "bg-white" : "bg-slate-600"
                    )} />
                  </div>
                  <div>
                    <span className={cn(
                      "text-2xl font-black transition-colors",
                      activeYear === m.year ? "text-white" : "text-slate-500"
                    )}>
                      {m.year}
                    </span >
                    {activeYear === m.year && (
                      <motion.p 
                        layoutId="timeline-title"
                        className="text-xs font-bold text-blue-400 mt-1 uppercase tracking-widest"
                      >
                        {m.title}
                      </motion.p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Content Display */}
          <div className="w-full md:w-2/3 min-h-[400px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative bg-slate-800/50 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
              >
                {/* Background Year Decal */}
                <div className="absolute -top-10 -right-10 text-[180px] font-black text-white/[0.03] select-none pointer-events-none leading-none">
                  {activeMilestone.year}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/30">
                    {activeMilestone.icon}
                  </div>
                  
                  <h3 className="text-4xl font-black mb-4 leading-tight">
                    {activeMilestone.year}: {activeMilestone.title}
                  </h3>
                  
                  <p className="text-xl text-slate-300 mb-8 leading-relaxed italic">
                    {activeMilestone.desc}
                  </p>
                  
                  <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Kilometre Taşı Detayları</h5>
                    <p className="text-slate-400 leading-relaxed font-medium">
                      {activeMilestone.details}
                    </p>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <button 
                      onClick={() => setShowArchive(true)}
                      className="group flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40"
                    >
                      <History className="w-4 h-4" />
                      Arşivi Görüntüle
                    </button>
                    <button 
                      onClick={() => setShowArchive(true)}
                      className="group flex items-center gap-2 px-6 py-2.5 bg-slate-700/50 text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-white/5"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      Kaynak
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {showArchive && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowArchive(false)}
                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
                  />
                  
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    className="relative w-full max-w-4xl bg-white text-slate-900 rounded-[48px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                  >
                    <div className="p-10 md:p-14 overflow-y-auto">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setShowArchive(false)}
                            className="group flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-2xl transition-all font-bold text-sm text-slate-600 shadow-sm"
                          >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Geri Dön
                          </button>
                          <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
                          <div>
                            <h3 className="text-4xl font-black tracking-tighter leading-none">{activeMilestone.year} <span className="text-blue-600 italic">Arşivi</span></h3>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Stratejik Kaynak ve Tarihsel Dökümasyon</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowArchive(false)}
                          className="p-4 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                          <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                             <div className="flex items-center gap-3 mb-6">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                                 {activeMilestone.icon}
                               </div>
                               <div>
                                 <h4 className="text-xl font-black">{activeMilestone.title}</h4>
                                 <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Olay Özeti</p>
                               </div>
                             </div>
                             <p className="text-slate-600 font-medium leading-relaxed">
                               {activeMilestone.details}
                             </p>
                          </div>

                          <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">Arşivdeki Kayıtlı Dökümanlar</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-900">
                              {(activeMilestone as any).archiveDocs?.map((doc: string, i: number) => (
                                <motion.div 
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center gap-3 p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer group"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-black leading-tight">{doc}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="p-8 bg-slate-900 rounded-[40px] text-white">
                             <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                               <ExternalLink className="w-5 h-5 text-blue-400" /> Kaynak Bilgisi
                             </h4>
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
                               <p className="text-sm font-bold text-blue-300">{(activeMilestone as any).source}</p>
                             </div>
                             <p className="text-xs text-slate-400 leading-relaxed font-medium">
                               Bu kilometre taşına ait tüm bilgiler, belirtilen resmi kaynaklar ve THY Kurumsal Hafıza birimi tarafından doğrulanmış dökümanlara dayanmaktadır.
                             </p>
                          </div>

                          <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100">
                             <h4 className="text-slate-900 font-black mb-4 flex items-center gap-2 leading-tight">
                               <History className="w-5 h-5 text-blue-600" /> Tarihsel Kanıt
                             </h4>
                             <p className="text-[11px] text-slate-600 font-bold leading-relaxed mb-6">
                               Belgelerin aslı THY Genel Müdürlük binasındaki Kurumsal Müze bünyesinde dijital ve fiziksel olarak muhafaza edilmektedir.
                             </p>
                             <button 
                               onClick={handleArchiveDownload}
                               disabled={isDownloading}
                               className={cn(
                                 "w-full py-4 rounded-2xl font-black text-white transition-all text-xs flex items-center justify-center gap-2 shadow-xl",
                                 isDownloading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                               )}
                             >
                               {isDownloading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                               ARŞİVİ PDF İNDİR
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Decorative elements */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]" />
          </div>
        </div>
      </div>
    </section>
  );
};
