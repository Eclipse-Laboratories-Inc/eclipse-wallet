import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en/translation';
import esTranslation from './es/translation';

export const LANGUAGES = ['en', 'es'];

export const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
};

i18n.use(initReactI18next);

export default i18n;
