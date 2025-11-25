
export type Sutra = {
    sutra: string;
    en: string;
    hi: string;
    explanation: {
        en: string;
        hi: string;
    };
};

export type Verse = {
    verse_ref: string;
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
    key_sutras?: Sutra[];
    key_verses?: Verse[];
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
    notes?: {
        en: string;
        hi: string;
    };
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
                "image": "https://picsum.photos/seed/patanjali1/1200/600"
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
                "image": "https://picsum.photos/seed/patanjali2/1200/600"
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
                "image": "https://picsum.photos/seed/patanjali3/1200/600"
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
                "image": "https://picsum.photos/seed/patanjali4/1200/600"
              }
        ]
    },
    {
        id: 'gita_overview',
        title: 'Bhagavad Gita',
        summary: 'The Bhagavad Gita emphasizes action with detachment (karma-yoga), devotion (bhakti) and knowledge (jnana). Its teachings complement meditation by providing ethical and motivational context.',
        chapters: [
            {
                "id": "gita_ch_1",
                "title": { "en": "Chapter 1 — Arjuna Vishāda Yoga", "hi": "अध्याय 1 — अर्जुन विषाद योग" },
                "summary": {
                  "en": "Chapter 1 sets the scene on the battlefield of Kurukshetra. Arjuna, the warrior, sees relatives and teachers on both sides and is overcome with sorrow and moral confusion about fighting. He feels powerless and questions duty (dharma), leading to inner crisis—this sets the need for spiritual teaching.",
                  "hi": "पहला अध्याय कुरुक्षेत्र के रणभूमि का दृश्य पेश करता है। अर्जुन अपने परिजनों और गुरुओं को दोनों पक्षों में देखकर व्याकुल हो जाता है। उसे युद्ध करने में नैतिक संदेह होता है और वह कर्तव्य (धर्म) के बारे में भ्रमित हो उठता है—यही स्थिति आगे के उपदेश की आवश्यकता दिखाती है।"
                },
                "key_verses": [
                  {
                    "verse_ref": "1.28-1.30",
                    "en": "Arjuna said: O Krishna, seeing my kinsmen present here eager to fight, my limbs fail and my mouth is parched; my body trembles and my hair stands on end.",
                    "hi": "अर्जुन बोले: हे कृष्ण! यहाँ अपने परिवार के युद्ध में उतरने को तत्पर देखकर मेरी भुजाएँ नाहक कम्पित हो रही हैं, मुख सूखा और शरीर काँप रहा है, बाल खड़े हो रहे हैं।",
                    "explanation": {
                      "en": "Describes the physical and emotional collapse of Arjuna—shows how moral conflict can produce intense physical distress and indecision.",
                      "hi": "अर्जुन के मानसिक संघर्ष का शारीरिक और भावात्मक प्रभाव दिखता है—बताता है कि नैतिक द्वंद्व किस प्रकार तीव्र संकट पैदा कर सकता है।"
                    }
                  },
                  {
                    "verse_ref": "1.47",
                    "en": "Sanjaya said: Having spoken thus, Arjuna, cast aside his bow and arrow and sat down on the seat of the chariot, his mind overwhelmed with grief.",
                    "hi": "संजय ने कहा: ऐसा कहकर, अर्जुन ने अपना धनुष और बाण अलग रख दिया और रथ की सीट पर बैठ गया, उसका मन दुःख से भर गया।",
                    "explanation": {
                      "en": "Arjuna considers abandoning the fight—this moment creates the opening for Krishna's teaching about duty and the nature of action.",
                      "hi": "अर्जुन युद्ध छोड़ने का विचार करता है—यह क्षण कृष्ण के धर्म और कर्म के उपदेश के लिए रास्ता खोलता है।"
                    }
                  }
                ],
                "main_points": {
                  "en": [
                    "Introduces Arjuna's moral crisis and psychological state.",
                    "Shows how attachment, aversion, and compassion can cloud duty.",
                    "Prepares the ground for the Gita’s core teachings on action, knowledge and devotion."
                  ],
                  "hi": [
                    "अर्जुन के नैतिक संकट और मानसिक स्थिति का परिचय।",
                    "आसक्ति, द्वेष और करुणा किस प्रकार धर्म को अस्फुट कर सकती है।",
                    "कर्म, ज्ञान और भक्ति पर गीता के मुख्य उपदेशों के लिए आधार तैयार करना।"
                  ]
                },
                "practice_tips": {
                  "en": [
                    "When confused about a decision, pause and list values (dharma) and responsibilities before acting.",
                    "Short mindfulness breathing (2–3 min) helps calm the body-mind in crisis moments.",
                    "Discuss dilemmas with a trusted mentor (teacher) to gain perspective before choosing action."
                  ],
                  "hi": [
                    "किसी निर्णय में उलझन हो तो पहले अपने मूल्य (धर्म) और जिम्मेदारियाँ सूचीबद्ध करो।",
                    "संक्षिप्त माइंडफुल श्वास (2–3 मिनट) संकट के क्षण में शरीर-मन शांत करने में मदद करता है।",
                    "निर्णय लेने से पहले भरोसेमंद गुरु या मार्गदर्शक से चर्चा कर लो।"
                  ]
                },
                "image": "https://picsum.photos/seed/gita1/1200/600",
                "notes": {
                  "en": "Contextual note: Chapter 1 is diagnostic—identifies the human crisis that requires teaching. Use it in-app as 'When you feel stuck' module.",
                  "hi": "संदर्भ: अध्याय 1 निदानात्मक है—यह मानव संकट बताता है जो उपदेश की आवश्यकता दर्शाता है। ऐप में इसे 'जब आप अटकें' मॉड्यूल के रूप में उपयोग करें।"
                }
            },
            {
                "id": "gita_ch_2",
                "title": { "en": "Chapter 2 — Sankhya Yoga", "hi": "अध्याय 2 — सांख्ययोग" },
                "summary": {
                  "en": "Chapter 2 is Krishna’s first major reply. He teaches the immortality of the soul (ātman), the impermanence of the body, and introduces key teachings: equanimity, detached action (karma-yoga), and wise discrimination (buddhi). Famous verses include teachings on duty without attachment (2.47) and the steady mind (2.54–2.58).",
                  "hi": "दूसरा अध्याय कृष्ण का पहला मुख्य उत्तर है। वह आत्मा के अमरत्व, शरीर की नश्वरता और मुख्य शिक्षाएँ—समत्व, निष्काम कर्म (कर्मयोग), और बुद्धि/विवेक का परिचय देते हैं। प्रसिद्ध श्लोकों में निष्काम कर्म (2.47) और स्थिर मन (2.54–2.58) शामिल हैं।"
                },
                "key_verses": [
                  {
                    "verse_ref": "2.11",
                    "en": "The Blessed Lord said: You grieve for those that should not be grieved for, and yet you speak words of wisdom. The wise grieve neither for the living nor for the dead.",
                    "hi": "श्री भगवानुवाच: तुम उनके लिए शोक करते हो जिनके लिए शोक नहीं करना चाहिए, और फिर भी ज्ञान की बातें करते हो। बुद्धिमान लोग न तो जीवितों के लिए शोक करते हैं और न ही मृतकों के लिए।",
                    "explanation": {
                      "en": "Krishna points out that grief arises from ignorance about the soul’s nature.",
                      "hi": "कृष्ण बताते हैं कि शोक आत्मा के स्वभाव के अज्ञान से आता है।"
                    }
                  },
                  {
                    "verse_ref": "2.47",
                    "en": "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, and never be attached to not doing your duty.",
                    "hi": "तुम्हें अपने निर्धारित कर्तव्यों का पालन करने का अधिकार है, लेकिन तुम अपने कर्मों के फलों के हकदार नहीं हो। कभी भी अपने आप को अपनी गतिविधियों के परिणामों का कारण न समझें, और कभी भी अपना कर्तव्य न करने में आसक्त न हों।",
                    "explanation": {
                      "en": "Core teaching of karma-yoga: do your duty without attachment to outcomes—this reduces anxiety and keeps focus on right action.",
                      "hi": "कर्मयोग का मूल: परिणाम के आसक्ति के बिना अपना कर्तव्य करो—यह चिंता घटाता है और सही कर्म पर ध्यान बनाए रखता है।"
                    }
                  }
                ],
                "main_points": {
                  "en": [
                    "Distinguishes the impermanent body from the eternal self (ātman).",
                    "Introduces karma-yoga: perform duty without attachment to results.",
                    "Teaches sense-control, steady intellect (buddhi), and equanimity as keys to freedom."
                  ],
                  "hi": [
                    "नश्वर शरीर और शाश्वत आत्मा के बीच भेद बताता है।",
                    "कर्मयोग: परिणाम की आसक्ति के बिना कर्तव्य का पालन करना।",
                    "इन्द्रिय-नियंत्रण, स्थिर बुद्धि और समत्व स्वतंत्रता के मुख्य साधन हैं।"
                  ]
                },
                "practice_tips": {
                  "en": [
                    "Practice short daily reflection: after any action note ‘I did my best—outcome is not mine’ to build detached attitude.",
                    "Use breath-awareness (5–10 min) before work to center and reduce reactivity.",
                    "When anxious about results, recall 2.47: focus on action, not fruit—this reduces stress and improves clarity."
                  ],
                  "hi": [
                    "किसी भी क्रिया के बाद संक्षेप चिंतन: 'मैंने किया—परिणाम मेरा नहीं' — इससे निष्काम भाव बढ़ता है।",
                    "काम से पहले 5–10 मिनट श्वास-सचेतना करें ताकि केन्द्र बने और प्रतिक्रियाशीलता घटे।",
                    "परिणाम की चिंता होने पर 2.47 याद करो: कर्म पर ध्यान, फल पर नहीं—यह तनाव घटाता है।"
                  ]
                },
                "image": "https://picsum.photos/seed/gita2/1200/600",
                "notes": {
                  "en": "Use Chapter 2 as the app’s 'Foundations' module: show 2.47 as a daily reminder card and include a short 3-step practice: breathe → act → reflect.",
                  "hi": "अध्याय 2 को ऐप में 'बुनियादी सिद्धांत' मॉड्यूल बनाओ: 2.47 को दैनिक याद दिलाने वाला कार्ड बनाओ और 3-स्टेप अभ्यास जोड़ो: श्वास → कर्म → चिंतन।"
                }
            }
        ]
    }
];
