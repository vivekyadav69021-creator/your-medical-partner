
'use client';

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
import { Star, Video, Calendar as CalendarIcon, Clock, Briefcase, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const indianDoctors = [
  { name: 'Dr. Shivam Yadav', specialty: 'General Physician', rating: 4.8, imageId: 'doctor-2', fees: '₹500', experience: '8 years', bio: 'Compassionate general physician with expertise in managing chronic diseases and acute illnesses.' },
  { name: 'Dr. Ananya Sharma', specialty: 'Cardiologist', rating: 4.9, imageId: 'doctor-1', fees: '₹800', experience: '12 years', bio: 'Leading cardiologist specializing in heart failure management and preventive cardiology.' },
  { name: 'Dr. Vikram Singh', specialty: 'Dermatologist', rating: 4.8, imageId: 'doctor-2', fees: '₹600', experience: '10 years', bio: 'Expert in clinical and cosmetic dermatology, providing solutions for all skin concerns.' },
  { name: 'Dr. Priya Patel', specialty: 'Pediatrician', rating: 4.9, imageId: 'doctor-3', fees: '₹550', experience: '9 years', bio: 'Dedicated pediatrician focused on child wellness and development from newborn to adolescent.' },
  { name: 'Dr. Arjun Gupta', specialty: 'Neurologist', rating: 4.7, imageId: 'doctor-4', fees: '₹900', experience: '15 years', bio: 'Specialist in treating neurological disorders including stroke, epilepsy, and migraines.' },
  { name: 'Dr. Sameer Khan', specialty: 'Oncologist', rating: 4.9, imageId: 'doctor-7', fees: '₹1200', experience: '18 years', bio: 'Renowned oncologist with a focus on personalized cancer treatment and research.'},
  { name: 'Dr. Meera Iyer', specialty: 'Gynecologist', rating: 4.8, imageId: 'doctor-8', fees: '₹700', experience: '11 years', bio: 'Expert in women\'s reproductive health, providing care through all stages of life.'},
];

const foreignDoctors = [
  { name: 'Dr. John Smith', specialty: 'General Physician', rating: 4.8, imageId: 'doctor-5', fees: '$80', experience: '10 years', bio: 'Board-certified physician from the USA, focused on holistic patient care and diagnostics.' },
  { name: 'Dr. Emily Williams', specialty: 'Orthopedist', rating: 4.9, imageId: 'doctor-6', fees: '$120', experience: '14 years', bio: 'UK-based orthopedic surgeon specializing in sports injuries and joint replacement.' },
  { name: 'Dr. Olivia Chen', specialty: 'Endocrinologist', rating: 4.7, imageId: 'doctor-9', fees: '$150', experience: '12 years', bio: 'Expert in hormonal disorders including diabetes and thyroid conditions from Canada.'},
  { name: 'Dr. Michael Brown', specialty: 'Psychiatrist', rating: 4.8, imageId: 'doctor-10', fees: '$100', experience: '16 years', bio: 'Specializing in adult psychiatry with a focus on cognitive behavioral therapy (CBT).'},
];

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

const initialAppointments = [
  {
    id: 'appt-1',
    doctorName: 'Dr. Priya Patel',
    specialty: 'Pediatrician',
    date: 'Dec 15, 2024',
    time: '11:30 AM',
    type: 'Video Call',
    imageId: 'doctor-3',
  },
  {
    id: 'appt-2',
    doctorName: 'Dr. John Smith',
    specialty: 'General Physician',
    date: 'Dec 18, 2024',
    time: '02:00 PM',
    type: 'In-Person',
    imageId: 'doctor-5',
  },
];

type Doctor = {
  name: string;
  specialty: string;
  rating: number;
  imageId: string;
  fees: string;
  experience: string;
  bio: string;
};

type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  imageId: string;
};

const DoctorCard = ({
  name,
  specialty,
  rating,
  imageId,
  fees,
  experience,
  bio,
  onBook,
}: Doctor & { onBook: (details: Omit<Appointment, 'id' | 'type'>) => void }) => {
  const image = PlaceHolderImages.find(img => img.id === imageId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime) {
      onBook({
        doctorName: name,
        specialty,
        date: format(selectedDate, 'MMM dd, yyyy'),
        time: selectedTime,
        imageId,
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="flex flex-col">
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
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">{bio}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
         <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{fees}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{experience}</span>
            </div>
         </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Book Now</Button>
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
  );
};


export default function ConsultationPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const { toast } = useToast();

  const handleBookAppointment = (details: Omit<Appointment, 'id' | 'type'>) => {
    const newAppointment: Appointment = {
      ...details,
      id: `appt-${Date.now()}`,
      type: 'Video Call',
    };
    setAppointments(prev => [newAppointment, ...prev]);
    toast({
      title: 'Appointment Booked!',
      description: `Your appointment with ${details.doctorName} on ${details.date} at ${details.time} has been confirmed.`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Doctor Consultation</h1>
        <p className="text-muted-foreground">
          Find and book appointments with top doctors.
        </p>
      </div>

      <Tabs defaultValue="find-doctor">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="find-doctor">Find a Doctor</TabsTrigger>
          <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="history">Consultation History</TabsTrigger>
        </TabsList>
        <TabsContent value="find-doctor" className="mt-6">
           <Tabs defaultValue="indian">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="indian">Indian Doctors</TabsTrigger>
              <TabsTrigger value="foreign">Foreign Doctors</TabsTrigger>
            </TabsList>
            <TabsContent value="indian" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {indianDoctors.map(doctor => <DoctorCard key={doctor.name} {...doctor} onBook={handleBookAppointment} />)}
              </div>
            </TabsContent>
            <TabsContent value="foreign" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {foreignDoctors.map(doctor => <DoctorCard key={doctor.name} {...doctor} onBook={handleBookAppointment} />)}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="appointments" className="mt-6">
            <div className="space-y-6">
                {appointments.length > 0 ? (
                    appointments.map((appt) => {
                        const image = PlaceHolderImages.find(img => img.id === appt.imageId);
                        const isDrShivam = appt.doctorName === 'Dr. Shivam Yadav';
                        const videoCallLink = isDrShivam ? "https://meet.jit.si/DrShivamConsultRoom" : `/video-call/${appt.id}?doctor=${encodeURIComponent(appt.doctorName)}`;
                        
                        return (
                            <Card key={appt.id}>
                                <CardHeader className="flex-row gap-4 items-center">
                                    {image && <Image src={image.imageUrl} alt={image.description} width={64} height={64} className="rounded-full border" data-ai-hint={image.imageHint}/>}
                                    <div className="flex-1">
                                        <CardTitle>{appt.doctorName}</CardTitle>
                                        <CardDescription>{appt.specialty}</CardDescription>
                                    </div>
                                    <Badge variant={appt.type === 'Video Call' ? 'default' : 'secondary'}>{appt.type}</Badge>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                     <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5 text-muted-foreground"/>
                                        <p className="font-medium">{appt.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-muted-foreground"/>
                                        <p className="font-medium">{appt.time}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Button variant="outline">Reschedule</Button>
                                    {appt.type === 'Video Call' && (
                                         <Button asChild>
                                            <Link href={videoCallLink} target={isDrShivam ? "_blank" : "_self"} rel={isDrShivam ? "noopener noreferrer" : ""}>
                                                <Video className="mr-2 h-4 w-4"/>
                                                Join Video Call
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You have no upcoming appointments.</p>
                    </div>
                )}
            </div>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
             <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Your consultation history will appear here.</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    