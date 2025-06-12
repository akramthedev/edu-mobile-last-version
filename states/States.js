import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("etudiant");
  const [isLoading, setIsLoading] = useState(true);


  const loadAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const roleFetched  = await AsyncStorage.getItem('role');
      console.warn("Token : "+token);
      console.warn("Role  : "+roleFetched);
      setRole(roleFetched);
      setIsAuthenticated(!!token);  
    } catch (error) {
      console.log('Error loading authentication:', error);
      setIsAuthenticated(false);
    }
  };

 
 
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await loadAuthentication();  
      setIsLoading(false);
    };

    initializeApp();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        setRole, 
        role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};