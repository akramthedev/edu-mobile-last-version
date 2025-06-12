import React, { createContext, useContext, useRef } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const historyRef = useRef([{ screenName: 'Actualite', params: {} }]);

  const logHistory = (action) => {
    console.log(`%c[History] Action: ${action}`, 'color: blue; font-weight: bold;');
    console.log('Current History Stack:', historyRef.current);
  };

  const pushToHistory = (screenName, params = {}) => {
    historyRef.current.push({ screenName, params });
    console.log(`%cRoute Added: ${screenName}`, 'color: green');
    logHistory('push');
  };

  const popFromHistory = () => {
    if (historyRef.current.length > 1) {
      const removed = historyRef.current.pop();
      console.warn(`%cRoute Removed: ${removed.screenName}`, 'color: orange');
      logHistory('pop');
    } else {
      console.warn('%cCannot remove the last remaining route.', 'color: red');
    }
  };

  const getPreviousScreen = () => {
    if (historyRef.current.length < 2) return null;
    return historyRef.current[historyRef.current.length - 2];
  };

  const clearHistory = () => {
    historyRef.current = [{ screenName: 'Actualite', params: {} }];
    console.warn('%cHistory cleared.', 'color: purple');
    logHistory('clear');
  };

  return (
    <HistoryContext.Provider value={{ pushToHistory, popFromHistory, getPreviousScreen, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryStack = () => useContext(HistoryContext);