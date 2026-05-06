
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
import { cn } from '@/lib/utils';
import { indianDoctors, foreignDoctors, type Doctor, type Appointment } from '@/lib/doctor-data';

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
              className="rounded-full border-2 border-primary shrink-0"
              data-ai-hint={image.imageHint}
            />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{name}</CardTitle>
            <CardDescription className="truncate">{specialty}</CardDescription>
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
              <span className="hidden sm:inline">View Profile</span>
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
    setIsLoading(false);
  }, []);


  useEffect(() => {
    if(!isLoading) {
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Doctor Consultation</h1>
        <p className="text-muted-foreground">
          Find and book appointments with top doctors.
        </p>
      </div>

      <Tabs defaultValue="find-doctor">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-white/50 dark:border-slate-700/50 backdrop-blur-sm">
          <TabsTrigger value="find-doctor" className="rounded-lg py-2 px-1 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest">
            <span className="hidden sm:inline">Find a Doctor</span>
            <span className="sm:hidden">Find</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="rounded-lg py-2 px-1 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest">
            <span className="hidden sm:inline">Upcoming Appointments</span>
            <span className="sm:hidden">Upcoming</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg py-2 px-1 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest">
            <span className="hidden sm:inline">Consultation History</span>
            <span className="sm:hidden">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="find-doctor" className="mt-6">
           <Tabs defaultValue="indian">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl">
              <TabsTrigger value="indian" className="rounded-lg py-2 font-bold text-xs">Indian Doctors</TabsTrigger>
              <TabsTrigger value="foreign" className="rounded-lg py-2 font-bold text-xs">Foreign Doctors</TabsTrigger>
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
                            <Card key={appt.id} className="overflow-hidden">
                                <CardHeader className="flex-row gap-4 items-center">
                                    {image && <Image src={image.imageUrl} alt={image.description} width={64} height={64} className="rounded-full border shadow-sm shrink-0" data-ai-hint={image.imageHint}/>}
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="truncate text-base">{appt.doctorName}</CardTitle>
                                        <CardDescription className="truncate text-xs">{appt.specialty}</CardDescription>
                                    </div>
                                    <Badge variant={appt.type === 'Video Call' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold shrink-0">{appt.type}</Badge>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-primary"/>
                                        <p className="font-bold text-sm">{appt.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary"/>
                                        <p className="font-bold text-sm">{appt.time}</p>
                                    </div>
                                    {appt.notes && (
                                        <div className="col-span-1 sm:col-span-2 text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                          <strong className="text-primary font-black uppercase text-[10px] block mb-1">Notes:</strong> {appt.notes}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50 p-4 border-t">
                                    <Button variant="outline" size="sm" className="rounded-full font-bold text-xs">Reschedule</Button>
                                    {appt.type === 'Video Call' && (
                                         <Button asChild size="sm" className="rounded-full font-bold text-xs shadow-md shadow-primary/20">
                                            <Link href={videoCallLink} target={isDrShivam ? "_blank" : "_self"} rel={isDrShivam ? "noopener noreferrer" : ""}>
                                                <Video className="mr-2 h-4 w-4"/>
                                                Join Call
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center p-12 border-2 border-dashed rounded-[2rem] bg-white/40 backdrop-blur-sm border-blue-100 dark:border-slate-800">
                        <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <CalendarIcon className="w-8 h-8 text-primary/40" />
                        </div>
                        <p className="text-sm font-bold text-[#2D3A5D]/60 dark:text-slate-400 uppercase tracking-widest">No upcoming appointments</p>
                    </div>
                )}
            </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
             <div className="text-center p-12 border-2 border-dashed rounded-[2rem] bg-white/40 backdrop-blur-sm border-blue-100 dark:border-slate-800">
                <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-primary/40" />
                </div>
                <p className="text-sm font-bold text-[#2D3A5D]/60 dark:text-slate-400 uppercase tracking-widest">History will appear here</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const addAppointment = (newAppointment: Appointment) => {
  const savedAppointments = localStorage.getItem('appointments');
  const appointments = savedAppointments ? JSON.parse(savedAppointments) : [];
  const updatedAppointments = [newAppointment, ...appointments];
  localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
};
