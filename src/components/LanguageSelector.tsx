
import { useLanguage } from "@/context/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  { code: "english", label: "English" },
  { code: "hindi", label: "हिंदी" },
  { code: "marathi", label: "मराठी" },
  { code: "punjabi", label: "ਪੰਜਾਬੀ" },
  { code: "bengali", label: "বাংলা" },
  { code: "tamil", label: "தமிழ்" }
];

const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="w-44">
      <Select 
        value={currentLanguage} 
        onValueChange={(value) => setLanguage(value as any)}
      >
        <SelectTrigger className="bg-white border-gray-200">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
