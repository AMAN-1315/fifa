import { useMockData } from '../../hooks/useMockData';
import { SHUTTLE_ROUTES } from '../../mock/stadiumData';
import { formatCountdown } from '../../mock/generator';
import './TransitView.css';

export default function TransitView() {
  const data = useMockData();

  return (
    <div className="transit-view">
      <header className="transit-header animate-fadeSlideDown">
        <h1 className="font-display transit-title">
          🚌 Tournament Transport
        </h1>
        <p className="text-secondary text-sm">
          Live departures and estimated journey times for official FIFA shuttles and rail links.
        </p>
      </header>

      <div className="transit-grid">
        <div className="transit-card glass-card animate-scaleIn">
          <h2 className="font-display section-subtitle mb-4">Shuttle Schedule</h2>
          <div className="transit-list">
            {SHUTTLE_ROUTES.map(route => {
              const countdownVal = data.shuttleCountdowns[route.id] ?? 5;
              return (
                <div key={route.id} className="transit-item">
                  <div className="transit-icon-wrap" aria-hidden="true">🚌</div>
                  <div className="transit-details">
                    <span className="transit-name font-semibold">{route.name}</span>
                    <span className="transit-sub text-xs text-muted">
                      Every {route.frequency} min · Travel time: {route.duration} min
                    </span>
                  </div>
                  <div className="transit-time-badge">
                    <span className="transit-next-lbl text-xs text-muted">Next shuttle</span>
                    <span className="transit-countdown-val font-display text-azure">
                      {formatCountdown(countdownVal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="transit-card glass-card animate-fadeSlideUp delay-100">
          <h2 className="font-display section-subtitle mb-4">🚀 Fast Exit Strategy</h2>
          <p className="text-secondary text-sm mb-4">
            MetLife Stadium has direct access to NJ Transit. To ensure the fastest travel back to your hub:
          </p>
          <div className="exit-tips">
            <div className="exit-tip">
              <span className="exit-tip-num">1</span>
              <div>
                <strong>Secaucus Junction Link</strong>: Board the rail link directly from the South Exit Gate. Boarding is first-come-first-serve.
              </div>
            </div>
            <div className="exit-tip">
              <span className="exit-tip-num">2</span>
              <div>
                <strong>Manhattan Express Bus</strong>: Coaches depart from Lot G starting 20 mins post-match. Pre-purchased ticket required.
              </div>
            </div>
          </div>
          <div className="divider" />
          <button
            className="btn btn-primary w-full"
            onClick={() => window.open('#', '_blank')}
          >
            Download Digital Transit Pass
          </button>
        </div>
      </div>
    </div>
  );
}
