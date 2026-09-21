
'use client';

import React, { useState, useRef, useActionState, useEffect, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Loader2, 
  Camera, 
  Plus, 
  ChevronLeft,
  ShoppingCart,
  LayoutGrid,
  Pill,
  Baby,
  Sparkles,
  Stethoscope,
  Activity,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { medicines, categories, Medicine } from '@/lib/medicine-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { analyzePrescriptionAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const initialAnalysisState = {
  result: null,
  error: null,
};

const AIPrescriptionBanner = () => {
  const [state, formAction] = useActionState(analyzePrescriptionAction, initialAnalysisState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { pending } = useFormStatus();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const formData = new FormData();
        formData.set('imageDataUri', e.target?.result as string);
        startTransition(() => {
            formAction(formData);
        });
        toast({ title: "Analyzing Prescription", description: "AI is identifying medicines..." });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1A365D] to-primary p-6 text-white shadow-2xl shadow-primary/20 mb-8 group active:scale-[0.98] transition-all">
      <div className="flex items-center gap-5 relative z-10">
        <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:rotate-6 transition-transform">
          <Camera className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black uppercase tracking-tight leading-none mb-1">AI Prescription</h3>
          <p className="text-[8px] font-bold text-blue-200 uppercase tracking-widest mb-3 opacity-80">Instant Order via Photo</p>
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-xl bg-white text-[#1A365D] hover:bg-blue-50 font-black text-[9px] uppercase tracking-widest px-6 h-9 shadow-lg"
            onClick={() => fileInputRef.current?.click()}
            disabled={pending}
          >
            {pending ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Plus className="h-3 w-3 mr-2" />}
            Scan Prescription
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>
      </div>
      <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-bl-full pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 h-20 w-20 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

const CategoryItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    className="flex flex-col items-center gap-2.5 transition-all active:scale-90 shrink-0"
    onClick={onClick}
  >
    <div className={cn(
      "h-14 w-14 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
      active 
        ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105" 
        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-primary/20"
    )}>
      <Icon className={cn("h-6 w-6", active ? "text-white" : "group-hover:scale-110")} />
    </div>
    <span className={cn("text-[9px] font-black uppercase tracking-widest", active ? "text-primary" : "text-slate-400")}>
        {label.split(' ')[0]}
    </span>
  </button>
);

const MedicineCard = ({ id, name, price, category }: { id: string, name: string, price: string, category: string }) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const med = medicines.find(m => m.id === id);
    if (med) {
      addToCart(med as Medicine);
      toast({ title: "Added to Bag", description: `${name} ready for checkout.` });
    }
  };

  return (
    <Link href={`/store/${id}`} className="block h-full group">
      <Card className="rounded-[2rem] border-none shadow-lg hover:shadow-xl transition-all h-full bg-white dark:bg-slate-900 overflow-hidden relative border border-transparent hover:border-primary/10">
        <CardContent className="p-3.5 flex flex-col h-full">
          {/* Enhanced Image Container with Smaller Footprint */}
          <div className="aspect-square relative rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 mb-3 flex items-center justify-center overflow-hidden border border-white/50 dark:border-slate-700/50 shadow-inner">
            {image ? (
              <Image
                src={image.imageUrl}
                alt={name}
                fill
                className="object-contain p-3 group-hover:scale-110 transition-transform duration-700"
                data-ai-hint={image.imageHint}
                unoptimized
              />
            ) : (
              <Pill className="h-8 w-8 text-slate-200" />
            )}
            <Badge className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary text-[6.5px] font-black uppercase border-none px-1.5 h-3.5 rounded-md shadow-sm">
                {category.split(' ')[0]}
            </Badge>
          </div>
          
          {/* Optimized Text Area - No extra length */}
          <div className="space-y-1 mb-3 flex-1 min-h-[2.5rem]">
            <h4 className="font-black text-[11px] text-[#1A365D] dark:text-slate-100 line-clamp-2 uppercase tracking-tight leading-[1.2]">
              {name}
            </h4>
          </div>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-[12px] font-black text-[#1A365D] dark:text-primary tracking-tighter">{price}</span>
              <span className="text-[7px] font-bold text-slate-300 uppercase">Per Unit</span>
            </div>
            <Button 
              size="icon" 
              className="rounded-xl bg-primary text-white hover:bg-primary/90 h-8 w-8 shadow-md transition-all active:scale-90"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredMedicines = medicines
    .filter(med => selectedCategory === 'All' || med.category === selectedCategory)
    .filter(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const categoryIcons: Record<string, any> = {
    'All': LayoutGrid,
    'Pain & Fever': Pill,
    'Hydration & Energy': Zap,
    'Allergy Relief': Stethoscope,
    'Skin Care': Sparkles,
    'Acidity & Indigestion': Activity,
    'Vitamins & Supplements': ShoppingBag,
    'First Aid': Pill,
    'Cold & Cough': Activity,
    'Antibiotics': Pill
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-40 font-body overflow-x-hidden safe-top">
      
      {/* PREMIUM STORE HEADER */}
      <header className="px-5 pt-8 pb-6 space-y-7">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-md active:scale-90 transition-all">
                        <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
                    </div>
                </Link>
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tighter leading-none">Medical Store</h1>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inventory Online</p>
                    </div>
                </div>
            </div>

            <Link href="/store/cart" className="relative group active:scale-90 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-md">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                {itemCount > 0 && (
                    <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-[#020617] shadow-lg animate-in zoom-in duration-300">
                        <span className="text-[9px] font-black">{itemCount}</span>
                    </div>
                )}
            </Link>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search medicines, supplements..." 
            className="pl-14 h-16 rounded-full border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/20 dark:shadow-none text-base font-bold placeholder:text-slate-300" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 space-y-10">
        
        <AIPrescriptionBanner />

        <section className="space-y-5">
            <div className="flex items-center gap-3 px-1">
                <div className="h-4 w-1 bg-primary rounded-full" />
                <h2 className="text-sm font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-widest">Shop Categories</h2>
            </div>
            <ScrollArea className="w-full whitespace-nowrap pb-2">
                <div className="flex gap-5 px-1">
                    {categories.map(cat => (
                        <CategoryItem 
                            key={cat} 
                            label={cat} 
                            icon={categoryIcons[cat] || Pill} 
                            active={selectedCategory === cat}
                            onClick={() => setSelectedCategory(cat)}
                        />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </section>

        <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <h2 className="text-sm font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-widest">Top Products</h2>
                </div>
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest rounded-lg opacity-40">
                    {filteredMedicines.length} Items
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {filteredMedicines.map(med => (
                    <div key={med.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <MedicineCard {...med} />
                    </div>
                ))}
            </div>

            {filteredMedicines.length === 0 && (
                <div className="py-24 text-center space-y-4 opacity-30">
                    <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <Search className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="font-black uppercase text-[11px] tracking-[0.3em] text-slate-500">No Match Found</p>
                </div>
            )}
        </section>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
