import { useReducer, useEffect } from 'react';
import { appReducer, initialState } from './appReducer';
import { AppContext } from './appContext';

/**
 * AppContext — Global state for StadiumPulse.
 * Drives role-based views, AI prompt construction, and UI theming.
 */

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync situation to data-attribute for CSS emergency theme override
  useEffect(() => {
    document.documentElement.setAttribute('data-situation', state.situation);
  }, [state.situation]);

  // Sync reduce-motion class
  useEffect(() => {
    if (state.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [state.reduceMotion]);

  // Sync language direction (RTL for Arabic)
  useEffect(() => {
    document.documentElement.lang = state.language;
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
  }, [state.language]);

  // Detect OS prefers-reduced-motion on mount
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) dispatch({ type: 'TOGGLE_REDUCE_MOTION' });
    const handler = (e) => {
      if (e.matches) dispatch({ type: 'TOGGLE_REDUCE_MOTION' });
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
