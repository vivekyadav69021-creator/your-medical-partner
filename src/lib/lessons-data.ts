
export type Lesson = {
    id: string;
    title: { en: string; hi: string };
    summary: { en: string; hi: string };
    content: { en: string; hi: string };
    image: string;
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
      title: { en: "Nutrition Basics", hi: "पोषण के मूल" },
      summary: { en: "Understand balanced diet, portion control and hydration.", hi: "संतुलित आहार, मात्रा और हाइड्रेशन समझें।" },
      content: { 
        en: "<h4>Nutrition Basics</h4><p>What a balanced plate looks like, macro & micro nutrients, hydration tips, reading labels, quick healthy meal ideas.</p>",
        hi: "<h4>पोषण के मूल</h4><p>संतुलित प्लेट कैसा दिखता है, पोषक तत्व, हाइड्रेशन टिप्स, लेबल पढ़ना, आसान हेल्दी रेसिपी।</p>"
      },
      image: "https://picsum.photos/seed/lesson1/400/200",
      topic: "Nutrition",
      quizId: "quiz_nutrition"
    },
    {
      id: "handhygiene",
      title: { en: "Hand Hygiene & Infection Prevention", hi: "हाथ साफ़ करना और संक्रमण रोकथाम" },
      summary: { en: "Proper handwashing, sanitizer use and preventing common infections.", hi: "सही हाथ धोना, सैनीटाइज़र और सामान्य संक्रमण रोकें।" },
      content: { en: "<p>Steps to wash hands, when to use sanitizer, cough etiquette and surface cleaning.</p>", hi: "<p>हाथ धोने के स्टेप्स, कब सैनीटाइज़र उपयोग करें, खाँसी की सभ्यता और सतह की सफाई।</p>" },
      image: "https://picsum.photos/seed/lesson2/400/200",
      topic: "Hygiene",
      quizId: "quiz_hygiene"
    },
    {
      id: "basic_first_aid",
      title: { en: "Basic First Aid", hi: "बेसिक फर्स्ट ऐड" },
      summary: { en: "CPR basics, choking response, bleeding control and burns first steps.", hi: "सीपीआर, घुटन, रक्तस्राव नियंत्रण और घाव के प्राथमिक कदम।" },
      content: { en: "<p>How to respond in common emergencies: CPR basics, choking, controlling bleeding, small burns.</p>", hi: "<p>सामान्य आपात स्थितियों में कैसे प्रतिक्रिया दें: CPR, घुटन, रक्तस्राव पर नियंत्रण, छोटे जलने पर कदम।</p>" },
      image: "https://picsum.photos/seed/lesson3/400/200",
      topic: "First Aid",
      quizId: "quiz_firstaid"
    },
    {
      id: "mental_wellbeing",
      title: { en: "Mental Wellbeing Essentials", hi: "मानसिक स्वास्थ्य के मूल" },
      summary: { en: "Simple strategies for stress, mood checks, breathing and when to seek help.", hi: "तनाव के लिए सरल तरीके, मूड चेक, श्वास और मदद कब लें।" },
      content: { en: "<p>Practical coping steps, breathing practices, sleep hygiene and support pathways.</p>", hi: "<p>व्यावहारिक उपाय, श्वास अभ्यास, नींद हाइजीन और सहायता के रास्ते।</p>" },
      image: "https://picsum.photos/seed/lesson4/400/200",
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
