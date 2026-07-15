import React, { createContext, useContext, useReducer, useEffect } from 'react';

/**
 * AppContext — Global state for StadiumPulse.
 * Drives role-based views, AI prompt construction, and UI theming.
 */

const AppContext = createContext(null);

const initialState = {
  role: null,                   // 'fan' | 'volunteer' | 'organizer'
  language: 'en',               // 'en' | 'es' | 'fr' | 'pt' | 'ar'
  situation: 'normal',          // 'normal' | 'elevated' | 'emergency'
  accessibilityMode: false,     // step-free routing, high-contrast hints
  reduceMotion: false,          // disables all CSS animations
  currentZone: 'Section 114',  // user's current zone context
  aiPanelOpen: false,
  selectedSection: null,        // section tapped on the map
  lastRoute: null,              // {from, to, walkTime, stepFree}
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload, aiPanelOpen: false };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_SITUATION':
      return { ...state, situation: action.payload };
    case 'TOGGLE_ACCESSIBILITY':
      return { ...state, accessibilityMode: !state.accessibilityMode };
    case 'TOGGLE_REDUCE_MOTION':
      return { ...state, reduceMotion: !state.reduceMotion };
    case 'TOGGLE_AI_PANEL':
      return { ...state, aiPanelOpen: !state.aiPanelOpen };
    case 'OPEN_AI_PANEL':
      return { ...state, aiPanelOpen: true };
    case 'CLOSE_AI_PANEL':
      return { ...state, aiPanelOpen: false };
    case 'SET_SELECTED_SECTION':
      return { ...state, selectedSection: action.payload };
    case 'SET_ROUTE':
      return { ...state, lastRoute: action.payload };
    case 'SET_ZONE':
      return { ...state, currentZone: action.payload };
    case 'RESET_ROLE':
      return { ...initialState, language: state.language, reduceMotion: state.reduceMotion };
    default:
      return state;
  }
}

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

// Convenience hook
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
