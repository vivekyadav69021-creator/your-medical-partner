
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { medicines as staticMedicines, Medicine } from '@/lib/medicine-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ShoppingCart, 
  Plus, 
  Share2, 
  AlertCircle,
  ShieldCheck,
  Loader2,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SmallMedicineCard = ({ id, name, price, imageUrl }: { id: string, name: string, price: string | number, imageUrl?: string }) => {
  const staticImage = PlaceHolderImages.find(img => img.id === id);
  const formattedPrice = typeof price === 'number' ? `₹${price.toFixed(2)}` : price;

  return (
    <Link href={`/store/${id}`} className="min-w-[140px] block group">
      <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 h-full flex flex-col shadow-sm transition-all group-hover:shadow-md">
        <div className="aspect-square relative rounded-2xl bg-slate-50 dark:bg-slate-800 mb-3 flex items-center justify-center overflow-hidden border border-white/50 dark:border-slate-700/50 shadow-inner">
          {(imageUrl || staticImage) ? (
            <Image 
                src={imageUrl || staticImage?.imageUrl || ''} 
                alt={name} 
                fill 
                className="object-contain p-2 group-hover:scale-110 transition-transform" 
                unoptimized
            />
          ) : <Package className="w-6 h-6 text-slate-200" />}
        </div>
        <h5 className="text-[10px] font-black text-[#1A365D] dark:text-slate-100 line-clamp-1 mb-2 uppercase tracking-tight">{name}</h5>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-black text-[10px] text-primary">{formattedPrice}</span>
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Plus className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function MedicineDetailPage() {
  const params = useParams();
  const medicineId = params.medicineId as string;
  const { addToCart, cart } = useCart();
  const { toast } = useToast();
  const firestore = useFirestore();

  const staticMedicine = staticMedicines.find(m => m.id === medicineId);

  const medicineDocRef = useMemoFirebase(() => {
    if (staticMedicine || !firestore) return null;
    return doc(firestore, 'medicines', medicineId);
  }, [firestore, medicineId, staticMedicine]);

  const { data: dbMedicine, isLoading: isDbLoading } = useDoc<any>(medicineDocRef);

  const medicine = staticMedicine || dbMedicine;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = () => {
    if (!medicine) return;
    addToCart(medicine as Medicine);
    toast({
      title: "Added to Bag",
      description: `${medicine.name} is ready for checkout.`,
    });
  };

  if (isDbLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-[#020617]">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Identifying Unit...</p>
        </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-[#020617] space-y-6">
        <div className="h-20 w-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 shadow-inner">
            <AlertCircle className="h-10 w-10" />
        </div>
        <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Access Denied</h1>
            <p className="text-sm font-medium text-slate-400 max-w-xs uppercase">Product restricted or removed from inventory.</p>
        </div>
        <Button asChild className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl">
            <Link href="/store">Back to Store</Link>
        </Button>
      </div>
    );
  }

  const staticImage = PlaceHolderImages.find(img => img.id === medicine.id);
  const imageUrl = medicine.imageUrl || staticImage?.imageUrl;
  const popularMeds = staticMedicines.filter(m => m.id !== medicine.id).slice(0, 8);

  const formattedPrice = typeof medicine.price === 'number' ? `₹${medicine.price.toFixed(2)}` : medicine.price;
  const formattedDiscounted = medicine.discountedPrice ? `₹${Number(medicine.discountedPrice).toFixed(2)}` : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-40 font-body safe-top overflow-x-hidden">
      <div className="max-w-xl mx-auto px-5 pt-8 space-y-8">
        
        <div className="flex items-center justify-between">
          <Link href="/store" className="active:scale-90 transition-transform">
            <div className="h-11 w-11 md:h-12 md:w-12 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
            </div>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-2xl h-10 w-10 md:h-11 md:w-11 bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800">
              <Share2 className="h-5 w-5 text-primary" />
            </Button>
            <Link href="/store/cart" className="relative active:scale-90 transition-transform">
              <div className="h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 text-white flex items-center justify-center rounded-full text-[8px] font-black border-2 border-white dark:border-[#020617] animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-6 md:p-8 shadow-2xl border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col items-center gap-6 md:gap-8 relative z-10">
            <div className="h-56 md:h-72 w-full relative bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] flex items-center justify-center overflow-hidden shadow-inner border border-white dark:border-slate-800">
              {imageUrl ? (
                <Image 
                  src={imageUrl} 
                  alt={medicine.name} 
                  fill 
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-1000" 
                  unoptimized
                />
              ) : <Package className="w-16 h-16 text-slate-200" />}
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                 <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary text-[8px] font-black uppercase border-none px-3 h-6 rounded-lg shadow-sm">
                    {medicine.category}
                 </Badge>
                 {medicine.prescriptionRequired && (
                    <Badge variant="destructive" className="bg-rose-500/90 text-white text-[8px] font-black uppercase border-none px-3 h-6 rounded-lg shadow-sm flex items-center gap-1.5">
                        <AlertTriangle className="h-2.5 w-2.5" /> Rx Required
                    </Badge>
                 )}
              </div>
            </div>

            <div className="w-full space-y-5 text-center md:text-left">
              <div className="space-y-1.5">
                <h2 className="text-2xl md:text-3xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight leading-tight">{medicine.name}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{medicine.brand || 'Clinical Approved'}</p>
                    {medicine.genericComposition && (
                        <p className="text-[10px] font-bold text-slate-400 uppercase italic">Formula: {medicine.genericComposition}</p>
                    )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="text-center md:text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Market Cost</p>
                  <div className="flex items-baseline gap-2">
                    <span className={cn("font-black tracking-tighter", formattedDiscounted ? "text-slate-300 text-lg line-through" : "text-3xl text-primary")}>
                        {formattedPrice}
                    </span>
                    {formattedDiscounted && (
                        <span className="text-3xl font-black text-emerald-500 tracking-tighter">{formattedDiscounted}</span>
                    )}
                  </div>
                </div>
                <Button size="lg" className="w-full md:w-auto rounded-2xl h-16 px-10 bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-black uppercase text-[11px] tracking-widest gap-3" onClick={handleAddToCart}>
                  <Plus className="h-5 w-5" /> Add to Order
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Tabs */}
        <Tabs defaultValue="benefits" className="space-y-6">
            <TabsList className="grid grid-cols-3 h-14 p-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[1.8rem] border border-white/40 shadow-sm mx-1">
                <TabsTrigger value="benefits" className="rounded-2xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Benefits</TabsTrigger>
                <TabsTrigger value="dosage" className="rounded-2xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Dosage</TabsTrigger>
                <TabsTrigger value="safety" className="rounded-2xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Safety</TabsTrigger>
            </TabsList>

            <TabsContent value="benefits" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500"><CheckCircle2 className="h-6 w-6" /></div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-100">Key Uses & Benefits</h4>
                    </div>
                    <div className="grid gap-4">
                        {(medicine.benefits || [medicine.description]).map((benefit: string, i: number) => (
                            <div key={i} className="flex gap-4 items-start bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{benefit}</p>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                        <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 text-[8px] font-black uppercase">Generic Alternative Recommended</Badge>
                        <ArrowRight className="h-3 w-3 text-blue-400" />
                    </div>
                </Card>
            </TabsContent>

            <TabsContent value="dosage" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-primary"><Clock className="h-6 w-6" /></div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-100">Timing & Instructions</h4>
                    </div>
                    <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/80 border border-white dark:border-slate-700">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">"{medicine.dosageInstruction || 'Consult your physician for exact cycle details.'}"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <MiniInfo label="Storage" value={medicine.storageAdvice || 'Dry place'} icon={Thermometer} />
                            <MiniInfo label="Pack" value={medicine.packagingDetails || 'Standard'} icon={Package} />
                        </div>
                    </div>
                </Card>
            </TabsContent>

            <TabsContent value="safety" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6 border-l-8 border-l-rose-500">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500"><ShieldAlert className="h-6 w-6" /></div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-rose-600">Side Effects & Contraindications</h4>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Common Symptoms</p>
                            <div className="flex flex-wrap gap-2">
                                {(medicine.sideEffects || []).map((eff: string, i: number) => (
                                    <Badge key={i} variant="outline" className="border-rose-100 text-rose-500 font-bold px-4 py-1.5 rounded-xl uppercase text-[9px]">{eff}</Badge>
                                ))}
                            </div>
                            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 mt-4">
                                <p className="text-[9px] font-black uppercase text-rose-500 mb-2">Avoid if:</p>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed">{medicine.contraindications || 'No severe warnings reported.'}</p>
                            </div>
                        </div>
                    </Card>

                    <div className="p-6 rounded-[2rem] bg-amber-50 border-2 border-dashed border-amber-200 text-center flex flex-col items-center gap-2">
                        <Info className="h-5 w-5 text-amber-500" />
                        <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest leading-relaxed">
                            Medical Disclaimer: Information is for educational use. Never start medication without verified clinical prescription.
                        </p>
                    </div>
                </div>
            </TabsContent>
        </Tabs>

        <div className="space-y-5">
            <div className="flex items-center gap-3 px-1">
                <div className="h-4 w-1 bg-primary rounded-full" />
                <h2 className="text-[11px] md:text-sm font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-widest">Global Alternatives</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scrollbar-hide">
                {popularMeds.map(med => (
                    <SmallMedicineCard key={med.id} id={med.id} name={med.name} price={med.price} imageUrl={med.imageUrl} />
                ))}
            </div>
        </div>
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function MiniInfo({ label, value, icon: Icon }: any) {
    return (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1 opacity-60">
                <Icon className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-[10px] font-bold text-[#1A365D] dark:text-white uppercase truncate">{value}</p>
        </div>
    )
}
