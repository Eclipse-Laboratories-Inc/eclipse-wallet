import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const LANGUAGES = ['en', 'es'];

export const resources = {
  en: {
    translation: require(`./en/translation`),
  },
  es: {
    translation: require(`./es/translation`),
  },
};

i18n.use(initReactI18next);

export default i18n;
