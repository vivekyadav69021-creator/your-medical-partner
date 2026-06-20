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
    Search,
    Compass
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fixed local sqrt helper
const sqrt = (n: number) => Math.sqrt(n);

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
            <Tooltip direction="top" offset={[0, -40]} opacity={0.9} permanent className="map-place-label">
                <span className="font-bold text-[9px] uppercase tracking-tighter whitespace-nowrap text-slate-800 bg-white px-2 py-0.5 rounded shadow-xl border border-slate-100">
                    {el.tags?.name || "Medical Site"}
                </span>
            </Tooltip>
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
        const dist = lat && lon && elLat && elLon ? (function(lat1, lon1, lat2, lon2) {
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
      setStatus(results.length === 0 ? "No locations found." : `${results.length} results ready.`);
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
    <div className="flex flex-col h-[100dvh] w-full bg-white dark:bg-[#020617] overflow-hidden font-body safe-top relative">
      
      {/* Native-Style Integrated Header */}
      <header className="z-30 px-6 py-4 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </Link>
          <div className="space-y-0">
            <h1 className="text-lg font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Medical Radar</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
                <div className={cn("h-1 w-1 rounded-full", isLoading ? "bg-blue-400 animate-pulse" : "bg-emerald-500")} />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{status}</p>
            </div>
          </div>
        </div>
        
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={syncGPS} 
            disabled={isLoading} 
            className={cn("rounded-full h-10 w-10 bg-primary/5", isLoading && "animate-spin")}
        >
            <RotateCcw className="h-4 w-4 text-primary" />
        </Button>
      </header>

      {/* Horizontal Mode Bar */}
      <div className="relative z-20 w-full overflow-hidden shrink-0 border-b border-slate-50 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
          <div className="flex gap-2.5 overflow-x-auto p-4 scrollbar-hide">
            {(Object.keys(MODE_CONFIG) as MedicalMode[]).map((m) => {
              const cfg = MODE_CONFIG[m];
              const isActive = activeMode === m;
              return (
                <button 
                  key={m} 
                  onClick={() => setActiveMode(m)} 
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-2xl transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest shrink-0",
                    isActive 
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                      : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
                  )}
                >
                  <cfg.icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : cfg.color)} /> {cfg.label}
                </button>
              );
            })}
          </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {/* Map Visualization Container */}
        <div className="relative w-full h-[35vh] z-10 shrink-0 bg-slate-50 dark:bg-slate-900">
            {userLocation && icons.user ? (
                <MapComponent center={userLocation} elements={elements} userIcon={icons.user} poiIcon={icons.poi} openInMaps={openInMaps} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">GPS Locking...</p>
                </div>
            )}
            
            {/* Radius Chip floating on map */}
            <div className="absolute bottom-5 left-5 z-[1000]">
                <Select value={radius} onValueChange={setRadius}>
                    <SelectTrigger className="h-10 w-40 rounded-full bg-white/95 dark:bg-slate-900/95 border-none font-black text-[9px] uppercase shadow-2xl backdrop-blur-xl ring-2 ring-primary/10">
                        <LocateFixed className="w-3.5 h-3.5 mr-2 text-primary" />
                        <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl backdrop-blur-3xl">
                        <SelectItem value="2000" className="font-bold text-[9px] uppercase py-3">2 KM Area</SelectItem>
                        <SelectItem value="5000" className="font-bold text-[9px] uppercase py-3">5 KM Area</SelectItem>
                        <SelectItem value="10000" className="font-bold text-[9px] uppercase py-3">10 KM Area</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Results List - Native Vertical Flow */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-t-[2.5rem] -mt-6 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border-t border-slate-50 dark:border-slate-800">
            
            <div className="px-8 pt-7 pb-2 shrink-0 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-[0.2em] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-primary" />
                    Near Your Area
                </h3>
                <span className="text-[9px] font-black text-slate-400 uppercase">{elements.length} Locations</span>
            </div>

            <ScrollArea className="flex-1 px-4 pb-40 pt-2">
                {isLoading ? (
                    <div className="space-y-1 pt-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex gap-4 p-5 rounded-3xl animate-pulse">
                                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-900 rounded-2xl shrink-0" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-900 rounded-full" />
                                    <div className="h-2 w-full bg-slate-50 dark:bg-slate-900/50 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : elements.length > 0 ? (
                    <div className="space-y-0.5">
                        {elements.map((el) => {
                            const cfg = MODE_CONFIG[activeMode];
                            return (
                                <div key={el.id} className="group p-5 border-b border-slate-50 dark:border-slate-900/50 active:bg-slate-50 dark:active:bg-slate-900/40 transition-all flex items-start gap-5 relative overflow-hidden">
                                    <div className={cn("h-12 w-12 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-transparent group-hover:border-primary/20", cfg.bg, cfg.color)}>
                                        <cfg.icon className="h-6 w-6" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h4 className="text-[14px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight truncate leading-tight">
                                                {el.tags?.name || "Medical Provider"}
                                            </h4>
                                            <span className="text-[10px] font-black text-primary shrink-0 whitespace-nowrap">
                                                {el.calculatedDist?.toFixed(1)} KM
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 opacity-60 mb-3">
                                            <MapPin className="h-3 w-3 text-slate-400" />
                                            <p className="text-[10px] font-bold truncate leading-none uppercase tracking-tighter">
                                                {el.tags?.["addr:street"] || el.tags?.["addr:city"] || "Vapi, Gujarat Area"}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => openInMaps(el)} size="sm" className="h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 text-[9px] font-black uppercase tracking-widest border-none transition-all shadow-none">
                                                <Navigation className="h-3 w-3 mr-1.5" /> Route
                                            </Button>
                                            {el.tags?.phone && (
                                                <Button asChild size="sm" variant="ghost" className="h-8 rounded-full text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-4 text-[9px] font-black uppercase tracking-widest">
                                                    <a href={`tel:${el.tags.phone}`}>
                                                        <PhoneCall className="h-3 w-3 mr-1.5" /> Call
                                                    </a>
                                                </Button>
                                            )}
                                            {el.tags?.emergency === 'yes' && (
                                                <div className="ml-auto h-8 w-8 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-500">
                                                    <Siren className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <ChevronRight className="h-4 w-4 text-slate-200 mt-2 shrink-0 group-hover:text-primary transition-colors" />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-6">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <ShieldAlert className="h-10 w-10 text-slate-200" />
                        </div>
                        <div className="space-y-1">
                             <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Search Result Empty</p>
                             <p className="text-[9px] font-bold text-slate-300 uppercase">Try increasing the area radius</p>
                        </div>
                        <Button onClick={syncGPS} variant="outline" className="rounded-full px-10 h-12 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Retry Scan</Button>
                    </div>
                )}
            </ScrollArea>
        </div>
      </div>

      {/* Global CSS for Leaflet UI Polish */}
      <style jsx global>{`
        .map-place-label {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
        }
        .map-place-label::before {
            display: none !important;
        }
        .leaflet-container {
            font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
            border-radius: 16px;
            padding: 4px;
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);
        }
        .medical-popup .leaflet-popup-content {
            margin: 8px;
        }
      `}</style>
    </div>
  );
}