import { describe, expect, it } from 'vitest';
import {
  formatCountdown,
  formatWalkTime,
  getOccupancyBadgeClass,
  getOccupancyColor,
  getOccupancyLevel,
} from './stadiumMetrics';

describe('stadiumMetrics', () => {
  it('classifies occupancy by threshold', () => {
    expect(getOccupancyLevel(20)).toBe('low');
    expect(getOccupancyLevel(55)).toBe('medium');
    expect(getOccupancyLevel(80)).toBe('high');
  });

  it('maps occupancy to colors and badge classes', () => {
    expect(getOccupancyColor(30)).toBe('var(--status-green)');
    expect(getOccupancyBadgeClass(60)).toBe('badge-amber');
    expect(getOccupancyColor(90)).toBe('var(--status-red)');
  });

  it('formats walk times and countdowns', () => {
    expect(formatWalkTime(8)).toBe('8 min walk');
    expect(formatCountdown(1)).toBe('Departing now');
    expect(formatCountdown(12)).toBe('12 min');
  });
});