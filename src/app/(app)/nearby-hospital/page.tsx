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
    Pill,
    Droplet,
    Stethoscope,
    Activity,
    LocateFixed,
    Compass,
    Menu,
    Map as MapIcon,
    Search,
    MapPinOff
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from '@/components/ui/sidebar';

// --- CONSTANTS ---
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
    <MapContainer 
      center={center} 
      zoom={15} 
      className="w-full h-full" 
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <ChangeView center={center} />
      <Marker position={center} icon={userIcon} />
      {elements?.map((el: any) => {
        const pos: [number, number] = [el.lat || el.center?.lat, el.lon || el.center?.lon];
        if (!pos[0] || !pos[1]) return null;
        return (
          <Marker key={el.id} position={pos} icon={poiIcon}>
            <Popup className="medical-popup">
              <div className="p-2 space-y-2 min-w-[150px]">
                <p className="font-black text-[11px] uppercase text-primary leading-tight">{el.tags?.name || "Medical Site"}</p>
                <Button size="sm" className="w-full h-8 text-[9px] uppercase font-black rounded-lg bg-primary" onClick={() => openInMaps(el)}>
                    <Navigation className="w-3 h-3 mr-1" /> Route
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
  const [locationDenied, setLocationDenied] = useState(false);
  const [activeMode, setActiveMode] = useState<MedicalMode>('hospital');
  const [radius, setRadius] = useState<string>('5000');
  const [status, setStatus] = useState('Standby');
  const { toast } = useToast();
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const leaflet = require('leaflet');
        setL(leaflet);
    }
    // Auto-attempt GPS on mount
    syncGPS();
  }, []);

  const icons = useMemo(() => {
    if (!L) return { user: null, poi: null };
    const user = L.divIcon({
      className: 'user-marker',
      html: `<div class="relative h-8 w-8 flex items-center justify-center"><div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div><div class="h-4 w-4 bg-primary rounded-full border-2 border-white shadow-xl z-10"></div></div>`,
      iconSize: [32, 32], iconAnchor: [16, 16],
    });
    const poi = L.divIcon({
      className: 'poi-marker',
      html: `<div class="flex items-center justify-center transition-transform hover:scale-110 drop-shadow-lg"><svg width="30" height="38" viewBox="0 0 34 42" fill="none"><path d="M17 0C7.611 0 0 7.611 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.611 26.388 0 17 0Z" fill="#2488E8"/><circle cx="17" cy="17" r="7" fill="white"/><path d="M17 13V21M14 17H20" stroke="#2488E8" stroke-width="2" stroke-linecap="round"/></svg></div>`,
      iconSize: [30, 38], iconAnchor: [15, 38], popupAnchor: [0, -38],
    });
    return { user, poi };
  }, [L]);

  const fetchOSMNodes = useCallback(async (lat: number, lon: number, mode: MedicalMode, rad: string) => {
    setIsLoading(true);
    setStatus(`Searching...`);
    try {
      const tag = MODE_CONFIG[mode].tag;
      const query = `[out:json][timeout:30];(node(around:${rad},${lat},${lon})${tag};way(around:${rad},${lat},${lon})${tag};relation(around:${rad},${lat},${lon})${tag};);out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();
      const results = (data?.elements || []).map((el: any) => {
        const elLat = el.lat || el.center?.lat;
        const elLon = el.lon || el.center?.lon;
        
        // Calculate Distance
        const dist = (function(lat1: number, lon1: number, lat2: number, lon2: number) {
          const R = 6371; 
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        })(lat, lon, elLat, elLon);

        // Advanced Address Logic
        const addr = [
          el.tags?.["addr:street"], 
          el.tags?.["addr:suburb"], 
          el.tags?.["addr:neighbourhood"],
          el.tags?.["addr:city"]
        ].filter(Boolean).join(', ');

        return { ...el, calculatedDist: dist, derivedAddress: addr || "Medical Zone, Nearby" };
      }).sort((a: any, b: any) => a.calculatedDist - b.calculatedDist);

      setElements(results);
      setStatus(results.length > 0 ? `${results.length} Found` : "Area Clear");
    } catch (err) {
      setStatus("API Error");
      toast({ variant: 'destructive', title: 'Radar Link Failed', description: 'Check internet connection.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const syncGPS = useCallback(() => {
    setIsLoading(true);
    setStatus('Syncing GPS...');
    setLocationDenied(false);

    if (!navigator.geolocation) {
        setStatus('Not Supported');
        setIsLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setLocationDenied(false);
        fetchOSMNodes(coords[0], coords[1], activeMode, radius);
      },
      (err) => {
        console.warn("Geolocation Error:", err);
        setIsLoading(false);
        setLocationDenied(true);
        setStatus('Access Blocked');
        setUserLocation(null);
        toast({
          variant: 'destructive',
          title: 'Location Required',
          description: 'Please tap "Allow" when the browser asks for location.',
        });
      },
      { 
        timeout: 12000, // Increased timeout for mobile satellite lock
        enableHighAccuracy: true,
        maximumAge: 0 
      }
    );
  }, [activeMode, radius, fetchOSMNodes, toast]);

  const openInMaps = (el: any) => {
    const lat = el.lat || el.center?.lat;
    const lon = el.lon || el.center?.lon;
    const name = el.tags?.name || "Medical Site";
    // Using Search API for better precision on mobile
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}+${lat},${lon}`, '_blank');
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full flex flex-col bg-white dark:bg-[#020617] overflow-hidden font-body safe-top">
      
      {/* 1. COMPACT HEADER */}
      <header className="shrink-0 pt-4 pb-1 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 flex items-center justify-center shadow-sm">
              <Menu className="h-5 w-5 text-primary" />
          </SidebarTrigger>
          <Link href="/dashboard">
            <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 flex items-center justify-center">
                <ChevronLeft className="h-6 w-6 text-[#1A365D]" />
            </div>
          </Link>
          <div className="space-y-0">
            <h1 className="text-lg font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Medical Radar</h1>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{status}</p>
          </div>
        </div>
      </header>

      {/* 2. COMPACT MODE SELECTOR */}
      <div className="shrink-0 py-2">
          <div className="flex items-center gap-2 overflow-x-auto px-4 scrollbar-hide no-scrollbar">
            {(Object.keys(MODE_CONFIG) as MedicalMode[]).map((m) => {
              const cfg = MODE_CONFIG[m];
              const isActive = activeMode === m;
              return (
                <button 
                  key={m} 
                  onClick={() => { setActiveMode(m); if(userLocation) fetchOSMNodes(userLocation[0], userLocation[1], m, radius); }} 
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap text-[9px] font-black uppercase tracking-widest shrink-0 border",
                    isActive ? "bg-primary text-white border-primary shadow-md" : "bg-white dark:bg-slate-900 text-slate-400 border-slate-100"
                  )}
                >
                  <cfg.icon className="w-3 h-3" /> {cfg.label}
                </button>
              );
            })}
          </div>
      </div>

      {/* 3. OPTIMIZED MAP SCREEN (42vh) */}
      <div className="shrink-0 px-4 w-full h-[42vh] relative z-10 mt-1">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-xl border-2 border-white dark:border-slate-800 relative bg-slate-50 transition-all">
                {userLocation && icons.user ? (
                    <MapComponent center={userLocation} elements={elements} userIcon={icons.user} poiIcon={icons.poi} openInMaps={openInMaps} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center p-8 bg-slate-50 dark:bg-slate-900/50">
                        {locationDenied ? (
                            <>
                                <div className="h-16 w-16 bg-red-50 dark:bg-red-950/20 rounded-[1.5rem] flex items-center justify-center text-red-400 shadow-inner">
                                    <MapPinOff className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black uppercase text-slate-500">Location Access Required</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Please enable GPS to link nearby medical sites.</p>
                                </div>
                                <Button onClick={syncGPS} className="rounded-full h-11 px-8 font-black uppercase text-[10px] bg-primary shadow-lg shadow-primary/20">Allow Access</Button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-4 animate-pulse">
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Syncing Radar Vision...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
      </div>

      {/* 4. FLOATING RADAR CONTROLS */}
      <div className="shrink-0 px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-0.5 px-3 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                <LocateFixed className="w-3.5 h-3.5 text-primary" />
                <Select value={radius} onValueChange={(val) => { setRadius(val); if(userLocation) fetchOSMNodes(userLocation[0], userLocation[1], activeMode, val); }}>
                    <SelectTrigger className="h-8 w-28 bg-transparent border-none font-black text-[9px] uppercase shadow-none focus:ring-0">
                        <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="2000" className="font-bold text-[9px] uppercase">2 KM Radius</SelectItem>
                        <SelectItem value="5000" className="font-bold text-[9px] uppercase">5 KM Radius</SelectItem>
                        <SelectItem value="10000" className="font-bold text-[9px] uppercase">10 KM Radius</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button variant="outline" size="icon" onClick={syncGPS} disabled={isLoading} className="h-9 w-9 rounded-full bg-white dark:bg-slate-900 shadow-md border-slate-100">
                <RotateCcw className={cn("h-4 w-4 text-primary", isLoading && "animate-spin")} />
            </Button>
      </div>

      {/* 5. NATIVE BOTTOM SHEET LIST */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-950 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.06)] relative z-20 flex flex-col border-t border-slate-50 dark:border-slate-900 transition-all duration-700 animate-in slide-in-from-bottom-5">
            <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mt-3 mb-1 shrink-0" />

            <div className="px-6 pb-2 shrink-0 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-primary" /> Linked Results
                </h3>
                {elements.length > 0 && <Badge className="bg-primary/5 text-primary text-[8px] font-black border-none px-2 py-0.5">{elements.length} Found</Badge>}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-2 no-scrollbar">
                {isLoading ? (
                    <div className="space-y-2 pt-1">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 rounded-2xl animate-pulse bg-slate-50 dark:bg-slate-900 border border-slate-100" />
                        ))}
                    </div>
                ) : elements.length > 0 ? (
                    <div className="space-y-2 pt-1">
                        {elements.map((el) => {
                            const cfg = MODE_CONFIG[activeMode];
                            return (
                                <div key={el.id} className="flex items-center gap-4 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 hover:bg-white transition-all group active:scale-[0.98] shadow-sm">
                                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner", cfg.bg, cfg.color)}>
                                        <cfg.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-1">
                                        <h4 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight truncate leading-tight mb-0.5">
                                            {el.tags?.name || "Medical Site"}
                                        </h4>
                                        <p className="text-[8px] font-bold truncate uppercase text-slate-400 mb-2">
                                            {el.derivedAddress}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Activity className="h-2.5 w-2.5 text-primary" />
                                                <span className="text-[8px] font-black text-primary">{el.calculatedDist?.toFixed(2)} KM Away</span>
                                            </div>
                                            <Button onClick={() => openInMaps(el)} size="sm" className="h-7 rounded-lg bg-[#1A365D] text-white px-4 text-[8px] font-black uppercase tracking-widest border-none shadow-lg active:scale-95 transition-all">
                                                <Navigation className="h-2.5 w-2.5 mr-1" /> Route Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto opacity-30">
                            <Activity className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                           {userLocation ? "Scan Area for Results" : "Radar Signal Inactive"}
                        </p>
                        {!userLocation && !locationDenied && (
                             <Button onClick={syncGPS} variant="outline" className="rounded-full h-10 px-8 text-[9px] font-black uppercase border-primary/20 text-primary">Start Radar</Button>
                        )}
                    </div>
                )}
            </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .medical-popup .leaflet-popup-content-wrapper {
            border-radius: 16px;
            padding: 4px;
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);
            border: 2px solid white;
        }
        .medical-popup .leaflet-popup-tip { display: none; }
      `}</style>
    </div>
  );
}

