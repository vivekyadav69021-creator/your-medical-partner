
export type Medicine = {
  id: string;
  name: string;
  brand?: string;
  genericComposition?: string;
  price: string | number; // Support both for legacy and new
  discountedPrice?: string | number;
  category: string;
  stock?: number;
  inStock?: boolean;
  prescriptionRequired?: boolean;
  description: string;
  dosageInstruction?: string;
  benefits?: string[];
  sideEffects?: string[];
  contraindications?: string;
  packagingDetails?: string;
  storageAdvice?: string;
  imageUrl?: string;
  official?: string;
};

export const medicines: Medicine[] = [
  { 
    id: 'med01', 
    name: 'Paracetamol 500mg', 
    brand: 'Crocin',
    genericComposition: 'Paracetamol / Acetaminophen 500mg',
    price: 50.00, 
    discountedPrice: 42.00,
    category: 'Pain & Fever', 
    inStock: true,
    prescriptionRequired: false,
    description: 'Common antipyretic for fever and body pain.', 
    dosageInstruction: '1 tablet every 6-8 hours after meals or as directed by physician',
    benefits: ['Relieves mild to moderate pain', 'Reduces fever effectively', 'Safe for most age groups'],
    sideEffects: ['Nausea', 'Skin rash (rare)', 'Stomach pain'],
    contraindications: 'Severe liver disease or allergy to paracetamol',
    packagingDetails: 'Strip of 15 tablets',
    storageAdvice: 'Store below 25°C in a dry place',
    official: 'Yes (CDSCO India)' 
  },
  { 
    id: 'med02', 
    name: 'Dolo 650', 
    brand: 'Micro Labs',
    genericComposition: 'Paracetamol 650mg',
    price: 65.00, 
    discountedPrice: 58.00,
    category: 'Pain & Fever', 
    inStock: true,
    prescriptionRequired: false,
    description: 'Widely used paracetamol-based fever reducer.', 
    dosageInstruction: 'Max 4 tablets in 24 hours with a gap of 6 hours.',
    benefits: ['High fever management', 'Viral fever relief', 'Strong body ache reduction'],
    sideEffects: ['Liver toxicity on overdose', 'Allergic reactions'],
    contraindications: 'Chronic alcoholism or severe liver impairment',
    packagingDetails: 'Strip of 15 tablets',
    storageAdvice: 'Keep away from direct sunlight',
    official: 'Yes' 
  }
];

export const categories = [
    'All',
    'Pain & Fever',
    'Hydration & Energy',
    'Allergy Relief',
    'Acidity & Indigestion',
    'Vitamins & Supplements',
    'Topical Pain Relief',
    'First Aid',
    'Cold & Cough',
    'Skin Care',
    'Antibiotics',
];
