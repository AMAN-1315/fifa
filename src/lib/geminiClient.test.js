import { describe, expect, it } from 'vitest';
import { buildGeminiRequest, extractGeminiText } from './geminiClient';

describe('geminiClient', () => {
  it('builds a Gemini request payload', () => {
    const payload = buildGeminiRequest({
      model: 'gemini-2.0-flash',
      systemPrompt: 'system prompt',
      messages: [
        { role: 'user', content: 'hello' },
        { role: 'assistant', content: 'hi' },
      ],
      maxOutputTokens: 256,
      temperature: 0.4,
    });

    expect(payload.model).toBe('gemini-2.0-flash');
    expect(payload.systemInstruction.parts[0].text).toBe('system prompt');
    expect(payload.contents).toHaveLength(2);
    expect(payload.contents[0].role).toBe('user');
    expect(payload.contents[1].role).toBe('model');
    expect(payload.generationConfig.maxOutputTokens).toBe(256);
  });

  it('extracts text from a Gemini response', () => {
    expect(
      extractGeminiText({
        candidates: [
          {
            content: {
              parts: [{ text: 'Hello' }, { text: ' world' }],
            },
          },
        ],
      }),
    ).toBe('Hello world');
  });
});