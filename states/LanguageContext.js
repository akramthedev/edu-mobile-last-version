import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);  
  const [isLoadingChangingLanguage, setIsLoadingChangingLanguage] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); 

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language');
        const initialLanguage = storedLanguage || 'fr';  
        setLanguage(initialLanguage);
        i18n.changeLanguage(initialLanguage);
        if (!storedLanguage) {
          await AsyncStorage.setItem('language', 'fr');
        }
      } catch (error) {
        console.log('Error initializing language:', error);
      } finally {
        setIsInitializing(false);  
      }
    };
    initializeLanguage();
  }, []);

  const handleLanguageChange = useCallback(async (lang) => {
    try {
      setIsLoadingChangingLanguage(true);
      setLanguage(lang);
      i18n.changeLanguage(lang);
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.log('Error changing language:', error);
    } finally {
      setIsLoadingChangingLanguage(false);
    }
  }, []);

  if (isInitializing) {
    return null;  
  }

  return (
    <LanguageContext.Provider value={{ language, handleLanguageChange, isLoadingChangingLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
