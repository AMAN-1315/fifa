/**
 * Stadium static data — zones, gates, sections, food courts, accessible routes.
 * FIFA World Cup 2026 | MetLife Stadium, East Rutherford, NJ
 */

export const STADIUM = {
  name: 'MetLife Stadium',
  city: 'East Rutherford, NJ',
  capacity: 82500,
  gates: ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E', 'Gate F', 'Gate G', 'Gate H'],
};

export const ZONES = [
  { id: 'z1',  label: 'Section 101', gate: 'Gate A', level: 'Lower', x: 48, y: 70, accessible: true },
  { id: 'z2',  label: 'Section 102', gate: 'Gate A', level: 'Lower', x: 44, y: 66, accessible: true },
  { id: 'z3',  label: 'Section 103', gate: 'Gate B', level: 'Lower', x: 40, y: 60, accessible: true },
  { id: 'z4',  label: 'Section 104', gate: 'Gate B', level: 'Lower', x: 38, y: 53, accessible: false },
  { id: 'z5',  label: 'Section 105', gate: 'Gate C', level: 'Lower', x: 38, y: 46, accessible: true },
  { id: 'z6',  label: 'Section 106', gate: 'Gate C', level: 'Lower', x: 40, y: 39, accessible: false },
  { id: 'z7',  label: 'Section 107', gate: 'Gate D', level: 'Lower', x: 44, y: 33, accessible: true },
  { id: 'z8',  label: 'Section 108', gate: 'Gate D', level: 'Lower', x: 50, y: 29, accessible: true },
  { id: 'z9',  label: 'Section 109', gate: 'Gate E', level: 'Lower', x: 56, y: 29, accessible: true },
  { id: 'z10', label: 'Section 110', gate: 'Gate E', level: 'Lower', x: 62, y: 33, accessible: false },
  { id: 'z11', label: 'Section 111', gate: 'Gate F', level: 'Lower', x: 66, y: 39, accessible: true },
  { id: 'z12', label: 'Section 112', gate: 'Gate F', level: 'Lower', x: 68, y: 46, accessible: true },
  { id: 'z13', label: 'Section 113', gate: 'Gate G', level: 'Lower', x: 68, y: 53, accessible: false },
  { id: 'z14', label: 'Section 114', gate: 'Gate G', level: 'Lower', x: 66, y: 60, accessible: true },
  { id: 'z15', label: 'Section 115', gate: 'Gate H', level: 'Lower', x: 62, y: 66, accessible: true },
  { id: 'z16', label: 'Section 116', gate: 'Gate H', level: 'Lower', x: 56, y: 70, accessible: true },
  { id: 'z17', label: 'Club 201',    gate: 'Gate B', level: 'Club',  x: 42, y: 58, accessible: true },
  { id: 'z18', label: 'Club 202',    gate: 'Gate C', level: 'Club',  x: 42, y: 42, accessible: true },
  { id: 'z19', label: 'Club 203',    gate: 'Gate F', level: 'Club',  x: 64, y: 42, accessible: true },
  { id: 'z20', label: 'Club 204',    gate: 'Gate G', level: 'Club',  x: 64, y: 58, accessible: true },
  { id: 'z21', label: 'Upper 301',   gate: 'Gate A', level: 'Upper', x: 50, y: 76, accessible: false },
  { id: 'z22', label: 'Upper 302',   gate: 'Gate E', level: 'Upper', x: 56, y: 23, accessible: false },
];

export const FOOD_COURTS = [
  { id: 'f1', name: 'South Concourse',   gate: 'Gate A/H', level: 'Lower', x: 52, y: 74 },
  { id: 'f2', name: 'North Concourse',   gate: 'Gate D/E', level: 'Lower', x: 52, y: 26 },
  { id: 'f3', name: 'West Concourse',    gate: 'Gate B/C', level: 'Lower', x: 38, y: 50 },
  { id: 'f4', name: 'East Concourse',    gate: 'Gate F/G', level: 'Lower', x: 68, y: 50 },
  { id: 'f5', name: 'Club Level Bar',    gate: 'Gate B',   level: 'Club',  x: 44, y: 50 },
];

export const RESTROOMS = [
  { id: 'r1', name: 'Restrooms — Gate A', x: 50, y: 76, accessible: true },
  { id: 'r2', name: 'Restrooms — Gate C', x: 38, y: 42, accessible: true },
  { id: 'r3', name: 'Restrooms — Gate E', x: 53, y: 26, accessible: true },
  { id: 'r4', name: 'Restrooms — Gate G', x: 67, y: 58, accessible: true },
];

export const ACCESSIBLE_ROUTES = [
  { from: 'Gate A', to: 'Section 101', steps: ['Enter Gate A', 'Take elevator to Level 1', 'Follow blue accessible path to Sec 101'], walkMin: 4 },
  { from: 'Gate C', to: 'Section 105', steps: ['Enter Gate C', 'Use lift at main lobby', 'Follow accessible corridor south', 'Turn right at Sec 105 sign'], walkMin: 5 },
  { from: 'Gate G', to: 'Section 114', steps: ['Enter Gate G', 'Elevator to Level 1', 'Follow accessible path east'], walkMin: 3 },
];

export const MATCH = {
  id: 'm1',
  homeTeam: { name: 'Morocco',  flag: '🇲🇦', color: '#C1272D' },
  awayTeam: { name: 'Portugal', flag: '🇵🇹', color: '#006600' },
  kickoff:  '2026-07-15T21:00:00-04:00',
  stadium:  'MetLife Stadium',
  city:     'East Rutherford, NJ',
  round:    'Quarter-Final',
  homeScore: null,
  awayScore: null,
};

export const VOLUNTEER_PROFILES = [
  { id: 'v1', name: 'Diego Reyes',    zone: 'z5',  gate: 'Gate C', shift: '18:00–23:00', badge: 'Gate Steward' },
  { id: 'v2', name: 'Aisha Tanaka',   zone: 'z14', gate: 'Gate G', shift: '17:30–22:30', badge: 'Accessibility Aid' },
  { id: 'v3', name: 'James O\'Brien', zone: 'z8',  gate: 'Gate D', shift: '18:00–23:30', badge: 'Crowd Safety' },
];

export const INCIDENT_CATEGORIES = [
  { id: 'crowd_surge',  label: 'Crowd Surge',    icon: '🚨', severity: 'high' },
  { id: 'medical',      label: 'Medical',         icon: '🏥', severity: 'high' },
  { id: 'lost_found',   label: 'Lost & Found',    icon: '🎒', severity: 'low' },
  { id: 'security',     label: 'Security',        icon: '🔒', severity: 'medium' },
  { id: 'maintenance',  label: 'Maintenance',     icon: '🔧', severity: 'low' },
  { id: 'lost_child',   label: 'Lost Child',      icon: '👶', severity: 'high' },
  { id: 'other',        label: 'Other',           icon: '📋', severity: 'low' },
];

export const SHUTTLE_ROUTES = [
  { id: 's1', name: 'MetLife ↔ Secaucus Junction', duration: 12, frequency: 8 },
  { id: 's2', name: 'MetLife ↔ Manhattan Bus Hub',  duration: 35, frequency: 15 },
  { id: 's3', name: 'MetLife ↔ Newark Penn Station', duration: 22, frequency: 10 },
  { id: 's4', name: 'MetLife ↔ NJ Transit Express',  duration: 18, frequency: 12 },
];
