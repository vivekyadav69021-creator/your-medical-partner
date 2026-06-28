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
    ChevronRight,
    Compass,
    Map as MapIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } = require('react-leaflet');
  
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
        attribution='&copy; OSM'
      />
      <ChangeView center={center} />
      
      <Marker position={center} icon={userIcon}>
        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
            <span className="font-black text-[10px] uppercase text-primary">Live Now</span>
        </Tooltip>
      </Marker>
      
      {elements?.map((el: any) => {
        const pos: [number, number] = [el.lat || el.center?.lat, el.lon || el.center?.lon];
        if (!pos[0] || !pos[1]) return null;
        return (
          <Marker key={el.id} position={pos} icon={poiIcon}>
            <Popup className="medical-popup">
              <div className="p-1 space-y-2 min-w-[140px]">
                <p className="font-black text-[11px] uppercase text-slate-800 leading-tight">{el.tags?.name || "Medical Node"}</p>
                <div className="flex flex-col gap-1.5">
                   <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{el.calculatedDist?.toFixed(1)} KM Away</p>
                   <Button size="sm" className="w-full h-8 text-[9px] uppercase font-black rounded-lg" onClick={() => openInMaps(el)}>Route</Button>
                </div>
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
  const [error, setError] = useState<string | null>(null);
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
      className: 'user-radar-marker',
      html: `<div class="relative flex items-center justify-center h-8 w-8"><div class="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div><div class="h-4 w-4 bg-primary rounded-full border-2 border-white shadow-2xl z-10"></div></div>`,
      iconSize: [32, 32], iconAnchor: [16, 16],
    });
    const poi = L.divIcon({
      className: 'medical-pin-marker',
      html: `<div class="flex items-center justify-center"><svg width="28" height="34" viewBox="0 0 34 42" fill="none"><path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="#EF4444"/><circle cx="17" cy="17" r="7" fill="white"/><path d="M17 13V21M14 17H20" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/></svg></div>`,
      iconSize: [34, 42], iconAnchor: [17, 42], popupAnchor: [0, -42],
    });
    return { user, poi };
  }, [L]);

  const fetchOSMNodes = useCallback(async (lat: number, lon: number, mode: MedicalMode, rad: string) => {
    setIsLoading(true);
    setError(null);
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

        return {
            ...el,
            calculatedDist: dist
        };
      }).sort((a: any, b: any) => a.calculatedDist - b.calculatedDist);

      setElements(results);
      setStatus(results.length === 0 ? "No locations found." : `${results.length} sites ready.`);
    } catch (err: any) {
      setError(err.message);
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
        toast({ title: "Radar Linked", description: "GPS Synchronized successfully." });
      },
      () => {
        setUserLocation(VAPI_COORDINATES);
        fetchOSMNodes(VAPI_COORDINATES[0], VAPI_COORDINATES[1], activeMode, radius);
        toast({ title: "GPS Link Error", description: "Using Vapi default center." });
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  }, [activeMode, radius, fetchOSMNodes, toast]);

  useEffect(() => { syncGPS(); }, []);

  useEffect(() => {
      if (userLocation) {
          fetchOSMNodes(userLocation[0], userLocation[1], activeMode, radius);
      }
  }, [activeMode, radius]);

  const openInMaps = (el: any) => {
    const lat = el.lat || el.center?.lat;
    const lon = el.lon || el.center?.lon;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-white dark:bg-[#020617] font-body relative">
      
      {/* 1. HEADER (STAYS AT TOP) */}
      <header className="py-3 px-4 flex items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </Link>
          <div>
            <h1 className="text-base font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Medical Radar</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
                <div className={cn("h-1 w-1 rounded-full", isLoading ? "bg-blue-400 animate-pulse" : "bg-emerald-500")} />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px]">{status}</p>
            </div>
          </div>
        </div>
        
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={syncGPS} 
            disabled={isLoading} 
            className={cn("rounded-full h-9 w-9 bg-primary/5", isLoading && "animate-spin")}
        >
            <RotateCcw className="h-4 w-4 text-primary" />
        </Button>
      </header>

      {/* 2. MODE SELECTOR (HORIZONTAL SCROLL) */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-800 shrink-0 z-40">
          <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
            {(Object.keys(MODE_CONFIG) as MedicalMode[]).map((m) => {
              const cfg = MODE_CONFIG[m];
              const isActive = activeMode === m;
              return (
                <button 
                  key={m} 
                  onClick={() => setActiveMode(m)} 
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest shrink-0 border",
                    isActive 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800"
                  )}
                >
                  <cfg.icon className={cn("w-3 h-3", isActive ? "text-white" : cfg.color)} /> {cfg.label}
                </button>
              );
            })}
          </div>
      </div>

      {/* 3. MAP SEGMENT (35% VIEWPORT) */}
      <div className="w-full h-[35vh] md:h-[45vh] shrink-0 relative z-10 shadow-inner bg-slate-100 dark:bg-slate-900">
            {userLocation && icons.user ? (
                <MapComponent center={userLocation} elements={elements} userIcon={icons.user} poiIcon={icons.poi} openInMaps={openInMaps} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">GPS Locking...</p>
                </div>
            )}
            
            <div className="absolute bottom-4 left-4 z-[1000]">
                <Select value={radius} onValueChange={setRadius}>
                    <SelectTrigger className="h-9 w-36 rounded-full bg-white/95 dark:bg-slate-900/95 border-none font-black text-[9px] uppercase shadow-2xl backdrop-blur-xl ring-2 ring-primary/10">
                        <LocateFixed className="w-3 h-3 mr-2 text-primary" />
                        <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="2000" className="font-bold text-[9px] uppercase py-2">2 KM Range</SelectItem>
                        <SelectItem value="5000" className="font-bold text-[9px] uppercase py-2">5 KM Range</SelectItem>
                        <SelectItem value="10000" className="font-bold text-[9px] uppercase py-2">10 KM Range</SelectItem>
                    </SelectContent>
                </Select>
            </div>
      </div>

      {/* 4. LIST CONTAINER (BOTTOM SHEET FEEL) */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950 rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.06)] -mt-4 relative z-20 overflow-hidden border-t border-slate-50 dark:border-slate-800">
            
            <div className="p-4 border-b border-slate-50 dark:border-slate-900 shrink-0 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-[0.2em] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-primary" />
                    Near Your Area
                </h3>
                <Badge variant="outline" className="bg-primary/5 text-primary border-none px-3 text-[9px] font-black">{elements.length} NODES</Badge>
            </div>

            <ScrollArea className="flex-1 px-4 py-3 space-y-3 pb-8">
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl animate-pulse bg-slate-50 dark:bg-slate-900">
                                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-full" />
                                    <div className="h-2 w-full bg-slate-50 dark:bg-slate-900/50 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : elements.length > 0 ? (
                    <div className="space-y-3">
                        {elements.map((el) => {
                            const cfg = MODE_CONFIG[activeMode];
                            return (
                                <div key={el.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm", cfg.bg, cfg.color)}>
                                        <cfg.icon className="h-6 w-6" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h4 className="text-[13px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight truncate leading-tight">
                                                {el.tags?.name || "Medical Provider"}
                                            </h4>
                                            <span className="text-[9px] font-black text-primary shrink-0">
                                                {el.calculatedDist?.toFixed(1)} KM
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 opacity-60 mb-3">
                                            <MapPin className="h-2.5 w-2.5 text-slate-400" />
                                            <p className="text-[10px] font-bold truncate leading-none uppercase tracking-tighter">
                                                {el.tags?.["addr:street"] || el.tags?.["addr:city"] || "Vapi, Gujarat Area"}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => openInMaps(el)} size="sm" className="h-8 rounded-lg bg-primary text-white px-4 text-[9px] font-black uppercase tracking-widest border-none transition-all shadow-md active:scale-95">
                                                <Navigation className="h-3 w-3 mr-1.5" /> Route
                                            </Button>
                                            {el.tags?.phone && (
                                                <Button asChild size="sm" variant="outline" className="h-8 rounded-lg text-emerald-600 bg-emerald-50/30 border-emerald-100 px-4 text-[9px] font-black uppercase tracking-widest">
                                                    <a href={`tel:${el.tags.phone}`}>
                                                        <PhoneCall className="h-3 w-3 mr-1.5" /> Call
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <ChevronRight className="h-4 w-4 text-slate-200 mt-2 shrink-0 group-hover:text-primary transition-colors" />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-5">
                        <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <ShieldAlert className="h-8 w-8 text-slate-200" />
                        </div>
                        <div className="space-y-1">
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No results found</p>
                             <p className="text-[9px] font-bold text-slate-300 uppercase">Try a larger search radius</p>
                        </div>
                        <Button onClick={syncGPS} variant="outline" className="rounded-full px-8 h-11 font-black uppercase text-[10px] tracking-widest">Retry Scan</Button>
                    </div>
                )}
            </ScrollArea>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .medical-popup .leaflet-popup-content-wrapper {
            border-radius: 16px;
            padding: 4px;
            box-shadow: 0 15px 35px -10px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
