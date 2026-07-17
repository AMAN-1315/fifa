import { useState } from 'react';
import { useApp } from '../../store/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import { useMockData } from '../../hooks/useMockData';
import { ZONES, INCIDENT_CATEGORIES } from '../../mock/stadiumData';
import { getOccupancyColor } from '../../mock/generator';
import './VolunteerHome.css';

export default function VolunteerHome() {
  const { dispatch } = useApp();
  const { t } = useTranslation();
  const data = useMockData();

  // Current volunteer assignment context
  const myZoneId = 'z5'; // Section 105 (Diego's assignment)
  const myZoneObj = ZONES.find(z => z.id === myZoneId);
  const myZoneOccupancy = data.zoneOccupancy[myZoneId] ?? 70;

  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'report' | 'tasks'
  
  // Incident Form state
  const [incCategory, setIncCategory] = useState(INCIDENT_CATEGORIES[0].id);
  const [incSeverity, setIncSeverity] = useState('medium');
  const [incDetails, setIncDetails] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIncDetails('');
      setActiveTab('alerts');
    }, 2000);
  };

  const criticalZones = Object.entries(data.zoneOccupancy)
    .filter(([,pct]) => pct >= 80)
    .map(([id]) => ZONES.find(z => z.id === id))
    .filter(Boolean);

  return (
    <div className="volunteer-home">
      <header className="volunteer-header animate-fadeSlideDown">
        <div>
          <h1 className="font-display volunteer-title">🦺 Volunteer Hub</h1>
          <p className="text-secondary text-sm">
            Diego Reyes · Gate Steward · Zone {myZoneObj?.label} ({myZoneObj?.gate})
          </p>
        </div>
        <span className="badge badge-azure font-display">Shift: 18:00 – 23:00</span>
      </header>

      <div className="volunteer-grid">
        {/* Left Side: Shift status & live telemetry */}
        <div className="volunteer-main-cards">
          {/* Shift Details & Zone Density */}
          <div className="volunteer-card glass-card animate-scaleIn">
            <span className="volunteer-card-label">Assigned Sector Status</span>
            <div className="volunteer-status-split">
              <div className="volunteer-telemetry">
                <span className="text-secondary text-xs uppercase font-semibold">Active Sector</span>
                <span className="telemetry-main font-display text-azure">{myZoneObj?.label}</span>
                <span className="text-muted text-xs">Access Gate: {myZoneObj?.gate}</span>
              </div>
              <div className="volunteer-gauge-wrap">
                <svg viewBox="0 0 36 36" className="volunteer-gauge">
                  <path
                    className="gauge-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="gauge-fill"
                    stroke={getOccupancyColor(myZoneOccupancy)}
                    strokeDasharray={`${myZoneOccupancy}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="gauge-text font-display" fill="#fff">
                    {Math.round(myZoneOccupancy)}%
                  </text>
                </svg>
                <span className="gauge-label text-xs font-semibold text-muted">Density Meter</span>
              </div>
            </div>

            {/* AI Suggestion box based on occupancy */}
            <div className="volunteer-ai-tip mt-4">
              <span className="ai-tip-avatar">⚡</span>
              <div className="ai-tip-body">
                <span className="ai-tip-title font-semibold text-xs text-gold">AI Crowd Intelligence</span>
                <p className="text-xs text-secondary">
                  {myZoneOccupancy >= 80
                    ? `Zone ${myZoneObj?.label} is at critical density. Recommend holding entry flow at Gate C for 5 min.`
                    : `Zone ${myZoneObj?.label} flow is steady. Standard entry policies apply.`}
                </p>
              </div>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="volunteer-tabs-card glass-card animate-fadeSlideUp delay-100">
            <div className="volunteer-tabs-nav" role="tablist">
              <button
                className={`vol-tab-btn ${activeTab === 'alerts' ? 'vol-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('alerts')}
                role="tab"
                aria-selected={activeTab === 'alerts'}
              >
                🔔 Alerts Log ({criticalZones.length})
              </button>
              <button
                className={`vol-tab-btn ${activeTab === 'report' ? 'vol-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('report')}
                role="tab"
                aria-selected={activeTab === 'report'}
              >
                🚨 Log Incident
              </button>
              <button
                className={`vol-tab-btn ${activeTab === 'tasks' ? 'vol-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('tasks')}
                role="tab"
                aria-selected={activeTab === 'tasks'}
              >
                📋 Active Tasks
              </button>
            </div>

            <div className="vol-tab-content">
              {activeTab === 'alerts' && (
                <div className="vol-alerts-log scroll-container">
                  {criticalZones.length === 0 ? (
                    <div className="vol-empty text-center py-4 text-muted text-sm">
                      No critical zone bottlenecks reported.
                    </div>
                  ) : (
                    criticalZones.map(zone => (
                      <div key={zone.id} className="vol-alert-item">
                        <span className="badge badge-red font-display">Density Limit</span>
                        <div className="vol-alert-desc">
                          <strong>{zone.label}</strong> exceeds 80% occupancy. Flow routing suggested.
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'report' && (
                <div className="vol-report-form">
                  {formSubmitted ? (
                    <div className="form-success text-center py-8">
                      <span className="success-icon" aria-hidden="true">✅</span>
                      <h3 className="font-display text-emerald mt-2">{t('incident_submitted')}</h3>
                      <p className="text-secondary text-sm">Incident routed to Command Center.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleReportSubmit} className="flex flex-col gap-3">
                      <div className="form-group">
                        <label className="text-xs text-secondary font-semibold">Incident Category</label>
                        <select
                          value={incCategory}
                          onChange={e => setIncCategory(e.target.value)}
                          className="vol-select"
                        >
                          {INCIDENT_CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.icon} {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="text-xs text-secondary font-semibold">Severity Level</label>
                        <div className="sev-options">
                          {['low', 'medium', 'high'].map(sev => (
                            <button
                              key={sev}
                              type="button"
                              className={`sev-btn sev-btn--${sev} ${incSeverity === sev ? 'sev-btn--active' : ''}`}
                              onClick={() => setIncSeverity(sev)}
                            >
                              {sev.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="text-xs text-secondary font-semibold">Detailed Description</label>
                        <textarea
                          value={incDetails}
                          onChange={e => setIncDetails(e.target.value)}
                          className="vol-textarea"
                          rows={2}
                          placeholder="Provide location details, descriptions, status..."
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-primary w-full mt-2">
                        🚨 Submit Alert
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="vol-tasks-list">
                  <div className="vol-task-item">
                    <input type="checkbox" id="t1" className="vol-chk" />
                    <label htmlFor="t1" className="vol-task-lbl text-sm">
                      Check elevator operation at Gate C main corridor
                    </label>
                  </div>
                  <div className="vol-task-item">
                    <input type="checkbox" id="t2" className="vol-chk" />
                    <label htmlFor="t2" className="vol-task-lbl text-sm">
                      Confirm accessible ramps are clear in Section 105
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Command Quick Guide / AI Orb assistance tip */}
        <div className="volunteer-side-panel glass-card animate-fadeSlideLeft">
          <h2 className="font-display section-subtitle mb-4">📖 Steward Guidelines</h2>
          <ul className="guideline-list">
            <li>Always confirm ticket gate validation before admitting guests.</li>
            <li>Maintain clear egress paths at portals. Report blockages immediately.</li>
            <li>In case of medical emergency, direct paramedics to Sectors 105/106 via Outer Ring link.</li>
          </ul>
          <div className="divider" />
          <button
            className="btn btn-ghost w-full"
            onClick={() => dispatch({ type: 'OPEN_AI_PANEL' })}
          >
            💬 Check Steward FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
