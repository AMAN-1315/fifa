import { useCallback } from 'react';
import { useApp } from '../store/AppContext';

// Preload all locales synchronously at startup (small files, fine for hackathon)
import enStrings from '../i18n/en.json';
import esStrings from '../i18n/es.json';
import frStrings from '../i18n/fr.json';
import ptStrings from '../i18n/pt.json';
import arStrings from '../i18n/ar.json';

const STRINGS = { en: enStrings, es: esStrings, fr: frStrings, pt: ptStrings, ar: arStrings };

/**
 * useTranslation — returns a t() function that looks up keys in the active language.
 * Falls back to English if the key is missing in the active language.
 */
export function useTranslation() {
  const { state } = useApp();
  const lang = state.language;

  const t = useCallback((key) => {
    const activeStrings = STRINGS[lang] || STRINGS.en;
    const value = activeStrings[key];
    if (value !== undefined) return value;
    // Fallback to English
    const fallback = STRINGS.en[key];
    return fallback !== undefined ? fallback : key;
  }, [lang]);

  return { t, lang };
}

export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English',    flag: '🇺🇸' },
  { code: 'es', label: 'Español',    flag: '🇲🇽' },
  { code: 'fr', label: 'Français',   flag: '🇨🇦' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷' },
  { code: 'ar', label: 'العربية',    flag: '🇸🇦' },
];
