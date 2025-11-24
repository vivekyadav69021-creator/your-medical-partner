
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { medicines, categories } from '@/lib/medicine-data';
import Link from 'next/link';

const MedicineCard = ({ id, name, price, category }: { id: string, name: string, price: string, category: string }) => {
  const image = PlaceHolderImages.find(img => img.id === id);

  return (
    <Link href={`/store/${id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="p-0">
          {image ? (
            <Image
              src={image.imageUrl}
              alt={image.description}
              width={400}
              height={400}
              className="rounded-t-lg aspect-square object-cover"
              data-ai-hint={image.imageHint}
            />
          ) : (
             <div className="rounded-t-lg aspect-square object-cover bg-secondary flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No Image</p>
             </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col">
          <CardTitle className="text-base font-semibold line-clamp-2">{name}</CardTitle>
          <CardDescription className="text-xs mt-1">{category}</CardDescription>
          <p className="text-base font-bold mt-auto pt-2">{price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}


export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredMedicines = medicines
    .filter(med => selectedCategory === 'All' || med.category === selectedCategory)
    .filter(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Medical Store</h1>
        <p className="text-muted-foreground">
          Order medicines and health products from the comfort of your home.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for medicines..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[240px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map(med => (
            <MedicineCard key={med.id} {...med} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No medicines found.</p>
        )}
      </div>
    </div>
  );
}

    