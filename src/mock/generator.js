/**
 * Mock Live Data Generator — simulates real-time stadium sensor feeds.
 * Refreshes every 8 seconds; uses random-walk bounded to feel realistic.
 * 
 * In production: replace generator calls with WebSocket stadium data feeds.
 */

import { ZONES, FOOD_COURTS, RESTROOMS, SHUTTLE_ROUTES, VOLUNTEER_PROFILES } from './stadiumData';

// ---------- State ----------
let _zoneOccupancy = {};   // zoneId -> 0-100
let _foodWaits = {};       // foodCourtId -> minutes
let _restroomWaits = {};   // restroomId -> minutes
let _shuttleCountdowns = {};
let _incidents = [];
let _volunteerStatus = {};
let _listeners = new Set();

// ---------- Initialize ----------
function init() {
  ZONES.forEach(z => {
    _zoneOccupancy[z.id] = randomBetween(25, 85);
  });
  FOOD_COURTS.forEach(f => {
    _foodWaits[f.id] = randomBetween(3, 22);
  });
  RESTROOMS.forEach(r => {
    _restroomWaits[r.id] = randomBetween(1, 15);
  });
  SHUTTLE_ROUTES.forEach(s => {
    _shuttleCountdowns[s.id] = randomBetween(2, s.frequency);
  });
  VOLUNTEER_PROFILES.forEach(v => {
    _volunteerStatus[v.id] = 'active';
  });
  _incidents = generateInitialIncidents();
}

// ---------- Tick / Random Walk ----------
function tick() {
  ZONES.forEach(z => {
    _zoneOccupancy[z.id] = clamp(
      _zoneOccupancy[z.id] + randomBetween(-5, 7),
      10, 100
    );
  });
  FOOD_COURTS.forEach(f => {
    _foodWaits[f.id] = clamp(
      _foodWaits[f.id] + randomBetween(-3, 4),
      1, 30
    );
  });
  RESTROOMS.forEach(r => {
    _restroomWaits[r.id] = clamp(
      _restroomWaits[r.id] + randomBetween(-2, 3),
      0, 20
    );
  });
  SHUTTLE_ROUTES.forEach(s => {
    _shuttleCountdowns[s.id] = _shuttleCountdowns[s.id] <= 1
      ? s.frequency
      : _shuttleCountdowns[s.id] - 1;
  });

  // Occasionally add a new incident
  if (Math.random() < 0.15) {
    _incidents = [generateIncident(), ..._incidents].slice(0, 20);
  }

  notifyListeners();
}

// ---------- Snapshot (what consumers read) ----------
export function getSnapshot() {
  return {
    zoneOccupancy:    { ..._zoneOccupancy },
    foodWaits:        { ..._foodWaits },
    restroomWaits:    { ..._restroomWaits },
    shuttleCountdowns:{ ..._shuttleCountdowns },
    incidents:        [..._incidents],
    volunteerStatus:  { ..._volunteerStatus },
    totalOccupancy:   Math.round(
      Object.values(_zoneOccupancy).reduce((a, b) => a + b, 0) / ZONES.length
    ),
  };
}

// ---------- Subscribe / Unsubscribe ----------
export function subscribe(listener) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

function notifyListeners() {
  const snap = getSnapshot();
  _listeners.forEach(fn => fn(snap));
}

// ---------- Incident Generation ----------
const INCIDENT_TYPES = [
  { type: 'crowd_surge', label: 'Crowd Surge Alert',      severity: 'high',   icon: '🚨' },
  { type: 'medical',     label: 'Medical Assistance',     severity: 'high',   icon: '🏥' },
  { type: 'lost_found',  label: 'Lost Item Reported',     severity: 'low',    icon: '🎒' },
  { type: 'security',    label: 'Security Checkpoint',    severity: 'medium', icon: '🔒' },
  { type: 'maintenance', label: 'Maintenance Required',   severity: 'low',    icon: '🔧' },
  { type: 'queue_alert', label: 'Queue Build-up',         severity: 'medium', icon: '⏳' },
  { type: 'lost_child',  label: 'Lost Child at Gate',     severity: 'high',   icon: '👶' },
];

function generateIncident() {
  const type = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];
  const zone  = ZONES[Math.floor(Math.random() * ZONES.length)];
  return {
    id:        `inc-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    ...type,
    zone:      zone.label,
    gate:      zone.gate,
    timestamp: new Date(),
    resolved:  false,
    aiAction:  getAIActionSuggestion(type.type, zone),
  };
}

function generateInitialIncidents() {
  return Array.from({ length: 5 }, () => {
    const inc = generateIncident();
    // Stagger timestamps back in time
    inc.timestamp = new Date(Date.now() - randomBetween(60000, 1800000));
    return inc;
  }).sort((a, b) => b.timestamp - a.timestamp);
}

function getAIActionSuggestion(type, zone) {
  const suggestions = {
    crowd_surge: `Redirect fans approaching ${zone.gate} to adjacent Gate. Alert security team.`,
    medical:     `Dispatch on-site medical team to ${zone.label}. Clear path from ${zone.gate}.`,
    lost_found:  `Log item at nearest steward station near ${zone.gate}. Announce on PA.`,
    security:    `Increase checkpoint staff at ${zone.gate}. Monitor CCTV feed.`,
    maintenance: `Flag ${zone.label} for maintenance crew. Route fans via adjacent section.`,
    queue_alert: `Open additional entry lanes at ${zone.gate}. Redirect overflow to Gate B or F.`,
    lost_child:  `Broadcast child description on stadium PA. Escort guardian to child reunion area.`,
  };
  return suggestions[type] || 'Monitor situation and escalate if needed.';
}

// ---------- Helpers ----------
function randomBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getOccupancyLevel(pct) {
  if (pct >= 80) return 'high';
  if (pct >= 55) return 'medium';
  return 'low';
}

export function getOccupancyColor(pct) {
  if (pct >= 80) return 'var(--status-red)';
  if (pct >= 55) return 'var(--status-amber)';
  return 'var(--status-green)';
}

export function getOccupancyBadgeClass(pct) {
  if (pct >= 80) return 'badge-red';
  if (pct >= 55) return 'badge-amber';
  return 'badge-green';
}

export function formatWalkTime(minutes) {
  return `${minutes} min walk`;
}

export function formatCountdown(minutes) {
  if (minutes <= 1) return 'Departing now';
  return `${minutes} min`;
}

// ---------- Bootstrap ----------
init();
// Start the live tick interval
const _tickInterval = setInterval(tick, 8000);

// Clean up on HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => clearInterval(_tickInterval));
}
