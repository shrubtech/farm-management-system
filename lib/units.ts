// Indian Agricultural Units, Conversions, and Currency Formatting

import { AreaUnit, WeightUnit } from '@/types';

const AREA_UNIT_LABELS: Record<AreaUnit, string> = {
  acre: 'acres',
  hectare: 'hectares',
  guntha: 'gunthas',
  bigha: 'bighas',
};

// Area conversions relative to 1 Acre
// 1 Acre = 40 Gunthas (1 Guntha = 1,089 sq ft)
// 1 Hectare = 2.47105 Acres = 98.842 Gunthas
// 1 Bigha (Western India / Maharashtra Standard) = 0.625 Acre = 25 Gunthas
const ACRE_TO_GUNTHA = 40;
const HECTARE_TO_ACRE = 2.47105;
const BIGHA_TO_ACRE_WESTERN = 0.625;

export function convertArea(
  value: number,
  fromUnit: AreaUnit,
  toUnit: AreaUnit
): number {
  if (value === 0 || fromUnit === toUnit) return value;

  // First convert fromUnit to Acres
  let acres = 0;
  switch (fromUnit) {
    case 'acre':
      acres = value;
      break;
    case 'hectare':
      acres = value * HECTARE_TO_ACRE;
      break;
    case 'guntha':
      acres = value / ACRE_TO_GUNTHA;
      break;
    case 'bigha':
      acres = value * BIGHA_TO_ACRE_WESTERN;
      break;
  }

  // Then convert Acres to toUnit
  switch (toUnit) {
    case 'acre':
      return Number(acres.toFixed(2));
    case 'hectare':
      return Number((acres / HECTARE_TO_ACRE).toFixed(2));
    case 'guntha':
      return Number((acres * ACRE_TO_GUNTHA).toFixed(1));
    case 'bigha':
      return Number((acres / BIGHA_TO_ACRE_WESTERN).toFixed(2));
  }
}

export function formatArea(
  value: number,
  unit: AreaUnit = 'acre'
): string {
  const number = new Intl.NumberFormat('en-IN', {
    numberingSystem: 'latn',
  }).format(value);
  return `${number} ${AREA_UNIT_LABELS[unit]}`;
}

export const formatAreaWithUnit = formatArea;

// Weight conversions
export function convertWeight(
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number {
  if (value === 0 || fromUnit === toUnit) return value;

  // Convert to kg
  let kg = 0;
  switch (fromUnit) {
    case 'kg':
      kg = value;
      break;
    case 'quintal':
      kg = value * 100;
      break;
    case 'tonne':
      kg = value * 1000;
      break;
  }

  // Convert to target
  switch (toUnit) {
    case 'kg':
      return Number(kg.toFixed(1));
    case 'quintal':
      return Number((kg / 100).toFixed(2));
    case 'tonne':
      return Number((kg / 1000).toFixed(3));
  }
}

// Indian Currency Formatter (₹) with Indian Lakhs and Crores digit grouping
export function formatCurrencyINR(
  amount: number
): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    numberingSystem: 'latn',
  }).format(amount);
}

// Indian Number Formatter: e.g. 1,25,000
export function formatIndianNumber(
  num: number
): string {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN', {
    numberingSystem: 'latn',
  }).format(num);
}

// Indian Date Formatter (DD/MM/YYYY)
export function formatDateIndian(dateString?: string): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
    numberingSystem: 'latn',
  }).format(d);
}
