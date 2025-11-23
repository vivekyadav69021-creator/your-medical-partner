import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';

const medicines = [
  { id: 'medicine-1', name: 'Paracetamol', price: '₹50.00', category: 'Pain Relief', stock: 120 },
  { id: 'medicine-2', name: 'Ibuprofen', price: '₹80.00', category: 'Pain Relief', stock: 80 },
  { id: 'medicine-3', name: 'Amoxicillin', price: '₹150.00', category: 'Antibiotics', stock: 50 },
  { id: 'medicine-4', name: 'Cough Syrup', price: '₹120.00', category: 'Cold & Flu', stock: 200 },
  { id: 'medicine-5', name: 'Allergy Relief', price: '₹95.00', category: 'Allergies', stock: 75 },
  { id: 'medicine-6', name: 'Vitamin D', price: '₹250.00', category: 'Vitamins', stock: 150 },
];

const categories = ['All', 'Pain Relief', 'Antibiotics', 'Cold & Flu', 'Allergies', 'Vitamins'];

const MedicineCard = ({ id, name, price, category }: { id: string, name: string, price: string, category: string }) => {
  const image = PlaceHolderImages.find(img => img.id === id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{price}</DialogDescription>
        </DialogHeader>
        {image && (
          <Image
            src={image.imageUrl}
            alt={image.description}
            width={400}
            height={400}
            className="rounded-md aspect-square object-cover my-4"
            data-ai-hint={image.imageHint}
          />
        )}
        <p className="text-sm text-muted-foreground">
          This is a general-purpose medicine. Please consult your doctor before use. Read the label carefully for dosage and side effects.
        </p>
        <DialogFooter>
          <Button type="button" className="w-full">
            Buy Medicine
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
