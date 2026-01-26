
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
  MapPin,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Player } from '@lottiefiles/react-lottie-player';

const indianDoctors = [
  { id: 'dr-shivam-yadav', name: 'Dr. Shivam Yadav', specialty: 'General Physician', rating: 4.8, imageId: 'doctor-2', fees: '₹500', experience: '8 years', location: 'Delhi, India', bio: 'Compassionate general physician with expertise in managing chronic diseases and acute illnesses.', education: 'MBBS, MD (General Medicine)', reviews: [{user: 'Rohan S.', rating: 5, comment: "Very helpful and listens patiently."}] },
  { id: 'dr-ananya-sharma', name: 'Dr. Ananya Sharma', specialty: 'Cardiologist', rating: 4.9, imageId: 'doctor-1', fees: '₹800', experience: '12 years', location: 'Mumbai, India', bio: 'Leading cardiologist specializing in heart failure management and preventive cardiology.', education: 'MBBS, MD (Cardiology), FACC', reviews: [{user: 'Priya K.', rating: 5, comment: "Excellent doctor. Highly recommend for any heart-related issues."}] },
  { id: 'dr-vikram-singh', name: 'Dr. Vikram Singh', specialty: 'Dermatologist', rating: 4.8, imageId: 'doctor-2', fees: '₹600', experience: '10 years', location: 'Bangalore, India', bio: 'Expert in clinical and cosmetic dermatology, providing solutions for all skin concerns.', education: 'MBBS, DDVL (Dermatology)', reviews: [] },
  { id: 'dr-priya-patel', name: 'Dr. Priya Patel', specialty: 'Pediatrician', rating: 4.9, imageId: 'doctor-3', fees: '₹550', experience: '9 years', location: 'Ahmedabad, India', bio: 'Dedicated pediatrician focused on child wellness and development from newborn to adolescent.', education: 'MBBS, DCH (Pediatrics)', reviews: [] },
  { id: 'dr-arjun-gupta', name: 'Dr. Arjun Gupta', specialty: 'Neurologist', rating: 4.7, imageId: 'doctor-4', fees: '₹900', experience: '15 years', location: 'Chennai, India', bio: 'Specialist in treating neurological disorders including stroke, epilepsy, and migraines.', education: 'MBBS, DM (Neurology)', reviews: [] },
  { id: 'dr-sameer-khan', name: 'Dr. Sameer Khan', specialty: 'Oncologist', rating: 4.9, imageId: 'doctor-7', fees: '₹1200', experience: '18 years', location: 'Hyderabad, India', bio: 'Renowned oncologist with a focus on personalized cancer treatment and research.', education: 'MBBS, DM (Medical Oncology)', reviews: []},
  { id: 'dr-meera-iyer', name: 'Dr. Meera Iyer', specialty: 'Gynecologist', rating: 4.8, imageId: 'doctor-8', fees: '₹700', experience: '11 years', location: 'Pune, India', bio: 'Expert in women\'s reproductive health, providing care through all stages of life.', education: 'MBBS, MS (Obstetrics & Gynaecology)', reviews: []},
];

const foreignDoctors = [
  { id: 'dr-john-smith', name: 'Dr. John Smith', specialty: 'General Physician', rating: 4.8, imageId: 'doctor-5', fees: '₹2500', experience: '10 years', location: 'New York, USA', bio: 'Board-certified physician from the USA, focused on holistic patient care and diagnostics.', education: 'MD (USA), Board Certified in Internal Medicine', reviews: [] },
  { id: 'dr-emily-williams', name: 'Dr. Emily Williams', specialty: 'Orthopedist', rating: 4.9, imageId: 'doctor-6', fees: '₹4000', experience: '14 years', location: 'London, UK', bio: 'UK-based orthopedic surgeon specializing in sports injuries and joint replacement.', education: 'MBChB, FRCS (Orth)', reviews: [] },
  { id: 'dr-olivia-chen', name: 'Dr. Olivia Chen', specialty: 'Endocrinologist', rating: 4.7, imageId: 'doctor-9', fees: '₹5000', experience: '12 years', location: 'Toronto, Canada', bio: 'Expert in hormonal disorders including diabetes and thyroid conditions from Canada.', education: 'MD, FRCPC (Endocrinology)', reviews: []},
  { id: 'dr-michael-brown', name: 'Dr. Michael Brown', specialty: 'Psychiatrist', rating: 4.8, imageId: 'doctor-10', fees: '₹3000', experience: '16 years', location: 'Sydney, Australia', bio: 'Specializing in adult psychiatry with a focus on cognitive behavioral therapy (CBT).', education: 'MBBS, FRANZCP', reviews: []},
];

type Review = {
    user: string;
    rating: number;
    comment: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  imageId: string;
  fees: string;
  experience: string;
  location: string;
  bio: string;
  education: string;
  reviews: Review[];
};

export type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  imageId: string;
  notes?: string;
};

const DoctorCard = ({ id, name, specialty, rating, imageId, fees, experience, reviews, bio }: Doctor) => {
  const image = PlaceHolderImages.find(img => img.id === imageId);
  const reviewCount = reviews.length;

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
            <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400"/>
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                </div>
                 <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-muted-foreground"/>
                  <span className="text-sm font-medium">{reviewCount} Reviews</span>
                </div>
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

const ConsultationLoader = () => (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Player
        autoplay
        loop
        src="https://lottie.host/efe3b4c2-3647-4301-b7da-8e0c97cb4bf2/SEE6sVMw1W.json"
        style={{ height: '300px', width: '300px' }}
      />
      <p className="text-lg text-muted-foreground mt-4 animate-pulse">Connecting to doctors...</p>
    </div>
  );


export default function ConsultationPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); 

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if(!isLoading) {
        // Load appointments from localStorage on component mount
        const savedAppointments = localStorage.getItem('appointments');
        if (savedAppointments) {
            setAppointments(JSON.parse(savedAppointments));
        }
    }
  }, [isLoading]);

  if (isLoading) {
    return <ConsultationLoader />;
  }

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
                                    {appt.notes && (
                                        <div className="col-span-2 text-sm text-muted-foreground">
                                          <strong>Notes:</strong> {appt.notes}
                                        </div>
                                    )}
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
export const allDoctors: Doctor[] = [...indianDoctors, ...foreignDoctors];

// Function to add a new appointment, can be exported or passed down
export const addAppointment = (newAppointment: Appointment) => {
  const savedAppointments = localStorage.getItem('appointments');
  const appointments = savedAppointments ? JSON.parse(savedAppointments) : [];
  const updatedAppointments = [newAppointment, ...appointments];
  localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
};

export const addDoctorReview = (doctorId: string, review: Review) => {
    const doctor = allDoctors.find(d => d.id === doctorId);
    if (doctor) {
        doctor.reviews.push(review);
        const totalRating = doctor.reviews.reduce((sum, r) => sum + r.rating, 0);
        doctor.rating = totalRating / doctor.reviews.length;
    }
};

    