import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import AppShell from './components/layout/AppShell';
import LandingPage from './features/landing/LandingPage';

// Fan Components
import FanHome from './features/fan/FanHome';
import WayfindingView from './features/fan/WayfindingView';
import FoodWaitsView from './features/fan/FoodWaitsView';
import TransitView from './features/fan/TransitView';

// Volunteer Components
import VolunteerHome from './features/volunteer/VolunteerHome';
import ZoneList from './features/volunteer/ZoneList';
import IncidentList from './features/volunteer/IncidentList';

// Organizer Components
import OrganizerHome from './features/organizer/OrganizerHome';
import AIBrief from './features/organizer/AIBrief';

import './styles/theme.css';
import './styles/index.css';
import './styles/animations.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing / Role Selector */}
          <Route path="/" element={<LandingPage />} />

          {/* Fan Route Group */}
          <Route path="/fan" element={<AppShell />}>
            <Route index element={<FanHome />} />
            <Route path="map" element={<WayfindingView />} />
            <Route path="queues" element={<FoodWaitsView />} />
            <Route path="transit" element={<TransitView />} />
          </Route>

          {/* Volunteer Route Group */}
          <Route path="/volunteer" element={<AppShell />}>
            <Route index element={<VolunteerHome />} />
            <Route path="zones" element={<ZoneList />} />
            <Route path="incidents" element={<IncidentList />} />
          </Route>

          {/* Organizer Route Group */}
          <Route path="/organizer" element={<AppShell />}>
            <Route index element={<OrganizerHome />} />
            <Route path="incidents" element={<IncidentList />} />
            <Route path="brief" element={<AIBrief />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
