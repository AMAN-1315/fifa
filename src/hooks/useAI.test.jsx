// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { getDemoResponse, useAI } from './useAI';

describe('useAI demo routing', () => {
  it('routes fan seat requests to the seat response', () => {
    const response = getDemoResponse('fan', 'Where is my seat and gate?');
    expect(response).toContain('Gate G');
    expect(response).toContain('Section 114');
  });

  it('routes organizer brief requests to the summary response', () => {
    const response = getDemoResponse('organizer', 'Give me a summary brief');
    expect(response).toContain('AI Operations Brief');
  });
});

describe('useAI error fallback', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn(() => Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: { message: 'boom' } }),
    }));
    vi.stubEnv('VITE_GOOGLE_API_KEY', 'real_key');
    vi.stubEnv('VITE_GOOGLE_MODEL', 'gemini-2.0-flash');
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it('falls back to demo text when fetch fails', async () => {
    const { result } = renderHook(() => useAI());

    let response;
    await act(async () => {
      response = await result.current.sendMessage({
        messages: [{ role: 'user', content: 'What food is near me?' }],
        role: 'fan',
        situation: 'normal',
        zone: 'Section 114',
        language: 'en',
      });
    });

    expect(response).toContain('Best bets right now');
    expect(result.current.error).toBe('boom');
  });
});