import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from "./locales/en.json";
import fr from "./locales/fr.json";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

const getLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem('language');
    if (storedLanguage) {
      return storedLanguage;
    } else {
      return Localization.locale.startsWith("fr") ? "fr" : "en";
    }
  } catch (error) {
    console.error('Error getting language from AsyncStorage:', error);
    return Localization.locale.startsWith("fr") ? "fr" : "en";
  }
};

const initI18n = async () => {
  const language = await getLanguage();
  
  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
