
export type Medicine = {
  id: string;
  name: string;
  price: string;
  category: string;
  stock: number;
  description: string;
  use_for: string;
  who_can_use: string;
  general_dose: string;
  expiry: string;
  official: string;
};

export const medicines: Medicine[] = [
  { id: 'med01', name: 'Paracetamol 500mg', price: '₹50.00', category: 'Pain & Fever', stock: 120, description: 'Common antipyretic for fever and body pain.', use_for: 'Fever, mild to moderate pain', who_can_use: 'Adults and children (doctor-advised dose). Avoid in severe liver disease.', general_dose: 'Typically every 6–8 hours (follow label).', expiry: '24 months from manufacturing', official: 'Yes (CDSCO India)' },
  { id: 'med02', name: 'Dolo 650', price: '₹65.00', category: 'Pain & Fever', stock: 80, description: 'Widely used paracetamol-based fever reducer.', use_for: 'High fever, viral fever, strong body pain', who_can_use: 'Adults. Children only under medical guidance.', general_dose: 'Every 6–8 hours max (doctor recommended).', expiry: '24 months', official: 'Yes' },
  { id: 'med03', name: 'ORS Electrolyte', price: '₹20.00', category: 'Hydration & Energy', stock: 50, description: 'Re-hydrates body by restoring essential salts.', use_for: 'Dehydration, diarrhea, heat weakness', who_can_use: 'All ages', general_dose: 'Mix 1 sachet in 1L water; finish in 24 hrs.', expiry: '12–24 months', official: 'WHO Formula' },
  { id: 'med04', name: 'Cetirizine 10mg', price: '₹30.00', category: 'Allergy Relief', stock: 200, description: 'Anti-allergy medicine to reduce sneezing and irritation.', use_for: 'Sneezing, allergy, runny nose', who_can_use: 'Adults; children with doctor guidance', general_dose: 'Once daily', expiry: '24 months', official: 'Yes' },
  { id: 'med05', name: 'Ibuprofen 200mg', price: '₹45.00', category: 'Pain & Fever', stock: 75, description: 'NSAID used for pain and inflammation.', use_for: 'Headache, muscle pain, inflammation', who_can_use: 'Adults only', general_dose: 'After food; max dose as per label.', expiry: '24–36 months', official: 'Yes' },
  { id: 'med06', name: 'Digene Tablets', price: '₹15.00', category: 'Acidity & Indigestion', stock: 150, description: 'Antacid for acidity relief.', use_for: 'Acidity, heartburn, gas', who_can_use: 'Adults', general_dose: 'Chew after meals', expiry: '36 months', official: 'Yes' },
  { id: 'med07', name: 'Zinc Supplement', price: '₹90.00', category: 'Vitamins & Supplements', stock: 100, description: 'Zinc tablets useful in strengthening immunity.', use_for: 'Immunity, diarrhea recovery', who_can_use: 'All ages (dose varies)', general_dose: '10–14 days', expiry: '24 months', official: 'Yes' },
  { id: 'med08', name: 'Vitamin C', price: '₹120.00', category: 'Vitamins & Supplements', stock: 100, description: 'Boosts immunity and skin repair.', use_for: 'Immunity, skin health', who_can_use: 'All ages', general_dose: 'Follow label', expiry: '18–24 months', official: 'Yes' },
  { id: 'med09', name: 'Volini Gel', price: '₹110.00', category: 'Topical Pain Relief', stock: 90, description: 'Topical pain relief gel.', use_for: 'Body pain, sprain, joint pain', who_can_use: 'Adults', general_dose: 'Apply on affected area 2–3 times/day', expiry: '36 months', official: 'Yes' },
  { id: 'med10', name: 'Betadine Solution', price: '₹70.00', category: 'First Aid', stock: 130, description: 'Wound antiseptic used for cleaning injuries.', use_for: 'Minor wounds, cuts, infection prevention', who_can_use: 'All (avoid iodine allergy)', general_dose: 'Apply to clean wound surface', expiry: '24 months', official: 'Yes' },
  { id: 'med11', name: 'Electrolyte Sports Drink', price: '₹50.00', category: 'Hydration & Energy', stock: 80, description: 'Hydration booster with electrolytes.', use_for: 'Dehydration, workout recovery', who_can_use: 'Teens & adults', general_dose: 'As needed', expiry: '12 months', official: 'Yes' },
  { id: 'med12', name: 'Herbal Cough Syrup', price: '₹85.00', category: 'Cold & Cough', stock: 110, description: 'Soothes throat and reduces cough.', use_for: 'Dry cough, throat irritation', who_can_use: 'All ages (label-guided)', general_dose: '2–3 times a day', expiry: '12–24 months', official: 'Yes' },
  { id: 'med13', name: 'Antacid Liquid', price: '₹95.00', category: 'Acidity & Indigestion', stock: 100, description: 'Liquid antacid for fast relief.', use_for: 'Acid reflux, gas', who_can_use: 'Adults', general_dose: '1–2 tsp after meals', expiry: '24 months', official: 'Yes' },
  { id: 'med14', name: 'Moisturizing Cream', price: '₹150.00', category: 'Skin Care', stock: 100, description: 'Keeps skin moisturized and soft.', use_for: 'Dry skin, irritation', who_can_use: 'All ages', general_dose: 'Apply gently twice daily', expiry: '36 months', official: 'Yes' },
  { id: 'med15', name: 'Bandages', price: '₹40.00', category: 'First Aid', stock: 200, description: 'Wound protection bandages.', use_for: 'Minor cuts, wounds', who_can_use: 'All ages', general_dose: 'Apply to clean skin', expiry: '5 years', official: 'Yes' },
  { id: 'med16', name: 'Antiseptic Wipes', price: '₹60.00', category: 'First Aid', stock: 150, description: 'Prevents germs on skin surface.', use_for: 'Cleaning skin, wounds', who_can_use: 'All ages', general_dose: 'Single-use wipes', expiry: '24–36 months', official: 'Yes' },
  { id: 'med17', name: 'ORS Kids Formula', price: '₹25.00', category: 'Hydration & Energy', stock: 70, description: 'Kids-friendly ORS drink.', use_for: 'Child dehydration', who_can_use: 'Children (doctor advised for infants)', general_dose: 'Use as per label', expiry: '12 months', official: 'Yes' },
  { id: 'med18', name: 'Glucose Powder', price: '₹55.00', category: 'Hydration & Energy', stock: 120, description: 'Quick energy booster.', use_for: 'Low energy, heat weakness', who_can_use: 'All ages', general_dose: 'Mix in water and drink', expiry: '36 months', official: 'Yes' },
  { id: 'med19', name: 'Pain Relief Spray', price: '₹130.00', category: 'Topical Pain Relief', stock: 60, description: 'Instant pain relief spray.', use_for: 'Muscle pain, sprain', who_can_use: 'Adults', general_dose: 'Spray 2–3 times a day', expiry: '24 months', official: 'Yes' },
  { id: 'med20', name: 'ORS Fruit Flavor', price: '₹22.00', category: 'Hydration & Energy', stock: 140, description: 'Easy-to-drink flavored ORS.', use_for: 'Hydration for kids & adults', who_can_use: 'All ages', general_dose: 'Finish within 24 hours', expiry: '12–24 months', official: 'Yes' },
  { id: 'med21', name: 'Amoxicillin 250mg', price: '₹80.00', category: 'Antibiotics', stock: 50, description: 'Common antibiotic for bacterial infections.', use_for: 'Bacterial infections (ear, throat, etc.)', who_can_use: 'Doctor prescribed only', general_dose: 'As prescribed by doctor', expiry: '24 months', official: 'Yes' },
  { id: 'med22', name: 'Azithromycin 500mg', price: '₹120.00', category: 'Antibiotics', stock: 40, description: 'Broad-spectrum antibiotic.', use_for: 'Respiratory, skin, and other infections', who_can_use: 'Doctor prescribed only', general_dose: '3-day or 5-day course as prescribed', expiry: '24 months', official: 'Yes' },
  { id: 'med23', name: 'Loratadine 10mg', price: '₹40.00', category: 'Allergy Relief', stock: 150, description: 'Non-drowsy anti-allergy tablet.', use_for: 'Allergies, hives, itching', who_can_use: 'Adults and children over 6', general_dose: 'Once daily', expiry: '36 months', official: 'Yes' },
  { id: 'med24', name: 'Omeprazole 20mg', price: '₹75.00', category: 'Acidity & Indigestion', stock: 90, description: 'Proton pump inhibitor to reduce stomach acid.', use_for: 'GERD, heartburn, stomach ulcers', who_can_use: 'Adults (consult doctor)', general_dose: 'Once daily before a meal', expiry: '24 months', official: 'Yes' },
  { id: 'med25', name: 'Multivitamin Tablets', price: '₹250.00', category: 'Vitamins & Supplements', stock: 100, description: 'Daily supplement with essential vitamins and minerals.', use_for: 'General wellness, nutritional deficiency', who_can_use: 'Adults', general_dose: 'One tablet daily after meal', expiry: '18 months', official: 'Yes' },
  { id: 'med26', name: 'Calcium + Vitamin D3', price: '₹180.00', category: 'Vitamins & Supplements', stock: 120, description: 'For bone health and calcium absorption.', use_for: 'Bone strength, calcium deficiency', who_can_use: 'Adults, especially elderly', general_dose: 'One or two tablets daily', expiry: '24 months', official: 'Yes' },
  { id: 'med27', name: 'Cough Drops', price: '₹35.00', category: 'Cold & Cough', stock: 300, description: 'Medicated lozenges for sore throat.', use_for: 'Sore throat, cough suppression', who_can_use: 'Adults and children over 5', general_dose: 'Dissolve one in mouth every 2-3 hours', expiry: '24 months', official: 'Yes' },
  { id: 'med28', name: 'Nasal Decongestant Spray', price: '₹90.00', category: 'Cold & Cough', stock: 80, description: 'Provides fast relief from blocked nose.', use_for: 'Nasal congestion due to cold or allergy', who_can_use: 'Adults (short-term use)', general_dose: '1-2 sprays per nostril, twice daily', expiry: '36 months', official: 'Yes' },
  { id: 'med29', name: 'Sunscreen SPF 50', price: '₹350.00', category: 'Skin Care', stock: 70, description: 'Broad-spectrum protection from UVA/UVB rays.', use_for: 'Sun protection', who_can_use: 'All ages', general_dose: 'Apply liberally 15 mins before sun exposure', expiry: '24 months', official: 'Yes' },
  { id: 'med30', name: 'Hand Sanitizer', price: '₹50.00', category: 'First Aid', stock: 250, description: 'Alcohol-based hand sanitizer to kill germs.', use_for: 'Hand hygiene', who_can_use: 'All ages', general_dose: 'Use a small amount to cover hands', expiry: '36 months', official: 'Yes' },
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

    