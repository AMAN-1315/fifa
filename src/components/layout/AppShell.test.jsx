// @vitest-environment jsdom
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppContext } from '../../store/appContext';
import { initialState } from '../../store/appReducer';
import AppShell from './AppShell';

describe('AppShell', () => {
  it('renders fan navigation when role is fan', () => {
    render(
      <AppContext.Provider value={{ state: { ...initialState, role: 'fan' }, dispatch: () => {} }}>
        <MemoryRouter
          initialEntries={['/fan']}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppShell />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByLabelText(/Main navigation/i).textContent).toContain('Home');
    expect(screen.getByLabelText(/Main navigation/i).textContent).toContain('Transit');
  });
});