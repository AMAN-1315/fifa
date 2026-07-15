import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { useTranslation, LANGUAGE_OPTIONS } from '../../hooks/useTranslation';
import './LandingPage.css';

const ROLES = [
  {
    id: 'fan',
    icon: '🎟️',
    color: 'gold',
    gradient: 'linear-gradient(135deg, rgba(245,197,24,0.15) 0%, rgba(245,197,24,0.03) 100%)',
    border: 'rgba(245,197,24,0.3)',
    glow: 'rgba(245,197,24,0.2)',
    descKey: 'role_fan_desc',
    labelKey: 'role_fan',
    features: ['Wayfinding & Seat Finder', 'Live Queue Times', 'Accessible Routes', 'Transit Planner'],
  },
  {
    id: 'volunteer',
    icon: '🦺',
    color: 'azure',
    gradient: 'linear-gradient(135deg, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.03) 100%)',
    border: 'rgba(0,180,216,0.3)',
    glow: 'rgba(0,180,216,0.2)',
    descKey: 'role_volunteer_desc',
    labelKey: 'role_volunteer',
    features: ['Zone Density Alerts', 'Incident Reports', 'Shift Dashboard', 'AI Crowd Guidance'],
  },
  {
    id: 'organizer',
    icon: '📊',
    color: 'emerald',
    gradient: 'linear-gradient(135deg, rgba(46,194,126,0.15) 0%, rgba(46,194,126,0.03) 100%)',
    border: 'rgba(46,194,126,0.3)',
    glow: 'rgba(46,194,126,0.2)',
    descKey: 'role_organizer_desc',
    labelKey: 'role_organizer',
    features: ['Command Center', 'AI Ops Briefs', 'Live Heatmap', 'Incident Intelligence'],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { t } = useTranslation();

  const handleRoleSelect = (roleId) => {
    dispatch({ type: 'SET_ROLE', payload: roleId });
    const routes = { fan: '/fan', volunteer: '/volunteer', organizer: '/organizer' };
    navigate(routes[roleId]);
  };

  const handleLanguage = (code) => {
    dispatch({ type: 'SET_LANGUAGE', payload: code });
  };

  return (
    <div className="landing-root">
      {/* Background — stadium arc linework */}
      <div className="landing-bg" aria-hidden="true">
        <div className="landing-bg-arc" />
        <div className="landing-bg-glow landing-bg-glow--1" />
        <div className="landing-bg-glow landing-bg-glow--2" />
        <div className="pitch-bg" />
      </div>

      {/* Header */}
      <header className="landing-header animate-fadeSlideDown">
        <div className="landing-logo">
          <span className="landing-logo-icon" aria-hidden="true">⚡</span>
          <span className="landing-logo-text font-display">StadiumPulse</span>
        </div>
        <nav className="landing-lang-nav" aria-label="Language selector">
          {LANGUAGE_OPTIONS.map(opt => (
            <button
              key={opt.code}
              className={`landing-lang-btn ${state.language === opt.code ? 'landing-lang-btn--active' : ''}`}
              onClick={() => handleLanguage(opt.code)}
              aria-label={`Switch to ${opt.label}`}
              aria-pressed={state.language === opt.code}
            >
              <span>{opt.flag}</span>
              <span className="landing-lang-code">{opt.code.toUpperCase()}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <main className="landing-main">
        <div className="landing-hero animate-fadeSlideUp delay-100">
          <div className="landing-event-badge">
            <span className="badge badge-gold">
              <span>⚽</span> {t('wc2026')}
            </span>
          </div>
          <h1 className="landing-title font-display">
            <span className="landing-title-pulse">Stadium</span>
            <span className="landing-title-pulse landing-title-pulse--gold">Pulse</span>
          </h1>
          <p className="landing-subtitle">{t('tagline')}</p>
          <p className="landing-desc">
            MetLife Stadium · Morocco vs Portugal · Quarter-Final · July 15, 2026
          </p>
        </div>

        {/* Role cards */}
        <div className="landing-roles" role="list" aria-label="Role selection">
          <p className="landing-roles-label text-secondary text-sm tracking-wider uppercase">
            {t('role_select')}
          </p>
          <div className="landing-cards">
            {ROLES.map((role, i) => (
              <button
                key={role.id}
                className={`landing-card animate-bento delay-${(i + 1) * 150}`}
                style={{
                  '--card-gradient': role.gradient,
                  '--card-border': role.border,
                  '--card-glow': role.glow,
                }}
                onClick={() => handleRoleSelect(role.id)}
                role="listitem"
                aria-label={`Enter as ${t(role.labelKey)}: ${t(role.descKey)}`}
              >
                <div className="landing-card-icon" aria-hidden="true">{role.icon}</div>
                <div className="landing-card-content">
                  <h2 className="landing-card-title font-display">{t(role.labelKey)}</h2>
                  <p className="landing-card-desc">{t(role.descKey)}</p>
                  <ul className="landing-card-features" aria-label="Features">
                    {role.features.map(f => (
                      <li key={f} className="landing-card-feature">
                        <span className="landing-card-feature-dot" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="landing-card-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live match ticker */}
        <div className="landing-ticker animate-fadeIn delay-600" aria-label="Match information">
          <div className="landing-ticker-inner">
            <span className="badge badge-red animate-status-pulse">🔴 LIVE</span>
            <span>MetLife Stadium · 82,500 capacity</span>
            <span>·</span>
            <span>🇲🇦 Morocco vs Portugal 🇵🇹</span>
            <span>·</span>
            <span>⚡ AI-Powered Operations</span>
            <span>·</span>
            <span>🌍 5 Languages</span>
            <span>·</span>
            <span>♿ Fully Accessible</span>
          </div>
        </div>
      </main>
    </div>
  );
}
