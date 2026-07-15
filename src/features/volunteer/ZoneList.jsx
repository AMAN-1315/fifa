import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useMockData } from '../../hooks/useMockData';
import { ZONES } from '../../mock/stadiumData';
import { getOccupancyBadgeClass } from '../../mock/generator';
import './ZoneList.css';

export default function ZoneList() {
  const { t } = useTranslation();
  const data = useMockData();

  return (
    <div className="zone-list-view">
      <header className="zone-header animate-fadeSlideDown">
        <h1 className="font-display zone-title">📍 All Stadium Zones</h1>
        <p className="text-secondary text-sm">
          Overview of all sections, gates, level access, and live occupancy density indicators.
        </p>
      </header>

      <div className="zone-grid-list">
        {ZONES.map(z => {
          const occ = data.zoneOccupancy[z.id] ?? 50;
          return (
            <div key={z.id} className="zone-card glass-card animate-bento">
              <div className="zone-card-top">
                <span className="zone-lbl font-semibold">{z.label}</span>
                <span className={`badge ${getOccupancyBadgeClass(occ)}`}>
                  {occ}%
                </span>
              </div>
              <div className="divider" />
              <div className="zone-details text-xs text-muted">
                <div>Gate: {z.gate}</div>
                <div>Level: {z.level}</div>
                <div>Accessibility: {z.accessible ? '♿ Yes' : 'No'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
