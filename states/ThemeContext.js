import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const themeRef = useRef(null);
  const [theme, setTheme] = useState(null);
  const [isLoadingChangingMode, setIsLoadingChangingMode] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        const initialTheme = storedTheme || 'dark';
        themeRef.current = initialTheme;
        setTheme(initialTheme);
        if (!storedTheme) {
          await AsyncStorage.setItem('theme', 'dark');
        }
      } catch (error) {
        console.log('Error initializing theme:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    initializeTheme();
  }, []);

  const handleThemeToggle = async () => {
    try {
      setIsLoadingChangingMode(true);
      const newTheme = themeRef.current === 'light' ? 'dark' : 'light';
      themeRef.current = newTheme;     // fuck you very much 
      setTheme(newTheme);
      setIsLoadingChangingMode(false);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error toggling theme:', error);
    }
    // } finally {
    //   setIsLoadingChangingMode(false);
    // }
  };

  if (isInitializing) {
    return null;  
  }

  return (
    <ThemeContext.Provider value={{ theme, handleThemeToggle, isLoadingChangingMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
