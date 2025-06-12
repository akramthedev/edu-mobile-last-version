import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("etudiant");
  const [isLoading, setIsLoading] = useState(true);


  const loadAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const roleFetched  = await AsyncStorage.getItem('role');
      
      if(roleFetched){
        setRole(roleFetched);
      }
      else{
        setRole("etudiant");
      }
      if(token){
        setIsAuthenticated(true);  
      }
      else{
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Error loading authentication:', error);
      setRole("etudiant");
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
  }, []);

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