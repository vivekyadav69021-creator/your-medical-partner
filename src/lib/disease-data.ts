
export type Disease = {
  id: string;
  nameEn: string;
  nameHi: string;
  overviewEn: string;
  overviewHi: string;
  symptomsEn: string;
  symptomsHi:string;
  treatmentEn: string;
  treatmentHi: string;
  whenToSeeDoctorEn: string;
  whenToSeeDoctorHi: string;
};

export const diseases: Disease[] = [
  {
    id: 'common-cold',
    nameEn: 'Common Cold',
    nameHi: 'सामान्य जुकाम',
    overviewEn: 'The common cold is a viral infection of your nose and throat (upper respiratory tract). It\'s usually harmless, although it might not feel that way.',
    overviewHi: 'सामान्य जुकाम आपकी नाक और गले (ऊपरी श्वसन पथ) का एक वायरल संक्रमण है। यह आमतौर पर हानिरहित होता है, हालांकि ऐसा महसूस नहीं हो सकता है।',
    symptomsEn: `<ul>
        <li>Runny or stuffy nose</li>
        <li>Sore throat</li>
        <li>Cough</li>
        <li>Congestion</li>
        <li>Slight body aches or a mild headache</li>
        <li>Sneezing</li>
        <li>Low-grade fever</li>
        <li>Generally feeling unwell (malaise)</li>
    </ul>`,
    symptomsHi: `<ul>
        <li>बहती या बंद नाक</li>
        <li>गले में खराश</li>
        <li>खांसी</li>
        <li>जकड़न</li>
        <li>हल्के शरीर में दर्द या हल्का सिरदर्द</li>
        <li>छींक आना</li>
        <li>हल्का बुखार</li>
        <li>आम तौर पर अस्वस्थ महसूस करना (अस्वस्थता)</li>
    </ul>`,
    treatmentEn: `There's no cure for the common cold. Treatment is directed at relieving signs and symptoms. Options include:
    <ul>
        <li><strong>Pain relievers.</strong> For fever, sore throat and headache.</li>
        <li><strong>Decongestant nasal sprays.</strong> To relieve stuffiness.</li>
        <li><strong>Cough syrups.</strong> To calm a cough.</li>
        <li>Rest and stay hydrated.</li>
    </ul>`,
    treatmentHi: `सामान्य जुकाम का कोई इलाज नहीं है। उपचार का उद्देश्य संकेतों और लक्षणों से राहत दिलाना है। विकल्पों में शामिल हैं:
    <ul>
        <li><strong>दर्द निवारक।</strong> बुखार, गले में खराश और सिरदर्द के लिए।</li>
        <li><strong>नाक खोलने वाले स्प्रे।</strong> बंद नाक से राहत के लिए।</li>
        <li><strong>खांसी की दवाई।</strong> खांसी को शांत करने के लिए।</li>
        <li>आराम करें और हाइड्रेटेड रहें।</li>
    </ul>`,
    whenToSeeDoctorEn: `See a doctor if you have:
    <ul>
        <li>Fever of 101.3 F (38.5 C) or higher</li>
        <li>Fever that lasts five days or more or returns after a fever-free period</li>
        <li>Shortness of breath</li>
        <li>Wheezing</li>
        <li>Severe sore throat, headache or sinus pain</li>
    </ul>`,
    whenToSeeDoctorHi: `यदि आपको ये समस्याएं हों तो डॉक्टर से मिलें:
    <ul>
        <li>101.3 F (38.5 C) या उससे अधिक का बुखार</li>
        <li>बुखार जो पांच दिनों से अधिक समय तक रहता है या बुखार मुक्त अवधि के बाद वापस आ जाता है</li>
        <li>सांस लेने में कठिनाई</li>
        <li>घरघराहट</li>
        <li>गले में गंभीर दर्द, सिरदर्द या साइनस का दर्द</li>
    </ul>`,
  },
  {
    id: 'diabetes',
    nameEn: 'Diabetes',
    nameHi: 'मधुमेह',
    overviewEn: 'Diabetes mellitus refers to a group of diseases that affect how your body uses blood sugar (glucose). Glucose is an important source of energy for the cells that make up your muscles and tissues.',
    overviewHi: 'डायबिटीज मेलिटस उन बीमारियों के समूह को संदर्भित करता है जो आपके शरीर द्वारा रक्त शर्करा (ग्लूकोज) का उपयोग करने के तरीके को प्रभावित करते हैं। ग्लूकोज आपकी मांसपेशियों और ऊतकों को बनाने वाली कोशिकाओं के लिए ऊर्जा का एक महत्वपूर्ण स्रोत है।',
    symptomsEn: `<ul>
        <li>Increased thirst</li>
        <li>Frequent urination</li>
        <li>Extreme hunger</li>
        <li>Unexplained weight loss</li>
        <li>Presence of ketones in the urine</li>
        <li>Fatigue</li>
        <li>Irritability</li>
        <li>Blurred vision</li>
        <li>Slow-healing sores</li>
    </ul>`,
    symptomsHi: `<ul>
        <li>प्यास बढ़ना</li>
        <li>बार-बार पेशाब आना</li>
        <li>अत्यधिक भूख लगना</li>
        <li>अस्पष्टीकृत वजन घटना</li>
        <li>मूत्र में कीटोन की उपस्थिति</li>
        <li>थकान</li>
        <li>चिड़चिड़ापन</li>
        <li>धुंधली दृष्टि</li>
        <li>घावों का धीरे-धीरे भरना</li>
    </ul>`,
    treatmentEn: `Treatment for diabetes requires keeping close watch over your blood sugar levels. Depending on what type of diabetes you have, insulin, oral medications, or both may be needed.
    <ul>
        <li>Monitoring your blood sugar</li>
        <li>Insulin therapy</li>
        <li>Oral or other medications</li>
        <li>Healthy diet and regular exercise</li>
    </ul>`,
    treatmentHi: `मधुमेह के उपचार के लिए आपके रक्त शर्करा के स्तर पर कड़ी नजर रखने की आवश्यकता होती है। आपके मधुमेह के प्रकार के आधार पर, इंसुलिन, मौखिक दवाएं, या दोनों की आवश्यकता हो सकती है।
    <ul>
        <li>अपने रक्त शर्करा की निगरानी करना</li>
        <li>इंसुलिन थेरेपी</li>
        <li>मौखिक या अन्य दवाएं</li>
        <li>स्वस्थ आहार और नियमित व्यायाम</li>
    </ul>`,
    whenToSeeDoctorEn: `If you suspect you or your child may have diabetes. If you notice any possible diabetes symptoms, contact your doctor. The earlier the condition is diagnosed, the sooner treatment can begin.`,
    whenToSeeDoctorHi: `यदि आपको संदेह है कि आपको या आपके बच्चे को मधुमेह हो सकता है। यदि आप मधुमेह के किसी भी संभावित लक्षण को देखते हैं, तो अपने डॉक्टर से संपर्क करें। जितनी जल्दी इस स्थिति का निदान होगा, उतनी ही जल्दी उपचार शुरू किया जा सकता है।`,
  },
  {
    id: 'hypertension',
    nameEn: 'Hypertension (High Blood Pressure)',
    nameHi: 'उच्च रक्तचाप (हाई ब्लड प्रेशर)',
    overviewEn: 'High blood pressure is a common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems, such as heart disease.',
    overviewHi: 'उच्च रक्तचाप एक सामान्य स्थिति है जिसमें आपकी धमनी की दीवारों के खिलाफ रक्त का दीर्घकालिक बल इतना अधिक होता है कि यह अंततः हृदय रोग जैसी स्वास्थ्य समस्याओं का कारण बन सकता है।',
    symptomsEn: `Most people with high blood pressure have no signs or symptoms, even if blood pressure readings reach dangerously high levels. A few people may have:
    <ul>
        <li>Headaches</li>
        <li>Shortness of breath</li>
        <li>Nosebleeds</li>
    </ul>
    But these signs and symptoms aren't specific and usually don't occur until high blood pressure has reached a severe or life-threatening stage.`,
    symptomsHi: `उच्च रक्तचाप वाले अधिकांश लोगों में कोई संकेत या लक्षण ਨਹੀਂ होते हैं, भले ही रक्तचाप की रीडिंग खतरनाक रूप से उच्च स्तर तक पहुंच जाए। कुछ लोगों को हो सकता है:
    <ul>
        <li>सिरदर्द</li>
        <li>सांस लेने में कठिनाई</li>
        <li>नकसीर</li>
    </ul>
    लेकिन ये संकेत और लक्षण विशिष्ट नहीं हैं और आमतौर पर तब तक नहीं होते जब तक कि उच्च रक्तचाप एक गंभीर या जानलेवा चरण तक न पहुंच जाए।`,
    treatmentEn: `Changing your lifestyle can go a long way toward controlling high blood pressure. Your doctor may recommend lifestyle changes including:
    <ul>
        <li>Eating a heart-healthy diet with less salt</li>
        <li>Getting regular physical activity</li>
        <li>Maintaining a healthy weight or losing weight if you're overweight or obese</li>
        <li>Limiting the amount of alcohol you drink</li>
        <li>Medications such as diuretics, ACE inhibitors, or beta-blockers may be prescribed.</li>
    </ul>`,
    treatmentHi: `अपनी जीवनशैली बदलने से उच्च रक्तचाप को नियंत्रित करने में काफी मदद मिल सकती है। आपका डॉक्टर जीवनशैली में बदलाव की सिफारिश कर सकता है जिसमें शामिल हैं:
    <ul>
        <li>कम नमक वाला हृदय-स्वस्थ आहार खाना</li>
        <li>नियमित शारीरिक गतिविधि करना</li>
        <li>यदि आप अधिक वजन वाले या मोटे हैं तो स्वस्थ वजन बनाए रखना या वजन कम करना</li>
        <li>आपके द्वारा पी जाने वाली शराब की मात्रा को सीमित करना</li>
        <li>मूत्रवर्धक, एसीई इनहिबिटर, या बीटा-ब्लॉकर्स जैसी दवाएं निर्धारित की जा सकती हैं।</li>
    </ul>`,
    whenToSeeDoctorEn: `You'll likely have your blood pressure checked as part of a routine doctor's appointment. Ask your doctor for a blood pressure reading at least every two years starting at age 18.`,
    whenToSeeDoctorHi: `नियमित डॉक्टर की मुलाकात के हिस्से के रूप में आपका रक्तचाप जांचा जाएगा। 18 साल की उम्र से शुरू होने वाले हर दो साल में कम से कम एक बार अपने डॉक्टर से रक्तचाप की रीडिंग के लिए पूछें।`,
  },
  {
    id: 'asthma',
    nameEn: 'Asthma',
    nameHi: 'अस्थमा (दमा)',
    overviewEn: 'Asthma is a condition in which your airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing, a whistling sound (wheezing) when you breathe out and shortness of breath.',
    overviewHi: 'अस्थमा एक ऐसी स्थिति है जिसमें आपके वायुमार्ग संकीर्ण और सूज जाते हैं और अतिरिक्त बलगम का उत्पादन कर सकते हैं। इससे सांस लेना मुश्किल हो सकता है और खांसी, सांस छोड़ते समय एक सीटी की आवाज (घरघराहट) और सांस की तकलीफ हो सकती है।',
    symptomsEn: '<ul><li>Shortness of breath</li><li>Chest tightness or pain</li><li>Wheezing when exhaling, which is a common sign of asthma in children</li><li>Trouble sleeping caused by shortness of breath, coughing or wheezing</li><li>Coughing or wheezing attacks that are worsened by a respiratory virus, such as a cold or the flu</li></ul>',
    symptomsHi: '<ul><li>सांस लेने में तकलीफ</li><li>सीने में जकड़न या दर्द</li><li>सांस छोड़ते समय घरघराहट, जो बच्चों में अस्थमा का एक आम संकेत है</li><li>सांस की तकलीफ, खांसी या घरघराहट के कारण सोने में परेशानी</li><li>खांसी या घरघराहट के दौरे जो श्वसन वायरस, जैसे सर्दी या फ्लू से बिगड़ जाते हैं</li></ul>',
    treatmentEn: 'Treatment usually involves learning to recognize your triggers, taking steps to avoid them and tracking your breathing to make sure your daily asthma medications are keeping symptoms under control. In case of an asthma flare-up, you may need to use a quick-relief inhaler.',
    treatmentHi: 'उपचार में आमतौर पर अपने ट्रिगर्स को पहचानना, उनसे बचने के लिए कदम उठाना और यह सुनिश्चित करने के लिए अपनी सांसों पर नज़र रखना शामिल है कि आपकी दैनिक अस्थमा की दवाएं लक्षणों को नियंत्रित रख रही हैं। अस्थमा के बढ़ने की स्थिति में, आपको فوری राहत देने वाले इन्हेलर का उपयोग करने की आवश्यकता हो सकती है।',
    whenToSeeDoctorEn: 'Seek immediate medical attention if your signs and symptoms worsen or if you have a severe asthma attack. After an emergency visit, follow up with your regular doctor to ensure your asthma is under control.',
    whenToSeeDoctorHi: 'यदि आपके संकेत और लक्षण बिगड़ते हैं या यदि आपको गंभीर अस्थमा का दौरा पड़ता है तो तत्काल चिकित्सा सहायता लें। आपातकालीन दौरे के बाद, यह सुनिश्चित करने के लिए अपने नियमित चिकित्सक से संपर्क करें कि आपका अस्थमा नियंत्रण में है।',
  },
  {
    id: 'migraine',
    nameEn: 'Migraine',
    nameHi: 'माइग्रेन',
    overviewEn: 'A migraine is a headache that can cause severe throbbing pain or a pulsing sensation, usually on one side of the head. It\'s often accompanied by nausea, vomiting, and extreme sensitivity to light and sound.',
    overviewHi: 'माइग्रेन एक सिरदर्द है जो गंभीर धड़कते हुए दर्द या एक स्पंदन सनसनी पैदा कर सकता है, आमतौर पर सिर के एक तरफ। यह अक्सर मतली, उल्टी, और प्रकाश और ध्वनि के प्रति अत्यधिक संवेदनशीलता के साथ होता है।',
    symptomsEn: '<ul><li>Throbbing or pulsing head pain</li><li>Sensitivity to light, sound, and sometimes smell and touch</li><li>Nausea and vomiting</li><li>Blurred vision</li><li>Lightheadedness, sometimes followed by fainting</li></ul>',
    symptomsHi: '<ul><li>धड़कता हुआ या स्पंदनशील सिरदर्द</li><li>प्रकाश, ध्वनि और कभी-कभी गंध और स्पर्श के प्रति संवेदनशीलता</li><li>मतली और उल्टी</li><li>धुंधली दृष्टि</li><li>चक्कर आना, कभी-कभी बेहोशी के बाद</li></ul>',
    treatmentEn: 'Migraine treatments can help stop symptoms and prevent future attacks. Medications can be divided into two broad categories: Pain-relieving medications (also known as acute or abortive treatment) and Preventive medications.',
    treatmentHi: 'माइग्रेन का उपचार लक्षणों को रोकने और भविष्य के हमलों को रोकने में मदद कर सकता है। दवाओं को दो व्यापक श्रेणियों में विभाजित किया जा सकता है: दर्द से राहत देने वाली दवाएं (तीव्र या गर्भपात उपचार के रूप में भी जाना जाता है) और निवारक दवाएं।',
    whenToSeeDoctorEn: 'See your doctor immediately or go to the emergency room if you have any of the following signs and symptoms, which could indicate a more serious medical problem: an abrupt, severe headache like a thunderclap, headache with fever, stiff neck, confusion, seizures, double vision, numbness or weakness in any part of the body.',
    whenToSeeDoctorHi: 'यदि आपके पास निम्नलिखित में से कोई भी संकेत या लक्षण हैं तो तुरंत अपने डॉक्टर से मिलें या आपातकालीन कक्ष में जाएं, जो एक अधिक गंभीर चिकित्सा समस्या का संकेत दे सकता है: बिजली की तरह अचानक, गंभीर सिरदर्द, बुखार के साथ सिरदर्द, गर्दन में अकड़न, भ्रम, दौरे, दोहरी दृष्टि, शरीर के किसी भी हिस्से में सुन्नता या कमजोरी।',
  },
  {
    id: 'arthritis',
    nameEn: 'Arthritis',
    nameHi: 'गठिया',
    overviewEn: 'Arthritis is the swelling and tenderness of one or more joints. The main symptoms of arthritis are joint pain and stiffness, which typically worsen with age. The most common types of arthritis are osteoarthritis and rheumatoid arthritis.',
    overviewHi: 'गठिया एक या एक से अधिक जोड़ों की सूजन और कोमलता है। गठिया के मुख्य लक्षण जोड़ों का दर्द और अकड़न हैं, जो आमतौर पर उम्र के साथ खराब हो जाते हैं। सबसे आम प्रकार के गठिया ऑस्टियोआर्थराइटिस और रुमेटीइड गठिया हैं।',
    symptomsEn: '<ul><li>Pain</li><li>Stiffness</li><li>Swelling</li><li>Redness</li><li>Decreased range of motion</li></ul>',
    symptomsHi: '<ul><li>दर्द</li><li>अकड़न</li><li>सूजन</li><li>लालिमा</li><li>गति की सीमा में कमी</li></ul>',
    treatmentEn: 'Treatment focuses on relieving symptoms and improving joint function. You may need to try several different treatments or combinations of treatments before you determine what works best for you. This includes medications, physical therapy, or sometimes surgery.',
    treatmentHi: 'उपचार लक्षणों से राहत देने और संयुक्त कार्य में सुधार लाने पर केंद्रित है। आपको यह निर्धारित करने से पहले कई अलग-अलग उपचारों या उपचारों के संयोजनों को आज़माने की आवश्यकता हो सकती है कि आपके लिए सबसे अच्छा क्या काम करता है। इसमें दवाएं, भौतिक चिकित्सा, या कभी-कभी सर्जरी शामिल है।',
    whenToSeeDoctorEn: 'You should see a doctor if you have persistent discomfort and swelling in your joints. They can determine the cause and start appropriate treatment.',
    whenToSeeDoctorHi: 'यदि आपके जोड़ों में लगातार असुविधा और सूजन है तो आपको डॉक्टर को दिखाना चाहिए। वे कारण निर्धारित कर सकते हैं और उचित उपचार शुरू कर सकते हैं।',
  },
  {
    id: 'depression',
    nameEn: 'Depression',
    nameHi: 'अवसाद',
    overviewEn: 'Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest. Also called major depressive disorder or clinical depression, it affects how you feel, think and behave and can lead to a variety of emotional and physical problems.',
    overviewHi: 'अवसाद एक मूड डिसऑर्डर है जो उदासी और रुचि की हानि की लगातार भावना का कारण बनता है। इसे प्रमुख अवसादग्रस्तता विकार या नैदानिक ​​अवसाद भी कहा जाता है, यह आपके महसूस करने, सोचने और व्यवहार करने के तरीके को प्रभावित करता है और विभिन्न प्रकार की भावनात्मक और शारीरिक समस्याओं का कारण बन सकता है।',
    symptomsEn: '<ul><li>Feelings of sadness, tearfulness, emptiness or hopelessness</li><li>Angry outbursts, irritability or frustration, even over small matters</li><li>Loss of interest or pleasure in most or all normal activities</li><li>Sleep disturbances, including insomnia or sleeping too much</li><li>Tiredness and lack of energy</li><li>Anxiety, agitation or restlessness</li></ul>',
    symptomsHi: '<ul><li>उदासी, रोना, खालीपन या निराशा की भावनाएं</li><li>गुस्से में پھٹنا, चिड़चिड़ापन या निराशा, यहां तक ​​कि छोटे मामलों पर भी</li><li>अधिकांश या सभी सामान्य गतिविधियों में रुचि या आनंद की कमी</li><li>नींद में गड़बड़ी, जिसमें अनिद्रा या बहुत ज्यादा सोना शामिल है</li><li>थकान और ऊर्जा की कमी</li><li>चिंता, आंदोलन या बेचैनी</li></ul>',
    treatmentEn: 'Medication and psychotherapy are effective for most people with depression. Your primary care doctor or a psychiatrist can prescribe medications to relieve symptoms. Many people with depression also benefit from seeing a psychiatrist, psychologist or other mental health professional.',
    treatmentHi: 'अवसाद वाले زیادہ تر लोगों के लिए दवा और मनोचिकित्सा प्रभावी हैं। आपका प्राथमिक देखभाल चिकित्सक या एक मनोचिकित्सक लक्षणों से राहत के लिए दवाएं लिख सकता है। अवसाद वाले कई लोगों को मनोचिकित्सक, मनोवैज्ञानिक या अन्य मानसिक स्वास्थ्य पेशेवर से मिलने से भी फायदा होता है।',
    whenToSeeDoctorEn: 'If you feel depressed, make an appointment to see your doctor or mental health professional as soon as you can. If you\'re reluctant to seek treatment, talk to a friend or loved one, any health care professional, a faith leader, or someone else you trust.',
    whenToSeeDoctorHi: 'यदि आप उदास महसूस करते हैं, तो जितनी جلدی हो सके अपने डॉक्टर या मानसिक स्वास्थ्य पेशेवर से मिलने के लिए अपॉइंटमेंट लें। यदि आप علاج کرانے में संकोच कर रहे हैं, तो किसी دوست या عزیز, किसी भी स्वास्थ्य देखभाल पेशेवर, किसी धर्मगुरु, या किसी اور पर بھروسہ करने वाले شخص से बात करें।',
  },
  {
    id: 'anxiety',
    nameEn: 'Anxiety Disorder',
    nameHi: 'चिंता विकार',
    overviewEn: 'It\'s normal to feel anxious from time to time. But people with anxiety disorders frequently have intense, excessive and persistent worry and fear about everyday situations. Often, anxiety disorders involve repeated episodes of sudden feelings of intense anxiety and fear or terror that reach a peak within minutes (panic attacks).',
    overviewHi: 'समय-समय पर चिंतित महसूस करना सामान्य है। लेकिन चिंता विकारों वाले लोगों को अक्सर रोजमर्रा की स्थितियों के बारे में तीव्र, अत्यधिक और लगातार चिंता और भय होता है। अक्सर, चिंता विकारों में तीव्र चिंता और भय या आतंक की अचानक भावनाओं के बार-बार होने वाले एपिसोड शामिल होते हैं जो मिनटों के اندر चरम पर पहुंच जाते हैं (पैनिक अटैक)।',
    symptomsEn: '<ul><li>Feeling nervous, restless or tense</li><li>Having a sense of impending danger, panic or doom</li><li>Having an increased heart rate</li><li>Breathing rapidly (hyperventilation)</li><li>Sweating</li><li>Trembling</li><li>Feeling weak or tired</li></ul>',
    symptomsHi: '<ul><li>घबराहट, बेचैनी या तनाव महसूस करना</li><li>आसन्न खतरे, घबराहट या विनाश की भावना होना</li><li>हृदय गति का बढ़ना</li><li>तेजी से सांस लेना (हाइपरवेंटिलेशन)</li><li>पसीना आना</li><li>कांपना</li><li>कमजोर या थका हुआ महसूस करना</li></ul>',
    treatmentEn: 'The two main treatments for anxiety disorders are psychotherapy and medications. You may benefit most from a combination of the two. It may take some trial and error to discover which treatments work best for you.',
    treatmentHi: 'चिंता विकारों کے लिए दो मुख्य उपचार मनोचिकित्सा और दवाएं हैं। आपको दोनों के संयोजन से سب سے زیادہ فائدہ ہو सकता ہے۔ यह पता लगाने में کچھ परीक्षण और त्रुटि लग सकती है कि आपके लिए कौन से उपचार سب से अच्छा काम करते हैं।',
    whenToSeeDoctorEn: 'See your doctor if you feel like you\'re worrying too much and it\'s interfering with your work, relationships or other parts of your life, your fear, worry or anxiety is upsetting to you and difficult to control, or you feel depressed, have trouble with alcohol or drug use, or have other mental health concerns along with anxiety.',
    whenToSeeDoctorHi: 'यदि आपको लगता है कि आप बहुत زیادہ चिंता कर रहे हैं और यह आपके काम, रिश्तों या आपके જીવન के अन्य हिस्सों में हस्तक्षेप कर रहा है, आपका डर, चिंता या बेचैनी आपको परेशान कर रही है और नियंत्रित करना मुश्किल है, या आप उदास महसूस करते हैं, शराब या नशीली दवाओं के उपयोग में परेशानी होती है, या चिंता के साथ अन्य मानसिक स्वास्थ्य संबंधी चिंताएं हैं, तो अपने डॉक्टर से मिलें।',
  },
  {
    id: 'allergies',
    nameEn: 'Allergies',
    nameHi: 'एलर्जी',
    overviewEn: 'Allergies occur when your immune system reacts to a foreign substance — such as pollen, bee venom or pet dander — or a food that doesn\'t cause a reaction in most people.',
    overviewHi: 'एलर्जी तब होती है जब आपकी प्रतिरक्षा प्रणाली किसी बाहरी पदार्थ - जैसे पराग, मधुमक्खी का जहर या पालतू जानवरों की रूसी - या ऐसे भोजन पर प्रतिक्रिया करती है जो अधिकांश लोगों में प्रतिक्रिया का कारण नहीं बनता है।',
    symptomsEn: '<ul><li>Sneezing</li><li>Itching of the nose, eyes or roof of the mouth</li><li>Runny, stuffy nose</li><li>Watery, red or swollen eyes (conjunctivitis)</li><li>Tingling in the mouth</li><li>Swelling of the lips, tongue, face or throat</li><li>Hives</li></ul>',
    symptomsHi: '<ul><li>छींकना</li><li>नाक, आंखों या मुंह के ऊपरी हिस्से में खुजली</li><li>बहती, भरी हुई नाक</li><li>पानी वाली, लाल या सूजी हुई آنکھیں (नेत्रश्लेष्मलाशोथ)</li><li>मुंह में झुनझुनी</li><li>होंठ, जीभ, चेहरे या गले की सूजन</li><li>पित्ती</li></ul>',
    treatmentEn: 'Allergy treatment includes: Allergen avoidance, Medications to reduce symptoms, and Immunotherapy (allergy shots).',
    treatmentHi: 'एलर्जी के उपचार में शामिल हैं: એલર્જન से बचाव, लक्षणों को कम करने के लिए दवाएं, और इम्यूनोथेरेपी (एलर्जी शॉट्स)।',
    whenToSeeDoctorEn: 'See a doctor if you have symptoms you think might be caused by an allergy, and over-the-counter allergy medications don\'t provide enough relief. If you have symptoms after starting a new medication, call the doctor who prescribed it right away.',
    whenToSeeDoctorHi: 'यदि आपके पास ऐसे लक्षण हैं जो आपको लगता है कि الرجی की वजह से हो सकते हैं, और ओवर-द-काउंटर एलर्जी की दवाएं काफी राहत नहीं देती हैं, तो डॉक्टर से मिलें। यदि आपको कोई نئی दवा शुरू करने के बाद लक्षण दिखाई देते हैं, तो उसे تجویز करने वाले डॉक्टर को तुरंत फोन करें।',
  },
  {
    id: 'flu',
    nameEn: 'Influenza (Flu)',
    nameHi: 'इन्फ्लूएंजा (फ्लू)',
    overviewEn: 'Influenza is a viral infection that attacks your respiratory system — your nose, throat and lungs. For most people, the flu resolves on its own. But sometimes, influenza and its complications can be deadly.',
    overviewHi: 'इन्फ्लूएंजा एक वायरल संक्रमण है जो आपके श्वसन तंत्र - आपकी नाक, गले और फेफड़ों पर हमला करता है। अधिकांश लोगों के लिए, फ्लू अपने आप ٹھیک हो जाता ہے۔ लेकिन कभी-कभी, इन्फ्लूएंजा और इसकी जटिलताएँ घातक हो सकती हैं।',
    symptomsEn: '<ul><li>Fever</li><li>Aching muscles</li><li>Chills and sweats</li><li>Headache</li><li>Dry, persistent cough</li><li>Shortness of breath</li><li>Tiredness and weakness</li><li>Runny or stuffy nose</li></ul>',
    symptomsHi: '<ul><li>बुखार</li><li>मांसपेशियों में दर्द</li><li>ठंड लगना और पसीना आना</li><li>सिरदर्द</li><li>सूखी, लगातार खांसी</li><li>सांस लेने में तकलीफ</li><li>थकान और کمزوری</li><li>बहती या बंद नाक</li></ul>',
    treatmentEn: 'Usually, you\'ll need nothing more than rest and plenty of fluids to treat the flu. But if you have a severe infection or are at higher risk of complications, your doctor may prescribe an antiviral drug, such as oseltamivir (Tamiflu), zanamivir (Relenza), peramivir (Rapivab) or baloxavir (Xofluza).',
    treatmentHi: 'आमतौर पर, आपको फ्लू के इलाज के लिए आराम और بہت सारे तरल पदार्थों से زیادہ कुछ नहीं चाहिए होगा। लेकिन अगर आपको गंभीर संक्रमण है या जटिलताओं का खतरा अधिक है, तो आपका डॉक्टर एक एंटीवायरल दवा लिख सकता है, जैसे कि oseltamivir (Tamiflu), zanamivir (Relenza), peramivir (Rapivab) या baloxavir (Xofluza)۔',
    whenToSeeDoctorEn: 'Most people who get the flu can treat themselves at home and don\'t need to see a doctor. If you have flu symptoms and are at risk of complications, see your doctor right away.',
    whenToSeeDoctorHi: 'फ्लू से पीड़ित अधिकांश लोग घर पर अपना इलाज कर सकते हैं और उन्हें डॉक्टर को दिखाने की आवश्यकता नहीं होती है। यदि आपको फ्लू के लक्षण हैं और जटिलताओं का खतरा है, तो तुरंत अपने डॉक्टर से मिलें।',
  },
  {
    id: 'pneumonia',
    nameEn: 'Pneumonia',
    nameHi: 'निमोनिया',
    overviewEn: 'Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm or pus, fever, chills, and difficulty breathing.',
    overviewHi: 'निमोनिया एक संक्रमण है जो एक या दोनों फेफड़ों में वायु थैली को फुला देता है। वायु थैली द्रव या मवाद से भर सकती है, जिससे बलगम या मवाद वाली खांसी, بخار, ठंड लगना, और सांस लेने में कठिनाई होती ہے۔',
    symptomsEn: '<ul><li>Chest pain when you breathe or cough</li><li>Confusion or changes in mental awareness (in adults age 65 and older)</li><li>Cough, which may produce phlegm</li><li>Fatigue</li><li>Fever, sweating and shaking chills</li><li>Nausea, vomiting or diarrhea</li><li>Shortness of breath</li></ul>',
    symptomsHi: '<ul><li>सांस लेने या खांसने पर سینے में दर्द</li><li>भ्रम या मानसिक जागरूकता में परिवर्तन (65 वर्ष और اس से अधिक उम्र के वयस्कों में)</li><li>खांसी, जिससे बलगम पैदा हो सकता है</li><li>थकान</li><li>बुखार, पसीना और कंपकंपी वाली ठंड</li><li>मतली, उल्टी या दस्त</li><li>सांस लेने में तकलीफ</li></ul>',
    treatmentEn: 'Treatment for pneumonia involves curing the infection and preventing complications. Specific treatments depend on the type and severity of your pneumonia, your age and your overall health. The options include antibiotics, cough medicine, and fever reducers/pain relievers.',
    treatmentHi: 'निमोनिया के उपचार में انفیکشن کو ٹھیک کرنا और जटिलताओं को रोकना शामिल ہے۔ विशिष्ट उपचार आपके निमोनिया के प्रकार और गंभीरता, आपकी उम्र और आपके समग्र स्वास्थ्य पर निर्भर करते ہیں۔ विकल्पों में اینٹی بائیوٹکس, کھانسی की દવા, और بخار کم करने वाली/درد निवारक शामिल ہیں۔',
    whenToSeeDoctorEn: 'See your doctor if you have difficulty breathing, chest pain, persistent fever of 102 F (39 C) or higher, or a persistent cough, especially if you\'re coughing up pus.',
    whenToSeeDoctorHi: 'यदि आपको सांस लेने में कठिनाई, سینے में दर्द, 102 F (39 C) या उससे अधिक का लगातार بخار, या लगातार खांसी ہو, خاص طور पर अगर آپ کو کھانسی में پیپ آ रही ہو तो अपने डॉक्टर से मिलें।',
  },
  {
    id: 'gastroenteritis',
    nameEn: 'Viral Gastroenteritis (Stomach Flu)',
    nameHi: 'वायरल गैस्ट्रोएंटेराइटिस (पेट का फ्लू)',
    overviewEn: 'Gastroenteritis is an inflammation of the lining of the intestines caused by a virus, bacteria or parasites. It\'s often called the "stomach flu," although it is not caused by the influenza virus.',
    overviewHi: 'गैस्ट्रोएंटेराइटिस आंतों की परत की सूजन है जो वायरस, बैक्टीरिया या परجیویوں की वजह से होती ہے۔ इसे अक्सर "पेट का فلو" कहा जाता है, हालांकि यह इन्फ्लूएंजा वायरस की वजह से नहीं होता ہے۔',
    symptomsEn: '<ul><li>Watery, usually nonbloody diarrhea</li><li>Abdominal cramps and pain</li><li>Nausea, vomiting or both</li><li>Occasional muscle aches or headache</li><li>Low-grade fever</li></ul>',
    symptomsHi: '<ul><li>पानीदार, आमतौर पर बिना खून वाला दस्त</li><li>पेट में ऐंठन और दर्द</li><li>मतली, उल्टी या दोनों</li><li>कभी-कभी मांसपेशियों में दर्द या सिरदर्द</li><li>हल्का बुखार</li></ul>',
    treatmentEn: 'There\'s often no specific medical treatment for viral gastroenteritis. Antibiotics aren\'t effective against viruses, and overusing them can contribute to the development of antibiotic-resistant strains of bacteria. Treatment usually consists of self-care measures, such as staying hydrated.',
    treatmentHi: 'वायरल गैस्ट्रोएंटेराइटिस के लिए अक्सर कोई विशिष्ट चिकित्सा उपचार नहीं होता ہے۔ एंटीबायोटिक्स वायरस के खिलाफ प्रभावी नहीं होते हैं, और उनका अत्यधिक उपयोग बैक्टीरिया के एंटीबायोटिक-प्रतिरोधी उपभेदों के विकास में योगदान दे सकता ہے۔ उपचार में आमतौर पर स्वयं की देखभाल के उपाय شامل होते हैं, जैसे कि हाइड्रेटेड रहना।',
    whenToSeeDoctorEn: 'See a doctor if you are unable to keep liquids down for 24 hours, have been vomiting for more than two days, are vomiting blood, are dehydrated, notice blood in your bowel movements, or have a fever above 104 F (40 C).',
    whenToSeeDoctorHi: 'यदि आप 24 घंटे तक तरल पदार्थ नहीं पी पा रहे हैं, दो دن से ज्यादा समय से उल्टी कर रहे हैं, खून की उल्टी कर रहे हैं, निर्जलित हैं, अपने मल में खून देखते हैं, या 104 F (40 C) से ऊपर बुखार है, तो डॉक्टर से ملیں۔',
  },
  {
    id: 'copd',
    nameEn: 'COPD (Chronic Obstructive Pulmonary Disease)',
    nameHi: 'सीओपीडी (क्रॉनिक ऑब्सट्रक्टिव पल्मोनरी डिजीज)',
    overviewEn: 'Chronic obstructive pulmonary disease (COPD) is a chronic inflammatory lung disease that causes obstructed airflow from the lungs. Emphysema and chronic bronchitis are the two most common conditions that contribute to COPD.',
    overviewHi: 'क्रॉनिक ऑब्सट्रक्टिव पल्मोनरी डिजीज (COPD) एक पुरानी सूजन वाली फेफड़ों की बीमारी है जो फेफड़ों से बाधित वायु प्रवाह का कारण बनती ہے۔ वातस्फीति और क्रॉनिक ब्रोंकाइटिस दो सबसे आम स्थितियां हैं जो COPD में योगदान करती हैं।',
    symptomsEn: '<ul><li>Shortness of breath, especially during physical activities</li><li>Wheezing</li><li>Chest tightness</li><li>A chronic cough that may produce mucus (sputum) that may be clear, white, yellow or greenish</li><li>Frequent respiratory infections</li><li>Lack of energy</li><li>Unintended weight loss (in later stages)</li></ul>',
    symptomsHi: '<ul><li>सांस की तकलीफ, खासकर शारीरिक गतिविधियों के दौरान</li><li>घरघराहट</li><li>सीने में जकड़न</li><li>एक पुरानी खांसी जो बलगम (थूक) पैदा कर सकती है जो स्पष्ट, सफेद, पीला या हरा हो सकता है</li><li>बार-बार श्वसन संक्रमण</li><li>ऊर्जा की कमी</li><li>अनपेक्षित वजन घटना (बाद के चरणों में)</li></ul>',
    treatmentEn: 'Many people with COPD have mild forms of the disease for which little therapy is needed other than smoking cessation. For more advanced stages of disease, effective therapy is available that can control symptoms, slow progression, reduce your risk of complications and exacerbations, and improve your ability to lead an active life.',
    treatmentHi: 'सीओपीडी वाले कई लोगों को बीमारी के ہلکے रूप होते हैं, जिसके लिए धूम्रपान छोड़ने के अलावा बहुत कम चिकित्सा की आवश्यकता होती है। بیماری के زیادہ উন্নত مراحل के लिए, प्रभावी चिकित्सा उपलब्ध है जो लक्षणों को नियंत्रित कर सकती है, प्रगति को धीमा कर सकती है, जटिलताओं और तीव्रता के जोखिम को कम कर सकती है, और एक सक्रिय जीवन जीने की आप की क्षमता में सुधार कर सकती ہے۔',
    whenToSeeDoctorEn: 'See your doctor if your symptoms are not improving with treatment or are getting worse, or if you notice any symptoms of an infection, such as a fever or a change in your sputum.',
    whenToSeeDoctorHi: 'यदि आपके लक्षण उपचार से बेहतर नहीं हो रहे हैं या खराब हो रहे हैं, या यदि आप संक्रमण के कोई लक्षण देखते हैं, जैसे कि बुखार या आपके थूक में परिवर्तन, तो अपने डॉक्टर से मिलें।',
  },
  {
    id: 'bronchitis',
    nameEn: 'Bronchitis',
    nameHi: 'ब्रोंकाइटिस',
    overviewEn: 'Bronchitis is an inflammation of the lining of your bronchial tubes, which carry air to and from your lungs. People who have bronchitis often cough up thickened mucus, which can be discolored. Bronchitis may be either acute or chronic.',
    overviewHi: 'ब्रोंकाइटिस आपके ब्रोन्कियल ट्यूबों की परत की सूजन है, जो आपके फेफड़ों तक हवा ले जाती हैं और उनसे हवा ले जाती हैं। ब्रोंकाइटिस वाले लोग अक्सर گاڑھا بلغم کھانستے हैं, જે رنگین हो सकता ہے۔ ब्रोंकाइटिस या तो तीव्र या دائمی ہو सकता ہے۔',
    symptomsEn: '<ul><li>Cough</li><li>Production of mucus (sputum), which can be clear, white, yellowish-gray or green in color</li><li>Fatigue</li><li>Shortness of breath</li><li>Slight fever and chills</li><li>Chest discomfort</li></ul>',
    symptomsHi: '<ul><li>खांसी</li><li>बलगम (थूक) का उत्पादन, जो स्पष्ट, सफेद, पीले-भूरे या हरे रंग का हो सकता है</li><li>थकान</li><li>सांस लेने में तकलीफ</li><li>हल्का बुखार और ठंड लगना</li><li>सीने में तकलीफ</li></ul>',
    treatmentEn: 'Treatment for most cases of acute bronchitis is aimed at relieving symptoms. This may include cough medicines, rest, and plenty of fluids. Chronic bronchitis treatment is aimed at relieving symptoms and may include medications, pulmonary rehabilitation, and oxygen therapy.',
    treatmentHi: 'तीव्र ब्रोंकाइटिस के अधिकांश मामलों का उपचार लक्षणों से राहत दिलाने के उद्देश्य से किया जाता है। इसमें खांसी की दवाएं, आराम और बहुत सारे तरल पदार्थ शामिल हो सकते हैं। क्रॉनिक ब्रोंकाइटिस का उपचार लक्षणों से राहत दिलाने के उद्देश्य से किया जाता है और इसमें दवाएं, पल्मोनरी पुनर्वास और ऑक्सीजन थेरेपी शामिल हो सकती है।',
    whenToSeeDoctorEn: 'See your doctor if your cough lasts more than three weeks, prevents you from sleeping, is accompanied by fever higher than 100.4 F (38 C), produces discolored mucus, produces blood, or is associated with wheezing or shortness of breath.',
    whenToSeeDoctorHi: 'यदि आपकी खांसी तीन सप्ताह से अधिक समय तक रहती है, आपको सोने से रोकती है, 100.4 F (38 C) से अधिक बुखार के साथ होती है, रंगीन बलगम पैदा करती है, खून पैदा करती है, या گھرघراہٹ या सांस की तकलीफ से जुड़ी है, तो अपने डॉक्टर से मिलें।',
  },
  {
    id: 'kidney-stones',
    nameEn: 'Kidney Stones',
    nameHi: 'गुर्दे की पथरी',
    overviewEn: 'Kidney stones (also called renal calculi, nephrolithiasis or urolithiasis) are hard deposits made of minerals and salts that form inside your kidneys. Diet, excess body weight, some medical conditions, and certain supplements and medications are among the many causes of kidney stones.',
    overviewHi: 'गुर्दे की पथरी (जिसे रीनल ক্যালকুলি, नेफ्रोलिथियासिस या यूरोलिथियासिस भी कहा जाता है) खनिजों और लवणों से बने कठोर जमाव होते हैं जो आपके गुर्दे के अंदर बनते हैं। आहार, अधिक शरीर का वजन, कुछ चिकित्सा स्थितियां, और कुछ पूरक और दवाएं گردے کی पथरी के कई कारणों में से हैं।',
    symptomsEn: '<ul><li>Severe, sharp pain in the side and back, below the ribs</li><li>Pain that radiates to the lower abdomen and groin</li><li>Pain that comes in waves and fluctuates in intensity</li><li>Pain or burning sensation while urinating</li><li>Pink, red or brown urine</li><li>Cloudy or foul-smelling urine</li></ul>',
    symptomsHi: '<ul><li>पसलियों के नीचे, کنارے और پیٹھ में شدید, تیز درد</li><li>दर्द जो निचले पेट और कमर तक پھیلتا है</li><li>दर्द जो लहरों में आता है और तीव्रता में उतार-चढ़ाव करता है</li><li>पेशाब करते समय درد या جلن</li><li>गुलाबी, लाल या भूरा मूत्र</li><li>बादलदार या दुर्गंधयुक्त मूत्र</li></ul>',
    treatmentEn: 'Treatment for small stones may be as simple as drinking water and taking pain relievers. For larger stones, treatments might include medical procedures to break up or remove them. This includes extracorporeal shock wave lithotripsy (ESWL) or surgery.',
    treatmentHi: 'छोटे पत्थरों का इलाज पानी पीने और درد निवारक लेने जितना सरल हो सकता ہے۔ بڑے पत्थरों के लिए, उपचार में उन्हें तोड़ने या हटाने के लिए طبی प्रक्रियाएं शामिल हो सकती हैं। इसमें एक्स्ट्राकॉर्पोरियल शॉक वेव लिथोट्रिप्सी (ESWL) या سرجری शामिल ہے۔',
    whenToSeeDoctorEn: 'Make an appointment with your doctor if you have any signs and symptoms that worry you. Seek immediate medical attention if you experience pain so severe that you can\'t sit still or find a comfortable position, pain accompanied by nausea and vomiting, pain accompanied by fever and chills, or blood in your urine.',
    whenToSeeDoctorHi: 'यदि आपके पास कोई संकेत और लक्षण हैं जो आपको चिंतित करते हैं तो अपने डॉक्टर से अपॉइंटमेंट लें। यदि आप इतना شدید درد अनुभव करते हैं कि आप स्थिर नहीं बैठ सकते या आरामदायक स्थिति नहीं ڈھونڈ सकते, मतली और उल्टी के साथ درد, بخار और ठंड के साथ درد, या आपके پیشاب में खून ہے तो तत्काल طبی सहायता लें।',
  },
  {
    id: 'anemia',
    nameEn: 'Anemia',
    nameHi: 'एनीमिया (रक्ताल्पता)',
    overviewEn: 'Anemia is a condition in which you lack enough healthy red blood cells to carry adequate oxygen to your body\'s tissues. Having anemia, also referred to as low hemoglobin, can make you feel tired and weak.',
    overviewHi: 'एनीमिया एक ऐसी स्थिति है जिसमें आपके शरीर के ऊतकों तक पर्याप्त ऑक्सीजन ले जाने के लिए पर्याप्त स्वस्थ लाल रक्त कोशिकाओं की कमी होती है। एनीमिया होने पर, जिसे düşük हीमोग्लोबिन भी कहा जाता है, आपको थका हुआ और कमजोर महसूस करा सकता ہے۔',
    symptomsEn: '<ul><li>Fatigue</li><li>Weakness</li><li>Pale or yellowish skin</li><li>Irregular heartbeats</li><li>Shortness of breath</li><li>Dizziness or lightheadedness</li><li>Chest pain</li><li>Cold hands and feet</li></ul>',
    symptomsHi: '<ul><li>थकान</li><li>कमजोरी</li><li>पीली त्वचा</li><li>अनियमित दिल की धड़कन</li><li>सांस लेने में तकलीफ</li><li>चक्कर आना या हल्का-फुल्का महसूस करना</li><li>सीने में दर्द</li><li>ठंडे हाथ और पैर</li></ul>',
    treatmentEn: 'Anemia treatment depends on the cause. It can range from taking supplements to undergoing medical procedures. Treatments might include iron supplements for iron deficiency anemia, vitamin B-12 shots, or blood transfusions.',
    treatmentHi: 'एनीमिया का इलाज वजह पर منحصر ہے۔ यह सप्लीमेंट्स लेने से لے कर طبی प्रक्रियाएं کروانے तक ہو सकता ہے۔ उपचार में آئرن की कमी वाले एनीमिया के لیے آئرن سپلیمنٹس, وٹامن B-12 شاٹس, या खून चढ़ाना शामिल हो सकता ہے۔',
    whenToSeeDoctorEn: 'See a doctor if you have unexplained fatigue or other signs of anemia. Some anemias, such as iron deficiency anemia or vitamin B-12 anemia, are common. But don\'t assume that if you\'re tired, you must be anemic.',
    whenToSeeDoctorHi: 'यदि आपको अस्पष्टीकृत थकान या एनीमिया के अन्य लक्षण हैं तो डॉक्टर से मिलें। कुछ एनीमिया, जैसे कि आयरन की कमी वाला एनीमिया या विटामिन बी-12 एनीमिया, आम हैं। लेकिन यह نہ مانیں کہ अगर आप تھکے ہوئے ہیں, तो آپ کو انیمیا होना चाहिए।',
  },
  {
    id: 'osteoporosis',
    nameEn: 'Osteoporosis',
    nameHi: 'ऑस्टियोपोरोसिस',
    overviewEn: 'Osteoporosis causes bones to become weak and brittle — so brittle that a fall or even mild stresses such as bending over or coughing can cause a fracture. Osteoporosis-related fractures most commonly occur in the hip, wrist or spine.',
    overviewHi: 'ऑस्टियोपोरोसिस हड्डियों को कमजोर और भंगुर बना देता है - इतना भंगुर कि गिरने या ہلکے तनाव जैसे कि جھکने या کھانسنے से भी فریکچر ہو सकता ہے۔ ऑस्टियोपोरोसिस से संबंधित फ्रैक्चर सबसे आम तौर पर کولہے, کلائی या ریڑھ की हड्डी में होते ہیں۔',
    symptomsEn: 'There typically are no symptoms in the early stages of bone loss. But once your bones have been weakened by osteoporosis, you might have signs and symptoms that include: Back pain, caused by a fractured or collapsed vertebra, loss of height over time, a stooped posture, a bone that breaks much more easily than expected.',
    symptomsHi: 'हड्डियों के नुकसान के शुरुआती चरणों में आमतौर पर कोई लक्षण नहीं होते हैं। लेकिन एक बार जब आपकी हड्डियां ऑस्टियोपोरोसिस से कमजोर हो जाती हैं, तो आप के पास ऐसे संकेत और लक्षण हो सकते हैं जिनमें शामिल हैं: کمر درد, जो टूटी हुई या ढह गई कशेरुका के कारण होता है, समय के साथ قد में कमी, झुकी हुई मुद्रा, एक हड्डी जो अपेक्षा से کہیں زیادہ آسانی से टूट جاتی ہے۔',
    treatmentEn:"Treatment recommendations are often based on an estimate of your risk of breaking a bone in the next 10 years using information such as a bone density test. If the risk isn't high, treatment might not include medication and might focus instead on lifestyle, safety and fall-prevention measures.",
    treatmentHi:"उपचार की سفارشات अक्सर हड्डी घनत्व परीक्षण जैसी जानकारी का उपयोग करके अगले 10 वर्षों में ہڈی ٹوٹنے के आप के خطرے के تخمینے पर आधारित होती हैं। यदि जोखिम अधिक नहीं है, तो उपचार में दवा शामिल नहीं हो सकती है और इसके बजाय जीवनशैली, सुरक्षा और गिरने से बचाव के اقدامات پر ध्यान केंद्रित किया जा सकता ہے۔",
    whenToSeeDoctorEn: 'You might want to talk to your doctor about osteoporosis if you went through early menopause, took corticosteroids for several months at a time, or either of your parents had hip fractures.',
    whenToSeeDoctorHi: 'यदि आप को جلدی रजोनिवृत्ति हुई ہو, کئی مہینوں तक कोर्टिकोस्टेरॉइड्स लिए ہوں, या आपके माता-पिता में से किसी को کولہے کا فریکچر ہوا हो तो आप ऑस्टियोपोरोसिस के बारे में अपने डॉक्टर से बात करना चाहेंगे।',
  },
  {
    id: 'gerd',
    nameEn: 'GERD',
    nameHi: 'गर्ड (गैस्ट्रोएसोफेगल रिफ्लक्स डिजीज)',
    overviewEn: 'Gastroesophageal reflux disease (GERD) occurs when stomach acid frequently flows back into the tube connecting your mouth and stomach (esophagus). This backwash (acid reflux) can irritate the lining of your esophagus.',
    overviewHi: 'गैस्ट्रोएसोफेगल रिफ्लक्स रोग (GERD) तब होता है जब पेट का एसिड अक्सर आपके मुंह और پیٹ ( अन्नप्रणाली) को جوڑنے वाली ट्यूब में वापस بہتا ہے۔ यह बैकवाश (एसिड रिफ्लक्स) आपके अन्नप्रणाली की परत को परेशान कर सकता ہے۔',
    symptomsEn: '<ul><li>A burning sensation in your chest (heartburn), usually after eating, which might be worse at night</li><li>Chest pain</li><li>Difficulty swallowing</li><li>Regurgitation of food or sour liquid</li><li>Sensation of a lump in your throat</li></ul>',
    symptomsHi: '<ul><li>आपके सीने में जलन (हार्टबर्न), आमतौर पर खाने के बाद, जो رات کو بدتر ہو سکتی है</li><li>सीने में दर्द</li><li>निगलने में कठिनाई</li><li>भोजन या खट्टे तरल का regurgitation</li><li>आपके गले में एक गांठ की सनसनी</li></ul>',
    treatmentEn: 'Treatment for GERD may include lifestyle changes, medications, or surgery. Lifestyle changes such as losing excess weight, eating smaller meals, and avoiding foods that trigger heartburn can help. Medications include antacids, H2 blockers, and proton pump inhibitors.',
    treatmentHi: 'गर्ड के उपचार में जीवनशैली में बदलाव, दवाएं, या सर्जरी शामिल हो सकती है। जीवनशैली में बदलाव जैसे कि अतिरिक्त वजन कम करना, छोटे भोजन करना, और उन खाद्य पदार्थों से बचना जो नाराज़गी को متحرک کرتے ہیں, मदद कर सकते हैं। दवाओं में एंटासिड, H2 ब्लॉकर्स, और प्रोटॉन पंप अवरोधक शामिल हैं।',
    whenToSeeDoctorEn: 'See your doctor if you experience severe or frequent GERD symptoms or use over-the-counter medications for heartburn more than twice a week.',
    whenToSeeDoctorHi: 'यदि आप गंभीर या बार-बार गर्ड के लक्षण अनुभव करते हैं या सप्ताह में दो बार से अधिक नाराज़गी के लिए ओवर-द-काउंटर दवाओं का उपयोग करते हैं तो अपने डॉक्टर से मिलें।',
  },
  {
    id: 'ibs',
    nameEn: 'Irritable Bowel Syndrome (IBS)',
    nameHi: 'इरिटेबल बॉवेल सिंड्रोम (आईबीएस)',
    overviewEn: 'Irritable bowel syndrome (IBS) is a common disorder that affects the large intestine. Signs and symptoms include cramping, abdominal pain, bloating, gas, and diarrhea or constipation, or both. IBS is a chronic condition that you\'ll need to manage long term.',
    overviewHi: 'इरिटेबल बॉवेल सिंड्रोम (आईबीएस) एक आम विकार है जो बड़ी आंत को प्रभावित करता ہے۔ संकेतों और लक्षणों में ऐंठन, पेट दर्द, सूजन, गैस, और दस्त या कब्ज, या दोनों शामिल हैं। आईबीएस एक पुरानी स्थिति है जिसे आप को लंबे समय तक प्रबंधित करने की आवश्यकता होगी।',
    symptomsEn: '<ul><li>Abdominal pain, cramping or bloating that is related to passing a bowel movement</li><li>Changes in appearance of bowel movement</li><li>Changes in how often you are having a bowel movement</li><li>Bloating, increased gas or mucus in the stool</li></ul>',
    symptomsHi: '<ul><li>पेट दर्द, ऐंठन या सूजन जो मल त्याग से संबंधित है</li><li>मल की ظاہری شکل में परिवर्तन</li><li>आप कितनी बार मल त्याग कर रहे हैं इस में परिवर्तन</li><li>मल में सूजन, गैस में वृद्धि या बलगम</li></ul>',
    treatmentEn: 'Treatment of IBS focuses on relieving symptoms so that you can live as normally as possible. Mild signs and symptoms can often be controlled by managing stress and by making changes in your diet and lifestyle. Your doctor might also suggest medications.',
    treatmentHi: 'आईबीएस का علاج लक्षणों से राहत दिलाने पर केंद्रित है ताकि आप यथासंभव सामान्य रूप से जी सकें। ہلके संकेतों और लक्षणों को अक्सर तनाव का प्रबंधन करके और अपने आहार और জীবনशैली में बदलाव करके नियंत्रित किया जा सकता ہے۔ आपका डॉक्टर दवाएं भी सुझा सकता ہے۔',
    whenToSeeDoctorEn: 'See your doctor if you have a persistent change in bowel habits or other signs or symptoms of IBS. They can indicate a more serious condition, such as colon cancer.',
    whenToSeeDoctorHi: 'यदि आपके मल त्याग की आदतों में लगातार बदलाव या आईबीएस के अन्य संकेत या लक्षण हैं तो ਆਪਣੇ ڈاکٹر से मिलें। वे ਇੱਕ अधिक गंभीर स्थिति का संकेत दे सकते हैं, जैसे कि पेट का कैंसर।',
  },
  {
    id: 'chickenpox',
    nameEn: 'Chickenpox',
    nameHi: 'छोटी माता (चिकनपॉक्स)',
    overviewEn: 'Chickenpox is an infection caused by the varicella-zoster virus. It causes an itchy rash with small, fluid-filled blisters. Chickenpox is highly contagious to people who haven\'t had the disease or been vaccinated against it.',
    overviewHi: 'चिकनपॉक्स ਵੈਰੀਸੈਲਾ-ਜ਼ੋਸਟਰ ਵਾਇਰਸ ਕਾਰਨ ਹੋਣ ਵਾਲੀ ਲਾਗ ਹੈ। ਇਸ ਨਾਲ ਖંજવાળા ਦਾਣੇ ਨਿਕਲਦੇ ਹਨ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਛੋਟੇ, ਤਰਲ ਭਰੇ ਛਾਲੇ ਹੁੰਦੇ ਹਨ। ਜਿਨ੍ਹਾਂ ਲੋਕਾਂ ਨੂੰ यह बीमारी नहीं हुई है या इसके खिलाफ टीका नहीं लगाया गया है, उनके लिए चिकनपॉक्स अत्यधिक संक्रामक है।',
    symptomsEn: '<ul><li>An itchy rash of blisters</li><li>Fever</li><li>Loss of appetite</li><li>Headache</li><li>Tiredness and a general feeling of being unwell (malaise)</li></ul>',
    symptomsHi: '<ul><li>ਛਾਲੇ ਵਾਲੇ ਖંજવાળા ਦਾਣੇ</li><li>बुखार</li><li>भूख न लगना</li><li>सिरदर्द</li><li>थकान और आम तौर पर अस्वस्थ महसूस करना (अस्वस्थता)</li></ul>',
    treatmentEn: 'In otherwise healthy children, chickenpox typically needs no medical treatment. Your doctor may prescribe an antihistamine to relieve itching. For people who are at high risk of complications, doctors sometimes prescribe medications to shorten the length of the infection and to help reduce the risk of complications.',
    treatmentHi: 'अन्यथा स्वस्थ बच्चों में, चिकनपॉक्स को आमतौर पर किसी चिकित्सा उपचार की आवश्यकता नहीं होती है। आपका डॉक्टर खुजली से राहत के लिए एक एंटीહિస్టਾਮિન लिख सकता है। जिन लोगों को जटिलताओं کا خطرہ अधिक होता है, उनके لیے डॉक्टर कभी-कभी संक्रमण की अवधि को कम करने और जटिलताओं के जोखिम को कम करने में مدد के लिए दवाएं लिखते हैं।',
    whenToSeeDoctorEn: 'See a doctor if the rash spreads to one or both eyes, the rash gets very red, warm or tender, or you experience dizziness, disorientation, rapid heartbeat, shortness of breath, tremors, loss of muscle coordination, or a worsening cough.',
    whenToSeeDoctorHi: 'यदि दाने एक या दोनों आंखों में फैल जाते हैं, दाने बहुत लाल, गर्म या कोमल हो जाते हैं, या आप को चक्कर आना, भटकाव, तेज धड़कन, सांस की تکلیف, कंपकंपी, मांसपेशियों के समन्वय का فقدان, या बिगड़ती खांसी का अनुभव होता है, तो डॉक्टर से मिलें।',
  },
  {
    id: 'malaria',
    nameEn: 'Malaria',
    nameHi: 'मलेरिया',
    overviewEn: 'Malaria is a disease caused by a parasite. The parasite is transmitted to humans through the bites of infected mosquitoes. People who have malaria typically feel very sick with a high fever and shaking chills.',
    overviewHi: 'मलेरिया एक परजीवी के कारण होने वाली بیماری ہے۔ यह परजीवी संक्रमित मच्छरों के کاٹنے से मनुष्यों में फैलता ہے۔ मलेरिया से पीड़ित लोग आमतौर पर तेज بخार और कंपकंपी के साथ बहुत بیمار महसूस करते ہیں۔',
    symptomsEn: '<ul><li>Fever</li><li>Chills</li><li>General feeling of discomfort</li><li>Headache</li><li>Nausea and vomiting</li><li>Diarrhea</li><li>Abdominal pain</li><li>Muscle or joint pain</li></ul>',
    symptomsHi: '<ul><li>बुखार</li><li>कंपकंपी</li><li>अस्वस्थता की सामान्य भावना</li><li>सिरदर्द</li><li>मतली और उल्टी</li><li>दस्त</li><li>पेट दर्द</li><li>मांसपेशियों या जोड़ों का दर्द</li></ul>',
    treatmentEn: 'Malaria is treated with prescription drugs to kill the parasite. The types of drugs and the length of treatment will vary, depending on the type of malaria parasite you have, the severity of your symptoms, your age, and whether you are pregnant.',
    treatmentHi: 'मलेरिया का इलाज پرजीवी को मारने के लिए निर्धारित दवाओं से किया जाता है। दवाओं के प्रकार और علاج की لمبائی आपके पास किस प्रकार का मलेरिया परजीवी है, आपके लक्षणों की गंभीरता, आपकी उम्र, और क्या आप गर्भवती ہیں, इस पर निर्भर करेगी।',
    whenToSeeDoctorEn: 'Talk to your doctor if you experience a fever while living in or after traveling to a high-risk malaria region. If you have severe symptoms, seek emergency medical attention.',
    whenToSeeDoctorHi: 'यदि आप किसी उच्च जोखिम वाले मलेरिया क्षेत्र में रहते ہوئے या यात्रा करने के बाद بخार کا تجربہ करते हैं तो अपने डॉक्टर से बात करें। यदि आपके लक्षण गंभीर हैं, तो आपातकालीन चिकित्सा सहायता लें।',
  },
  {
    id: 'tuberculosis',
    nameEn: 'Tuberculosis (TB)',
    nameHi: 'तपेदिक (टीबी)',
    overviewEn: 'Tuberculosis (TB) is a serious infectious disease that mainly affects the lungs. The bacteria that cause tuberculosis are spread from one person to another through tiny droplets released into the air via coughs and sneezes.',
    overviewHi: 'तपेदिक (टीबी) एक गंभीर संक्रामक रोग है जो मुख्य طور पर फेफड़ों को متاثر کرتا ہے۔ तपेदिक का कारण बनने वाले बैक्टीरिया ایک व्यक्ति से दूसरे व्यक्ति में کھانسی और छींकों के ذریعے हवा में छोड़ी गई چھوٹی بوندوں से फैलते ہیں۔',
symptomsEn: '<ul><li>Coughing that lasts three or more weeks</li><li>Coughing up blood or mucus</li><li>Chest pain, or pain with breathing or coughing</li><li>Unintentional weight loss</li><li>Fatigue</li><li>Fever</li><li>Night sweats</li><li>Chills</li></ul>',
symptomsHi: '<ul><li>तीन या उससे अधिक सप्ताह तक खांसी रहना</li><li>खून या بلغم वाली खांसी</li><li>सीने में दर्द, या सांस लेने या کھانسنے के साथ درد</li><li>अनजाने में वजन कम होना</li><li>थकान</li><li>बुखार</li><li>रात को पसीना आना</li><li>कंपकंपी</li></ul>',
    treatmentEn: 'Medications are the cornerstone of tuberculosis treatment. But treating TB takes much longer than treating other types of bacterial infections. You must take antibiotics for at least six to nine months.',
    treatmentHi: 'दवाएं तपेदिक के उपचार का आधार हैं। लेकिन टीबी का علاج अन्य प्रकार के जीवाणु संक्रमणों के علاج से कहीं زیادہ समय लेता है। आपको कम से कम چھ से नौ महीने तक एंटीबायोटिक्स लेनी चाहिए।',
    whenToSeeDoctorEn:"See your doctor if you have a fever, unexplained weight loss, drenching night sweats or a persistent cough. These are often signs of TB but can also result from other medical problems.",
    whenToSeeDoctorHi:"यदि आपको बुखार, अस्पष्टीकृत वजन घटाने, रात को पसीना आने या लगातार खांसी हो तो ਆਪਣੇ ڈاکٹر से मिलें। ये अक्सर टीबी के संकेत होते हैं लेकिन अन्य चिकित्सा समस्याओं के परिणामस्वरूप भी हो सकते हैं।",
  },
  {
    id: 'dengue',
    nameEn: 'Dengue Fever',
    nameHi: 'डेंगू बुखार',
    overviewEn: 'Dengue fever is a mosquito-borne illness that occurs in tropical and subtropical areas of the world. Mild dengue fever causes a high fever and flu-like symptoms. The severe form of dengue fever, also called dengue hemorrhagic fever, can cause serious bleeding, a sudden drop in blood pressure (shock) and death.',
    overviewHi: 'डेंगू बुखार एक मच्छर जनित बीमारी है जो दुनिया के उष्णकटिबंधीय और उपोष्णकटिबंधीय क्षेत्रों में होती ہے۔ ہلکے डेंगू बुखार में तेज بخार और फ्लू जैसे लक्षण होते हैं। डेंगू बुखार का गंभीर रूप, जिसे डेंगू रक्तस्रावी بخार भी कहा جاتا ہے, गंभीर रक्तस्राव, रक्तचाप में अचानक गिरावट (सदमे) और मृत्यु का कारण बन सकता ہے۔',
    symptomsEn: '<ul><li>High fever</li><li>Severe headache</li><li>Pain behind the eyes</li><li>Severe joint and muscle pain</li><li>Fatigue</li><li>Nausea</li><li>Vomiting</li><li>Skin rash, which appears two to five days after the onset of fever</li></ul>',
    symptomsHi: '<ul><li>तेज बुखार</li><li>गंभीर सिरदर्द</li><li>आंखों के पीछे दर्द</li><li>गंभीर जोड़ों और मांसपेशियों में दर्द</li><li>थकान</li><li>मतली</li><li>उल्टी</li><li>त्वचा पर दाने, जो बुखार শুরু होने के दो से पांच दिन बाद दिखाई देते हैं</li></ul>',
    treatmentEn: 'There is no specific medicine to treat dengue. Treatment focuses on relief of symptoms. This may include rest, plenty of fluids, and pain relievers like acetaminophen. Aspirin or ibuprofen should be avoided.',
    treatmentHi: 'डेंगू के इलाज के लिए کوئی خاص दवा नहीं ہے۔ उपचार लक्षणों से राहत पर केंद्रित ہے۔ इसमें آرام, बहुत सारे तरल पदार्थ, और एसिटामिनोफेन जैसी درد निवारक शामिल हो सकते हैं। एस्पिरिन या इबुप्रोफेन से बचना चाहिए।',
    whenToSeeDoctorEn: 'Seek immediate medical attention if you develop any warning signs of severe dengue fever. Warning signs include severe stomach pain, persistent vomiting, bleeding from your gums or nose, blood in your urine, stools or vomit, or difficulty breathing.',
    whenToSeeDoctorHi: 'यदि आप गंभीर डेंगू बुखार के کوئی चेतावनी संकेत विकसित करते हैं तो तत्काल चिकित्सा सहायता लें। चेतावनी संकेतों में پیٹ में गंभीर दर्द, लगातार उल्टी, आपके मसूड़ों या नाक से खून बहना, आपके मूत्र, मल या उल्टी में खून, या सांस लेने में कठिनाई شامل ہے۔',
  },
  {
    id: 'typhoid',
    nameEn: 'Typhoid Fever',
    nameHi: 'टाइफाइड बुखार',
    overviewEn: 'Typhoid fever is a bacterial infection that can lead to a high fever, diarrhea, and vomiting. It can be fatal. It is caused by the bacteria Salmonella typhi. The infection is often passed on through contaminated food and drinking water.',
    overviewHi: 'टाइफाइड बुखार एक जीवाणु संक्रमण है जो तेज بخार, दस्त, और उल्टी का कारण बन सकता ہے۔ यह घातक हो सकता है। यह साल्मोनेला टाइफी बैक्टीरिया के कारण होता है। संक्रमण अक्सर दूषित भोजन और پینے के पानी के ذریعے फैलता ہے۔',
    symptomsEn: '<ul><li>Sustained fever that can be as high as 104 F (40 C)</li><li>Headache</li><li>Weakness and fatigue</li><li>Muscle aches</li><li>Sweating</li><li>Dry cough</li><li>Loss of appetite and weight loss</li><li>Stomach pain</li></ul>',
    symptomsHi: '<ul><li>लगातार बुखार जो 104 F (40 C) तक हो सकता है</li><li>सिरदर्द</li><li>कमजोरी और थकान</li><li>मांसपेशियों में दर्द</li><li>पसीना आना</li><li>सूखी खांसी</li><li>भूख न लगना और वजन कम होना</li><li>पेट दर्द</li></ul>',
    treatmentEn: 'Typhoid fever is treated with antibiotics which kill the Salmonella bacteria. Prior to the use of antibiotics, the fatality rate was 20%. Now, it is 1%-2%. With appropriate antibiotic therapy, there is usually improvement within one to two days and recovery within seven to 10 days.',
    treatmentHi: 'टाइफाइड بخार का इलाज एंटीबायोटिक दवाओं से किया जाता है जो साल्मोनेला बैक्टीरिया को मारते ہیں۔ एंटीबायोटिक दवाओं के उपयोग से पहले, मृत्यु दर 20% थी। अब, यह 1% -2% है। उचित एंटीबायोटिक थेरेपी के साथ, आमतौर पर एक से दो दिनों के भीतर सुधार होता है और सात से 10 दिनों के اندر ठीक हो जाता ہے۔',
    whenToSeeDoctorEn: 'See a doctor immediately if you suspect you have typhoid fever. If you are traveling in a foreign country, you can usually call the consular section of your embassy for a list of doctors.',
    whenToSeeDoctorHi: 'यदि आपको संदेह है कि आपको टाइफाइड بخार है तो तुरंत डॉक्टर से मिलें। यदि आप किसी विदेशी देश में यात्रा कर रहे हैं, तो आप आमतौर पर डॉक्टरों की فہرست के लिए अपने दूतावास के कांसुलर सेक्शन को کال कर सकते हैं।',
  },
  {
    id: 'jaundice',
    nameEn: 'Jaundice',
    nameHi: 'पीलिया',
    overviewEn: 'Jaundice is a condition in which the skin, whites of the eyes and mucous membranes turn yellow because of a high level of bilirubin, a yellow-orange bile pigment. Jaundice has many causes, including hepatitis, gallstones and tumors.',
    overviewHi: 'पीलिया एक ऐसी स्थिति है जिसमें त्वचा, आंखों का सफेद حصہ और श्लेष्म झिल्ली बिलीरुबिन के उच्च स्तर के कारण पीले ہو जाते हैं, जो एक पीला-नारंगी पित्त वर्णक है। पीलिया के कई कारण हैं, जिनमें हेपेटाइटिस, पित्त पथरी और ट्यूमर शामिल हैं।',
    symptomsEn: '<ul><li>Yellowing of the skin and the whites of the eyes</li><li>Pale stools</li><li>Dark urine</li><li>Itchiness</li></ul>',
    symptomsHi: '<ul><li>त्वचा और आंखों के सफेद हिस्से का पीला होना</li><li>पीला मल</li><li>गहरा मूत्र</li><li>खुजली</li></ul>',
    treatmentEn: 'Jaundice treatment targets the cause rather than the jaundice itself. Treatment may consist of supportive care for viral hepatitis, surgery for obstruction, or stopping a drug that is causing the jaundice.',
    treatmentHi: 'पीलिया का उपचार पीलिया के बजाय कारण को लक्षित करता है। उपचार में वायरल हेपेटाइटिस के लिए सहायक देखभाल, रुकावट के लिए سرجری, या पीलिया पैदा करने वाली दवा को रोकना शामिल हो सकता ہے۔',
    whenToSeeDoctorEn: 'See a doctor if you have yellow discoloration of the skin or eyes, or if you have any of the other symptoms associated with jaundice.',
    whenToSeeDoctorHi: 'यदि आपकी त्वचा या आंखों का रंग पीला ہو गया है, या यदि आपको पीलिया से जुड़े کوئی अन्य लक्षण हैं तो डॉक्टर से मिलें।',
  },
  {
    id: 'scurvy',
    nameEn: 'Scurvy',
    nameHi: 'स्कर्वी',
    overviewEn: 'Scurvy is a disease resulting from a lack of vitamin C (ascorbic acid). Early symptoms of deficiency include weakness, feeling tired, and sore arms and legs. Without treatment, decreased red blood cells, gum disease, changes to hair, and bleeding from the skin may occur.',
    overviewHi: 'स्कर्वी विटामिन सी (एस्कॉर्बिक एसिड) की कमी से होने वाली बीमारी है। कमी के शुरुआती लक्षणों में कमजोरी, थका हुआ محسوس करना, और हाथ-पैर में दर्द शामिल ہیں۔ इलाज के बिना, लाल रक्त कोशिकाओं में कमी, मसूड़ों की बीमारी, बालों में बदलाव, और त्वचा से खून बहना ہو सकता ہے۔',
    symptomsEn: '<ul><li>Fatigue and weakness</li><li>Gum disease (gingivitis)</li><li>Easy bruising and bleeding</li><li>Joint pain</li><li>Poor wound healing</li><li>Depression</li></ul>',
    symptomsHi: '<ul><li>थकान और कमजोरी</li><li>मसूड़ों की बीमारी (मसूड़े की सूजन)</li><li>آسانی से चोट लगना और खून بہنا</li><li>जोड़ों का दर्द</li><li>घाव का खराब भरना</li><li>अवसाद</li></ul>',
    treatmentEn: 'Scurvy is treated by taking vitamin C supplements and eating a diet rich in vitamin C. Many of the symptoms improve within a few days to a few weeks.',
    treatmentHi: 'स्कर्वी का इलाज विटामिन सी سپلیمنٹس लेने और وٹامن सी से بھرپૂર आहार खाने से کیا جاتا ہے۔ कई लक्षण कुछ दिनों से लेकर कुछ ہفتوں में بہتر ہو जाते ہیں۔',
    whenToSeeDoctorEn: 'If you are experiencing symptoms of scurvy, you should see a doctor. It is a serious condition that can lead to severe complications if left untreated.',
    whenToSeeDoctorHi: 'यदि आप स्कर्वी के लक्षण अनुभव कर रहे हैं, तो आपको डॉक्टर से मिलना चाहिए। यह एक गंभीर स्थिति है जो इलाज न करने पर गंभीर जटिलताओं का باعث بن सकती ہے۔',
  },
  {
    id: 'cholera',
    nameEn: 'Cholera',
    nameHi: 'हैजा',
    overviewEn: 'Cholera is an acute diarrheal illness caused by infection of the intestine with the bacterium Vibrio cholerae. People can get sick when they swallow food or water contaminated with cholera bacteria. The infection is often mild or without symptoms, but can sometimes be severe and life-threatening.',
    overviewHi: 'हैजा विब्रियो कोलेरी जीवाणु से आंत के संक्रमण के कारण होने वाली एक তীব্র अतिसार की बीमारी ہے۔ लोग जब ਹੈਜੇ के जीवाणु से दूषित भोजन या पानी निगलते हैं तो बीमार पड़ सकते हैं। संक्रमण अक्सर हल्का या बिना लक्षणों वाला होता है, लेकिन कभी-कभी गंभीर और جان لیوا हो सकता ہے۔',
    symptomsEn: '<ul><li>Profuse watery diarrhea</li><li>Vomiting</li><li>Leg cramps</li><li>Rapid loss of body fluids leads to dehydration and shock.</li></ul>',
    symptomsHi: '<ul><li>अत्यधिक पानीदार दस्त</li><li>उल्टी</li><li>पैरों में ऐंठन</li><li>शरीर के तरल पदार्थों का तेजी से नुकसान निर्जलीकरण और सदमे का कारण बनता है।</li></ul>',
    treatmentEn: 'Cholera can be simply and successfully treated by immediate replacement of the fluid and salts lost through diarrhea. Patients can be treated with oral rehydration solution (ORS), a prepackaged mixture of sugar and salts to be mixed with 1 liter of water.',
    treatmentHi: 'हैजा का इलाज दस्त के माध्यम से खोए हुए तरल पदार्थ और लवणوں के तत्काल प्रतिस्थापन দ্বারা सरल और सफलतापूर्वक किया जा सकता ہے۔ रोगियों का علاج ओरल रिहाइड्रेशन सॉल्यूशन (ORS) से किया जा सकता है, ਜੋ चीनी और लवणों का ایک प्रीपैकेज्ड मिश्रण है जिसे 1 लीटर पानी में ملایا جانا ہے۔',
    whenToSeeDoctorEn: 'If you have severe, watery diarrhea and vomiting — especially after eating raw shellfish or traveling to a country where cholera is endemic — seek medical help immediately.',
    whenToSeeDoctorHi: 'यदि आपको गंभीर, पानीदार दस्त और उल्टी हो रही है - विशेष रूप से कच्ची शंख खाने या ऐसे देश की यात्रा करने के बाद जहां हैजा स्थानिक है - तो तुरंत चिकित्सा सहायता लें।',
  },
  {
    id: 'goitre',
    nameEn: 'Goitre',
    nameHi: 'घेंघा',
    overviewEn: 'A goiter is an abnormal enlargement of your thyroid gland. Your thyroid is a butterfly-shaped gland located at the base of your neck just below your Adam\'s apple. Although goiters are usually painless, a large goiter can cause a cough and make it difficult for you to swallow or breathe.',
    overviewHi: 'घेंघा आपकी थायरॉयड ग्रंथि का एक असामान्य इज़ाफ़ा है। आपका थायराइड एक तितली के आकार की ग्रंथि है जो आपकी गर्दन के आधार पर आपके Adam\'s apple के ठीक नीचे स्थित है। यद्यपि घेंघा आमतौर पर दर्द रहित होते हैं, एक बड़ा گھینگا खांसी का कारण बन सकता है और आप के लिए نگلنا یا سانس लेना मुश्किल बना सकता ہے۔',
    symptomsEn: '<ul><li>A visible swelling at the base of your neck</li><li>A tight feeling in your throat</li><li>Coughing</li><li>Hoarseness</li><li>Difficulty swallowing or breathing</li></ul>',
symptomsHi: '<ul><li>आपकी गर्दन के आधार पर एक दृश्य सूजन</li><li>आपके गले में जकड़न का एहसास</li><li>खांसी</li><li>कर्कशता</li><li>निगलने या सांस लेने में कठिनाई</li></ul>',
    treatmentEn: 'Goiter treatment depends on the size of the goiter, your signs and symptoms, and the underlying cause. Your doctor might recommend observation, medications, surgery, or radioactive iodine therapy.',
    treatmentHi: 'घेंघा का उपचार घेंघा के आकार, आपके संकेतों और लक्षणों, और अंतर्निहित कारण पर निर्भर करता है। आपका डॉक्टर अवलोकन, दवाओं, सर्जरी, या रेडियोधर्मी आयोडीन थेरेपी की सिफारिश कर सकता है।',
    whenToSeeDoctorEn: 'See your doctor if you have a visible swelling in your neck or experience any of the signs or symptoms of a goiter.',
    whenToSeeDoctorHi: 'यदि आपकी गर्दन में कोई দৃশ্যমান سوجن है या आप को گھینگے के कोई संकेत या लक्षण અનુભવ होते हैं तो अपने डॉक्टर से मिलें।',
  },
  {
    id: 'rabies',
    nameEn: 'Rabies',
    nameHi: 'रेबीज',
    overviewEn: 'Rabies is a deadly virus spread to people from the saliva of infected animals. The rabies virus is usually transmitted through a bite. Animals most likely to transmit rabies include bats, coyotes, foxes, raccoons, and skunks.',
    overviewHi: 'रेबीज ਇੱਕ ਘਾਤਕ ਵਾਇਰਸ ਹੈ ਜੋ ਸੰਕਰਮਿਤ ਜਾਨਵਰਾਂ ਦੀ ਲार ਤੋਂ ਲੋਕਾਂ ਵਿੱਚ ਫੈਲਦਾ ਹੈ। रेबीज वायरस आमतौर पर ਇੱਕ काटने के माध्यम से फैलता ਹੈ। जिन जानवरों से रेबीज फैलने की सबसे अधिक संभावना होती है ان میں چمگادڑ, कोयोट, लोमड़ी, रैकून, और سکنک शामिल ہیں۔',
    symptomsEn: '<ul><li>Fever</li><li>Headache</li><li>Nausea and vomiting</li><li>Agitation, anxiety, confusion</li><li>Hyperactivity, difficulty swallowing</li><li>Excessive salivation</li><li>Fear of water (hydrophobia) because of the difficulty in swallowing</li></ul>',
symptomsHi: '<ul><li>बुखार</li><li>सिरदर्द</li><li>मतली और الटी</li><li>आंदोलन, चिंता, भ्रम</li><li>अति सक्रियता, निगलने में कठिनाई</li><li>अत्यधिक लार</li><li>निगलने में कठिनाई के कारण पानी से ڈر (हाइड्रोफोबिया)</li></ul>',
    treatmentEn: 'Once a rabies infection is established, there\'s no effective treatment. Though a small number of people have survived rabies, the disease usually causes death. For that reason, if you think you\'ve been exposed to rabies, you must get a series of shots to prevent the infection from taking hold.',
    treatmentHi: 'एक बार रेबीज संक्रमण स्थापित हो जाने पर, कोई प्रभावी उपचार नहीं है। हालांकि कुछ लोगों ने रेबीज से جان بچائی है, यह بیماری आमतौर पर मौत का سبب بنتی ہے۔ इस कारण से, यदि आपको लगता है कि आप रेबीज के संपर्क में आए हैं, तो आपको संक्रमण को पकड़ने से रोकने के लिए शॉट्स की एक श्रृंखला लेनी चाहिए।',
    whenToSeeDoctorEn:"Seek immediate medical care if you are bitten by any animal, or if an animal's saliva gets into an open wound.",
    whenToSeeDoctorHi:"यदि आप को کوئی جانور کاٹ लेता है, या यदि किसी جانور की لار کھلے زخم में चली जाती है तो तुरंत चिकित्सा देखभाल लें।",
  },
  {
    id: 'rickets',
    nameEn: 'Rickets',
    nameHi: 'रिकेट्स (सूखा रोग)',
    overviewEn: 'Rickets is the softening and weakening of bones in children, usually because of an extreme and prolonged vitamin D deficiency. Adding vitamin D or calcium to the diet generally corrects the bone problems associated with rickets.',
    overviewHi: 'रिकेट्स बच्चों में हड्डियों का नरम और कमजोर होना है, आमतौर पर विटामिन डी की अत्यधिक और लंबी कमी के कारण। आहार में विटामिन डी या कैल्शियम जोड़ने से आमतौर पर रिकेट्स से जुड़ी हड्डियों की समस्याएं ठीक हो जाती हैं।',
    symptomsEn: '<ul><li>Delayed growth</li><li>Delayed motor skills</li><li>Pain in the spine, pelvis and legs</li><li>Muscle weakness</li><li>Bowed legs or knock-knees</li><li>Thickened wrists and ankles</li><li>Breastbone projection</li></ul>',
    symptomsHi: '<ul><li>धीमा विकास</li><li>देरी से मोटर कौशल</li><li>रीढ़, श्रोणि और पैरों में दर्द</li><li>मांसपेशियों की कमजोरी</li><li> झुकी हुई टांगें या नॉक-नी</li><li>मोटी कलाइयां और टखने</li><li>उरोस्थि प्रक्षेपण</li></ul>',
    treatmentEn: 'Treatment for rickets focuses on replacing the vitamin D or calcium in the body. If your child has a skeletal deformity, such as severely bowed legs, your doctor may suggest surgery to correct the problem.',
    treatmentHi: 'रिकेट्स का उपचार शरीर में विटामिन डी या कैल्शियम को बदलने पर केंद्रित है। यदि आपके बच्चे में कोई कंकाल विकृति है, जैसे कि गंभीर रूप से झुकी हुई टांगें, तो आपका डॉक्टर समस्या को ठीक करने के लिए سرجری کا सुझाव दे सकता ہے۔',
    whenToSeeDoctorEn: 'See your doctor if your child develops bone pain, muscle weakness or obvious skeletal deformities.',
    whenToSeeDoctorHi: 'यदि आपके बच्चे में हड्डियों में درد, मांसपेशियों में कमजोरी या स्पष्ट कंकाल विकृति विकसित होती है तो ਆਪਣੇ ڈاکٹر से मिलें।',
  },
  {
    id: 'ringworm',
    nameEn: 'Ringworm',
    nameHi: 'दाद',
    overviewEn: 'Ringworm of the body (tinea corporis) is a rash caused by a fungal infection. It\'s usually a red, itchy, circular rash with clearer skin in the middle. Ringworm gets its name from its appearance. No worm is involved.',
    overviewHi: 'शरीर का दाद (टिनिया कॉर्पोरिस) एक फंगल संक्रमण के कारण होने वाला दाने है। ਇਹ ਆਮ ਤੌਰ पर ਇੱਕ लाल, खुजली वाला, गोलाकार दाने होता ਹੈ ਜਿਸਦੇ बीच में صاف جلد ਹੁੰਦੀ ਹੈ। दाद का नाम इसकी उपस्थिति से मिलता है। इसमें कोई कीड़ा शामिल नहीं ਹੈ।',
    symptomsEn: '<ul><li>A scaly ring-shaped area, typically on the buttocks, trunk, arms and legs</li><li>A clear or scaly area inside the ring, perhaps with a scattering of bumps</li><li>Slightly raised, expanding rings</li><li>A round, flat patch of itchy skin</li></ul>',
    symptomsHi: '<ul><li>एक पपड़ीदार अंगूठी के आकार का क्षेत्र, आमतौर पर नितंबों, धड़, بازوؤں और ٹانگوں पर</li><li>अंगूठी के اندر ایک صاف या پپड़ीदार क्षेत्र, शायद धक्कों के بکھराव के साथ</li><li>थोड़ा उभड़ा हुआ, پھیلتا हुआ حلقہ</li><li>खुजली वाली جلد کا ایک گول, چپٹا પેચ</li></ul>',
    treatmentEn: 'For mild ringworm, your doctor may suggest an over-the-counter antifungal cream, lotion, or powder. For more-severe infections, you might need prescription-strength topical medications or antifungal pills.',
    treatmentHi: 'ہلکے داد کے لیے, आपका डॉक्टर एक ओवर-द-काउंटर एंटीफंगल क्रीम, लोशन, या पाउडर का सुझाव دے सकता ہے۔ વધુ ગંભીર संक्रमणों के लिए, आपको प्रिस्क्रिप्शन-strength टॉपिकल दवाओं या एंटीफंगल गोलियों की आवश्यकता हो सकती है।',
    whenToSeeDoctorEn: 'See your doctor if you have a rash on your skin that doesn\'t improve within two weeks of using an over-the-counter antifungal product.',
    whenToSeeDoctorHi: 'यदि आपकी त्वचा पर कोई दाने है जो ओवर-द-काउंटर एंटीफंगल उत्पाद का उपयोग करने के दो सप्ताह के اندر بہتر नहीं होता है तो अपने डॉक्टर से मिलें।',
  },
  {
    id: 'heart-attack',
    nameEn: 'Heart Attack (Myocardial Infarction)',
    nameHi: 'दिल का दौरा (मायोकार्डियल इंफार्क्शन)',
    overviewEn: 'A heart attack is a medical emergency where the blood supply to the heart is suddenly blocked, usually by a blood clot. Lack of blood can seriously damage the heart muscle.',
    overviewHi: 'दिल का दौरा एक मेडिकल इमरजेंसी है जिसमें हृदय की रक्त आपूर्ति अचानक बंद हो जाती है, आमतौर पर रक्त के थक्के के कारण। रक्त की कमी हृदय की मांसपेशियों को गंभीर रूप से नुकसान पहुंचा सकती है।',
    symptomsEn: '<ul><li>Chest pain – a feeling of pressure, tightness or squeezing in the center of your chest</li><li>Pain in other parts of the body – it can feel as if the pain is traveling from your chest to your arms, jaw, neck, back and tummy</li><li>Shortness of breath</li><li>Feeling lightheaded or dizzy</li><li>Feeling sick (nausea) or being sick (vomiting)</li></ul>',
    symptomsHi: '<ul><li>सीने में दर्द – छाती के बीच में दबाव, जकड़न या निचोड़ने जैसा महसूस होना</li><li>शरीर के अन्य हिस्सों में दर्द – ऐसा महसूस हो सकता है कि दर्द आपकी छाती से आपकी बाहों, जबड़े, गर्दन, पीठ और पेट तक जा रहा है</li><li>सांस लेने में कठिनाई</li><li>हल्का सिरदर्द या चक्कर आना</li><li>जी मिचलाना (मतली) या उल्टी होना</li></ul>',
    treatmentEn: 'A heart attack is a medical emergency that requires immediate treatment. This often includes medications to dissolve blood clots and restore blood flow, and procedures like angioplasty or bypass surgery.',
    treatmentHi: 'दिल का दौरा एक मेडिकल इमरजेंसी है जिसके लिए तत्काल उपचार की आवश्यकता होती है। इसमें अक्सर रक्त के थक्कों को घोलने और रक्त प्रवाह को बहाल करने के लिए दवाएं, और एंजियोप्लास्टी या बाईपास सर्जरी जैसी प्रक्रियाएं शामिल होती हैं।',
    whenToSeeDoctorEn: '<ul><li>Call emergency services immediately if you suspect a heart attack.</li><li>Do not try to drive yourself to the hospital.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको दिल का दौरा पड़ने का संदेह है तो तुरंत आपातकालीन सेवाओं को कॉल करें।</li><li>खुद अस्पताल जाने की कोशिश न करें।</li></ul>',
  },
  {
    id: 'stroke',
    nameEn: 'Stroke',
    nameHi: 'स्ट्रोक (मस्तिष्क का दौरा)',
    overviewEn: 'A stroke is a serious life-threatening medical condition that happens when the blood supply to part of the brain is cut off. Strokes are a medical emergency and urgent treatment is essential.',
    overviewHi: 'स्ट्रोक एक गंभीर जानलेवा चिकित्सा स्थिति है जो तब होती है जब मस्तिष्क के एक हिस्से में रक्त की आपूर्ति बंद हो जाती है। स्ट्रोक एक मेडिकल इमरजेंसी है और तत्काल उपचार आवश्यक है।',
    symptomsEn: 'Remember the word FAST: <ul><li><strong>Face:</strong> The face may have dropped on one side.</li><li><strong>Arms:</strong> The person may not be able to lift both arms.</li><li><strong>Speech:</strong> Their speech may be slurred or garbled.</li><li><strong>Time:</strong> It\'s time to call emergency services immediately.</li></ul>',
    symptomsHi: 'FAST शब्द याद रखें: <ul><li><strong>चेहरा (Face):</strong> चेहरा एक तरफ झुक सकता है।</li><li><strong>बांहें (Arms):</strong> व्यक्ति दोनों बांहें उठाने में असमर्थ हो सकता है।</li><li><strong>बोलना (Speech):</strong> उसकी बोली लड़खड़ा सकती है या अस्पष्ट हो सकती है।</li><li><strong>समय (Time):</strong> यह तुरंत आपातकालीन सेवाओं को कॉल करने का समय है।</li></ul>',
    treatmentEn: 'Treatment depends on the type of stroke. It may involve medications to dissolve clots (for ischemic strokes) or procedures to stop bleeding (for hemorrhagic strokes).',
    treatmentHi: 'उपचार स्ट्रोक के प्रकार पर निर्भर करता है। इसमें थक्कों को घोलने के लिए दवाएं (इस्केमिक स्ट्रोक के लिए) या रक्तस्राव को रोकने के लिए प्रक्रियाएं (रक्तस्रावी स्ट्रोक के लिए) शामिल हो सकती हैं।',
    whenToSeeDoctorEn: '<ul><li>If you suspect you or someone else is having a stroke, call emergency services immediately.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको संदेह है कि आपको या किसी और को स्ट्रोक हो रहा है, तो तुरंत आपातकालीन सेवाओं को कॉल करें।</li></ul>',
  },
  {
    id: 'appendicitis',
    nameEn: 'Appendicitis',
    nameHi: 'एपेंडिसाइटिस',
    overviewEn: 'Appendicitis is the inflammation of the appendix, a finger-shaped pouch that projects from your colon on the lower right side of your abdomen. It causes sudden pain that begins around your navel and then shifts to your lower right abdomen.',
    overviewHi: 'एपेंडिसाइटिस अपेंडिक्स की सूजन है, जो एक उंगली के आकार की थैली है जो आपके पेट के निचले दाहिने हिस्से में आपके कोलन से निकलती है। यह अचानक दर्द का कारण बनता है जो आपकी नाभि के आसपास शुरू होता है और फिर आपके निचले दाहिने पेट में चला जाता है।',
    symptomsEn: '<ul><li>Sudden pain that begins on the right side of the lower abdomen</li><li>Pain that worsens if you cough, walk or make other jarring movements</li><li>Nausea and vomiting</li><li>Loss of appetite</li><li>Low-grade fever that may worsen as the illness progresses</li></ul>',
    symptomsHi: '<ul><li>अचानक दर्द जो पेट के निचले हिस्से के दाईं ओर शुरू होता है</li><li>खांसने, चलने या अन्य झटकेदार हरकतें करने पर दर्द का बढ़ना</li><li>मतली और उल्टी</li><li>भूख में कमी</li><li>हल्का बुखार जो बीमारी बढ़ने के साथ बिगड़ सकता है</li></ul>',
    treatmentEn: 'Appendicitis treatment usually involves surgery to remove the inflamed appendix (appendectomy).',
    treatmentHi: 'एपेंडिसाइटिस के उपचार में आमतौर पर सूजे हुए अपेंडिक्स को हटाने के लिए सर्जरी (एपेंडेक्टोमी) शामिल होती है।',
    whenToSeeDoctorEn: '<ul><li>If you or your child has signs or symptoms of appendicitis, seek immediate medical attention.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको या आपके बच्चे को एपेंडिसाइटिस के संकेत या लक्षण हैं, तो तत्काल चिकित्सा सहायता लें।</li></ul>',
  },
  {
    id: 'epilepsy',
    nameEn: 'Epilepsy',
    nameHi: 'मिर्गी',
    overviewEn: 'Epilepsy is a central nervous system (neurological) disorder in which brain activity becomes abnormal, causing seizures or periods of unusual behavior, sensations, and sometimes loss of awareness.',
    overviewHi: 'मिर्गी एक केंद्रीय तंत्रिका तंत्र (न्यूरोलॉजिकल) विकार है जिसमें मस्तिष्क की गतिविधि असामान्य हो जाती है, जिससे दौरे या असामान्य व्यवहार, संवेदनाएं और कभी-कभी जागरूकता का नुकसान होता है।',
    symptomsEn: '<ul><li>Temporary confusion</li><li>A staring spell</li><li>Stiff muscles</li><li>Uncontrollable jerking movements of the arms and legs</li><li>Loss of consciousness or awareness</li><li>Psychic symptoms such as fear, anxiety or deja vu</li></ul>',
    symptomsHi: '<ul><li>अस्थायी भ्रम</li><li>टकटकी लगाकर देखना</li><li>मांसपेशियों में अकड़न</li><li>हाथों और पैरों की अनियंत्रित झटकेदार हरकतें</li><li>चेतना या जागरूकता का नुकसान</li><li>भय, चिंता या देजा वू जैसे मानसिक लक्षण</li></ul>',
    treatmentEn: 'Treatment with medications or sometimes surgery can control seizures for the majority of people with epilepsy.',
    treatmentHi: 'दवाओं या कभी-कभी सर्जरी से उपचार मिर्गी वाले अधिकांश लोगों के लिए दौरे को नियंत्रित कर सकता है।',
    whenToSeeDoctorEn: '<ul><li>Seek immediate medical help if a seizure lasts more than five minutes, if breathing or consciousness does not return after the seizure stops, or if a second seizure follows immediately.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि दौरा पांच मिनट से अधिक समय तक रहता है, यदि दौरे के रुकने के बाद सांस या चेतना वापस नहीं आती है, या यदि तुरंत दूसरा दौरा पड़ता है, तो तत्काल चिकित्सा सहायता लें।</li></ul>',
  },
  {
    id: 'hemorrhoids',
    nameEn: 'Piles (Hemorrhoids)',
    nameHi: 'बवासीर (पाइल्स)',
    overviewEn: 'Hemorrhoids, also called piles, are swollen veins in your anus and lower rectum, similar to varicose veins. Hemorrhoids can develop inside the rectum (internal hemorrhoids) or under the skin around the anus (external hemorrhoids).',
    overviewHi: 'बवासीर, जिसे पाइल्स भी कहा जाता है, आपके गुदा और निचले मलाशय में सूजी हुई नसें होती हैं, जो वैरिकाज़ नसों के समान होती हैं। बवासीर मलाशय के अंदर (आंतरिक बवासीर) या गुदा के आसपास की त्वचा के नीचे (बाहरी बवासीर) विकसित हो सकती है।',
    symptomsEn: '<ul><li>Painless bleeding during bowel movements</li><li>Itching or irritation in your anal region</li><li>Pain or discomfort</li><li>Swelling around your anus</li><li>A lump near your anus, which may be sensitive or painful</li></ul>',
    symptomsHi: '<ul><li>मल त्याग के दौरान दर्द रहित रक्तस्राव</li><li>आपके गुदा क्षेत्र में खुजली या जलन</li><li>दर्द या बेचैनी</li><li>आपके गुदा के आसपास सूजन</li><li>आपके गुदा के पास एक गांठ, जो संवेदनशील या दर्दनाक हो सकती है</li></ul>',
    treatmentEn: 'You can often relieve the mild pain, swelling and inflammation of hemorrhoids with home treatments, such as eating high-fiber foods, drinking plenty of fluids, and using over-the-counter creams.',
    treatmentHi: 'आप अक्सर घरेलू उपचारों से बवासीर के हल्के दर्द, सूजन और जलन से राहत पा सकते हैं, जैसे कि उच्च फाइबर वाले खाद्य पदार्थ खाना, खूब सारे तरल पदार्थ पीना और ओवर-द-काउंटर क्रीम का उपयोग करना।',
    whenToSeeDoctorEn: '<ul><li>If you have bleeding during bowel movements or you have hemorrhoids that don\'t improve after a week of home care, talk to your doctor.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको मल त्याग के दौरान रक्तस्राव होता है या आपको बवासीर है जो एक सप्ताह के घरेलू देखभाल के बाद ठीक नहीं होता है, तो अपने डॉक्टर से बात करें।</li></ul>',
  },
  {
    id: 'food-poisoning',
    nameEn: 'Food Poisoning',
    nameHi: 'फ़ूड पॉइज़निंग (भोजन विषाक्तता)',
    overviewEn: 'Food poisoning is an illness caused by eating contaminated food. Infectious organisms — including bacteria, viruses and parasites — or their toxins are the most common causes.',
    overviewHi: 'फ़ूड पॉइज़निंग दूषित भोजन खाने से होने वाली बीमारी है। संक्रामक जीव - बैक्टीरिया, वायरस और परजीवी सहित - या उनके विषाक्त पदार्थ सबसे आम कारण हैं।',
    symptomsEn: '<ul><li>Nausea</li><li>Vomiting</li><li>Watery or bloody diarrhea</li><li>Abdominal pain and cramps</li><li>Fever</li></ul>',
    symptomsHi: '<ul><li>मतली</li><li>उल्टी</li><li>पानीदार या खूनी दस्त</li><li>पेट दर्द और ऐंठन</li><li>बुखार</li></ul>',
    treatmentEn: 'Treatment for food poisoning typically depends on the source of the illness, if known, and the severity of your symptoms. For most people, the illness resolves without treatment within a few days. The goal is to stay hydrated by drinking plenty of fluids.',
    treatmentHi: 'फ़ूड पॉइज़निंग का उपचार आमतौर पर बीमारी के स्रोत पर निर्भर करता है, यदि ज्ञात हो, और आपके लक्षणों की गंभीरता पर। अधिकांश लोगों के लिए, बीमारी कुछ दिनों के भीतर बिना उपचार के ठीक हो जाती है। लक्ष्य खूब सारे तरल पदार्थ पीकर हाइड्रेटेड रहना है।',
    whenToSeeDoctorEn: '<ul><li>See a doctor if you have frequent episodes of vomiting and inability to keep liquids down, bloody vomit or stools, severe abdominal cramping, or a fever higher than 100.4 F (38 C).</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको बार-बार उल्टी होती है और आप तरल पदार्थ नहीं रख पाते हैं, खूनी उल्टी या मल, पेट में गंभीर ऐंठन, या 100.4 F (38 C) से अधिक बुखार है, तो डॉक्टर से मिलें।</li></ul>',
  },
  {
    id: 'uti',
    nameEn: 'Urinary Tract Infection (UTI)',
    nameHi: 'मूत्र पथ संक्रमण (यूटीआई)',
    overviewEn: 'A urinary tract infection (UTI) is an infection in any part of your urinary system — your kidneys, ureters, bladder and urethra. Most infections involve the lower urinary tract — the bladder and the urethra.',
    overviewHi: 'मूत्र पथ संक्रमण (यूटीआई) आपके मूत्र प्रणाली के किसी भी हिस्से में एक संक्रमण है - आपके गुर्दे, मूत्रवाहिनी, मूत्राशय और मूत्रमार्ग। अधिकांश संक्रमणों में निचला मूत्र पथ - मूत्राशय और मूत्रमार्ग शामिल होता है।',
    symptomsEn: '<ul><li>A strong, persistent urge to urinate</li><li>A burning sensation when urinating</li><li>Passing frequent, small amounts of urine</li><li>Urine that appears cloudy</li><li>Urine that appears red, bright pink or cola-colored — a sign of blood in the urine</li></ul>',
    symptomsHi: '<ul><li>पेशाब करने की एक मजबूत, लगातार इच्छा</li><li>पेशाब करते समय जलन</li><li>बार-बार, कम मात्रा में पेशाब आना</li><li>धुंधला दिखने वाला मूत्र</li><li>लाल, चमकीला गुलाबी या कोला रंग का दिखने वाला मूत्र - मूत्र में रक्त का संकेत</li></ul>',
    treatmentEn: 'Antibiotics are the first-line treatment for urinary tract infections. Which drugs are prescribed and for how long depend on your health condition and the type of bacterium found in your urine.',
    treatmentHi: 'एंटीबायोटिक्स मूत्र पथ के संक्रमण के लिए पहली पंक्ति का उपचार है। कौन सी दवाएं निर्धारित की जाती हैं और कितने समय के लिए यह आपके स्वास्थ्य की स्थिति और आपके मूत्र में पाए जाने वाले जीवाणु के प्रकार पर निर्भर करता है।',
    whenToSeeDoctorEn: '<ul><li>Contact your doctor if you have signs and symptoms of a UTI.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको यूटीआई के संकेत और लक्षण हैं तो अपने डॉक्टर से संपर्क करें।</li></ul>',
  },
  {
    id: 'conjunctivitis',
    nameEn: 'Conjunctivitis (Pink Eye)',
    nameHi: 'कंजंक्टिवाइटिस (आंख आना)',
    overviewEn: 'Pink eye (conjunctivitis) is an inflammation or infection of the transparent membrane (conjunctiva) that lines your eyelid and covers the white part of your eyeball. It is commonly caused by a bacterial or viral infection, or an allergic reaction.',
    overviewHi: 'आंख आना (कंजंक्टिवाइटिस) आपकी पलक को रेखांकित करने वाली और आपकी आंख के सफेद हिस्से को ढकने वाली पारदर्शी झिल्ली (कंजंक्टिवा) की सूजन या संक्रमण है। यह आमतौर पर एक जीवाणु या वायरल संक्रमण, या एक एलर्जी की प्रतिक्रिया के कारण होता है।',
    symptomsEn: '<ul><li>Redness in one or both eyes</li><li>Itchiness in one or both eyes</li><li>A gritty feeling in one or both eyes</li><li>A discharge in one or both eyes that forms a crust during the night</li><li>Tearing</li></ul>',
    symptomsHi: '<ul><li>एक या दोनों आंखों में लाली</li><li>एक या दोनों आंखों में खुजली</li><li>एक या दोनों आंखों में किरकिरा महसूस होना</li><li>एक या दोनों आंखों से स्राव जो रात के दौरान एक पपड़ी बनाता है</li><li>आंसू आना</li></ul>',
    treatmentEn: 'Pink eye treatment is often focused on symptom relief. Your doctor may recommend using artificial tears, cleaning your eyelids with a wet cloth, and applying cold or warm compresses several times daily. For bacterial conjunctivitis, antibiotic eye drops are prescribed.',
    treatmentHi: 'आंख आने का उपचार अक्सर लक्षणों से राहत पर केंद्रित होता है। आपका डॉक्टर कृत्रिम आँसू का उपयोग करने, अपनी पलकों को गीले कपड़े से साफ करने और दिन में कई बार ठंडी या गर्म सिकाई करने की सलाह दे सकता है। जीवाणु कंजंक्टिवाइटिस के लिए, एंटीबायोटिक आई ड्रॉप निर्धारित किए जाते हैं।',
    whenToSeeDoctorEn: '<ul><li>See a doctor if you have eye pain, a feeling that something is stuck in your eye, blurred vision, or sensitivity to light.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको आंखों में दर्द, ऐसा महसूस हो कि आपकी आंख में कुछ फंस गया है, धुंधली दृष्टि, या प्रकाश के प्रति संवेदनशीलता है, तो डॉक्टर से मिलें।</li></ul>',
  },
  {
    id: 'measles',
    nameEn: 'Measles',
    nameHi: 'खसरा',
    overviewEn: 'Measles is a childhood infection caused by a virus. Once quite common, measles can now almost always be prevented with a vaccine. Also called rubeola, measles can be serious and even fatal for small children.',
    overviewHi: 'खसरा एक वायरस के कारण होने वाला बचपन का संक्रमण है। एक बार काफी आम, खसरा अब लगभग हमेशा एक टीके से रोका जा सकता है। रूबेला भी कहा जाता है, खसरा छोटे बच्चों के लिए गंभीर और घातक भी हो सकता है।',
    symptomsEn: '<ul><li>Fever</li><li>Dry cough</li><li>Runny nose</li><li>Sore throat</li><li>A skin rash made up of large, flat blotches that often flow into one another</li><li>Tiny white spots with bluish-white centers on a red background found inside the mouth on the inner lining of the cheek — also called Koplik\'s spots</li></ul>',
    symptomsHi: '<ul><li>बुखार</li><li>सूखी खांसी</li><li>बहती नाक</li><li>गले में खराश</li><li>एक त्वचा पर दाने जो बड़े, सपाट धब्बों से बने होते हैं जो अक्सर एक दूसरे में मिल जाते हैं</li><li>गाल की भीतरी परत पर मुंह के अंदर पाए जाने वाले लाल पृष्ठभूमि पर नीले-सफेद केंद्रों के साथ छोटे सफेद धब्बे - जिन्हें कोप्लिक के धब्बे भी कहा जाता है</li></ul>',
    treatmentEn: 'There\'s no specific treatment for an established measles infection. Treatment involves supportive care, like rest and fluids, and managing symptoms. A post-exposure vaccination or a dose of immune serum globulin can help prevent measles if given within a few days of exposure.',
    treatmentHi: 'एक स्थापित खसरा संक्रमण के लिए कोई विशिष्ट उपचार नहीं है। उपचार में सहायक देखभाल, जैसे आराम और तरल पदार्थ, और लक्षणों का प्रबंधन शामिल है। संपर्क के कुछ दिनों के भीतर दिए जाने पर पोस्ट-एक्सपोज़र टीकाकरण या इम्यून सीरम ग्लोबुलिन की एक खुराक खसरा को रोकने में मदद कर सकती है।',
    whenToSeeDoctorEn: '<ul><li>Call your doctor if you think you or your child may have been exposed to measles or if you or your child has a rash resembling measles.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको लगता है कि आपको या आपके बच्चे को खसरा हो सकता है या यदि आपको या आपके बच्चे को खसरा जैसा दाने है, तो अपने डॉक्टर को बुलाएँ।</li></ul>',
  },
  {
    id: 'mumps',
    nameEn: 'Mumps',
    nameHi: 'कण्ठमाला (मम्प्स)',
    overviewEn: 'Mumps is a viral infection that primarily affects saliva-producing (salivary) glands that are located near your ears. Mumps can cause swelling in one or both of these glands. It is preventable by the MMR vaccine.',
    overviewHi: 'कण्ठमाला एक वायरल संक्रमण है जो मुख्य रूप से आपके कानों के पास स्थित लार-उत्पादक (लार) ग्रंथियों को प्रभावित करता है। कण्ठमाला इन ग्रंथियों में से एक या दोनों में सूजन पैदा कर सकता है। इसे एमएमआर टीके द्वारा रोका जा सकता है।',
    symptomsEn: '<ul><li>Puffy cheeks and a swollen jaw</li><li>Fever</li><li>Headache</li><li>Muscle aches</li><li>Tiredness</li><li>Loss of appetite</li><li>Pain while chewing or swallowing</li></ul>',
    symptomsHi: '<ul><li>फूले हुए गाल और सूजा हुआ जबड़ा</li><li>बुखार</li><li>सिरदर्द</li><li>मांसपेशियों में दर्द</li><li>थकान</li><li>भूख में कमी</li><li>चबाने या निगलने में दर्द</li></ul>',
    treatmentEn: 'There is no specific treatment for mumps. Treatment is focused on relieving symptoms until your body\'s immune system fights off the infection. This includes rest, pain relievers, and applying cold or warm compresses to the swollen glands.',
    treatmentHi: 'कण्ठमाला के लिए कोई विशिष्ट उपचार नहीं है। उपचार लक्षणों से राहत पर केंद्रित है जब तक कि आपके शरीर की प्रतिरक्षा प्रणाली संक्रमण से लड़ न ले। इसमें आराम, दर्द निवारक, और सूजी हुई ग्रंथियों पर ठंडी या गर्म सिकाई करना शामिल है।',
    whenToSeeDoctorEn: '<ul><li>If you or your child has signs and symptoms of mumps, see your doctor.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको या आपके बच्चे को कण्ठमाला के संकेत और लक्षण हैं, तो अपने डॉक्टर से मिलें।</li></ul>',
  },
  {
    id: 'sinusitis',
    nameEn: 'Sinusitis',
    nameHi: 'साइनसाइटिस (साइनस संक्रमण)',
    overviewEn: 'Sinusitis is an inflammation, or swelling, of the tissue lining the sinuses. Healthy sinuses are filled with air. But when they become blocked and filled with fluid, germs can grow and cause an infection.',
    overviewHi: 'साइनसाइटिस साइनस को अस्तर करने वाले ऊतक की सूजन या सूजन है। स्वस्थ साइनस हवा से भरे होते हैं। लेकिन जब वे अवरुद्ध हो जाते हैं और द्रव से भर जाते हैं, तो रोगाणु बढ़ सकते हैं और संक्रमण का कारण बन सकते हैं।',
    symptomsEn: '<ul><li>Facial pain or pressure</li><li>Stuffy nose</li><li>Runny nose</li><li>Loss of smell</li><li>Cough or congestion</li><li>Headache</li></ul>',
    symptomsHi: '<ul><li>चेहरे का दर्द या दबाव</li><li>बंद नाक</li><li>बहती नाक</li><li>गंध की हानि</li><li>खांसी या जकड़न</li><li>सिरदर्द</li></ul>',
    treatmentEn: 'Most cases of sinusitis are caused by a virus and will clear up on their own. Home treatments like saline nasal sprays, steam inhalation, and pain relievers can help. For bacterial sinusitis, a doctor may prescribe antibiotics.',
    treatmentHi: 'साइनसाइटिस के अधिकांश मामले एक वायरस के कारण होते हैं और अपने आप ठीक हो जाएंगे। खारा नाक स्प्रे, भाप लेना और दर्द निवारक जैसे घरेलू उपचार मदद कर सकते हैं। जीवाणु साइनसाइटिस के लिए, एक डॉक्टर एंटीबायोटिक्स लिख सकता है।',
    whenToSeeDoctorEn: '<ul><li>See a doctor if you have symptoms that are severe, last more than 10 days, or if you have a fever that lasts several days.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपके लक्षण गंभीर हैं, 10 दिनों से अधिक समय तक रहते हैं, या यदि आपको कई दिनों तक बुखार रहता है, तो डॉक्टर से मिलें।</li></ul>',
  },
  {
    id: 'tonsillitis',
    nameEn: 'Tonsillitis',
    nameHi: 'टॉन्सिलाइटिस',
    overviewEn: 'Tonsillitis is inflammation of the tonsils, two oval-shaped pads of tissue at the back of the throat — one tonsil on each side. It is most often caused by common viruses, but bacterial infections also can be the cause.',
    overviewHi: 'टॉन्सिलाइटिस टॉन्सिल की सूजन है, जो गले के पीछे ऊतक के दो अंडाकार आकार के पैड होते हैं - प्रत्येक तरफ एक टॉन्सिल। यह अक्सर सामान्य वायरस के कारण होता है, लेकिन जीवाणु संक्रमण भी इसका कारण हो सकता है।',
    symptomsEn: '<ul><li>Sore throat</li><li>Red, swollen tonsils</li><li>White or yellow coating or patches on the tonsils</li><li>Difficult or painful swallowing</li><li>Fever</li><li>Scratchy, muffled or throaty voice</li></ul>',
    symptomsHi: '<ul><li>गले में खराश</li><li>लाल, सूजे हुए टॉन्सिल</li><li>टॉन्सिल पर सफेद या पीला लेप या धब्बे</li><li>निगलने में कठिनाई या दर्द</li><li>बुखार</li><li>खराश, दबी हुई या गले की आवाज</li></ul>',
    treatmentEn: 'Treatment depends on the cause. If it\'s bacterial, antibiotics will be prescribed. For viral tonsillitis, home care such as rest, gargling with salt water, and drinking warm fluids can help ease symptoms.',
    treatmentHi: 'उपचार कारण पर निर्भर करता है। यदि यह जीवाणु है, तो एंटीबायोटिक्स निर्धारित किए जाएंगे। वायरल टॉन्सिलाइटिस के लिए, आराम, नमक के पानी से गरारे करना और गर्म तरल पदार्थ पीना जैसे घरेलू देखभाल लक्षणों को कम करने में मदद कर सकते हैं।',
    whenToSeeDoctorEn: '<ul><li>See a doctor if you have a sore throat with a fever, or a sore throat that is severe, persistent, or causes difficulty swallowing or breathing.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको बुखार के साथ गले में खराश है, या गले में खराश जो गंभीर, लगातार है, या निगलने या सांस लेने में कठिनाई का कारण बनती है, तो डॉक्टर से मिलें।</li></ul>',
  },
  {
    id: 'fatty-liver',
    nameEn: 'Fatty Liver Disease',
    nameHi: 'फैटी लिवर रोग',
    overviewEn: 'Fatty liver disease is a condition in which excess fat builds up in the liver. There are two main types: Non-alcoholic fatty liver disease (NAFLD) and alcoholic fatty liver disease, also called alcoholic steatohepatitis.',
    overviewHi: 'फैटी लिवर रोग एक ऐसी स्थिति है जिसमें लिवर में अतिरिक्त वसा जमा हो जाती है। इसके दो मुख्य प्रकार हैं: गैर-मादक फैटी लिवर रोग (NAFLD) और मादक फैटी लिवर रोग, जिसे मादक स्टीटोहेपेटाइटिस भी कहा जाता है।',
    symptomsEn: '<ul><li>Fatigue</li><li>Pain or discomfort in the upper right abdomen</li><li>In more severe cases, abdominal swelling, enlarged blood vessels just beneath the skin\'s surface, and yellow skin and eyes (jaundice).</li></ul>',
    symptomsHi: '<ul><li>थकान</li><li>ऊपरी दाहिने पेट में दर्द या बेचैनी</li><li>अधिक गंभीर मामलों में, पेट में सूजन, त्वचा की सतह के ठीक नीचे रक्त वाहिकाओं का बढ़ना, और पीली त्वचा और आंखें (पीलिया)।</li></ul>',
    treatmentEn: 'Lifestyle changes are the main treatment for NAFLD. This includes losing weight, eating a healthy diet, exercising regularly, and avoiding alcohol.',
    treatmentHi: 'जीवनशैली में बदलाव NAFLD का मुख्य उपचार है। इसमें वजन कम करना, स्वस्थ आहार खाना, नियमित रूप से व्यायाम करना और शराब से बचना शामिल है।',
    whenToSeeDoctorEn: '<ul><li>If you have signs and symptoms that worry you, make an appointment with your doctor. Persistent fatigue or upper right abdominal pain should be evaluated.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपके पास ऐसे संकेत और लक्षण हैं जो आपको चिंतित करते हैं, तो अपने डॉक्टर से अपॉइंटमेंट लें। लगातार थकान या ऊपरी दाहिने पेट में दर्द का मूल्यांकन किया जाना चाहिए।</li></ul>',
  },
  {
    id: 'gout',
    nameEn: 'Gout',
    nameHi: 'गाउट (गठिया)',
    overviewEn: 'Gout is a common and complex form of arthritis that can affect anyone. It\'s characterized by sudden, severe attacks of pain, swelling, redness and tenderness in one or more joints, most often in the big toe.',
    overviewHi: 'गाउट गठिया का एक सामान्य और जटिल रूप है जो किसी को भी प्रभावित कर सकता है। यह एक या एक से अधिक जोड़ों में अचानक, गंभीर दर्द, सूजन, लाली और कोमलता के हमलों की विशेषता है, जो अक्सर बड़े पैर की अंगुली में होता है।',
    symptomsEn: '<ul><li>Intense joint pain, often in the large joint of your big toe</li><li>Lingering discomfort after the most severe pain subsides</li><li>Inflammation and redness</li><li>Limited range of motion</li></ul>',
    symptomsHi: '<ul><li>गहन जोड़ों का दर्द, अक्सर आपके बड़े पैर की अंगुली के बड़े जोड़ में</li><li>सबसे गंभीर दर्द कम होने के बाद भी बेचैनी बनी रहती है</li><li>सूजन और लाली</li><li>गति की सीमित सीमा</li></ul>',
    treatmentEn: 'Gout treatment usually involves medications. Which medications you and your doctor choose will be based on your current health and your own preferences. Medications can be used to treat acute attacks and prevent future attacks.',
    treatmentHi: 'गाउट के उपचार में आमतौर पर दवाएं शामिल होती हैं। आप और आपका डॉक्टर कौन सी दवाएं चुनते हैं, यह आपके वर्तमान स्वास्थ्य और आपकी अपनी प्राथमिकताओं पर आधारित होगा। दवाओं का उपयोग तीव्र हमलों का इलाज करने और भविष्य के हमलों को रोकने के लिए किया जा सकता है।',
    whenToSeeDoctorEn: '<ul><li>If you experience sudden, intense pain in a joint, call your doctor. Gout that is left untreated can lead to worsening pain and joint damage.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आप एक जोड़ में अचानक, तीव्र दर्द का अनुभव करते हैं, तो अपने डॉक्टर को बुलाएँ। अनुपचारित छोड़ दिया गया गाउट दर्द को बदतर बना सकता है और जोड़ों को नुकसान पहुंचा सकता है।</li></ul>',
  },
  {
    id: 'eczema',
    nameEn: 'Eczema (Atopic Dermatitis)',
    nameHi: 'एक्जिमा (एटॉपिक डर्मेटाइटिस)',
    overviewEn: 'Atopic dermatitis (eczema) is a condition that makes your skin red and itchy. It\'s common in children but can occur at any age. Atopic dermatitis is long lasting (chronic) and tends to flare periodically.',
    overviewHi: 'एटॉपिक डर्मेटाइटिस (एक्जिमा) एक ऐसी स्थिति है जो आपकी त्वचा को लाल और खुजलीदार बना देती है। यह बच्चों में आम है लेकिन किसी भी उम्र में हो सकता है। एटॉपिक डर्मेटाइटिस लंबे समय तक चलने वाला (क्रोनिक) होता है और समय-समय पर भड़कता है।',
    symptomsEn: '<ul><li>Dry skin</li><li>Itching, which may be severe, especially at night</li><li>Red to brownish-gray patches, especially on the hands, feet, ankles, wrists, neck, upper chest, eyelids, inside the bend of the elbows and knees</li><li>Small, raised bumps, which may leak fluid and crust over when scratched</li></ul>',
    symptomsHi: '<ul><li>रूखी त्वचा</li><li>खुजली, जो गंभीर हो सकती है, खासकर रात में</li><li>लाल से भूरे-धूसर धब्बे, विशेष रूप से हाथों, पैरों, टखनों, कलाइयों, गर्दन, ऊपरी छाती, पलकों पर, कोहनी और घुटनों के मोड़ के अंदर</li><li>छोटे, उभरे हुए दाने, जो खरोंचने पर तरल पदार्थ का रिसाव कर सकते हैं और पपड़ी बना सकते हैं</li></ul>',
    treatmentEn: 'Treatment for eczema includes moisturizing your skin regularly, using medicated creams or ointments to control itching and repair the skin, and avoiding triggers.',
    treatmentHi: 'एक्जिमा के उपचार में नियमित रूप से अपनी त्वचा को मॉइस्चराइज़ करना, खुजली को नियंत्रित करने और त्वचा की मरम्मत के लिए औषधीय क्रीम या मलहम का उपयोग करना और ट्रिगर्स से बचना शामिल है।',
    whenToSeeDoctorEn: '<ul><li>See a doctor if you or your child is so uncomfortable that the condition is affecting sleep and daily activities, has a skin infection, or continues to experience symptoms despite trying home remedies.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आप या आपका बच्चा इतना असहज है कि स्थिति नींद और दैनिक गतिविधियों को प्रभावित कर रही है, त्वचा में संक्रमण है, या घरेलू उपचार आज़माने के बावजूद लक्षण अनुभव करना जारी रखता है, तो डॉक्टर से मिलें।</li></ul>',
  },
  {
    id: 'psoriasis',
    nameEn: 'Psoriasis',
    nameHi: 'सोरायसिस',
    overviewEn: 'Psoriasis is a skin disease that causes a rash with itchy, scaly patches, most commonly on the knees, elbows, trunk and scalp. Psoriasis is a common, long-term (chronic) disease with no cure.',
    overviewHi: 'सोरायसिस एक त्वचा रोग है जो खुजली, पपड़ीदार पैच के साथ एक दाने का कारण बनता है, जो आमतौर पर घुटनों, कोहनी, धड़ और खोपड़ी पर होता है। सोरायसिस एक आम, दीर्घकालिक (क्रोनिक) बीमारी है जिसका कोई इलाज नहीं है।',
    symptomsEn: '<ul><li>A patchy rash that varies widely in how it looks from person to person</li><li>Rashes that vary in color, tending to be shades of purple with gray scale on brown or Black skin and pink or red with silver scale on white skin</li><li>Small scaling spots (commonly seen in children)</li><li>Dry, cracked skin that may bleed</li><li>Itching, burning or soreness</li></ul>',
    symptomsHi: '<ul><li>एक धब्बेदार दाने जो व्यक्ति-दर-व्यक्ति दिखने में बहुत भिन्न होता है</li><li>रंग में भिन्न होने वाले दाने, भूरी या काली त्वचा पर ग्रे स्केल के साथ बैंगनी रंग के और सफेद त्वचा पर चांदी के पैमाने के साथ गुलाबी या लाल रंग के होते हैं</li><li>छोटे पपड़ीदार धब्बे (आमतौर पर बच्चों में देखे जाते हैं)</li><li>सूखी, फटी त्वचा जिससे खून बह सकता है</li><li>खुजली, जलन या दर्द</li></ul>',
    treatmentEn: 'Psoriasis treatments aim to stop skin cells from growing so quickly and to remove scales. Options include creams and ointments (topical therapy), light therapy (phototherapy), and oral or injected medications.',
    treatmentHi: 'सोरायसिस उपचार का उद्देश्य त्वचा कोशिकाओं को इतनी तेजी से बढ़ने से रोकना और पपड़ियों को हटाना है। विकल्पों में क्रीम और मलहम (सामयिक चिकित्सा), प्रकाश चिकित्सा (फोटोथेरेपी), और मौखिक या इंजेक्ट की गई दवाएं शामिल हैं।',
    whenToSeeDoctorEn: '<ul><li>If you suspect that you may have psoriasis, see your doctor for an examination. Also, talk to your doctor if your psoriasis becomes severe or widespread, or causes you discomfort and pain.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आपको संदेह है कि आपको सोरायसिस हो सकता है, तो जांच के लिए अपने डॉक्टर से मिलें। इसके अलावा, अपने डॉक्टर से बात करें यदि आपका सोरायसिस गंभीर या व्यापक हो जाता है, या आपको असुविधा और दर्द का कारण बनता है।</li></ul>',
  },
  {
    id: 'cataract',
    nameEn: 'Cataract',
    nameHi: 'मोतियाबिंद',
    overviewEn: 'A cataract is a clouding of the normally clear lens of the eye. For people who have cataracts, seeing through cloudy lenses is a bit like looking through a frosty or fogged-up window.',
    overviewHi: 'मोतियाबिंद आंख के सामान्य रूप से स्पष्ट लेंस का धुंधला होना है। जिन लोगों को मोतियाबिंद होता है, उनके लिए धुंधले लेंस के माध्यम से देखना थोड़ा बर्फीले या धुंधले खिड़की से देखने जैसा होता है।',
    symptomsEn: '<ul><li>Clouded, blurred or dim vision</li><li>Increasing difficulty with vision at night</li><li>Sensitivity to light and glare</li><li>Needing brighter light for reading and other activities</li><li>Seeing "halos" around lights</li><li>Frequent changes in eyeglass or contact lens prescription</li></ul>',
    symptomsHi: '<ul><li>धुंधला, धुंधला या मंद दृष्टि</li><li>रात में दृष्टि के साथ बढ़ती कठिनाई</li><li>प्रकाश और चकाचौंध के प्रति संवेदनशीलता</li><li>पढ़ने और अन्य गतिविधियों के लिए तेज रोशनी की आवश्यकता</li><li>रोशनी के चारों ओर "प्रभामंडल" देखना</li><li>चश्मे या कॉन्टैक्ट लेंस के नुस्खे में बार-बार बदलाव</li></ul>',
    treatmentEn: 'When your prescription glasses can\'t clear your vision, the only effective treatment for cataracts is surgery. Cataract surgery involves removing the clouded lens and replacing it with a clear artificial lens.',
    treatmentHi: 'जब आपके नुस्खे वाले चश्मे आपकी दृष्टि को साफ नहीं कर सकते हैं, तो मोतियाबिंद का एकमात्र प्रभावी उपचार सर्जरी है। मोतियाबिंद सर्जरी में धुंधले लेंस को हटाना और उसे एक स्पष्ट कृत्रिम लेंस से बदलना शामिल है।',
    whenToSeeDoctorEn: '<ul><li>Make an appointment for an eye exam if you notice any changes in your vision.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आप अपनी दृष्टि में कोई परिवर्तन देखते हैं तो आंखों की जांच के लिए अपॉइंटमेंट लें।</li></ul>',
  },
  {
    id: 'glaucoma',
    nameEn: 'Glaucoma',
    nameHi: 'ग्लूकोमा (काला मोतिया)',
    overviewEn: 'Glaucoma is a group of eye conditions that damage the optic nerve, the health of which is vital for good vision. This damage is often caused by an abnormally high pressure in your eye.',
    overviewHi: 'ग्लूकोमा आंखों की स्थितियों का एक समूह है जो ऑप्टिक तंत्रिका को नुकसान पहुंचाता है, जिसका स्वास्थ्य अच्छी दृष्टि के लिए महत्वपूर्ण है। यह क्षति अक्सर आपकी आंख में असामान्य रूप से उच्च दबाव के कारण होती है।',
    symptomsEn: 'The signs and symptoms of glaucoma vary depending on the type and stage of your condition. For open-angle glaucoma, there are often no symptoms until significant vision loss occurs. For acute angle-closure glaucoma, symptoms include severe headache, eye pain, nausea and vomiting, and blurred vision.',
    symptomsHi: 'ग्लूकोमा के संकेत और लक्षण आपकी स्थिति के प्रकार और चरण के आधार पर भिन्न होते हैं। ओपन-एंगल ग्लूकोमा के लिए, अक्सर तब तक कोई लक्षण नहीं होते जब तक कि महत्वपूर्ण दृष्टि हानि न हो जाए। तीव्र एंगल-क्लोजर ग्लूकोमा के लिए, लक्षणों में गंभीर सिरदर्द, आंखों में दर्द, मतली और उल्टी, और धुंधली दृष्टि शामिल हैं।',
    treatmentEn: 'The damage caused by glaucoma can\'t be reversed. But treatment and regular checkups can help slow or prevent vision loss, especially if you catch the disease in its early stages. Treatment includes prescription eyedrops, oral medications, laser therapy, or surgery.',
    treatmentHi: 'ग्लूकोमा से होने वाले नुकसान को उलटा नहीं किया जा सकता है। लेकिन उपचार और नियमित जांच से दृष्टि हानि को धीमा करने या रोकने में मदद मिल सकती है, खासकर यदि आप बीमारी को उसके शुरुआती चरणों में पकड़ लेते हैं। उपचार में प्रिस्क्रिप्शन आईड्रॉप्स, मौखिक दवाएं, लेजर थेरेपी या सर्जरी शामिल हैं।',
    whenToSeeDoctorEn: '<ul><li>Regular eye exams are important to detect glaucoma early. If you experience severe eye pain, headache, or blurred vision, seek immediate medical care.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>ग्लूकोमा का जल्दी पता लगाने के लिए नियमित आंखों की जांच महत्वपूर्ण है। यदि आप गंभीर आंखों में दर्द, सिरदर्द, या धुंधली दृष्टि का अनुभव करते हैं, तो तत्काल चिकित्सा देखभाल लें।</li></ul>',
  },
  {
    id: 'vertigo',
    nameEn: 'Vertigo',
    nameHi: 'वर्टिगो (चक्कर आना)',
    overviewEn: 'Vertigo is a sensation of feeling off balance. If you have these dizzy spells, you might feel like you are spinning or that the world around you is spinning. It is often caused by a problem with the way balance works in the inner ear.',
    overviewHi: 'वर्टिगो संतुलन से बाहर महसूस होने की एक सनसनी है। यदि आपको ये चक्कर आते हैं, तो आपको ऐसा महसूस हो सकता है कि आप घूम रहे हैं या आपके आस-पास की दुनिया घूम रही है। यह अक्सर आंतरिक कान में संतुलन के काम करने के तरीके में समस्या के कारण होता है।',
    symptomsEn: '<ul><li>A sense of spinning, tilting, swaying, or being unbalanced</li><li>Nausea or vomiting</li><li>Abnormal or jerking eye movements (nystagmus)</li><li>Headache</li><li>Sweating</li><li>Ringing in the ears or hearing loss</li></ul>',
    symptomsHi: '<ul><li>घूमने, झुकने, झूलने या असंतुलित होने की भावना</li><li>मतली या उल्टी</li><li>असामान्य या झटकेदार आंखों की हरकतें (निस्टागमस)</li><li>सिरदर्द</li><li>पसीना आना</li><li>कानों में बजना या सुनने में कमी</li></ul>',
    treatmentEn: 'Treatment for vertigo depends on what\'s causing it. In many cases, vertigo goes away without any treatment. This is because your brain is able to adapt, at least in part, to the inner ear changes, relying on other mechanisms to maintain balance. For some, treatment is needed and may include vestibular rehabilitation or specific head maneuvers.',
    treatmentHi: 'वर्टिगो का उपचार इस बात पर निर्भर करता है कि इसका कारण क्या है। कई मामलों में, वर्टिगो बिना किसी उपचार के चला जाता है। ऐसा इसलिए है क्योंकि आपका मस्तिष्क आंतरिक कान के परिवर्तनों के अनुकूल होने में सक्षम है, कम से कम आंशिक रूप से, संतुलन बनाए रखने के लिए अन्य तंत्रों पर निर्भर करता है। कुछ के लिए, उपचार की आवश्यकता होती है और इसमें वेस्टिबुलर पुनर्वास या विशिष्ट सिर युद्धाभ्यास शामिल हो सकते हैं।',
    whenToSeeDoctorEn: 'See a doctor if you have new, severe, or persistent vertigo. Seek emergency medical care if your vertigo is accompanied by a new, different or severe headache, a fever, double vision or loss of vision, hearing loss, trouble speaking, or numbness or weakness.',
    whenToSeeDoctorHi: 'यदि आपको नया, गंभीर या लगातार चक्कर आता है तो डॉक्टर से मिलें। यदि आपके चक्कर के साथ एक नया, अलग या गंभीर सिरदर्द, बुखार, दोहरी दृष्टि या दृष्टि की हानि, सुनने में कमी, बोलने में परेशानी, या सुन्नता या कमजोरी हो तो आपातकालीन चिकित्सा देखभाल लें।',
  },
  {
    id: 'hypothyroidism',
    nameEn: 'Hypothyroidism (Underactive Thyroid)',
    nameHi: 'हाइपोथायरायडिज्म (अंडरएक्टिव थायराइड)',
    overviewEn: 'Hypothyroidism (underactive thyroid) is a condition in which your thyroid gland doesn\'t produce enough of certain crucial hormones. Hypothyroidism may not cause noticeable symptoms in the early stages.',
    overviewHi: 'हाइपोथायरायडिज्म (अंडरएक्टिव थायराइड) एक ऐसी स्थिति है जिसमें आपकी थायरॉयड ग्रंथि कुछ महत्वपूर्ण हार्मोन का पर्याप्त उत्पादन नहीं करती है। हाइपोथायरायडिज्म शुरुआती चरणों में ध्यान देने योग्य लक्षण पैदा नहीं कर सकता है।',
    symptomsEn: '<ul><li>Fatigue</li><li>Increased sensitivity to cold</li><li>Constipation</li><li>Dry skin</li><li>Weight gain</li><li>Puffy face</li><li>Hoarseness</li><li>Muscle weakness</li></ul>',
    symptomsHi: '<ul><li>थकान</li><li>ठंड के प्रति संवेदनशीलता में वृद्धि</li><li>कब्ज</li><li>रूखी त्वचा</li><li>वजन बढ़ना</li><li>फूला हुआ चेहरा</li><li>कर्कशता</li><li>मांसपेशियों की कमजोरी</li></ul>',
    treatmentEn: 'Standard treatment for hypothyroidism involves daily use of the synthetic thyroid hormone levothyroxine. This oral medication restores adequate hormone levels, reversing the signs and symptoms of hypothyroidism.',
    treatmentHi: 'हाइपोथायरायडिज्म के लिए मानक उपचार में सिंथेटिक थायराइड हार्मोन लेवोथायरोक्सिन का दैनिक उपयोग शामिल है। यह मौखिक दवा पर्याप्त हार्मोन स्तरों को पुनर्स्थापित करती है, हाइपोथायरायडिज्म के संकेतों और लक्षणों को उलट देती है।',
    whenToSeeDoctorEn: '<ul><li>See your doctor if you\'re feeling tired for no reason or have any of the other signs or symptoms of hypothyroidism, such as dry skin, a pale, puffy face, constipation or a hoarse voice.</li></ul>',
    whenToSeeDoctorHi: '<ul><li>यदि आप बिना किसी कारण के थका हुआ महसूस कर रहे हैं या हाइपोथायरायडिज्म के कोई अन्य संकेत या लक्षण हैं, जैसे कि सूखी त्वचा, पीला, फूला हुआ चेहरा, कब्ज या कर्कश आवाज, तो अपने डॉक्टर से मिलें।</li></ul>',
  }
];

    

