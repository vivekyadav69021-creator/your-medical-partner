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
    category: "Resting",
  },
  {
    id: "setubandhasana",
    name: { en: "Bridge Pose", hi: "सेतु बंधासन" },
    description: {
      en: "Bridge Pose stretches the chest, neck, and spine. It calms the brain and reduces anxiety, stress, and depression.",
      hi: "सेतु बंधासन छाती, गर्दन और रीढ़ को फैलाता है। यह मस्तिष्क को शांत करता है और चिंता, तनाव और अवसाद को कम करता है।",
    },
    instructions: {
      en: [
        "Lie on your back with your knees bent and feet flat on the floor, hip-width apart.",
        "Place your arms alongside your body with your palms facing down.",
        "Press your feet and arms into the floor and lift your hips toward the ceiling.",
        "Keep your thighs and feet parallel. Clasp your hands under your pelvis and extend through the arms.",
        "Hold for up to one minute, then release by rolling your spine down onto the floor.",
      ],
      hi: [
        "अपनी पीठ के बल लेट जाएं, घुटने मुड़े हुए और पैर फर्श पर सपाट, कूल्हे की चौड़ाई के बराबर।",
        "अपनी बाहों को शरीर के साथ रखें, हथेलियाँ नीचे की ओर।",
        "अपने पैरों और बाहों को फर्श में दबाएं और अपने कूल्हों को छत की ओर उठाएं।",
        "अपनी जांघों और पैरों को समानांतर रखें। अपने श्रोणि के नीचे अपने हाथों को पकड़ें और बाहों के माध्यम से विस्तार करें।",
        "एक मिनट तक रुकें, फिर अपनी रीढ़ को फर्श पर घुमाकर छोड़ दें।",
      ],
    },
    benefits: {
      en: ["Stretches the chest, neck, and spine", "Improves digestion", "Reduces anxiety, fatigue, backache, headache, and insomnia"],
      hi: ["छाती, गर्दन और रीढ़ को फैलाता है", "पाचन में सुधार करता है", "चिंता, थकान, पीठ दर्द, सिरदर्द और अनिद्रा को कम करता है"],
    },
    category: "Floor",
  },
  {
    id: "ustrasana",
    name: { en: "Camel Pose", hi: "उष्ट्रासन" },
    description: {
      en: "Camel Pose is a deep backbend that opens the entire front of the body, including the throat, chest, and abdomen.",
      hi: "उष्ट्रासन एक गहरा बैकबेंड है जो गले, छाती और पेट सहित शरीर के पूरे अग्र भाग को खोलता है।",
    },
    instructions: {
      en: [
        "Kneel on the floor with your knees hip-width apart and thighs perpendicular to the floor.",
        "Place your hands on your lower back, fingers pointing down.",
        "Inhale and lift your chest, arching your back.",
        "Reach back one hand at a time to grasp your heels. If you can't reach, keep your hands on your back.",
        "Keep your neck in a neutral position or allow it to drop back carefully.",
        "Hold for 30 to 60 seconds. To release, bring your hands back to your hips and slowly come up.",
      ],
      hi: [
        "फर्श पर घुटने टेकें, घुटने कूल्हे-चौड़ाई के बराबर और जांघें फर्श के लंबवत।",
        "अपने हाथों को अपनी निचली पीठ पर रखें, उंगलियां नीचे की ओर इशारा करती हैं।",
        "सांस लें और अपनी छाती को ऊपर उठाएं, अपनी पीठ को झुकाएं।",
        "एक-एक करके अपनी एड़ी को पकड़ने के लिए पीछे पहुंचें। यदि आप नहीं पहुंच सकते हैं, तो अपने हाथों को अपनी पीठ पर रखें।",
        "अपनी गर्दन को एक तटस्थ स्थिति में रखें या इसे सावधानी से पीछे गिरने दें।",
        "30 से 60 सेकंड तक रुकें। छोड़ने के लिए, अपने हाथों को अपने कूल्हों पर वापस लाएं और धीरे-धीरे ऊपर आएं।",
      ],
    },
    benefits: {
      en: ["Improves posture", "Stretches the entire front of the body", "Strengthens back muscles"],
      hi: ["मुद्रा में सुधार करता है", "शरीर के पूरे अग्र भाग को फैलाता है", "पीठ की मांसपेशियों को मजबूत करता है"],
    },
    category: "Kneeling",
  },
  {
    id: "dhanurasana",
    name: { en: "Bow Pose", hi: "धनुरासन" },
    description: {
      en: "Bow Pose strengthens the entire back and abdominal muscles. It opens the chest, neck, and shoulders.",
      hi: "धनुरासन पूरी पीठ और पेट की मांसपेशियों को मजबूत करता है। यह छाती, गर्दन और कंधों को खोलता है।",
    },
    instructions: {
      en: [
        "Lie on your stomach with your chin on the floor and your arms by your sides.",
        "Exhale, bend your knees, and bring your heels as close as you can to your buttocks.",
        "Reach back with both hands and grasp your ankles.",
        "Inhale and lift your heels away from your buttocks, simultaneously lifting your thighs off the floor.",
        "Lift your head and chest. Gaze forward.",
        "Hold for 20 to 30 seconds. Release as you exhale.",
      ],
      hi: [
        "अपने पेट के बल लेट जाएं, ठोड़ी फर्श पर और बाहें बगल में।",
        "सांस छोड़ें, घुटनों को मोड़ें, और अपनी एड़ी को अपने नितंबों के जितना करीब हो सके लाएं।",
        "दोनों हाथों से पीछे पहुंचें और अपनी टखनों को पकड़ें।",
        "सांस लें और अपनी एड़ी को अपने नितंबों से दूर उठाएं, साथ ही अपनी जांघों को फर्श से ऊपर उठाएं।",
        "अपना सिर और छाती उठाएं। आगे देखें।",
        "20 से 30 सेकंड तक रुकें। सांस छोड़ते हुए छोड़ें।",
      ],
    },
    benefits: {
      en: ["Strengthens the back muscles", "Improves posture", "Stretches the front of the body, ankles, thighs, groins, abdomen and chest, and throat"],
      hi: ["पीठ की मांसपेशियों को मजबूत करता है", "मुद्रा में सुधार करता है", "शरीर के अग्र भाग, टखनों, जांघों, कमर, पेट और छाती और गले को फैलाता है"],
    },
    category: "Floor",
  },
  {
    id: "halasana",
    name: { en: "Plow Pose", hi: "हलासन" },
    description: {
      en: "Plow Pose stimulates the abdominal organs and the thyroid gland. It stretches the shoulders and spine.",
      hi: "हलासन पेट के अंगों और थायरॉयड ग्रंथि को उत्तेजित करता है। यह कंधों और रीढ़ को फैलाता है।",
    },
    instructions: {
      en: [
        "Lie on your back with your arms beside you, palms down.",
        "Inhale, press your hands into the floor, and swing your legs up and over your head.",
        "Touch your toes to the floor behind your head. Keep your legs straight.",
        "Clasp your hands together on the floor behind your back.",
        "Keep your throat soft and gaze toward your chest.",
        "Stay in the pose for 1 to 5 minutes. To release, slowly roll your back down to the floor.",
      ],
      hi: [
        "अपनी पीठ के बल लेट जाएं, बाहें बगल में, हथेलियाँ नीचे।",
        "सांस लें, अपने हाथों को फर्श में दबाएं, और अपने पैरों को ऊपर और अपने सिर के ऊपर घुमाएं।",
        "अपने सिर के पीछे फर्श पर अपनी पैर की उंगलियों को स्पर्श करें। अपने पैरों को सीधा रखें।",
        "अपनी पीठ के पीछे फर्श पर अपने हाथों को एक साथ पकड़ें।",
        "अपने गले को नरम रखें और अपनी छाती की ओर देखें।",
        "1 से 5 मिनट तक मुद्रा में रहें। छोड़ने के लिए, धीरे-धीरे अपनी पीठ को फर्श पर नीचे घुमाएं।",
      ],
    },
    benefits: {
      en: ["Calms the brain", "Stretches the shoulders and spine", "Stimulates the abdominal organs and thyroid gland"],
      hi: ["मस्तिष्क को शांत करता है", "कंधों और रीढ़ को फैलाता है", "पेट के अंगों और थायरॉयड ग्रंथि को उत्तेजित करता है"],
    },
    category: "Inversion",
  },
  {
    id: "paschimottanasana",
    name: { en: "Seated Forward Bend", hi: "पश्चिमोत्तानासन" },
    description: {
      en: "This pose provides a deep stretch for the entire back side of the body, from the heels to the neck.",
      hi: "यह आसन एड़ी से गर्दन तक शरीर के पूरे पिछले हिस्से को गहरा खिंचाव प्रदान करता है।",
    },
    instructions: {
      en: [
        "Sit on the floor with your legs extended in front of you.",
        "Inhale and lengthen your spine.",
        "Exhale and begin to fold forward from your hip joints, not your waist.",
        "Reach for your feet, ankles, or shins. If you can't reach, use a strap.",
        "With each inhale, lengthen your torso; with each exhale, deepen the forward bend.",
        "Hold for 1 to 3 minutes.",
      ],
      hi: [
        "अपने पैरों को अपने सामने फैलाकर फर्श पर बैठें।",
        "सांस लें और अपनी रीढ़ को लंबा करें।",
        "सांस छोड़ें और अपनी कमर से नहीं, अपने कूल्हे के जोड़ों से आगे की ओर झुकना शुरू करें।",
        "अपने पैरों, टखनों या पिंडलियों तक पहुंचें। यदि आप नहीं पहुंच सकते हैं, तो एक पट्टा का उपयोग करें।",
        "प्रत्येक श्वास के साथ, अपने धड़ को लंबा करें; प्रत्येक साँस छोड़ने के साथ, आगे की ओर झुकें।",
        "1 से 3 मिनट तक रुकें।",
      ],
    },
    benefits: {
      en: ["Stretches the spine, shoulders, hamstrings", "Stimulates the liver, kidneys, ovaries, and uterus", "Calms the brain and helps relieve stress"],
      hi: ["रीढ़, कंधों, हैमस्ट्रिंग को खींचता है", "यकृत, गुर्दे, अंडाशय और गर्भाशय को उत्तेजित करता है", "मस्तिष्क को शांत करता है और तनाव दूर करने में मदद करता है"],
    },
    category: "Seated",
  },
  {
    id: "matsyasana",
    name: { en: "Fish Pose", hi: "मत्स्यासन" },
    description: {
      en: "Fish Pose is a backbend that stretches the front of the body, particularly the throat, chest, and abdomen.",
      hi: "मत्स्यासन एक बैकबेंड है जो शरीर के अग्र भाग, विशेष रूप से गले, छाती और पेट को फैलाता है।",
    },
    instructions: {
      en: [
        "Lie on your back with your knees bent, feet on the floor.",
        "Lift your pelvis slightly off the floor and slide your hands, palms down, under your buttocks.",
        "Inhale, press your forearms and elbows into the floor, and lift your upper torso and head away from the floor.",
        "Release your head back onto the floor. Depending on your arch, either the back of your head or its crown will rest on the floor.",
        "Hold for 15 to 30 seconds, breathing smoothly.",
        "Exhale and slowly release, lifting your head first and then your torso.",
      ],
      hi: [
        "अपनी पीठ के बल लेट जाएं, घुटने मुड़े हुए, पैर फर्श पर।",
        "अपने श्रोणि को फर्श से थोड़ा ऊपर उठाएं और अपने हाथों, हथेलियों को नीचे, अपने नितंबों के नीचे स्लाइड करें।",
        "सांस लें, अपनी बाहों और कोहनी को फर्श में दबाएं, और अपने ऊपरी धड़ और सिर को फर्श से दूर उठाएं।",
        "अपने सिर को फर्श पर वापस छोड़ दें। आपके मेहराब के आधार पर, या तो आपके सिर के पीछे या इसका मुकुट फर्श पर टिका होगा।",
        "15 से 30 सेकंड तक रुकें, सुचारू रूप से सांस लें।",
        "सांस छोड़ें और धीरे-धीरे छोड़ें, पहले अपना सिर और फिर अपना धड़ उठाएं।",
      ],
    },
    benefits: {
      en: ["Stretches the deep hip flexors and intercostal muscles", "Improves posture", "Stretches and stimulates the organs of the belly and throat"],
      hi: ["गहरी कूल्हे फ्लेक्सर्स और इंटरकोस्टल मांसपेशियों को फैलाता है", "मुद्रा में सुधार करता है", "पेट और गले के अंगों को फैलाता और उत्तेजित करता है"],
    },
    category: "Floor",
  },
  {
    id: "gomukhasana",
    name: { en: "Cow Face Pose", hi: "गोमुखासन" },
    description: {
      en: "This seated pose provides a deep stretch for the hips, ankles, shoulders, and chest.",
      hi: "यह बैठा हुआ आसन कूल्हों, टखनों, कंधों और छाती के लिए गहरा खिंचाव प्रदान करता है।",
    },
    instructions: {
      en: [
        "Sit on the floor, bend your right knee, and place your right foot under your left buttock.",
        "Cross your left leg over your right, so your left knee is stacked over your right.",
        "Sit evenly on the sitting bones.",
        "Inhale and stretch your right arm up, then bend the elbow so your hand is behind your back.",
        "Exhale and reach your left arm behind your back, trying to clasp your right hand.",
        "Hold for about a minute, then release and repeat on the other side.",
      ],
      hi: [
        "फर्श पर बैठें, अपने दाहिने घुटने को मोड़ें, और अपने दाहिने पैर को अपने बाएं नितंब के नीचे रखें।",
        "अपने बाएं पैर को अपने दाहिने पैर के ऊपर से पार करें, ताकि आपका बायां घुटना आपके दाहिने के ऊपर हो।",
        "बैठने की हड्डियों पर समान रूप से बैठें।",
        "सांस लें और अपनी दाहिनी बांह को ऊपर फैलाएं, फिर कोहनी को मोड़ें ताकि आपका हाथ आपकी पीठ के पीछे हो।",
        "सांस छोड़ें और अपनी बाईं बांह को अपनी पीठ के पीछे पहुंचाएं, अपने दाहिने हाथ को पकड़ने की कोशिश करें।",
        "लगभग एक मिनट तक रुकें, फिर छोड़ें और दूसरी तरफ दोहराएं।",
      ],
    },
    benefits: {
      en: ["Stretches the ankles, hips and thighs, shoulders, armpits, and chest", "Strengthens the spine and abdominals"],
      hi: ["टखनों, कूल्हों और जांघों, कंधों, बगल और छाती को फैलाता है", "रीढ़ और पेट को मजबूत करता है"],
    },
    category: "Seated",
  },
  {
    id: "navasana",
    name: { en: "Boat Pose", hi: "नावासन" },
    description: {
      en: "Boat Pose strengthens the abdomen, hip flexors, and spine. It also stimulates the kidneys, thyroid and prostate glands, and intestines.",
      hi: "नावासन पेट, कूल्हे फ्लेक्सर्स और रीढ़ को मजबूत करता है। यह गुर्दे, थायरॉयड और प्रोस्टेट ग्रंथियों और आंतों को भी उत्तेजित करता है।",
    },
    instructions: {
      en: [
        "Sit on the floor with your knees bent, feet on the floor.",
        "Lean back slightly and lift your feet off the floor, keeping your shins parallel to the floor (Half Boat Pose).",
        "For Full Boat Pose, straighten your legs to a 45-degree angle from the floor.",
        "Extend your arms forward, parallel to the floor.",
        "Keep your spine straight and chest lifted. Balance on your sitting bones.",
        "Hold for 10-20 seconds, gradually increasing to a minute.",
      ],
      hi: [
        "अपने घुटनों को मोड़कर फर्श पर बैठें, पैर फर्श पर।",
        "थोड़ा पीछे झुकें और अपने पैरों को फर्श से ऊपर उठाएं, अपनी पिंडलियों को फर्श के समानांतर रखें (हाफ बोट पोज)।",
        "फुल बोट पोज के लिए, अपने पैरों को फर्श से 45 डिग्री के कोण पर सीधा करें।",
        "अपनी बाहों को आगे बढ़ाएं, फर्श के समानांतर।",
        "अपनी रीढ़ को सीधा और छाती को ऊपर उठाएं। अपनी बैठने की हड्डियों पर संतुलन बनाएं।",
        "10-20 सेकंड तक रुकें, धीरे-धीरे एक मिनट तक बढ़ाएं।",
      ],
    },
    benefits: {
      en: ["Strengthens the abdomen, hip flexors, and spine", "Stimulates the kidneys and intestines", "Improves balance"],
      hi: ["पेट, कूल्हे फ्लेक्सर्स और रीढ़ को मजबूत करता है", "गुर्दे और आंतों को उत्तेजित करता है", "संतुलन में सुधार करता है"],
    },
    category: "Seated",
  },
  {
    id: "salabhasana",
    name: { en: "Locust Pose", hi: "शलभासन" },
    description: {
      en: "Locust Pose strengthens the muscles of the spine, buttocks, and backs of the arms and legs.",
      hi: "शलभासन रीढ़, नितंबों और बाहों और पैरों के पिछले हिस्से की मांसपेशियों को मजबूत करता है।",
    },
    instructions: {
      en: [
        "Lie on your stomach with your arms alongside your torso, palms up, and forehead resting on the floor.",
        "Turn your big toes toward each other to rotate your thighs inwardly.",
        "Exhale and lift your head, upper torso, arms, and legs away from the floor.",
        "Your body will be resting on your lower ribs, belly, and front pelvis.",
        "Keep your gaze forward or slightly upward.",
        "Hold for 30 seconds to a minute, then release with an exhalation.",
      ],
      hi: [
        "अपने पेट के बल लेट जाएं, बाहें धड़ के साथ, हथेलियाँ ऊपर, और माथा फर्श पर टिका हुआ।",
        "अपनी जांघों को अंदर की ओर घुमाने के लिए अपने बड़े पैर की उंगलियों को एक-दूसरे की ओर मोड़ें।",
        "सांस छोड़ें और अपने सिर, ऊपरी धड़, बाहों और पैरों को फर्श से दूर उठाएं।",
        "आपका शरीर आपकी निचली पसलियों, पेट और सामने की श्रोणि पर टिका होगा।",
        "अपनी टकटकी को आगे या थोड़ा ऊपर की ओर रखें।",
        "30 सेकंड से एक मिनट तक रुकें, फिर साँस छोड़ते हुए छोड़ दें।",
      ],
    },
    benefits: {
      en: ["Strengthens the muscles of the spine, buttocks, and backs of the arms and legs", "Improves posture", "Stimulates abdominal organs"],
      hi: ["रीढ़, नितंबों और बाहों और पैरों के पिछले हिस्से की मांसपेशियों को मजबूत करता है", "मुद्रा में सुधार करता है", "पेट के अंगों को उत्तेजित करता है"],
    },
    category: "Floor",
  },
  {
    id: "marjaryasana-bitilasana",
    name: { en: "Cat-Cow Pose", hi: "मार्जरीआसन-बिटिलासन" },
    description: {
      en: "A gentle, flowing sequence that warms up the spine and relieves tension in the back, neck, and shoulders.",
      hi: "एक कोमल, बहने वाला क्रम जो रीढ़ को गर्म करता है और पीठ, गर्दन और कंधों में तनाव से राहत देता है।",
    },
    instructions: {
      en: [
        "Start on your hands and knees in a tabletop position.",
        "Inhale as you drop your belly towards the mat, lifting your chin and chest, and gaze up (Cow Pose).",
        "Exhale as you draw your belly to your spine and round your back toward the ceiling (Cat Pose).",
        "Look toward your navel.",
        "Continue flowing between Cat and Cow poses, syncing your breath with each movement.",
        "Repeat for 5-10 breaths.",
      ],
      hi: [
        "एक टेबलटॉप स्थिति में अपने हाथों और घुटनों पर शुरू करें।",
        "सांस लें जब आप अपने पेट को चटाई की ओर गिराते हैं, अपनी ठोड़ी और छाती को उठाते हैं, और ऊपर देखते हैं (गाय की मुद्रा)।",
        "सांस छोड़ें जब आप अपने पेट को अपनी रीढ़ की ओर खींचते हैं और अपनी पीठ को छत की ओर गोल करते हैं (बिल्ली की मुद्रा)।",
        "अपनी नाभि की ओर देखें।",
        "बिल्ली और गाय की मुद्राओं के बीच बहते रहें, अपनी सांस को प्रत्येक आंदोलन के साथ सिंक करें।",
        "5-10 सांसों के लिए दोहराएं।",
      ],
    },
    benefits: {
      en: ["Increases flexibility of the spine", "Stretches the neck, back, and torso", "Gently massages the spine and belly organs"],
      hi: ["रीढ़ की हड्डी के लचीलेपन को बढ़ाता है", "गर्दन, पीठ और धड़ को फैलाता है", "रीढ़ और पेट के अंगों की धीरे से मालिश करता है"],
    },
    category: "Kneeling",
  },
  {
    id: "sukhasana",
    name: { en: "Easy Pose", hi: "सुखासन" },
    description: {
      en: "A comfortable, cross-legged seated position used for meditation and breathing exercises.",
      hi: "ध्यान और श्वास अभ्यास के लिए उपयोग की जाने वाली एक आरामदायक, क्रॉस-लेग्ड बैठी हुई स्थिति।",
    },
    instructions: {
      en: [
        "Sit on the floor with your legs crossed.",
        "Place each foot beneath the opposite knee.",
        "Sit with a straight spine, with your head, neck, and spine aligned.",
        "Rest your hands on your knees, palms up or down.",
        "Close your eyes and breathe evenly.",
      ],
      hi: [
        "अपने पैरों को पार करके फर्श पर बैठें।",
        "प्रत्येक पैर को विपरीत घुटने के नीचे रखें।",
        "एक सीधी रीढ़ के साथ बैठें, अपने सिर, गर्दन और रीढ़ को संरेखित करें।",
        "अपने हाथों को अपने घुटनों पर रखें, हथेलियाँ ऊपर या नीचे।",
        "अपनी आँखें बंद करें और समान रूप से साँस लें।",
      ],
    },
    benefits: {
      en: ["Calms the mind", "Strengthens the back", "Stretches the knees and ankles"],
      hi: ["मन को शांत करता है", "पीठ को मजबूत करता है", "घुटनों और टखनों को फैलाता है"],
    },
    category: "Seated",
  },
  {
    id: "uttanasana",
    name: { en: "Standing Forward Bend", hi: "उत्तानासन" },
    description: {
      en: "A standing forward fold that stretches the hamstrings and calves while calming the mind.",
      hi: "एक खड़ा हुआ फॉरवर्ड फोल्ड जो मन को शांत करते हुए हैमस्ट्रिंग और पिंडलियों को फैलाता है।",
    },
    instructions: {
      en: [
        "Stand in Tadasana, hands on hips.",
        "Exhale and bend forward from the hip joints, not from the waist.",
        "Bring your palms or fingertips to the floor slightly in front of or beside your feet.",
        "Let your head hang. Keep your knees straight or slightly bent.",
        "With each inhalation, lift and lengthen the torso slightly; with each exhalation, release a little more fully into the forward bend.",
        "Hold for 30 seconds to 1 minute.",
      ],
      hi: [
        "ताड़ासन में खड़े हों, हाथ कूल्हों पर।",
        "सांस छोड़ें और कूल्हे के जोड़ों से आगे की ओर झुकें, कमर से नहीं।",
        "अपनी हथेलियों या उंगलियों को फर्श पर अपने पैरों के थोड़ा आगे या बगल में लाएं।",
        "अपने सिर को लटकने दें। अपने घुटनों को सीधा या थोड़ा मुड़ा हुआ रखें।",
        "प्रत्येक साँस लेने के साथ, धड़ को थोड़ा ऊपर उठाएं और लंबा करें; प्रत्येक साँस छोड़ने के साथ, आगे की ओर झुकने में थोड़ा और पूरी तरह से छोड़ दें।",
        "30 सेकंड से 1 मिनट तक रुकें।",
      ],
    },
    benefits: {
      en: ["Stretches the hamstrings, calves, and hips", "Reduces stress, anxiety, and fatigue", "Stimulates the liver and kidneys"],
      hi: ["हैमस्ट्रिंग, पिंडलियों और कूल्हों को फैलाता है", "तनाव, चिंता और थकान को कम करता है", "यकृत और गुर्दे को उत्तेजित करता है"],
    },
    category: "Standing",
  },
  {
    id: "garudasana",
    name: { en: "Eagle Pose", hi: "गरुड़ासन" },
    description: {
      en: "Eagle Pose improves balance and stretches the shoulders, upper back, and hips.",
      hi: "गरुड़ासन संतुलन में सुधार करता है और कंधों, ऊपरी पीठ और कूल्हों को फैलाता है।",
    },
    instructions: {
      en: [
        "Stand in Tadasana. Slightly bend your knees.",
        "Lift your right foot up and cross your right thigh over the left.",
        "Hook the top of your right foot behind your left calf.",
        "Extend your arms straight forward, parallel to the floor.",
        "Cross your left arm over the right and bend your elbows. Bring your palms together.",
        "Hold for 15 to 30 seconds. Unwind and repeat on the other side.",
      ],
      hi: [
        "ताड़ासन में खड़े हों। अपने घुटनों को थोड़ा मोड़ें।",
        "अपने दाहिने पैर को ऊपर उठाएं और अपनी दाहिनी जांघ को बाईं ओर पार करें।",
        "अपने दाहिने पैर के शीर्ष को अपनी बाईं पिंडली के पीछे हुक करें।",
        "अपनी बाहों को सीधे आगे बढ़ाएं, फर्श के समानांतर।",
        "अपनी बाईं बांह को दाईं ओर पार करें और अपनी कोहनी मोड़ें। अपनी हथेलियों को एक साथ लाएं।",
        "15 से 30 सेकंड तक रुकें। खोलें और दूसरी तरफ दोहराएं।",
      ],
    },
    benefits: {
      en: ["Strengthens and stretches the ankles and calves", "Improves concentration and sense of balance", "Stretches the shoulders and upper back"],
      hi: ["टखनों और पिंडलियों को मजबूत और खींचता है", "एकाग्रता और संतुलन की भावना में सुधार करता है", "कंधों और ऊपरी पीठ को फैलाता है"],
    },
    category: "Standing",
  },
  {
    id: "virabhadrasana3",
    name: { en: "Warrior III", hi: "वीरभद्रासन III" },
    description: {
      en: "Warrior III strengthens the ankles and legs, shoulders and muscles of the back, and tones the abdomen.",
      hi: "वीरभद्रासन III टखनों और पैरों, कंधों और पीठ की मांसपेशियों को मजबूत करता है, और पेट को टोन करता है।",
    },
    instructions: {
      en: [
        "From Tadasana, step your left foot back.",
        "Hinge at your hips to bring your torso forward, parallel to the floor.",
        "Simultaneously, lift your left leg until it is parallel to the floor.",
        "Extend your arms forward, parallel to the floor, or bring them to your heart center.",
        "Keep your standing leg strong and straight. Gaze down at the floor.",
        "Hold for 30 seconds, then repeat on the other side.",
      ],
      hi: [
        "ताड़ासन से, अपने बाएं पैर को पीछे ले जाएं।",
        "अपने धड़ को आगे लाने के लिए अपने कूल्हों पर टिकाएं, फर्श के समानांतर।",
        "साथ ही, अपने बाएं पैर को तब तक उठाएं जब तक कि यह फर्श के समानांतर न हो जाए।",
        "अपनी बाहों को आगे बढ़ाएं, फर्श के समानांतर, या उन्हें अपने हृदय केंद्र में लाएं।",
        "अपने खड़े पैर को मजबूत और सीधा रखें। फर्श पर नीचे देखें।",
        "30 सेकंड तक रुकें, फिर दूसरी तरफ दोहराएं।",
      ],
    },
    benefits: {
      en: ["Improves balance and posture", "Strengthens the entire back side of the body", "Tones the abdomen"],
      hi: ["संतुलन और मुद्रा में सुधार करता है", "शरीर के पूरे पिछले हिस्से को मजबूत करता है", "पेट को टोन करता है"],
    },
    category: "Standing",
  },
  {
    id: "ardha-matsyendrasana",
    name: { en: "Half Lord of the Fishes Pose", hi: "अर्ध मत्स्येन्द्रासन" },
    description: {
      en: "A seated spinal twist that energizes the spine and stimulates the digestive fire.",
      hi: "एक बैठा हुआ रीढ़ की हड्डी का मोड़ जो रीढ़ को सक्रिय करता है और पाचन अग्नि को उत्तेजित करता है।",
    },
    instructions: {
      en: [
        "Sit on the floor with legs extended.",
        "Bend your right knee and place your right foot outside your left hip.",
        "Bend your left knee and place your left foot outside your right thigh.",
        "Exhale and twist toward the inside of your left thigh.",
        "Press your left hand against the floor behind you for support and place your right upper arm on the outside of your left thigh.",
        "Turn your head to look over your left shoulder.",
        "Hold for 30 to 60 seconds, then release and repeat on the other side.",
      ],
      hi: [
        "पैरों को फैलाकर फर्श पर बैठें।",
        "अपने दाहिने घुटने को मोड़ें और अपने दाहिने पैर को अपने बाएं कूल्हे के बाहर रखें।",
        "अपने बाएं घुटने को मोड़ें और अपने बाएं पैर को अपनी दाहिनी जांघ के बाहर रखें।",
        "सांस छोड़ें और अपनी बाईं जांघ के अंदर की ओर मुड़ें।",
        "समर्थन के लिए अपने बाएं हाथ को अपने पीछे फर्श के खिलाफ दबाएं और अपनी दाहिनी ऊपरी बांह को अपनी बाईं जांघ के बाहर रखें।",
        "अपने बाएं कंधे के ऊपर देखने के लिए अपना सिर घुमाएं।",
        "30 से 60 सेकंड तक रुकें, फिर छोड़ें और दूसरी तरफ दोहराएं।",
      ],
    },
    benefits: {
      en: ["Stretches the shoulders, hips, and neck", "Energizes the spine", "Stimulates the digestive organs"],
      hi: ["कंधों, कूल्हों और गर्दन को फैलाता है", "रीढ़ को सक्रिय करता है", "पाचन अंगों को उत्तेजित करता है"],
    },
    category: "Seated",
  },
  {
    id: "baddha-konasana",
    name: { en: "Bound Angle Pose", hi: "बद्ध कोणासन" },
    description: {
      en: "Also known as Cobbler's Pose, this seated posture stretches the inner thighs, groins, and knees.",
      hi: "मोची मुद्रा के रूप में भी जाना जाता है, यह बैठा हुआ आसन आंतरिक जांघों, कमर और घुटनों को फैलाता है।",
    },
    instructions: {
      en: [
        "Sit with your legs straight out in front of you.",
        "Exhale, bend your knees, pull your heels toward your pelvis.",
        "Drop your knees out to the sides and press the soles of your feet together.",
        "Grasp the big toe of each foot. Keep the outer edges of your feet on the floor.",
        "Sit tall with a long spine.",
        "Hold for 1 to 5 minutes.",
      ],
      hi: [
        "अपने पैरों को अपने सामने सीधे रखकर बैठें।",
        "सांस छोड़ें, घुटनों को मोड़ें, अपनी एड़ी को अपनी श्रोणि की ओर खींचें।",
        "अपने घुटनों को किनारों पर गिराएं और अपने पैरों के तलवों को एक साथ दबाएं।",
        "प्रत्येक पैर के बड़े पैर की अंगुली को पकड़ें। अपने पैरों के बाहरी किनारों को फर्श पर रखें।",
        "एक लंबी रीढ़ के साथ लंबा बैठें।",
        "1 से 5 मिनट तक रुकें।",
      ],
    },
    benefits: {
      en: ["Stretches the inner thighs, groins, and knees", "Stimulates abdominal organs, ovaries and prostate gland, bladder, and kidneys", "Helps relieve mild depression, anxiety, and fatigue"],
      hi: ["आंतरिक जांघों, कमर और घुटनों को फैलाता है", "पेट के अंगों, अंडाशय और प्रोस्टेट ग्रंथि, मूत्राशय और गुर्दे को उत्तेजित करता है", "हल्के अवसाद, चिंता और थकान से राहत दिलाने में मदद करता है"],
    },
    category: "Seated",
  },
  {
    id: "janu-sirsasana",
    name: { en: "Head-to-Knee Forward Bend", hi: "जानु शीर्षासन" },
    description: {
      en: "A seated forward bend that stretches the spine, shoulders, hamstrings, and groins.",
      hi: "एक बैठा हुआ फॉरवर्ड बेंड जो रीढ़, कंधों, हैमस्ट्रिंग और कमर को फैलाता है।",
    },
    instructions: {
      en: [
        "Sit with your legs extended. Bend your right knee and bring the sole of your right foot to your inner left thigh.",
        "Inhale and lengthen your torso.",
        "Exhale and fold forward over your left leg, hinging at your hips.",
        "Hold onto your left foot, ankle, or shin.",
        "Hold for 1 to 3 minutes.",
        "Release and repeat on the other side.",
      ],
      hi: [
        "अपने पैरों को फैलाकर बैठें। अपने दाहिने घुटने को मोड़ें और अपने दाहिने पैर के तलवे को अपनी भीतरी बाईं जांघ पर लाएं।",
        "सांस लें और अपने धड़ को लंबा करें।",
        "सांस छोड़ें और अपने बाएं पैर के ऊपर आगे की ओर झुकें, अपने कूल्हों पर टिकाएं।",
        "अपने बाएं पैर, टखने या पिंडली को पकड़ें।",
        "1 से 3 मिनट तक रुकें।",
        "छोड़ें और दूसरी तरफ दोहराएं।",
      ],
    },
    benefits: {
      en: ["Stretches the spine, shoulders, hamstrings, and groins", "Calms the brain and helps relieve mild depression", "Stimulates the liver and kidneys"],
      hi: ["रीढ़, कंधों, हैमस्ट्रिंग और कमर को फैलाता है", "मस्तिष्क को शांत करता है और हल्के अवसाद से राहत दिलाने में मदद करता है", "यकृत और गुर्दे को उत्तेजित करता है"],
    },
    category: "Seated",
  },
  {
    id: "sirsasana",
    name: { en: "Headstand", hi: "शीर्षासन" },
    description: {
      en: "Considered the 'king' of all asanas, Headstand is an advanced inversion that requires significant strength and balance.",
      hi: "सभी आसनों का 'राजा' माना जाने वाला शीर्षासन एक उन्नत उलटा है जिसके लिए महत्वपूर्ण शक्ति और संतुलन की आवश्यकता होती है।",
    },
    instructions: {
      en: [
        "Kneel on the floor. Interlock your fingers and place your forearms on the floor, creating a triangle.",
        "Place the crown of your head on the floor, cupping the back of your head with your clasped hands.",
        "Inhale, lift your knees off the floor, and walk your feet closer to your elbows.",
        "Exhale and lift your feet off the floor, drawing your knees toward your chest.",
        "Slowly straighten your legs up toward the ceiling.",
        "Hold for 10 seconds to begin, gradually increasing to 5 minutes or more. (Practice with a wall or teacher).",
      ],
      hi: [
        "फर्श पर घुटने टेकें। अपनी उंगलियों को इंटरलॉक करें और अपनी बाहों को फर्श पर रखें, एक त्रिकोण बनाएं।",
        "अपने सिर के मुकुट को फर्श पर रखें, अपने सिर के पिछले हिस्से को अपने हाथों से पकड़ें।",
        "सांस लें, अपने घुटनों को फर्श से ऊपर उठाएं, और अपने पैरों को अपनी कोहनी के करीब ले जाएं।",
        "सांस छोड़ें और अपने पैरों को फर्श से ऊपर उठाएं, अपने घुटनों को अपनी छाती की ओर खींचें।",
        "धीरे-धीरे अपने पैरों को छत की ओर सीधा करें।",
        "शुरू करने के लिए 10 सेकंड तक रुकें, धीरे-धीरे 5 मिनट या उससे अधिक तक बढ़ाएं। (एक दीवार या शिक्षक के साथ अभ्यास करें)।",
      ],
    },
    benefits: {
      en: ["Strengthens the arms, legs, and spine", "Tones the abdominal organs", "Calms the brain and helps relieve stress"],
      hi: ["हाथों, पैरों और रीढ़ को मजबूत करता है", "पेट के अंगों को टोन करता है", "मस्तिष्क को शांत करता है और तनाव दूर करने में मदद करता है"],
    },
    category: "Inversion",
  },
  {
    id: "sarvangasana",
    name: { en: "Shoulderstand", hi: "सर्वांगासन" },
    description: {
      en: "Often called the 'queen' of asanas, Shoulderstand benefits the entire body by stimulating the thyroid and prostate glands and abdominal organs.",
      hi: "अक्सर आसनों की 'रानी' कहा जाता है, सर्वांगासन थायरॉयड और प्रोस्टेट ग्रंथियों और पेट के अंगों को उत्तेजित करके पूरे शरीर को लाभ पहुंचाता है।",
    },
    instructions: {
      en: [
        "Lie on your back with a folded blanket under your shoulders for support.",
        "Bend your knees and place your feet on the floor.",
        "Exhale and swing your legs up and over your head into Halasana (Plow Pose).",
        "Bend your elbows and place your hands on your lower back for support.",
        "Inhale and lift your legs one by one to the ceiling, creating a straight line from your shoulders to your heels.",
        "Hold for 30 seconds initially, gradually increasing to 5 minutes.",
      ],
      hi: [
        "समर्थन के लिए अपने कंधों के नीचे एक मुड़ा हुआ कंबल के साथ अपनी पीठ के बल लेट जाएं।",
        "अपने घुटनों को मोड़ें और अपने पैरों को फर्श पर रखें।",
        "सांस छोड़ें और अपने पैरों को ऊपर और अपने सिर के ऊपर हलासन (हल मुद्रा) में घुमाएं।",
        "अपनी कोहनी मोड़ें और समर्थन के लिए अपने हाथों को अपनी निचली पीठ पर रखें।",
        "सांस लें और अपने पैरों को एक-एक करके छत तक उठाएं, अपने कंधों से अपनी एड़ी तक एक सीधी रेखा बनाएं।",
        "शुरू में 30 सेकंड तक रुकें, धीरे-धीरे 5 मिनट तक बढ़ाएं।",
      ],
    },
    benefits: {
      en: ["Stretches the shoulders and neck", "Tones the legs and buttocks", "Improves digestion", "Reduces fatigue and alleviates insomnia"],
      hi: ["कंधों और गर्दन को फैलाता है", "पैरों और नितंबों को टोन करता है", "पाचन में सुधार करता है", "थकान कम करता है और अनिद्रा को कम करता है"],
    },
    category: "Inversion",
  },
  {
    id: "viparaita-karani",
    name: { en: "Legs-Up-the-Wall Pose", hi: "विपरीत करणी" },
    description: {
      en: "A restorative and gentle inversion that helps relieve tired legs and feet, and calms the nervous system.",
      hi: "एक पुनर्स्थापनात्मक और कोमल उलटा जो थके हुए पैरों और पैरों से राहत दिलाने में मदद करता है, और तंत्रिका तंत्र को शांत करता है।",
    },
    instructions: {
      en: [
        "Sit sideways with your right side against a wall.",
        "Gently swing your legs up onto the wall and your shoulders and head down onto the floor.",
        "Your sitting bones should be as close to the wall as is comfortable.",
        "Let your arms rest open to the sides, palms up.",
        "Close your eyes and relax. Stay in the pose for 5 to 20 minutes.",
      ],
      hi: [
        "एक दीवार के खिलाफ अपनी दाईं ओर के साथ बग़ल में बैठें।",
        "धीरे-धीरे अपने पैरों को दीवार पर ऊपर और अपने कंधों और सिर को फर्श पर नीचे घुमाएं।",
        "आपकी बैठने की हड्डियाँ दीवार के उतनी ही करीब होनी चाहिए जितनी आरामदायक हो।",
        "अपनी बाहों को किनारों पर खुला आराम करने दें, हथेलियाँ ऊपर की ओर।",
        "अपनी आँखें बंद करें और आराम करें। 5 से 20 मिनट तक मुद्रा में रहें।",
      ],
    },
    benefits: {
      en: ["Relieves tired legs and feet", "Gently stretches the back of the neck and hamstrings", "Alleviates mild backache"],
      hi: ["थके हुए पैरों और पैरों से राहत देता है", "गर्दन और हैमस्ट्रिंग के पिछले हिस्से को धीरे से फैलाता है", "हल्के पीठ दर्द को कम करता है"],
    },
    category: "Resting",
  },
  {
    id: "ananda-balasana",
    name: { en: "Happy Baby Pose", hi: "आनंद बालासन" },
    description: {
      en: "This gentle pose stretches the inner groins and the back of the spine. It helps to calm the mind and relieve stress.",
      hi: "यह कोमल मुद्रा आंतरिक कमर और रीढ़ के पिछले हिस्से को फैलाती है। यह मन को शांत करने और तनाव दूर करने में मदद करती है।",
    },
    instructions: {
      en: [
        "Lie on your back. With an exhale, bend your knees into your belly.",
        "Inhale, grip the outsides of your feet with your hands.",
        "Open your knees slightly wider than your torso, then bring them up toward your armpits.",
        "Position each ankle directly over the knee, so your shins are perpendicular to the floor.",
        "Gently rock from side to side to massage your spine.",
        "Hold for 30 seconds to 1 minute.",
      ],
      hi: [
        "अपनी पीठ के बल लेट जाएं। एक साँस छोड़ने के साथ, अपने घुटनों को अपने पेट में मोड़ें।",
        "सांस लें, अपने हाथों से अपने पैरों के बाहरी हिस्से को पकड़ें।",
        "अपने घुटनों को अपने धड़ से थोड़ा चौड़ा खोलें, फिर उन्हें अपनी बगल की ओर लाएं।",
        "प्रत्येक टखने को सीधे घुटने के ऊपर रखें, ताकि आपकी पिंडलियां फर्श के लंबवत हों।",
        "अपनी रीढ़ की मालिश करने के लिए धीरे-धीरे एक तरफ से दूसरी तरफ रॉक करें।",
        "30 सेकंड से 1 मिनट तक रुकें।",
      ],
    },
    benefits: {
      en: ["Gently stretches the inner groins and back spine", "Calms the brain and helps relieve stress and fatigue", "Opens the hips"],
      hi: ["आंतरिक कमर और पीठ की रीढ़ को धीरे से फैलाता है", "मस्तिष्क को शांत करता है और तनाव और थकान को दूर करने में मदद करता है", "कूल्हों को खोलता है"],
    },
    category: "Floor",
  }
];
