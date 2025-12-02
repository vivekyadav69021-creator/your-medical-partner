
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
  Star,
  Video,
  Calendar as CalendarIcon,
  Clock,
  Briefcase,
  IndianRupee,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const indianDoctors = [
  { id: 'dr-shivam-yadav', name: 'Dr. Shivam Yadav', specialty: 'General Physician', rating: 4.8, imageId: 'doctor-2', fees: '₹500', experience: '8 years', bio: 'Compassionate general physician with expertise in managing chronic diseases and acute illnesses.' },
  { id: 'dr-ananya-sharma', name: 'Dr. Ananya Sharma', specialty: 'Cardiologist', rating: 4.9, imageId: 'doctor-1', fees: '₹800', experience: '12 years', bio: 'Leading cardiologist specializing in heart failure management and preventive cardiology.' },
  { id: 'dr-vikram-singh', name: 'Dr. Vikram Singh', specialty: 'Dermatologist', rating: 4.8, imageId: 'doctor-2', fees: '₹600', experience: '10 years', bio: 'Expert in clinical and cosmetic dermatology, providing solutions for all skin concerns.' },
  { id: 'dr-priya-patel', name: 'Dr. Priya Patel', specialty: 'Pediatrician', rating: 4.9, imageId: 'doctor-3', fees: '₹550', experience: '9 years', bio: 'Dedicated pediatrician focused on child wellness and development from newborn to adolescent.' },
  { id: 'dr-arjun-gupta', name: 'Dr. Arjun Gupta', specialty: 'Neurologist', rating: 4.7, imageId: 'doctor-4', fees: '₹900', experience: '15 years', bio: 'Specialist in treating neurological disorders including stroke, epilepsy, and migraines.' },
  { id: 'dr-sameer-khan', name: 'Dr. Sameer Khan', specialty: 'Oncologist', rating: 4.9, imageId: 'doctor-7', fees: '₹1200', experience: '18 years', bio: 'Renowned oncologist with a focus on personalized cancer treatment and research.'},
  { id: 'dr-meera-iyer', name: 'Dr. Meera Iyer', specialty: 'Gynecologist', rating: 4.8, imageId: 'doctor-8', fees: '₹700', experience: '11 years', bio: 'Expert in women\'s reproductive health, providing care through all stages of life.'},
];

const foreignDoctors = [
  { id: 'dr-john-smith', name: 'Dr. John Smith', specialty: 'General Physician', rating: 4.8, imageId: 'doctor-5', fees: '$80', experience: '10 years', bio: 'Board-certified physician from the USA, focused on holistic patient care and diagnostics.' },
  { id: 'dr-emily-williams', name: 'Dr. Emily Williams', specialty: 'Orthopedist', rating: 4.9, imageId: 'doctor-6', fees: '$120', experience: '14 years', bio: 'UK-based orthopedic surgeon specializing in sports injuries and joint replacement.' },
  { id: 'dr-olivia-chen', name: 'Dr. Olivia Chen', specialty: 'Endocrinologist', rating: 4.7, imageId: 'doctor-9', fees: '$150', experience: '12 years', bio: 'Expert in hormonal disorders including diabetes and thyroid conditions from Canada.'},
  { id: 'dr-michael-brown', name: 'Dr. Michael Brown', specialty: 'Psychiatrist', rating: 4.8, imageId: 'doctor-10', fees: '$100', experience: '16 years', bio: 'Specializing in adult psychiatry with a focus on cognitive behavioral therapy (CBT).'},
];

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
  id: string;
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

const DoctorCard = ({ id, name, specialty, rating, imageId, fees, experience, bio }: Doctor) => {
  const image = PlaceHolderImages.find(img => img.id === imageId);

  return (
    <Link href={`/consultation/doctors/${id}`}>
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
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
          <p className="text-sm text-muted-foreground line-clamp-3">{bio}</p>
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
           <div className="flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Profile</span>
              <ArrowRight className="ml-1 h-4 w-4"/>
           </div>
        </CardFooter>
      </Card>
    </Link>
  );
};


export default function ConsultationPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const { toast } = useToast();

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
                {indianDoctors.map(doctor => <DoctorCard key={doctor.id} {...doctor} />)}
              </div>
            </TabsContent>
            <TabsContent value="foreign" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {foreignDoctors.map(doctor => <DoctorCard key={doctor.id} {...doctor} />)}
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

// Full doctors list for detail page lookup
export const allDoctors = [...indianDoctors, ...foreignDoctors];
