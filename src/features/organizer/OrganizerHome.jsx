import { useState } from 'react';
import { useApp } from '../../store/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import { useMockData } from '../../hooks/useMockData';
import { ZONES } from '../../mock/stadiumData';
import StadiumMap from '../../components/map/StadiumMap';
import './OrganizerHome.css';

export default function OrganizerHome() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const data = useMockData();

  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const activeIncidents = data.incidents.filter(i => !i.resolved);
  const totalVolunteers = Object.keys(data.volunteerStatus).length;
  const activeVolunteers = Object.values(data.volunteerStatus).filter(s => s === 'active').length;

  const handleZoneSelect = (zone) => {
    setSelectedZoneId(zone.id);
  };

  const selectedZoneObj = ZONES.find(z => z.id === selectedZoneId);

  return (
    <div className="organizer-home">
      <header className="organizer-header animate-fadeSlideDown">
        <div>
          <h1 className="font-display organizer-title">📊 Operations Control Center</h1>
          <p className="text-secondary text-sm">
            FIFA World Cup 2026 Operations Console · MetLife Stadium
          </p>
        </div>
        <div className="situation-controls">
          <span className="text-xs text-muted mr-2">Situation State:</span>
          {['normal', 'elevated', 'emergency'].map(sit => (
            <button
              key={sit}
              className={`sit-btn sit-btn--${sit} ${state.situation === sit ? 'sit-btn--active' : ''}`}
              onClick={() => dispatch({ type: 'SET_SITUATION', payload: sit })}
            >
              {sit.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Bento Grid */}
      <div className="organizer-bento">
        {/* --- TILE 1: Heatmap (2x2 large) --- */}
        <div className="org-tile org-tile--heatmap glass-card animate-bento delay-0">
          <span className="org-tile-label">Live Occupancy Heatmap</span>
          <div className="org-map-wrapper">
            <StadiumMap
              occupancyData={data.zoneOccupancy}
              selectedZone={selectedZoneId}
              onZoneClick={handleZoneSelect}
            />
          </div>
        </div>

        {/* --- TILE 2: AI Ops Brief --- */}
        <div className="org-tile org-tile--brief glass-card animate-bento delay-100">
          <div className="org-tile-header">
            <span className="org-tile-label m-0">{t('ai_brief_title')}</span>
            <span className="badge badge-gold animate-pulse-glow">AI Summary</span>
          </div>
          <div className="ai-brief-content text-sm text-secondary">
            <p className="mb-2">
              <strong>Match Status:</strong> Pre-kickoff stadium loading is currently at <strong>{data.totalOccupancy}%</strong> capacity.
            </p>
            <p className="mb-2">
              <strong>Incident Report:</strong> {activeIncidents.length} active notifications logged. Bottlenecks at Gate C and Zone E7 triage status active.
            </p>
            <p>
              <strong>Command Actions:</strong> Dispatch 2 stewards to Gate C. Confirm accessible shuttle routing.
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm mt-auto"
            onClick={() => dispatch({ type: 'OPEN_AI_PANEL' })}
          >
            Ask AI for Detail Sitrep →
          </button>
        </div>

        {/* --- TILE 3: Incident Counter --- */}
        <div className="org-tile org-tile--incidents glass-card animate-bento delay-150">
          <span className="org-tile-label">Alert Center</span>
          <div className="org-kpi">
            <span className="org-kpi-val font-display text-coral">{activeIncidents.length}</span>
            <span className="org-kpi-sub text-xs text-secondary">Unresolved Reports</span>
          </div>
          <div className="org-incidents-preview mt-2">
            {activeIncidents.slice(0, 2).map(inc => (
              <div key={inc.id} className="org-inc-row text-xs">
                <span>{inc.icon} {inc.label}</span>
                <span className="text-muted">{inc.zone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- TILE 4: Volunteer Coverage --- */}
        <div className="org-tile org-tile--volunteers glass-card animate-bento delay-200">
          <span className="org-tile-label">{t('volunteer_coverage')}</span>
          <div className="org-kpi">
            <span className="org-kpi-val font-display text-azure">
              {activeVolunteers}/{totalVolunteers}
            </span>
            <span className="org-kpi-sub text-xs text-secondary">Sectors Staffed</span>
          </div>
        </div>

        {/* --- TILE 5: Weather/Transit --- */}
        <div className="org-tile org-tile--weather glass-card animate-bento delay-300">
          <span className="org-tile-label">Environment</span>
          <div className="weather-kpi">
            <span className="weather-val font-display">74°F</span>
            <span className="weather-desc text-xs text-secondary">Clear Sky · Wind 6mph</span>
          </div>
          <div className="divider" />
          <div className="text-xs text-secondary">
            Transit: Nominal schedules, Secaucus trains operating at 8m frequency.
          </div>
        </div>

        {/* --- TILE 6: Zone Detail Drill-down --- */}
        <div className="org-tile org-tile--detail glass-card animate-bento delay-400">
          <span className="org-tile-label">Sector Analyzer</span>
          {selectedZoneObj ? (
            <div className="org-detail-wrap text-sm">
              <h3 className="font-display text-gold mb-2">{selectedZoneObj.label}</h3>
              <div className="flex flex-col gap-1">
                <div>Gate Access: <strong>{selectedZoneObj.gate}</strong></div>
                <div>Occupancy: <strong>{data.zoneOccupancy[selectedZoneId]}%</strong></div>
                <div>Level Access: <strong>{selectedZoneObj.level}</strong></div>
                <div>Accessibility: <strong>{selectedZoneObj.accessible ? '♿ Step-Free' : 'Stairs Only'}</strong></div>
              </div>
            </div>
          ) : (
            <div className="text-muted text-sm text-center my-auto">
              Click a sector on the heatmap to view metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
