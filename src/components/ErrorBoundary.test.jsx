// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

function Exploder() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('shows the provided fallback when a child throws', () => {
    const originalError = console.error;
    console.error = () => {};

    render(
      <ErrorBoundary fallback={<div role="alert">fallback</div>}>
        <Exploder />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toBe('fallback');
    console.error = originalError;
  });
});