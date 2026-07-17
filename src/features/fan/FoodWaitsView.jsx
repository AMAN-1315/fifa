import { useTranslation } from '../../hooks/useTranslation';
import { useMockData } from '../../hooks/useMockData';
import { FOOD_COURTS, RESTROOMS } from '../../mock/stadiumData';
import { getOccupancyBadgeClass } from '../../mock/generator';
import './FoodWaitsView.css';

export default function FoodWaitsView() {
  const { t } = useTranslation();
  const data = useMockData();

  return (
    <div className="food-waits-view">
      <header className="food-waits-header animate-fadeSlideDown">
        <h1 className="font-display food-waits-title">
          ⏱️ Queue & Wait Times
        </h1>
        <p className="text-secondary text-sm">
          Real-time estimators for food concessions and restrooms near your area.
        </p>
      </header>

      <div className="food-waits-grid">
        {/* Concessions */}
        <div className="food-waits-card glass-card animate-bento delay-0">
          <h2 className="font-display section-subtitle mb-4">🍔 Food & Concessions</h2>
          <div className="waits-list">
            {FOOD_COURTS.map(fc => {
              const wait = data.foodWaits[fc.id] ?? 10;
              return (
                <div key={fc.id} className="wait-list-item">
                  <div className="wait-info">
                    <span className="wait-name font-medium">{fc.name}</span>
                    <span className="wait-gate text-xs text-muted">Near {fc.gate} · {fc.level}</span>
                  </div>
                  <div className="wait-slider">
                    <div
                      className="wait-bar"
                      style={{
                        '--bar-target': `${(wait / 30) * 100}%`,
                        background: wait > 20 ? 'var(--status-red)' : wait > 12 ? 'var(--status-amber)' : 'var(--status-green)'
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

        {/* Restrooms */}
        <div className="food-waits-card glass-card animate-bento delay-100">
          <h2 className="font-display section-subtitle mb-4">🚻 Restrooms & Comfort</h2>
          <div className="waits-list">
            {RESTROOMS.map(r => {
              const wait = data.restroomWaits[r.id] ?? 5;
              return (
                <div key={r.id} className="wait-list-item">
                  <div className="wait-info">
                    <span className="wait-name font-medium">{r.name}</span>
                    <span className="wait-gate text-xs text-muted">
                      {r.accessible ? '♿ Accessible' : 'Standard'}
                    </span>
                  </div>
                  <div className="wait-slider">
                    <div
                      className="wait-bar"
                      style={{
                        '--bar-target': `${(wait / 20) * 100}%`,
                        background: wait > 14 ? 'var(--status-red)' : wait > 8 ? 'var(--status-amber)' : 'var(--status-green)'
                      }}
                    />
                  </div>
                  <span className={`badge ${getOccupancyBadgeClass(wait * 5)}`}>
                    {wait} {t('min')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
