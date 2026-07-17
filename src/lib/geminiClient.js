function normalizeMessageRole(role) {
  return role === 'assistant' ? 'model' : 'user';
}

function messageToPart(message) {
  return {
    role: normalizeMessageRole(message.role),
    parts: [{ text: message.content ?? '' }],
  };
}

export function buildGeminiRequest({ model, systemPrompt, messages, maxOutputTokens = 512, temperature = 0.6 }) {
  const contents = messages
    .filter(message => message && typeof message.content === 'string')
    .map(messageToPart);

  return {
    model,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      maxOutputTokens,
      temperature,
    },
  };
}

export function extractGeminiText(data) {
  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (Array.isArray(parts) && parts.length > 0) {
    return parts.map(part => part.text || '').join('').trim();
  }

  const fallbackText = data?.promptFeedback?.blockReason || data?.error?.message || '';
  return fallbackText;
}