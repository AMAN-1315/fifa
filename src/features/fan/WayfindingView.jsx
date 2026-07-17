import { useApp } from '../../store/useApp';
import { useMockData } from '../../hooks/useMockData';
import { ZONES } from '../../mock/stadiumData';
import StadiumMap from '../../components/map/StadiumMap';
import './WayfindingView.css';

export default function WayfindingView() {
  const { state, dispatch } = useApp();
  const data = useMockData();
  const { selectedSection, accessibilityMode } = state;

  const currentZoneObj = ZONES.find(z => z.id === selectedSection) || ZONES.find(z => z.label === state.currentZone) || ZONES[0];
  const associatedGate = currentZoneObj.gate;

  const handleZoneSelect = (zone) => {
    dispatch({ type: 'SET_SELECTED_SECTION', payload: zone.id });
    dispatch({ type: 'SET_ZONE', payload: zone.label });
  };

  // Mock wayfinding coordinates: gate represents start, zone represents target
  const gateCoords = {
    'Gate A': { x: 53, y: 74 },
    'Gate B': { x: 38, y: 68 },
    'Gate C': { x: 38, y: 46 },
    'Gate D': { x: 42, y: 32 },
    'Gate E': { x: 53, y: 26 },
    'Gate F': { x: 64, y: 36 },
    'Gate G': { x: 66, y: 53 },
    'Gate H': { x: 62, y: 68 },
  };

  const routeFrom = gateCoords[associatedGate];
  const routeTo = currentZoneObj;

  return (
    <div className="wayfinding-view">
      <header className="wayfinding-header animate-fadeSlideDown">
        <h1 className="font-display wayfinding-title">
          🗺️ Stadium Wayfinding
        </h1>
        <p className="text-secondary text-sm">
          Tap any zone on the map to find your seat and view the optimal path.
        </p>
      </header>

      <div className="wayfinding-content">
        <div className="wayfinding-map-card glass-card animate-scaleIn">
          <StadiumMap
            occupancyData={data.zoneOccupancy}
            selectedZone={currentZoneObj.id}
            onZoneClick={handleZoneSelect}
            showRoute={true}
            routeFrom={routeFrom}
            routeTo={routeTo}
            showAccessible={accessibilityMode}
          />
        </div>

        <div className="wayfinding-directions glass-card animate-fadeSlideUp delay-100">
          <div className="wayfinding-dir-header">
            <span className="badge badge-gold font-display">Route Directions</span>
            {accessibilityMode && (
              <span className="badge badge-azure font-display">♿ Step-Free Only</span>
            )}
          </div>

          <div className="wayfinding-route-summary">
            <div className="wayfinding-route-step-main">
              From <strong className="text-gold">{associatedGate}</strong> to <strong className="text-gold">{currentZoneObj.label}</strong>
            </div>
            <div className="wayfinding-eta text-azure font-display">
              🚶 {currentZoneObj.accessible || !accessibilityMode ? 'Est. 4 min walk' : 'Est. 6 min walk (via detour)'}
            </div>
          </div>

          <div className="divider" />

          <ol className="wayfinding-steps">
            <li className="wayfinding-step">
              <span className="wayfinding-step-num">1</span>
              <div className="wayfinding-step-text">
                Enter via <strong className="text-primary">{associatedGate}</strong> and scan your digital match ticket.
              </div>
            </li>
            <li className="wayfinding-step">
              <span className="wayfinding-step-num">2</span>
              <div className="wayfinding-step-text">
                {accessibilityMode ? (
                  <span>Take the elevator located immediately to the left of the gate up to the <strong>Lower Bowl concourse</strong>.</span>
                ) : (
                  <span>Head straight up the main ramp to the <strong>Lower Bowl concourse</strong>.</span>
                )}
              </div>
            </li>
            <li className="wayfinding-step">
              <span className="wayfinding-step-num">3</span>
              <div className="wayfinding-step-text">
                Turn {currentZoneObj.id.match(/\d+/) && parseInt(currentZoneObj.id.match(/\d+/)[0]) > 8 ? 'left' : 'right'} and walk along the concourse past the concession area.
              </div>
            </li>
            <li className="wayfinding-step">
              <span className="wayfinding-step-num">4</span>
              <div className="wayfinding-step-text">
                Enter the seating portal labeled <strong>Portal {currentZoneObj.label.replace('Section ', '')}</strong>. Your row and seat are straight ahead.
              </div>
            </li>
          </ol>

          <button
            className="btn btn-azure w-full mt-4"
            onClick={() => dispatch({ type: 'OPEN_AI_PANEL' })}
          >
            💬 Ask AI for Assistance
          </button>
        </div>
      </div>
    </div>
  );
}
