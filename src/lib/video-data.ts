
export type VideoTutorial = {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  youtube_url: string;
  thumbnailId: string; // Keep for now, can be used for custom thumbnails
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
      { id: 'hyg1', title: { en: 'How to wash your hands — WHO', hi: 'अपने हाथ कैसे धोएं — WHO' }, description: { en: 'Proper technique from WHO.', hi: 'WHO से उचित तकनीक।' }, youtube_url: 'https://www.youtube.com/embed/3PmVJQUCm4E', thumbnailId: 'meditation-hero' },
      { id: 'hyg2', title: { en: 'Hand-washing steps (WHO)', hi: 'हाथ धोने के चरण (WHO)' }, description: { en: 'WHO step-by-step hand hygiene.', hi: 'WHO द्वारा कदम-दर-कदम हाथ की स्वच्छता।' }, youtube_url: 'https://www.youtube.com/embed/IisgnbMfKvI', thumbnailId: 'meditation-hero' },
      { id: 'hyg3', title: { en: 'Best Way to Wash Your Hands (WHO 11-step)', hi: 'हाथ धोने का सबसे अच्छा तरीका (WHO 11-चरणीय)' }, description: { en: 'WHO 11-step guide.', hi: 'WHO 11-चरणीय गाइड।' }, youtube_url: 'https://www.youtube.com/embed/vXPfF2A-xf4', thumbnailId: 'meditation-hero' }
    ]
  },
  {
    id: 'firstaid',
    title: { en: 'First Aid', hi: 'फर्स्ट ऐड' },
    description: { en: 'Essential first aid skills that can save a life.', hi: 'आवश्यक प्राथमिक चिकित्सा कौशल जो जीवन बचा सकते हैं।' },
    videos: [
      { id: 'fa1', title: { en: 'How to do CPR — St John Ambulance', hi: 'सीपीआर कैसे करें — सेंट जॉन एम्बुलेंस' }, description: { en: 'CPR steps for adults (St John Ambulance).', hi: 'वयस्कों के लिए सीपीआर के चरण (सेंट जॉन एम्बुलेंस)।' }, youtube_url: 'https://www.youtube.com/embed/BQNNOh8c8ks', thumbnailId: 'meditation-hero' },
      { id: 'fa2', title: { en: 'First Aid — Choking (how to help)', hi: 'प्राथमिक चिकित्सा — चोकिंग (कैसे मदद करें)' }, description: { en: 'Choking: step-by-step first aid.', hi: 'चोकिंग: कदम-दर-कदम प्राथमिक चिकित्सा।' }, youtube_url: 'https://www.youtube.com/embed/HGBBu4zr8sM', thumbnailId: 'meditation-hero' },
      { id: 'fa3', title: { en: 'Basic Life Support (animated)', hi: 'बेसिक लाइफ सपोर्ट (एनिमेटेड)' }, description: { en: 'BLS basics animation — chest compressions & safety.', hi: 'बीएलएस मूल बातें एनीमेशन — छाती संपीड़न और सुरक्षा।' }, youtube_url: 'https://www.youtube.com/embed/Mlp5dRIJk4M', thumbnailId: 'meditation-hero' }
    ]
  },
  {
    id: 'mental',
    title: { en: 'Mental Health', hi: 'मानसिक स्वास्थ्य' },
    description: { en: 'Techniques for managing stress and improving mental well-being.', hi: 'तनाव के प्रबंधन और मानसिक स्वास्थ्य में सुधार के लिए तकनीकें।' },
    videos: [
      { id: 'mh1', title: { en: 'Breathing techniques for relaxation — NHS', hi: 'विश्राम के लिए श्वास तकनीक — एनएचएस' }, description: { en: 'Simple breathing to calm anxiety (NHS).', hi: 'चिंता को शांत करने के लिए सरल श्वास (एनएचएस)।' }, youtube_url: 'https://www.youtube.com/embed/GqfrbGtorBE', thumbnailId: 'meditation-hero' },
      { id: 'mh2', title: { en: 'Box Breathing — 4-step calming technique', hi: 'बॉक्स ब्रीदिंग — 4-चरणीय शांत करने वाली तकनीक' }, description: { en: 'Box/box-breathing demo & practice.', hi: 'बॉक्स/बॉक्स-ब्रीदिंग डेमो और अभ्यास।' }, youtube_url: 'https://www.youtube.com/embed/tEmt1Znux58', thumbnailId: 'meditation-hero' },
      { id: 'mh3', title: { en: 'Breathing technique to reduce anxiety', hi: 'चिंता कम करने के लिए श्वास तकनीक' }, description: { en: 'Guided breathwork to reduce stress.', hi: 'तनाव कम करने के लिए निर्देशित श्वास-कार्य।' }, youtube_url: 'https://www.youtube.com/embed/HlH6geEBgIw', thumbnailId: 'meditation-hero' }
    ]
  },
  {
    id: 'yoga',
    title: { en: 'Yoga & Movement', hi: 'योग और व्यायाम' },
    description: { en: 'Gentle yoga practices for all levels.', hi: 'सभी स्तरों के लिए कोमल योग अभ्यास।' },
    videos: [
      { id: 'y1', title: { en: '10-Minute Morning Yoga (Yoga With Adriene)', hi: '10 मिनट का सुबह का योग (योग विद एड्रियन)' }, description: { en: 'Short energizing morning sequence.', hi: 'संक्षिप्त ऊर्जावान सुबह का क्रम।' }, youtube_url: 'https://www.youtube.com/embed/VaoV1PrYft4', thumbnailId: 'meditation-hero' },
      { id: 'y2', title: { en: 'Yoga for Focus & Productivity (10 min)', hi: 'फोकस और उत्पादकता के लिए योग (10 मिनट)' }, description: { en: 'Quick practice for concentration.', hi: 'एकाग्रता के लिए त्वरित अभ्यास।' }, youtube_url: 'https://www.youtube.com/embed/Nnd5Slo02us', thumbnailId: 'meditation-hero' },
      { id: 'y3', title: { en: 'Morning Yoga — start your day', hi: 'सुबह का योग — अपने दिन की शुरुआत करें' }, description: { en: 'Full body morning flow to wake up.', hi: 'जागने के लिए पूरे शरीर का सुबह का प्रवाह।' }, youtube_url: 'https://www.youtube.com/embed/Is8tMCpv4F8', thumbnailId: 'meditation-hero' }
    ]
  },
  {
    id: 'nutrition',
    title: { en: 'Nutrition', hi: 'पोषण' },
    description: { en: 'Learn the basics of healthy eating from experts.', hi: 'विशेषज्ञों से स्वस्थ भोजन की मूल बातें जानें।' },
    videos: [
      { id: 'n1', title: { en: 'Healthy Eating Plate — Harvard', hi: 'हेल्दी ईटिंग प्लेट — हार्वर्ड' }, description: { en: "Harvard's Healthy Eating Plate explained.", hi: 'हार्वर्ड की हेल्दी ईटिंग प्लेट की व्याख्या की गई।' }, youtube_url: 'https://www.youtube.com/embed/UuvvbGSe_Y4', thumbnailId: 'meditation-hero' },
      { id: 'n2', title: { en: 'Eat, Drink & Be Healthy — Harvard panel', hi: 'खाओ, पियो और स्वस्थ रहो — हार्वर्ड पैनल' }, description: { en: 'Expert discussion on healthy diets.', hi: 'स्वस्थ आहार पर विशेषज्ञ चर्चा।' }, youtube_url: 'https://www.youtube.com/embed/Kl-QNssvJBM', thumbnailId: 'meditation-hero' },
      { id: 'n3', title: { en: 'Nutrition basics — Mayo Clinic', hi: 'पोषण की मूल बातें — मेयो क्लिनिक' }, description: { en: 'Practical nutrition advice from Mayo Clinic.', hi: 'मेयो क्लिनिक से व्यावहारिक पोषण सलाह।' }, youtube_url: 'https://www.youtube.com/embed/o-2L8C2DdR8', thumbnailId: 'meditation-hero' }
    ]
  }
];
