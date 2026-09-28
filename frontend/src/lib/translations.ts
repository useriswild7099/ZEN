export interface TranslationSet {
  heroTitle: string;
  heroHighlight: string;
  heroSub: string;
  heroSubHighlight: string;
  badges: string[];
  navJournal: string;
  navChat: string;
  navKnowledge: string;
  navHelp: string;
  sahayakAdmin: string;
  aiReady: string;
  aiOffline: string;
  footerText: string;
  statutoryNotice: string;
}

export const TRANSLATIONS: Record<string, TranslationSet> = {
  English: {
    heroTitle: "A private paper sanctuary for",
    heroHighlight: "your unspoken thoughts",
    heroSub: "Write without fear. Heal with local, trauma-informed counseling.",
    heroSubHighlight: "Everything stays with you — zero data stored, 100% offline.",
    badges: ["100% Private", "Local AI Engine", "Zero Server Logs", "Offline Ready"],
    navJournal: "Private\nJournal",
    navChat: "Therapy\nSession",
    navKnowledge: "MindSpace\nLibrary",
    navHelp: "Professional\nHelp Hub",
    sahayakAdmin: "Sahayak Admin",
    aiReady: "AI READY",
    aiOffline: "OFFLINE",
    footerText: "Built for mental wellness and victim safety. Your peace of mind matters.",
    statutoryNotice: "Statutory Helpline: Tele-MANAS 14416 (24x7 Free) | NALSA Legal Aid 15100"
  },
  Hindi: {
    heroTitle: "आपके अनकहे विचारों के लिए",
    heroHighlight: "एक शांत काग़ज़ी पन्ना",
    heroSub: "बिना किसी डर के लिखें। अपनी मानसिक शांति को पुनः प्राप्त करें।",
    heroSubHighlight: "सब कुछ आपके डिवाइस पर सुरक्षित है — शून्य डेटा सर्वर पर जाता है।",
    badges: ["100% निजी", "स्थानीय एआई इंजन", "शून्य सर्वर लॉग", "ऑफलाइन तैयार"],
    navJournal: "डायरी\nलिखें",
    navChat: "थेरेपी\nसत्र",
    navKnowledge: "माइंडस्पेस\nपुस्तकालय",
    navHelp: "सहायता\nकेंद्र",
    sahayakAdmin: "सहायक एडमिन",
    aiReady: "एआई तैयार",
    aiOffline: "ऑफलाइन",
    footerText: "मानसिक कल्याण और सुरक्षा के लिए निर्मित। आपकी मानसिक शांति महत्वपूर्ण है।",
    statutoryNotice: "राष्ट्रीय हेल्पलाइन: टेली-मानस 14416 (24x7 निःशुल्क) | नालसा कानूनी सहायता 15100"
  },
  Hinglish: {
    heroTitle: "Aapke dil ke vichaaron ke liye",
    heroHighlight: "ek shaant kagaz",
    heroSub: "Bina kisi darr ke likhein. Trauma-informed Saathi ke saath aage badhein.",
    heroSubHighlight: "Sab kuch aapke device par rehta hai — kuch bhi upload nahi hota.",
    badges: ["100% Private", "Local AI Engine", "Zero Logs", "Offline Ready"],
    navJournal: "Journal\nLikhien",
    navChat: "Saathi Se\nBaat Karein",
    navKnowledge: "MindSpace\nLibrary",
    navHelp: "Emergency\nMadad",
    sahayakAdmin: "Sahayak Admin",
    aiReady: "AI READY",
    aiOffline: "OFFLINE",
    footerText: "Aapki mental health aur suraksha ke liye banaya gaya hai. Aap safe hain.",
    statutoryNotice: "National Helpline: Tele-MANAS 14416 (24x7 Free) | NALSA 15100"
  },
  Assamese: {
    heroTitle: "আপোনাৰ চিন্তাৰ বাবে",
    heroHighlight: "এখন শান্ত ঠাই",
    heroSub: "আপোনাৰ মনৰ কথা ব্যক্ত কৰক। কোমল অন্তৰ্দৃষ্টি লাভ কৰক।",
    heroSubHighlight: "সকলো আপোনাৰ ওচৰতেই থাকে — একো সঞ্চয় নহয়।",
    badges: ["১০০% গোপনীয়", "স্থানীয় AI ইঞ্জিন", "শূন্য চাৰ্ভাৰ লগ", "অফলাইন প্ৰস্তুত"],
    navJournal: "দিনলিপি\nআৰম্ভ কৰক",
    navChat: "কাউন্সেলিং\nসত্ৰ",
    navKnowledge: "মাইণ্ডস্পেচ\nপুথিভঁৰাল",
    navHelp: "সহায়তা\nকেন্দ্ৰ",
    sahayakAdmin: "সহায়ক প্ৰশাসক",
    aiReady: "AI সাজু",
    aiOffline: "অফলাইন",
    footerText: "মানসিক সুস্থতাৰ বাবে নিৰ্মিত। আপোনাৰ মানসিক শান্তি গুৰুত্বপূৰ্ণ।",
    statutoryNotice: "ৰাষ্ট্ৰীয় হেল্পলাইন: Tele-MANAS 14416 (24x7 বিনামূলীয়া) | NALSA 15100"
  },
  Bengali: {
    heroTitle: "আপনার অনুভূতির জন্য",
    heroHighlight: "একটি শান্ত আশ্রয়",
    heroSub: "মন খুলে বলুন। প্রশান্তিময় সহায়তা পান।",
    heroSubHighlight: "সবকিছু আপনার কাছেই নিরাপদ — কোনো ডেটা রাখা হয় না।",
    badges: ["১০০% ব্যক্তিগত", "লোকাল এআই ইঞ্জিন", "কোনো লগ নেই", "অফলাইন উপযোগী"],
    navJournal: "ডায়েরি\nলিখুন",
    navChat: "থেরাপি\nসেশন",
    navKnowledge: "মাইন্ডস্পেস\nলাইব্রেরি",
    navHelp: "জরুরি\nসাহায্য",
    sahayakAdmin: "সহায়ক অ্যাডমিন",
    aiReady: "এআই প্রস্তুত",
    aiOffline: "অফলাইন",
    footerText: "মানসিক সুস্বাস্থ্যের জন্য তৈরি। আপনার শান্তি মূল্যবান।",
    statutoryNotice: "জাতীয় হেল্পলাইন: Tele-MANAS 14416 (২৪x৭ ফ্রি) | NALSA 15100"
  },
  Marathi: {
    heroTitle: "तुमच्या विचारांसाठी",
    heroHighlight: "एक शांत जागा",
    heroSub: "मनमोकळेपणे व्यक्त व्हा. शांत आणि समजूतदार संवाद साधा.",
    heroSubHighlight: "सर्व माहिती तुमच्याकडे सुरक्षित राहते — काहीही सेव्ह केले जात नाही.",
    badges: ["१००% खाजगी", "स्थानिक AI इंजिन", "शून्य सर्व्हर लॉग", "ऑफलाइन तयार"],
    navJournal: "जर्नल\nलिहा",
    navChat: "थेरपी\nसत्र",
    navKnowledge: "माइंडस्पेस\nग्रंथालय",
    navHelp: "मदत\nकेंद्र",
    sahayakAdmin: "सहायक अ‍ॅडमिन",
    aiReady: "AI सज्ज",
    aiOffline: "ऑफलाइन",
    footerText: "मानसिक आरोग्यासाठी बनवले गेले आहे. तुमची मनःशांती महत्त्वाची आहे.",
    statutoryNotice: "राष्ट्रीय हेल्पलाइन: टेली-मानस 14416 (24x7 मोफत) | नालसा 15100"
  },
  Telugu: {
    heroTitle: "మీ భావాల కోసం",
    heroHighlight: "ఒక ప్రశాంత ప్రదేశం",
    heroSub: "మీ మనసులోని భావాలను పంచుకోండి. సున్నితమైన పరిష్కారాలు పొందండి.",
    heroSubHighlight: "ప్రతీదీ మీ వద్దే సురక్షితంగా ఉంటుంది — ఏదీ నిల్వ చేయబడదు.",
    badges: ["100% ప్రైవేట్", "లోకల్ AI ఇంజిన్", "జీరో సర్వర్ లాగ్స్", "ఆఫ్‌లైన్ సిద్ధం"],
    navJournal: "జర్నలింగ్\nప్రారంభించండి",
    navChat: "థెరపీ\nసెషన్",
    navKnowledge: "మైండ్‌స్పేస్\nలైబ్రరీ",
    navHelp: "సహాయక\nకేంద్రం",
    sahayakAdmin: "సహాయక్ అడ్మిన్",
    aiReady: "AI సిద్ధం",
    aiOffline: "ఆఫ్‌లైన్",
    footerText: "మానసిక ఆరోగ్యం కోసం రూపొందించబడింది. మీ మనశ్శాంతి ముఖ్యం.",
    statutoryNotice: "జాతీయ హెల్ప్‌లైన్: టెలి-మానస్ 14416 (24x7 ఉచితం) | నల్సా 15100"
  },
  Tamil: {
    heroTitle: "உங்கள் உணர்வுகளுக்கு",
    heroHighlight: "ஒரு அமைதியான இடம்",
    heroSub: "உங்கள் மனதை வெளிப்படுத்துங்கள். கனிவான ஆதரவைப் பெறுங்கள்.",
    heroSubHighlight: "அனைத்தும் உங்களுடனேயே இருக்கும் — எதுவும் சேமிக்கப்படுவதில்லை.",
    badges: ["100% தனிப்பட்டது", "உள்ளூர் AI என்ஜின்", "சர்வர் பதிவுகள் இல்லை", "ஆஃப்லைன் தயார்"],
    navJournal: "டைரி\nஎழுதுங்கள்",
    navChat: "ஆலோசனை\nஅமர்வு",
    navKnowledge: "மைண்ட்பேஸ்\nநூலகம்",
    navHelp: "உதவி\nமையம்",
    sahayakAdmin: "சஹாயக் அட்மின்",
    aiReady: "AI தயார்",
    aiOffline: "ஆஃப்லைன்",
    footerText: "மன நலனுக்காக உருவாக்கப்பட்டது. உங்கள் மன அமைதி முக்கியம்.",
    statutoryNotice: "தேசிய உதவி எண்: Tele-MANAS 14416 (24x7 இலவசம்) | NALSA 15100"
  },
  Gujarati: {
    heroTitle: "તમારા વિચારો માટે",
    heroHighlight: "એક શાંત જગ્યા",
    heroSub: "તમારી લાગણીઓ વ્યક્ત કરો. હૂંફાળી સમજણ મેળવો.",
    heroSubHighlight: "બધું તમારી પાસે સુરક્ષિત રહે છે — કંઈપણ સંગ્રહિત થતું નથી.",
    badges: ["100% ખાનગી", "સ્થાનિક AI એન્જિન", "ઝીરો સર્વર લોગ", "ઓફલાઇન તૈયાર"],
    navJournal: "ડાયરી\nશરૂ કરો",
    navChat: "થેરાપી\nસત્ર",
    navKnowledge: "માઇન્ડસ્પેસ\nપુસ્તકાલય",
    navHelp: "સહાય\nકેન્દ્ર",
    sahayakAdmin: "સહાયક એડમિન",
    aiReady: "AI તૈયાર",
    aiOffline: "ઓફલાઇન",
    footerText: "માનસિક સુખાકારી માટે નિર્મિત. તમારી માનસિક શાંતિ મહત્વપૂર્ણ છે.",
    statutoryNotice: "રાષ્ટ્રીય હેલ્પલાઇન: ટેલિ-માનસ 14416 (24x7 મફત) | નાલસા 15100"
  },
  Kannada: {
    heroTitle: "ನಿಮ್ಮ ಆಲೋಚನೆಗಳಿಗೆ",
    heroHighlight: "ಒಂದು ಶಾಂತ ಜಾಗ",
    heroSub: "ನಿಮ್ಮ ಭಾವನೆಗಳನ್ನು ವ್ಯಕ್ತಪಡಿಸಿ. ಸೌಮ್ಯವಾದ ಒಳನೋಟಗಳನ್ನು ಪಡೆಯಿರಿ.",
    heroSubHighlight: "ಎಲ್ಲವೂ ನಿಮ್ಮ ಬಳಿಯೇ ಉಳಿಯುತ್ತದೆ — ಯಾವುದನ್ನೂ ಉಳಿಸಲಾಗುವುದಿಲ್ಲ.",
    badges: ["100% ಖಾಸಗಿ", "ಸ್ಥಳೀಯ AI ಎಂಜಿನ್", "ಶೂನ್ಯ ಸರ್ವರ್ ಲಾಗ್‌ಗಳು", "ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ"],
    navJournal: "ದಿನಚರಿ\nಬರೆಯಿರಿ",
    navChat: "ಆಪ್ತಸಲಹೆ\nಅಧಿವೇಶನ",
    navKnowledge: "ಮೈಂಡ್‌ಸ್ಪೇಸ್\nಗ್ರಂಥಾಲಯ",
    navHelp: "ಸಹಾಯ\nಕೇಂದ್ರ",
    sahayakAdmin: "ಸಹಾಯಕ್ ಅಡ್ಮಿನ್",
    aiReady: "AI ಸಿದ್ಧ",
    aiOffline: "ಆಫ್‌ಲೈನ್",
    footerText: "ಮಾನಸಿಕ ಸ್ವಾಸ್ಥ್ಯಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಮನಃಶಾಂತಿ ಮುಖ್ಯ.",
    statutoryNotice: "ರಾಷ್ಟ್ರೀಯ ಹೆಲ್ಪ್‌ಲೈನ್: Tele-MANAS 14416 (24x7 ಉಚಿತ) | NALSA 15100"
  },
  Punjabi: {
    heroTitle: "ਤੁਹਾਡੇ ਵਿਚਾਰਾਂ ਲਈ",
    heroHighlight: "ਇੱਕ ਸ਼ਾਂਤ ਜਗ੍ਹਾ",
    heroSub: "ਆਪਣੀਆਂ ਭਾਵਨਾਵਾਂ ਸਾਂਝੀਆਂ ਕਰੋ। ਹਮਦਰਦੀ ਭਰੀ ਸੇਧ ਪ੍ਰਾਪਤ ਕਰੋ।",
    heroSubHighlight: "ਸਭ ਕੁਝ ਤੁਹਾਡੇ ਕੋਲ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦਾ ਹੈ — ਕੁਝ ਵੀ ਸਟੋਰ ਨਹੀਂ ਹੁੰਦਾ।",
    badges: ["100% ਨਿੱਜੀ", "ਲੋਕਲ AI ਇੰਜਨ", "ਜ਼ੀਰੋ ਸਰਵਰ ਲੌਗ", "ਆਫਲਾਈਨ ਤਿਆਰ"],
    navJournal: "ਡਾਇਰੀ\nਲਿਖੋ",
    navChat: "ਸਲਾਹ-ਮਸ਼ਵਰਾ\nਸੈਸ਼ਨ",
    navKnowledge: "ਮਾਈਂਡਸਪੇਸ\nਲਾਇਬ੍ਰੇਰੀ",
    navHelp: "ਮਦਦ\nਕੇਂਦਰ",
    sahayakAdmin: "ਸਹਾਇਕ ਐਡਮਿਨ",
    aiReady: "AI ਤਿਆਰ",
    aiOffline: "ਆਫਲਾਈਨ",
    footerText: "ਮਾਨਸਿਕ ਤੰਦਰੁਸਤੀ ਲਈ ਬਣਾਇਆ ਗਿਆ। ਤੁਹਾਡੀ ਸ਼ਾਂਤੀ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
    statutoryNotice: "ਕੌਮੀ ਹੈਲਪਲਾਈਨ: Tele-MANAS 14416 (24x7 ਮੁਫਤ) | NALSA 15100"
  },
  Odia: {
    heroTitle: "ଆପଣଙ୍କ ଚିନ୍ତାଧାରା ପାଇଁ",
    heroHighlight: "ଏକ ଶାନ୍ତ ପରିବେଶ",
    heroSub: "ଆପଣଙ୍କ ଭାବନା ପ୍ରକାଶ କରନ୍ତୁ। ଶାନ୍ତ ପରାମର୍ଶ ପାଆନ୍ତୁ।",
    heroSubHighlight: "ସବୁକିଛି ଆପଣଙ୍କ ପାଖରେ ରହେ — କିଛି ବି ସଂରକ୍ଷିତ ହୁଏ ନାହିଁ।",
    badges: ["୧୦୦% ବ୍ୟକ୍ତିଗତ", "ଲୋକାଲ AI ଇଞ୍ଜିନ", "ଶୂନ ସର୍ଭର ଲଗ୍", "ଅଫଲାଇନ ପ୍ରସ୍ତୁତ"],
    navJournal: "ଡାଏରୀ\nଲେଖନ୍ତୁ",
    navChat: "କାଉନସେଲିଂ\nସେସନ",
    navKnowledge: "ମାଇଣ୍ଡସ୍ପେସ\nପାଠାଗାର",
    navHelp: "ସହାୟତା\nକେନ୍ଦ୍ର",
    sahayakAdmin: "ସହାୟକ ଆଡମିନ",
    aiReady: "AI ପ୍ରସ୍ତୁତ",
    aiOffline: "ଅଫଲାଇନ",
    footerText: "ମାନସିକ ସୁସ୍ଥତା ପାଇଁ ନିର୍ମିତ। ଆପଣଙ୍କ ଶାନ୍ତି ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ।",
    statutoryNotice: "ଜାତୀୟ ହେଲ୍ପଲାଇନ: Tele-MANAS 14416 (24x7 ମାଗଣା) | NALSA 15100"
  },
  Urdu: {
    heroTitle: "آپ کے خیالات کے لیے",
    heroHighlight: "ایک پرسکون گوشہ",
    heroSub: "اپنے جذبات کا اظہار کریں۔ پرخلوص رہنمائی حاصل کریں۔",
    heroSubHighlight: "سب کچھ آپ کے پاس محفوظ رہتا ہے — کچھ بھی ذخیرہ نہیں ہوتا۔",
    badges: ["100% نجی", "لوکل AI انجن", "کوئی سرور لاگز نہیں", "آف لائن تیار"],
    navJournal: "ڈائری\nلکھیں",
    navChat: "تھراپی\nسیشن",
    navKnowledge: "مائنڈ اسپیس\nلائبریری",
    navHelp: "مدد\nمرکز",
    sahayakAdmin: "معاون ایڈمن",
    aiReady: "AI تیار",
    aiOffline: "آف لائن",
    footerText: "ذہنی سکون کے لیے بنایا گیا۔ آپ کا سکون سب سے اہم ہے۔",
    statutoryNotice: "قومی ہیلپ لائن: Tele-MANAS 14416 (24x7 مفت) | NALSA 15100"
  }
};
