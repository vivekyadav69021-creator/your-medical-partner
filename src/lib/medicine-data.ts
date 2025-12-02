
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
  safety_advice: string;
  side_effects: string;
  expiry: string;
  official: string;
};

export const medicines: Medicine[] = [
  { 
    id: 'med01', name: 'Paracetamol 500mg', price: '₹50.00', category: 'Pain & Fever', stock: 120, 
    description: 'Common antipyretic for fever and body pain.', 
    use_for: 'Fever, mild to moderate pain', 
    who_can_use: 'Adults and children (doctor-advised dose).', 
    general_dose: 'Typically every 6–8 hours (follow label).',
    safety_advice: 'Do not exceed the recommended dose. Avoid in severe liver disease. Consult a doctor if symptoms persist for more than 3 days.',
    side_effects: 'Generally well-tolerated. Rare side effects include skin rash or allergic reactions.',
    expiry: '24 months from manufacturing', official: 'Yes (CDSCO India)' 
  },
  { 
    id: 'med02', name: 'Dolo 650', price: '₹65.00', category: 'Pain & Fever', stock: 80, 
    description: 'Widely used paracetamol-based fever reducer.', 
    use_for: 'High fever, viral fever, strong body pain', 
    who_can_use: 'Adults. Children only under medical guidance.', 
    general_dose: 'Every 6–8 hours max (doctor recommended).',
    safety_advice: 'Overdose can cause serious liver damage. Do not take with other paracetamol-containing products.',
    side_effects: 'Nausea and stomach upset can occur, though rare.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med03', name: 'ORS Electrolyte', price: '₹20.00', category: 'Hydration & Energy', stock: 50, 
    description: 'Re-hydrates body by restoring essential salts.', 
    use_for: 'Dehydration, diarrhea, heat weakness', 
    who_can_use: 'All ages', 
    general_dose: 'Mix 1 sachet in 1L water; finish in 24 hrs.',
    safety_advice: 'If vomiting persists or you cannot drink, seek medical help. Not for severe dehydration.',
    side_effects: 'Generally safe. Excessive consumption can lead to bloating.',
    expiry: '12–24 months', official: 'WHO Formula' 
  },
  { 
    id: 'med04', name: 'Cetirizine 10mg', price: '₹30.00', category: 'Allergy Relief', stock: 200, 
    description: 'Anti-allergy medicine to reduce sneezing and irritation.', 
    use_for: 'Sneezing, allergy, runny nose, itchy eyes', 
    who_can_use: 'Adults; children with doctor guidance', 
    general_dose: 'Once daily, usually at night.',
    safety_advice: 'May cause drowsiness. Avoid driving or operating heavy machinery until you know how it affects you.',
    side_effects: 'Common side effects include drowsiness, dry mouth, and fatigue.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med05', name: 'Ibuprofen 200mg', price: '₹45.00', category: 'Pain & Fever', stock: 75, 
    description: 'NSAID used for pain and inflammation.', 
    use_for: 'Headache, muscle pain, menstrual cramps, inflammation', 
    who_can_use: 'Adults only, unless prescribed by a doctor.', 
    general_dose: 'Take with food or milk to avoid stomach upset. Max dose as per label.',
    safety_advice: 'Do not use if you have stomach ulcers, asthma, or kidney problems. Avoid prolonged use without medical advice.',
    side_effects: 'Stomach irritation, heartburn, and nausea are possible.',
    expiry: '24–36 months', official: 'Yes' 
  },
  { 
    id: 'med06', name: 'Digene Tablets', price: '₹15.00', category: 'Acidity & Indigestion', stock: 150, 
    description: 'Antacid for acidity relief.', 
    use_for: 'Acidity, heartburn, gas, indigestion', 
    who_can_use: 'Adults', 
    general_dose: 'Chew 2-4 tablets after meals and at bedtime, or as directed by a doctor.',
    safety_advice: 'Do not take for more than 2 weeks continuously without consulting a doctor.',
    side_effects: 'Rare, but may include constipation or diarrhea.',
    expiry: '36 months', official: 'Yes' 
  },
  { 
    id: 'med07', name: 'Zinc Supplement', price: '₹90.00', category: 'Vitamins & Supplements', stock: 100, 
    description: 'Zinc tablets useful in strengthening immunity.', 
    use_for: 'Immunity support, diarrhea recovery, skin health', 
    who_can_use: 'All ages (dose varies)', 
    general_dose: 'Usually 10-14 days for diarrhea. Follow label for general supplementation.',
    safety_advice: 'High doses over a long period can be harmful. Stick to the recommended dosage.',
    side_effects: 'Nausea and an upset stomach can occur if taken on an empty stomach.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med08', name: 'Vitamin C', price: '₹120.00', category: 'Vitamins & Supplements', stock: 100, 
    description: 'Boosts immunity and skin repair.', 
    use_for: 'Immunity support, skin health, antioxidant', 
    who_can_use: 'All ages', 
    general_dose: 'One tablet daily or as directed by a physician.',
    safety_advice: 'High doses can cause digestive upset. Generally safe within recommended limits.',
    side_effects: 'Rare at normal doses. High doses might cause diarrhea or stomach cramps.',
    expiry: '18–24 months', official: 'Yes' 
  },
  { 
    id: 'med09', name: 'Volini Gel', price: '₹110.00', category: 'Topical Pain Relief', stock: 90, 
    description: 'Topical pain relief gel.', 
    use_for: 'Body pain, sprain, joint pain, backache', 
    who_can_use: 'Adults. Not for use on open wounds.', 
    general_dose: 'Apply on affected area 2–3 times/day.',
    safety_advice: 'For external use only. Avoid contact with eyes and mucous membranes. Do not apply on broken skin.',
    side_effects: 'Mild skin irritation, redness, or a burning sensation at the application site.',
    expiry: '36 months', official: 'Yes' 
  },
  { 
    id: 'med10', name: 'Betadine Solution', price: '₹70.00', category: 'First Aid', stock: 130, 
    description: 'Wound antiseptic used for cleaning injuries.', 
    use_for: 'Minor wounds, cuts, infection prevention', 
    who_can_use: 'All (avoid if allergic to iodine).', 
    general_dose: 'Apply to clean wound surface as needed.',
    safety_advice: 'For external use only. Do not use for long periods on large areas of skin without medical advice.',
    side_effects: 'Can cause skin irritation or staining.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med11', name: 'Electrolyte Sports Drink', price: '₹50.00', category: 'Hydration & Energy', stock: 80, 
    description: 'Hydration booster with electrolytes.', 
    use_for: 'Dehydration, workout recovery, replenishing salts', 
    who_can_use: 'Teens & adults', 
    general_dose: 'As needed during or after physical activity.',
    safety_advice: 'Contains sugar; not recommended for individuals with diabetes without medical consultation.',
    side_effects: 'Generally safe. High consumption may lead to excessive sugar intake.',
    expiry: '12 months', official: 'Yes' 
  },
  { 
    id: 'med12', name: 'Herbal Cough Syrup', price: '₹85.00', category: 'Cold & Cough', stock: 110, 
    description: 'Soothes throat and reduces cough.', 
    use_for: 'Dry cough, throat irritation, cold symptoms', 
    who_can_use: 'All ages (label-guided)', 
    general_dose: '1-2 teaspoons, 2–3 times a day.',
    safety_advice: 'If cough persists for more than a week, consult a doctor. Some herbal ingredients may interact with other medications.',
    side_effects: 'Generally free of side effects. Some people may experience mild drowsiness.',
    expiry: '12–24 months', official: 'Yes' 
  },
  { 
    id: 'med13', name: 'Antacid Liquid', price: '₹95.00', category: 'Acidity & Indigestion', stock: 100, 
    description: 'Liquid antacid for fast relief.', 
    use_for: 'Acid reflux, gas, heartburn, stomach upset', 
    who_can_use: 'Adults', 
    general_dose: '1–2 tsp after meals and at bedtime.',
    safety_advice: 'Consult a doctor if you need to use it regularly for more than two weeks. May affect absorption of other drugs.',
    side_effects: 'Can cause constipation or diarrhea depending on the ingredients.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med14', name: 'Moisturizing Cream', price: '₹150.00', category: 'Skin Care', stock: 100, 
    description: 'Keeps skin moisturized and soft.', 
    use_for: 'Dry skin, mild irritation, daily skin care', 
    who_can_use: 'All ages', 
    general_dose: 'Apply gently twice daily or as needed.',
    safety_advice: 'For external use only. Discontinue use if rash or irritation occurs.',
    side_effects: 'Very rare. Some individuals might be allergic to certain ingredients.',
    expiry: '36 months', official: 'Yes' 
  },
  { 
    id: 'med15', name: 'Bandages', price: '₹40.00', category: 'First Aid', stock: 200, 
    description: 'Wound protection bandages.', 
    use_for: 'Minor cuts, wounds, scrapes', 
    who_can_use: 'All ages', 
    general_dose: 'Apply to clean, dry skin. Change daily or if it gets wet.',
    safety_advice: 'If the wound is deep or bleeds heavily, seek medical attention.',
    side_effects: 'Skin irritation from adhesive in rare cases.',
    expiry: '5 years', official: 'Yes' 
  },
  { 
    id: 'med16', name: 'Antiseptic Wipes', price: '₹60.00', category: 'First Aid', stock: 150, 
    description: 'Prevents germs on skin surface.', 
    use_for: 'Cleaning skin, minor wounds, surfaces', 
    who_can_use: 'All ages', 
    general_dose: 'Single-use wipes. Use to wipe the affected area.',
    safety_advice: 'For external use only. Avoid contact with eyes.',
    side_effects: 'Can cause dryness or irritation with frequent use.',
    expiry: '24–36 months', official: 'Yes' 
  },
  { 
    id: 'med17', name: 'ORS Kids Formula', price: '₹25.00', category: 'Hydration & Energy', stock: 70, 
    description: 'Kids-friendly ORS drink.', 
    use_for: 'Child dehydration due to diarrhea or vomiting', 
    who_can_use: 'Children (doctor advised for infants).', 
    general_dose: 'Use as per label or as directed by a pediatrician.',
    safety_advice: 'Must be consumed within 24 hours of preparation. Seek medical help if dehydration is severe.',
    side_effects: 'Generally safe. May cause mild bloating.',
    expiry: '12 months', official: 'Yes' 
  },
  { 
    id: 'med18', name: 'Glucose Powder', price: '₹55.00', category: 'Hydration & Energy', stock: 120, 
    description: 'Quick energy booster.', 
    use_for: 'Low energy, heat weakness, post-illness recovery', 
    who_can_use: 'All ages', 
    general_dose: 'Mix in water and drink as needed.',
    safety_advice: 'Not suitable for diabetic patients without medical advice due to high sugar content.',
    side_effects: 'No significant side effects when used in moderation.',
    expiry: '36 months', official: 'Yes' 
  },
  { 
    id: 'med19', name: 'Pain Relief Spray', price: '₹130.00', category: 'Topical Pain Relief', stock: 60, 
    description: 'Instant pain relief spray.', 
    use_for: 'Muscle pain, sprain, back pain, joint stiffness', 
    who_can_use: 'Adults', 
    general_dose: 'Spray on the affected area 2–3 times a day.',
    safety_advice: 'Do not spray near eyes, face, or on open wounds. Highly flammable, keep away from heat.',
    side_effects: 'May cause a cooling or burning sensation at the site of application.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med20', name: 'ORS Fruit Flavor', price: '₹22.00', category: 'Hydration & Energy', stock: 140, 
    description: 'Easy-to-drink flavored ORS.', 
    use_for: 'Hydration for kids & adults during diarrhea or vomiting', 
    who_can_use: 'All ages', 
    general_dose: 'Mix sachet in 1L water and finish within 24 hours.',
    safety_advice: 'Same as regular ORS. The flavor is for palatability.',
    side_effects: 'None, when used as directed.',
    expiry: '12–24 months', official: 'Yes' 
  },
  { 
    id: 'med21', name: 'Amoxicillin 250mg', price: '₹80.00', category: 'Antibiotics', stock: 50, 
    description: 'Common antibiotic for bacterial infections.', 
    use_for: 'Bacterial infections (ear, throat, skin, etc.)', 
    who_can_use: 'Doctor prescribed only', 
    general_dose: 'As prescribed by doctor. Complete the full course.',
    safety_advice: 'Prescription required. Do not self-medicate. Inform your doctor of any allergies, especially to penicillin.',
    side_effects: 'Diarrhea, nausea, and skin rash are possible. Inform your doctor if severe.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med22', name: 'Azithromycin 500mg', price: '₹120.00', category: 'Antibiotics', stock: 40, 
    description: 'Broad-spectrum antibiotic.', 
    use_for: 'Respiratory, skin, and other infections', 
    who_can_use: 'Doctor prescribed only', 
    general_dose: '3-day or 5-day course as prescribed.',
    safety_advice: 'Prescription required. Take as directed and complete the course. Can interact with other medications.',
    side_effects: 'Stomach upset, diarrhea, vomiting are common.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med23', name: 'Loratadine 10mg', price: '₹40.00', category: 'Allergy Relief', stock: 150, 
    description: 'Non-drowsy anti-allergy tablet.', 
    use_for: 'Allergies, hives, itching, runny nose', 
    who_can_use: 'Adults and children over 6', 
    general_dose: 'Once daily.',
    safety_advice: 'Generally non-drowsy, but individual reactions may vary. Consult a doctor if symptoms persist.',
    side_effects: 'Headache and fatigue are possible but uncommon.',
    expiry: '36 months', official: 'Yes' 
  },
  { 
    id: 'med24', name: 'Omeprazole 20mg', price: '₹75.00', category: 'Acidity & Indigestion', stock: 90, 
    description: 'Proton pump inhibitor to reduce stomach acid.', 
    use_for: 'GERD, heartburn, stomach ulcers', 
    who_can_use: 'Adults (consult doctor for long-term use)', 
    general_dose: 'Once daily before a meal.',
    safety_advice: 'Best taken 30-60 minutes before your first meal of the day. Long-term use should be monitored by a doctor.',
    side_effects: 'Headache, stomach pain, and diarrhea can occur.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med25', name: 'Multivitamin Tablets', price: '₹250.00', category: 'Vitamins & Supplements', stock: 100, 
    description: 'Daily supplement with essential vitamins and minerals.', 
    use_for: 'General wellness, nutritional deficiency', 
    who_can_use: 'Adults', 
    general_dose: 'One tablet daily after meal.',
    safety_advice: 'Do not exceed the recommended daily dose. This is a supplement, not a substitute for a balanced diet.',
    side_effects: 'Generally safe. Can cause mild stomach upset in some individuals.',
    expiry: '18 months', official: 'Yes' 
  },
  { 
    id: 'med26', name: 'Calcium + Vitamin D3', price: '₹180.00', category: 'Vitamins & Supplements', stock: 120, 
    description: 'For bone health and calcium absorption.', 
    use_for: 'Bone strength, calcium deficiency, osteoporosis prevention', 
    who_can_use: 'Adults, especially elderly women.', 
    general_dose: 'One or two tablets daily as advised.',
    safety_advice: 'Take with food for better absorption. Inform your doctor if you have kidney problems.',
    side_effects: 'Constipation and upset stomach can occur.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med27', name: 'Cough Drops', price: '₹35.00', category: 'Cold & Cough', stock: 300, 
    description: 'Medicated lozenges for sore throat.', 
    use_for: 'Sore throat, cough suppression', 
    who_can_use: 'Adults and children over 5', 
    general_dose: 'Dissolve one in mouth every 2-3 hours.',
    safety_advice: 'If sore throat is severe or lasts for more than 2 days, consult a doctor.',
    side_effects: 'No major side effects. Excessive use may have a laxative effect due to sweeteners.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med28', name: 'Nasal Decongestant Spray', price: '₹90.00', category: 'Cold & Cough', stock: 80, 
    description: 'Provides fast relief from blocked nose.', 
    use_for: 'Nasal congestion due to cold or allergy', 
    who_can_use: 'Adults (short-term use only)', 
    general_dose: '1-2 sprays per nostril, twice daily.',
    safety_advice: 'Do not use for more than 3-5 consecutive days to avoid rebound congestion.',
    side_effects: 'Temporary burning, stinging, or dryness in the nose.',
    expiry: '36 months', official: 'Yes' 
  },
  { 
    id: 'med29', name: 'Sunscreen SPF 50', price: '₹350.00', category: 'Skin Care', stock: 70, 
    description: 'Broad-spectrum protection from UVA/UVB rays.', 
    use_for: 'Sun protection, preventing sunburn and skin aging', 
    who_can_use: 'All ages above 6 months', 
    general_dose: 'Apply liberally 15 mins before sun exposure. Reapply every 2 hours.',
    safety_advice: 'For external use only. Avoid contact with eyes. Patch test before first use.',
    side_effects: 'Rare. Can cause skin irritation or acne breakouts in sensitive individuals.',
    expiry: '24 months', official: 'Yes' 
  },
  { 
    id: 'med30', name: 'Hand Sanitizer', price: '₹50.00', category: 'First Aid', stock: 250, 
    description: 'Alcohol-based hand sanitizer to kill germs.', 
    use_for: 'Hand hygiene when soap and water are not available', 
    who_can_use: 'All ages (supervise children)', 
    general_dose: 'Use a small amount to cover hands completely and rub until dry.',
    safety_advice: 'Flammable. Keep away from fire or flame. For external use only. Avoid eyes.',
    side_effects: 'Can cause skin dryness with frequent use.',
    expiry: '36 months', official: 'Yes' 
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
