import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppShell from './components/layout/AppShell';

const LandingPage = lazy(() => import('./features/landing/LandingPage'));
const FanHome = lazy(() => import('./features/fan/FanHome'));
const WayfindingView = lazy(() => import('./features/fan/WayfindingView'));
const FoodWaitsView = lazy(() => import('./features/fan/FoodWaitsView'));
const TransitView = lazy(() => import('./features/fan/TransitView'));
const VolunteerHome = lazy(() => import('./features/volunteer/VolunteerHome'));
const ZoneList = lazy(() => import('./features/volunteer/ZoneList'));
const IncidentList = lazy(() => import('./features/volunteer/IncidentList'));
const OrganizerHome = lazy(() => import('./features/organizer/OrganizerHome'));
const AIBrief = lazy(() => import('./features/organizer/AIBrief'));

import './styles/theme.css';
import './styles/index.css';
import './styles/animations.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ErrorBoundary>
          <Suspense fallback={<div style={{ padding: '2rem', color: 'white' }}>Loading StadiumPulse...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/fan" element={<AppShell />}>
                <Route index element={<FanHome />} />
                <Route path="map" element={<WayfindingView />} />
                <Route path="queues" element={<FoodWaitsView />} />
                <Route path="transit" element={<TransitView />} />
              </Route>

              <Route path="/volunteer" element={<AppShell />}>
                <Route index element={<VolunteerHome />} />
                <Route path="zones" element={<ZoneList />} />
                <Route path="incidents" element={<IncidentList />} />
              </Route>

              <Route path="/organizer" element={<AppShell />}>
                <Route index element={<OrganizerHome />} />
                <Route path="incidents" element={<IncidentList />} />
                <Route path="brief" element={<AIBrief />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AppProvider>
  );
}
