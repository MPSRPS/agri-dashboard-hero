import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "english" | "hindi" | "marathi" | "punjabi" | "bengali" | "tamil";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Simple translations - in a real app, this would be more extensive
const translations: Record<Language, Record<string, string>> = {
  english: {
    "dashboard": "Dashboard",
    "crop_recommendation": "Crop Recommendation",
    "disease_prediction": "Plant Disease Prediction",
    "budget_planning": "Budget Planning",
    "logout": "Logout",
    "welcome": "Welcome",
    "analyzing_crop_market": "Analyzing Crop Market Trends",
    "monitoring_soil": "Monitoring Soil Nutrient Health",
    "tracking_resource": "Tracking Resource Utilization",
    "add_farm": "Add Farm",
    "agri_news": "Agriculture News & Education",
    "assistant": "Your Smart Agriculture Assistant",
    "ask_question": "Ask a question...",
  },
  hindi: {
    "dashboard": "डैशबोर्ड",
    "crop_recommendation": "फसल की सिफारिश",
    "disease_prediction": "पौधों की बीमारी की भविष्यवाणी",
    "budget_planning": "बजट योजना",
    "logout": "लॉग आउट",
    "welcome": "स्वागत है",
    "analyzing_crop_market": "फसल बाजार के रुझान का विश्लेषण",
    "monitoring_soil": "मिट्टी के पोषक स्वास्थ्य की निगरानी",
    "tracking_resource": "संसाधन उपयोग का ट्रैकिंग",
    "add_farm": "खेत जोड़ें",
    "agri_news": "कृषि समाचार और शिक्षा",
    "assistant": "आपका स्मार्ट कृषि सहायक",
    "ask_question": "प्रश्न पूछें...",
  },
  marathi: {
    "dashboard": "डॅशबोर्ड",
    "crop_recommendation": "पीक शिफारस",
    "disease_prediction": "वनस्पती रोग भविष्यवाणी",
    "budget_planning": "अंदाजपत्रक नियोजन",
    "logout": "बाहेर पडा",
    "welcome": "स्वागत आहे",
    "analyzing_crop_market": "पीक बाजार कल विश्लेषण",
    "monitoring_soil": "मातीच्या पोषक आरोग्याचे निरीक्षण",
    "tracking_resource": "संसाधन वापराचा मागोवा",
    "add_farm": "शेत जोडा",
    "agri_news": "कृषी बातम्या आणि शिक्षण",
    "assistant": "तुमचा स्मार्ट कृषी सहाय्यक",
    "ask_question": "प्रश्न विचारा...",
  },
  punjabi: {
    "dashboard": "ਡੈਸ਼ਬੋਰਡ",
    "crop_recommendation": "ਫਸਲ ਦੀ ਸਿਫਾਰਸ਼",
    "disease_prediction": "ਪੌਦੇ ਦੀ ਬਿਮਾਰੀ ਦੀ ਭਵਿੱਖਬਾਣੀ",
    "budget_planning": "ਬਜਟ ਯੋਜਨਾਬੰਦੀ",
    "logout": "ਲੌਗ ਆਊਟ",
    "welcome": "ਜੀ ਆਇਆਂ ਨੂੰ",
    "analyzing_crop_market": "ਫਸਲ ਮਾਰਕੀਟ ਦੇ ਰੁਝਾਨਾं ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ",
    "monitoring_soil": "ਮਿੱਟੀ ਦੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੀ ਸਿਹਤ ਦੀ ਨਿਗਰਾਨੀ",
    "tracking_resource": "ਸਰੋਤ ਵरਤੋਂ ਦੀ ਟਰੈਕਿੰਗ",
    "add_farm": "ਫਾਰਮ ਸ਼ਾਮਲ ਕਰੋ",
    "agri_news": "ਖੇਤੀਬਾੜੀ ਖ਼ਬਰਾਂ ਅਤੇ ਸਿੱਖਿਆ",
    "assistant": "ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ",
    "ask_question": "ਇੱਕ ਸਵਾਲ ਪੁੱਛੋ...",
  },
  bengali: {
    "dashboard": "ড্যাশবোর্ড",
    "crop_recommendation": "ফসল সুপারিশ",
    "disease_prediction": "উদ্ভিদ রোগ পূর্বাভাস",
    "budget_planning": "বাজেট পরিকল্পনা",
    "logout": "লগ আউট",
    "welcome": "স্বাগতম",
    "analyzing_crop_market": "ফসল বাজার প্রবণতা বিশ্লেষণ",
    "monitoring_soil": "মাটির পুষ্টি স্বাস্থ্য পর্যবেক্ষণ",
    "tracking_resource": "সম্পদ ব্যবহারের ট্র্যাকিং",
    "add_farm": "খামার যোগ করুন",
    "agri_news": "কৃষি সংবাদ ও শিক্ষা",
    "assistant": "আপনার স্মার্ট কৃষি সহকারী",
    "ask_question": "একটি প্রশ্ন জিজ্ঞাসা করুন...",
  },
  tamil: {
    "dashboard": "டாஷ்போர்டு",
    "crop_recommendation": "பயிர் பரிந்துரை",
    "disease_prediction": "தாவர நோய் கணிப்பு",
    "budget_planning": "பட்ஜெட் திட்டமிடல்",
    "logout": "வெளியேறு",
    "welcome": "வரவேற்கிறோம்",
    "analyzing_crop_market": "பயிர் சந்தை போக்குகளை ஆய்வு செய்தல்",
    "monitoring_soil": "மண் ஊட்டச்சத்து ஆரோக்கியத்தை கண்காணித்தல்",
    "tracking_resource": "வள பயன்பாட்டை கண்காணித்தல்",
    "add_farm": "பண்ணையைச் சேர்க்கவும்",
    "agri_news": "விவசாய செய்திகள் & கல்வி",
    "assistant": "உங்கள் ஸ்மார்ட் விவசாய உதவியாளர்",
    "ask_question": "ஒரு கேள்வியை கேளுங்கள்...",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("english");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("krishiLanguage") as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem("krishiLanguage", language);
  };

  const t = (key: string) => {
    return translations[currentLanguage][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
