'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
    Siren, 
    Navigation, 
    Hospital as HospitalIcon, 
    ChevronLeft,
    RotateCcw,
    ShieldAlert,
    Loader2,
    MapPin,
    PhoneCall,
    Pill,
    Droplet,
    Stethoscope,
    Activity,
    LocateFixed,
    Compass,
    Settings2,
    Map as MapIcon,
    Search,
    Menu
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from '@/components/ui/sidebar';

// --- CONSTANTS ---
const VAPI_COORDINATES: [number, number] = [20.3712, 72.9102];

type MedicalMode = 'hospital' | 'pharmacy' | 'blood_bank' | 'emergency' | 'doctors';

const MODE_CONFIG: Record<MedicalMode, { label: string; icon: any; tag: string; color: string; bg: string }> = {
  hospital: { label: 'Hospitals', icon: HospitalIcon, tag: '[amenity~"hospital|clinic"]', color: 'text-blue-500', bg: 'bg-blue-50/50' },
  pharmacy: { label: 'Pharmacies', icon: Pill, tag: '[amenity=pharmacy]', color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
  blood_bank: { label: 'Blood Banks', icon: Droplet, tag: '[amenity=blood_bank]', color: 'text-rose-500', bg: 'bg-rose-50/50' },
  emergency: { label: 'Emergency', icon: Siren, tag: '[amenity~"ambulance_station|emergency_service"]', color: 'text-red-500', bg: 'bg-red-50/50' },
  doctors: { label: 'Specialists', icon: Stethoscope, tag: '[amenity~"doctors|dentist"]', color: 'text-purple-500', bg: 'bg-purple-50/50' },
};

// --- DYNAMIC MAP COMPONENT ---
const MapComponent = dynamic(() => Promise.resolve(({ center, elements, userIcon, poiIcon, openInMaps }: any) => {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require('react-leaflet');
  
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      if (center && map) {
          map.setView(center, 15);
      }
    }, [center, map]);
    return null;
  }

  return (
    <MapContainer center={center} zoom={15} className="w-full h-full" zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap'
      />
      <ChangeView center={center} />
      
      <Marker position={center} icon={userIcon} />
      
      {elements?.map((el: any) => {
        const pos: [number, number] = [el.lat || el.center?.lat, el.lon || el.center?.lon];
        if (!pos[0] || !pos[1]) return null;
        return (
          <Marker key={el.id} position={pos} icon={poiIcon}>
            <Popup className="medical-popup">
              <div className="p-2 space-y-3 min-w-[160px]">
                <div className="space-y-1">
                    <p className="font-black text-[11px] uppercase text-primary leading-tight tracking-tight">{el.tags?.name || "Medical Site"}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{el.calculatedDist?.toFixed(2)} KM FROM YOU</p>
                </div>
                <Button size="sm" className="w-full h-9 text-[10px] uppercase font-black rounded-xl shadow-lg shadow-primary/20" onClick={() => openInMaps(el)}>
                    <Navigation className="w-3.5 h-3.5 mr-2" /> Start Route
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}), { ssr: false });

// --- MAIN PAGE ---
export default function NearbyHospitalPage() {
  const [elements, setElements] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<MedicalMode>('hospital');
  const [radius, setRadius] = useState<string>('5000');
  const [status, setStatus] = useState('Syncing Radar...');
  const { toast } = useToast();

  const [L, setL] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const leaflet = require('leaflet');
        setL(leaflet);
    }
  }, []);

  const icons = useMemo(() => {
    if (!L) return { user: null, poi: null };
    const user = L.divIcon({
      className: 'user-marker',
      html: `<div class="relative h-10 w-10 flex items-center justify-center"><div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div><div class="h-5 w-5 bg-primary rounded-full border-4 border-white shadow-2xl z-10"></div></div>`,
      iconSize: [40, 40], iconAnchor: [20, 20],
    });
    const poi = L.divIcon({
      className: 'poi-marker',
      html: `<div class="flex items-center justify-center transition-transform hover:scale-110 active:scale-95"><svg width="34" height="42" viewBox="0 0 34 42" fill="none"><path d="M17 0C7.611 0 0 7.611 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.611 26.388 0 17 0Z" fill="#2488E8"/><circle cx="17" cy="17" r="7" fill="white"/><path d="M17 13V21M14 17H20" stroke="#2488E8" stroke-width="2" stroke-linecap="round"/></svg></div>`,
      iconSize: [34, 42], iconAnchor: [17, 42], popupAnchor: [0, -42],
    });
    return { user, poi };
  }, [L]);

  const fetchOSMNodes = useCallback(async (lat: number, lon: number, mode: MedicalMode, rad: string) => {
    setIsLoading(true);
    setStatus(`Locating ${MODE_CONFIG[mode].label}...`);

    try {
      const tag = MODE_CONFIG[mode].tag;
      const query = `[out:json][timeout:30];(node(around:${rad},${lat},${lon})${tag};way(around:${rad},${lat},${lon})${tag};relation(around:${rad},${lat},${lon})${tag};);out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Connection failed.");

      const data = await response.json();
      const results = (data?.elements || []).map((el: any) => {
        const elLat = el.lat || el.center?.lat;
        const elLon = el.lon || el.center?.lon;
        const dist = lat && lon && elLat && elLon ? (function(lat1: number, lon1: number, lat2: number, lon2: number) {
          const R = 6371; 
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        })(lat, lon, elLat, elLon) : 0;

        return { ...el, calculatedDist: dist };
      }).sort((a: any, b: any) => a.calculatedDist - b.calculatedDist);

      setElements(results);
      setStatus(results.length === 0 ? "No sites found" : `${results.length} results ready`);
    } catch (err: any) {
      setStatus("Sync Error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncGPS = useCallback(() => {
    setIsLoading(true);
    setStatus('Linking GPS...');
    
    if (!navigator.geolocation) {
        setUserLocation(VAPI_COORDINATES);
        fetchOSMNodes(VAPI_COORDINATES[0], VAPI_COORDINATES[1], activeMode, radius);
        return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        fetchOSMNodes(coords[0], coords[1], activeMode, radius);
      },
      () => {
        setUserLocation(VAPI_COORDINATES);
        fetchOSMNodes(VAPI_COORDINATES[0], VAPI_COORDINATES[1], activeMode, radius);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [activeMode, radius, fetchOSMNodes]);

  useEffect(() => { syncGPS(); }, []);

  const openInMaps = (el: any) => {
    const lat = el.lat || el.center?.lat;
    const lon = el.lon || el.center?.lon;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  return (
    <div className="fixed inset-0 flex flex-col h-[100dvh] bg-gradient-to-b from-white to-[#f0f4ff] dark:from-[#020617] dark:to-[#020617] overflow-hidden font-body safe-top">
      
      {/* 1. BRANDED COMPACT HEADER */}
      <header className="shrink-0 pt-6 pb-4 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-11 w-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-all">
              <Menu className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
          </SidebarTrigger>
          <Link href="/dashboard">
            <div className="h-11 w-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-all">
                <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
            </div>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Medical Radar</h1>
            <div className="flex items-center gap-2">
                <div className={cn("h-1.5 w-1.5 rounded-full", isLoading ? "bg-blue-400 animate-pulse" : "bg-emerald-500")} />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{status}</p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MODE SELECTOR ROW (NO OVERLAP) */}
      <div className="shrink-0 pb-4">
          <div className="flex items-center gap-2.5 overflow-x-auto px-6 scrollbar-hide no-scrollbar pb-2">
            {(Object.keys(MODE_CONFIG) as MedicalMode[]).map((m) => {
              const cfg = MODE_CONFIG[m];
              const isActive = activeMode === m;
              return (
                <button 
                  key={m} 
                  onClick={() => { setActiveMode(m); fetchOSMNodes(userLocation![0], userLocation![1], m, radius); }} 
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-2.5 rounded-2xl transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest shrink-0 border border-transparent shadow-sm",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]" 
                      : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 border-slate-50 dark:border-slate-800"
                  )}
                >
                  <cfg.icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : cfg.color)} /> {cfg.label}
                </button>
              );
            })}
          </div>
      </div>

      {/* 3. FLOATING CURVED MAP CONTAINER */}
      <div className="shrink-0 px-6 w-full h-[30vh] relative z-10">
            <div className="w-full h-full rounded-[2.8rem] overflow-hidden shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] border-4 border-white dark:border-slate-800 relative bg-slate-100 dark:bg-slate-900 transition-all duration-700">
                {userLocation && icons.user ? (
                    <MapComponent center={userLocation} elements={elements} userIcon={icons.user} poiIcon={icons.poi} openInMaps={openInMaps} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                            <Loader2 className="h-10 w-10 text-primary animate-spin relative z-10" />
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">GPS Sync Active...</p>
                    </div>
                )}
            </div>
      </div>

      {/* 4. FILTER & CONTROL BAR (SPACING BETWEEN MAP & LIST) */}
      <div className="shrink-0 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <LocateFixed className="w-5 h-5" />
                </div>
                <Select value={radius} onValueChange={(val) => { setRadius(val); if(userLocation) fetchOSMNodes(userLocation[0], userLocation[1], activeMode, val); }}>
                    <SelectTrigger className="h-10 w-32 rounded-xl bg-white dark:bg-slate-900 border-none font-black text-[10px] uppercase shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                        <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="2000" className="font-bold text-[9px] uppercase py-3">2 KM Search</SelectItem>
                        <SelectItem value="5000" className="font-bold text-[9px] uppercase py-3">5 KM Search</SelectItem>
                        <SelectItem value="10000" className="font-bold text-[9px] uppercase py-3">10 KM Search</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button 
                variant="outline" 
                size="icon" 
                onClick={syncGPS} 
                disabled={isLoading} 
                className={cn("h-11 w-11 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm active:scale-95 transition-all", isLoading && "animate-spin")}
            >
                <RotateCcw className="h-5 w-5 text-primary" />
            </Button>
      </div>

      {/* 5. NATIVE BOTTOM SHEET LIST (CONNECTED TO BOTTOM) */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-950 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] relative z-20 flex flex-col border-t border-slate-50 dark:border-slate-800 animate-in slide-in-from-bottom-10 duration-1000">
            
            {/* Sheet Handle */}
            <div className="w-14 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto my-4 shrink-0" />

            <div className="px-8 pb-4 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Compass className="w-5 h-5 text-primary" />
                    <h3 className="text-[12px] font-black uppercase text-[#1A365D] dark:text-white tracking-[0.15em]">Near Your Area</h3>
                </div>
                <Badge className="bg-primary text-white border-none text-[8px] font-black rounded-lg px-3 py-1 shadow-lg shadow-primary/20">{elements.length} FOUND</Badge>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-40 space-y-4 no-scrollbar scroll-smooth">
                {isLoading ? (
                    <div className="space-y-4 pt-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-5 p-6 rounded-[2rem] animate-pulse bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                <div className="h-14 w-14 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] shrink-0" />
                                <div className="flex-1 space-y-3 py-1">
                                    <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-full" />
                                    <div className="h-3 w-full bg-slate-50 dark:bg-slate-900/50 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : elements.length > 0 ? (
                    <div className="space-y-4 pt-1">
                        {elements.map((el) => {
                            const cfg = MODE_CONFIG[activeMode];
                            return (
                                <div key={el.id} className="flex items-start gap-5 p-6 bg-slate-50/60 dark:bg-slate-900/40 rounded-[2.2rem] border border-slate-100/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-900 transition-all group active:scale-[0.98] shadow-sm">
                                    <div className={cn("h-14 w-14 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform", cfg.bg, cfg.color)}>
                                        <cfg.icon className="h-7 w-7" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-1.5">
                                            <h4 className="text-[14px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight truncate leading-tight">
                                                {el.tags?.name || "Medical Provider"}
                                            </h4>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="text-[10px] font-black text-primary tracking-tighter">
                                                    {el.calculatedDist?.toFixed(2)} KM
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 opacity-60 mb-5">
                                            <MapPin className="h-3 w-3 text-slate-400" />
                                            <p className="text-[9px] font-bold truncate leading-none uppercase tracking-tighter">
                                                {el.tags?.["addr:street"] || el.tags?.["addr:city"] || "Vapi Industrial Area, Gujarat"}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button onClick={() => openInMaps(el)} size="sm" className="h-10 rounded-xl bg-primary text-white px-6 text-[10px] font-black uppercase tracking-widest border-none shadow-[0_10px_20px_-5px_rgba(36,136,232,0.4)] active:scale-95 transition-all">
                                                <Navigation className="h-3.5 w-3.5 mr-2" /> Route Now
                                            </Button>
                                            {el.tags?.phone && (
                                                <Button asChild size="sm" variant="outline" className="h-10 w-10 p-0 rounded-xl text-emerald-600 bg-emerald-50/50 border-emerald-100 shadow-sm active:scale-95 transition-all">
                                                    <a href={`tel:${el.tags.phone}`}>
                                                        <PhoneCall className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-6">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-900 rounded-[2.8rem] flex items-center justify-center mx-auto border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner">
                            <ShieldAlert className="h-10 w-10 text-slate-200" />
                        </div>
                        <div className="space-y-1">
                             <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">No Facilities Found</p>
                             <p className="text-[9px] font-bold text-slate-300 uppercase px-12">Increase your search radius to scan more areas.</p>
                        </div>
                        <Button onClick={syncGPS} variant="outline" className="rounded-full px-10 h-12 font-black uppercase text-[10px] tracking-widest border-primary/20 text-primary">Restart Radar</Button>
                    </div>
                )}
            </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .medical-popup .leaflet-popup-content-wrapper {
            border-radius: 24px;
            padding: 8px;
            box-shadow: 0 30px 60px -10px rgba(0,0,0,0.2);
            border: 2px solid white;
        }
        .medical-popup .leaflet-popup-tip {
            display: none;
        }
      `}</style>
    </div>
  );
}
