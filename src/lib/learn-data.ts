
export type Sutra = {
    sutra: string;
    en: string;
    hi: string;
    explanation: {
        en: string;
        hi: string;
    };
};

export type Chapter = {
    id: string;
    title: {
        en: string;
        hi: string;
    };
    summary: {
        en: string;
        hi: string;
    };
    key_sutras: Sutra[];
    main_points: {
        en: string[];
        hi: string[];
    };
    practice_tips: {
        en: string[];
        hi: string[];
    };
    image: string;
    full_text?: string;
};


export type LearnCollectionItem = {
    id: string;
    title: string;
    summary: string;
    chapters: Chapter[];
}


export const learnCollectionsData: LearnCollectionItem[] = [
    {
        id: 'patanjali_overview',
        title: 'Patanjali Yoga-Sutras',
        summary: "Patanjali's Yoga-Sutras present an 8-limb (Ashtanga) system: Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi. Practicing these systematically leads to mental clarity and liberation.",
        chapters: [
            {
                "id": "samadhi_pada",
                "title": { "en": "Samadhi Pada", "hi": "समाधि पाद" },
                "summary": {
                  "en": "Samadhi Pada explains the nature and goal of yoga: the stilling of mental fluctuations so that the true self (citta) can be experienced. It defines yoga (yogaś citta-vṛtti-nirodhaḥ) and describes stages of concentration leading toward absorption (samadhi). This chapter sets the philosophical foundation and explains obstacles, afflictions (kleshas), and the purpose of practice.",
                  "hi": "समाधि पाद योग का स्वरूप और लक्ष्य बताता है: मन की वृत्तियों का निवारण ताकि सच्चा स्वभाव अनुभव हो सके। इसमें योग को परिभाषित किया गया है (योगश्चित्तवृत्तिनिरोधः) और एकाग्रता से समाधि तक के चरणों का वर्णन है। यह अध्याय दर्शनिक आधार देता है और क्लेश, बाधाएँ और अभ्यास का उद्देश्य समझाता है।"
                },
                "key_sutras": [
                  {
                    "sutra": "1.2 Yogash chitta vritti nirodhah",
                    "en": "Yoga is the cessation of the fluctuations of the mind.",
                    "hi": "योग चित्त-वृत्ति-निरोधः — योग मन की वृत्तियों का निरोध है।",
                    "explanation": {
                      "en": "Core definition: when mental modifications quiet down, the seer can be known.",
                      "hi": "मूल परिभाषा: जब मानसिक गतिविधियाँ शांत होंगी तभी साक्षी का अनुभव संभव है।"
                    }
                  },
                  {
                    "sutra": "1.3 Tada drashtuh svarupe avasthanam",
                    "en": "Then the seer abides in its own nature.",
                    "hi": "तदा द्रष्टुः स्वरूपेऽवस्थानम् — तब द्रष्टा अपने स्वभाव में स्थित होता है।",
                    "explanation": {
                      "en": "When fluctuations stop, the true self is revealed as distinct from thought.",
                      "hi": "वृत्तियाँ ठहर जाएँ तो वास्तविक स्वभाव विचारों से पृथक प्रतीत होता है।"
                    }
                  },
                  {
                    "sutra": "1.12 Abhyasa vairagyabhyam tannirodhah",
                    "en": "Control is achieved by practice and dispassion.",
                    "hi": "अभ्यास-वैराग्याभ्यं तन्निरोधः — निरोध अभ्यास और वैराग्य से होता है।",
                    "explanation": {
                      "en": "Two supports: regular practice (abhyasa) and letting go (vairagya).",
                      "hi": "दो सहायक: नियमित अभ्यास और तटस्थ या त्याग की प्रवृत्ति।"
                    }
                  }
                ],
                "main_points": {
                  "en": [
                    "Defines yoga as mind-control (stilling of vrittis).",
                    "Explains obstacles and the role of practice and detachment.",
                    "Introduces concentration leading toward samadhi."
                  ],
                  "hi": [
                    "योग को चित्त-वृत्ति-निरोध के रूप में परिभाषित करना।",
                    "बाधाएँ और अभ्यास व वैराग्य की भूमिका समझाना।",
                    "ध्यान से समाधि तक की ओर जाने का मार्ग दर्शाना।"
                  ]
                },
                "practice_tips": {
                  "en": [
                    "Start short daily sessions focusing on breath to steady the mind.",
                    "Keep a regular schedule (abhyasa) and cultivate non-attachment (vairagya).",
                    "Note internal chatter as 'thoughts' without identifying with them."
                  ],
                  "hi": [
                    "मन को स्थिर करने के लिए रोज़ छोटी श्वास-आधारित सत्र से शुरुआत करें।",
                    "नियमितता रखें और आसक्ति घटाने का अभ्यास करें।",
                    "आंतरिक विचारों को विचार समझ कर उससे अलग रहें।"
                  ]
                },
                "image": "/mnt/data/A_colorful_informational_poster_with_a_yellow_circ.png"
            },
            {
                "id": "sadhana_pada",
                "title": { "en": "Sadhana Pada", "hi": "साधना पाद" },
                "summary": {
                  "en": "Sadhana Pada outlines practical means for spiritual progress: the eight-limbed practice is introduced and kriya-yoga (practice of action, discipline), yama/niyama, and techniques like pranayama and pratyahara are explained. It shows how ethical discipline and consistent practice reduce afflictions (kleshas).",
                  "hi": "साधना पाद साधनात्मक उपाय बताता है: अष्टांग अभ्यास का परिचय और क्रिया-योग, यम-नियम, प्राणायाम व प्रत्याहार जैसे उपायों का वर्णन। यह दिखाता है कि नैतिक अनुशासन और नियमित अभ्यास क्लेशों को घटाते हैं।"
                },
                "key_sutras": [
                  {
                    "sutra": "2.1 Tapah svadhyaya ishvara pranidhanani kriya yogah",
                    "en": "Kriya-yoga consists of austerity, self-study, and devotion to the Lord.",
                    "hi": "तपः स्वाध्याय ईश्वरप्रणिधानानि क्रिया-योगः — क्रिया-योग में तप, स्वाध्याय और ईश्वर-प्रणिधान शामिल हैं।",
                    "explanation": {
                      "en": "Practical path: discipline, study/introspection, and dedicatory attitude help purify the mind.",
                      "hi": "व्यावहारिक मार्ग: अनुशासन, अध्ययन/स्वावलोकन और समर्पित भावना मन को शुद्ध करते हैं।"
                    }
                  },
                  {
                    "sutra": "2.29 Yama niyama asana pranayama pratyahara",
                    "en": "The limbs: ethical restraints, observances, posture, breath control, withdrawal of senses.",
                    "hi": "यम नियम आसन प्राणायाम प्रत्याहार — यम, नियम, आसन, प्राणायाम, प्रत्याहार आदि अंग।",
                    "explanation": {
                      "en": "Foundation practices preparing the body and mind for deeper concentration.",
                      "hi": "गहन एकाग्रता के लिये शरीर व मन को तैयार करने वाले आधारभूत अभ्यास।"
                    }
                  },
                  {
                    "sutra": "2.46 Sthira sukham asanam",
                    "en": "Posture should be steady and comfortable.",
                    "hi": "स्थिरसुखमासनम् — आसन स्थिर और सुखद होना चाहिए।",
                    "explanation": {
                      "en": "A correct posture supports long practice without distraction.",
                      "hi": "सही आसन लंबे अभ्यास के दौरान विकर्षण को घटाता है।"
                    }
                  }
                ],
                "main_points": {
                  "en": [
                    "Gives practical techniques (yama, niyama, asana, pranayama, pratyahara) as foundations.",
                    "Emphasizes self-discipline, study, and devotion (kriya-yoga).",
                    "Shows how to reduce the five kleshas (ignorance, egoism, attachment, aversion, fear of death)."
                  ],
                  "hi": [
                    "आधारभूत तकनीकें और अनुशासन (यम, नियम, आसन, प्राणायाम, प्रत्याहार) बताए गए हैं।",
                    "क्रिया-योग: तप, स्वाध्याय, ईश्वर-प्रणिधान पर ज़ोर।",
                    "पाँच क्लेशों को घटाने के अभ्यासों का मार्ग।"
                  ]
                },
                "practice_tips": {
                  "en": [
                    "Build a daily routine: small ethical practices, short asana & simple pranayama.",
                    "Practice self-observation (swadhyaya) after sessions to notice change.",
                    "Use pranayama (like Nadi Shodhana) to balance the nervous system before meditation."
                  ],
                  "hi": [
                    "दैनिक दिनचर्या बनाएं: छोटे नैतिक अभ्यास, सरल आसन और प्राणायाम।",
                    "अभ्यास के बाद स्वाध्याय करें ताकि परिवर्तन दिखे।",
                    "ध्यान से पहले नाड़ी-शोधन जैसे प्राणायाम से तंत्रिका तंत्र संतुलित करें।"
                  ]
                },
                "image": "/mnt/data/A_colorful_informational_poster_with_a_yellow_circ.png"
              },
        
              {
                "id": "vibhuti_pada",
                "title": { "en": "Vibhuti Pada", "hi": "विभूति पाद" },
                "summary": {
                  "en": "Vibhuti Pada describes the results of concentrated practice: special powers (siddhis) and refined abilities that can arise from deep concentration and samyama. It warns practitioners not to get distracted by these attainments and to use them, if at all, as aids for liberation rather than goals.",
                  "hi": "विभूति पाद एकाग्र अभ्यास के परिणाम बताते हैं: समाधि और सम्यमा से उत्पन्न होने वाली विभूतियाँ (सिद्धियाँ) और सूक्ष्म क्षमताएँ। यह चेतावनी देता है कि इनपर मोहित न हों और स्वतंत्रता के लक्ष्य के लिए इन्हें साधन समझें।"
                },
                "key_sutras": [
                  {
                    "sutra": "3.3 Tatra pratyaya ekatanata dhyanam",
                    "en": "When attention is firmly one-pointed, that is dhyana (meditation).",
                    "hi": "तत्र प्रत्ययैकतानता ध्यानम् — प्रत्यय की एकता ही ध्यान है।",
                    "explanation": {
                      "en": "Defines meditative absorption as sustained single-pointed attention.",
                      "hi": "एकाग्रता को धारण करने वाला ध्यान के रूप में परिभाषित करता है।"
                    }
                  },
                  {
                    "sutra": "3.16 Viśaya indriya saṁyama",
                    "en": "By holding samyama on the objects of the senses, special knowledge arises.",
                    "hi": "विषयेंद्रियसंयम — इन्द्रियों के विषयों पर सम्यमा करने से विशेष ज्ञान आता है।",
                    "explanation": {
                      "en": "Focused integration of concentration, meditation and absorption on a subject reveals insights.",
                      "hi": "किसी विषय पर समेकित अभ्यास से गहरी समझ उभरती है।"
                    }
                  }
                ],
                "main_points": {
                  "en": [
                    "Explains samyama (combined practice of dharana, dhyana, samadhi) as a method to gain insight.",
                    "Lists types of powers and knowledge that may appear (but are not the goal).",
                    "Cautions against attachment to siddhis; encourages return to the path of liberation."
                  ],
                  "hi": [
                    "सम्यमा (धारणा, ध्यान, समाधि का संयुक्त अभ्यास) से ज्ञान प्राप्ति का वर्णन।",
                    "उपलभ्य जानकारियाँ और शक्तियाँ आती हैं परन्तु ये लक्ष्य नहीं हैं।",
                    "सिद्धियों से लगाव न रखने की चेतावनी और मोक्ष-मार्ग पर लौटने के लिए प्रेरित करना।"
                  ]
                },
                "practice_tips": {
                  "en": [
                    "Focus on intention: practice to deepen clarity, not to seek powers.",
                    "Use samyama on small, harmless subjects (e.g., breath quality) before attempting deeper themes.",
                    "Seek guidance from a qualified teacher if unusual experiences occur."
                  ],
                  "hi": [
                    "इरादे पर ध्यान रखें: अभ्यास स्पष्टता के लिए हो, शक्तियाँ पाने के लिए नहीं।",
                    "छोटे विषयों (जैसे श्वास) पर सम्यमा करके गहराई बढ़ाएँ।",
                    "असामान्य अनुभव होने पर योग्य गुरु से मार्गदर्शन लें।"
                  ]
                },
                "image": "/mnt/data/A_colorful_informational_poster_with_a_yellow_circ.png"
              },
        
              {
                "id": "kaivalya_pada",
                "title": { "en": "Kaivalya Pada", "hi": "कैवल्य पाद" },
                "summary": {
                  "en": "Kaivalya Pada discusses the final stage: liberation (kaivalya) — the isolation of purusha (pure consciousness) from prakriti (nature). It examines the effects of sustained practice, the disappearance of kleshas, and the state of freedom in which the practitioner is no longer bound by mental modifications.",
                  "hi": "कैवल्य पाद अंतिम अवस्था अर्थात् मोक्ष (कैवल्य) के बारे में बताता है — पुरुष का प्रकृति से अलग होना। यह सतत अभ्यास के प्रभाव, क्लेशों का क्षय और उस स्वतंत्र अवस्था का वर्णन करता है जहां व्यक्ति मानसिक वृत्तियों से बंधा नहीं रहता।"
                },
                "key_sutras": [
                  {
                    "sutra": "4.1 Janmau svarasas tu pralaya-bhedena",
                    "en": "The modifications existing from birth fade by the discernment of the distinction between purusha and prakriti.",
                    "hi": "जन्मौ स्वरासस्तु प्रलयभेदेन — पुरुष और प्रकृति के भेद से जन्म से जुड़े प्रभाव समाप्त होते हैं।",
                    "explanation": {
                      "en": "Discriminative knowledge uproots long-standing tendencies and leads toward freedom.",
                      "hi": "भेदबोध से दीर्घकालिक प्रवृत्तियाँ हटती हैं और मुक्ति की ओर मार्ग खुलता है।"
                    }
                  },
                  {
                    "sutra": "4.34 Sthairyam atma-samsthiti",
                    "en": "The steady state of the self and its firm establishment are described.",
                    "hi": "स्थैर्यमात्मसंस्थिति — आत्म-स्थिति की स्थिरता व दृढ़ता का वर्णन।",
                    "explanation": {
                      "en": "Final fruits: stable presence free from fluctuations, steady equanimity.",
                      "hi": "परिणाम: चित्त-व्युत्पन्नताओं से मुक्त, स्थिर समत्व।"
                    }
                  }
                ],
                "main_points": {
                  "en": [
                    "Describes liberation as the end-goal when purusha rests in its own nature.",
                    "Explains how discriminative wisdom dissolves latent impressions.",
                    "Presents practical closure: how practice culminates in stable freedom."
                  ],
                  "hi": [
                    "पुरुष अपने स्वभाव में स्थित होकर मोक्ष प्राप्त करता है।",
                    "भेदबोध से आत्मानुबन्धी सम्प्रेषण नष्ट होते हैं।",
                    "अभ्यास का समापन और स्थिर मुक्ति की स्थिति बतायी गयी है।"
                  ]
                },
                "practice_tips": {
                  "en": [
                    "Cultivate steady awareness over time; avoid rushing for results.",
                    "Combine ethical living, steady practice and reflective insight to reduce conditioned patterns.",
                    "Accept the gradual nature of transformation — keep compassionate patience."
                  ],
                  "hi": [
                    "समय के साथ स्थिर जागरूकता का विकास करें; परिणामों के लिये जल्दबाजी न करें।",
                    "नैतिक जीवन, नियमित अभ्यास और चिंतन से परीचित पैटर्न घटाएँ।",
                    "परिवर्तन की क्रमिकता अपनाएँ और धैर्य रखें।"
                  ]
                },
                "image": "/mnt/data/A_colorful_informational_poster_with_a_yellow_circ.png"
              }
        ]
    },
    {
        id: 'gita_overview',
        title: 'Bhagavad Gita',
        summary: 'The Bhagavad Gita emphasizes action with detachment (karma-yoga), devotion (bhakti) and knowledge (jnana). Its teachings complement meditation by providing ethical and motivational context.',
        chapters: []
    }
]
