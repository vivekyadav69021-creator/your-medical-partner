
export type Lesson = {
    id: string;
    title: { en: string; hi: string };
    summary: { en: string; hi: string };
    content: { en: string; hi: string };
    topic: string;
    quizId: string;
};

export type QuizQuestion = {
    q: string;
    q_hi: string;
    options: string[];
    options_hi: string[];
    answer: number;
};

export type Quiz = {
    id: string;
    lessonId: string;
    questions: QuizQuestion[];
};

export const lessons: Lesson[] = [
    {
      id: "nutrition_basics",
      title: { en: "Nutrition Basics: Fuel Your Body", hi: "पोषण के मूल: अपने शरीर को ऊर्जा दें" },
      summary: { en: "Understand balanced diets, macros, micros, hydration, and how to read food labels.", hi: "संतुलित आहार, मैक्रोज़, माइक्रोज़, हाइड्रेशन और खाद्य लेबल पढ़ना सीखें।" },
      content: { 
        en: `
          <h4>Understanding a Balanced Diet</h4>
          <p>A balanced diet is the cornerstone of good health. It means eating a variety of foods in the right proportions to get the energy and nutrients your body needs. The main components are macronutrients and micronutrients.</p>
          
          <h4>Macronutrients (The Big 3)</h4>
          <ul>
            <li><strong>Carbohydrates:</strong> Your body's main source of energy. Found in grains (roti, rice), fruits, and vegetables. Choose complex carbs like whole grains over simple ones like sugar.</li>
            <li><strong>Proteins:</strong> Essential for building and repairing tissues. Found in dal, beans, paneer, eggs, and meat.</li>
            <li><strong>Fats:</strong> Important for hormone function and vitamin absorption. Choose healthy fats from sources like nuts, seeds, and oils (ghee, mustard oil) over unhealthy trans fats.</li>
          </ul>

          <h4>Micronutrients</h4>
          <p>These are vitamins and minerals needed in smaller amounts but are crucial for body functions. A varied diet of fruits and vegetables usually provides all necessary micronutrients.</p>
          
          <h4>The Importance of Hydration</h4>
          <p>Water is essential for nearly every bodily function. Aim for 8-10 glasses a day. Dehydration can cause fatigue, headaches, and poor concentration.</p>

          <h4>Portion Control</h4>
          <p>It's not just what you eat, but how much. Use your hand as a simple guide: a fist for veggies, a palm for protein, a cupped hand for carbs, and a thumb for fats.</p>
        `,
        hi: `
          <h4>संतुलित आहार को समझना</h4>
          <p>एक संतुलित आहार अच्छे स्वास्थ्य की आधारशिला है। इसका मतलब है कि आपके शरीर को आवश्यक ऊर्जा और पोषक तत्व प्राप्त करने के लिए सही अनुपात में विभिन्न प्रकार के खाद्य पदार्थ खाना। मुख्य घटक मैक्रोन्यूट्रिएंट्स और माइक्रोन्यूट्रिएंट्स हैं।</p>
          
          <h4>मैक्रोन्यूट्रिएंट्स (तीन मुख्य)</h4>
          <ul>
            <li><strong>कार्बोहाइड्रेट:</strong> आपके शरीर की ऊर्जा का मुख्य स्रोत। अनाज (रोटी, चावल), फलों और सब्जियों में पाया जाता है। चीनी जैसे सरल कार्ब्स के बजाय साबुत अनाज जैसे जटिल कार्ब्स चुनें।</li>
            <li><strong>प्रोटीन:</strong> ऊतकों के निर्माण और मरम्मत के लिए आवश्यक। दाल, बीन्स, पनीर, अंडे और मांस में पाया जाता है।</li>
            <li><strong>वसा:</strong> हार्मोन फ़ंक्शन और विटामिन अवशोषण के लिए महत्वपूर्ण। मेवे, बीज और तेल (घी, सरसों का तेल) जैसे स्रोतों से स्वस्थ वसा चुनें।</li>
          </ul>

          <h4>माइक्रोन्यूट्रिएंट्स</h4>
          <p>ये विटामिन और खनिज हैं जिनकी कम मात्रा में आवश्यकता होती है लेकिन शरीर के कार्यों के लिए महत्वपूर्ण हैं। फलों और सब्जियों का एक विविध आहार आमतौर पर सभी आवश्यक सूक्ष्म पोषक तत्व प्रदान करता है।</p>
          
          <h4>हाइड्रेशन का महत्व</h4>
          <p>पानी लगभग हर शारीरिक क्रिया के लिए आवश्यक है। दिन में 8-10 गिलास का लक्ष्य रखें। निर्जलीकरण से थकान, सिरदर्द और खराब एकाग्रता हो सकती है।</p>

          <h4>मात्रा पर नियंत्रण</h4>
          <p>यह केवल यह नहीं है कि आप क्या खाते हैं, बल्कि कितना खाते हैं। अपने हाथ को एक सरल गाइड के रूप में उपयोग करें: सब्जियों के लिए एक मुट्ठी, प्रोटीन के लिए एक हथेली, कार्ब्स के लिए एक कप हाथ, और वसा के लिए एक अंगूठा।</p>
        `
      },
      topic: "Nutrition",
      quizId: "quiz_nutrition"
    },
    {
      id: "handhygiene",
      title: { en: "Hand Hygiene & Infection Prevention", hi: "हाथ की स्वच्छता और संक्रमण की रोकथाम" },
      summary: { en: "Learn the crucial steps of handwashing and sanitizer use to prevent the spread of germs.", hi: "कीटाणुओं के प्रसार को रोकने के लिए हाथ धोने और सैनिटाइज़र के उपयोग के महत्वपूर्ण चरण सीखें।" },
      content: { 
        en: `
          <h4>Why Hand Hygiene Matters</h4>
          <p>Hands are one of the most common ways that germs are spread. Proper hand hygiene is the single most effective way to prevent infections like the common cold, flu, and stomach illnesses.</p>

          <h4>The 6 Steps of Handwashing (WHO Recommended)</h4>
          <ol>
            <li>Wet hands with water and apply enough soap to cover all hand surfaces.</li>
            <li>Rub hands palm to palm.</li>
            <li>Rub back of each hand with palm of other hand with fingers interlaced.</li>
            <li>Rub palm to palm with fingers interlaced.</li>
            <li>Rub with back of fingers to opposing palms with fingers interlocked.</li>
            <li>Rub each thumb clasped in opposite hand. Finish by rubbing tips of fingers in palm.</li>
          </ol>
          <p>Wash for at least 20 seconds. Dry hands thoroughly with a clean towel.</p>
          
          <h4>When to Use Hand Sanitizer</h4>
          <p>Use an alcohol-based hand sanitizer (at least 60% alcohol) when soap and water are not available. It's effective, but washing with soap and water is better if hands are visibly dirty.</p>

          <h4>Cough and Sneeze Etiquette</h4>
          <p>Cover your mouth and nose with a tissue or your elbow when you cough or sneeze. Dispose of the tissue immediately and wash your hands.</p>
        `,
        hi: `
          <h4>हाथ की स्वच्छता क्यों महत्वपूर्ण है</h4>
          <p>हाथ कीटाणुओं के फैलने के सबसे आम तरीकों में से एक हैं। उचित हाथ की स्वच्छता सामान्य सर्दी, फ्लू और पेट की बीमारियों जैसे संक्रमणों को रोकने का सबसे प्रभावी तरीका है।</p>

          <h4>हाथ धोने के 6 चरण (WHO द्वारा अनुशंसित)</h4>
          <ol>
            <li>हाथों को पानी से गीला करें और सभी हाथ की सतहों को ढकने के लिए पर्याप्त साबुन लगाएं।</li>
            <li>हथेलियों को आपस में रगड़ें।</li>
            <li>प्रत्येक हाथ की पीठ को दूसरी हथेली से उंगलियों को फंसाकर रगड़ें।</li>
            <li>उंगलियों को फंसाकर हथेली से हथेली रगड़ें।</li>
            <li>उंगलियों को फंसाकर उंगलियों के पीछे से विपरीत हथेलियों से रगड़ें।</li>
            <li>प्रत्येक अंगूठे को विपरीत हाथ में पकड़कर रगड़ें। हथेली में उंगलियों के सिरों को रगड़ कर समाप्त करें।</li>
          </ol>
          <p>कम से कम 20 सेकंड तक धोएं। हाथों को साफ तौलिये से अच्छी तरह सुखाएं।</p>
          
          <h4>हैंड सैनिटाइज़र का उपयोग कब करें</h4>
          <p>जब साबुन और पानी उपलब्ध न हो तो अल्कोहल-आधारित हैंड सैनिटाइज़र (कम से कम 60% अल्कोहल) का उपयोग करें। यह प्रभावी है, लेकिन अगर हाथ स्पष्ट रूप से गंदे हैं तो साबुन और पानी से धोना बेहतर है।</p>

          <h4>खांसी और छींकने का शिष्टाचार</h4>
          <p>खांसते या छींकते समय अपने मुंह और नाक को टिश्यू या अपनी कोहनी से ढकें। टिश्यू को तुरंत फेंक दें और अपने हाथ धो लें।</p>
        ` 
      },
      topic: "Hygiene",
      quizId: "quiz_hygiene"
    },
    {
      id: "basic_first_aid",
      title: { en: "Basic First Aid Skills", hi: "बुनियादी प्राथमिक चिकित्सा कौशल" },
      summary: { en: "Learn life-saving responses for common emergencies like CPR, choking, bleeding, and burns.", hi: "सीपीआर, घुटन, रक्तस्राव और जलने जैसी सामान्य आपात स्थितियों के लिए जीवन रक्षक प्रतिक्रियाएं सीखें।" },
      content: { 
        en: `
          <h4>Responding in an Emergency (DRSABCD)</h4>
          <p>A simple acronym to remember in any emergency:</p>
          <ul>
            <li><strong>D</strong>anger: Check the area for dangers to yourself, the patient, and others.</li>
            <li><strong>R</strong>esponse: Check if the patient is conscious. Ask their name, squeeze their shoulders.</li>
            <li><strong>S</strong>end for help: Call emergency services immediately.</li>
            <li><strong>A</strong>irway: Check if their airway is clear. If not, place them in the recovery position and clear it.</li>
            <li><strong>B</strong>reathing: Look, listen, and feel for signs of breathing.</li>
            <li><strong>C</strong>PR: If not breathing, start CPR (30 chest compressions, 2 rescue breaths).</li>
            <li><strong>D</strong>efibrillation: Apply a defibrillator (AED) if available.</li>
          </ul>

          <h4>Controlling Bleeding</h4>
          <p>Apply firm, direct pressure on the wound with a clean cloth. Elevate the limb if possible. Do not remove the cloth if it soaks with blood; add another layer on top.</p>

          <h4>First Aid for Burns</h4>
          <p>For minor burns, immediately run cool (not cold) water over the burn for at least 20 minutes. Do not use ice. Do not apply creams or oils. Cover loosely with a clean, non-stick dressing.</p>

          <h4>Choking (Adult)</h4>
          <p>If someone is choking and conscious: Encourage them to cough. If they cannot, give 5 sharp back blows between the shoulder blades. If that fails, give 5 abdominal thrusts (Heimlich maneuver).</p>
        `,
        hi: `
          <h4>आपात स्थिति में प्रतिक्रिया (DRSABCD)</h4>
          <p>किसी भी आपात स्थिति में याद रखने के लिए एक सरल संक्षिप्त नाम:</p>
          <ul>
            <li><strong>D</strong>खतरा: अपने, रोगी और दूसरों के लिए खतरों की जाँच करें।</li>
            <li><strong>R</strong>प्रतिक्रिया: जांचें कि क्या रोगी होश में है। उनका नाम पूछें, उनके कंधों को निचोड़ें।</li>
            <li><strong>S</strong>मदद के लिए भेजें: तुरंत आपातकालीन सेवाओं को कॉल करें।</li>
            <li><strong>A</strong>वायुमार्ग: जांचें कि क्या उनका वायुमार्ग साफ है। यदि नहीं, तो उन्हें रिकवरी पोजीशन में रखें और इसे साफ करें।</li>
            <li><strong>B</strong>सांस लेना: सांस लेने के संकेतों को देखें, सुनें और महसूस करें।</li>
            <li><strong>C</strong>सीपीआर: यदि सांस नहीं ले रहे हैं, तो सीपीआर शुरू करें (30 छाती संपीड़न, 2 बचाव सांसें)।</li>
            <li><strong>D</strong>डीफिब्रिलेशन: यदि उपलब्ध हो तो डीफिब्रिलेटर (AED) लगाएं।</li>
          </ul>

          <h4>रक्तस्राव को नियंत्रित करना</h4>
          <p>एक साफ कपड़े से घाव पर दृढ़, सीधा दबाव डालें। यदि संभव हो तो अंग को ऊपर उठाएं। यदि कपड़ा खून से भीग जाए तो उसे न हटाएं; ऊपर एक और परत डालें।</p>

          <h4>जलने के लिए प्राथमिक उपचार</h4>
          <p>मामूली जलने के लिए, तुरंत कम से कम 20 मिनट के लिए जले हुए हिस्से पर ठंडा (ठंडा नहीं) पानी चलाएं। बर्फ का प्रयोग न करें। क्रीम या तेल न लगाएं। एक साफ, नॉन-स्टिक ड्रेसिंग से ढीले ढंग से ढकें।</p>

          <h4>घुटन (वयस्क)</h4>
          <p>यदि कोई व्यक्ति घुट रहा है और होश में है: उसे खांसने के लिए प्रोत्साहित करें। यदि वे नहीं कर सकते हैं, तो कंधे के ब्लेड के बीच 5 तेज पीठ पर वार करें। यदि वह विफल रहता है, तो 5 पेट के दबाव (हेमलिच पैंतरेबाज़ी) दें।</p>
        `
      },
      topic: "First Aid",
      quizId: "quiz_firstaid"
    },
    {
      id: "mental_wellbeing",
      title: { en: "Mental Wellbeing Essentials", hi: "मानसिक स्वास्थ्य की अनिवार्यताएं" },
      summary: { en: "Simple, practical strategies for managing stress, improving mood, and knowing when to seek help.", hi: "तनाव के प्रबंधन, मनोदशा में सुधार और मदद मांगने का समय जानने के लिए सरल, व्यावहारिक रणनीतियाँ।" },
      content: { 
        en: `
          <h4>Understanding Mental Wellbeing</h4>
          <p>Mental wellbeing doesn't mean being happy all the time. It means being able to cope with the ups and downs of life. It involves feeling good, functioning well, and having a sense of purpose.</p>

          <h4>Simple Stress Management Techniques</h4>
          <ul>
            <li><strong>Box Breathing:</strong> A simple technique to calm your nervous system. Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat.</li>
            <li><strong>The 5-4-3-2-1 Method:</strong> When feeling anxious, name 5 things you can see, 4 things you can feel, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This grounds you in the present moment.</li>
            <li><strong>Physical Activity:</strong> Even a 10-minute brisk walk can significantly improve your mood and reduce stress.</li>
          </ul>

          <h4>The Importance of Sleep</h4>
          <p>Sleep is crucial for mental health. Aim for 7-9 hours per night. Improve sleep hygiene by creating a relaxing bedtime routine, avoiding screens before bed, and keeping your bedroom dark and cool.</p>

          <h4>When to Seek Help</h4>
          <p>It's a sign of strength to ask for help. Consider talking to a professional if you experience:</p>
          <ul>
            <li>Persistent sadness or low mood.</li>
            <li>Loss of interest in activities you once enjoyed.</li>
            <li>Overwhelming feelings of anxiety or panic.</li>
            <li>Changes in sleep or appetite.</li>
            <li>Difficulty coping with daily life.</li>
          </ul>
        `,
        hi: `
          <h4>मानसिक स्वास्थ्य को समझना</h4>
          <p>मानसिक स्वास्थ्य का मतलब हर समय खुश रहना नहीं है। इसका मतलब है जीवन के उतार-चढ़ाव से निपटने में सक्षम होना। इसमें अच्छा महसूस करना, अच्छी तरह से काम करना और उद्देश्य की भावना रखना शामिल है।</p>

          <h4>सरल तनाव प्रबंधन तकनीकें</h4>
          <ul>
            <li><strong>बॉक्स ब्रीदिंग:</strong> अपने तंत्रिका तंत्र को शांत करने के लिए एक सरल तकनीक। 4 सेकंड के लिए श्वास लें, 4 के लिए रुकें, 4 के लिए श्वास छोड़ें, और 4 के लिए रुकें। दोहराएं।</li>
            <li><strong>5-4-3-2-1 विधि:</strong> चिंतित महसूस होने पर, 5 चीजें बताएं जो आप देख सकते हैं, 4 चीजें जो आप महसूस कर सकते हैं, 3 चीजें जो आप सुन सकते हैं, 2 चीजें जो आप सूंघ सकते हैं, और 1 चीज जिसका आप स्वाद ले सकते हैं। यह आपको वर्तमान क्षण में स्थापित करता है।</li>
            <li><strong>शारीरिक गतिविधि:</strong> 10 मिनट की तेज सैर भी आपके मूड में काफी सुधार कर सकती है और तनाव कम कर सकती है।</li>
          </ul>

          <h4>नींद का महत्व</h4>
          <p>नींद मानसिक स्वास्थ्य के लिए महत्वपूर्ण है। प्रति रात 7-9 घंटे का लक्ष्य रखें। सोने से पहले एक आरामदायक दिनचर्या बनाकर, सोने से पहले स्क्रीन से बचकर, और अपने बेडरूम को अंधेरा और ठंडा रखकर नींद की स्वच्छता में सुधार करें।</p>

          <h4>मदद कब लें</h4>
          <p>मदद मांगना ताकत की निशानी है। यदि आप अनुभव करते हैं तो किसी पेशेवर से बात करने पर विचार करें:</p>
          <ul>
            <li>लगातार उदासी या खराब मूड।</li>
            <li>उन गतिविधियों में रुचि का नुकसान जिनका आप एक बार आनंद लेते थे।</li>
            <li>चिंता या घबराहट की अत्यधिक भावनाएँ।</li>
            <li>नींद या भूख में परिवर्तन।</li>
            <li>दैनिक जीवन से निपटने में कठिनाई।</li>
          </ul>
        `
      },
      topic: "Mental Health",
      quizId: "quiz_mental"
    }
];

