import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useMockData } from '../../hooks/useMockData';
import { useApp } from '../../store/AppContext';
import './AIBrief.css';

export default function AIBrief() {
  const { state } = useApp();
  const { t } = useTranslation();
  const data = useMockData();

  return (
    <div className="ai-brief-view">
      <header className="brief-header animate-fadeSlideDown">
        <h1 className="font-display brief-title">🤖 AI Operations Report</h1>
        <p className="text-secondary text-sm">
          Auto-generated situational awareness reports analyzing stadium metrics, transit, and incident triage.
        </p>
      </header>

      <div className="brief-grid">
        <div className="brief-card glass-card animate-scaleIn">
          <h2 className="font-display section-subtitle mb-4">Daily Sitrep Brief</h2>
          <div className="brief-blocks">
            <div className="brief-block">
              <span className="brief-block-title text-gold">📊 Stadium Loading (Occupancy: {data.totalOccupancy}%)</span>
              <p className="text-sm text-secondary leading-relaxed">
                Stadium entry flows are nominal. Sections 101, 102, and 105 report elevated densities due to heavy arrival rates at Gate A and Gate C. Wayfinding routing is successfully dispersing overflow to Gate D.
              </p>
            </div>
            
            <div className="brief-block">
              <span className="brief-block-title text-azure">🚌 Transit Operations (Nominal)</span>
              <p className="text-sm text-secondary leading-relaxed">
                The Secaucus rail link is running smoothly on a 8-minute departure schedule. Manhattan express buses are pre-positioned in Lot G. Shuttles to Newark Penn Penn Penn Penn Pen are on schedule with no reported disruptions.
              </p>
            </div>

            <div className="brief-block">
              <span className="brief-block-title text-coral">🚨 Incident Triage Status ({data.incidents.filter(i => !i.resolved).length} Active)</span>
              <p className="text-sm text-secondary leading-relaxed">
                High severity alerts at Gate C and Zone E7 have dispatched medical & steward patrols. All triage paths are clear. Stewards in Sector 105 are holding flow redirect instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
