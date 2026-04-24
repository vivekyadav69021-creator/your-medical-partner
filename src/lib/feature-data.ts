
export type Feature = {
    id: string;
    title: string;
    path: string;
    content_en: string;
    content_hi: string;
};

export const features: Feature[] = [
  { 
    id: 'dashboard', 
    title: 'Dashboard', 
    path: '/dashboard', 
    content_en: 'The main dashboard provides a quick overview of all health features, including quick access links, appointments, and active challenges.', 
    content_hi: 'मुख्य डैशबोर्ड सभी स्वास्थ्य सुविधाओं का त्वरित अवलोकन प्रदान करता है, जिसमें त्वरित पहुंच लिंक, अपॉइंटमेंट और सक्रिय चुनौतियां शामिल हैं।' 
  },
  { 
    id: 'health-assistant', 
    title: 'AI Health Assistant', 
    path: '/health-assistant', 
    content_en: 'Ask the AI Health Assistant any question about health, diseases, or medicines. You can type or use your voice.', 
    content_hi: 'एआई स्वास्थ्य सहायक से स्वास्थ्य, बीमारियों या दवाओं के बारे में कोई भी प्रश्न पूछें। आप टाइप कर सकते हैं या अपनी आवाज का उपयोग कर सकते हैं।' 
  },
  { 
    id: 'ai-psychiatrist', 
    title: 'AI Psychiatrist', 
    path: '/ai-psychiatrist', 
    content_en: 'A safe space to talk about your mental health with an empathetic AI companion. Supports voice and text in English and Hindi.', 
    content_hi: 'एक सहानुभूतिपूर्ण एआई साथी के साथ अपने मानसिक स्वास्थ्य के बारे में बात करने के लिए एक सुरक्षित स्थान। अंग्रेजी और हिंदी में आवाज और पाठ का समर्थन करता है।' 
  },
  { 
    id: 'disease-scanner', 
    title: 'Disease Scanner', 
    path: '/disease-scanner', 
    content_en: 'Analyze medical images like X-rays and lab reports. Upload an image to get an AI-powered analysis and preliminary findings.', 
    content_hi: 'एक्स-रे और लैब रिपोर्ट जैसी मेडिकल छवियों का विश्लेषण करें। एआई-संचालित विश्लेषण और प्रारंभिक निष्कर्ष प्राप्त करने के लिए एक छवि अपलोड करें।' 
  },
   { 
    id: 'face-scanner', 
    title: 'Face Scanner', 
    path: '/disease-scanner?tab=image-scanner', 
    content_en: 'The Face Scanner in the Disease Scanner feature analyzes a photo of your face for common skin concerns.', 
    content_hi: 'डिजीज स्कैनर सुविधा में फेस स्कैनर आम त्वचा संबंधी चिंताओं के लिए आपके चेहरे की तस्वीर का विश्लेषण करता है।' 
  },
    { 
    id: 'injury-scanner', 
    title: 'Injury Scanner', 
    path: '/disease-scanner?tab=injury-scanner', 
    content_en: 'The Injury Scanner in the Disease Scanner feature analyzes a description or photo of an injury to provide guidance.', 
    content_hi: 'डिजीज स्कैनर सुविधा में इंजरी स्कैनर मार्गदर्शन प्रदान करने के लिए चोट के विवरण या तस्वीर का विश्लेषण करता है।' 
  },
    { 
    id: 'xray-scanner', 
    title: 'X-ray Scanner', 
    path: '/disease-scanner?tab=xray-scanner', 
    content_en: 'The X-ray Scanner in the Disease Scanner feature provides a preliminary analysis of radiology images.', 
    content_hi: 'डिजीज स्कैनर सुविधा में एक्स-रे स्कैनर रेडियोलॉजी छवियों का प्रारंभिक विश्लेषण प्रदान करता है।' 
  },
    { 
    id: 'lab-report-scanner', 
    title: 'Lab Report Scanner', 
    path: '/disease-scanner?tab=lab-scanner', 
    content_en: 'The Lab Report Scanner in the Disease Scanner feature interprets values from an uploaded lab report image.', 
    content_hi: 'डिजीज स्कैनर सुविधा में लैब रिपोर्ट स्कैनर अपलोड की गई लैब रिपोर्ट छवि से मूल्यों की व्याख्या करता है।' 
  },
  { 
    id: 'consultation', 
    title: 'Doctor Consultation', 
    path: '/consultation', 
    content_en: 'Find and book video call appointments with Indian and foreign doctors. You can view upcoming appointments and join calls directly.', 
    content_hi: 'भारतीय और विदेशी डॉक्टरों के साथ वीडियो कॉल अपॉइंटमेंट खोजें और बुक करें। आप आगामी अपॉइंटमेंट देख सकते हैं और सीधे कॉल में शामिल हो सकते हैं।' 
  },
  { 
    id: 'store', 
    title: 'Medical Store', 
    path: '/store', 
    content_en: 'Order medicines and health products. You can browse categories, search for products, or upload a prescription for the AI to analyze.', 
    content_hi: 'दवाएं और स्वास्थ्य उत्पाद ऑर्डर करें। आप श्रेणियां ब्राउज़ कर सकते हैं, उत्पादों की खोज कर सकते हैं, या एआई के विश्लेषण के लिए एक नुस्खा अपलोड कर सकते हैं।' 
  },
  { 
    id: 'planner', 
    title: 'My Planner', 
    path: '/planner', 
    content_en: 'Organize your daily health tasks. Add, edit, and track tasks related to medication, fitness, and general wellbeing.', 
    content_hi: 'अपने दैनिक स्वास्थ्य कार्यों को व्यवस्थित करें। दवा, फिटनेस और सामान्य कल्याण से संबंधित कार्यों को जोड़ें, संपादित करें और ट्रैक करें।' 
  },
  { 
    id: 'nearby-hospital', 
    title: 'Nearby Hospitals', 
    path: '/nearby-hospital', 
    content_en: 'Find hospitals and clinics near your current location on an interactive map. You can get directions and see details.', 
    content_hi: 'एक इंटरेक्टिव मानचित्र पर अपने वर्तमान स्थान के पास के अस्पताल और क्लीनिक खोजें। आप दिशा-निर्देश प्राप्त कर सकते हैं और विवरण देख सकते हैं।' 
  },
  { 
    id: 'challenges', 
    title: 'Health Challenges', 
    path: '/challenges', 
    content_en: 'Join community health challenges or use the AI Health Planner to create a personalized weekly diet and exercise plan.', 
    content_hi: 'सामुदायिक स्वास्थ्य चुनौतियों में शामिल हों या व्यक्तिगत साप्ताहिक आहार और व्यायाम योजना बनाने के लिए एआई स्वास्थ्य योजनाकार का उपयोग करें।' 
  },
  { 
    id: 'meditation-hub', 
    title: 'Meditation Hub', 
    path: '/meditation-hub', 
    content_en: 'A center for mindfulness. Practice guided meditations, track your mood with an AI suggester, and learn from ancient texts like the Yoga-Sutras.', 
    content_hi: 'माइंडफुलनेस का केंद्र। निर्देशित ध्यान का अभ्यास करें, एआई सजेस्टर के साथ अपने मूड को ट्रैक करें, और योग-सूत्र जैसे प्राचीन ग्रंथों से सीखें।' 
  },
  { 
    id: 'yoga-library', 
    title: 'Yoga Library', 
    path: '/yoga-library', 
    content_en: 'Explore a library of yoga poses with detailed instructions and benefits in both English and Hindi.', 
    content_hi: 'अंग्रेजी और हिंदी दोनों में विस्तृत निर्देशों और लाभों के साथ योग आसनों की एक लाइब्रेरी का अन्वेषण करें।' 
  },
  { 
    id: 'video-tutorials', 
    title: 'Video Library', 
    path: '/video-tutorials', 
    content_en: 'Watch expert videos on various health topics, including hygiene, first aid, mental health, and nutrition.', 
    content_hi: 'स्वच्छता, प्राथमिक चिकित्सा, मानसिक स्वास्थ्य और पोषण सहित विभिन्न स्वास्थ्य विषयों पर विशेषज्ञ वीडियो देखें।' 
  },
  { 
    id: 'health-lessons', 
    title: 'Health Lessons', 
    path: '/health-lessons', 
    content_en: 'Learn about important health topics like nutrition and first aid. Take quizzes to test your knowledge and earn certificates.', 
    content_hi: 'पोषण और प्राथमिक चिकित्सा जैसे महत्वपूर्ण स्वास्थ्य विषयों के बारे में जानें। अपने ज्ञान का परीक्षण करने और प्रमाण पत्र अर्जित करने के लिए क्विज़ लें।' 
  },
  { 
    id: 'disease-library', 
    title: 'Disease Library', 
    path: '/disease-library', 
    content_en: 'A comprehensive library of common diseases and conditions with information on symptoms, treatment, and when to see a doctor.', 
    content_hi: 'लक्षणों, उपचार और डॉक्टर को कब दिखाना है, इस पर जानकारी के साथ सामान्य बीमारियों और स्थितियों की एक व्यापक लाइब्रेरी।' 
  }
];
