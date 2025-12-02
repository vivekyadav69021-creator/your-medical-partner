
export type VideoTutorial = {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  youtube_url: string;
};

export type VideoCategory = {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  videos: VideoTutorial[];
};

export const videoTutorialsData: VideoCategory[] = [
  {
    id: 'hygiene',
    title: { en: 'Hygiene', hi: 'हाइजीन' },
    description: { en: 'Learn about proper hygiene practices from trusted sources.', hi: 'विश्वसनीय स्रोतों से उचित स्वच्छता प्रथाओं के बारे में जानें।' },
    videos: [
      { id: 'hyg1', title: { en: 'How to wash your hands — WHO', hi: 'अपने हाथ कैसे धोएं — WHO' }, description: { en: 'Proper technique from WHO.', hi: 'WHO से उचित तकनीक।' }, youtube_url: 'https://www.youtube.com/embed/3PmVJQUCm4E' },
      { id: 'hyg2', title: { en: 'Hand-washing steps (WHO)', hi: 'हाथ धोने के चरण (WHO)' }, description: { en: 'WHO step-by-step hand hygiene.', hi: 'WHO द्वारा कदम-दर-कदम हाथ की स्वच्छता।' }, youtube_url: 'https://www.youtube.com/embed/IisgnbMfKvI' },
      { id: 'hyg3', title: { en: 'Best Way to Wash Your Hands (WHO 11-step)', hi: 'हाथ धोने का सबसे अच्छा तरीका (WHO 11-चरणीय)' }, description: { en: 'Comprehensive WHO demo.', hi: 'WHO का व्यापक प्रदर्शन।' }, youtube_url: 'https://www.youtube.com/embed/v7AYKMP6rOE' },
      { id: 'hyg4', title: { en: 'Oral hygiene basics — Colgate (trusted tutorial)', hi: 'मौखिक स्वच्छता की मूल बातें — कोलगेट' }, description: { en: 'Daily oral care tips.', hi: 'दैनिक मौखिक देखभाल युक्तियाँ।' }, youtube_url: 'https://youtu.be/5J89gCDt_rk?si=4FgFkfeW2oWduuKH' },
      { id: 'hyg5', title: { en: 'Personal hygiene for kids — UNICEF', hi: 'बच्चों के लिए व्यक्तिगत स्वच्छता — यूनिसेफ' }, description: { en: 'Hygiene for children.', hi: 'बच्चों के लिए स्वच्छता।' }, youtube_url: 'https://youtu.be/0ZPTXQ0KqOQ?si=gmh9kq8aiMP-tJ4W' }
    ]
  },
  {
    id: 'firstaid',
    title: { en: 'First Aid', hi: 'फर्स्ट ऐड' },
    description: { en: 'Essential first aid skills that can save a life.', hi: 'आवश्यक प्राथमिक चिकित्सा कौशल जो जीवन बचा सकते हैं।' },
    videos: [
      { id: 'fa1', title: { en: 'How to do CPR — St John Ambulance', hi: 'सीपीआर कैसे करें — सेंट जॉन एम्बुलेंस' }, description: { en: 'Adult CPR steps.', hi: 'वयस्कों के लिए सीपीआर के चरण।' }, youtube_url: 'https://www.youtube.com/embed/BQNNOh8c8ks' },
      { id: 'fa2', title: { en: 'Choking first aid — St John Ambulance', hi: 'चोकिंग फर्स्ट ऐड — सेंट जॉन एम्बुलेंस' }, description: { en: 'Help a choking adult/child.', hi: 'एक घुटते हुए वयस्क/बच्चे की मदद करें।' }, youtube_url: 'https://www.youtube.com/embed/HGBBu4zr8sM' },
      { id: 'fa3', title: { en: 'Basic Life Support (animated)', hi: 'बेसिक लाइफ सपोर्ट (एनिमेटेड)' }, description: { en: 'Chest compressions & rescue breaths basics.', hi: 'छाती संपीड़न और बचाव श्वास की मूल बातें।' }, youtube_url: 'https://www.youtube.com/embed/Mlp5dRIJk4M' },
      { id: 'fa4', title: { en: 'How to treat burns — Red Cross', hi: 'जलने का इलाज कैसे करें — रेड क्रॉस' }, description: { en: 'First steps for burns.', hi: 'जलने के लिए पहले कदम।' }, youtube_url: 'https://youtu.be/CYHGRtPupOo?si=vTGSTQasLubLGleF' },
      { id: 'fa5', title: { en: 'Stop the bleed — simple actions', hi: 'खून बहना बंद करें — सरल क्रियाएं' }, description: { en: 'Controlling bleeding basics.', hi: 'खून बहने को नियंत्रित करने की मूल बातें।' }, youtube_url: 'https://youtu.be/NxO5LvgqZe0?si=noVUTzNrKTRzx_UW' }
    ]
  },
  {
    id: 'mental',
    title: { en: 'Mental Health', hi: 'मानसिक स्वास्थ्य' },
    description: { en: 'Techniques for managing stress and improving mental well-being.', hi: 'तनाव के प्रबंधन और मानसिक स्वास्थ्य में सुधार के लिए तकनीकें।' },
    videos: [
      { id: 'mh1', title: { en: 'Breathing techniques for relaxation — NHS', hi: 'विश्राम के लिए श्वास तकनीक — एनएचएस' }, description: { en: 'Simple breathing to calm anxiety (NHS).', hi: 'चिंता को शांत करने के लिए सरल श्वास (एनएचएस)।' }, youtube_url: 'https://www.youtube.com/embed/GqfrbGtorBE' },
      { id: 'mh2', title: { en: 'Box Breathing — 4-step calming technique', hi: 'बॉक्स ब्रीदिंग — 4-चरणीय शांत करने वाली तकनीक' }, description: { en: 'Box breathing practice.', hi: 'बॉक्स ब्रीदिंग अभ्यास।' }, youtube_url: 'https://www.youtube.com/embed/tEmt1Znux58' },
      { id: 'mh3', title: { en: 'Mindfulness for beginners — Jon Kabat-Zinn (intro)', hi: 'शुरुआती के लिए माइंडफुलनेस — जॉन कबात-ज़िन (परिचय)' }, description: { en: 'Foundations of mindfulness.', hi: 'माइंडफुलनेस की नींव।' }, youtube_url: 'https://www.youtube.com/embed/3nwwKbM_vJc' },
      { id: 'mh4', title: { en: 'How to manage anxiety — TED-Ed', hi: 'चिंता का प्रबंधन कैसे करें — टेड-एड' }, description: { en: 'Animated insight & tips.', hi: 'एनिमेटेड अंतर्दृष्टि और युक्तियाँ।' }, youtube_url: 'https://www.youtube.com/embed/2Lz0VOltZKA' },
      { id: 'mh5', title: { en: 'Guided relaxation for sleep — NHS', hi: 'नींद के लिए निर्देशित विश्राम — एनएचएस' }, description: { en: 'Short relaxation for sleep.', hi: 'नींद के लिए संक्षिप्त विश्राम।' }, youtube_url: 'https://www.youtube.com/embed/WykPp0sXJxE' }
    ]
  },
  {
    id: 'yoga',
    title: { en: 'Yoga & Movement', hi: 'योग और व्यायाम' },
    description: { en: 'Gentle yoga practices for all levels.', hi: 'सभी स्तरों के लिए कोमल योग अभ्यास।' },
    videos: [
      { id: 'y1', title: { en: '10-Minute Morning Yoga — Yoga With Adriene', hi: '10 मिनट का सुबह का योग — योग विद एड्रियन' }, description: { en: 'Short energizing sequence.', hi: 'संक्षिप्त ऊर्जावान क्रम।' }, youtube_url: 'https://www.youtube.com/embed/VaoV1PrYft4' },
      { id: 'y2', title: { en: 'Yoga for Beginners — Fightmaster Yoga (20 min)', hi: 'शुरुआती के लिए योग — फाइटमास्टर योग (20 मिनट)' }, description: { en: 'Gentle practice for beginners.', hi: 'शुरुआती के लिए कोमल अभ्यास।' }, youtube_url: 'https://www.youtube.com/embed/v7AYKMP6rOE' },
      { id: 'y3', title: { en: 'Yoga for Focus & Productivity (10 min)', hi: 'फोकस और उत्पादकता के लिए योग (10 मिनट)' }, description: { en: 'Quick practice for concentration.', hi: 'एकाग्रता के लिए त्वरित अभ्यास।' }, youtube_url: 'https://www.youtube.com/embed/Nnd5Slo02us' },
      { id: 'y4', title: { en: 'Pranayama — breathing exercises (BKS Iyengar staple)', hi: 'प्राणायाम — श्वास व्यायाम (बीकेएस अयंगर स्टेपल)' }, description: { en: 'Intro to pranayama basics.', hi: 'प्राणायाम की मूल बातों का परिचय।' }, youtube_url: 'https://www.youtube.com/embed/5D3wRZqC3rg' },
      { id: 'y5', title: { en: 'Guided body-scan & relaxation', hi: 'निर्देशित बॉडी-स्कैन और विश्राम' }, description: { en: 'Body awareness practice.', hi: 'शारीरिक जागरूकता अभ्यास।' }, youtube_url: 'https://www.youtube.com/embed/QN0fN6y1UHg' }
    ]
  },
  {
    id: 'nutrition',
    title: { en: 'Nutrition', hi: 'पोषण' },
    description: { en: 'Learn the basics of healthy eating from experts.', hi: 'विशेषज्ञों से स्वस्थ भोजन की मूल बातें जानें।' },
    videos: [
      { id: 'n1', title: { en: 'Healthy Eating Plate — Harvard', hi: 'हेल्दी ईटिंग प्लेट — हार्वर्ड' }, description: { en: "Harvard's guide to balanced plates.", hi: 'हार्वर्ड का संतुलित प्लेटों के लिए गाइड।' }, youtube_url: 'https://www.youtube.com/embed/UuvvbGSe_Y4' },
      { id: 'n2', title: { en: 'Nutrition basics — Mayo Clinic', hi: 'पोषण की मूल बातें — मेयो क्लिनिक' }, description: { en: 'Practical nutrition advice.', hi: 'व्यावहारिक पोषण सलाह।' }, youtube_url: 'https://www.youtube.com/embed/o-2L8C2DdR8' },
      { id: 'n3', title: { en: 'What to eat to lose weight — NHS', hi: 'वजन कम करने के लिए क्या खाएं — एनएचएस' }, description: { en: 'Evidence-based tips.', hi: 'सबूत-आधारित युक्तियाँ।' }, youtube_url: 'https://www.youtube.com/embed/7s7WZ0LkW6c' },
      { id: 'n4', title: { en: 'Plant-based nutrition — NutritionFacts.org', hi: 'पौधा-आधारित पोषण — NutritionFacts.org' }, description: { en: 'Science-backed nutrition facts.', hi: 'विज्ञान-समर्थित पोषण तथ्य।' }, youtube_url: 'https://www.youtube.com/embed/TfU6u3bY1m6c' },
      { id: 'n5', title: { en: 'Hydration & ORS — WHO', hi: 'हाइड्रेशन और ओआरएस — डब्ल्यूएचओ' }, description: { en: 'When and how to use ORS.', hi: 'ओआरएस का उपयोग कब और कैसे करें।' }, youtube_url: 'https://www.youtube.com/embed/9f0vL0vJb1E' }
    ]
  },
  {
    id: 'disease',
    title: { en: 'Disease Awareness & Education', hi: 'रोग जागरूकता और शिक्षा' },
    description: { en: 'Learn about common diseases and their management.', hi: 'आम बीमारियों और उनके प्रबंधन के बारे में जानें।' },
    videos: [
      { id: 'd1', title: { en: 'Understanding Diabetes — Diabetes UK', hi: 'मधुमेह को समझना — डायबिटीज यूके' }, description: { en: 'Causes, prevention, care tips.', hi: 'कारण, रोकथाम, देखभाल युक्तियाँ।' }, youtube_url: 'https://www.youtube.com/embed/KZ3apG2xKZQ' },
      { id: 'd2', title: { en: 'Heart attack signs & response — American Heart Association', hi: 'दिल का दौरा संकेत और प्रतिक्रिया — अमेरिकन हार्ट एसोसिएशन' }, description: { en: 'Recognizing & acting fast.', hi: 'पहचानना और तेजी से कार्य करना।' }, youtube_url: 'https://www.youtube.com/embed/5Msu_EcTyiM' },
      { id: 'd3', title: { en: 'Asthma management basics — NHS', hi: 'अस्थमा प्रबंधन की मूल बातें — एनएचएस' }, description: { en: 'Inhaler use & action plans.', hi: 'इन्हेलर का उपयोग और कार्य योजनाएं।' }, youtube_url: 'https://www.youtube.com/embed/5r2rVYwq4cU' },
      { id: 'd4', title: { en: 'Understanding COVID-19 basics — WHO', hi: 'कोविड-19 की मूल बातें समझना — डब्ल्यूएचओ' }, description: { en: 'Prevention & symptoms.', hi: 'रोकथाम और लक्षण।' }, youtube_url: 'https://www.youtube.com/embed/BtN-goy9VOY' },
      { id: 'd5', title: { en: 'Recognizing stroke — FAST (NHS)', hi: 'स्ट्रोक को पहचानना — फास्ट (एनएचएस)' }, description: { en: 'Quick signs to act on.', hi: 'कार्य करने के लिए त्वरित संकेत।' }, youtube_url: 'https://www.youtube.com/embed/WBZ9X1o1qkA' }
    ]
  },
  {
    id: 'kids',
    title: { en: 'Kids Health (Child Care)', hi: 'बच्चों का स्वास्थ्य' },
    description: { en: 'Information on child health and care.', hi: 'बाल स्वास्थ्य और देखभाल पर जानकारी।' },
    videos: [
      { id: 'k1', title: { en: 'Child vaccinations explained — WHO/UNICEF', hi: 'बच्चों के टीकाकरण की व्याख्या — डब्ल्यूएचओ/यूनिसेफ' }, description: { en: 'Why vaccines matter.', hi: 'टीके क्यों महत्वपूर्ण हैं।' }, youtube_url: 'https://www.youtube.com/embed/6m3M1yjwVmQ' },
      { id: 'k2', title: { en: 'Fever in children — NHS advice', hi: 'बच्चों में बुखार — एनएचएस सलाह' }, description: { en: 'When to worry and how to manage.', hi: 'कब चिंता करें और कैसे प्रबंधित करें।' }, youtube_url: 'https://www.youtube.com/embed/8r3zDg2m0SE' },
      { id: 'k3', title: { en: 'Child nutrition basics — UNICEF', hi: 'बाल पोषण की मूल बातें — यूनिसेफ' }, description: { en: 'Feeding infants & toddlers.', hi: 'शिशुओं और बच्चों को खिलाना।' }, youtube_url: 'https://www.youtube.com/embed/G9rU3bY1m6c' },
      { id: 'k4', title: { en: 'Common childhood illnesses — CDC', hi: 'आम बचपन की बीमारियाँ — सीडीसी' }, description: { en: 'Overview & prevention tips.', hi: 'अवलोकन और रोकथाम युक्तियाँ।' }, youtube_url: 'https://www.youtube.com/embed/8u4QGqQGkYQ' },
      { id: 'k5', title: { en: 'First aid for kids — St John Ambulance', hi: 'बच्चों के लिए प्राथमिक चिकित्सा — सेंट जॉन एम्बुलेंस' }, description: { en: 'CPR & choking in children.', hi: 'बच्चों में सीपीआर और चोकिंग।' }, youtube_url: 'https://www.youtube.com/embed/ql6hA7p1uN4' }
    ]
  },
  {
    id: 'women',
    title: { en: 'Women’s Health', hi: 'महिला स्वास्थ्य' },
    description: { en: 'Health topics specific to women.', hi: 'महिलाओं के लिए विशिष्ट स्वास्थ्य विषय।' },
    videos: [
      { id: 'w1', title: { en: 'Menstrual health basics — WHO', hi: 'मासिक धर्म स्वास्थ्य की मूल बातें — डब्ल्यूएचओ' }, description: { en: 'Periods: care & hygiene.', hi: 'मासिक धर्म: देखभाल और स्वच्छता।' }, youtube_url: 'https://www.youtube.com/embed/0Gkq0vT2j2Q' },
      { id: 'w2', title: { en: 'Pregnancy essentials — NHS', hi: 'गर्भावस्था की अनिवार्य बातें — एनएचएस' }, description: { en: 'Antenatal basics & safety.', hi: 'प्रसव पूर्व मूल बातें और सुरक्षा।' }, youtube_url: 'https://www.youtube.com/embed/Z4K9U9C0Y5Y' },
      { id: 'w3', title: { en: 'PCOS explained — NHS/Endocrine', hi: 'पीसीओएस समझाया गया — एनएचएस/एंडोक्राइन' }, description: { en: 'Symptoms and management.', hi: 'लक्षण और प्रबंधन।' }, youtube_url: 'https://www.youtube.com/embed/4v3Z9q7bXWU' },
      { id: 'w4', title: { en: 'Iron deficiency & anemia — WHO', hi: 'आयरन की कमी और एनीमिया — डब्ल्यूएचओ' }, description: { en: 'Prevention and diet tips.', hi: 'रोकथाम और आहार युक्तियाँ।' }, youtube_url: 'https://www.youtube.com/embed/jw3Xu3i2xI4' },
      { id: 'w5', title: { en: 'Breast self-exam — Mayo Clinic', hi: 'स्तन स्व-परीक्षा — मेयो क्लिनिक' }, description: { en: 'How to check and when to consult.', hi: 'कैसे जांच करें और कब परामर्श करें।' }, youtube_url: 'https://www.youtube.com/embed/9a5w4bY9YgQ' }
    ]
  },
  {
    id: 'seniors',
    title: { en: 'Senior Citizen Health', hi: 'वरिष्ठ नागरिक स्वास्थ्य' },
    description: { en: 'Health advice for older adults.', hi: 'बड़े वयस्कों के लिए स्वास्थ्य सलाह।' },
    videos: [
      { id: 's1', title: { en: 'Preventing falls — CDC', hi: 'गिरने से रोकना — सीडीसी' }, description: { en: 'Home & exercise tips.', hi: 'घर और व्यायाम युक्तियाँ।' }, youtube_url: 'https://www.youtube.com/embed/UBv2M1yYpQA' },
      { id: 's2', title: { en: 'Memory health tips — NIH', hi: 'स्मृति स्वास्थ्य युक्तियाँ — एनआईएच' }, description: { en: 'Brain health & activities.', hi: 'मस्तिष्क स्वास्थ्य और गतिविधियाँ।' }, youtube_url: 'https://www.youtube.com/embed/2yq3pG1fK6U' },
      { id: 's3', title: { en: 'Managing high blood pressure — NHS', hi: 'उच्च रक्तचाप का प्रबंधन — एनएचएस' }, description: { en: 'Lifestyle & meds.', hi: 'जीवनशैली और दवाएं।' }, youtube_url: 'https://www.youtube.com/embed/Z2bH9M0hRms' },
      { id: 's4', title: { en: 'Joint care for older adults — Arthritis Foundation', hi: 'बड़े वयस्कों के लिए जोड़ों की देखभाल — आर्थराइटिस फाउंडेशन' }, description: { en: 'Exercises & pain management.', hi: 'व्यायाम और दर्द प्रबंधन।' }, youtube_url: 'https://www.youtube.com/embed/5s8K9y2a3Z4' },
      { id: 's5', title: { en: 'Healthy aging tips — WHO', hi: 'स्वस्थ उम्र बढ़ने के टिप्स — डब्ल्यूएचओ' }, description: { en: 'Active aging recommendations.', hi: 'सक्रिय उम्र बढ़ने की सिफारिशें।' }, youtube_url: 'https://www.youtube.com/embed/0tZ8A8F6G0I' }
    ]
  },
  {
    id: 'emergency',
    title: { en: 'Emergency Health Skills', hi: 'आपातकालीन स्वास्थ्य कौशल' },
    description: { en: 'Crucial skills for emergency situations.', hi: 'आपातकालीन स्थितियों के लिए महत्वपूर्ण कौशल।' },
    videos: [
      { id: 'e1', title: { en: 'How to respond to a heart attack — AHA', hi: 'दिल के दौरे पर कैसे प्रतिक्रिया दें — एएचए' }, description: { en: 'Recognize & act fast.', hi: 'पहचानें और तेजी से कार्य करें।' }, youtube_url: 'https://www.youtube.com/embed/5Msu_EcTyiM' },
      { id: 'e2', title: { en: 'Burn first aid — Red Cross', hi: 'जलने पर प्राथमिक चिकित्सा — रेड क्रॉस' }, description: { en: 'Immediate steps for burns.', hi: 'जलने के लिए तत्काल कदम।' }, youtube_url: 'https://www.youtube.com/embed/VWVQ5dGv2tI' },
      { id: 'e3', title: { en: 'Snake bite first aid basics', hi: 'सांप के काटने पर प्राथमिक चिकित्सा की मूल बातें' }, description: { en: 'What to do and not do.', hi: 'क्या करें और क्या न करें।' }, youtube_url: 'https://www.youtube.com/embed/1r7p2yGf3bU' },
      { id: 'e4', title: { en: 'Fracture immobilization basics', hi: 'फ्रैक्चर स्थिरीकरण की मूल बातें' }, description: { en: 'Simple splinting techniques.', hi: 'सरल स्प्लिंटिंग तकनीकें।' }, youtube_url: 'https://www.youtube.com/embed/G8G0Zxk5fQo' },
      { id: 'e5', title: { en: 'How to call emergency services & what to report', hi: 'आपातकालीन सेवाओं को कैसे कॉल करें और क्या रिपोर्ट करें' }, description: { en: 'Key info to convey in an emergency.', hi: 'एक आपात स्थिति में बताने के लिए महत्वपूर्ण जानकारी।' }, youtube_url: 'https://www.youtube.com/embed/Zk2JzR7y2xQ' }
    ]
  },
  {
    id: 'dietweight',
    title: { en: 'Diet & Weight Management', hi: 'आहार और वजन प्रबंधन' },
    description: { en: 'Tips and strategies for a healthy diet and weight.', hi: 'स्वस्थ आहार और वजन के लिए टिप्स और रणनीतियाँ।' },
    videos: [
      { id: 'dw1', title: { en: 'Evidence-based weight loss tips — Harvard', hi: 'सबूत-आधारित वजन घटाने के टिप्स — हार्वर्ड' }, description: { en: 'Sustainable strategies.', hi: 'स्थायी रणनीतियाँ।' }, youtube_url: 'https://www.youtube.com/embed/0c1e7v1c4so' },
      { id: 'dw2', title: { en: 'Meal planning basics — Mayo Clinic', hi: 'भोजन योजना की मूल बातें — मेयो क्लिनिक' }, description: { en: 'Portion control & planning.', hi: 'भाग नियंत्रण और योजना।' }, youtube_url: 'https://www.youtube.com/embed/z0rFJ5mY1Zs' },
      { id: 'dw3', title: { en: 'Intermittent fasting overview — NutritionFacts', hi: 'आंतरायिक उपवास अवलोकन — न्यूट्रिशनफैक्ट्स' }, description: { en: 'What the science says.', hi: 'विज्ञान क्या कहता है।' }, youtube_url: 'https://www.youtube.com/embed/2bD3xiM8nTU' },
      { id: 'dw4', title: { en: 'Healthy swaps for snacks', hi: 'स्नैक्स के लिए स्वस्थ स्वैप' }, description: { en: 'Small changes that add up.', hi: 'छोटे बदलाव जो जुड़ते हैं।' }, youtube_url: 'https://www.youtube.com/embed/7aG_JI1kQ28' },
      { id: 'dw5', title: { en: 'Behavioral tips for weight management', hi: 'वजन प्रबंधन के लिए व्यवहारिक सुझाव' }, description: { en: 'Sensible habit building.', hi: 'समझदार आदत निर्माण।' }, youtube_url: 'https://www.youtube.com/embed/QZ8K9y2a3Z4' }
    ]
  },
  {
    id: 'fitness',
    title: { en: 'Fitness & Home Workouts', hi: 'फिटनेस और होम वर्कआउट' },
    description: { en: 'Workouts you can do at home.', hi: 'वर्कआउट जो आप घर पर कर सकते हैं।' },
    videos: [
      { id: 'f1', title: { en: 'Beginner home workout — FitnessBlender (20 min)', hi: 'शुरुआती के लिए होम वर्कआउट — फिटनेसब्लेंडर (20 मिनट)' }, description: { en: 'No equipment full-body.', hi: 'बिना उपकरण के पूरे शरीर का वर्कआउट।' }, youtube_url: 'https://www.youtube.com/embed/UItWltVZZmE' },
      { id: 'f2', title: { en: 'Low-impact cardio — HASfit', hi: 'कम प्रभाव वाला कार्डियो — हैसफिट' }, description: { en: 'Gentle cardio at home.', hi: 'घर पर कोमल कार्डियो।' }, youtube_url: 'https://www.youtube.com/embed/8MMwJH5Jx9k' },
      { id: 'f3', title: { en: 'Strength training basics — ATHLEAN-X (intro)', hi: 'शक्ति प्रशिक्षण की मूल बातें — एथलीन-एक्स (परिचय)' }, description: { en: 'Form & fundamentals.', hi: 'फॉर्म और मूल बातें।' }, youtube_url: 'https://www.youtube.com/embed/U0bhE67HuDY' },
      { id: 'f4', title: { en: '10-minute core workout — Pamela Reif', hi: '10 मिनट का कोर वर्कआउट — पामेला रीफ' }, description: { en: 'Quick effective core routine.', hi: 'त्वरित प्रभावी कोर रूटीन।' }, youtube_url: 'https://www.youtube.com/embed/5ZSlxV3wq3E' },
      { id: 'f5', title: { en: 'Stretching routine — Full body', hi: 'स्ट्रेचिंग रूटीन — पूरा शरीर' }, description: { en: 'Post-workout flexibility.', hi: 'वर्कआउट के बाद लचीलापन।' }, youtube_url: 'https://www.youtube.com/embed/--8V2vQ9qKk' }
    ]
  },
  {
    id: 'skinhair',
    title: { en: 'Skin & Hair Care', hi: 'त्वचा और बालों की देखभाल' },
    description: { en: 'Tips for healthy skin and hair.', hi: 'स्वस्थ त्वचा और बालों के लिए टिप्स।' },
    videos: [
      { id: 'sh1', title: { en: 'Acne basics & treatment — DermNet', hi: 'मुँहासे की मूल बातें और उपचार — डर्मनेट' }, description: { en: 'Causes & care tips.', hi: 'कारण और देखभाल युक्तियाँ।' }, youtube_url: 'https://www.youtube.com/embed/8rY7LqZ1Z0I' },
      { id: 'sh2', title: { en: 'Hair loss causes & treatments — Mayo Clinic', hi: 'बालों के झड़ने के कारण और उपचार — मेयो क्लिनिक' }, description: { en: 'What helps and when to see a doctor.', hi: 'क्या मदद करता है और डॉक्टर को कब दिखाना है।' }, youtube_url: 'https://www.youtube.com/embed/3h4Qb1X2pCE' },
      { id: 'sh3', title: { en: 'Skin care routine for dry skin — NHS', hi: 'शुष्क त्वचा के लिए त्वचा देखभाल दिनचर्या — एनएचएस' }, description: { en: 'Gentle moisturization tips.', hi: 'कोमल मॉइस्चराइजेशन टिप्स।' }, youtube_url: 'https://www.youtube.com/embed/5y3K5jv7u1Q' },
      { id: 'sh4', title: { en: 'How to treat dandruff — European Academy of Dermatology', hi: 'रूसी का इलाज कैसे करें — यूरोपीय त्वचाविज्ञान अकादमी' }, description: { en: 'Shampoo & care tips.', hi: 'शैम्पू और देखभाल युक्तियाँ।' }, youtube_url: 'https://www.youtube.com/embed/1Jf2b6Q9X7k' },
      { id: 'sh5', title: { en: 'Sun safety & skin cancer: prevention', hi: 'धूप से सुरक्षा और त्वचा कैंसर: रोकथाम' }, description: { en: 'Sunscreen & sun smart habits.', hi: 'सनस्क्रीन और सन स्मार्ट आदतें।' }, youtube_url: 'https://www.youtube.com/embed/6Yv3s8L6RkQ' }
    ]
  },
  {
    id: 'sleep',
    title: { en: 'Sleep Health', hi: 'नींद स्वास्थ्य' },
    description: { en: 'Improve your sleep quality.', hi: 'अपनी नींद की गुणवत्ता में सुधार करें।' },
    videos: [
      { id: 'sl1', title: { en: 'Sleep hygiene tips — NHS', hi: 'नींद की स्वच्छता युक्तियाँ — एनएचएस' }, description: { en: 'Practical bedtime routines.', hi: 'व्यावहारिक सोने की दिनचर्या।' }, youtube_url: 'https://www.youtube.com/embed/1nP6g8q0Ydo' },
      { id: 'sl2', title: { en: 'How to fall asleep faster — Sleep Foundation', hi: 'तेजी से कैसे सोएं — स्लीप फाउंडेशन' }, description: { en: 'Techniques & science.', hi: 'तकनीक और विज्ञान।' }, youtube_url: 'https://www.youtube.com/embed/5Y2Zq1pE1Xo' },
      { id: 'sl3', title: { en: 'Relaxation for insomnia — progressive muscle relaxation', hi: 'अनिद्रा के लिए विश्राम — प्रगतिशील मांसपेशी विश्राम' }, description: { en: 'Guided relaxation.', hi: 'निर्देशित विश्राम।' }, youtube_url: 'https://www.youtube.com/embed/2eZsVQZ6lqA' },
      { id: 'sl4', title: { en: 'Circadian rhythm explained — TED-Ed', hi: 'सर्कैडियन लय समझाया गया — टेड-एड' }, description: { en: 'Why our body clock matters.', hi: 'हमारी बॉडी क्लॉक क्यों मायने रखती है।' }, youtube_url: 'https://www.youtube.com/embed/MC0Cq2q0Y9s' },
      { id: 'sl5', title: { en: 'Napping tips — NIH', hi: 'झपकी लेने के टिप्स — एनआईएच' }, description: { en: 'How to nap smartly.', hi: 'स्मार्ट तरीके से झपकी कैसे लें।' }, youtube_url: 'https://www.youtube.com/embed/4gX1v0aA7kU' }
    ]
  },
  {
    id: 'immunity',
    title: { en: 'Immunity Boosting', hi: 'प्रतिरक्षा बढ़ाना' },
    description: { en: 'Ways to support your immune system.', hi: 'अपनी प्रतिरक्षा प्रणाली का समर्थन करने के तरीके।' },
    videos: [
      { id: 'im1', title: { en: 'How immunity works — Khan Academy / immune system basics', hi: 'प्रतिरक्षा कैसे काम करती है — खान अकादमी / प्रतिरक्षा प्रणाली की मूल बातें' }, description: { en: 'Simple primer on immunity.', hi: 'प्रतिरक्षा पर सरल प्राइमर।' }, youtube_url: 'https://www.youtube.com/embed/zQGOcOUBi6s' },
      { id: 'im2', title: { en: 'Lifestyle tips to support immunity — Harvard Health', hi: 'प्रतिरक्षा का समर्थन करने के लिए जीवनशैली युक्तियाँ — हार्वर्ड हेल्थ' }, description: { en: 'Sleep, diet, exercise basics.', hi: 'नींद, आहार, व्यायाम की मूल बातें।' }, youtube_url: 'https://www.youtube.com/embed/3jG3a8GhR5I' },
      { id: 'im3', title: { en: 'Nutrition for immunity — NutritionFacts.org', hi: 'प्रतिरक्षा के लिए पोषण — NutritionFacts.org' }, description: { en: 'Food and immunity science.', hi: 'भोजन और प्रतिरक्षा विज्ञान।' }, youtube_url: 'https://www.youtube.com/embed/4kJ4t1aZ7jo' },
      { id: 'im4', title: { en: 'Vaccines: how they work — WHO', hi: 'टीके: वे कैसे काम करते हैं — डब्ल्यूएचओ' }, description: { en: 'How vaccines protect communities.', hi: 'टीके समुदायों की रक्षा कैसे करते हैं।' }, youtube_url: 'https://www.youtube.com/embed/pp6jR5sP0X4' },
      { id: 'im5', title: { en: 'Stress & immunity link — TEDx / science explainer', hi: 'तनाव और प्रतिरक्षा लिंक — टेडएक्स / विज्ञान व्याख्याता' }, description: { en: 'Why stress weakens immunity.', hi: 'तनाव प्रतिरक्षा को क्यों कमजोर करता है।' }, youtube_url: 'https://www.youtube.com/embed/5dD1pGqN0ZU' }
    ]
  }
];
