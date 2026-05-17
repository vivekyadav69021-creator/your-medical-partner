
export type Review = {
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

export const indianDoctors: Doctor[] = [
  { id: 'dr-shivam-yadav', name: 'Dr. Shivam Yadav', specialty: 'General Physician', rating: 4.8, imageId: 'doctor-2', fees: '₹500', experience: '8 years', location: 'Delhi, India', bio: 'Compassionate general physician with expertise in managing chronic diseases and acute illnesses.', education: 'MBBS, MD (General Medicine)', reviews: [{user: 'Rohan S.', rating: 5, comment: "Very helpful and listens patiently."}] },
  { id: 'dr-ananya-sharma', name: 'Dr. Ananya Sharma', specialty: 'Cardiologist', rating: 4.9, imageId: 'doctor-1', fees: '₹800', experience: '12 years', location: 'Mumbai, India', bio: 'Leading cardiologist specializing in heart failure management and preventive cardiology.', education: 'MBBS, MD (Cardiology), FACC', reviews: [{user: 'Priya K.', rating: 5, comment: "Excellent doctor. Highly recommend for any heart-related issues."}] },
  { id: 'dr-vikram-singh', name: 'Dr. Vikram Singh', specialty: 'Dermatologist', rating: 4.8, imageId: 'doctor-2', fees: '₹600', experience: '10 years', location: 'Bangalore, India', bio: 'Expert in clinical and cosmetic dermatology, providing solutions for all skin concerns.', education: 'MBBS, DDVL (Dermatology)', reviews: [] },
  { id: 'dr-priya-patel', name: 'Dr. Priya Patel', specialty: 'Pediatrician', rating: 4.9, imageId: 'doctor-3', fees: '₹550', experience: '9 years', location: 'Ahmedabad, India', bio: 'Dedicated pediatrician focused on child wellness and development from newborn to adolescent.', education: 'MBBS, DCH (Pediatrics)', reviews: [] },
  { id: 'dr-arjun-gupta', name: 'Dr. Arjun Gupta', specialty: 'Neurologist', rating: 4.7, imageId: 'doctor-4', fees: '₹900', experience: '15 years', location: 'Chennai, India', bio: 'Specialist in treating neurological disorders including stroke, epilepsy, and migraines.', education: 'MBBS, DM (Neurology)', reviews: [] },
  { id: 'dr-sameer-khan', name: 'Dr. Sameer Khan', specialty: 'Oncologist', rating: 4.9, imageId: 'doctor-7', fees: '₹1200', experience: '18 years', location: 'Hyderabad, India', bio: 'Renowned oncologist with a focus on personalized cancer treatment and research.', education: 'MBBS, DM (Medical Oncology)', reviews: []},
  { id: 'dr-meera-iyer', name: 'Dr. Meera Iyer', specialty: 'Gynecologist', rating: 4.8, imageId: 'doctor-8', fees: '₹700', experience: '11 years', location: 'Pune, India', bio: 'Expert in women\'s reproductive health, providing care through all stages of life.', education: 'MBBS, MS (Obstetrics & Gynaecology)', reviews: []},
];

export const foreignDoctors: Doctor[] = [
  { id: 'dr-john-smith', name: 'Dr. John Smith', specialty: 'General Physician', rating: 4.8, imageId: 'doctor-5', fees: '₹2500', experience: '10 years', location: 'New York, USA', bio: 'Board-certified physician from the USA, focused on holistic patient care and diagnostics.', education: 'MD (USA), Board Certified in Internal Medicine', reviews: [] },
  { id: 'dr-emily-williams', name: 'Dr. Emily Williams', specialty: 'Orthopedist', rating: 4.9, imageId: 'doctor-6', fees: '₹4000', experience: '14 years', location: 'London, UK', bio: 'UK-based orthopedic surgeon specializing in sports injuries and joint replacement.', education: 'MBChB, FRCS (Orth)', reviews: [] },
  { id: 'dr-olivia-chen', name: 'Dr. Olivia Chen', specialty: 'Endocrinologist', rating: 4.7, imageId: 'doctor-9', fees: '₹5000', experience: '12 years', location: 'Toronto, Canada', bio: 'Expert in hormonal disorders including diabetes and thyroid conditions from Canada.', education: 'MD, FRCPC (Endocrinology)', reviews: []},
  { id: 'dr-michael-brown', name: 'Dr. Michael Brown', specialty: 'Psychiatrist', rating: 4.8, imageId: 'doctor-10', fees: '₹3000', experience: '16 years', location: 'Sydney, Australia', bio: 'Specializing in adult psychiatry with a focus on cognitive behavioral therapy (CBT).', education: 'MBBS, FRANZCP', reviews: []},
];

export const allDoctors: Doctor[] = [...indianDoctors, ...foreignDoctors];