export const quizzes: Quiz[] = [
    {
      id: "quiz_nutrition",
      lessonId: "nutrition_basics",
      questions: [
        { q:"Which food group gives quickest energy?", q_hi:"कौन सा खाद्य समूह सबसे तेज़ ऊर्जा देता है?", options:["Carbohydrates","Proteins","Fats","Vitamins"], options_hi:["कार्बोहाइड्रेट","प्रोटीन","वसा","विटामिन"], answer:0 },
        { q:"Best drink to stay hydrated?", q_hi:"हाइड्रेट रहने के लिए सबसे अच्छा पेय क्या है?", options:["Water","Soda","Coffee","Energy drink"], options_hi:["पानी","सोडा","कॉफ़ी","एनर्जी ड्रिंक"], answer:0 },
        { q:"Which is a source of healthy fats?", q_hi:"निम्न में से स्वस्थ वसा का स्रोत कौन सा है?", options:["Avocado","Candy","White bread","Soft drink"], options_hi:["एवोकाडो","कैंडी","सफ़ेद ब्रेड","सॉफ्ट ड्रिंक"], answer:0 }
      ]
    },
    {
      id: "quiz_hygiene",
      lessonId: "handhygiene",
      questions: [
        { q:"How long should you wash hands with soap?", q_hi:"साबुन से कितनी देर हाथ धोना चाहिए?", options:["20 seconds","5 seconds","1 minute","10 minutes"], options_hi:["20 सेकंड","5 सेकंड","1 मिनट","10 मिनट"], answer:0 },
        { q:"When should you use sanitizer?", q_hi:"कब सैनीटाइज़र का उपयोग करना चाहिए?", options:["When hands are not visibly dirty","Always instead of washing","Never","Only after meals"], options_hi:["जब हाथ गंदे न दिखें","हमेशा धोने की बजाय","कभी नहीं","सिर्फ खाने के बाद"], answer:0 }
      ]
    },
    {
      id: "quiz_firstaid",
      lessonId: "basic_first_aid",
      questions: [
        { q:"If someone is choking and can't breathe, you should:", q_hi:"अगर कोई घुट रहा है और साँस नहीं ले पा रहा है, तो आपको:", options:["Perform abdominal thrusts/back blows","Give water to drink","Lay them down and wait","Put something in mouth"], options_hi:["पेट दबाव / पीठ पर वार करें","पानी पिला दें","उनको लिटा कर प्रतीक्षा करें","कुछ मुंह में डालें"], answer:0 },
        { q:"For a heavy bleed, first step is:", q_hi:"भारी रक्तस्राव के लिए पहला कदम क्या है?", options:["Apply direct pressure","Apply iodine","Wash with water","Give them food"], options_hi:["सीधा दबाव डालें","आयोडीन लगाएँ","पानी से धोएं","खाना पिलाएँ"], answer:0 }
      ]
    },
    {
      id: "quiz_mental",
      lessonId: "mental_wellbeing",
      questions: [
        { q:"A quick technique to calm anxiety is:", q_hi:"चिंता शांत करने के लिए एक त्वरित तकनीक है:", options:["Deep belly breathing","Running immediately","Eating sugar","Watching TV"], options_hi:["गहरी पेट की श्वास","तुरंत दौड़ना","चीनी खाना","टीवी देखना"], answer:0 },
        { q:"If someone mentions harmful thoughts, you should:", q_hi:"अगर कोई हानिकारक विचारों का ज़िक्र करता है, तो आपको:", options:["Encourage seeking professional help","Ignore them","Joke about it","Tell them to 'toughen up'"], options_hi:["पेशेवर मदद लेने के लिए प्रेरित करें","अनदेखा करें","मज़ाक बनाएं","कहे कि कठोर बनो"], answer:0 }
      ]
    }
];

export const topics = [ "All", "Nutrition", "Hygiene", "First Aid", "Mental Health", "Fitness", "Chronic Conditions" ];
