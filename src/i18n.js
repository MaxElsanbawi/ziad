import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from '../public/locales/en/translation.json';
import arTranslation from '../public/locales/ar/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

i18n
  .use(LanguageDetector) // Automatically detect user's browser language
  .use(initReactI18next) // Pass the i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language if no match found
    debug: true, // Enable logs (disable in production)
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'], // Priority of language detection
    },
    react: {
      useSuspense: false, // Disable suspense for simplicity
    },
  });

export default i18n;