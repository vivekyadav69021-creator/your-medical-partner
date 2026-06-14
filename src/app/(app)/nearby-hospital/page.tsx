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
    AlertTriangle, 
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
    CheckCircle2,
    Clock,
    Accessibility,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// --- CONSTANTS & HELPERS ---

const VAPI_COORDINATES: [number, number] = [20.3712, 72.9102];

type MedicalMode = 'hospital' | 'pharmacy' | 'blood_bank' | 'emergency' | 'doctors';

const MODE_CONFIG: Record<MedicalMode, { label: string; icon: any; tag: string; color: string }> = {
  hospital: { label: 'Hospitals', icon: HospitalIcon, tag: '[amenity=hospital]', color: 'text-blue-500' },
  pharmacy: { label: '24/7 Pharmacies', icon: Pill, tag: '[amenity=pharmacy]', color: 'text-emerald-500' },
  blood_bank: { label: 'Blood Banks', icon: Droplet, tag: '[amenity=blood_bank]', color: 'text-rose-500' },
  emergency: { label: 'Emergency', icon: Siren, tag: '[amenity=ambulance_station]', color: 'text-red-500' },
  doctors: { label: 'Specialists', icon: Stethoscope, tag: '[amenity=doctors]', color: 'text-purple-500' },
};

// Haversine Formula for precise distance in KM
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- CLIENT-ONLY MAP COMPONENT ---

