
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
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    Siren, 
    Navigation, 
    AlertTriangle, 
    Hospital as HospitalIcon, 
    Search,
    ChevronLeft,
    Activity,
    RotateCcw,
    ShieldAlert,
    Loader2,
    MapPin,
    PhoneCall,
    LocateFixed
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// API Configuration - Updated with highly inclusive medical categories
const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || 'czghQOGKafhd2gnuLjpMzF2bIly8lhp3';

type Hospital = {
  id: string;
  dist: number;
  poi: {
    name: string;
    phone?: string;
    categories?: string[];
  };
  address: {
    freeformAddress: string;
  };
  position: {
    lat: number;
    lon: number;
  };
};

/**
 * CLIENT-ONLY MAP COMPONENT
 */
const MapComponent = dynamic(() => Promise.resolve(({ center, hospitals, userIcon, hospitalIcon, openInMaps }: any) => {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require('react-leaflet');
  
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      if (center && map && typeof map.setView === 'function') {
        map.setView(center, 14);
      }
    }, [center, map]);
    return null;
  }

  if (!center) return null;

  return (
    <MapContainer center={center} zoom={14} className="w-full h-full" zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap'
      />
      <ChangeView center={center} />
      
      {/* User Location Marker */}
      <Marker position={center} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>
      
      {/* Hospital POI Markers */}
      {hospitals?.map((h: Hospital) => (
        <Marker 
          key={h.id} 
          position={[h.position.lat, h.position.lon]}
          icon={hospitalIcon}
        >
          <Popup>
            <div className="p-2 space-y-2">
              <p className="font-black text-[10px] uppercase text-slate-800 leading-tight">{h.poi.name}</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase">{h.dist < 1000 ? `${h.dist}m` : `${(h.dist/1000).toFixed(1)}km`} Away</p>
              <Button 
                size="sm" 
                className="w-full h-8 text-[9px] uppercase font-black bg-primary" 
                onClick={() => openInMaps(h)}
              >
                Navigate
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Waking Satellites...</p>
    </div>
  )
});

export default function NearbyHospitalPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Standby');
  const [radius, setRadius] = useState<string>('5000');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const [L, setL] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setL(require('leaflet'));
    }
  }, []);

  const userIcon = useMemo(() => {
    if (!L) return null;
    return new L.DivIcon({
      className: 'custom-user-icon',
      html: `<div class="relative"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-40"></div><div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  }, [L]);

  const hospitalIcon = useMemo(() => {
    if (!L) return null;
    return new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/565/565267.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }, [L]);

  const fetchHospitals = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatus('Scanning all medical facilities...');

    try {
      // categorySet 7311 = Hospital/Polyclinic, 9361 = Medical Clinic, 7324 = Healthcare/Emergency Service
      const categorySet = '7311,9361,7324';
      const url = `https://api.tomtom.com/search/2/categorySearch/medical.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=${radius}&categorySet=${categorySet}&limit=50&view=Unified`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API Error (${response.status})`);

      const data = await response.json();
      const results = data?.results || [];
      
      // Sort by distance
      const sortedResults = results.sort((a: any, b: any) => a.dist - b.dist);
      
      setHospitals(sortedResults);
      setStatus(sortedResults.length === 0 ? `No facilities in ${parseInt(radius)/1000}km.` : `Found ${sortedResults.length} medical hubs.`);
      
      if (sortedResults.length === 0) {
          toast({
              title: "No Results Found",
              description: "Try increasing the search radius to 10km or 20km.",
              variant: "default"
          });
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      setErrorMessage("Could not connect to medical servers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [radius, toast]);

  const handleGetLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setErrorMessage("GPS Module not detected on this device.");
      return;
    }

    setIsLoading(true);
    setStatus('Linking with GPS...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        fetchHospitals(latitude, longitude);
      },
      (error) => {
        setIsLoading(false);
        let msg = "GPS Signal Denied. Please enable location permissions.";
        if (error.code === 3) msg = "GPS Signal Timeout. Try again.";
        setErrorMessage(msg);
        toast({ variant: "destructive", title: "Location Error", description: msg });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchHospitals, toast]);

  useEffect(() => {
    handleGetLocation();
  }, [handleGetLocation]);

  const handleCallEmergency = () => {
    if (confirm('Initiate Emergency Protocol 112?')) {
      window.location.href = 'tel:112';
    }
  };

  const openInMaps = (h: Hospital) => {
    const lat = h?.position?.lat;
    const lon = h?.position?.lon;
    if (lat && lon) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
    }
  };

  const filteredHospitals = hospitals?.filter(h => 
    h?.poi?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h?.address?.freeformAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-body safe-top">
      
      {/* Premium Hub Header */}
      <header className="sticky top-0 z-[1000] px-5 py-4 bg-white/70 dark:bg-[#1e1f20]/70 backdrop-blur-3xl border-b border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="active:scale-90 transition-transform">
            <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-white" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase leading-none">Emergency Hub</h1>
            <p className="text-[8px] font-black text-primary uppercase tracking-[0.25em]">{status}</p>
          </div>
        </div>
        
        <div className="flex gap-2.5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGetLocation} 
            disabled={isLoading}
            className="rounded-full h-11 w-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm active:rotate-180 transition-transform duration-500"
          >
            <RotateCcw className={cn("h-4.5 w-4.5 text-primary", isLoading && "animate-spin")} />
          </Button>
          <Button onClick={handleCallEmergency} variant="destructive" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest px-6 h-11 shadow-lg shadow-red-500/20 active:scale-95 transition-all">
            <Siren className="w-4 h-4 mr-2 animate-pulse" /> SOS
          </Button>
        </div>
      </header>

      {/* Main Radar Screen */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {/* Radar Map Section */}
        <div className="relative w-full h-[45vh] bg-slate-100 z-10 border-b border-slate-100 dark:border-slate-800">
            {userLocation ? (
                <MapComponent 
                    center={userLocation} 
                    hospitals={filteredHospitals}
                    userIcon={userIcon}
                    hospitalIcon={hospitalIcon}
                    openInMaps={openInMaps}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                        <div className="relative p-5 bg-white dark:bg-slate-800 rounded-full shadow-xl">
                            <LocateFixed className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] animate-pulse">Scanning GPS Environment...</p>
                </div>
            )}
            
            {/* Range Controls Overlay */}
            <div className="absolute bottom-8 left-5 right-5 z-[1000] flex gap-3">
                 <div className="relative flex-1">
                    <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search nearby medical nodes..."
                        className="rounded-full h-12 pl-12 bg-white/95 dark:bg-slate-900/95 border-none shadow-2xl text-[11px] font-bold backdrop-blur-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={radius} onValueChange={(val) => { setRadius(val); if(userLocation) fetchHospitals(userLocation[0], userLocation[1]); }}>
                    <SelectTrigger className="w-[110px] h-12 rounded-full bg-white/95 dark:bg-slate-900/95 border-none font-black text-[10px] uppercase shadow-2xl backdrop-blur-xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-[1.8rem] border-none shadow-2xl backdrop-blur-3xl">
                        <SelectItem value="2000" className="font-bold text-[10px] uppercase">2 KM</SelectItem>
                        <SelectItem value="5000" className="font-bold text-[10px] uppercase">5 KM</SelectItem>
                        <SelectItem value="10000" className="font-bold text-[10px] uppercase">10 KM</SelectItem>
                        <SelectItem value="20000" className="font-bold text-[10px] uppercase">20 KM</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Clinical Stream Section */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-t-[3rem] -mt-8 z-20 shadow-[0_-15px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border-t border-slate-50 dark:border-slate-800">
            <div className="px-8 pt-8 pb-3 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="h-5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(36,136,232,0.4)]" />
                    <h3 className="text-sm font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-widest">Medical Network</h3>
                </div>
                <Badge variant="outline" className="text-[9px] font-black border-primary/20 bg-primary/5 text-primary uppercase px-4 py-1 rounded-full">{filteredHospitals.length} Found</Badge>
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
                ) : filteredHospitals.length > 0 ? (
                    <div className="space-y-5 pt-4">
                        {filteredHospitals.map((h) => (
                            <div key={h.id} className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all active:scale-[0.97] group relative overflow-hidden">
                                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full opacity-40" />
                                <div className="flex items-start gap-5">
                                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                        <HospitalIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="text-base font-black text-[#1A365D] dark:text-white uppercase tracking-tight truncate">{h?.poi?.name}</h4>
                                        <div className="flex items-center gap-2 opacity-50">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <p className="text-[10px] font-bold truncate leading-none">{h?.address?.freeformAddress || 'Address loading...'}</p>
                                        </div>
                                        <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full mt-2">
                                            <Navigation className="h-3 w-3 text-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                                {h.dist < 1000 ? `${h.dist}M` : `${(h.dist/1000).toFixed(1)}KM`} Distance
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <Button onClick={() => openInMaps(h)} className="rounded-2xl h-11 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:bg-primary/90">
                                        <Navigation className="h-4 w-4 mr-2" /> Start Route
                                    </Button>
                                    <Button asChild variant="outline" className="rounded-2xl h-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-[10px] uppercase tracking-widest transition-all">
                                        <a href={h?.poi?.phone ? `tel:${h.poi.phone}` : '#'}>
                                            <PhoneCall className={cn("h-4 w-4 mr-2", h?.poi?.phone ? "text-emerald-500" : "text-slate-300")} /> 
                                            {h?.poi?.phone ? "Call Hub" : "No Phone"}
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-8 animate-in fade-in duration-1000">
                        <div className="h-24 w-24 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                            <ShieldAlert className="h-10 w-10 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">No medical nodes detected</p>
                            <p className="text-[9px] font-bold text-slate-400/60 uppercase">Range: {parseInt(radius)/1000} KM</p>
                        </div>
                        <Button onClick={handleGetLocation} variant="outline" className="rounded-full px-12 h-14 font-black uppercase text-[11px] tracking-widest bg-white dark:bg-slate-900 shadow-xl border-none active:scale-95 transition-all">Retry Link</Button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* High-Alert Error HUD */}
      {errorMessage && (
        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-md p-6 flex items-center justify-center animate-in fade-in duration-300">
             <Alert className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-10 shadow-2xl max-w-sm animate-in zoom-in-95 duration-500 text-center flex flex-col items-center">
                <div className="h-20 w-20 bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                    <AlertTriangle className="h-10 w-10 text-rose-500" />
                </div>
                <AlertTitle className="text-lg font-black uppercase text-rose-600 tracking-tight">Signal Interrupted</AlertTitle>
                <AlertDescription className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {errorMessage}
                </AlertDescription>
                <Button onClick={handleGetLocation} className="mt-10 w-full rounded-2xl bg-rose-500 hover:bg-rose-600 text-white h-14 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/30 transition-all active:scale-95">Re-Initialize GPS</Button>
                <Button onClick={() => setErrorMessage(null)} variant="ghost" className="mt-3 w-full text-[10px] font-black uppercase text-slate-400 tracking-widest">Abort Radar</Button>
            </Alert>
        </div>
      )}
    </div>
  );
}
