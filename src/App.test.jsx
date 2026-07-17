// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import App from './App';

const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe('App', () => {
  it('renders the landing experience', async () => {
    render(<App />);

    expect(await screen.findByText('StadiumPulse')).toBeTruthy();
  });
});