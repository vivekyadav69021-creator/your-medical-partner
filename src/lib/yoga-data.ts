export type YogaPose = {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  instructions: {
    en: string[];
    hi: string[];
  };
  benefits: {
    en: string[];
    hi: string[];
  };
  imageId: string;
  category: string;
};

export const yogaLibrary: YogaPose[] = [
  {
    id: "tadasana",
    name: { en: "Mountain Pose", hi: "ताड़ासन" },
    description: {
      en: "The foundation of all standing poses, Tadasana improves posture and firms the abdomen and buttocks.",
      hi: "सभी खड़े आसनों का आधार, ताड़ासन मुद्रा में सुधार करता है और पेट और नितंबों को मजबूत करता है।",
    },
    instructions: {
      en: [
        "Stand with your big toes touching and heels slightly apart.",
        "Lift and spread your toes and the balls of your feet, then lay them softly down on the floor.",
        "Engage your thigh muscles and lift the kneecaps.",
        "Imagine a line of energy all the way up along your inner thighs to your groin.",
        "Lengthen your tailbone toward the floor and lift the pubis toward the navel.",
        "Lift your sternum straight toward the ceiling. Widen your collarbones.",
        "Let your shoulder blades press into your back, then widen them across and release them down your back.",
        "Hang your arms beside the torso.",
      ],
      hi: [
        "अपने बड़े पैर की उंगलियों को छूते हुए और एड़ियों को थोड़ा अलग रखकर खड़े हों।",
        "अपने पैर की उंगलियों और अपने पैरों की गेंदों को उठाएं और फैलाएं, फिर उन्हें धीरे से फर्श पर रखें।",
        "अपनी जांघ की मांसपेशियों को संलग्न करें और घुटनों को ऊपर उठाएं।",
        "अपनी आंतरिक जांघों के साथ अपनी कमर तक ऊर्जा की एक रेखा की कल्पना करें।",
        "अपनी टेलबोन को फर्श की ओर लंबा करें और प्यूबिस को नाभि की ओर उठाएं।",
        "अपनी छाती को सीधे छत की ओर उठाएं। अपनी कॉलरबोन को चौड़ा करें।",
        "अपने कंधे के ब्लेड को अपनी पीठ में दबाएं, फिर उन्हें चौड़ा करें और अपनी पीठ के नीचे छोड़ दें।",
        "अपनी बाहों को धड़ के पास लटकाएं।",
      ],
    },
    benefits: {
      en: ["Improves posture", "Strengthens thighs, knees, and ankles", "Firms abdomen and buttocks", "Relieves sciatica", "Reduces flat feet"],
      hi: ["मुद्रा में सुधार करता है", "जांघों, घुटनों और टखनों को मजबूत करता है", "पेट और नितंबों को मजबूत करता है", "कटिस्नायुशूल से राहत देता है", "सपाट पैरों को कम करता है"],
    },
    imageId: "yoga-tadasana",
    category: "Standing",
  },
  {
    id: "vrikshasana",
    name: { en: "Tree Pose", hi: "वृक्षासन" },
    description: {
      en: "Tree Pose improves balance and stability in the legs. It strengthens the ligaments and tendon of the feet.",
      hi: "वृक्षासन पैरों में संतुलन और स्थिरता में सुधार करता है। यह पैरों के स्नायुबंधन और कण्डरा को मजबूत करता है।",
    },
    instructions: {
      en: [
        "Stand in Tadasana. Shift weight onto your left foot.",
        "Bend your right knee and place the right foot high on your left inner thigh.",
        "Press your hands together in a prayer position at your chest.",
        "Gaze softly at a fixed point in front of you.",
        "Stay for 30 seconds to 1 minute.",
        "Step back into Tadasana and repeat on the other side.",
      ],
      hi: [
        "ताड़ासन में खड़े हो जाएं। अपना वजन अपने बाएं पैर पर स्थानांतरित करें।",
        "अपने दाहिने घुटने को मोड़ें और दाहिने पैर को अपनी बाईं जांघ के अंदरूनी हिस्से पर ऊंचा रखें।",
        "अपनी छाती पर प्रार्थना की स्थिति में अपने हाथों को एक साथ दबाएं।",
        "अपने सामने एक निश्चित बिंदु पर धीरे से टकटकी लगाएं।",
        "30 सेकंड से 1 मिनट तक रुकें।",
        "ताड़ासन में वापस आएं और दूसरी तरफ दोहराएं।",
      ],
    },
    benefits: {
      en: ["Improves sense of balance", "Strengthens the legs and back", "Tones the abdominal muscles"],
      hi: ["संतुलन की भावना में सुधार करता है", "पैरों और पीठ को मजबूत करता है", "पेट की मांसपेशियों को टोन करता है"],
    },
    imageId: "yoga-vrikshasana",
    category: "Standing",
  },
  {
    id: "adhomukha",
    name: { en: "Downward-Facing Dog", hi: "अधो मुख श्वानासन" },
    description: {
      en: "This pose energizes and rejuvenates the entire body. It deeply stretches your hamstrings, shoulders, and calves.",
      hi: "यह आसन पूरे शरीर को सक्रिय और फिर से जीवंत करता है। यह आपके हैमस्ट्रिंग, कंधों और पिंडलियों को गहराई से खींचता है।",
    },
    instructions: {
      en: [
        "Start on your hands and knees.",
        "Exhale and lift your knees away from the floor.",
        "Lift the sitting bones toward the ceiling.",
        "Press the floor away from you as you lift through your pelvis.",
        "Keep your head between your upper arms; don't let it hang.",
      ],
      hi: [
        "अपने हाथों और घुटनों पर शुरू करें।",
        "सांस छोड़ें और अपने घुटनों को फर्श से ऊपर उठाएं।",
        "बैठने की हड्डियों को छत की ओर उठाएं।",
        "अपने श्रोणि के माध्यम से उठाते समय फर्श को अपने से दूर दबाएं।",
        "अपने सिर को अपनी ऊपरी बाहों के बीच रखें; इसे लटकने न दें।",
      ],
    },
    benefits: {
      en: ["Calms the brain and helps relieve stress", "Stretches the shoulders, hamstrings, calves, arches, and hands", "Strengthens the arms and legs"],
      hi: ["मस्तिष्क को शांत करता है और तनाव दूर करने में मदद करता है", "कंधों, हैमस्ट्रिंग, पिंडलियों, मेहराबों और हाथों को खींचता है", "हाथों और पैरों को मजबूत करता है"],
    },
    imageId: "yoga-adhomukha",
    category: "Resting",
  },
  {
    id: "trikonasana",
    name: { en: "Triangle Pose", hi: "त्रिकोणासन" },
    description: {
      en: "Trikonasana is a standing pose which helps to stretch the sides of the body, legs, and hips.",
      hi: "त्रिकोणासन एक खड़ा आसन है जो शरीर के किनारों, पैरों और कूल्हों को खींचने में मदद करता है।",
    },
    instructions: {
      en: [
        "Stand with your feet wide apart.",
        "Turn your right foot out 90 degrees and your left foot in slightly.",
        "Extend your arms parallel to the floor.",
        "Reach out to the right side and bend down, placing your right hand on your ankle, shin, or the floor.",
        "Extend your left arm to the ceiling.",
        "Gaze up at your left thumb.",
        "Hold for 30 seconds, then repeat on the other side.",
      ],
      hi: [
        "अपने पैरों को चौड़ा करके खड़े हो जाएं।",
        "अपने दाहिने पैर को 90 डिग्री बाहर और अपने बाएं पैर को थोड़ा अंदर की ओर मोड़ें।",
        "अपनी बाहों को फर्श के समानांतर फैलाएं।",
        "दाईं ओर पहुंचें और नीचे झुकें, अपने दाहिने हाथ को अपनी टखने, पिंडली या फर्श पर रखें।",
        "अपनी बाईं बांह को छत तक फैलाएं।",
        "अपने बाएं अंगूठे को देखें।",
        "30 सेकंड के लिए रुकें, फिर दूसरी तरफ दोहराएं।",
      ],
    },
    benefits: {
      en: ["Stretches and strengthens the thighs, knees, and ankles", "Stretches the hips, groins, hamstrings, and calves", "Stimulates the abdominal organs"],
      hi: ["जांघों, घुटनों और टखनों को खींचता और मजबूत करता है", "कूल्हों, कमर, हैमस्ट्रिंग और पिंडलियों को खींचता है", "पेट के अंगों को उत्तेजित करता है"],
    },
    imageId: "yoga-trikonasana",
    category: "Standing",
  },
  {
    id: "virabhadrasana1",
    name: { en: "Warrior I", hi: "वीरभद्रासन I" },
    description: {
      en: "Warrior I builds strength and confidence. It opens your hips, chest and lungs.",
      hi: "वीरभद्रासन I शक्ति और आत्मविश्वास बनाता है। यह आपके कूल्हों, छाती और फेफड़ों को खोलता है।",
    },
    instructions: {
      en: [
        "From Mountain Pose, step your left foot back about 4 feet.",
        "Turn your left foot in about 45 degrees.",
        "Bend your right knee over the right ankle.",
        "Raise your arms overhead, palms facing each other.",
        "Gaze forward or up at your thumbs.",
        "Hold for 30 seconds to a minute.",
        "Release and repeat on the other side.",
      ],
      hi: [
        "पर्वत मुद्रा से, अपने बाएं पैर को लगभग 4 फीट पीछे ले जाएं।",
        "अपने बाएं पैर को लगभग 45 डिग्री अंदर की ओर मोड़ें।",
        "अपने दाहिने घुटने को दाहिनी टखने के ऊपर मोड़ें।",
        "अपनी बाहों को सिर के ऊपर उठाएं, हथेलियां एक दूसरे के सामने।",
        "आगे या अपने अंगूठे को देखें।",
        "30 सेकंड से एक मिनट तक रुकें।",
        "छोड़ें और दूसरी तरफ दोहराएं।",
      ],
    },
    benefits: {
      en: ["Strengthens your shoulders, arms, legs, ankles and back", "Opens your hips, chest and lungs", "Improves focus, balance and stability"],
      hi: ["आपके कंधों, बाहों, पैरों, टखनों और पीठ को मजबूत करता है", "आपके कूल्हों, छाती और फेफड़ों को खोलता है", "फोकस, संतुलन और स्थिरता में सुधार करता है"],
    },
    imageId: "yoga-virabhadrasana1",
    category: "Standing",
  },
  {
    id: "virabhadrasana2",
    name: { en: "Warrior II", hi: "वीरभद्रासन II" },
    description: {
      en: "Warrior II is a powerful standing pose that builds stamina and concentration.",
      hi: "वीरभद्रासन II एक शक्तिशाली खड़ा आसन है जो सहनशक्ति और एकाग्रता बनाता है।",
    },
    instructions: {
      en: [
        "Stand with feet wide apart.",
        "Turn your right foot out and your left foot in slightly.",
        "Bend your right knee over your right ankle.",
        "Extend your arms parallel to the floor.",
        "Gaze over your right fingertips.",
        "Hold for 30 seconds, then repeat on the other side.",
      ],
      hi: [
        "पैरों को चौड़ा करके खड़े हो जाएं।",
        "अपने दाहिने पैर को बाहर और अपने बाएं पैर को थोड़ा अंदर की ओर मोड़ें।",
        "अपने दाहिने घुटने को अपनी दाहिनी टखने पर मोड़ें।",
        "अपनी बाहों को फर्श के समानांतर फैलाएं।",
        "अपनी दाहिनी उंगलियों पर टकटकी लगायें।",
        "30 सेकंड के लिए रुकें, फिर दूसरी तरफ दोहराएं।",
      ],
    },
    benefits: {
      en: ["Strengthens and stretches the legs and ankles", "Stretches the groins, chest and lungs, shoulders", "Stimulates abdominal organs"],
      hi: ["पैरों और टखनों को मजबूत और खींचता है", "कमर, छाती और फेफड़ों, कंधों को खींचता है", "पेट के अंगों को उत्तेजित करता है"],
    },
    imageId: "yoga-virabhadrasana2",
    category: "Standing",
  },
  {
    id: "bhujangasana",
    name: { en: "Cobra Pose", hi: "भुजंगासन" },
    description: {
      en: "A gentle backbend that helps to open the chest and strengthen the spine.",
      hi: "एक कोमल बैकबेंड जो छाती को खोलने और रीढ़ को मजबूत करने में मदद करता है।",
    },
    instructions: {
      en: [
        "Lie on your stomach with your forehead on the floor.",
        "Place your hands under your shoulders, fingers pointing forward.",
        "Inhale and lift your chest off the floor, keeping your lower ribs on the floor.",
        "Keep your shoulders relaxed and away from your ears.",
        "Hold for 15 to 30 seconds.",
        "Exhale and release back down.",
      ],
      hi: [
        "अपने पेट के बल लेट जाएं और माथा फर्श पर रखें।",
        "अपने हाथों को अपने कंधों के नीचे रखें, उंगलियां आगे की ओर इशारा करती हैं।",
        "सांस लें और अपनी छाती को फर्श से ऊपर उठाएं, अपनी निचली पसलियों को फर्श पर रखें।",
        "अपने कंधों को आराम से और अपने कानों से दूर रखें।",
        "15 से 30 सेकंड तक रुकें।",
        "सांस छोड़ें और वापस नीचे छोड़ दें।",
      ],
    },
    benefits: {
      en: ["Strengthens the spine", "Stretches chest and lungs, shoulders, and abdomen", "Firms the buttocks"],
      hi: ["रीढ़ को मजबूत करता है", "छाती और फेफड़ों, कंधों और पेट को खींचता है", "नितंबों को मजबूत करता है"],
    },
    imageId: "yoga-bhujangasana",
    category: "Floor",
  },
  {
    id: "balasana",
    name: { en: "Child's Pose", hi: "बालासन" },
    description: {
      en: "A restful pose that can be used to take a break during a yoga practice.",
      hi: "एक आरामदायक मुद्रा जिसका उपयोग योग अभ्यास के दौरान ब्रेक लेने के लिए किया जा सकता है।",
    },
    instructions: {
      en: [
        "Kneel on the floor.",
        "Sit back on your heels.",
        "Fold forward, resting your forehead on the floor.",
        "Allow your arms to rest alongside your body, palms facing up.",
        "Breathe deeply into your back.",
      ],
      hi: [
        "फर्श पर घुटने टेकें।",
        "अपनी एड़ी पर वापस बैठें।",
        "आगे की ओर झुकें, अपने माथे को फर्श पर टिकाएं।",
        "अपनी बाहों को अपने शरीर के साथ आराम करने दें, हथेलियाँ ऊपर की ओर।",
        "अपनी पीठ में गहरी सांस लें।",
      ],
    },
    benefits: {
      en: ["Gently stretches the hips, thighs, and ankles", "Calms the brain and helps relieve stress and fatigue", "Relieves back and neck pain"],
      hi: ["कूल्हों, जांघों और टखनों को धीरे से खींचता है", "मस्तिष्क को शांत करता है और तनाव और थकान को दूर करने में मदद करता है", "पीठ और गर्दन के दर्द से राहत देता है"],
    },
    imageId: "yoga-balasana",
    category: "Resting",
  },
  {
    id: "savasana",
    name: { en: "Corpse Pose", hi: "शवासन" },
    description: {
      en: "The final relaxation pose. Savasana allows the body to absorb the benefits of the practice.",
      hi: "अंतिम विश्राम मुद्रा। शवासन शरीर को अभ्यास के लाभों को अवशोषित करने की अनुमति देता है।",
    },
    instructions: {
      en: [
        "Lie on your back with your legs straight and arms by your sides.",
        "Let your feet fall open naturally.",
        "Turn your palms to face the ceiling.",
        "Close your eyes and allow your body to feel heavy on the floor.",
        "Bring your attention to your breath without controlling it.",
        "Stay in this pose for 5 to 15 minutes.",
      ],
      hi: [
        "अपनी पीठ के बल लेट जाएं और अपने पैरों को सीधा और बाहों को अपनी तरफ रखें।",
        "अपने पैरों को स्वाभाविक रूप से खुलने दें।",
        "अपनी हथेलियों को छत का सामना करने के लिए मोड़ें।",
        "अपनी आँखें बंद करें और अपने शरीर को फर्श पर भारी महसूस करने दें।",
        "इसे नियंत्रित किए बिना अपनी सांस पर अपना ध्यान लाएं।",
        "इस मुद्रा में 5 से 15 मिनट तक रहें।",
      ],
    },
    benefits: {
      en: ["Calms the brain and helps relieve stress", "Relaxes the body", "Reduces headache, fatigue, and insomnia"],
      hi: ["मस्तिष्क को शांत करता है और तनाव दूर करने में मदद करता है", "शरीर को आराम देता है", "सिरदर्द, थकान और अनिद्रा को कम करता है"],
    },
    imageId: "yoga-savasana",
    category: "Resting",
  },
];
