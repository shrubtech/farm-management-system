'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, SUPPORTED_LANGUAGES, LanguageMeta } from '@/lib/i18n/translations';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  supportedLanguages: LanguageMeta[];
  currentLangMeta: LanguageMeta;
  t: (key: string, fallback?: string) => string;
  fontSize: 'standard' | 'large' | 'extra_large';
  setFontSize: (size: 'standard' | 'large' | 'extra_large') => void;
  simpleMode: boolean;
  setSimpleMode: (enabled: boolean) => void;
  toggleSimpleMode: () => void;
  startVoiceInput: (onResult: (transcript: string) => void) => boolean;
  isListening: boolean;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  supportedLanguages: SUPPORTED_LANGUAGES,
  currentLangMeta: SUPPORTED_LANGUAGES[0],
  t: (key, fallback) => fallback || key,
  fontSize: 'standard',
  setFontSize: () => {},
  simpleMode: false,
  setSimpleMode: () => {},
  toggleSimpleMode: () => {},
  startVoiceInput: () => false,
  isListening: false,
});

export function I18nProvider({
  children,
  initialLanguage = 'en',
}: {
  children: React.ReactNode;
  initialLanguage?: string;
}) {
  const [language, setLanguageState] = useState<string>(initialLanguage);
  const [fontSize, setFontSizeState] = useState<'standard' | 'large' | 'extra_large'>('standard');
  const [simpleMode, setSimpleModeState] = useState<boolean>(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('farmsync_locale');
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang === 'en' ? 'en-IN' : savedLang;
      }
      const savedFontSize = localStorage.getItem('farmsync_font_size');
      if (savedFontSize === 'standard' || savedFontSize === 'large' || savedFontSize === 'extra_large') {
        setFontSizeState(savedFontSize);
      }
      const savedSimpleMode = localStorage.getItem('farmsync_simple_mode');
      if (savedSimpleMode === 'true') {
        setSimpleModeState(true);
      }
    }
  }, []);

  const setLanguage = (newLang: string) => {
    if (translations[newLang]) {
      setLanguageState(newLang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('farmsync_locale', newLang);
        document.cookie = `farmsync_locale=${newLang}; path=/; max-age=31536000; samesite=lax`;
        document.documentElement.lang = newLang === 'en' ? 'en-IN' : newLang;
      }
    }
  };

  const setFontSize = (size: 'standard' | 'large' | 'extra_large') => {
    setFontSizeState(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmsync_font_size', size);
    }
  };

  const setSimpleMode = (enabled: boolean) => {
    setSimpleModeState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmsync_simple_mode', String(enabled));
    }
  };

  const toggleSimpleMode = () => setSimpleMode(!simpleMode);

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] || translations.en;
    const copy = langDict[key] || translations.en[key];
    if (copy) return copy;

    if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Missing copy for "${key}" in "${language}".`);
    }
    return fallback || key;
  };

  useEffect(() => {
    const appTitle = translations[language]?.app_title || translations.en.app_title || 'Farm Management';
    const appDesc = translations[language]?.app_description || translations.en.app_description || 'Manage your crops, animals, and farm work.';
    document.title = `FarmSync - ${appTitle}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', appDesc);
  }, [language]);

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Web Speech API Voice Input
  const startVoiceInput = (onResult: (transcript: string) => void): boolean => {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t('voice_search_unavailable', 'Voice search is unavailable in this browser.'));
      return false;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const text = event.results[0]?.[0]?.transcript;
        if (text) {
          onResult(text);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      return true;
    } catch (error) {
      setIsListening(false);
      console.error('[voice-input] Voice recognition could not start.', error);
      alert(t('voice_search_unavailable', 'Voice search is unavailable in this browser.'));
      return false;
    }
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLangMeta,
        t,
        fontSize,
        setFontSize,
        simpleMode,
        setSimpleMode,
        toggleSimpleMode,
        startVoiceInput,
        isListening,
      }}
    >
      <div
        className={
          fontSize === 'large'
            ? 'text-base font-normal'
            : fontSize === 'extra_large'
            ? 'text-lg font-medium'
            : 'text-sm'
        }
      >
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export const useTranslation = () => useContext(I18nContext);
