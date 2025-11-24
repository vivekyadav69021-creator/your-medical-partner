'use client';

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
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          {image && (
            <Image
              src={image.imageUrl}
              alt={image.description}
              width={400}
              height={400}
              className="rounded-md aspect-square object-cover"
              data-ai-hint={image.imageHint}
            />
          )}
        </CardHeader>
        <CardContent>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{category}</CardDescription>
          <p className="text-lg font-bold mt-2">{price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}


export default function StorePage() {
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
          <Input placeholder="Search for medicines..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {medicines.map(med => (
          <MedicineCard key={med.id} {...med} />
        ))}
      </div>
    </div>
  );
}
