import { useApp } from '../../store/useApp';
import './AIOrb.css';

export default function AIOrb() {
  const { state, dispatch } = useApp();
  const { situation, aiPanelOpen } = state;

  const glowClass = {
    normal:    'orb-glow--gold',
    elevated:  'orb-glow--amber',
    emergency: 'orb-glow--red',
  }[situation] || 'orb-glow--gold';

  return (
    <button
      className={`ai-orb ${aiPanelOpen ? 'ai-orb--open' : ''} ${glowClass}`}
      onClick={() => dispatch({ type: 'TOGGLE_AI_PANEL' })}
      aria-label={aiPanelOpen ? 'Close AI assistant' : 'Open AI assistant'}
      aria-expanded={aiPanelOpen}
      aria-controls="ai-panel"
    >
      <div className="ai-orb-inner animate-orb-float">
        <span className="ai-orb-icon" aria-hidden="true">
          {aiPanelOpen ? '✕' : '⚡'}
        </span>
      </div>
      {!aiPanelOpen && (
        <span className="ai-orb-label">AI</span>
      )}
    </button>
  );
}
