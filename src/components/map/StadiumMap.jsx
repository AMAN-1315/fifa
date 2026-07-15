import React, { useState } from 'react';
import { ZONES, FOOD_COURTS, RESTROOMS } from '../../mock/stadiumData';
import { getOccupancyColor } from '../../mock/generator';
import { useApp } from '../../store/AppContext';
import './StadiumMap.css';

/**
 * StadiumMap — SVG vector stadium map with live occupancy overlays.
 * All coordinates are in a 100×100 viewBox percentage space.
 * Zone tapping dispatches to AppContext for wayfinding.
 */
export default function StadiumMap({
  occupancyData = {},
  selectedZone = null,
  onZoneClick = () => {},
  showRoute = false,
  routeFrom = null,
  routeTo = null,
  showAccessible = false,
  compact = false,
}) {
  const { state } = useApp();
  const [hoveredZone, setHoveredZone] = useState(null);

  const vb = compact ? '20 20 60 60' : '0 0 100 100';

  return (
    <div
      className={`stadium-map-container ${compact ? 'stadium-map--compact' : ''}`}
      role="img"
      aria-label="Stadium map showing sections and their occupancy levels"
    >
      <svg
        viewBox={vb}
        xmlns="http://www.w3.org/2000/svg"
        className="stadium-map-svg"
        aria-hidden="true"
      >
        {/* ---- Background ---- */}
        <rect x="0" y="0" width="100" height="100" fill="#060d1f" />

        {/* ---- Outer stadium shell ---- */}
        <ellipse
          cx="53" cy="50" rx="38" ry="34"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />

        {/* ---- Pitch (field) ---- */}
        <ellipse
          cx="53" cy="50" rx="20" ry="15"
          fill="#0d2b10"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.4"
        />
        {/* Pitch center line */}
        <line x1="53" y1="36" x2="53" y2="64"
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
        {/* Center circle */}
        <circle cx="53" cy="50" r="4"
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
        {/* Center spot */}
        <circle cx="53" cy="50" r="0.6" fill="rgba(255,255,255,0.2)" />
        {/* Goal boxes */}
        <rect x="48" y="35.5" width="10" height="4"
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
        <rect x="48" y="60.5" width="10" height="4"
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />

        {/* ---- Seating zones ---- */}
        {ZONES.map(zone => {
          const occupancy = occupancyData[zone.id] ?? 50;
          const isSelected = selectedZone === zone.id;
          const isHovered = hoveredZone === zone.id;
          const color = getOccupancyColor(occupancy);
          const isAccessibleHighlight = showAccessible && zone.accessible;

          // Draw as small ellipse arc segments around the pitch
          const cx = zone.x * 1.0; // already in 0-100 space
          const cy = zone.y * 1.0;
          const rx = zone.level === 'Upper' ? 2.8 : 2.2;
          const ry = zone.level === 'Upper' ? 2.0 : 1.7;

          return (
            <g
              key={zone.id}
              className={`zone-group ${isSelected ? 'zone-group--selected' : ''}`}
              onClick={() => onZoneClick(zone)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
              role="button"
              aria-label={`${zone.label}, ${zone.gate}, ${Math.round(occupancy)}% full`}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onZoneClick(zone)}
            >
              <ellipse
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={isAccessibleHighlight ? 'var(--color-azure)' : color}
                fillOpacity={isSelected ? 0.9 : isHovered ? 0.75 : 0.55}
                stroke={isSelected ? '#fff' : isAccessibleHighlight ? 'var(--color-azure)' : color}
                strokeWidth={isSelected ? 0.4 : 0.2}
                style={{
                  cursor: 'pointer',
                  transition: 'fill-opacity 0.2s, stroke 0.2s',
                  filter: isSelected ? `drop-shadow(0 0 3px ${color})` : undefined,
                }}
              />
              {/* Zone label — only show on non-compact or hovered */}
              {(!compact || isSelected) && (
                <text
                  x={cx}
                  y={cy + 0.5}
                  textAnchor="middle"
                  fontSize={compact ? '1.5' : '1.1'}
                  fill="rgba(255,255,255,0.9)"
                  fontWeight="600"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {zone.label.replace('Section ', '').replace('Club ', 'C').replace('Upper ', 'U')}
                </text>
              )}
            </g>
          );
        })}

        {/* ---- Route overlay (animated stroke) ---- */}
        {showRoute && routeFrom && routeTo && (
          <line
            x1={routeFrom.x} y1={routeFrom.y}
            x2={routeTo.x}   y2={routeTo.y}
            stroke="var(--color-gold)"
            strokeWidth="0.6"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            strokeLinecap="round"
            style={{ animation: 'routeDraw 1.5s cubic-bezier(0.4,0,0.2,1) forwards' }}
          />
        )}

        {/* ---- Gate labels ---- */}
        {!compact && [
          { label: 'A', x: 53, y: 78 },
          { label: 'B', x: 33, y: 70 },
          { label: 'C', x: 27, y: 50 },
          { label: 'D', x: 33, y: 30 },
          { label: 'E', x: 53, y: 22 },
          { label: 'F', x: 73, y: 30 },
          { label: 'G', x: 79, y: 50 },
          { label: 'H', x: 73, y: 70 },
        ].map(gate => (
          <text
            key={gate.label}
            x={gate.x}
            y={gate.y}
            textAnchor="middle"
            fontSize="2.2"
            fontWeight="700"
            fill="rgba(245,197,24,0.7)"
            fontFamily="Outfit, sans-serif"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            Gate {gate.label}
          </text>
        ))}

        {/* ---- Food court markers ---- */}
        {!compact && FOOD_COURTS.slice(0, 4).map(fc => (
          <g key={fc.id} style={{ pointerEvents: 'none' }}>
            <circle cx={fc.x} cy={fc.y} r="1.2"
              fill="rgba(255,107,107,0.4)"
              stroke="rgba(255,107,107,0.6)"
              strokeWidth="0.3"
            />
          </g>
        ))}

        {/* ---- Hover tooltip ---- */}
        {hoveredZone && (() => {
          const zone = ZONES.find(z => z.id === hoveredZone);
          const occ = occupancyData[hoveredZone] ?? 50;
          if (!zone) return null;
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect
                x={zone.x - 10} y={zone.y - 8}
                width="20" height="6"
                rx="1" fill="rgba(6,13,31,0.9)"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.2"
              />
              <text
                x={zone.x} y={zone.y - 4}
                textAnchor="middle"
                fontSize="1.6"
                fill="white"
                fontFamily="Inter, sans-serif"
              >
                {zone.label} · {Math.round(occ)}%
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      {!compact && (
        <div className="stadium-map-legend" aria-label="Occupancy legend">
          <div className="map-legend-item">
            <span className="map-legend-dot" style={{ background: 'var(--status-green)' }} />
            <span>Low</span>
          </div>
          <div className="map-legend-item">
            <span className="map-legend-dot" style={{ background: 'var(--status-amber)' }} />
            <span>Moderate</span>
          </div>
          <div className="map-legend-item">
            <span className="map-legend-dot" style={{ background: 'var(--status-red)' }} />
            <span>High</span>
          </div>
          {showAccessible && (
            <div className="map-legend-item">
              <span className="map-legend-dot" style={{ background: 'var(--color-azure)' }} />
              <span>Accessible</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
