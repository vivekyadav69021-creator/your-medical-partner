
export type Medicine = {
  id: string;
  name: string;
  price: string;
  category: string;
  stock: number;
  description: string;
};

export const medicines: Medicine[] = [
  { id: 'medicine-1', name: 'Paracetamol', price: '₹50.00', category: 'Pain Relief', stock: 120, description: 'An effective pain reliever and fever reducer. Suitable for headaches, muscle aches, and colds.' },
  { id: 'medicine-2', name: 'Ibuprofen', price: '₹80.00', category: 'Pain Relief', stock: 80, description: 'A nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammation.' },
  { id: 'medicine-3', name: 'Amoxicillin', price: '₹150.00', category: 'Antibiotics', stock: 50, description: 'An antibiotic used to treat a number of bacterial infections. Prescription required.' },
  { id: 'medicine-4', name: 'Cough Syrup', price: '₹120.00', category: 'Cold & Flu', stock: 200, description: 'Provides relief from cough and throat irritation. Contains dextromethorphan.' },
  { id: 'medicine-5', name: 'Allergy Relief', price: '₹95.00', category: 'Allergies', stock: 75, description: 'An antihistamine that provides relief from sneezing, runny nose, and itchy, watery eyes.' },
  { id: 'medicine-6', name: 'Vitamin D', price: '₹250.00', category: 'Vitamins', stock: 150, description: 'A supplement that helps the body absorb calcium, essential for bone health.' },
];

export const categories = ['All', 'Pain Relief', 'Antibiotics', 'Cold & Flu', 'Allergies', 'Vitamins'];
