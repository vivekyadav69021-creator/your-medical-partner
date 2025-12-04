
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
    },
    {
      id: "blood_pressure_basics",
      title: { en: "Understanding Blood Pressure", hi: "रक्तचाप को समझना" },
      summary: { en: "Learn what your blood pressure numbers mean and why it's important for your health.", hi: "जानें कि आपके रक्तचाप की संख्या का क्या मतलब है और यह आपके स्वास्थ्य के लिए क्यों महत्वपूर्ण है।" },
      content: {
        en: `
          <h4>What is Blood Pressure?</h4>
          <p>Blood pressure is the force of blood pushing against the walls of your arteries. It's recorded as two numbers:</p>
          <ul>
            <li><strong>Systolic pressure (the top number):</strong> measures the pressure in your arteries when your heart beats.</li>
            <li><strong>Diastolic pressure (the bottom number):</strong> measures the pressure in your arteries when your heart rests between beats.</li>
          </ul>

          <h4>Blood Pressure Categories</h4>
          <ul>
            <li><strong>Normal:</strong> Less than 120/80 mm Hg</li>
            <li><strong>Elevated:</strong> Systolic between 120-129 and diastolic less than 80.</li>
            <li><strong>Hypertension Stage 1:</strong> Systolic between 130-139 or diastolic between 80-89.</li>
            <li><strong>Hypertension Stage 2:</strong> Systolic 140 or higher or diastolic 90 or higher.</li>
            <li><strong>Hypertensive Crisis:</strong> Higher than 180/120 mm Hg. Seek medical attention immediately.</li>
          </ul>
          
          <h4>Why High Blood Pressure (Hypertension) is Dangerous</h4>
          <p>Hypertension often has no symptoms but can quietly damage your body for years. Uncontrolled high blood pressure can lead to heart attack, stroke, kidney disease, and other serious health problems.</p>
          
          <h4>How to Manage Blood Pressure</h4>
          <p>Lifestyle changes are crucial:</p>
          <ul>
            <li>Eat a heart-healthy diet, low in salt (sodium).</li>
            <li>Get regular physical activity.</li>
            <li>Maintain a healthy weight.</li>
            <li>Limit alcohol.</li>
            <li>Don't smoke.</li>
          </ul>
        `,
        hi: `
          <h4>रक्तचाप क्या है?</h4>
          <p>रक्तचाप आपकी धमनियों की दीवारों के खिलाफ रक्त के दबाव का बल है। इसे दो संख्याओं के रूप में दर्ज किया जाता है:</p>
          <ul>
            <li><strong>सिस्टोलिक दबाव (ऊपरी संख्या):</strong> जब आपका दिल धड़कता है तो आपकी धमनियों में दबाव को मापता है।</li>
            <li><strong>डायस्टोलिक दबाव (निचली संख्या):</strong> जब आपका दिल धड़कनों के बीच आराम करता है तो आपकी धमनियों में दबाव को मापता है।</li>
          </ul>

          <h4>रक्तचाप की श्रेणियाँ</h4>
          <ul>
            <li><strong>सामान्य:</strong> 120/80 मिमी एचजी से कम</li>
            <li><strong>बढ़ा हुआ:</strong> सिस्टोलिक 120-129 के बीच और डायस्टोलिक 80 से कम।</li>
            <li><strong>उच्च रक्तचाप चरण 1:</strong> सिस्टोलिक 130-139 के बीच या डायस्टोलिक 80-89 के बीच।</li>
            <li><strong>उच्च रक्तचाप चरण 2:</strong> सिस्टोलिक 140 या अधिक या डायस्टोलिक 90 या अधिक।</li>
            <li><strong>उच्च रक्तचाप संकट:</strong> 180/120 मिमी एचजी से अधिक। तुरंत चिकित्सा सहायता लें।</li>
          </ul>
          
          <h4>उच्च रक्तचाप (हाइपरटेंशन) क्यों खतरनाक है</h4>
          <p>उच्च रक्तचाप के अक्सर कोई लक्षण नहीं होते हैं, लेकिन यह वर्षों तक आपके शरीर को चुपचाप नुकसान पहुंचा सकता है। अनियंत्रित उच्च रक्तचाप दिल का दौरा, स्ट्रोक, गुर्दे की बीमारी और अन्य गंभीर स्वास्थ्य समस्याओं का कारण बन सकता है।</p>
          
          <h4>रक्तचाप का प्रबंधन कैसे करें</h4>
          <p>जीवनशैली में बदलाव महत्वपूर्ण हैं:</p>
          <ul>
            <li>नमक (सोडियम) में कम, हृदय-स्वस्थ आहार खाएं।</li>
            <li>नियमित शारीरिक गतिविधि करें।</li>
            <li>स्वस्थ वजन बनाए रखें।</li>
            <li>शराब सीमित करें।</li>
            <li>धूम्रपान न करें।</li>
          </ul>
        `
      },
      topic: "Health Metrics",
      quizId: "quiz_bp"
    },
    {
      id: "sleep_importance",
      title: { en: "The Importance of Sleep", hi: "नींद का महत्व" },
      summary: { en: "Discover why sleep is essential for your physical and mental health and learn tips for better sleep.", hi: "जानें कि नींद आपके शारीरिक और मानसिक स्वास्थ्य के लिए क्यों आवश्यक है और बेहतर नींद के लिए सुझाव जानें।" },
      content: {
        en: `
          <h4>Why Do We Need Sleep?</h4>
          <p>Sleep is not just a period of rest; it's a critical function during which your body and mind recharge. Good sleep improves brain performance, mood, and overall health.</p>
          
          <h4>What Happens When You Sleep?</h4>
          <ul>
            <li>Your brain sorts and stores information from the day, which helps with learning and memory.</li>
            <li>Your body repairs cells, restores energy, and releases important hormones and proteins.</li>
            <li>Your immune system is strengthened, helping you fight off illness.</li>
          </ul>

          <h4>Consequences of Poor Sleep</h4>
          <p>A lack of quality sleep can have serious effects:</p>
          <ul>
            <li>Difficulty concentrating and making decisions.</li>
            <li>Increased risk of accidents.</li>
            <li>Weakened immune system.</li>
            <li>Higher risk for chronic health problems like heart disease, kidney disease, high blood pressure, and diabetes.</li>
            <li>Mood swings, anxiety, and depression.</li>
          </ul>

          <h4>Tips for Better Sleep (Sleep Hygiene)</h4>
          <ol>
            <li><strong>Be consistent:</strong> Go to bed and wake up at the same time every day, even on weekends.</li>
            <li><strong>Create a restful environment:</strong> Make sure your bedroom is dark, quiet, and cool.</li>
            <li><strong>Avoid screens before bed:</strong> The blue light from phones, tablets, and TVs can interfere with sleep.</li>
            <li><strong>Avoid large meals, caffeine, and alcohol before bedtime.</strong></li>
            <li><strong>Get some exercise during the day.</strong></li>
          </ol>
        `,
        hi: `
          <h4>हमें नींद की आवश्यकता क्यों है?</h4>
          <p>नींद केवल आराम की अवधि नहीं है; यह एक महत्वपूर्ण कार्य है जिसके दौरान आपका शरीर और मन रिचार्ज होते हैं। अच्छी नींद मस्तिष्क के प्रदर्शन, मनोदशा और समग्र स्वास्थ्य में सुधार करती है।</p>
          
          <h4>जब आप सोते हैं तो क्या होता है?</h4>
          <ul>
            <li>आपका मस्तिष्क दिन की जानकारी को छाँटता और संग्रहीत करता है, जो सीखने और स्मृति में मदद करता है।</li>
            <li>आपका शरीर कोशिकाओं की मरम्मत करता है, ऊर्जा बहाल करता है, और महत्वपूर्ण हार्मोन और प्रोटीन जारी करता है।</li>
            <li>आपकी प्रतिरक्षा प्रणाली मजबूत होती है, जो आपको बीमारी से लड़ने में मदद करती है।</li>
          </ul>

          <h4>खराब नींद के परिणाम</h4>
          <p>गुणवत्तापूर्ण नींद की कमी के गंभीर प्रभाव हो सकते हैं:</p>
          <ul>
            <li>ध्यान केंद्रित करने और निर्णय लेने में कठिनाई।</li>
            <li>दुर्घटनाओं का खतरा बढ़ जाता है।</li>
            <li>कमजोर प्रतिरक्षा प्रणाली।</li>
            <li>हृदय रोग, गुर्दे की बीमारी, उच्च रक्तचाप और मधुमेह जैसी पुरानी स्वास्थ्य समस्याओं का अधिक खतरा।</li>
            <li>मूड स्विंग, चिंता और अवसाद।</li>
          </ul>

          <h4>बेहतर नींद के लिए टिप्स (नींद की स्वच्छता)</h4>
          <ol>
            <li><strong>लगातार रहें:</strong> हर दिन एक ही समय पर सोएं और उठें, यहां तक कि सप्ताहांत पर भी।</li>
            <li><strong>एक आरामदायक वातावरण बनाएं:</strong> सुनिश्चित करें कि आपका शयनकक्ष अंधेरा, शांत और ठंडा हो।</li>
            <li><strong>सोने से पहले स्क्रीन से बचें:</strong> फोन, टैबलेट और टीवी से नीली रोशनी नींद में बाधा डाल सकती है।</li>
            <li><strong>सोने से पहले बड़े भोजन, कैफीन और शराब से बचें।</strong></li>
            <li><strong>दिन में कुछ व्यायाम करें।</strong></li>
          </ol>
        `
      },
      topic: "Lifestyle",
      quizId: "quiz_sleep"
    }
];

