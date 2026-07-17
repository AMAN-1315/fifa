// @vitest-environment jsdom
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppContext } from '../../store/appContext';
import { initialState } from '../../store/appReducer';
import FanHome from './FanHome';

describe('FanHome', () => {
  it('renders the match dashboard headline', () => {
    render(
      <AppContext.Provider value={{ state: { ...initialState, role: 'fan' }, dispatch: () => {} }}>
        <MemoryRouter
          initialEntries={['/fan']}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <FanHome />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByText(/Match Day/i)).toBeTruthy();
  });
});