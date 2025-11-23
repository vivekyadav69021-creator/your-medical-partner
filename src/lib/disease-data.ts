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
        <li>बहती یا بھری ہوئی ناک</li>
        <li>गले में खराश</li>
        <li>खांसी</li>
        <li>संकुलन</li>
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
    treatmentHi: `सामान्य जुकाम का कोई इलाज नहीं है। उपचार लक्षणों और लक्षणों से राहत दिलाने पर निर्देशित होता है। विकल्पों में शामिल हैं:
    <ul>
        <li><strong>दर्द निवारक।</strong> बुखार, गले में खराش और सिरदर्द के लिए।</li>
        <li><strong>डिकॉन्गेस्टेंट नेज़ल स्प्रे।</strong> जकड़न से राहत पाने के لیے۔</li>
        <li><strong>खांसी की दवाई।</strong> खांसी को शांत کرنے کے لیے۔</li>
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
    whenToSeeDoctorHi: `यदि आपके पास है तो डॉक्टर से मिलें:
    <ul>
        <li>101.3 F (38.5 C) या उससे अधिक का बुखार</li>
        <li>बुखार जो पांच दिनों तक रहता है या बुखार रहित अवधि के बाद वापस आ जाता है</li>
        <li>सांस लेने में कठिनाई</li>
        <li>घरघराहट</li>
        <li>गले में شدید درد، सिरदर्द یا سائن痛</li>
    </ul>`,
  },
  {
    id: 'diabetes',
    nameEn: 'Diabetes',
    nameHi: 'मधुमेह',
    overviewEn: 'Diabetes mellitus refers to a group of diseases that affect how your body uses blood sugar (glucose). Glucose is an important source of energy for the cells that make up your muscles and tissues.',
    overviewHi: 'डायबिटीज मेलिटस उन बीमारियों के समूह को संदर्भित करता है जो आपके शरीर द्वारा रक्त शर्करा (ग्लूकोज) का उपयोग करने के तरीके को प्रभावित करते हैं। ग्लूकोज आपकी मांसपेशियों और ऊतकों کو बनाने वाली कोशिकाओं کے لیے ऊर्जा کا ایک اہم स्रोत ہے۔',
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
        <li>अत्यधिक भूख</li>
        <li>अस्पष्टीकृत वजन घटना</li>
        <li>मूत्र में कीटोन की उपस्थिति</li>
        <li>थकान</li>
        <li>चिड़चिड़ापन</li>
        <li>धुंधली दृष्टि</li>
        <li>धीमी गति से ठीक होने वाले घाव</li>
    </ul>`,
    treatmentEn: `Treatment for diabetes requires keeping close watch over your blood sugar levels. Depending on what type of diabetes you have, insulin, oral medications, or both may be needed.
    <ul>
        <li>Monitoring your blood sugar</li>
        <li>Insulin therapy</li>
        <li>Oral or other medications</li>
        <li>Healthy diet and regular exercise</li>
    </ul>`,
    treatmentHi: `मधुमेह के उपचार के लिए आपके रक्त शर्करा के स्तर पर कड़ी नजर रखने की आवश्यकता होती है। మీకు ఏ రకమైన డయాబెటిస్ ఉందో బట్టి, ఇన్సులిన్, ఓరల్ మందులు లేదా రెండూ అవసరం కావచ్చు.
    <ul>
        <li>अपने रक्त शर्करा کی نگرانی کرنا</li>
        <li>इंसुलin थेरेपी</li>
        <li>मौखिक या अन्य दवाएं</li>
        <li>स्वस्थ आहार और नियमित व्यायाम</li>
    </ul>`,
    whenToSeeDoctorEn: `If you suspect you or your child may have diabetes. If you notice any possible diabetes symptoms, contact your doctor. The earlier the condition is diagnosed, the sooner treatment can begin.`,
    whenToSeeDoctorHi: `यदि आपको संदेह है कि आपको या आपके बच्चे को मधुमेह हो सकता है। यदि आप मधुमेह के किसी भी संभावित लक्षण को देखते हैं, तो اپنے ڈاکٹر سے संपर्क करें। जितनी جلدی اس حالت کی تشخیص होगी، उतनी ہی جلدی علاج شروع کیا جا سکتا ہے۔`,
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
    symptomsHi: `उच्च रक्तचाप वाले अधिकांश लोगों में કોઈ संकेत یا लक्षण نہیں होते हैं, भले ही रक्तचाप کی ریڈنگ खतरनाक रूप سے اعلی سطح تک पहुंच जाए। कुछ لوگوں को हो सकता है:
    <ul>
        <li>सिरदर्द</li>
        <li>सांस लेने में कठिनाई</li>
        <li>नकसीर</li>
    </ul>
    लेकिन ये संकेत और लक्षण विशिष्ट नहीं हैं और आमतौर पर तब तक ਨਹੀਂ ہوتے جب تک کہ उच्च रक्तचाप ایک شدید या جان لیوا مرحلے تک نہ पहुंच जाए।`,
    treatmentEn: `Changing your lifestyle can go a long way toward controlling high blood pressure. Your doctor may recommend lifestyle changes including:
    <ul>
        <li>Eating a heart-healthy diet with less salt</li>
        <li>Getting regular physical activity</li>
        <li>Maintaining a healthy weight or losing weight if you're overweight or obese</li>
        <li>Limiting the amount of alcohol you drink</li>
        <li>Medications such as diuretics, ACE inhibitors, or beta-blockers may be prescribed.</li>
    </ul>`,
    treatmentHi: `अपनी জীবনধারা बदलने से उच्च रक्तचाप کو नियंत्रित करने میں काफी मदद مل सकती ہے۔ آپ کا डॉक्टर जीवनशैली میں बदलाव کی سفارش کر सकता है जिसमें شامل ہیں:
    <ul>
        <li>کم نمک वाला दिल کے लिए صحت مند आहार खाना</li>
        <li>नियमित शारीरिक गतिविधि करना</li>
        <li>यदि आप अधिक वजन والے یا موٹے ہیں تو صحت مند وزن बनाए रखना یا وزن کم کرنا</li>
        <li>आपके द्वारा पी जाने वाली शराब की मात्रा को सीमित करना</li>
        <li>मूत्रवर्धक, एसीई इनहिबिटर, या बीटा-ब्लॉकर्स जैसी दवाएं निर्धारित की जा सकती हैं।</li>
    </ul>`,
    whenToSeeDoctorEn: `You'll likely have your blood pressure checked as part of a routine doctor's appointment. Ask your doctor for a blood pressure reading at least every two years starting at age 18.`,
    whenToSeeDoctorHi: `नियमित डॉक्टर کی ملاقات के हिस्से के रूप में आपका रक्तचाप जांचा जाएगा। 18 سال کی عمر سے شروع ہونے والے ہر دو سال میں कम از کم ایک بار अपने डॉक्टर سے रक्तचाप کی ریڈنگ के लिए पूछें।`,
  }
];
