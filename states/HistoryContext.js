import React, { createContext, useContext, useRef } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const historyRef = useRef([{ screenName: 'Login', params: {} }]);

  

  const pushToHistory = (screenName, params = {}) => {
    historyRef.current.push({ screenName, params });
  };

  const popFromHistory = () => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
    } else {
    }
  };

  const getPreviousScreen = () => {
    if (historyRef.current.length < 2) return null;
    return historyRef.current[historyRef.current.length - 2];
  };

  const clearHistory = () => {
    historyRef.current = [{ screenName: 'Login', params: {} }];
  };

  return (
    <HistoryContext.Provider value={{ pushToHistory, popFromHistory, getPreviousScreen, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryStack = () => useContext(HistoryContext);