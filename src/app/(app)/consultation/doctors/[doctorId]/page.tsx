
'use client';

import { useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { allDoctors, Appointment } from '@/app/(app)/consultation/page';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Star, Video, Calendar as CalendarIcon, ArrowLeft, Briefcase, IndianRupee, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.doctorId as string;
  const doctor = allDoctors.find(d => d.id === doctorId);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  if (!doctor) {
    notFound();
  }
  
  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime && doctor) {
      
      const newAppointment: Appointment = {
        id: `appt-${Date.now()}`,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: format(selectedDate, 'MMM dd, yyyy'),
        time: selectedTime,
        type: 'Video Call',
        imageId: doctor.imageId,
      };

      // Retrieve existing appointments from localStorage and add the new one
      const savedAppointments = localStorage.getItem('appointments');
      const appointments = savedAppointments ? JSON.parse(savedAppointments) : [];
      const updatedAppointments = [newAppointment, ...appointments];
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));


      toast({
        title: 'Appointment Booked!',
        description: `Your appointment with ${doctor.name} on ${format(selectedDate, 'MMM dd, yyyy')} at ${selectedTime} has been confirmed.`,
      });
      setIsDialogOpen(false);
      
      // Navigate back to the consultation page to see the updated list
      router.push('/consultation');
    }
  };

  const image = PlaceHolderImages.find(img => img.id === doctor.imageId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/consultation">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Doctors
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start gap-6">
            {image && (
              <Image
                src={image.imageUrl}
                alt={doctor.name}
                width={150}
                height={150}
                className="rounded-full border-4 border-primary shadow-md"
                data-ai-hint={image.imageHint}
              />
            )}
            <div className="flex-1">
              <Badge>{doctor.specialty}</Badge>
              <h1 className="text-4xl font-bold tracking-tight font-headline mt-2">{doctor.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400"/>
                    <span className="font-semibold text-lg">{doctor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-5 h-5"/>
                    <span className="font-semibold text-lg">{doctor.experience}</span>
                  </div>
                   <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-5 h-5"/>
                    <span className="font-semibold text-lg">{doctor.fees}</span>
                  </div>
                   <div className="flex items-center gap-1.5">
                    <MapPin className="w-5 h-5"/>
                    <span className="font-semibold text-lg">{doctor.location}</span>
                  </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <h3 className="text-xl font-semibold mb-2">About Dr. {doctor.name.split(' ').pop()}</h3>
            <p className="text-muted-foreground">{doctor.bio}</p>
        </CardContent>
        <CardFooter>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Book an Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                  <DialogDescription>
                    Select a date and time for your consultation.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex justify-center">
                     <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      />
                  </div>
                  <div>
                    <Label htmlFor="time-slot" className="text-right mb-2 block">
                      Time Slot
                    </Label>
                    <Select onValueChange={setSelectedTime} value={selectedTime}>
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
                  <Button onClick={handleConfirmBooking} disabled={!selectedDate || !selectedTime} className="w-full">
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
    