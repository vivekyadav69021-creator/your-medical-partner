
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { allDoctors, addAppointment, addDoctorReview, Appointment } from '@/app/(app)/consultation/page';
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
import { Star, Video, Calendar as CalendarIcon, ArrowLeft, Briefcase, IndianRupee, MapPin, GraduationCap, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

function StarRating({ rating, onRatingChange, readOnly = false }: { rating: number; onRatingChange?: (rating: number) => void; readOnly?: boolean }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        onClick={() => onRatingChange && onRatingChange(ratingValue)}
                        onMouseEnter={() => !readOnly && setHover(ratingValue)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        className={`cursor-${readOnly ? 'default' : 'pointer'}`}
                        disabled={readOnly}
                    >
                        <Star
                            className={`h-6 w-6 transition-colors ${
                                ratingValue <= (hover || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
}

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.doctorId as string;
  const { toast } = useToast();

  // We need to use state to make reviews persistent across re-renders on the client
  const [doctor, setDoctor] = useState(() => allDoctors.find(d => d.id === doctorId));
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    // This effect ensures that if the doctor data in the "DB" (our hardcoded list) changes,
    // we reflect it in the component state.
    const updatedDoctor = allDoctors.find(d => d.id === doctorId);
    if (JSON.stringify(updatedDoctor) !== JSON.stringify(doctor)) {
      setDoctor(updatedDoctor);
    }
  }, [doctorId, doctor]);

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
        notes: appointmentNotes,
      };

      addAppointment(newAppointment);

      toast({
        title: 'Appointment Booked!',
        description: `Your appointment with ${doctor.name} on ${format(selectedDate, 'MMM dd, yyyy')} at ${selectedTime} has been confirmed.`,
      });
      setIsBookingOpen(false);
      
      router.push('/consultation');
    }
  };

  const handleReviewSubmit = () => {
      if (reviewRating > 0 && reviewComment) {
          const newReview = { user: 'You', rating: reviewRating, comment: reviewComment };
          
          // This function updates the hardcoded `allDoctors` array
          addDoctorReview(doctor.id, newReview);

          // Trigger a re-render by updating state from the modified source
          setDoctor({ ...allDoctors.find(d => d.id === doctorId)! });

          toast({
              title: "Review Submitted!",
              description: "Thank you for your feedback."
          });
          setIsReviewOpen(false);
          setReviewRating(0);
          setReviewComment('');
      } else {
          toast({
              variant: 'destructive',
              title: "Incomplete Review",
              description: "Please provide a rating and a comment."
          })
      }
  };
  
  const image = PlaceHolderImages.find(img => img.id === doctor.imageId);
  const reviewCount = doctor.reviews.length;
  const avgRating = reviewCount > 0 ? doctor.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : doctor.rating;

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
               <p className="text-muted-foreground mt-1">{doctor.education}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400"/>
                    <span className="font-semibold text-lg">{avgRating.toFixed(1)} ({reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-5 h-5"/>
                    <span className="font-semibold">{doctor.experience}</span>
                  </div>
                   <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-5 h-5"/>
                    <span className="font-semibold">{doctor.fees}</span>
                  </div>
                   <div className="flex items-center gap-1.5">
                    <MapPin className="w-5 h-5"/>
                    <span className="font-semibold">{doctor.location}</span>
                  </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <h3 className="text-xl font-semibold mb-2">About Dr. {doctor.name.split(' ').pop()}</h3>
            <p className="text-muted-foreground">{doctor.bio}</p>
        </CardContent>
        <CardFooter className="flex-wrap gap-4">
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
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
                  <div>
                     <Label htmlFor="notes" className="text-right mb-2 block">
                        Notes (optional)
                    </Label>
                    <Textarea id="notes" placeholder="Reason for visit..." value={appointmentNotes} onChange={e => setAppointmentNotes(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleConfirmBooking} disabled={!selectedDate || !selectedTime} className="w-full">
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

             <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Leave a Review
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Review {doctor.name}</DialogTitle>
                        <DialogDescription>Share your experience to help others.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <Label>Your Rating</Label>
                            <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
                        </div>
                        <div>
                            <Label htmlFor="review-comment">Your Comment</Label>
                            <Textarea id="review-comment" placeholder="Describe your experience..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleReviewSubmit} disabled={!reviewRating || !reviewComment}>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Ratings & Reviews</CardTitle>
            <CardDescription>What other patients are saying about {doctor.name}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {reviewCount > 0 ? (
                doctor.reviews.map((review, index) => (
                    <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                         <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${review.user}`} />
                            <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{review.user}</p>
                                <StarRating rating={review.rating} readOnly />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center">No reviews yet. Be the first to leave one!</p>
            )}
        </CardContent>
      </Card>

    </div>
  );
}
