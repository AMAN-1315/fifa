import React from 'react';
import { useApp } from '../../store/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useMockData } from '../../hooks/useMockData';
import './IncidentList.css';

export default function IncidentList() {
  const { state } = useApp();
  const { t } = useTranslation();
  const data = useMockData();
  const isOrganizer = state.role === 'organizer';

  return (
    <div className="incident-list-view">
      <header className="incident-header animate-fadeSlideDown">
        <h1 className="font-display incident-title">
          🚨 {isOrganizer ? 'Command Operations Center' : 'Zone Incident Manager'}
        </h1>
        <p className="text-secondary text-sm">
          {isOrganizer
            ? 'Unified Incident Dispatch, triage statuses, and active stadium escalations.'
            : 'Track alerts, report safety status, and review supervisor response updates.'}
        </p>
      </header>

      <div className="incident-content">
        <div className="incident-feed-card glass-card animate-scaleIn">
          <div className="feed-header mb-4">
            <span className="font-display section-subtitle">Incident Feed</span>
            <span className="badge badge-red">{data.incidents.length} Active Alerts</span>
          </div>

          <div className="incidents-scroller scroll-container">
            {data.incidents.length === 0 ? (
              <div className="text-center py-8 text-muted">No active incidents. Nominal conditions.</div>
            ) : (
              data.incidents.map(inc => (
                <div key={inc.id} className={`incident-card-item severity--${inc.severity}`}>
                  <div className="incident-card-top">
                    <span className="incident-icon" aria-hidden="true">{inc.icon}</span>
                    <div className="incident-meta">
                      <span className="incident-name font-semibold">{inc.label}</span>
                      <span className="incident-loc text-xs text-muted">
                        {inc.zone} · {inc.gate} · {new Date(inc.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <span className={`badge badge-sev--${inc.severity} ml-auto`}>
                      {inc.severity}
                    </span>
                  </div>

                  <div className="incident-suggestion">
                    <span className="ai-badge">AI Recommendations</span>
                    <p className="text-xs text-secondary">{inc.aiAction}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
