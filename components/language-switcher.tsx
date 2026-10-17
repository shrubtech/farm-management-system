'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/components/i18n-provider';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'card' | 'compact';
  className?: string;
}

export function LanguageSwitcher({ variant = 'pill', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, supportedLanguages, currentLangMeta } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`inline-flex items-center gap-2 rounded-full border transition-all duration-200 select-none ${
          variant === 'compact'
            ? 'px-2.5 py-1 text-[11px] font-medium border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:border-[#22C55E]'
            : 'px-3 py-1.5 text-xs font-semibold border-[#22C55E]/30 bg-[#173426]/80 text-[#EAF2EC] backdrop-blur-md hover:border-[#22C55E] hover:bg-[#1E4331]'
        }`}
      >
        <Globe className="h-3.5 w-3.5 text-[#22C55E] flex-shrink-0" />
        <span className="truncate max-w-[80px] sm:max-w-none">{currentLangMeta.nativeName}</span>
        <ChevronDown
          className={`h-3 w-3 text-white/70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-[#22C55E]/20 bg-[#14261C] p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="py-1 max-h-64 overflow-y-auto">
            {supportedLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#22C55E] text-black font-bold'
                      : 'text-white/90 hover:bg-[#1F3A2A] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{lang.flag}</span>
                    <span className="font-medium">{lang.nativeName}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-black" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
