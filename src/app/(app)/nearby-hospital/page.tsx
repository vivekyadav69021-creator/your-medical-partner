
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

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });

// API Configuration
const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || 'czghQOGKafhd2gnuLjpMzF2bIly8lhp3';

type Hospital = {
  id: string;
  dist: number;
  poi: {
    name: string;
    phone?: string;
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
 * Component to handle map center updates
 */
function ChangeView({ center }: { center: [number, number] }) {
  const map = (useMap as any)();
  useEffect(() => {
    if (center && map) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

export default function NearbyHospitalPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const [radius, setRadius] = useState<string>('5000');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const L = typeof window !== 'undefined' ? require('leaflet') : null;

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
    setStatus('Scanning medical network...');

    try {
      const url = `https://api.tomtom.com/search/2/poiSearch/hospital.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=${radius}&categorySet=7311&limit=20`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const results = data?.results || [];
      
      setHospitals(results);
      setStatus(results.length === 0 ? `No facilities found within ${parseInt(radius)/1000}km.` : `Found ${results.length} clinical nodes.`);
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to reach servers.");
      toast({ variant: "destructive", title: "Search Failed", description: "Could not fetch nearby facilities." });
    } finally {
      setIsLoading(false);
    }
  }, [radius, toast]);

  const handleGetLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setErrorMessage("Geolocation is not supported.");
      return;
    }

    setIsLoading(true);
    setStatus('Acquiring GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        fetchHospitals(latitude, longitude);
      },
      (error) => {
        setIsLoading(false);
        let msg = "Location access denied. Please enable location services.";
        if (error.code === 3) msg = "GPS lookup timed out. Try again.";
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
    if (confirm('Start emergency call to 112?')) {
      window.location.href = 'tel:112';
    }
  };

  const openInMaps = (h: Hospital) => {
    const { lat, lon } = h?.position || {};
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
      
      {/* Premium Header */}
      <header className="sticky top-0 z-[1000] px-4 py-4 bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="active:scale-90 transition-transform">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
              <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-white" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-[#1A365D] dark:text-white tracking-tight uppercase leading-none">Emergency Hub</h1>
            <p className="text-[7px] font-black text-primary uppercase tracking-[0.2em]">Clinical Node Radar</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGetLocation} 
            disabled={isLoading}
            className="rounded-full h-10 w-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm active:rotate-180 transition-transform duration-500"
          >
            <RotateCcw className={cn("h-4 w-4 text-primary", isLoading && "animate-spin")} />
          </Button>
          <Button onClick={handleCallEmergency} variant="destructive" size="sm" className="rounded-full font-black text-[9px] uppercase tracking-widest px-5 h-10 shadow-lg shadow-red-500/20 active:scale-95 transition-all">
            <Siren className="w-3.5 h-3.5 mr-1.5 animate-pulse" /> SOS
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Large Map Screen */}
        <div className="relative w-full h-[40vh] md:h-[50vh] bg-slate-200 z-10">
            {userLocation ? (
                <MapContainer 
                    center={userLocation} 
                    zoom={14} 
                    className="w-full h-full"
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    />
                    <ChangeView center={userLocation} />
                    
                    {/* User Marker */}
                    {userIcon && <Marker position={userLocation} icon={userIcon}><Popup>Your Location</Popup></Marker>}
                    
                    {/* Hospital Markers */}
                    {hospitalIcon && filteredHospitals.map(hospital => (
                        <Marker 
                            key={hospital.id} 
                            position={[hospital.position.lat, hospital.position.lon]}
                            icon={hospitalIcon}
                        >
                            <Popup>
                                <div className="p-1 space-y-2">
                                    <p className="font-black text-xs uppercase text-slate-800">{hospital.poi.name}</p>
                                    <Button size="sm" className="w-full h-7 text-[8px] uppercase font-black" onClick={() => openInMaps(hospital)}>Directions</Button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 gap-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Searching Satellites...</p>
                </div>
            )}
            
            {/* Map Overlay Controls */}
            <div className="absolute bottom-6 left-4 right-4 z-[1000] flex gap-3">
                 <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                        placeholder="Search nearby..."
                        className="rounded-full h-11 pl-10 bg-white/90 dark:bg-slate-900/90 border-none shadow-xl text-xs font-bold backdrop-blur-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={radius} onValueChange={(val) => setRadius(val)}>
                    <SelectTrigger className="w-[100px] h-11 rounded-full bg-white/90 dark:bg-slate-900/90 border-none font-black text-[9px] uppercase shadow-xl backdrop-blur-md">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl backdrop-blur-xl">
                        <SelectItem value="2000">2 KM</SelectItem>
                        <SelectItem value="5000">5 KM</SelectItem>
                        <SelectItem value="10000">10 KM</SelectItem>
                        <SelectItem value="20000">20 KM</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <Button 
                onClick={handleGetLocation} 
                className="absolute top-4 right-4 z-[1000] rounded-full h-11 w-11 bg-white/90 dark:bg-slate-800/90 shadow-xl border-none backdrop-blur-md text-primary"
                size="icon"
            >
                <LocateFixed className="h-5 w-5" />
            </Button>
        </div>

        {/* Dynamic List Section */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-t-[2.5rem] -mt-6 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
            <div className="px-6 pt-6 pb-2 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <h3 className="text-xs font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-widest">Facility Stream</h3>
                </div>
                <Badge variant="outline" className="text-[8px] font-black border-primary/20 bg-primary/5 text-primary uppercase px-3">{filteredHospitals.length} Results</Badge>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide">
                {isLoading ? (
                    <div className="space-y-4 pt-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 space-y-3">
                                <Skeleton className="h-4 w-3/4 rounded-full" />
                                <Skeleton className="h-3 w-full rounded-full" />
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-9 flex-1 rounded-xl" />
                                    <Skeleton className="h-9 flex-1 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredHospitals.length > 0 ? (
                    <div className="space-y-4 pt-4">
                        {filteredHospitals.map((hospital) => (
                            <div key={hospital.id} className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 shadow-sm transition-all active:scale-[0.98]">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                        <HospitalIcon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-tight truncate">{hospital.poi.name}</h4>
                                        <div className="flex items-center gap-1.5 opacity-60">
                                            <MapPin className="h-3 w-3" />
                                            <p className="text-[10px] font-bold truncate">{hospital.address.freeformAddress}</p>
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-2">
                                            <Navigation className="h-2.5 w-2.5 text-primary animate-pulse" />
                                            <span className="text-[8px] font-black text-primary uppercase tracking-widest">
                                                {hospital.dist < 1000 ? `${hospital.dist}M` : `${(hospital.dist/1000).toFixed(1)}KM`} Away
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-5">
                                    <Button onClick={() => openInMaps(hospital)} className="rounded-xl h-10 bg-primary text-white font-black text-[9px] uppercase tracking-widest shadow-md">
                                        <Navigation className="h-3 w-3 mr-2" /> Route
                                    </Button>
                                    <Button asChild variant="outline" className="rounded-xl h-10 border-slate-200 dark:border-slate-700 font-black text-[9px] uppercase tracking-widest">
                                        <a href={hospital.poi.phone ? `tel:${hospital.poi.phone}` : '#'}>
                                            <PhoneCall className="h-3 w-3 mr-2 text-emerald-500" /> Call
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-6">
                        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto">
                            <ShieldAlert className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No clinical nodes detected</p>
                        <Button onClick={handleGetLocation} variant="outline" className="rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest">Reroute Scan</Button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm p-6 flex items-center justify-center">
             <Alert className="rounded-[2.5rem] border-none bg-white dark:bg-slate-900 p-8 shadow-2xl max-w-sm animate-in zoom-in-95 duration-500">
                <AlertTriangle className="h-6 w-6 text-rose-500" />
                <AlertTitle className="text-sm font-black uppercase text-rose-600 mt-2">Signal Failed</AlertTitle>
                <AlertDescription className="text-[11px] font-bold text-slate-500 mt-2 leading-relaxed">
                    {errorMessage}
                </AlertDescription>
                <Button onClick={handleGetLocation} className="mt-6 w-full rounded-2xl bg-rose-500 text-white h-12 text-[10px] font-black uppercase tracking-widest">Initialize System Retry</Button>
                <Button onClick={() => setErrorMessage(null)} variant="ghost" className="mt-2 w-full text-[9px] font-black uppercase text-slate-400">Cancel</Button>
            </Alert>
        </div>
      )}
    </div>
  );
}
