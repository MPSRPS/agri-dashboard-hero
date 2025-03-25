
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

export const useTranslation = () => {
  const { t, currentLanguage } = useContext(LanguageContext);
  return { t, currentLanguage };
};
