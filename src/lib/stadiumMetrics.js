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