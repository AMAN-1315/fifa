import { describe, expect, it } from 'vitest';
import { appReducer, initialState } from './appReducer';

describe('appReducer', () => {
  it('opens and closes role-specific UI state', () => {
    const roleState = appReducer(initialState, { type: 'SET_ROLE', payload: 'fan' });
    expect(roleState.role).toBe('fan');
    expect(roleState.aiPanelOpen).toBe(false);

    const panelState = appReducer(roleState, { type: 'OPEN_AI_PANEL' });
    expect(panelState.aiPanelOpen).toBe(true);
  });

  it('resets role state while preserving language and motion preference', () => {
    const seededState = {
      ...initialState,
      role: 'organizer',
      language: 'fr',
      reduceMotion: true,
      accessibilityMode: true,
      aiPanelOpen: true,
    };

    const nextState = appReducer(seededState, { type: 'RESET_ROLE' });

    expect(nextState.role).toBeNull();
    expect(nextState.language).toBe('fr');
    expect(nextState.reduceMotion).toBe(true);
    expect(nextState.accessibilityMode).toBe(false);
    expect(nextState.aiPanelOpen).toBe(false);
  });
});