export const quizzes: Quiz[] = [
    {
      id: "quiz_nutrition",
      lessonId: "nutrition_basics",
      questions: [
        { q:"Which food group gives the quickest energy?", q_hi:"कौन सा खाद्य समूह सबसे तेज़ ऊर्जा देता है?", options:["Carbohydrates","Proteins","Fats","Vitamins"], options_hi:["कार्बोहाइड्रेट","प्रोटीन","वसा","विटामिन"], answer:0 },
        { q:"What is the best drink to stay hydrated?", q_hi:"हाइड्रेटेड रहने के लिए सबसे अच्छा पेय क्या है?", options:["Water","Soda","Coffee","Energy drink"], options_hi:["पानी","सोडा","कॉफ़ी","एनर्जी ड्रिंक"], answer:0 },
        { q:"Which of these is a good source of healthy fats?", q_hi:"इनमें से स्वस्थ वसा का एक अच्छा स्रोत कौन सा है?", options:["Avocado","Candy","White bread","Soft drink"], options_hi:["एवोकाडो","कैंडी","सफ़ेद ब्रेड","सॉफ्ट ड्रिंक"], answer:0 }
      ]
    },
    {
      id: "quiz_hygiene",
      lessonId: "handhygiene",
      questions: [
        { q:"What is the minimum time you should wash your hands with soap?", q_hi:"आपको साबुन से कम से कम कितनी देर तक हाथ धोना चाहिए?", options:["20 seconds","5 seconds","1 minute","10 minutes"], options_hi:["20 सेकंड","5 सेकंड","1 मिनट","10 मिनट"], answer:0 },
        { q:"When is it appropriate to use hand sanitizer?", q_hi:"हैंड सैनिटाइज़र का उपयोग करना कब उचित है?", options:["When soap and water are not available","Always, instead of washing","Only after eating","Never"], options_hi:["जब साबुन और पानी उपलब्ध न हो","हमेशा, धोने के बजाय","केवल खाने के बाद","कभी नहीं"], answer:0 }
      ]
    },
    {
      id: "quiz_firstaid",
      lessonId: "basic_first_aid",
      questions: [
        { q:"If an adult is choking and cannot cough, what is the first thing you should do?", q_hi:"यदि कोई वयस्क घुट रहा है और खांस नहीं सकता है, तो आपको सबसे पहले क्या करना चाहिए?", options:["Give 5 sharp back blows","Give them water to drink","Lay them down and wait","Put something in their mouth"], options_hi:["5 तेज पीठ पर वार दें","उन्हें पीने के लिए पानी दें","उन्हें लिटा दें और प्रतीक्षा करें","उनके मुंह में कुछ डालें"], answer:0 },
        { q:"What is the first step for controlling severe bleeding?", q_hi:"गंभीर रक्तस्राव को नियंत्रित करने के लिए पहला कदम क्या है?", options:["Apply direct pressure with a clean cloth","Wash the wound with water","Apply a tourniquet immediately","Give them food to eat"], options_hi:["एक साफ कपड़े से सीधा दबाव डालें","घाव को पानी से धोएं","तुरंत एक टूर्निकेट लगाएं","उन्हें खाने के लिए भोजन दें"], answer:0 }
      ]
    },
    {
      id: "quiz_mental",
      lessonId: "mental_wellbeing",
      questions: [
        { q:"Which technique is recommended for calming anxiety quickly?", q_hi:"चिंता को जल्दी शांत करने के लिए कौन सी तकनीक अनुशंसित है?", options:["Box Breathing","Running immediately","Eating sugar","Watching TV"], options_hi:["बॉक्स ब्रीदिंग","तुरंत दौड़ना","चीनी खाना","टीवी देखना"], answer:0 },
        { q:"If a friend seems persistently sad and has lost interest in their hobbies, what should you do?", q_hi:"यदि कोई दोस्त लगातार दुखी लगता है और अपने शौक में रुचि खो चुका है, तो आपको क्या करना चाहिए?", options:["Encourage them to seek professional help","Ignore them","Tell them to 'toughen up'","Joke about it"], options_hi:["उन्हें पेशेवर मदद लेने के लिए प्रोत्साहित करें","उन्हें अनदेखा करें","उन्हें 'कठोर बनने' के लिए कहें","इस पर मजाक करें"], answer:0 }
      ]
    },
    {
      id: "quiz_bp",
      lessonId: "blood_pressure_basics",
      questions: [
        { q:"What do the two numbers in a blood pressure reading represent?", q_hi:"रक्तचाप रीडिंग में दो संख्याएं क्या दर्शाती हैं?", options:["Systolic and Diastolic","Heart Rate and Oxygen","High and Low Pulse","Morning and Evening"], options_hi:["सिस्टोलिक और डायस्टोलिक","हृदय गति और ऑक्सीजन","उच्च और निम्न पल्स","सुबह और शाम"], answer:0 },
        { q:"Which of the following is considered a normal blood pressure reading?", q_hi:"निम्नलिखित में से किसे सामान्य रक्तचाप रीडिंग माना जाता है?", options:["120/80 mm Hg or less","140/90 mm Hg","100/60 mm Hg","135/85 mm Hg"], options_hi:["120/80 मिमी एचजी या उससे कम","140/90 मिमी एचजी","100/60 मिमी एचजी","135/85 मिमी एचजी"], answer:0 }
      ]
    },
    {
      id: "quiz_sleep",
      lessonId: "sleep_importance",
      questions: [
        { q:"How many hours of sleep are generally recommended for adults?", q_hi:"वयस्कों के लिए आम तौर पर कितने घंटे की नींद की सिफारिश की जाती है?", options:["7-9 hours","5-6 hours","10-11 hours","4-5 hours"], options_hi:["7-9 घंटे","5-6 घंटे","10-11 घंटे","4-5 घंटे"], answer:0 },
        { q:"Which of the following is a good 'sleep hygiene' practice?", q_hi:"निम्नलिखित में से कौन सी एक अच्छी 'नींद की स्वच्छता' प्रथा है?", options:["Going to bed at the same time every night","Watching TV in bed to relax","Having a large meal before sleeping","Checking your phone in bed"], options_hi:["हर रात एक ही समय पर सोना","आराम करने के लिए बिस्तर में टीवी देखना","सोने से पहले भारी भोजन करना","बिस्तर में अपना फोन जांचना"], answer:0 }
      ]
    }
];

export const topics = [ "All", "Nutrition", "Hygiene", "First Aid", "Mental Health", "Health Metrics", "Lifestyle" ];
