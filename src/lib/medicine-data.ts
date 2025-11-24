
export type Medicine = {
  id: string;
  name: string;
  price: string;
  category: string;
  stock: number;
  description: string;
};

export const medicines: Medicine[] = [
  { id: 'medicine-1', name: 'Paracetamol 500mg', price: '₹50.00', category: 'Pain & Fever Relief', stock: 120, description: 'Common antipyretic for fever and body pain. Suitable for headaches, muscle aches, and colds.' },
  { id: 'medicine-2', name: 'Dolo 650', price: '₹65.00', category: 'Fever Relief', stock: 80, description: 'Widely used paracetamol-based fever reducer for high fever and strong body pain.' },
  { id: 'medicine-3', name: 'ORS Electrolyte', price: '₹20.00', category: 'Hydration', stock: 50, description: 'Re-hydrates body by restoring essential salts. Used for dehydration and diarrhea.' },
  { id: 'medicine-4', name: 'Cetirizine 10mg', price: '₹30.00', category: 'Allergy Relief', stock: 200, description: 'Anti-allergy medicine to reduce sneezing, runny nose, and irritation.' },
  { id: 'medicine-5', name: 'Ibuprofen 200mg', price: '₹45.00', category: 'Pain Relief', stock: 75, description: 'NSAID used for headache, muscle pain, and inflammation. Take after food.' },
  { id: 'medicine-6', name: 'Digene Tablets', price: '₹15.00', category: 'Acidity & Indigestion', stock: 150, description: 'Chewable antacid for fast relief from acidity, heartburn, and gas.' },
  { id: 'med07', name: 'Zinc Supplement', price: '₹90.00', category: 'Immunity', stock: 100, description: 'Zinc tablets useful in strengthening immunity and aiding diarrhea recovery.' },
  { id: 'med08', name: 'Vitamin C', price: '₹120.00', category: 'Immunity', stock: 100, description: 'Boosts immunity, helps in skin repair, and acts as an antioxidant.' },
  { id: 'med09', name: 'Volini Gel', price: '₹110.00', category: 'Pain Relief (Topical)', stock: 90, description: 'Topical pain relief gel for body pain, sprains, and joint pain.' },
  { id: 'med10', name: 'Betadine Solution', price: '₹70.00', category: 'First Aid', stock: 130, description: 'Antiseptic solution for cleaning minor wounds and cuts to prevent infection.' },
  { id: 'med11', name: 'Electrolyte Sports Drink', price: '₹50.00', category: 'Hydration', stock: 80, description: 'Hydration booster with electrolytes, ideal for workout recovery and dehydration.' },
  { id: 'med12', name: 'Herbal Cough Syrup', price: '₹85.00', category: 'Cold & Cough', stock: 110, description: 'Soothes a dry cough and throat irritation with a blend of natural herbs.' },
  { id: 'med13', name: 'Antacid Liquid', price: '₹95.00', category: 'Acidity', stock: 100, description: 'Liquid antacid for fast relief from acid reflux, gas, and heartburn.' },
  { id: 'med14', name: 'Moisturizing Cream', price: '₹150.00', category: 'Skin Care', stock: 100, description: 'Keeps skin moisturized, soft, and protected from dryness and irritation.' },
  { id: 'med15', name: 'Bandages', price: '₹40.00', category: 'First Aid', stock: 200, description: 'Sterile adhesive bandages for protecting minor cuts and wounds from germs.' },
  { id: 'med16', name: 'Antiseptic Wipes', price: '₹60.00', category: 'First Aid', stock: 150, description: 'Single-use antiseptic wipes for cleaning skin and preventing germs on surfaces.' },
  { id: 'med17', name: 'ORS Kids Formula', price: '₹25.00', category: 'Kids Hydration', stock: 70, description: 'A kids-friendly ORS drink to combat dehydration in children. Doctor-advised for infants.' },
  { id: 'med18', name: 'Glucose Powder', price: '₹55.00', category: 'Energy', stock: 120, description: 'A quick energy booster to combat low energy and weakness caused by heat.' },
  { id: 'med19', name: 'Pain Relief Spray', price: '₹130.00', category: 'Muscle Relief', stock: 60, description: 'Instant pain relief spray for muscle pain and sprains. Apply 2-3 times a day.' },
  { id: 'med20', name: 'ORS Fruit Flavor', price: '₹22.00', category: 'Hydration', stock: 140, description: 'An easy-to-drink, fruit-flavored ORS for both kids and adults.' }
];

export const categories = [
    'All',
    'Pain & Fever Relief',
    'Fever Relief',
    'Hydration',
    'Allergy Relief',
    'Pain Relief',
    'Acidity & Indigestion',
    'Immunity',
    'Pain Relief (Topical)',
    'First Aid',
    'Cold & Cough',
    'Acidity',
    'Skin Care',
    'Kids Hydration',
    'Energy',
    'Muscle Relief',
    'Antibiotics',
    'Vitamins'
];
