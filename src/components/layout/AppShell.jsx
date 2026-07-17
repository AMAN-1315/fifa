import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import AIOrb from '../ai/AIOrb';
import AIPanel from '../ai/AIPanel';
import './AppShell.css';

const NAV_CONFIG = {
  fan: [
    { path: '/fan',         label: 'nav_home',    icon: '🏠', end: true },
    { path: '/fan/map',     label: 'nav_map',     icon: '🗺️' },
    { path: '/fan/queues',  label: 'nav_waits',   icon: '⏱️' },
    { path: '/fan/transit', label: 'nav_transit', icon: '🚌' },
  ],
  volunteer: [
    { path: '/volunteer',           label: 'nav_home',      icon: '🏠', end: true },
    { path: '/volunteer/zones',     label: 'nav_zones',     icon: '📍' },
    { path: '/volunteer/incidents', label: 'nav_incidents', icon: '🚨' },
  ],
  organizer: [
    { path: '/organizer',           label: 'nav_dashboard', icon: '📊', end: true },
    { path: '/organizer/incidents', label: 'nav_incidents', icon: '🚨' },
    { path: '/organizer/brief',     label: 'nav_brief',     icon: '🤖' },
  ],
};

const ROLE_COLORS = {
  fan:       'var(--color-gold)',
  volunteer: 'var(--color-azure)',
  organizer: 'var(--color-emerald)',
};

const ROLE_LABELS = {
  fan: '🎟️ Fan Mode',
  volunteer: '🦺 Volunteer Mode',
  organizer: '📊 Organizer Mode',
};

export default function AppShell() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role, aiPanelOpen, situation, accessibilityMode, reduceMotion } = state;

  const navItems = NAV_CONFIG[role] || [];
  const roleColor = ROLE_COLORS[role] || 'var(--color-gold)';

  const handleSwitchRole = () => {
    dispatch({ type: 'RESET_ROLE' });
    navigate('/');
  };

  return (
    <div className="shell-root" data-role={role}>
      {/* === LEFT RAIL (desktop) === */}
      <aside
        className="shell-rail"
        style={{ '--role-color': roleColor }}
        aria-label="Navigation"
      >
        {/* Logo */}
        <div className="shell-rail-logo">
          <span className="shell-rail-logo-icon">⚡</span>
          <span className="font-display shell-rail-logo-text">StadiumPulse</span>
        </div>

        {/* Role badge */}
        <div className="shell-rail-role">
          <span className="shell-rail-role-label">{ROLE_LABELS[role]}</span>
        </div>

        <div className="divider" />

        {/* Nav items */}
        <nav className="shell-rail-nav" aria-label="Main navigation">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `shell-rail-link ${isActive ? 'shell-rail-link--active' : ''}`
              }
              aria-label={t(item.label)}
            >
              <span className="shell-rail-link-icon" aria-hidden="true">{item.icon}</span>
              <span>{t(item.label)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="shell-rail-bottom">
          {/* Accessibility toggle */}
          <button
            className={`shell-rail-toggle ${accessibilityMode ? 'shell-rail-toggle--active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_ACCESSIBILITY' })}
            aria-pressed={accessibilityMode}
            aria-label={t('accessibility_mode')}
          >
            <span aria-hidden="true">♿</span>
            <span>{t('accessibility_mode')}</span>
          </button>

          {/* Reduce motion toggle */}
          <button
            className={`shell-rail-toggle ${reduceMotion ? 'shell-rail-toggle--active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_REDUCE_MOTION' })}
            aria-pressed={reduceMotion}
            aria-label={t('reduce_motion')}
          >
            <span aria-hidden="true">🎭</span>
            <span>{t('reduce_motion')}</span>
          </button>

          {/* Situation indicator */}
          {situation !== 'normal' && (
            <div className={`shell-situation shell-situation--${situation}`} role="alert">
              {situation === 'emergency' ? '🚨 EMERGENCY' : '⚠️ ELEVATED'}
            </div>
          )}

          <button className="shell-rail-switch btn btn-ghost btn-sm" onClick={handleSwitchRole}>
            ← Switch Role
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="shell-main" id="main-content">
        <Outlet />
      </main>

      {/* === BOTTOM NAV (mobile) === */}
      <nav className="shell-bottom-nav" aria-label="Mobile navigation">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `shell-bottom-link ${isActive ? 'shell-bottom-link--active' : ''}`
            }
            style={{ '--role-color': roleColor }}
            aria-label={t(item.label)}
          >
            <span className="shell-bottom-icon" aria-hidden="true">{item.icon}</span>
            <span className="shell-bottom-label">{t(item.label)}</span>
          </NavLink>
        ))}
      </nav>

      {/* === AI ORB + PANEL === */}
      <AIOrb />
      {aiPanelOpen && <AIPanel />}
    </div>
  );
}
