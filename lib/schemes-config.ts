// Central & State Government Agricultural Schemes & Subsidies
// File: lib/schemes-config.ts
// HOW TO UPDATE: Add or update scheme details in this configuration file.

import { GovernmentScheme } from '@/types';

export const SCHEMES_DISCLAIMER =
  'Disclaimer: Information provided for farmer guidance and awareness only. Rules, eligibility criteria, and budgetary allocations are governed by the respective central/state departments. Always verify with your local Krishi Vigyan Kendra (KVK), Taluka Krishi Adhikari, or official government portals before applying.';

export const GOVERNMENT_SCHEMES_LIST: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    tagline: 'Direct income support of ₹6,000 per year in 3 four-monthly installments',
    category: 'direct_benefit',
    benefitAmount: '₹6,000 / year (₹2,000 every 4 months)',
    eligibility:
      'All landholding farmer families with cultivable landholding in their names. Subject to exclusion criteria (institutional landowners, income tax payees).',
    documentsRequired: [
      'Aadhaar Card (Mandatory with e-KYC)',
      'Landholding proof (7/12 extract / RoR / Khatauni)',
      'Aadhaar-linked Bank Passbook with active DBT',
      'Active mobile number linked with Aadhaar',
    ],
    officialUrl: 'https://pmkisan.gov.in',
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana (PMFBY)',
    tagline: 'Comprehensive crop insurance against non-preventable natural risks, flood, drought & pests',
    category: 'crop_insurance',
    benefitAmount: 'Up to 100% of sum insured based on notified crop-cutting experiments (CCE) loss',
    eligibility:
      'All farmers growing notified crops in notified areas (both loanee and non-loanee farmers). Premium is capped at only 2% for Kharif, 1.5% for Rabi, and 5% for Annual Commercial/Horticulture crops.',
    documentsRequired: [
      'Current Season Sowing Certificate / Self-Declaration',
      '7/12 Extract (Satbara) & 8-A holding copy',
      'Aadhaar Card copy',
      'Cancelled cheque or Bank Passbook copy',
      'Crop loss intimation within 72 hours via Crop Insurance App',
    ],
    officialUrl: 'https://pmfby.gov.in',
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    tagline: 'Subsidized working capital credit at effective 4% interest rate for crop cultivation & animal husbandry',
    category: 'credit',
    benefitAmount: 'Credit limit up to ₹3,00,000 at 4% effective interest (with 3% prompt repayment incentive)',
    eligibility:
      'Owner cultivators, tenant farmers, sharecroppers, and Self Help Groups (SHGs) of farmers. Also extended to Dairy and Fisheries farmers (limit ₹2 Lakhs).',
    documentsRequired: [
      'Duly filled KCC application form',
      'Identity Proof (Aadhaar / Voter ID)',
      'Address Proof',
      'Land Records (7/12, 8A, or Tenancy agreement)',
      'No Dues Certificate (NDC) from local banking branch',
    ],
    officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    tagline: 'Free laboratory test report of 12 soil parameters with customized crop fertilizer dosages',
    category: 'soil_solar',
    benefitAmount: 'Free soil testing & optimal nutrient recommendation report every 2 years',
    eligibility:
      'All Indian farmers with agricultural land. Soil samples are collected by agriculture department extension staff from GPS-tagged field locations.',
    documentsRequired: [
      'Aadhaar Card',
      'Farmer Khata / Survey / Gat Number details',
      'Contact mobile number for digital card dispatch',
    ],
    officialUrl: 'https://soilhealth.dac.gov.in',
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
    tagline: 'Up to 60-90% subsidy for off-grid and grid-connected solar agricultural pumps',
    category: 'soil_solar',
    benefitAmount: '60% to 90% capital subsidy on 3 HP, 5 HP, and 7.5 HP Solar Irrigation Pumps',
    eligibility:
      'Individual farmers, Water User Associations (WUAs), and farmer cooperatives having open wells, borewells, or farm ponds without existing electric pumps.',
    documentsRequired: [
      '7/12 Extract with water source information',
      '8A Land Record copy',
      'Aadhaar Card',
      'Bank Account Passbook',
      'Passport size photograph',
    ],
    officialUrl: 'https://pmkusum.mnre.gov.in',
  },
  {
    id: 'enam',
    name: 'e-NAM (National Agriculture Market)',
    tagline: 'Pan-India electronic trading portal networking 1,361+ APMC mandis for transparent bidding',
    category: 'market_infra',
    benefitAmount: 'Direct online transparent price discovery, assaying quality certification, and direct bank settlement',
    eligibility:
      'Any farmer bringing farm produce to an e-NAM integrated APMC mandi or trading directly from farm gate.',
    documentsRequired: [
      'Farmer e-NAM Registration ID',
      'Aadhaar Card',
      'Bank details (IFSC & Account number for direct DBT credit)',
      'Mandi lot entry gate pass',
    ],
    officialUrl: 'https://enam.gov.in',
  },
  {
    id: 'drip-sprinkler-subsidy',
    name: 'Per Drop More Crop (Micro Irrigation Drip & Sprinkler Subsidy)',
    tagline: '55% to 80% subsidy for installing modern drip and sprinkler systems',
    category: 'soil_solar',
    benefitAmount: '55% for general farmers, up to 75-80% for Small and Marginal (SF/MF) & Women farmers',
    eligibility:
      'Farmers possessing verified land with an assured water source (Well, Borewell, Farm pond).',
    documentsRequired: [
      '7/12 Extract and 8A holding certificate',
      'Quotation from authorized BIS certified drip manufacturer',
      'Water source certificate',
      'Electricity bill of pump or solar pump certificate',
    ],
    officialUrl: 'https://pmksy.gov.in',
  },
  {
    id: 'ahidf-dairy',
    name: 'Animal Husbandry Infrastructure Development Fund (AHIDF & DEDS)',
    tagline: '3% interest subvention and capital credit for milk chilling, processing, and modern dairy barns',
    category: 'market_infra',
    benefitAmount: '3% interest subvention on bank loan up to 90% of total project cost',
    eligibility:
      'Dairy farmers, cooperatives, FPOs, private dairy entrepreneurs, and individual farmers with cattle units.',
    documentsRequired: [
      'Detailed Project Report (DPR)',
      'Land ownership or long lease deed',
      'KYC documents of applicant/promoters',
      'Bank statement for last 6 months',
    ],
    officialUrl: 'https://ahidf.udyamimitra.in',
  },
];
