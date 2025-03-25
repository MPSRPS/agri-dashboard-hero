
import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'te' | 'kn' | 'ta' | 'ml';

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

// Default translations
const defaultTranslations: Translations = {
  en: {
    dashboard: "Dashboard",
    cropRecommendation: "Crop Recommendation",
    diseasePrediction: "Disease Prediction",
    budgetPlanning: "Budget Planning",
    logout: "Logout",
    welcome: "Welcome",
    todayOverview: "Today's Overview",
    soilMoisture: "Soil Moisture",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    assistant: "KrishiBot Assistant",
    ask_question: "Ask a question...",
    chatWith: "Chat with KrishiBot",
    cropHealth: "Crop Health",
    waterUsage: "Water Usage",
    farmIncome: "Farm Income",
    marketPrices: "Market Prices",
    weather: "Weather",
    forecast: "Forecast",
    weatherAlert: "Weather Alert",
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    todayIs: "Today is",
    soilAnalysis: "Soil Analysis",
    cropRotation: "Crop Rotation",
    pestControl: "Pest Control",
    irrigationPlan: "Irrigation Plan",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    cropRecommendation: "फसल अनुशंसा",
    diseasePrediction: "रोग भविष्यवाणी",
    budgetPlanning: "बजट योजना",
    logout: "लॉग आउट",
    welcome: "स्वागत है",
    todayOverview: "आज का अवलोकन",
    soilMoisture: "मिट्टी की नमी",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    rainfall: "वर्षा",
    assistant: "कृषि सहायक",
    ask_question: "प्रश्न पूछें...",
    chatWith: "कृषि बॉट से चैट करें",
    cropHealth: "फसल स्वास्थ्य",
    waterUsage: "पानी का उपयोग",
    farmIncome: "खेत की आय",
    marketPrices: "बाजार मूल्य",
    weather: "मौसम",
    forecast: "पूर्वानुमान",
    weatherAlert: "मौसम अलर्ट",
    goodMorning: "सुप्रभात",
    goodAfternoon: "नमस्कार",
    goodEvening: "शुभ संध्या",
    todayIs: "आज है",
    soilAnalysis: "मिट्टी विश्लेषण",
    cropRotation: "फसल चक्र",
    pestControl: "कीट नियंत्रण",
    irrigationPlan: "सिंचाई योजना",
    weekly: "साप्ताहिक",
    monthly: "मासिक",
    yearly: "वार्षिक",
    thisWeek: "इस सप्ताह",
    thisMonth: "इस महीने",
    thisYear: "इस साल",
  },
  // Add more languages as needed
};

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  translations: defaultTranslations,
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      return translations[currentLanguage][key];
    }
    
    // Fallback to English
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    
    // If all else fails, return the key itself
    return key;
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return React.useContext(LanguageContext);
};