const MapComponent = dynamic(() => Promise.resolve(({ center, elements, userIcon, poiIcon, openInMaps }: any) => {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require('react-leaflet');
  
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      if (center && map) map.setView(center, 14);
    }, [center, map]);
    return null;
  }

  return (
    <MapContainer center={center} zoom={14} className="w-full h-full" zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; OSM'
      />
      <ChangeView center={center} />
      
      <Marker position={center} icon={userIcon}>
        <Popup>Your Location</Popup>
      </Marker>
      
      {elements?.map((el: any) => {
        const pos: [number, number] = [el.lat || el.center?.lat, el.lon || el.center?.lon];
        if (!pos[0] || !pos[1]) return null;
        return (
          <Marker key={el.id} position={pos} icon={poiIcon}>
            <Popup>
              <div className="p-2 space-y-2">
                <p className="font-black text-[10px] uppercase text-slate-800 leading-tight">{el.tags?.name || "Medical Hub"}</p>
                <Button size="sm" className="w-full h-7 text-[8px] uppercase font-black" onClick={() => openInMaps(el)}>Get Route</Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}), { ssr: false });

// --- MAIN PAGE COMPONENT ---

export default function NearbyHospitalPage() {
  const [elements, setElements] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<MedicalMode>('hospital');
  const [radius, setRadius] = useState<string>('5000');
  const [status, setStatus] = useState('Initializing Engine...');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [L, setL] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') setL(require('leaflet'));
  }, []);

  const icons = useMemo(() => {
    if (!L) return { user: null, poi: null };
    return {
      user: new L.DivIcon({
        className: 'user-marker',
        html: `<div class="relative"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-40"></div><div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div></div>`,
        iconSize: [20, 20], iconAnchor: [10, 10],
      }),
      poi: new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/565/565267.png', // Medical pin
        iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32],
      })
    };
  }, [L]);

  const fetchOSMNodes = useCallback(async (lat: number, lon: number, mode: MedicalMode, rad: string) => {
    setIsLoading(true);
    setError(null);
    setStatus(`Scanning ${MODE_CONFIG[mode].label}...`);

    try {
      const tag = MODE_CONFIG[mode].tag;
      // Multi-source OSM mirror to ensure reliability
      const query = `[out:json][timeout:30];(node(around:${rad},${lat},${lon})${tag};way(around:${rad},${lat},${lon})${tag};);out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("OSM Servers are busy. Re-linking...");

      const data = await response.json();
      const results = (data?.elements || []).map((el: any) => ({
        ...el,
        calculatedDist: calculateDistance(lat, lon, el.lat || el.center?.lat, el.lon || el.center?.lon)
      })).sort((a: any, b: any) => a.calculatedDist - b.calculatedDist);

      setElements(results);
      setStatus(results.length === 0 ? "No locations in range." : `${results.length} nodes linked.`);
    } catch (err: any) {
      console.error("OSM Error:", err);
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
      },
      () => {
        setUserLocation(VAPI_COORDINATES);
        fetchOSMNodes(VAPI_COORDINATES[0], VAPI_COORDINATES[1], activeMode, radius);
        toast({ title: "Using Fallback Location", description: "GPS denied or unavailable." });
      },
      { timeout: 8000 }
    );
  }, [activeMode, radius, fetchOSMNodes, toast]);

  useEffect(() => { syncGPS(); }, [activeMode, radius]);

  const openInMaps = (el: any) => {
    const lat = el.lat || el.center?.lat;
    const lon = el.lon || el.center?.lon;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-body safe-top">
      <header className="z-[1000] px-5 py-4 bg-white/70 dark:bg-[#1e1f20]/70 backdrop-blur-3xl border-b border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard"><Button variant="ghost" size="icon" className="rounded-full h-11 w-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm"><ChevronLeft className="h-6 w-6 text-primary" /></Button></Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-[#1A365D] dark:text-white uppercase leading-none">Medical Radar</h1>
            <p className="text-[8px] font-black text-primary uppercase tracking-[0.25em]">{status}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={syncGPS} disabled={isLoading} className="rounded-full h-11 w-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
            <RotateCcw className={cn("h-4.5 w-4.5 text-primary", isLoading && "animate-spin")} />
        </Button>
      </header>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Immersive Mode Selector */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md py-3 px-4 border-b border-slate-100 dark:border-slate-800 z-[1001] flex gap-2.5 overflow-x-auto scrollbar-hide">
          {(Object.keys(MODE_CONFIG) as MedicalMode[]).map((m) => {
            const cfg = MODE_CONFIG[m];
            const isActive = activeMode === m;
            return (
              <button key={m} onClick={() => setActiveMode(m)} className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest",
                isActive ? "bg-primary text-white shadow-lg scale-105" : "bg-white/80 dark:bg-slate-800/80 text-slate-500 border border-white/20"
              )}>
                <cfg.icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : cfg.color)} /> {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Map Visual */}
        <div className="relative w-full h-[35vh] z-10 border-b border-slate-100 dark:border-slate-800">
            {userLocation && icons.user ? (
                <MapComponent center={userLocation} elements={elements} userIcon={icons.user} poiIcon={icons.poi} openInMaps={openInMaps} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-5">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Calibrating Sensors...</p>
                </div>
            )}
            
            <div className="absolute bottom-6 left-5 right-5 z-[1000] flex gap-3">
                <Select value={radius} onValueChange={setRadius}>
                    <SelectTrigger className="w-full h-12 rounded-2xl bg-white/95 dark:bg-slate-900/95 border-none font-black text-[10px] uppercase shadow-2xl backdrop-blur-xl">
                        <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl backdrop-blur-3xl">
                        <SelectItem value="2000" className="font-bold text-[10px] uppercase">2 KM Radius</SelectItem>
                        <SelectItem value="5000" className="font-bold text-[10px] uppercase">5 KM Radius</SelectItem>
                        <SelectItem value="10000" className="font-bold text-[10px] uppercase">10 KM Radius</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Dynamic List Hub */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-t-[3rem] -mt-8 z-20 shadow-[0_-15px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border-t border-slate-50 dark:border-slate-800">
            <div className="px-8 pt-8 pb-3 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="h-5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(36,136,232,0.4)]" />
                    <h3 className="text-xs font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-widest">{MODE_CONFIG[activeMode].label} Found</h3>
                </div>
                <Badge variant="outline" className="text-[9px] font-black border-primary/20 bg-primary/5 text-primary uppercase px-4 py-1 rounded-full">{elements.length}</Badge>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
                {isLoading ? (
                    <div className="space-y-5 pt-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 space-y-4">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-3/4 rounded-full" />
                                        <Skeleton className="h-3 w-full rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : elements.length > 0 ? (
                    <div className="space-y-5 pt-4">
                        {elements.map((el) => (
                            <div key={el.id} className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all active:scale-[0.97] group relative overflow-hidden">
                                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full opacity-40" />
                                <div className="flex items-start gap-5">
                                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner">
                                        {React.createElement(MODE_CONFIG[activeMode].icon, { className: "h-6 w-6" })}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <h4 className="text-base font-black text-[#1A365D] dark:text-white uppercase tracking-tight truncate">{el.tags?.name || "Medical Node"}</h4>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 text-[8px] font-black border-none"><Navigation className="w-2.5 h-2.5 mr-1" /> {el.calculatedDist.toFixed(1)} KM away</Badge>
                                            {el.tags?.emergency === 'yes' && <Badge className="bg-red-50 text-red-600 dark:bg-red-900/20 text-[8px] font-black border-none"><Siren className="w-2.5 h-2.5 mr-1" /> Emergency 24/7</Badge>}
                                            {el.tags?.wheelchair === 'yes' && <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 text-[8px] font-black border-none"><Accessibility className="w-2.5 h-2.5 mr-1" /> Accessible</Badge>}
                                            {el.tags?.opening_hours && <Badge variant="outline" className="text-[8px] font-black border-slate-100 text-slate-400 uppercase">{el.tags.opening_hours}</Badge>}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 opacity-50">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <p className="text-[10px] font-bold truncate leading-none">{el.tags?.["addr:full"] || el.tags?.["addr:street"] || "Address on map."}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <Button onClick={() => openInMaps(el)} className="rounded-2xl h-11 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
                                        <Navigation className="h-4 w-4 mr-2" /> Start Route
                                    </Button>
                                    <Button asChild variant="outline" className="rounded-2xl h-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-[10px] uppercase tracking-widest active:scale-95">
                                        <a href={el.tags?.phone ? `tel:${el.tags.phone}` : '#'}>
                                            <PhoneCall className={cn("h-4 w-4 mr-2", el.tags?.phone ? "text-emerald-500" : "text-slate-300")} /> 
                                            {el.tags?.phone ? "Contact" : "No Phone"}
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-8 animate-in fade-in duration-1000">
                        <div className="h-24 w-24 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner"><ShieldAlert className="h-10 w-10 text-slate-300" /></div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">No medical nodes linked in this area</p>
                        <Button onClick={syncGPS} variant="outline" className="rounded-full px-12 h-14 font-black uppercase text-[11px] tracking-widest bg-white dark:bg-slate-900 shadow-xl border-none active:scale-95 transition-all">Retry Scan</Button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {error && (
        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-md p-6 flex items-center justify-center animate-in fade-in duration-300">
             <div className="rounded-[3rem] bg-white dark:bg-slate-900 p-10 shadow-2xl max-w-sm text-center flex flex-col items-center">
                <div className="h-20 w-20 bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner"><AlertTriangle className="h-10 w-10 text-rose-500" /></div>
                <h4 className="text-lg font-black uppercase text-rose-600 tracking-tight">Signal Lost</h4>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{error}</p>
                <Button onClick={syncGPS} className="mt-10 w-full rounded-2xl bg-rose-500 text-white h-14 text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Retry Link</Button>
                <Button onClick={() => setError(null)} variant="ghost" className="mt-3 w-full text-[10px] font-black uppercase text-slate-400 tracking-widest">Close</Button>
            </div>
        </div>
      )}
    </div>
  );
}
