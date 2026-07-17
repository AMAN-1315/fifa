export const initialState = {
  role: null,
  language: 'en',
  situation: 'normal',
  accessibilityMode: false,
  reduceMotion: false,
  currentZone: 'Section 114',
  aiPanelOpen: false,
  selectedSection: null,
  lastRoute: null,
};

export function appReducer(state, action) {
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