import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SupportedLanguage, TranslationSchema } from './types';
import { en } from './en';
import { te } from './te';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationSchema;
}

const dictionaries: Record<SupportedLanguage, TranslationSchema> = {
  en,
  te,
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('arun_tattoos_lang');
      if (savedLang === 'en' || savedLang === 'te') {
        setLanguageState(savedLang);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('arun_tattoos_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = dictionaries[language] || en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
