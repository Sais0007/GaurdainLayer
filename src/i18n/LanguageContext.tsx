import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  translations,
  languages,
  type Language,
  type TranslationDict,
} from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
  languages,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      return (localStorage.getItem("appLanguage") as Language) || "en";
    }
    return "en";
  });

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("appLanguage", language);
    }
    // Set lang attribute for accessibility
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language], languages }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
