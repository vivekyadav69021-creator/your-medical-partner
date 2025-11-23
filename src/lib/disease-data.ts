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
    symptomsHi: `उच्च रक्तचाप वाले अधिकांश लोगों में कोई संकेत या लक्षण نہیں होते हैं, भले ही रक्तचाप की रीडिंग खतरनाक रूप से उच्च स्तर तक पहुंच जाए। कुछ लोगों को हो सकता है:
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
    treatmentHi: `अपनी जीवनशैली बदलने سے उच्च रक्तचाप को नियंत्रित करने में काफी मदद मिल सकती है। आपका डॉक्टर जीवनशैली में बदलाव की सिफारिश कर सकता ہے जिसमें शामिल हैं:
    <ul>
        <li>कम नमक वाला हृदय-स्वस्थ आहार खाना</li>
        <li>नियमित शारीरिक गतिविधि करना</li>
        <li>यदि आप अधिक वजन والے या मोटे हैं तो स्वस्थ वजन बनाए रखना या वजन कम करना</li>
        <li>आपके द्वारा पी जाने वाली शराब की मात्रा को सीमित करना</li>
        <li>मूत्रवर्धक, एसीई इनहिबिटर, या बीटा-ब्लॉकर्स जैसी दवाएं निर्धारित की जा सकती हैं।</li>
    </ul>`,
    whenToSeeDoctorEn: `You'll likely have your blood pressure checked as part of a routine doctor's appointment. Ask your doctor for a blood pressure reading at least every two years starting at age 18.`,
    whenToSeeDoctorHi: `नियमित डॉक्टर की मुलाकात के हिस्से के रूप में आपका रक्तचाप जांचा जाएगा। 18 साल की उम्र से शुरू होने वाले हर दो साल में कम से कम एक बार अपने डॉक्टर से रक्तचाप की रीडिंग के لیے पूछें।`,
  },
  {
    id: 'asthma',
    nameEn: 'Asthma',
    nameHi: 'अस्थमा (दमा)',
    overviewEn: 'Asthma is a condition in which your airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing, a whistling sound (wheezing) when you breathe out and shortness of breath.',
    overviewHi: 'अस्थमा एक ऐसी स्थिति है जिसमें आपके वायुमार्ग संकीर्ण और सूज जाते हैं और अतिरिक्त बलगम का उत्पादन कर सकते हैं। इससे सांस लेना मुश्किल हो सकता है और खांसी, सांस छोड़ते समय एक सीटी की आवाज (घरघराहट) और सांस की तकलीफ हो सकती है।',
    symptomsEn: '<ul><li>Shortness of breath</li><li>Chest tightness or pain</li><li>Wheezing when exhaling, which is a common sign of asthma in children</li><li>Trouble sleeping caused by shortness of breath, coughing or wheezing</li><li>Coughing or wheezing attacks that are worsened by a respiratory virus, such as a cold or the flu</li></ul>',
    symptomsHi: '<ul><li>सांस लेने में तकलीफ</li><li>सीने में जकड़न या दर्द</li><li>सांस छोड़ते समय घरघराहट, जो बच्चों में अस्थमा کا ایک عام संकेत ہے</li><li>सांस की तकलीफ, खांसी या घरघराहट के कारण सोने में परेशानी</li><li>खांसी या घरघराहट के दौरे जो श्वसन वायरस, जैसे सर्दी या फ्लू से बिगड़ जाते हैं</li></ul>',
    treatmentEn: 'Treatment usually involves learning to recognize your triggers, taking steps to avoid them and tracking your breathing to make sure your daily asthma medications are keeping symptoms under control. In case of an asthma flare-up, you may need to use a quick-relief inhaler.',
    treatmentHi: 'उपचार में आमतौर पर अपने ट्रिगर्स को पहचानना, उनसे बचने के लिए कदम उठाना और यह सुनिश्चित करने के لیے اپنی سانسوں पर नज़र रखना शामिल है कि आपकी दैनिक अस्थमा کی دوائیں लक्षणों को नियंत्रित रख रही ہیں। अस्थमा کے بڑھنے کی صورت میں، آپ کو فوری राहत देने والے इन्हेलर کا उपयोग करने کی आवश्यकता हो सकती है।',
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
    whenToSeeDoctorHi: 'यदि आपके पास निम्नलिखित में سے कोई भी संकेत या लक्षण हैं तो तुरंत अपने डॉक्टर سے मिलें या आपातकालीन कक्ष में जाएं, जो एक अधिक गंभीर चिकित्सा समस्या का संकेत दे सकता है: बिजली की तरह अचानक, गंभीर सिरदर्द, बुखार के साथ सिरदर्द, गर्दन میں अकड़न, भ्रम, दौरे, دوہری दृष्टि, शरीर के किसी بھی حصے میں सुन्नता या कमजोरी।',
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
    overviewHi: 'अवसाद एक मूड डिसऑर्डर है जो उदासी और रुचि की हानि की लगातार भावना का कारण बनता है। इसे प्रमुख अवसादग्रस्तता विकार या नैदानिक ​​अवसाद بھی کہا جاتا ہے, यह आपके महसूस کرنے, सोचने और व्यवहार करने کے तरीके को प्रभावित करता है और विभिन्न प्रकार کی भावनात्मक और शारीरिक समस्याओं का कारण बन सकता है।',
    symptomsEn: '<ul><li>Feelings of sadness, tearfulness, emptiness or hopelessness</li><li>Angry outbursts, irritability or frustration, even over small matters</li><li>Loss of interest or pleasure in most or all normal activities</li><li>Sleep disturbances, including insomnia or sleeping too much</li><li>Tiredness and lack of energy</li><li>Anxiety, agitation or restlessness</li></ul>',
    symptomsHi: '<ul><li>उदासी, रोना, खालीपन या निराशा की भावनाएं</li><li>गुस्से میں پھٹنا, चिड़चिड़ापन یا निराशा, यहां तक ​​कि छोटे मामलों पर بھی</li><li>अधिकांश या सभी सामान्य गतिविधियों میں रुचि या आनंद کی کمی</li><li>नींद میں गड़बड़ी, जिसमें अनिद्रा یا بہت زیادہ सोना شامل ہے</li><li>थकान और ऊर्जा की कमी</li><li>चिंता, आंदोलन या बेचैni</li></ul>',
    treatmentEn: 'Medication and psychotherapy are effective for most people with depression. Your primary care doctor or a psychiatrist can prescribe medications to relieve symptoms. Many people with depression also benefit from seeing a psychiatrist, psychologist or other mental health professional.',
    treatmentHi: 'अवसाद والے زیادہ تر لوگوں के लिए दवा और मनोचिकित्सा प्रभावी ہیں। आपका प्राथमिक देखभाल चिकित्सक या एक मनोचिकित्सक लक्षणों से राहत के लिए दवाएं लिख सकता है। अवसाद वाले कई लोगों को मनोचिकित्सक, मनोवैज्ञानिक या अन्य मानसिक स्वास्थ्य पेशेवर से मिलने سے بھی फायदा ہوتا ہے۔',
    whenToSeeDoctorEn: 'If you feel depressed, make an appointment to see your doctor or mental health professional as soon as you can. If you\'re reluctant to seek treatment, talk to a friend or loved one, any health care professional, a faith leader, or someone else you trust.',
    whenToSeeDoctorHi: 'यदि आप उदास महसूस करते हैं, તો जितनी جلدی हो सके اپنے ڈاکٹر یا মানসিক স্বাস্থ্য পেশাদার سے ملنے کے لیے अपॉइंटमेंट लें। यदि आप علاج کرانے میں संकोच کر रहे ہیں, તો کسی دوست یا عزیز, کسی भी स्वास्थ्य देखभाल पेशेवर, किसी धर्मगुरु, या کسی اور پر بھروسہ کرنے वाले شخص سے بات کریں۔',
  },
  {
    id: 'anxiety',
    nameEn: 'Anxiety Disorder',
    nameHi: 'चिंता विकार',
    overviewEn: 'It\'s normal to feel anxious from time to time. But people with anxiety disorders frequently have intense, excessive and persistent worry and fear about everyday situations. Often, anxiety disorders involve repeated episodes of sudden feelings of intense anxiety and fear or terror that reach a peak within minutes (panic attacks).',
    overviewHi: 'समय-समय पर चिंतित महसूस करना सामान्य है। लेकिन चिंता विकारों वाले لوگوں को अक्सर रोजमर्रा की स्थितियों के बारे में तीव्र, अत्यधिक और लगातार चिंता और भय होता है। अक्सर, चिंता विकारों में तीव्र चिंता और भय या आतंक की अचानक भावनाओं के बार-बार होने वाले एपिसोड शामिल होते हैं जो मिनटों کے اندر चरम पर पहुंच जाते हैं (पैनिक अटैक)।',
    symptomsEn: '<ul><li>Feeling nervous, restless or tense</li><li>Having a sense of impending danger, panic or doom</li><li>Having an increased heart rate</li><li>Breathing rapidly (hyperventilation)</li><li>Sweating</li><li>Trembling</li><li>Feeling weak or tired</li></ul>',
    symptomsHi: '<ul><li>घबराहट, बेचैनी या तनाव महसूस करना</li><li>आसन्न खतरे, घबराहट या विनाश की भावना होना</li><li>हृदय गति का बढ़ना</li><li>तेजी से सांस लेना (हाइपरवेंटिलेशन)</li><li>पसीना आना</li><li>कांपना</li><li>कमजोर या थका हुआ महसूस करना</li></ul>',
    treatmentEn: 'The two main treatments for anxiety disorders are psychotherapy and medications. You may benefit most from a combination of the two. It may take some trial and error to discover which treatments work best for you.',
    treatmentHi: 'चिंता विकारों کے لیے दो मुख्य उपचार मनोचिकित्सा और दवाएं हैं। आपको दोनों के संयोजन سے سب سے زیادہ फायदा हो सकता है। यह पता लगाने में کچھ परीक्षण और त्रुटि لگ सकती ہے کہ آپ کے لیے کون سے علاج سب سے اچھا کام کرتے ہیں۔',
    whenToSeeDoctorEn: 'See your doctor if you feel like you\'re worrying too much and it\'s interfering with your work, relationships or other parts of your life, your fear, worry or anxiety is upsetting to you and difficult to control, or you feel depressed, have trouble with alcohol or drug use, or have other mental health concerns along with anxiety.',
    whenToSeeDoctorHi: 'यदि आपको लगता है कि आप बहुत زیادہ चिंता कर रहे हैं और यह आपके काम, रिश्तों या आपके જીવન के अन्य हिस्सों में हस्तक्षेप कर रहा है, आपका डर, चिंता या बेचैनी आपको परेशान कर रही है और नियंत्रित करना मुश्किल है, या आप उदास महसूस करते ہیں, शराब या नशीली दवाओं کے उपयोग में परेशानी होती ہے, یا चिंता کے ساتھ अन्य मानसिक स्वास्थ्य संबंधी चिंताएं हैं, तो اپنے ڈاکٹر سے मिलें।',
  },
  {
    id: 'allergies',
    nameEn: 'Allergies',
    nameHi: 'एलर्जी',
    overviewEn: 'Allergies occur when your immune system reacts to a foreign substance — such as pollen, bee venom or pet dander — or a food that doesn\'t cause a reaction in most people.',
    overviewHi: 'एलर्जी तब होती है जब आपकी प्रतिरक्षा प्रणाली किसी बाहरी पदार्थ - जैसे पराग, मधुमक्खी का जहर या पालतू जानवरों की रूसी - या ऐसे भोजन पर प्रतिक्रिया करती है जो अधिकांश लोगों में प्रतिक्रिया का कारण नहीं बनता है।',
    symptomsEn: '<ul><li>Sneezing</li><li>Itching of the nose, eyes or roof of the mouth</li><li>Runny, stuffy nose</li><li>Watery, red or swollen eyes (conjunctivitis)</li><li>Tingling in the mouth</li><li>Swelling of the lips, tongue, face or throat</li><li>Hives</li></ul>',
    symptomsHi: '<ul><li>छींकना</li><li>नाक, आंखों या मुंह के ऊपरी हिस्से में खुजली</li><li>बहती, भरी हुई नाक</li><li>पानी वाली, लाल या सूजी ہوئی آنکھیں (नेत्रश्लेष्मलाशोथ)</li><li>मुंह में झुनझुनी</li><li>होंठ, जीभ, चेहरे یا گلے की सूजन</li><li>पित्ती</li></ul>',
    treatmentEn: 'Allergy treatment includes: Allergen avoidance, Medications to reduce symptoms, and Immunotherapy (allergy shots).',
    treatmentHi: 'एलर्जी के उपचार में शामिल हैं: એલર્જન से बचाव, लक्षणों को कम کرنے के लिए दवाएं, और इम्यूनोथेरेपी (एलर्जी शॉट्स)।',
    whenToSeeDoctorEn: 'See a doctor if you have symptoms you think might be caused by an allergy, and over-the-counter allergy medications don\'t provide enough relief. If you have symptoms after starting a new medication, call the doctor who prescribed it right away.',
    whenToSeeDoctorHi: 'यदि आपके پاس ایسے लक्षण ہیں جو آپ کو لگتا ہے کہ الرجی کی وجہ से ہو सकते हैं, اور اوور-دی-کاؤنٹر الرجی کی دوائیں کافی राहत नहीं देती हैं, تو डॉक्टर से मिलें। यदि आपको कोई نئی दवा شروع کرنے کے बाद लक्षण दिखाई دیتے ہیں, तो اسے تجویز करने वाले डॉक्टर को तुरंत फोन کریں।',
  },
  {
    id: 'flu',
    nameEn: 'Influenza (Flu)',
    nameHi: 'इन्फ्लूएंजा (फ्लू)',
    overviewEn: 'Influenza is a viral infection that attacks your respiratory system — your nose, throat and lungs. For most people, the flu resolves on its own. But sometimes, influenza and its complications can be deadly.',
    overviewHi: 'इन्फ्लूएंजा एक वायरल संक्रमण है जो आपके श्वसन तंत्र - आपकी नाक, गले और फेफड़ों पर हमला करता है। अधिकांश لوگوں के लिए, फ्लू अपने आप ٹھیک ہو جاتا ہے۔ لیکن कभी-कभी, इन्फ्लूएंजा और इसकी जटिलताएँ घातक हो सकती हैं।',
    symptomsEn: '<ul><li>Fever</li><li>Aching muscles</li><li>Chills and sweats</li><li>Headache</li><li>Dry, persistent cough</li><li>Shortness of breath</li><li>Tiredness and weakness</li><li>Runny or stuffy nose</li></ul>',
    symptomsHi: '<ul><li>बुखार</li><li>मांसपेशियों में दर्द</li><li>ठंड लगना और पसीना आना</li><li>सिरदर्द</li><li>सूखी, लगातार खांसी</li><li>सांस लेने में तकलीफ</li><li>थकान اور کمزوری</li><li>बहती یا بند ناک</li></ul>',
    treatmentEn: 'Usually, you\'ll need nothing more than rest and plenty of fluids to treat the flu. But if you have a severe infection or are at higher risk of complications, your doctor may prescribe an antiviral drug, such as oseltamivir (Tamiflu), zanamivir (Relenza), peramivir (Rapivab) or baloxavir (Xofluza).',
    treatmentHi: 'आमतौर पर, आपको फ्लू के इलाज के लिए आराम اور بہت सारे तरल पदार्थों से زیادہ कुछ نہیں चाहिए होगा। लेकिन अगर आपको गंभीर संक्रमण है या जटिलताओं का खतरा अधिक ہے, تو آپ کا ڈاکٹر ایک एंटीवायरल दवा लिख सकता है, जैसे कि oseltamivir (Tamiflu), zanamivir (Relenza), peramivir (Rapivab) या baloxavir (Xofluza)۔',
    whenToSeeDoctorEn: 'Most people who get the flu can treat themselves at home and don\'t need to see a doctor. If you have flu symptoms and are at risk of complications, see your doctor right away.',
    whenToSeeDoctorHi: 'फ्लू से पीड़ित अधिकांश लोग घर पर अपना इलाज कर सकते हैं और उन्हें डॉक्टर को दिखाने की आवश्यकता नहीं होती है। यदि आपको फ्लू के लक्षण हैं और जटिलताओं का खतरा है, तो तुरंत अपने डॉक्टर से मिलें।',
  },
  {
    id: 'pneumonia',
    nameEn: 'Pneumonia',
    nameHi: 'निमोनिया',
    overviewEn: 'Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm or pus, fever, chills, and difficulty breathing.',
    overviewHi: 'निमोनिया एक संक्रमण है जो एक या दोनों फेफड़ों में वायु थैली को फुला देता है। वायु थैली द्रव या मवाद سے भर सकती है, जिससे बलगम یا مवाद वाली खांसी, بخار, ठंड लगना, اور سانس लेने में कठिनाई होती ہے۔',
    symptomsEn: '<ul><li>Chest pain when you breathe or cough</li><li>Confusion or changes in mental awareness (in adults age 65 and older)</li><li>Cough, which may produce phlegm</li><li>Fatigue</li><li>Fever, sweating and shaking chills</li><li>Nausea, vomiting or diarrhea</li><li>Shortness of breath</li></ul>',
    symptomsHi: '<ul><li>सांस लेने या खांसने پر سینے میں درد</li><li>भ्रम या मानसिक जागरूकता में परिवर्तन (65 वर्ष اور اس سے अधिक عمر के वयस्कों में)</li><li>खांसी, जिससे बलगم پیدا हो सकता है</li><li>थकान</li><li>बुखार, पसीना और कंपकंपी वाली ठंड</li><li>मतली, उल्टी या दस्त</li><li>सांस लेने में तकलीफ</li></ul>',
    treatmentEn: 'Treatment for pneumonia involves curing the infection and preventing complications. Specific treatments depend on the type and severity of your pneumonia, your age and your overall health. The options include antibiotics, cough medicine, and fever reducers/pain relievers.',
    treatmentHi: 'निमोनिया के उपचार میں انفیکشن کو ٹھیک کرنا اور जटिलताओं को रोकना शामिल ہے۔ विशिष्ट उपचार आपके निमोनिया के प्रकार और गंभीरता, आपकी उम्र और आपके समग्र स्वास्थ्य पर निर्भर करते ہیں۔ विकल्पों میں اینٹی بائیوٹکس, کھانسی की દવા, اور بخار کم کرنے والی/درد निवारक شامل ہیں۔',
    whenToSeeDoctorEn: 'See your doctor if you have difficulty breathing, chest pain, persistent fever of 102 F (39 C) or higher, or a persistent cough, especially if you\'re coughing up pus.',
    whenToSeeDoctorHi: 'यदि आपको सांस लेने में कठिनाई, سینے میں درد, 102 F (39 C) या उससे अधिक کا लगातार بخار, या लगातार खांसी ہو, خاص طور پر اگر آپ کو کھانسی میں پیپ آ رہی ہو تو اپنے ڈاکٹر سے ملیں۔',
  },
  {
    id: 'gastroenteritis',
    nameEn: 'Viral Gastroenteritis (Stomach Flu)',
    nameHi: 'वायरल गैस्ट्रोएंटेराइटिस (पेट का फ्लू)',
    overviewEn: 'Gastroenteritis is an inflammation of the lining of the intestines caused by a virus, bacteria or parasites. It\'s often called the "stomach flu," although it is not caused by the influenza virus.',
    overviewHi: 'गैस्ट्रोएंटेराइटिस आंतों की परत की सूजन ہے जो वायरस, बैक्टीरिया یا پرجیویوں کی वजह سے होती ہے۔ اسے अक्सर "पेट کا فلو" कहा जाता है, हालांकि यह इन्फ्लूएंजा वायरस की वजह سے नहीं ہوتا ہے۔',
    symptomsEn: '<ul><li>Watery, usually nonbloody diarrhea</li><li>Abdominal cramps and pain</li><li>Nausea, vomiting or both</li><li>Occasional muscle aches or headache</li><li>Low-grade fever</li></ul>',
    symptomsHi: '<ul><li>पानीदार, आमतौर पर बिना खून वाला दस्त</li><li>पेट में ऐंठन और दर्द</li><li>मतली, उल्टी या दोनों</li><li>कभी-कभी मांसपेशियों में दर्द या सिरदर्द</li><li>हल्का बुखार</li></ul>',
    treatmentEn: 'There\'s often no specific medical treatment for viral gastroenteritis. Antibiotics aren\'t effective against viruses, and overusing them can contribute to the development of antibiotic-resistant strains of bacteria. Treatment usually consists of self-care measures, such as staying hydrated.',
    treatmentHi: 'वायरल गैस्ट्रोएंटेराइटिस के लिए अक्सर कोई विशिष्ट चिकित्सा उपचार نہیں ہوتا ہے۔ एंटीबायोटिक्स वायरस के खिलाफ प्रभावी नहीं होते हैं, और उनका अत्यधिक उपयोग बैक्टीरिया کے एंटीबायोटिक-प्रतिरोधी उपभेदों کے विकास में योगदान दे सकता ہے۔ उपचार میں आमतौर पर स्वयं की देखभाल के उपाय شامل ہوتے ہیں, جیسے کہ हाइड्रेटेड रहना।',
    whenToSeeDoctorEn: 'See a doctor if you are unable to keep liquids down for 24 hours, have been vomiting for more than two days, are vomiting blood, are dehydrated, notice blood in your bowel movements, or have a fever above 104 F (40 C).',
    whenToSeeDoctorHi: 'यदि आप 24 घंटे तक तरल पदार्थ नहीं पी पा रहे हैं, دو دن سے زیادہ समय से उल्टी कर रहे हैं, खून کی उल्टी कर रहे हैं, निर्जलित हैं, अपने मल में खून देखते हैं, या 104 F (40 C) से ऊपर बुखार है, तो डॉक्टर سے ملیں۔',
  },
  {
    id: 'copd',
    nameEn: 'COPD (Chronic Obstructive Pulmonary Disease)',
    nameHi: 'सीओपीडी (क्रॉनिक ऑब्सट्रक्टिव पल्मोनरी डिजीज)',
    overviewEn: 'Chronic obstructive pulmonary disease (COPD) is a chronic inflammatory lung disease that causes obstructed airflow from the lungs. Emphysema and chronic bronchitis are the two most common conditions that contribute to COPD.',
    overviewHi: 'क्रॉनic ऑब्सट्रक्टिव पल्मोनरी डिजीज (COPD) एक पुरानी सूजन वाली फेफड़ों की बीमारी ہے जो फेफड़ों से बाधित वायु प्रवाह का कारण बनती ہے۔ वातस्फीति और क्रॉनिक ब्रोंकाइटिस दो सबसे आम स्थितियां हैं जो COPD में योगदान करती हैं।',
    symptomsEn: '<ul><li>Shortness of breath, especially during physical activities</li><li>Wheezing</li><li>Chest tightness</li><li>A chronic cough that may produce mucus (sputum) that may be clear, white, yellow or greenish</li><li>Frequent respiratory infections</li><li>Lack of energy</li><li>Unintended weight loss (in later stages)</li></ul>',
    symptomsHi: '<ul><li>सांस की तकलीफ, खासकर शारीरिक गतिविधियों के दौरान</li><li>घरघराहट</li><li>सीने में जकड़न</li><li>एक पुरानी खांसी जो बलगम (थूक) पैदा कर सकती है जो स्पष्ट, सफेद, पीला या हरा हो सकता है</li><li>बार-बार श्वसन संक्रमण</li><li>ऊर्जा की कमी</li><li>अनपेक्षित वजन घटना (बाद के चरणों में)</li></ul>',
    treatmentEn: 'Many people with COPD have mild forms of the disease for which little therapy is needed other than smoking cessation. For more advanced stages of disease, effective therapy is available that can control symptoms, slow progression, reduce your risk of complications and exacerbations, and improve your ability to lead an active life.',
    treatmentHi: 'सीओपीडी वाले कई لوگوں को बीमारी کے ہلکے रूप होते हैं, जिसके लिए धूम्रपान छोड़ने کے अलावा बहुत کم चिकित्सा की आवश्यकता होती है। بیماری کے زیادہ উন্নত مراحل کے لیے, प्रभावी चिकित्सा उपलब्ध ہے जो लक्षणों को नियंत्रित कर सकती है, प्रगति کو धीमा कर सकती ہے, जटिलताओं और तीव्रता के जोखिम को कम کر सकती है, और एक सक्रिय जीवन जीने کی آپ की क्षमता میں सुधार کر سکتی ہے۔',
    whenToSeeDoctorEn: 'See your doctor if your symptoms are not improving with treatment or are getting worse, or if you notice any symptoms of an infection, such as a fever or a change in your sputum.',
    whenToSeeDoctorHi: 'यदि आपके लक्षण उपचार से बेहतर नहीं हो रहे हैं या खराब हो रहे हैं, या यदि आप संक्रमण के કોઈ लक्षण देखते हैं, जैसे कि बुखार या आपके थूक में পরিবর্তন, तो अपने डॉक्टर سے ملیں۔',
  },
  {
    id: 'bronchitis',
    nameEn: 'Bronchitis',
    nameHi: 'ब्रोंकाइटिस',
    overviewEn: 'Bronchitis is an inflammation of the lining of your bronchial tubes, which carry air to and from your lungs. People who have bronchitis often cough up thickened mucus, which can be discolored. Bronchitis may be either acute or chronic.',
    overviewHi: 'ब्रोंकाइटिस आपके ब्रोन्कियल ट्यूबों की परत की सूजन ہے, जो आपके फेफड़ों تک हवा ले जाती हैं और उनसे हवा ले जाती हैं। ब्रोंकाइटिस वाले लोग अक्सर گاڑھا بلغم کھانستے ہیں, જે રંગین ہو सकता ہے۔ ब्रोंकाइटिस یا तो तीव्र یا دائمی ہو سکتا ہے۔',
    symptomsEn: '<ul><li>Cough</li><li>Production of mucus (sputum), which can be clear, white, yellowish-gray or green in color</li><li>Fatigue</li><li>Shortness of breath</li><li>Slight fever and chills</li><li>Chest discomfort</li></ul>',
    symptomsHi: '<ul><li>खांसी</li><li>बलगम (थूक) का उत्पादन, जो स्पष्ट, सफेद, पीले-भूरे या हरे रंग کا हो सकता है</li><li>थकान</li><li>सांस लेने में तकलीफ</li><li>हल्का बुखार और ठंड लगना</li><li>सीने में तकलीफ</li></ul>',
    treatmentEn: 'Treatment for most cases of acute bronchitis is aimed at relieving symptoms. This may include cough medicines, rest, and plenty of fluids. Chronic bronchitis treatment is aimed at relieving symptoms and may include medications, pulmonary rehabilitation, and oxygen therapy.',
    treatmentHi: 'तीव्र ब्रोंकाइटिस के अधिकांश मामलों का उपचार लक्षणों से राहत दिलाने के उद्देश्य से किया जाता है। इसमें खांसी की दवाएं, आराम और बहुत सारे तरल पदार्थ शामिल हो सकते हैं। क्रॉनिक ब्रोंकाइटिस का उपचार लक्षणों से राहत दिलाने के उद्देश्य से किया जाता है और इसमें दवाएं, पल्मोनरी पुनर्वास और ऑक्सीजन थेरेपी शामिल हो सकती है।',
    whenToSeeDoctorEn: 'See your doctor if your cough lasts more than three weeks, prevents you from sleeping, is accompanied by fever higher than 100.4 F (38 C), produces discolored mucus, produces blood, or is associated with wheezing or shortness of breath.',
    whenToSeeDoctorHi: 'यदि आपकी खांसी तीन सप्ताह से अधिक समय तक रहती है, आपको सोने से रोकती ہے, 100.4 F (38 C) से अधिक बुखार के ساتھ ہوتی ہے, रंगीन बलगम पैदा करती है, खून पैदा करती है, या گھرघراہٹ یا سانس کی تکلیف से जुड़ी है, तो اپنے डॉक्टर سے ملیں۔',
  },
  {
    id: 'kidney-stones',
    nameEn: 'Kidney Stones',
    nameHi: 'गुर्दे की पथरी',
    overviewEn: 'Kidney stones (also called renal calculi, nephrolithiasis or urolithiasis) are hard deposits made of minerals and salts that form inside your kidneys. Diet, excess body weight, some medical conditions, and certain supplements and medications are among the many causes of kidney stones.',
    overviewHi: 'गुर्दे की पथरी (जिसे रीनल ক্যালকুলি, नेफ्रोलिथियासिस या यूरोलिथियासिस भी कहा जाता है) खनिजों और लवणों से बने कठोर जमाव होते हैं जो आपके गुर्दे के अंदर बनते हैं। आहार, अधिक शरीर का वजन, कुछ चिकित्सा स्थितियां, और कुछ पूरक اور دوائیں گردے کی पथری के कई कारणों میں سے हैं।',
    symptomsEn: '<ul><li>Severe, sharp pain in the side and back, below the ribs</li><li>Pain that radiates to the lower abdomen and groin</li><li>Pain that comes in waves and fluctuates in intensity</li><li>Pain or burning sensation while urinating</li><li>Pink, red or brown urine</li><li>Cloudy or foul-smelling urine</li></ul>',
    symptomsHi: '<ul><li>पसलियों کے نیچے, کنارے اور پیٹھ میں شدید, تیز درد</li><li>दर्द जो निचले पेट और कमर تک پھیلتا ہے</li><li>दर्द जो लहरों میں आता ہے اور तीव्रता میں उतार-चढ़ाव करता है</li><li>पेशाब کرتے समय درد یا جلن</li><li>गुलाबी, लाल या भूरा मूत्र</li><li>बादलदार या दुर्गंधयुक्त मूत्र</li></ul>',
    treatmentEn: 'Treatment for small stones may be as simple as drinking water and taking pain relievers. For larger stones, treatments might include medical procedures to break up or remove them. This includes extracorporeal shock wave lithotripsy (ESWL) or surgery.',
    treatmentHi: 'छोटे पत्थरों का इलाज पानी पीने اور درد निवारक लेने जितना सरल हो सकता ہے۔ بڑے पत्थरों کے लिए, उपचार میں उन्हें तोड़ने یا हटाने के لیے طبی प्रक्रियाएं شامل हो सकती हैं। इसमें एक्स्ट्राकोર્ਪोरियल शॉक वेव लिथोट्रिप्सी (ESWL) या سرجری शामिल ہے۔',
    whenToSeeDoctorEn: 'Make an appointment with your doctor if you have any signs and symptoms that worry you. Seek immediate medical attention if you experience pain so severe that you can\'t sit still or find a comfortable position, pain accompanied by nausea and vomiting, pain accompanied by fever and chills, or blood in your urine.',
    whenToSeeDoctorHi: 'यदि आपके پاس कोई संकेत और लक्षण हैं जो आपको चिंतित करते हैं तो अपने डॉक्टर سے अपॉइंटमेंट लें। यदि आप इतना شدید درد अनुभव करते ہیں کہ आप स्थिर नहीं बैठ सकते या आरामदायक स्थिति نہیں ڈھونڈ सकते, मतली और उल्टी के ساتھ درد, بخار اور ठंड کے ساتھ درد, یا آپ کے پیشاب میں خون ہے تو तत्काल طبی सहायता लें।',
  },
  {
    id: 'anemia',
    nameEn: 'Anemia',
    nameHi: 'एनीमिया (रक्ताल्पता)',
    overviewEn: 'Anemia is a condition in which you lack enough healthy red blood cells to carry adequate oxygen to your body\'s tissues. Having anemia, also referred to as low hemoglobin, can make you feel tired and weak.',
    overviewHi: 'एनीमिया एक ऐसी स्थिति है जिसमें आपके शरीर के ऊतकों तक पर्याप्त ऑक्सीजन ले जाने के लिए पर्याप्त स्वस्थ लाल रक्त कोशिकाओं की कमी होती है। एनीमिया होने पर, जिसे düşük हीमोग्लोबिन भी कहा जाता ہے, आपको थका हुआ और कमजोर महसूस करा सकता ہے۔',
    symptomsEn: '<ul><li>Fatigue</li><li>Weakness</li><li>Pale or yellowish skin</li><li>Irregular heartbeats</li><li>Shortness of breath</li><li>Dizziness or lightheadedness</li><li>Chest pain</li><li>Cold hands and feet</li></ul>',
    symptomsHi: '<ul><li>थकान</li><li>कमजोरी</li><li>पीली त्वचा</li><li>अनियमित दिल की धड़कन</li><li>सांस लेने में तकलीफ</li><li>चक्कर आना या हल्का-फुल्का महसूस करना</li><li>सीने में दर्द</li><li>ठंडे हाथ और पैर</li></ul>',
    treatmentEn: 'Anemia treatment depends on the cause. It can range from taking supplements to undergoing medical procedures. Treatments might include iron supplements for iron deficiency anemia, vitamin B-12 shots, or blood transfusions.',
    treatmentHi: 'एनीमिया کا علاج وجہ پر منحصر ہے۔ यह सप्लीमेंट्स لینے سے لے کر طبی प्रक्रियाएं کروانے तक ہو سکتا ہے۔ उपचार میں آئرن की कमी वाले एनीमिया کے لیے آئرن سپلیمنٹس, وٹامن B-12 شاٹس, یا خون چڑھانا شامل हो سکتا ہے۔',
    whenToSeeDoctorEn: 'See a doctor if you have unexplained fatigue or other signs of anemia. Some anemias, such as iron deficiency anemia or vitamin B-12 anemia, are common. But don\'t assume that if you\'re tired, you must be anemic.',
    whenToSeeDoctorHi: 'यदि आपको अस्पष्टीकृत थकान या एनीमिया के अन्य लक्षण हैं તો डॉक्टर से मिलें। कुछ एनीमिया, जैसे कि आयरन की कमी वाला एनीमिया या विटामिन बी-12 एनीमिया, आम हैं। लेकिन यह نہ مانیں کہ اگر आप تھکے ہوئے ہیں, तो آپ کو انیمیا होना चाहिए।',
  },
  {
    id: 'osteoporosis',
    nameEn: 'Osteoporosis',
    nameHi: 'ऑस्टियोपोरोसिस',
    overviewEn: 'Osteoporosis causes bones to become weak and brittle — so brittle that a fall or even mild stresses such as bending over or coughing can cause a fracture. Osteoporosis-related fractures most commonly occur in the hip, wrist or spine.',
    overviewHi: 'ऑस्टियोपोरोसिस हड्डियों को कमजोर और भंगुर बना देता है - इतना भंगुर कि गिरने یا ہلके तनाव जैसे کہ جھکने یا کھانسنے سے بھی فریکچر ہو سکتا ہے۔ ऑस्टियोपोरोसिस से संबंधित फ्रैक्चर सबसे आम طور پر کولہے, کلائی या ریڑھ की हड्डी میں होते ہیں۔',
    symptomsEn: 'There typically are no symptoms in the early stages of bone loss. But once your bones have been weakened by osteoporosis, you might have signs and symptoms that include: Back pain, caused by a fractured or collapsed vertebra, loss of height over time, a stooped posture, a bone that breaks much more easily than expected.',
    symptomsHi: 'हड्डियों के नुकसान के शुरुआती चरणों में आमतौर पर कोई लक्षण نہیں होते हैं। लेकिन एक बार जब आपकी हड्डियां ऑस्टियोपोरोसिस سے कमजोर हो जाती हैं, तो آپ के पास ऐसे संकेत اور लक्षण हो سکتے हैं जिनमें शामिल हैं: کمر درد, जो टूटी हुई یا ढह गई कशेरुका के कारण होता है, समय के ساتھ قد میں کمی, झुकी हुई मुद्रा, ایک हड्डी जो अपेक्षा سے کہیں زیادہ آسانی سے टूट جاتی ہے۔',
    treatmentEn:"Treatment recommendations are often based on an estimate of your risk of breaking a bone in the next 10 years using information such as a bone density test. If the risk isn't high, treatment might not include medication and might focus instead on lifestyle, safety and fall-prevention measures.",
    treatmentHi:"उपचार کی سفارشات अक्सर हड्डी घनत्व परीक्षण जैसी जानकारी کا उपयोग करके अगले 10 वर्षों میں ہڈی ٹوٹने के آپ کے خطرے کے تخمینے पर आधारित होती ہیں। यदि जोखिम अधिक नहीं है, તો उपचार में दवा شامل نہیں हो सकती ہے और इसके बजाय जीवनशैली, सुरक्षा और गिरने से बचाव کے اقدامات پر ध्यान केंद्रित کیا جا सकता ہے۔",
    whenToSeeDoctorEn: 'You might want to talk to your doctor about osteoporosis if you went through early menopause, took corticosteroids for several months at a time, or either of your parents had hip fractures.',
    whenToSeeDoctorHi: 'यदि آپ کو جلدی रजोनिवृत्ति ہوئی ہو, کئی مہینوں تک कोर्टिकोस्टेरॉइड्स लिए ہوں, या आपके माता-पिता میں سے کسی کو کولہے کا فریکچر ہوا हो तो آپ ऑस्टियोपोरोसिस کے बारे में اپنے डॉक्टर से بات करना चाहेंगे।',
  },
  {
    id: 'gerd',
    nameEn: 'GERD',
    nameHi: 'गर्ड (गैस्ट्रोएसोफेगल रिफ्लक्स डिजीज)',
    overviewEn: 'Gastroesophageal reflux disease (GERD) occurs when stomach acid frequently flows back into the tube connecting your mouth and stomach (esophagus). This backwash (acid reflux) can irritate the lining of your esophagus.',
    overviewHi: 'गैस्ट्रोएसोफेगल रिफ्लक्स रोग (GERD) तब होता है जब पेट کا एसिड अक्सर आपके मुंह اور پیٹ ( अन्नप्रणाली) کو جوڑنے वाली ट्यूब میں واپس بہتا ہے۔ यह बैकवाश (एसिड रिफ्लक्स) आपके अन्नप्रणाली की परत को परेशान कर सकता ہے۔',
    symptomsEn: '<ul><li>A burning sensation in your chest (heartburn), usually after eating, which might be worse at night</li><li>Chest pain</li><li>Difficulty swallowing</li><li>Regurgitation of food or sour liquid</li><li>Sensation of a lump in your throat</li></ul>',
    symptomsHi: '<ul><li>आपके सीने में जलन (हार्टबर्न), आमतौर पर खाने کے बाद, جو رات کو بدتر ہو سکتی है</li><li>सीने में दर्द</li><li>निगलने میں कठिनाई</li><li>भोजन या खट्टे तरल کا regurgitation</li><li>आपके गले में एक गांठ की सनसनी</li></ul>',
    treatmentEn: 'Treatment for GERD may include lifestyle changes, medications, or surgery. Lifestyle changes such as losing excess weight, eating smaller meals, and avoiding foods that trigger heartburn can help. Medications include antacids, H2 blockers, and proton pump inhibitors.',
    treatmentHi: 'गर्ड के उपचार میں जीवनशैली में बदलाव, दवाएं, या सर्जरी शामिल हो सकती है। जीवनशैली में बदलाव जैसे कि অতিরিক্ত وزن کم کرنا, छोटे भोजन करना, और उन खाद्य पदार्थों से बचना जो नाराज़गी کو متحرک کرتے हैं, मदद कर सकते ہیں۔ दवाओं میں एंटासिड, H2 ब्लॉकर्स, और प्रोटॉन पंप अवरोधक शामिल हैं।',
    whenToSeeDoctorEn: 'See your doctor if you experience severe or frequent GERD symptoms or use over-the-counter medications for heartburn more than twice a week.',
    whenToSeeDoctorHi: 'यदि आप गंभीर या बार-बार गर्ड के लक्षण अनुभव करते ہیں या सप्ताह میں دو बार से अधिक नाराज़गी के लिए ओवर-द-काउंटर दवाओं का उपयोग کرتے ہیں તો اپنے ڈاکٹر से मिलें।',
  },
  {
    id: 'ibs',
    nameEn: 'Irritable Bowel Syndrome (IBS)',
    nameHi: 'इरिटेबल बॉवेल सिंड्रोम (आईबीएस)',
    overviewEn: 'Irritable bowel syndrome (IBS) is a common disorder that affects the large intestine. Signs and symptoms include cramping, abdominal pain, bloating, gas, and diarrhea or constipation, or both. IBS is a chronic condition that you\'ll need to manage long term.',
    overviewHi: 'इरिटेबल बॉवेल सिंड्रोम (आईबीएस) एक आम विकार है जो बड़ी आंत को प्रभावित کرتا ہے۔ संकेतों और लक्षणों में ऐंठन, पेट दर्द, सूजन, गैस, और दस्त या कब्ज, या दोनों शामिल हैं। आईबीएस एक पुरानी स्थिति ہے जिसे آپ کو लंबे समय तक प्रबंधित کرنے کی आवश्यकता होगी।',
    symptomsEn: '<ul><li>Abdominal pain, cramping or bloating that is related to passing a bowel movement</li><li>Changes in appearance of bowel movement</li><li>Changes in how often you are having a bowel movement</li><li>Bloating, increased gas or mucus in the stool</li></ul>',
    symptomsHi: '<ul><li>पेट दर्द, ऐंठन या सूजन जो मल त्याग से संबंधित ہے</li><li>मल کی ظاہری شکل میں परिवर्तन</li><li>आप कितनी बार मल त्याग कर रहे ہیں اس میں परिवर्तन</li><li>मल में सूजन, गैस میں वृद्धि या बलगम</li></ul>',
    treatmentEn: 'Treatment of IBS focuses on relieving symptoms so that you can live as normally as possible. Mild signs and symptoms can often be controlled by managing stress and by making changes in your diet and lifestyle. Your doctor might also suggest medications.',
    treatmentHi: 'आईबीएस کا علاج लक्षणों سے राहत दिलाने पर केंद्रित ہے ताकि آپ यथासंभव सामान्य रूप से जी सकें। ہلके संकेतों और लक्षणों को अक्सर तनाव का प्रबंधन करके और अपने आहार और জীবনशैली में बदलाव करके नियंत्रित किया जा सकता ہے۔ आपका डॉक्टर दवाएं भी सुझा सकता ہے۔',
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
    treatmentHi: 'अन्यथा स्वस्थ बच्चों में, चिकनपॉक्स को आमतौर पर किसी चिकित्सा उपचार की आवश्यकता नहीं होती है। आपका डॉक्टर खुजली से राहत के लिए एक एंटीહિస్టਾਮિન लिख सकता है। जिन लोगों को जटिलताओं کا خطرہ अधिक होता ہے, उनके لیے डॉक्टर कभी-कभी संक्रमण की अवधि को कम करने और जटिलताओं کے जोखिम को कम करने میں مدد के लिए दवाएं लिखते हैं।',
    whenToSeeDoctorEn: 'See a doctor if the rash spreads to one or both eyes, the rash gets very red, warm or tender, or you experience dizziness, disorientation, rapid heartbeat, shortness of breath, tremors, loss of muscle coordination, or a worsening cough.',
    whenToSeeDoctorHi: 'यदि दाने एक या दोनों आंखों में फैल जाते हैं, दाने बहुत लाल, गर्म या कोमल हो जाते हैं, یا آپ کو चक्कर आना, भटकाव, तेज धड़कन, सांस کی تکلیف, कंपकंपी, मांसपेशियों کے समन्वय کا فقدان, یا बिगड़ती खांसी का अनुभव होता ہے, તો डॉक्टर سے ملیں۔',
  },
  {
    id: 'malaria',
    nameEn: 'Malaria',
    nameHi: 'मलेरिया',
    overviewEn: 'Malaria is a disease caused by a parasite. The parasite is transmitted to humans through the bites of infected mosquitoes. People who have malaria typically feel very sick with a high fever and shaking chills.',
    overviewHi: 'मलेरिया एक परजीवी کے कारण होने वाली بیماری ہے۔ यह परजीवी संक्रमित मच्छरों کے کاٹنے से मनुष्यों میں फैलता ہے۔ मलेरिया سے पीड़ित लोग आमतौर पर तेज بخار और कंपकंपी کے ساتھ बहुत بیمار महसूस करते ہیں۔',
    symptomsEn: '<ul><li>Fever</li><li>Chills</li><li>General feeling of discomfort</li><li>Headache</li><li>Nausea and vomiting</li><li>Diarrhea</li><li>Abdominal pain</li><li>Muscle or joint pain</li></ul>',
    symptomsHi: '<ul><li>बुखार</li><li>कंपकंपी</li><li>अस्वस्थता की सामान्य भावना</li><li>सिरदर्द</li><li>मतली और उल्टी</li><li>दस्त</li><li>पेट दर्द</li><li>मांसपेशियों या जोड़ों का दर्द</li></ul>',
    treatmentEn: 'Malaria is treated with prescription drugs to kill the parasite. The types of drugs and the length of treatment will vary, depending on the type of malaria parasite you have, the severity of your symptoms, your age, and whether you are pregnant.',
    treatmentHi: 'मलेरिया का इलाज پرजीवी को मारने کے लिए निर्धारित दवाओं से किया जाता ہے۔ दवाओं کے प्रकार اور علاج کی لمبائی आपके पास किस प्रकार का मलेरिया परजीवी है, आपके लक्षणों की गंभीरता, आपकी उम्र, और क्या आप गर्भवती ہیں, इस पर निर्भर करेगी।',
    whenToSeeDoctorEn: 'Talk to your doctor if you experience a fever while living in or after traveling to a high-risk malaria region. If you have severe symptoms, seek emergency medical attention.',
    whenToSeeDoctorHi: 'यदि आप किसी उच्च जोखिम वाले मलेरिया क्षेत्र میں رہتے ہوئے या यात्रा करने کے बाद بخار کا تجربہ کرتے हैं تو अपने ڈاکٹر से बात करें। यदि आपके लक्षण गंभीर हैं, તો आपातकालीन चिकित्सा सहायता लें।',
  },
  {
    id: 'tuberculosis',
    nameEn: 'Tuberculosis (TB)',
    nameHi: 'तपेदिक (टीबी)',
    overviewEn: 'Tuberculosis (TB) is a serious infectious disease that mainly affects the lungs. The bacteria that cause tuberculosis are spread from one person to another through tiny droplets released into the air via coughs and sneezes.',
    overviewHi: 'तपेदिक (टीबी) एक गंभीर संक्रामक रोग ہے جو મુખ્ય طور پر फेफड़ों کو متاثر کرتا ہے۔ तपेदिक کا कारण बनने वाले बैक्टीरिया ایک व्यक्ति سے दूसरे व्यक्ति میں کھانسی اور छींकوں के ذریعے हवा में छोड़ी گئی چھوٹی بوندوں से फैलते ہیں۔',
symptomsEn: '<ul><li>Coughing that lasts three or more weeks</li><li>Coughing up blood or mucus</li><li>Chest pain, or pain with breathing or coughing</li><li>Unintentional weight loss</li><li>Fatigue</li><li>Fever</li><li>Night sweats</li><li>Chills</li></ul>',
symptomsHi: '<ul><li>तीन या उससे अधिक सप्ताह तक खांसी रहना</li><li>खून یا بلغم वाली खांसी</li><li>सीने में दर्द, या सांस लेने یا کھانسنے کے ساتھ درد</li><li>अनजाने में वजन कम ہونا</li><li>थकान</li><li>बुखार</li><li>रात को पसीना आना</li><li>कंपकंपी</li></ul>',
    treatmentEn: 'Medications are the cornerstone of tuberculosis treatment. But treating TB takes much longer than treating other types of bacterial infections. You must take antibiotics for at least six to nine months.',
    treatmentHi: 'दवाएं तपेदिक के उपचार کا आधार हैं। लेकिन टीबी کا علاج अन्य प्रकार के जीवाणु संक्रमणوں کے علاج से कहीं زیادہ समय लेता ہے۔ आपको कम से کم چھ سے नौ महीने तक एंटीबायोटिक्स लेनी चाहिए।',
    whenToSeeDoctorEn:"See your doctor if you have a fever, unexplained weight loss, drenching night sweats or a persistent cough. These are often signs of TB but can also result from other medical problems.",
    whenToSeeDoctorHi:"यदि आपको बुखार, अस्पष्टीकृत वजन घटाने, रात को पसीना आने या लगातार खांसी हो तो ਆਪਣੇ डॉक्टर से मिलें। ये अक्सर टीबी के संकेत होते हैं लेकिन अन्य चिकित्सा समस्याओं के परिणामस्वरूप بھی ہو सकते हैं।",
  },
  {
    id: 'dengue',
    nameEn: 'Dengue Fever',
    nameHi: 'डेंगू बुखार',
    overviewEn: 'Dengue fever is a mosquito-borne illness that occurs in tropical and subtropical areas of the world. Mild dengue fever causes a high fever and flu-like symptoms. The severe form of dengue fever, also called dengue hemorrhagic fever, can cause serious bleeding, a sudden drop in blood pressure (shock) and death.',
    overviewHi: 'डेंगू बुखार एक मच्छर जनित बीमारी ਹੈ ਜੋ दुनिया के उष्णकटिबंधीय और उपोष्णकटिबंधीय क्षेत्रों میں होती ہے۔ ہلکے डेंगू बुखार में तेज بخار और फ्लू جیسے लक्षण होते ہیں۔ डेंगू बुखार का गंभीर रूप, جسے डेंगू रक्तस्रावी بخار भी कहा جاتا ہے, गंभीर रक्तस्राव, रक्तचाप में अचानक गिरावट (सदमे) और मृत्यु کا कारण बन سکتا ہے۔',
    symptomsEn: '<ul><li>High fever</li><li>Severe headache</li><li>Pain behind the eyes</li><li>Severe joint and muscle pain</li><li>Fatigue</li><li>Nausea</li><li>Vomiting</li><li>Skin rash, which appears two to five days after the onset of fever</li></ul>',
    symptomsHi: '<ul><li>तेज बुखार</li><li>गंभीर सिरदर्द</li><li>आंखों के पीछे दर्द</li><li>गंभीर जोड़ों और मांसपेशियों में दर्द</li><li>थकान</li><li>मतली</li><li>उल्टी</li><li>त्वचा पर दाने, जो बुखार শুরু होने के दो से पांच दिन बाद दिखाई देते हैं</li></ul>',
    treatmentEn: 'There is no specific medicine to treat dengue. Treatment focuses on relief of symptoms. This may include rest, plenty of fluids, and pain relievers like acetaminophen. Aspirin or ibuprofen should be avoided.',
    treatmentHi: 'डेंगू کے इलाज के लिए کوئی خاص दवा نہیں ہے۔ उपचार लक्षणों से राहत پر केंद्रित ہے۔ इसमें آرام, बहुत सारे तरल पदार्थ, اور एसिटामिनोफेन जैसी درد निवारक शामिल हो सकते हैं। एस्पिरिन یا इबुप्रोफेन से बचना चाहिए।',
    whenToSeeDoctorEn: 'Seek immediate medical attention if you develop any warning signs of severe dengue fever. Warning signs include severe stomach pain, persistent vomiting, bleeding from your gums or nose, blood in your urine, stools or vomit, or difficulty breathing.',
    whenToSeeDoctorHi: 'यदि आप गंभीर डेंगू बुखार के કોઈ चेतावनी संकेत विकसित करते हैं तो तत्काल चिकित्सा सहायता लें। चेतावनी संकेतों میں پیٹ में गंभीर दर्द, लगातार उल्टी, आपके मसूड़ों या नाक से खून बहना, आपके मूत्र, मल या उल्टी में खून, या सांस लेने में कठिनाई شامل ہے۔',
  },
  {
    id: 'typhoid',
    nameEn: 'Typhoid Fever',
    nameHi: 'टाइफाइड बुखार',
    overviewEn: 'Typhoid fever is a bacterial infection that can lead to a high fever, diarrhea, and vomiting. It can be fatal. It is caused by the bacteria Salmonella typhi. The infection is often passed on through contaminated food and drinking water.',
    overviewHi: 'टाइफाइड बुखार एक जीवाणु संक्रमण ہے जो तेज بخار, दस्त, और उल्टी کا कारण बन सकता ہے۔ यह घातक हो सकता ਹੈ। यह साल्मोनेला टाइफी बैक्टीरिया के कारण होता ਹੈ। संक्रमण अक्सर दूषित भोजन اور پینے کے पानी کے ذریعے फैलता ہے۔',
    symptomsEn: '<ul><li>Sustained fever that can be as high as 104 F (40 C)</li><li>Headache</li><li>Weakness and fatigue</li><li>Muscle aches</li><li>Sweating</li><li>Dry cough</li><li>Loss of appetite and weight loss</li><li>Stomach pain</li></ul>',
    symptomsHi: '<ul><li>लगातार बुखार जो 104 F (40 C) तक हो सकता है</li><li>सिरदर्द</li><li>कमजोरी और थकान</li><li>मांसपेशियों में दर्द</li><li>पसीना आना</li><li>सूखी खांसी</li><li>भूख न लगना और वजन कम होना</li><li>पेट दर्द</li></ul>',
    treatmentEn: 'Typhoid fever is treated with antibiotics which kill the Salmonella bacteria. Prior to the use of antibiotics, the fatality rate was 20%. Now, it is 1%-2%. With appropriate antibiotic therapy, there is usually improvement within one to two days and recovery within seven to 10 days.',
    whenToSeeDoctorHi: 'टाइफाइड بخار का इलाज एंटीबायोटिक दवाओं से किया जाता है जो साल्मोनेला बैक्टीरिया को मारते ہیں۔ एंटीबायोटिक दवाओं के उपयोग से पहले, मृत्यु दर 20% थी। अब, यह 1% -2% है। उचित एंटीबायोटिक थेरेपी के साथ, आमतौर पर एक से दो दिनों के भीतर सुधार होता है और सात से 10 दिनों کے اندر ठीक हो जाता ہے۔',
    whenToSeeDoctorEn: 'See a doctor immediately if you suspect you have typhoid fever. If you are traveling in a foreign country, you can usually call the consular section of your embassy for a list of doctors.',
    whenToseeDoctorHi: 'यदि आपको संदेह है कि आपको टाइफाइड بخار है તો तुरंत डॉक्टर से मिलें। यदि आप کسی विदेशी देश में यात्रा कर रहे हैं, તો आप आमतौर पर डॉक्टरों کی فہرست کے لیے अपने दूतावास کے कांसुलर सेक्शन کو کال کر सकते ہیں۔',
  },
  {
    id: 'jaundice',
    nameEn: 'Jaundice',
    nameHi: 'पीलिया',
    overviewEn: 'Jaundice is a condition in which the skin, whites of the eyes and mucous membranes turn yellow because of a high level of bilirubin, a yellow-orange bile pigment. Jaundice has many causes, including hepatitis, gallstones and tumors.',
    overviewHi: 'पीलिया एक ऐसी स्थिति है जिसमें त्वचा, आंखों का सफेद حصہ और श्लेष्म झिल्ली बिलीरुबिन کے उच्च स्तर के कारण पीले ہو جاتے हैं, जो एक पीला-नारंगी पित्त वर्णक ہے। पीलिया के कई कारण हैं, जिनमें हेपेटाइटिस, पित्त पथरी और ट्यूमर शामिल हैं।',
    symptomsEn: '<ul><li>Yellowing of the skin and the whites of the eyes</li><li>Pale stools</li><li>Dark urine</li><li>Itchiness</li></ul>',
    symptomsHi: '<ul><li>त्वचा और आंखों के सफेद हिस्से का पीला होना</li><li>पीला मल</li><li>गहरा मूत्र</li><li>खुजली</li></ul>',
    treatmentEn: 'Jaundice treatment targets the cause rather than the jaundice itself. Treatment may consist of supportive care for viral hepatitis, surgery for obstruction, or stopping a drug that is causing the jaundice.',
    treatmentHi: 'पीलिया का उपचार पीलिया के बजाय कारण को लक्षित करता ہے। उपचार में वायरल हेपेटाइटिस के लिए सहायक देखभाल, रुकावट کے لیے سرجری, या पीलिया पैदा करने वाली दवा کو रोकना شامل हो सकता ہے۔',
    whenToSeeDoctorEn: 'See a doctor if you have yellow discoloration of the skin or eyes, or if you have any of the other symptoms associated with jaundice.',
    whenToSeeDoctorHi: 'यदि आपकी त्वचा या आंखों का रंग पीला ہو गया है, या यदि आपको पीलिया سے जुड़े کوئی अन्य लक्षण हैं तो डॉक्टर से मिलें।',
  },
  {
    id: 'scurvy',
    nameEn: 'Scurvy',
    nameHi: 'स्कर्वी',
    overviewEn: 'Scurvy is a disease resulting from a lack of vitamin C (ascorbic acid). Early symptoms of deficiency include weakness, feeling tired, and sore arms and legs. Without treatment, decreased red blood cells, gum disease, changes to hair, and bleeding from the skin may occur.',
    overviewHi: 'स्कर्वी विटामिन सी (एस्कॉर्बिक एसिड) की कमी से होने वाली बीमारी ہے। कमी के शुरुआती लक्षणों में कमजोरी, تھکا हुआ محسوس करना, और हाथ-पैर में दर्द شامل ہیں۔ इलाज के बिना, लाल रक्त कोशिकाओं में कमी, मसूड़ों की बीमारी, बालों میں बदलाव, और त्वचा سے खून बहना ہو सकता ہے۔',
    symptomsEn: '<ul><li>Fatigue and weakness</li><li>Gum disease (gingivitis)</li><li>Easy bruising and bleeding</li><li>Joint pain</li><li>Poor wound healing</li><li>Depression</li></ul>',
    symptomsHi: '<ul><li>थकान और कमजोरी</li><li>मसूड़ों की बीमारी (मसूड़े की सूजन)</li><li>آसانی سے चोट लगना اور خون بہنا</li><li>जोड़ों का दर्द</li><li>घाव का खराब भरना</li><li>अवसाद</li></ul>',
    treatmentEn: 'Scurvy is treated by taking vitamin C supplements and eating a diet rich in vitamin C. Many of the symptoms improve within a few days to a few weeks.',
    treatmentHi: 'स्कर्वी का इलाज विटामिन सी سپلیمنٹس लेने اور وٹامن सी سے ભરપૂર आहार खाने سے کیا جاتا ہے۔ कई लक्षण कुछ दिनों से लेकर कुछ ہفتوں میں بہتر ہو जाते ہیں۔',
    whenToSeeDoctorEn: 'If you are experiencing symptoms of scurvy, you should see a doctor. It is a serious condition that can lead to severe complications if left untreated.',
    whenToSeeDoctorHi: 'यदि आप स्कर्वी के लक्षण अनुभव कर रहे ہیں, तो आपको डॉक्टर से मिलना चाहिए। यह एक गंभीर स्थिति है जो इलाज न करने पर गंभीर जटिलताओं का باعث بن सकती ہے۔',
  },
  {
    id: 'cholera',
    nameEn: 'Cholera',
    nameHi: 'हैजा',
    overviewEn: 'Cholera is an acute diarrheal illness caused by infection of the intestine with the bacterium Vibrio cholerae. People can get sick when they swallow food or water contaminated with cholera bacteria. The infection is often mild or without symptoms, but can sometimes be severe and life-threatening.',
    overviewHi: 'हैजा विब्रियो कोलेरी जीवाणु से आंत के संक्रमण کے कारण होने वाली ایک তীব্র अतिसार की बीमारी ہے۔ لوگ جب ਹੈਜੇ के जीवाणु से दूषित भोजन या पानी निगलते हैं तो बीमार पड़ सकते हैं। संक्रमण अक्सर हल्का या बिना लक्षणों वाला होता है, लेकिन कभी-कभी गंभीर اور جان لیوا हो سکتا ہے۔',
    symptomsEn: '<ul><li>Profuse watery diarrhea</li><li>Vomiting</li><li>Leg cramps</li><li>Rapid loss of body fluids leads to dehydration and shock.</li></ul>',
    symptomsHi: '<ul><li>अत्यधिक पानीदार दस्त</li><li>उल्टी</li><li>पैरों में ऐंठन</li><li>शरीर के तरल पदार्थों का तेजी से नुकसान निर्जलीकरण और सदमे का कारण बनता है।</li></ul>',
    treatmentEn: 'Cholera can be simply and successfully treated by immediate replacement of the fluid and salts lost through diarrhea. Patients can be treated with oral rehydration solution (ORS), a prepackaged mixture of sugar and salts to be mixed with 1 liter of water.',
    treatmentHi: 'हैजा का इलाज दस्त के माध्यम से खोए हुए तरल पदार्थ और लवणوں के तत्काल प्रतिस्थापन দ্বারা सरल اور सफलतापूर्वक किया जा सकता ہے۔ रोगियों کا علاج ओरल रिहाइड्रेशन सॉल्यूशन (ORS) سے کیا جا सकता ہے, ਜੋ चीनी और लवणों का ایک प्रीपैकेज्ड मिश्रण ہے जिसे 1 लीटर पानी میں ملایا جانا ہے۔',
    whenToSeeDoctorEn: 'If you have severe, watery diarrhea and vomiting — especially after eating raw shellfish or traveling to a country where cholera is endemic — seek medical help immediately.',
    whenToSeeDoctorHi: 'यदि आपको गंभीर, पानीदार दस्त और उल्टी हो रही ہے - विशेष रूप से कच्ची शंख खाने یا ऐसे देश की यात्रा करने के बाद जहां हैजा स्थानिक है - તો तुरंत चिकित्सा सहायता लें।',
  },
  {
    id: 'goitre',
    nameEn: 'Goitre',
    nameHi: 'घेंघा',
    overviewEn: 'A goiter is an abnormal enlargement of your thyroid gland. Your thyroid is a butterfly-shaped gland located at the base of your neck just below your Adam\'s apple. Although goiters are usually painless, a large goiter can cause a cough and make it difficult for you to swallow or breathe.',
    overviewHi: 'घेंघा आपकी थायरॉयड ग्रंथि का एक असामान्य इज़ाफ़ा ਹੈ। आपका थायराइड एक तितلی के आकार की ग्रंथि ਹੈ जो आपकी गर्दन کے आधार पर आपके Adam\'s apple کے ठीक नीचे स्थित ਹੈ। यद्यपि घेंघा आमतौर पर दर्द रहित होते हैं, ایک بڑا گھینگا खांसी کا कारण बन सकता है اور آپ کے لیے نگلنا یا سانس لینا مشکل बना सकता ہے۔',
    symptomsEn: '<ul><li>A visible swelling at the base of your neck</li><li>A tight feeling in your throat</li><li>Coughing</li><li>Hoarseness</li><li>Difficulty swallowing or breathing</li></ul>',
symptomsHi: '<ul><li>आपकी गर्दन के आधार पर एक दृश्य सूजन</li><li>आपके गले में जकड़न का एहसास</li><li>खांसी</li><li>कर्कशता</li><li>निगलने या सांस लेने میں कठिनाई</li></ul>',
    treatmentEn: 'Goiter treatment depends on the size of the goiter, your signs and symptoms, and the underlying cause. Your doctor might recommend observation, medications, surgery, or radioactive iodine therapy.',
    treatmentHi: 'घेंघा का उपचार घेंघा के आकार, आपके संकेतों और लक्षणों, और अंतर्निहित कारण पर निर्भर करता है। आपका डॉक्टर अवलोकन, दवाओं, सर्जरी, या रेडियोधर्मी आयोडीन थेरेपी की सिफारिश कर सकता है।',
    whenToSeeDoctorEn: 'See your doctor if you have a visible swelling in your neck or experience any of the signs or symptoms of a goiter.',
    whenToSeeDoctorHi: 'यदि आपकी गर्दन میں کوئی দৃশ্যমান سوجن ہے یا آپ کو گھینگے کے کوئی संकेत या लक्षण અનુભવ होते हैं तो अपने ڈاکٹر से मिलें।',
  },
  {
    id: 'rabies',
    nameEn: 'Rabies',
    nameHi: 'रेबीज',
    overviewEn: 'Rabies is a deadly virus spread to people from the saliva of infected animals. The rabies virus is usually transmitted through a bite. Animals most likely to transmit rabies include bats, coyotes, foxes, raccoons, and skunks.',
    overviewHi: 'रेबीज ਇੱਕ ਘਾਤਕ ਵਾਇਰਸ ਹੈ ਜੋ ਸੰਕਰਮਿਤ ਜਾਨਵਰਾਂ ਦੀ ਲार ਤੋਂ ਲੋਕਾਂ ਵਿੱਚ ਫੈਲਦਾ ਹੈ। रेबीज वायरस आमतौर پر ਇੱਕ काटने के माध्यम سے फैलता ਹੈ। जिन जानवरों से रेबीज फैलने की सबसे अधिक संभावना ہوتی ہے ان میں چمگادڑ, कोयोट, लोमड़ी, रैकून, اور سکنک شامل ہیں۔',
    symptomsEn: '<ul><li>Fever</li><li>Headache</li><li>Nausea and vomiting</li><li>Agitation, anxiety, confusion</li><li>Hyperactivity, difficulty swallowing</li><li>Excessive salivation</li><li>Fear of water (hydrophobia) because of the difficulty in swallowing</li></ul>',
symptomsHi: '<ul><li>बुखार</li><li>सिरदर्द</li><li>मतली اور الटी</li><li>आंदोलन, चिंता, भ्रम</li><li>अति सक्रियता, निगलने में कठिनाई</li><li>अत्यधिक लार</li><li>निगलने میں कठिनाई کے कारण पानी سے ڈر (हाइड्रोफोबिया)</li></ul>',
    treatmentEn: 'Once a rabies infection is established, there\'s no effective treatment. Though a small number of people have survived rabies, the disease usually causes death. For that reason, if you think you\'ve been exposed to rabies, you must get a series of shots to prevent the infection from taking hold.',
    treatmentHi: 'एक बार रेबीज संक्रमण स्थापित हो जाने पर, कोई प्रभावी उपचार नहीं है। हालांकि कुछ लोगों نے रेबीज سے جان بچائی ہے, यह بیماری आमतौर पर मौत کا سبب بنتی ہے۔ इस कारण से, यदि आपको लगता है कि आप रेबीज کے संपर्क میں आए हैं, तो आपको संक्रमण को पकड़نے से रोकने کے लिए शॉट्स की ایک श्रृंखला लेनी चाहिए।',
    whenToSeeDoctorEn:"Seek immediate medical care if you are bitten by any animal, or if an animal's saliva gets into an open wound.",
    whenToSeeDoctorHi:"यदि آپ کو કોઈ جانور کاٹ લેता है, या यदि किसी جانور کی لار کھلے زخم में चली जाती है તો तुरंत चिकित्सा देखभाल लें।",
  },
  {
    id: 'rickets',
    nameEn: 'Rickets',
    nameHi: 'रिकेट्स (सूखा रोग)',
    overviewEn: 'Rickets is the softening and weakening of bones in children, usually because of an extreme and prolonged vitamin D deficiency. Adding vitamin D or calcium to the diet generally corrects the bone problems associated with rickets.',
    overviewHi: 'रिकेट्स बच्चों में हड्डियों का नरम और कमजोर होना है, आमतौर पर विटामिन डी की अत्यधिक और लंबी कमी کے कारण। आहार में विटामिन डी या कैल्शियम जोड़ने से आमतौर पर रिकेट्स से जुड़ी हड्डियों کی समस्याएं ठीक हो जाती हैं।',
    symptomsEn: '<ul><li>Delayed growth</li><li>Delayed motor skills</li><li>Pain in the spine, pelvis and legs</li><li>Muscle weakness</li><li>Bowed legs or knock-knees</li><li>Thickened wrists and ankles</li><li>Breastbone projection</li></ul>',
    symptomsHi: '<ul><li>धीमा विकास</li><li>देरी से मोटर कौशल</li><li>रीढ़, श्रोणि और पैरों में दर्द</li><li>मांसपेशियों की कमजोरी</li><li> झुकी हुई टांगें या नॉक-नी</li><li>मोटी कलाइयां और टखने</li><li>उरोस्थि प्रक्षेपण</li></ul>',
    treatmentEn: 'Treatment for rickets focuses on replacing the vitamin D or calcium in the body. If your child has a skeletal deformity, such as severely bowed legs, your doctor may suggest surgery to correct the problem.',
    treatmentHi: 'रिकेट्स का उपचार शरीर में विटामिन डी या कैल्शियम को बदलने पर केंद्रित ہے। यदि आपके बच्चे میں کوئی कंकाल विकृति ہے, जैसे कि गंभीर रूप से झुकी हुई टांगें, तो आपका डॉक्टर समस्या को ठीक کرنے کے لیے سرجری کا सुझाव दे सकता ہے۔',
    whenToSeeDoctorEn: 'See your doctor if your child develops bone pain, muscle weakness or obvious skeletal deformities.',
fromToSeeDoctorHi: 'यदि आपके बच्चे में हड्डियों میں درد, मांसपेशियों में कमजोरी या स्पष्ट कंकाल विकृति विकसित होती है તો ਆਪਣੇ ڈاکٹر से मिलें।',
  },
  {
    id: 'ringworm',
    nameEn: 'Ringworm',
    nameHi: 'दाद',
    overviewEn: 'Ringworm of the body (tinea corporis) is a rash caused by a fungal infection. It\'s usually a red, itchy, circular rash with clearer skin in the middle. Ringworm gets its name from its appearance. No worm is involved.',
    overviewHi: 'शरीर का दाद (टिनिया कॉर्पोरिस) એક फंगल संक्रमण के कारण होने वाला दाने ਹੈ। ਇਹ ਆਮ ਤੌਰ पर ਇੱਕ लाल, खुजली वाला, गोलाकार दाने होता ਹੈ ਜਿਸਦੇ बीच میں صاف جلد ਹੁੰਦੀ ਹੈ। दाद का नाम इसकी उपस्थिति से मिलता है। इसमें कोई کیڑا शामिल नहीं ਹੈ।',
    symptomsEn: '<ul><li>A scaly ring-shaped area, typically on the buttocks, trunk, arms and legs</li><li>A clear or scaly area inside the ring, perhaps with a scattering of bumps</li><li>Slightly raised, expanding rings</li><li>A round, flat patch of itchy skin</li></ul>',
    symptomsHi: '<ul><li>एक पपड़ीदार अंगूठी کے आकार کا क्षेत्र, आमतौर پر नितंबوں, धड़, بازوؤں और ٹانگوں پر</li><li>अंगूठी के اندر ایک صاف یا پپड़ीदार क्षेत्र, शायद धक्कों کے بکھराव کے ساتھ</li><li>थोड़ा उभड़ा हुआ, پھیلتا ہوا حلقہ</li><li>खुजली والی جلد کا ایک گول, چپٹا પેچ</li></ul>',
    treatmentEn: 'For mild ringworm, your doctor may suggest an over-the-counter antifungal cream, lotion, or powder. For more-severe infections, you might need prescription-strength topical medications or antifungal pills.',
    treatmentHi: 'ہلکے داد کے لیے, आपका डॉक्टर एक ओवर-द-काउंटर एंटीफंगल क्रीम, लोशन, या पाउडर का सुझाव دے سکتا ہے۔ વધુ ગંભીર संक्रमणों کے لیے, आपको प्रिस्क्रिप्शन-strength टॉपिकल दवाओं या एंटीफंगल गोलियों की आवश्यकता हो सकती है।',
    whenToSeeDoctorEn: 'See your doctor if you have a rash on your skin that doesn\'t improve within two weeks of using an over-the-counter antifungal product.',
    whenToSeeDoctorHi: 'यदि आपकी त्वचा पर कोई दाने है जो ओवर-द-काउंटर एंटीफंगल उत्पाद کا उपयोग करने के दो सप्ताह کے अंदर بہتر نہیں ہوتا ہے તો اپنے डॉक्टर سے ملیں۔',
  }
];
