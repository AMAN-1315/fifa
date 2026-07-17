// @vitest-environment jsdom
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppContext } from '../../store/appContext';
import { initialState } from '../../store/appReducer';
import VolunteerHome from './VolunteerHome';

describe('VolunteerHome', () => {
  it('switches tabs, submits an incident, and opens the AI panel', async () => {
    vi.useFakeTimers();
    const dispatch = vi.fn();

    render(
      <AppContext.Provider value={{ state: { ...initialState, role: 'volunteer' }, dispatch }}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <VolunteerHome />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    expect(screen.getByText(/Volunteer Hub/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('tab', { name: /Log Incident/i }));
    fireEvent.change(screen.getByPlaceholderText(/Provide location details/i), {
      target: { value: 'Ticket scanner outage near Gate C' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit Alert/i }));
    expect(screen.getByText(/Incident routed to Command Center/i)).toBeTruthy();

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole('tab', { name: /Alerts Log/i }).getAttribute('aria-selected')).toBe('true');

    fireEvent.click(screen.getByRole('tab', { name: /Active Tasks/i }));
    expect(screen.getByText(/Check elevator operation at Gate C main corridor/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Check Steward FAQ/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'OPEN_AI_PANEL' });

    vi.useRealTimers();
  });
});