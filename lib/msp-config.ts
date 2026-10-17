// Government Minimum Support Price (MSP) Configuration
// Source: Ministry of Agriculture & Farmers Welfare, Govt of India (CACP)
// File: lib/msp-config.ts
// HOW TO UPDATE: Update the values and the 'lastUpdated' date at the beginning of each Kharif / Rabi season.

export interface MspCropRecord {
  cropName: string;
  season: 'Kharif' | 'Rabi' | 'Commercial';
  mspPricePerQuintal: number; // in INR ₹ per Quintal (100 kg)
  previousYearMsp: number;
  increaseAmount: number;
  crop?: string;
  mspRate?: number;
  unit?: string;
  year?: string;
}

export const MSP_METADATA = {
  marketingSeason: '2024-25 / 2025-26',
  approvedBy: 'Cabinet Committee on Economic Affairs (CCEA), Govt of India',
  lastUpdated: '15 June 2024',
  updateNotice: 'Edit this file (lib/msp-config.ts) when new MSP rates are announced by the CCEA.',
};

export const MSP_PRICE_CATALOG: Record<string, MspCropRecord> = {
  Paddy_Common: {
    cropName: 'Paddy (Common)',
    season: 'Kharif',
    mspPricePerQuintal: 2300,
    previousYearMsp: 2183,
    increaseAmount: 117,
  },
  Cotton_Medium: {
    cropName: 'Cotton (Medium Staple)',
    season: 'Kharif',
    mspPricePerQuintal: 7121,
    previousYearMsp: 6620,
    increaseAmount: 501,
  },
  Soybean_Yellow: {
    cropName: 'Soybean (Yellow)',
    season: 'Kharif',
    mspPricePerQuintal: 4892,
    previousYearMsp: 4600,
    increaseAmount: 292,
  },
  Tur_Arhar: {
    cropName: 'Tur / Arhar (Pigeon Pea)',
    season: 'Kharif',
    mspPricePerQuintal: 7550,
    previousYearMsp: 7000,
    increaseAmount: 550,
  },
  Moong: {
    cropName: 'Moong (Green Gram)',
    season: 'Kharif',
    mspPricePerQuintal: 8682,
    previousYearMsp: 8558,
    increaseAmount: 124,
  },
  Urad: {
    cropName: 'Urad (Black Gram)',
    season: 'Kharif',
    mspPricePerQuintal: 7400,
    previousYearMsp: 6950,
    increaseAmount: 450,
  },
  Maize: {
    cropName: 'Maize (Corn)',
    season: 'Kharif',
    mspPricePerQuintal: 2225,
    previousYearMsp: 2090,
    increaseAmount: 135,
  },
  Wheat: {
    cropName: 'Wheat',
    season: 'Rabi',
    mspPricePerQuintal: 2275,
    previousYearMsp: 2125,
    increaseAmount: 150,
  },
  Gram_Chana: {
    cropName: 'Gram / Chana',
    season: 'Rabi',
    mspPricePerQuintal: 5440,
    previousYearMsp: 5335,
    increaseAmount: 105,
  },
  Mustard_Rapeseed: {
    cropName: 'Mustard & Rapeseed',
    season: 'Rabi',
    mspPricePerQuintal: 5650,
    previousYearMsp: 5450,
    increaseAmount: 200,
  },
  Groundnut: {
    cropName: 'Groundnut',
    season: 'Kharif',
    mspPricePerQuintal: 6783,
    previousYearMsp: 6377,
    increaseAmount: 406,
  },
  Sugarcane_FRP: {
    cropName: 'Sugarcane (FRP)',
    season: 'Commercial',
    mspPricePerQuintal: 340, // ₹340 per quintal basic recovery
    previousYearMsp: 315,
    increaseAmount: 25,
  },
};

export function getMspForCrop(cropName: string): MspCropRecord | undefined {
  const clean = cropName.toLowerCase();
  for (const [key, record] of Object.entries(MSP_PRICE_CATALOG)) {
    if (
      clean.includes(key.toLowerCase()) ||
      clean.includes(record.cropName.toLowerCase()) ||
      (clean.includes('corn') && key === 'Maize') ||
      (clean.includes('soy') && key === 'Soybean_Yellow') ||
      (clean.includes('cotton') && key === 'Cotton_Medium') ||
      (clean.includes('wheat') && key === 'Wheat')
    ) {
      return {
        ...record,
        crop: record.cropName,
        mspRate: record.mspPricePerQuintal,
        unit: 'Quintal',
        year: '2024-25 / 2025-26',
      };
    }
  }
  return undefined;
}

export const CCEA_MSP_LIST: MspCropRecord[] = Object.values(MSP_PRICE_CATALOG).map((r) => ({
  ...r,
  crop: r.cropName,
  mspRate: r.mspPricePerQuintal,
  unit: 'Quintal',
  year: '2024-25 / 2025-26',
}));
