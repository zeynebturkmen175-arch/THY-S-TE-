import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp } from 'lucide-react';

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

interface HubInfo {
  name: string;
  coordinates: [number, number];
  isBase?: boolean;
  details: string;
  stats: string;
}

const hubs: HubInfo[] = [
  { 
    name: "İstanbul", 
    coordinates: [28.9784, 41.0082], 
    isBase: true,
    details: "Ana Operasyon Merkezi (İGA)",
    stats: "300+ Destinasyon"
  },
  { 
    name: "New York", 
    coordinates: [-74.0060, 40.7128],
    details: "Kuzey Amerika Ana Geçidi",
    stats: "Günde 3 Sefer"
  },
  { 
    name: "Londra", 
    coordinates: [-0.1276, 51.5074],
    details: "Avrupa Finans Merkezi Bağlantısı",
    stats: "Haftalık 40+ Uçuş"
  },
  { 
    name: "Tokyo", 
    coordinates: [139.6917, 35.6895],
    details: "Uzak Doğu Stratejik Hub",
    stats: "Günlük Kesintisiz Servis"
  },
  { 
    name: "Dubai", 
    coordinates: [55.2708, 25.2048],
    details: "Orta Doğu Aktarma Noktası",
    stats: "Geniş Gövdeli Filo"
  },
  { 
    name: "Sao Paulo", 
    coordinates: [-46.6333, -23.5505],
    details: "Güney Amerika Operasyon Üssü",
    stats: "Bölgesel Liderlik"
  },
];

const MotionMarker = motion(Marker);

export const FlightMap = () => {
  const [hoveredItem, setHoveredItem] = useState<{ type: 'hub' | 'route' | 'region', name: string, x: number, y: number, data: any } | null>(null);
  
  const base = (hubs && hubs.length > 0) ? (hubs.find(h => h.isBase) || hubs[0]) : null;
  const destinations = (hubs && base) ? hubs.filter(h => h !== base) : [];

  const handleMouseMove = (e: React.MouseEvent, type: 'hub' | 'route' | 'region', name: string, data: any) => {
    if (!data || !e) return;
    setHoveredItem({
      type,
      name,
      x: e.clientX,
      y: e.clientY,
      data
    });
  };

  if (!hubs || hubs.length === 0 || !base) return null;

  return (
    <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden relative group shadow-2xl">
      {/* Dynamic Status Header */}
      <div className="absolute top-6 left-6 z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/80 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-tighter">İGA Global Hub</h4>
          </div>
          <div className="space-y-1">
             <div className="flex justify-between gap-8">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aktif Uçuş</span>
                <span className="text-[10px] font-black text-blue-400">1,240+</span>
             </div>
             <div className="flex justify-between gap-8">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Doluluk</span>
                <span className="text-[10px] font-black text-emerald-400">%84.2</span>
             </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {hoveredItem && hoveredItem.data && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ 
              position: 'fixed', 
              left: hoveredItem.x + 20, 
              top: hoveredItem.y - 60,
              zIndex: 100 
            }}
            className="pointer-events-none bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 p-5 rounded-2xl shadow-2xl min-w-[220px]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${hoveredItem.type === 'hub' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
                <span className="text-white font-black text-base tracking-tighter">{hoveredItem.name}</span>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-500" />
            </div>

            {hoveredItem.type === 'route' && (
              <div className="bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md mb-3">
                <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] text-center">
                  Rota: IST ✈︎ {hoveredItem.data.name}
                </p>
              </div>
            )}

            <div className="space-y-2">
               <p className="text-slate-400 text-xs font-medium leading-normal">{hoveredItem.data.details}</p>
               <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Operasyon</span>
                    <span className="text-[10px] text-white font-bold">{hoveredItem.data.stats}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Maliyet Ver.</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Lider</span>
                  </div>
               </div>
            </div>

            {/* Path glow in tooltip */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl -z-10 opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
          center: [20, 15]
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            Array.isArray(geographies) && geographies.map((geo) => (
              <Geography
                key={geo.rsmKey || Math.random().toString()}
                geography={geo}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth={0.5}
                className="transition-colors duration-500 hover:fill-slate-800"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        <AnimatePresence>
          {Array.isArray(destinations) && destinations.map((dest, i) => {
            if (!dest?.coordinates || !Array.isArray(dest.coordinates) || dest.coordinates.length < 2) return null;
            if (!base?.coordinates || !Array.isArray(base.coordinates) || base.coordinates.length < 2) return null;
            
            const destCoords = dest.coordinates;
            const baseCoords = base.coordinates;

            return (
              <React.Fragment key={`flight-${i}`}>
                <Line
                  from={baseCoords}
                  to={destCoords}
                  stroke="#374151"
                  strokeWidth={0.5}
                  strokeDasharray="4 2"
                  className="opacity-10"
                />
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 2, delay: i * 0.3 }}
                  d={`M ${baseCoords[0]} ${baseCoords[1]} L ${destCoords[0]} ${destCoords[1]}`} // Note: Lines are simplified in react-simple-maps, but using Line component usually manages this
                  // Switching back to Line component for better internal projection handling
                />
                <Line
                  from={baseCoords}
                  to={destCoords}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="transition-all hover:stroke-amber-400 cursor-pointer flight-path"
                  style={{ 
                    strokeDasharray: '40 100', 
                    strokeDashoffset: '100',
                    animation: `flight-dash 8s linear infinite`,
                    animationDelay: `${i * 1.5}s`,
                    opacity: 0.15
                  }}
                  onMouseEnter={(e) => handleMouseMove(e as any, 'route', dest.name, dest)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              </React.Fragment>
            );
          })}
        </AnimatePresence>

        {Array.isArray(hubs) && hubs.map((hub, i) => {
          if (!hub || !hub.coordinates || !Array.isArray(hub.coordinates) || hub.coordinates.length < 2) return null;
          const hubCoords = hub.coordinates;
          return (
            <Marker 
              key={`hub-${i}`} 
              coordinates={hubCoords}
              onMouseEnter={(e) => handleMouseMove(e as any, 'hub', hub.name, hub)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <motion.circle
                r={hub.isBase ? 7 : 5}
                fill={hub.isBase ? "#2563eb" : "#3b82f6"}
                stroke="#fff"
                strokeWidth={2}
                className="cursor-pointer drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                whileHover={{ scale: 1.8, strokeWidth: 3, fill: "#f59e0b" }}
              />
              <text
                textAnchor="middle"
                y={hub.isBase ? -14 : -10}
                className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ fontFamily: "Inter", fill: "#f8fafc", fontSize: "8px", fontWeight: "900", letterSpacing: "-0.02em" }}
              >
                {hub.name}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,4px_100%] opacity-20" />
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex items-center gap-6 bg-slate-900/60 backdrop-blur-md p-3 rounded-xl border border-white/5">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ana Üs</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Stratejik Hub</span>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flight-dash {
          0% {
            stroke-dasharray: 0 120%;
            stroke-dashoffset: 120%;
          }
          70% {
            stroke-dasharray: 40% 100%;
            stroke-dashoffset: 40%;
          }
          100% {
            stroke-dasharray: 0 120%;
            stroke-dashoffset: 0%;
          }
        }
        .flight-path {
          pointer-events: auto;
          filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.4));
        }
        .flight-path:hover {
          filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.8));
          opacity: 1 !important;
        }
      `}} />
    </div>
  );
};
