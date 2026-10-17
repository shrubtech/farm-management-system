import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

export interface LanguageMeta {
  code: string;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
];

function flattenLocale(obj: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [moduleName, entries] of Object.entries(obj)) {
    if (typeof entries === 'object' && entries !== null) {
      for (const [key, val] of Object.entries(entries)) {
        if (typeof val === 'string') {
          result[key] = val;
          result[`${moduleName}.${key}`] = val;
        }
      }
    }
  }
  return result;
}

const enFlat = flattenLocale(en);
const hiFlat = flattenLocale(hi);
const mrFlat = flattenLocale(mr);

export const translations: Record<string, Record<string, string>> = {
  en: enFlat,
  hi: { ...enFlat, ...hiFlat },
  mr: { ...enFlat, ...mrFlat },
  gu: enFlat,
  pa: enFlat,
  ta: enFlat,
  te: enFlat,
  kn: enFlat,
  bn: enFlat,
};
