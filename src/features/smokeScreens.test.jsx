// @vitest-environment jsdom
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppContext } from '../store/appContext';
import { initialState } from '../store/appReducer';
import AIBrief from './organizer/AIBrief';
import OrganizerHome from './organizer/OrganizerHome';
import IncidentList from './volunteer/IncidentList';
import VolunteerHome from './volunteer/VolunteerHome';
import ZoneList from './volunteer/ZoneList';
import FanHome from './fan/FanHome';
import FoodWaitsView from './fan/FoodWaitsView';
import TransitView from './fan/TransitView';
import WayfindingView from './fan/WayfindingView';

function renderWithState(ui, state) {
  return render(
    <AppContext.Provider value={{ state: { ...initialState, ...state }, dispatch: () => {} }}>
      <MemoryRouter
        initialEntries={['/']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {ui}
      </MemoryRouter>
    </AppContext.Provider>,
  );
}

describe('screen smoke tests', () => {
  it('renders fan screens', () => {
    renderWithState(<FanHome />, { role: 'fan' });
    expect(screen.getByText(/Match Day/i)).toBeTruthy();

    renderWithState(<FoodWaitsView />, { role: 'fan' });
    expect(screen.getByText(/Queue & Wait Times/i)).toBeTruthy();

    renderWithState(<TransitView />, { role: 'fan' });
    expect(screen.getByText(/Tournament Transport/i)).toBeTruthy();

    renderWithState(<WayfindingView />, { role: 'fan' });
    expect(screen.getByText(/Stadium Wayfinding/i)).toBeTruthy();
  });

  it('renders volunteer screens', () => {
    renderWithState(<VolunteerHome />, { role: 'volunteer' });
    expect(screen.getByText(/Volunteer Hub/i)).toBeTruthy();

    renderWithState(<ZoneList />, { role: 'volunteer' });
    expect(screen.getByText(/All Stadium Zones/i)).toBeTruthy();

    renderWithState(<IncidentList />, { role: 'volunteer' });
    expect(screen.getByText(/Zone Incident Manager/i)).toBeTruthy();
  });

  it('renders organizer screens', () => {
    renderWithState(<OrganizerHome />, { role: 'organizer' });
    expect(screen.getByText(/Operations Control Center/i)).toBeTruthy();

    renderWithState(<AIBrief />, { role: 'organizer' });
    expect(screen.getByText(/AI Operations Report/i)).toBeTruthy();
  });
});