import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import { useMockData } from '../../hooks/useMockData';
import { MATCH, FOOD_COURTS, SHUTTLE_ROUTES } from '../../mock/stadiumData';
import { getOccupancyBadgeClass, formatCountdown } from '../../mock/generator';
import StadiumMap from '../../components/map/StadiumMap';
import './FanHome.css';

function useCountdown(targetTime) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const update = () => {
      const ms = new Date(targetTime) - Date.now();
      setDiff(Math.max(0, ms));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetTime]);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, past: diff === 0 };
}

export default function FanHome() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useMockData();
  const countdown = useCountdown(MATCH.kickoff);

  const mySection = state.currentZone || 'Section 114';
  const myGate    = 'Gate G';

  const nextShuttle = Object.entries(data.shuttleCountdowns)
    .sort(([,a],[,b]) => a - b)[0];
  const shuttleRoute = SHUTTLE_ROUTES.find(s => s.id === nextShuttle?.[0]);

  return (
    <div className="fan-home">
      {/* Bento grid header */}
      <header className="fan-header animate-fadeSlideDown">
        <div>
          <h1 className="font-display fan-greeting">
            Match Day 🏆
          </h1>
          <p className="text-secondary text-sm">
            {MATCH.homeTeam.flag} {MATCH.homeTeam.name} vs {MATCH.awayTeam.name} {MATCH.awayTeam.flag} · {mySection}
          </p>
        </div>
        <div className="fan-header-badges">
          {state.accessibilityMode && (
            <span className="badge badge-azure">♿ Accessible</span>
          )}
          <span className="badge badge-gold">🏟️ {t('match_quarter_final')}</span>
        </div>
      </header>

      {/* === BENTO GRID === */}
      <div className="fan-bento">

        {/* --- TILE 1: Live Map (large) --- */}
        <div
          className="fan-tile fan-tile--map glass-card animate-bento delay-0"
          role="region"
          aria-label="Stadium map"
        >
          <div className="fan-tile-header">
            <span className="fan-tile-title font-display">🗺️ {t('nav_map')}</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/fan/map')}
            >
              Full Map →
            </button>
          </div>
          <div className="fan-map-preview">
            <StadiumMap
              occupancyData={data.zoneOccupancy}
              selectedZone="z14"
              compact={true}
              showAccessible={state.accessibilityMode}
            />
          </div>
          <div className="fan-map-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/fan/map')}
            >
              📍 {t('find_my_seat')}
            </button>
            {state.accessibilityMode && (
              <button
                className="btn btn-azure btn-sm"
                onClick={() => navigate('/fan/map')}
              >
                ♿ {t('step_free')}
              </button>
            )}
          </div>
        </div>

        {/* --- TILE 2: Kickoff countdown --- */}
        <div
          className="fan-tile fan-tile--countdown glass-card animate-bento delay-100"
          role="region"
          aria-label="Match countdown"
        >
          <span className="fan-tile-label">{t('match_kickoff')}</span>
          <div className="fan-match-teams">
            <span className="fan-team-flag">{MATCH.homeTeam.flag}</span>
            <span className="fan-match-vs font-display">{t('match_vs')}</span>
            <span className="fan-team-flag">{MATCH.awayTeam.flag}</span>
          </div>
          {countdown.past ? (
            <span className="badge badge-red animate-status-pulse">🔴 {t('match_live')}</span>
          ) : (
            <div className="fan-countdown" aria-label="Time until kickoff">
              <div className="fan-countdown-unit">
                <span className="fan-countdown-num font-display">{String(countdown.h).padStart(2,'0')}</span>
                <span className="fan-countdown-label">hrs</span>
              </div>
              <span className="fan-countdown-sep font-display">:</span>
              <div className="fan-countdown-unit">
                <span className="fan-countdown-num font-display">{String(countdown.m).padStart(2,'0')}</span>
                <span className="fan-countdown-label">min</span>
              </div>
              <span className="fan-countdown-sep font-display">:</span>
              <div className="fan-countdown-unit">
                <span className="fan-countdown-num font-display">{String(countdown.s).padStart(2,'0')}</span>
                <span className="fan-countdown-label">sec</span>
              </div>
            </div>
          )}
        </div>

        {/* --- TILE 3: My Seat --- */}
        <div
          className="fan-tile fan-tile--seat glass-card animate-bento delay-150"
          role="region"
          aria-label="My seat information"
        >
          <span className="fan-tile-label">🎟️ My Seat</span>
          <div className="fan-seat-info">
            <div className="fan-seat-main font-display">{mySection}</div>
            <div className="fan-seat-sub">Row K · Seat 14</div>
            <div className="fan-seat-gate">
              <span className="badge badge-gold">{myGate}</span>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm w-full mt-auto"
            onClick={() => {
              dispatch({ type: 'SET_SELECTED_SECTION', payload: 'z14' });
              navigate('/fan/map');
            }}
          >
            {t('get_directions')}
          </button>
        </div>

        {/* --- TILE 4: Queue Status --- */}
        <div
          className="fan-tile fan-tile--queues glass-card animate-bento delay-200"
          role="region"
          aria-label="Queue times"
        >
          <div className="fan-tile-header">
            <span className="fan-tile-title font-display">⏱️ {t('nav_waits')}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/fan/queues')}>
              All →
            </button>
          </div>
          <div className="fan-queue-list">
            {FOOD_COURTS.slice(0, 3).map(fc => {
              const wait = data.foodWaits[fc.id] ?? 10;
              return (
                <div key={fc.id} className="fan-queue-item">
                  <span className="fan-queue-name text-sm">{fc.name}</span>
                  <div className="fan-queue-bar-wrap">
                    <div
                      className="fan-queue-bar"
                      style={{
                        '--bar-target': `${Math.min(100, (wait / 30) * 100)}%`,
                        background: wait > 20
                          ? 'var(--status-red)'
                          : wait > 12
                          ? 'var(--status-amber)'
                          : 'var(--status-green)',
                      }}
                    />
                  </div>
                  <span className={`badge ${getOccupancyBadgeClass(wait * 3)}`}>
                    {wait} {t('min')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- TILE 5: Transit --- */}
        <div
          className="fan-tile fan-tile--transit glass-card animate-bento delay-300"
          role="region"
          aria-label="Transit information"
        >
          <span className="fan-tile-label">🚌 {t('transit')}</span>
          <div className="fan-transit-main">
            <div className="fan-transit-route font-display">
              {shuttleRoute?.name || 'Secaucus Junction'}
            </div>
            <div className="fan-transit-countdown">
              <span className="fan-transit-num font-display">
                {formatCountdown(nextShuttle?.[1] ?? 5)}
              </span>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm w-full"
            onClick={() => navigate('/fan/transit')}
          >
            All Routes →
          </button>
        </div>

        {/* --- TILE 6: Exit Fast --- */}
        <div
          className="fan-tile fan-tile--exit glass-card animate-bento delay-400"
          role="region"
          aria-label="Quick exit"
        >
          <span className="fan-tile-label">🏃 {t('exit_fast')}</span>
          <p className="text-secondary text-sm">
            AI-planned exit route from your section — avoid the post-match crush.
          </p>
          <button
            className="btn btn-ghost btn-sm w-full mt-auto"
            onClick={() => dispatch({ type: 'OPEN_AI_PANEL' })}
          >
            Plan Exit →
          </button>
        </div>

        {/* --- TILE 7: Accessibility Toggle --- */}
        <div
          className={`fan-tile fan-tile--a11y glass-card animate-bento delay-500 ${state.accessibilityMode ? 'fan-tile--a11y-active' : ''}`}
          role="region"
          aria-label="Accessibility options"
        >
          <span className="fan-tile-label">♿ {t('accessibility_mode')}</span>
          <p className="text-secondary text-sm">
            Step-free routes · Quiet zones · Companion seating
          </p>
          <button
            className={`btn btn-sm w-full mt-auto ${state.accessibilityMode ? 'btn-azure' : 'btn-ghost'}`}
            onClick={() => dispatch({ type: 'TOGGLE_ACCESSIBILITY' })}
            aria-pressed={state.accessibilityMode}
          >
            {state.accessibilityMode ? '♿ On — Tap to disable' : 'Enable Accessible Mode'}
          </button>
        </div>

      </div>
    </div>
  );
}
