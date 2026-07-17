// @vitest-environment jsdom
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppContext } from '../../store/appContext';
import { initialState } from '../../store/appReducer';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('shows role cards and dispatches role selection', () => {
    const dispatch = vi.fn();

    render(
      <AppContext.Provider value={{ state: { ...initialState }, dispatch }}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LandingPage />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByText('StadiumPulse')).toBeTruthy();
    expect(screen.getAllByRole('listitem', { name: /Enter as/i })).toHaveLength(3);

    fireEvent.click(screen.getByLabelText(/Enter as Fan/i));
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_ROLE', payload: 'fan' });
  });
});