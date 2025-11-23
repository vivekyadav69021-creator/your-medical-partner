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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

const indianDoctors = [
  { name: 'Dr. Ananya Sharma', specialty: 'Cardiologist', rating: 4.9, imageId: 'doctor-1' },
  { name: 'Dr. Vikram Singh', specialty: 'Dermatologist', rating: 4.8, imageId: 'doctor-2' },
  { name: 'Dr. Priya Patel', specialty: 'Pediatrician', rating: 4.9, imageId: 'doctor-3' },
  { name: 'Dr. Arjun Gupta', specialty: 'Neurologist', rating: 4.7, imageId: 'doctor-4' },
];

const foreignDoctors = [
  { name: 'Dr. John Smith', specialty: 'General Physician', rating: 4.8, imageId: 'doctor-5' },
  { name: 'Dr. Emily Williams', specialty: 'Orthopedist', rating: 4.9, imageId: 'doctor-6' },
];

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

const DoctorCard = ({ name, specialty, rating, imageId }: { name: string, specialty: string, rating: number, imageId: string }) => {
  const image = PlaceHolderImages.find(img => img.id === imageId);

  return (
    <Card>
      <CardHeader className="flex-row gap-4 items-start">
        {image && (
          <Image
            src={image.imageUrl}
            alt={image.description}
            width={80}
            height={80}
            className="rounded-full border-2 border-primary"
            data-ai-hint={image.imageHint}
          />
        )}
        <div className="flex-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{specialty}</CardDescription>
           <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400"/>
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Experienced {specialty} with over 10 years of practice. Fluent in English and Hindi.</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Book Appointment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book Appointment with {name}</DialogTitle>
              <DialogDescription>
                Select a date and time for your consultation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                 <Calendar
                    mode="single"
                    selected={new Date()}
                    className="rounded-md border"
                  />
              </div>
              <div>
                <Label htmlFor="time-slot" className="text-right mb-2 block">
                  Time Slot
                </Label>
                <Select>
                  <SelectTrigger id="time-slot">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};


export default function ConsultationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Doctor Consultation</h1>
        <p className="text-muted-foreground">
          Find and book appointments with top doctors.
        </p>
      </div>

      <Tabs defaultValue="indian">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="indian">Indian Doctors</TabsTrigger>
          <TabsTrigger value="foreign">Foreign Doctors</TabsTrigger>
        </TabsList>
        <TabsContent value="indian" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {indianDoctors.map(doctor => <DoctorCard key={doctor.name} {...doctor} />)}
          </div>
        </TabsContent>
        <TabsContent value="foreign" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {foreignDoctors.map(doctor => <DoctorCard key={doctor.name} {...doctor} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
