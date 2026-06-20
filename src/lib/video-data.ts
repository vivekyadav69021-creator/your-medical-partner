
export type VideoTutorial = {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  youtube_url: string;
  duration: string; // Added duration field
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
      { id: 'hyg1', title: { en: 'How to wash your hands — WHO', hi: 'अपने हाथ कैसे धोएं — WHO' }, description: { en: 'Proper technique from WHO.', hi: 'WHO से उचित तकनीक।' }, youtube_url: 'https://www.youtube.com/embed/3PmVJQUCm4E', duration: '2:30' },
      { id: 'hyg2', title: { en: 'Hand-washing steps (WHO)', hi: 'हाथ धोने के चरण (WHO)' }, description: { en: 'WHO step-by-step hand hygiene.', hi: 'WHO द्वारा कदम-दर-कदम हाथ की स्वच्छता।' }, youtube_url: 'https://www.youtube.com/embed/IisgnbMfKvI', duration: '1:45' },
      { id: 'hyg3', title: { en: 'Best Way to Wash Your Hands (WHO 11-step)', hi: 'हाथ धोने का सबसे अच्छा तरीका (WHO 11-चरणीय)' }, description: { en: 'Comprehensive WHO demo.', hi: 'WHO का व्यापक प्रदर्शन।' }, youtube_url: 'https://www.youtube.com/embed/v7AYKMP6rOE', duration: '3:15' },
      { id: 'hyg4', title: { en: 'Oral hygiene basics — Colgate', hi: 'मौखिक स्वच्छता की मूल बातें — कोलगेट' }, description: { en: 'Daily oral care tips.', hi: 'दैनिक मौखिक देखभाल युक्तियाँ।' }, youtube_url: 'https://youtu.be/5J89gCDt_rk?si=4FgFkfeW2oWduuKH', duration: '4:20' },
      { id: 'hyg5', title: { en: 'Personal hygiene for kids — UNICEF', hi: 'बच्चों के लिए व्यक्तिगत स्वच्छता — यूनिसेफ' }, description: { en: 'Hygiene for children.', hi: 'बच्चों के लिए स्वच्छता।' }, youtube_url: 'https://youtu.be/0ZPTXQ0KqOQ?si=gmh9kq8aiMP-tJ4W', duration: '2:55' }
    ]
  },
  {
    id: 'firstaid',
    title: { en: 'First Aid', hi: 'फर्स्ट ऐड' },
    description: { en: 'Essential first aid skills that can save a life.', hi: 'आवश्यक प्राथमिक चिकित्सा कौशल जो जीवन बचा सकते हैं।' },
    videos: [
      { id: 'fa1', title: { en: 'How to do CPR — St John Ambulance', hi: 'सीपीआर कैसे करें — सेंट जॉन एम्बुलेंस' }, description: { en: 'Adult CPR steps.', hi: 'वयस्कों के लिए सीपीआर के चरण।' }, youtube_url: 'https://www.youtube.com/embed/BQNNOh8c8ks', duration: '5:10' },
      { id: 'fa2', title: { en: 'Choking first aid — St John Ambulance', hi: 'चोकिंग फर्स्ट ऐड — सेंट जॉन एम्बुलेंस' }, description: { en: 'Help a choking adult/child.', hi: 'एक घुटते हुए वयस्क/बच्चे की मदद करें।' }, youtube_url: 'https://www.youtube.com/embed/HGBBu4zr8sM', duration: '3:30' },
      { id: 'fa3', title: { en: 'Basic Life Support (animated)', hi: 'बेसिक लाइफ सपोर्ट (एनिमेटेड)' }, description: { en: 'Chest compressions & rescue breaths basics.', hi: 'छाती संपीड़न और बचाव श्वास की मूल बातें।' }, youtube_url: 'https://www.youtube.com/embed/Mlp5dRIJk4M', duration: '4:15' },
      { id: 'fa4', title: { en: 'How to treat burns — Red Cross', hi: 'जलने का इलाज कैसे करें — रेड क्रॉस' }, description: { en: 'First steps for burns.', hi: 'जलने के लिए पहले कदम।' }, youtube_url: 'https://youtu.be/CYHGRtPupOo?si=vTGSTQasLubLGleF', duration: '2:40' },
      { id: 'fa5', title: { en: 'Stop the bleed — simple actions', hi: 'खून बहना बंद करें — सरल क्रियाएं' }, description: { en: 'Controlling bleeding basics.', hi: 'खून बहने को नियंत्रित करने की मूल बातें।' }, youtube_url: 'https://youtu.be/NxO5LvgqZe0?si=noVUTzNrKTRzx_UW', duration: '3:05' }
    ]
  },
  {
    id: 'mental',
    title: { en: 'Mental Health', hi: 'मानसिक स्वास्थ्य' },
    description: { en: 'Techniques for managing stress and improving mental well-being.', hi: 'तनाव के प्रबंधन और मानसिक स्वास्थ्य में सुधार के लिए तकनीकें।' },
    videos: [
      { id: 'mh1', title: { en: 'Breathing techniques for relaxation — NHS', hi: 'विश्राम के लिए श्वास तकनीक — एनएचएस' }, description: { en: 'Simple breathing to calm anxiety (NHS).', hi: 'चिंता को शांत करने के लिए सरल श्वास (एनएचएस)।' }, youtube_url: 'https://www.youtube.com/embed/GqfrbGtorBE', duration: '4:50' },
      { id: 'mh2', title: { en: 'Box Breathing — 4-step calming technique', hi: 'बॉक्स ब्रीदिंग — 4-चरणीय शांत करने वाली तकनीक' }, description: { en: 'Box breathing practice.', hi: 'बॉक्स ब्रीदिंग अभ्यास।' }, youtube_url: 'https://www.youtube.com/embed/tEmt1Znux58', duration: '2:15' },
      { id: 'mh3', title: { en: 'Mindfulness for beginners — Jon Kabat-Zinn', hi: 'शुरुआती के लिए माइंडफुलनेस — जॉन कबात-ज़िन' }, description: { en: 'Foundations of mindfulness.', hi: 'माइंडफुलनेस की नींव।' }, youtube_url: 'https://www.youtube.com/embed/3nwwKbM_vJc', duration: '6:20' },
      { id: 'mh4', title: { en: 'How to manage anxiety — TED-Ed', hi: 'चिंता का प्रबंधन कैसे करें — टेड-एड' }, description: { en: 'Animated insight & tips.', hi: 'एनिमेटेड अंतर्दृष्टि और युक्तियाँ।' }, youtube_url: 'https://youtu.be/tK2LaefZcy8?si=oZS62dRS1749KVPp', duration: '5:45' },
      { id: 'mh5', title: { en: 'Guided relaxation for sleep — NHS', hi: 'नींद के लिए निर्देशित विश्राम — एनएचएस' }, description: { en: 'Short relaxation for sleep.', hi: 'नींद के लिए संक्षिप्त विश्राम।' }, youtube_url: 'https://youtu.be/tK2LaefZcy8?si=v0M8CXuKbYcQdb0O', duration: '8:10' }
    ]
  }
];
