// FarmSync Real-Time Reactive State Store - Localized for Indian Agriculture
// Provides instant reactive updates, Supabase sync, and full CRUD across all modules.

import {
  UserProfile,
  Farm,
  Crop,
  CropLog,
  Livestock,
  MilkEntry,
  LivestockHealthRecord,
  InventoryItem,
  StockMovement,
  Equipment,
  MaintenanceLog,
  Task,
  Transaction,
  Supplier,
  Worker,
  AttendanceRecord,
  NotificationItem,
  FieldLog,
  UserRole,
  Invite,
  AreaUnit,
  MandiPrice,
  GovernmentScheme,
  FarmDocument,
  LoanRecord,
} from '@/types';
import { GOVERNMENT_SCHEMES_LIST } from '@/lib/schemes-config';

// 1. Initial Indian Farm Profile (Nashik, Maharashtra)
const initialFarm: Farm = {
  id: 'farm-kisan-01',
  name: 'Kisan Agro Farm',
  ownerId: 'user-rajesh',
  ownerName: 'Rajesh Patil',
  location: 'Pimpalgaon Baswant, Niphad, Nashik, Maharashtra',
  village: 'Pimpalgaon Baswant',
  taluka: 'Niphad',
  district: 'Nashik',
  state: 'Maharashtra',
  pincode: '422209',
  surveyNumber: 'Gat No. 142/2A',
  satbara712: 'MH-NSK-142',
  latitude: 20.1706,
  longitude: 73.9858,
  totalAreaAcres: 25, // 1,000 Gunthas
  defaultAreaUnit: 'acre',
  soilType: 'Black Cotton (Regur)',
  farmType: 'Diversified Cash Crops, Horticulture & Desi Dairy',
  irrigationType: 'drip',
  farmerCategory: 'small',
  logoUrl: '',
};

// 2. Demo Users with Indian Context
const demoUsers: UserProfile[] = [
  {
    id: 'user-savita',
    fullName: 'Savita Patil',
    email: 'manager@farmsync.io',
    phone: '+91 98221 44556',
    role: 'manager',
    farmId: 'farm-kisan-01',
    farmName: 'Kisan Agro Farm',
    defaultAreaUnit: 'acre',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'user-rajesh',
    fullName: 'Rajesh Patil',
    email: 'owner@farmsync.io',
    phone: '+91 98220 14829',
    role: 'owner',
    farmId: 'farm-kisan-01',
    farmName: 'Kisan Agro Farm',
    defaultAreaUnit: 'guntha',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'user-ramesh',
    fullName: 'Ramesh Shinde',
    email: 'worker@farmsync.io',
    phone: '+91 94230 77112',
    role: 'worker',
    farmId: 'farm-kisan-01',
    farmName: 'Kisan Agro Farm',
    defaultAreaUnit: 'acre',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
];

// 3. Indian Crop Roster (25 Total Acres = 1,000 Gunthas)
const initialCrops: Crop[] = [
  {
    id: 'crop-1',
    name: 'Cotton',
    variety: 'Bollgard II Hybrid',
    fieldPlot: 'Gat 142/Plot A-1',
    areaAcres: 8, // 320 Gunthas
    areaUnit: 'acre',
    season: 'kharif',
    plantingDate: '2026-06-15',
    expectedHarvestDate: '2026-11-20',
    status: 'growing',
    estimatedYield: 96, // 12 quintals/acre
    yieldUnit: 'Quintals',
    color: '#1C3D26',
    notes: 'Drip fertigation applied with 19:19:19. Monitored for pink bollworm.',
  },
  {
    id: 'crop-2',
    name: 'Soybean',
    variety: 'JS 335 / Phule Kalyani',
    fieldPlot: 'Gat 142/Plot East 2',
    areaAcres: 6, // 240 Gunthas
    areaUnit: 'acre',
    season: 'kharif',
    plantingDate: '2026-06-20',
    expectedHarvestDate: '2026-09-30',
    status: 'growing',
    estimatedYield: 72,
    yieldUnit: 'Quintals',
    color: '#449255',
    notes: 'Rhizobium bacterial culture seed treatment applied before sowing.',
  },
  {
    id: 'crop-3',
    name: 'Wheat',
    variety: 'Lokwan / GW 496',
    fieldPlot: 'Gat 142/Plot North 3',
    areaAcres: 5, // 200 Gunthas
    areaUnit: 'acre',
    season: 'rabi',
    plantingDate: '2025-11-15',
    expectedHarvestDate: '2026-03-25',
    status: 'harvested',
    actualYield: 95,
    yieldUnit: 'Quintals',
    color: '#EBB343',
    notes: 'Harvested with combine harvester. Sold to APMC Lasalgaon at ₹2,350/q.',
  },
  {
    id: 'crop-4',
    name: 'Onion',
    variety: 'Nashik Red / AgriFound Light Red',
    fieldPlot: 'Gat 142/Plot B-South',
    areaAcres: 4, // 160 Gunthas
    areaUnit: 'acre',
    season: 'rabi',
    plantingDate: '2025-12-10',
    expectedHarvestDate: '2026-04-10',
    status: 'harvested',
    actualYield: 340,
    yieldUnit: 'Quintals',
    color: '#9C3455',
    notes: 'Stored in a traditional ventilated onion storage shed. Current modal rate ₹2,450/q.',
  },
  {
    id: 'crop-5',
    name: 'Pomegranate',
    variety: 'Bhagwa',
    fieldPlot: 'Orchard Block 1',
    areaAcres: 2, // 80 Gunthas
    areaUnit: 'acre',
    season: 'annual',
    plantingDate: '2023-07-01',
    expectedHarvestDate: '2026-08-15',
    status: 'growing',
    estimatedYield: 80,
    yieldUnit: 'Quintals',
    color: '#C2410C',
    notes: 'Mrig Bahar flowering stage. Automated micro-sprinklers active.',
  },
];

const initialCropLogs: CropLog[] = [
  {
    id: 'clog-1',
    cropId: 'crop-1',
    cropName: 'Cotton',
    activityType: 'Fertilizer',
    description: 'Applied Neem-coated Urea (45kg/acre) & 10:26:26 through fertigation venturi.',
    quantity: 360,
    unit: 'Kg',
    appliedBy: 'Ramesh Shinde',
    date: '2026-07-10',
  },
  {
    id: 'clog-2',
    cropId: 'crop-2',
    cropName: 'Soybean',
    activityType: 'Pesticide',
    description: 'Foliar spray of organic Neem Oil (10,000 PPM) for stem borer prevention.',
    quantity: 15,
    unit: 'Litres',
    appliedBy: 'Savita Patil',
    date: '2026-07-08',
  },
];

// 4. Indian Livestock & Desi Breeds
const initialLivestock: Livestock[] = [
  {
    id: 'live-1',
    tagId: 'MH-NSK-01',
    inaphTagId: '392019482011',
    animalType: 'Cow',
    breed: 'Gir Cow',
    ageMonths: 42,
    gender: 'female',
    healthStatus: 'healthy',
    weightKg: 420.0,
    pastureLocation: 'Desi Cow Shelter Barn 1',
    feedSchedule: 'Green Jowar fodder 15kg, dry wheat straw 5kg, organic cattle feed 2kg',
    dailyMilkMorningLitres: 7.5,
    dailyMilkEveningLitres: 6.0,
    milkFatPercentage: 4.8,
    milkSnfPercentage: 8.7,
    lastVaccinationDate: '2026-03-10',
    nextVaccinationDate: '2026-09-10',
  },
  {
    id: 'live-2',
    tagId: 'MH-NSK-02',
    inaphTagId: '392019482012',
    animalType: 'Cow',
    breed: 'Sahiwal Cow',
    ageMonths: 36,
    gender: 'female',
    healthStatus: 'healthy',
    weightKg: 440.0,
    pastureLocation: 'Desi Cow Shelter Barn 1',
    feedSchedule: 'Green fodder 18kg, cotton seed cake 2kg',
    dailyMilkMorningLitres: 8.0,
    dailyMilkEveningLitres: 6.5,
    milkFatPercentage: 4.6,
    milkSnfPercentage: 8.6,
    lastVaccinationDate: '2026-03-10',
    nextVaccinationDate: '2026-09-10',
  },
  {
    id: 'live-3',
    tagId: 'MH-NSK-03',
    inaphTagId: '392019482013',
    animalType: 'Buffalo',
    breed: 'Murrah Buffalo',
    ageMonths: 48,
    gender: 'female',
    healthStatus: 'healthy',
    weightKg: 580.0,
    pastureLocation: 'Buffalo Paddock 2',
    feedSchedule: 'Green Lucerne 20kg, silage 8kg, mustard cake 2.5kg',
    dailyMilkMorningLitres: 9.5,
    dailyMilkEveningLitres: 8.0,
    milkFatPercentage: 7.2,
    milkSnfPercentage: 9.2,
    lastVaccinationDate: '2026-02-15',
    nextVaccinationDate: '2026-08-15',
  },
  {
    id: 'live-4',
    tagId: 'MH-NSK-04',
    inaphTagId: '392019482014',
    animalType: 'Goat',
    breed: 'Osmanabadi Goat',
    ageMonths: 18,
    gender: 'female',
    healthStatus: 'healthy',
    weightKg: 34.0,
    pastureLocation: 'Goat Shed East',
    feedSchedule: 'Subabul leaves, maize crush, mineral mix',
    lastVaccinationDate: '2026-01-20',
    nextVaccinationDate: '2026-07-20',
  },
  {
    id: 'live-5',
    tagId: 'MH-NSK-05',
    inaphTagId: '392019482015',
    animalType: 'Bullock',
    breed: 'Khillar Pair',
    ageMonths: 54,
    gender: 'male',
    healthStatus: 'healthy',
    weightKg: 510.0,
    pastureLocation: 'Bullock Stalls',
    feedSchedule: 'Dry kadbi straw, gram chuni, green maize',
    lastVaccinationDate: '2026-03-10',
    nextVaccinationDate: '2026-09-10',
  },
];

// 5. Daily Milk Collection Log (Morning/Evening, Fat %, SNF, Rate ₹/L)
const initialMilkEntries: MilkEntry[] = [
  {
    id: 'milk-1',
    tagId: 'MH-NSK-01 (Gir)',
    date: '2026-07-12',
    session: 'morning',
    quantityLitres: 7.5,
    fatPercentage: 4.8,
    snfPercentage: 8.7,
    ratePerLitre: 44,
    totalAmount: 330,
    buyer: 'Amul Dairy Cooperative Society (Pimpalgaon)',
  },
  {
    id: 'milk-2',
    tagId: 'MH-NSK-03 (Murrah)',
    date: '2026-07-12',
    session: 'morning',
    quantityLitres: 9.5,
    fatPercentage: 7.2,
    snfPercentage: 9.2,
    ratePerLitre: 68,
    totalAmount: 646,
    buyer: 'Amul Dairy Cooperative Society (Pimpalgaon)',
  },
  {
    id: 'milk-3',
    tagId: 'MH-NSK-01 (Gir)',
    date: '2026-07-12',
    session: 'evening',
    quantityLitres: 6.0,
    fatPercentage: 4.9,
    snfPercentage: 8.8,
    ratePerLitre: 45,
    totalAmount: 270,
    buyer: 'Amul Dairy Cooperative Society (Pimpalgaon)',
  },
  {
    id: 'milk-4',
    tagId: 'MH-NSK-03 (Murrah)',
    date: '2026-07-12',
    session: 'evening',
    quantityLitres: 8.0,
    fatPercentage: 7.3,
    snfPercentage: 9.3,
    ratePerLitre: 69,
    totalAmount: 552,
    buyer: 'Amul Dairy Cooperative Society (Pimpalgaon)',
  },
];

const initialHealthRecords: LivestockHealthRecord[] = [
  {
    id: 'lhr-1',
    livestockId: 'live-1',
    tagId: 'MH-NSK-01',
    recordType: 'Vaccination',
    treatment: 'Foot & Mouth Disease (FMD)',
    dosage: '2ml subcutaneous',
    veterinarian: 'Dr. S. K. Deshmukh (Panchayat Samiti Vet Clinic)',
    date: '2026-03-10',
    nextDueDate: '2026-09-10',
    notes: 'Post-vaccination normal body temperature. Ear tag verified.',
  },
];

// 6. Indian Agricultural Inputs & Inventory (in INR ₹)
const initialInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Neem Coated Urea',
    category: 'Fertilizers',
    sku: 'IFFCO-UREA-45KG',
    quantity: 18,
    unit: 'Bags (45 kg)',
    reorderLevel: 5,
    unitCost: 266, // Govt subsidized statutory price
    supplierName: 'Kisan Krishi Seva Kendra, Pimpalgaon',
    storageLocation: 'Main Fertilizer Godown',
  },
  {
    id: 'inv-2',
    name: 'DAP 18:46:0',
    category: 'Fertilizers',
    sku: 'IFFCO-DAP-50KG',
    quantity: 12,
    unit: 'Bags (50 kg)',
    reorderLevel: 4,
    unitCost: 1350,
    supplierName: 'Kisan Krishi Seva Kendra, Pimpalgaon',
    storageLocation: 'Main Fertilizer Godown',
  },
  {
    id: 'inv-3',
    name: 'NPK 10:26:26',
    category: 'Fertilizers',
    sku: 'NPK-102626-50KG',
    quantity: 14,
    unit: 'Bags (50 kg)',
    reorderLevel: 5,
    unitCost: 1470,
    supplierName: 'Kisan Krishi Seva Kendra, Pimpalgaon',
    storageLocation: 'Main Fertilizer Godown',
  },
  {
    id: 'inv-4',
    name: 'Farmyard Manure (FYM)',
    category: 'Fertilizers',
    sku: 'FYM-ORGANIC-TROLLEY',
    quantity: 6,
    unit: 'Tractor Trolleys',
    reorderLevel: 2,
    unitCost: 3500,
    supplierName: 'Internal Dairy Barn Compost Pit',
    storageLocation: 'Compost Pit Block C',
  },
  {
    id: 'inv-5',
    name: 'Organic Neem Oil 10,000 PPM',
    category: 'Pesticides',
    sku: 'NEEM-OIL-5L',
    quantity: 8,
    unit: 'Cans (5 Litre)',
    reorderLevel: 3,
    unitCost: 1850,
    supplierName: 'Maharashtra Agro Biotech',
    storageLocation: 'Agrochemical Safety Locker',
  },
  {
    id: 'inv-6',
    name: 'Drip Irrigation Inline Tubing (16mm)',
    category: 'Irrigation',
    sku: 'JAIN-DRIP-16MM-400M',
    quantity: 5,
    unit: 'Rolls (400 m)',
    reorderLevel: 2,
    unitCost: 3200,
    supplierName: 'Jain Irrigation Dealership, Niphad',
    storageLocation: 'Tool & Equipment Shed',
  },
];

const initialStockMovements: StockMovement[] = [
  {
    id: 'sm-1',
    inventoryItemId: 'inv-1',
    itemName: 'Neem Coated Urea',
    movementType: 'OUT',
    quantity: 4,
    reason: 'Cotton plot top-dressing application',
    performedBy: 'Ramesh Shinde',
    date: '2026-07-10',
  },
];

// 7. Indian Agricultural Implements & Machinery
const initialEquipment: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Mahindra 575 DI Tractor (45 HP)',
    model: '575 DI XP Plus',
    serialNumber: 'MH-15-TC-2023-4410',
    status: 'active',
    purchaseDate: '2023-05-10',
    purchaseCost: 740000,
    lastServiceDate: '2026-05-20',
    nextServiceDue: '2026-08-20',
    assignedOperator: 'Ramesh Shinde',
    notes: 'Engine oil and air filter serviced at Mahindra dealership, Pimpalgaon.',
  },
  {
    id: 'eq-2',
    name: 'Shaktiman Semi-Champion Rotavator (6 Feet)',
    model: 'SC-180 Rotary Tiller',
    serialNumber: 'SHAKTI-ROT-2024-912',
    status: 'active',
    purchaseDate: '2024-02-15',
    purchaseCost: 118000,
    lastServiceDate: '2026-05-20',
    nextServiceDue: '2026-09-15',
    assignedOperator: 'Ramesh Shinde',
    notes: 'Blades inspected and gear oil filled.',
  },
  {
    id: 'eq-3',
    name: 'Drip Fertigation Automation System & Venturi',
    model: 'Netafim 2-inch Disc Filter + Venturi',
    serialNumber: 'DRIP-VENT-8821',
    status: 'active',
    purchaseDate: '2023-08-20',
    purchaseCost: 65000,
    lastServiceDate: '2026-06-01',
    nextServiceDue: '2026-09-01',
    assignedOperator: 'Savita Patil',
    notes: 'Operating on Solar pump connection under PM-KUSUM.',
  },
];

const initialMaintenanceLogs: MaintenanceLog[] = [
  {
    id: 'ml-1',
    equipmentId: 'eq-1',
    equipmentName: 'Mahindra 575 DI Tractor',
    serviceType: '250-Hour Regular Fluid Service & Grease Check',
    cost: 3200,
    servicedBy: 'Mahindra Authorized Service, Pimpalgaon',
    date: '2026-05-20',
    description: 'Engine oil 15W40 changed, hydraulic filter replaced, clutch free play adjusted.',
  },
];

// 8. Field Tasks for Indian Farming
const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Drip fertigation for Cotton',
    description: 'Mix 19:19:19 in venturi tank and run plot A drip lines for 2.5 hours.',
    status: 'todo',
    priority: 'high',
    assignedToName: 'Ramesh Shinde',
    assignedToId: 'user-ramesh',
    dueDate: '2026-07-15 10:00:00',
    relatedPlot: 'Gat 142/Plot A-1',
    relatedCropName: 'Cotton',
    progressPercentage: 20,
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Daily Evening Milk Dispatch to Amul Society',
    description: 'Filter milk cans, record fat testing slip, and deliver to collection center.',
    status: 'in_progress',
    priority: 'high',
    assignedToName: 'Savita Patil',
    assignedToId: 'user-savita',
    dueDate: '2026-07-14 18:30:00',
    relatedLivestockTag: 'Dairy Barn 1',
    progressPercentage: 60,
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Weeding and Interculturing',
    description: 'Deploy 4 daily wage workers for manual weeding in Soybean East plot.',
    status: 'todo',
    priority: 'normal',
    assignedToName: 'Ramesh Shinde',
    assignedToId: 'user-ramesh',
    dueDate: '2026-07-16 08:00:00',
    relatedPlot: 'Gat 142/Plot East 2',
    relatedCropName: 'Soybean',
    progressPercentage: 0,
    completed: false,
  },
];

// 9. Indian Sales (APMC Mandi, Dairy) & Expenses in INR ₹
const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'sale',
    category: 'Mandi Crop Produce',
    amount: 147000, // Net Amount received
    grossAmount: 154000,
    commodity: 'Wheat (Lokwan)',
    quantityQuintals: 65,
    ratePerQuintal: 2369,
    commissionAdat: 4620, // 3% Mandi Adat
    transportCost: 1800,
    weighingHamali: 580,
    date: '2026-06-25',
    paymentMethod: 'Bank Transfer',
    buyerType: 'apmc_mandi',
    customerName: 'APMC Lasalgaon Grain Yard',
    referenceNumber: 'APMC-LSG-2026-881',
    description: 'Sold 65 quintals Lokwan wheat to licensed APMC commission agent.',
  },
  {
    id: 'tx-2',
    type: 'sale',
    category: 'Dairy Milk Sale',
    amount: 32400,
    date: '2026-07-01',
    paymentMethod: 'UPI',
    buyerType: 'dairy_cooperative',
    customerName: 'Amul Dairy Cooperative Society',
    referenceNumber: 'DAIRY-JUN-014',
    description: 'Fortnightly milk payment for 780 litres (Cow & Buffalo combined).',
  },
  {
    id: 'tx-3',
    type: 'expense',
    category: 'Labor Wages',
    amount: 8000,
    date: '2026-07-06',
    paymentMethod: 'Cash',
    referenceNumber: 'WAGE-WK-27',
    description: 'Labour payment for 5 workers @ ₹400/day for cotton sowing & canal cleaning.',
  },
  {
    id: 'tx-4',
    type: 'expense',
    category: 'Fertilizers & Nutrition',
    amount: 14850,
    date: '2026-06-18',
    paymentMethod: 'UPI',
    referenceNumber: 'KKS-BILL-442',
    supplierName: 'Kisan Krishi Seva Kendra, Pimpalgaon',
    description: 'Purchased 6 bags DAP and 5 bags NPK 10:26:26 with GST invoice.',
  },
  {
    id: 'tx-5',
    type: 'expense',
    category: 'Fuel & Electricity',
    amount: 4200,
    date: '2026-07-02',
    paymentMethod: 'UPI',
    referenceNumber: 'HPCL-FUEL-90',
    description: '50 Litres Diesel for Mahindra Tractor tilling operations.',
  },
];

// 10. Live APMC Mandi Prices & MSP Benchmark
const initialMandiPrices: MandiPrice[] = [
  {
    id: 'mandi-1',
    commodity: 'Onion (Red)',
    mandiName: 'Lasalgaon APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    arrivalDate: '2026-07-14',
    minPricePerQuintal: 1800,
    maxPricePerQuintal: 2850,
    modalPricePerQuintal: 2450,
    trend: 'up',
  },
  {
    id: 'mandi-2',
    commodity: 'Soybean (Yellow)',
    mandiName: 'Akola APMC',
    district: 'Akola',
    state: 'Maharashtra',
    arrivalDate: '2026-07-14',
    minPricePerQuintal: 4350,
    maxPricePerQuintal: 4890,
    modalPricePerQuintal: 4680,
    mspPricePerQuintal: 4892,
    trend: 'up',
  },
  {
    id: 'mandi-3',
    commodity: 'Cotton (Medium Staple)',
    mandiName: 'Rajkot APMC',
    district: 'Rajkot',
    state: 'Gujarat',
    arrivalDate: '2026-07-14',
    minPricePerQuintal: 6800,
    maxPricePerQuintal: 7450,
    modalPricePerQuintal: 7250,
    mspPricePerQuintal: 7121,
    trend: 'stable',
  },
  {
    id: 'mandi-4',
    commodity: 'Wheat (Mill Quality)',
    mandiName: 'Khanna APMC',
    district: 'Ludhiana',
    state: 'Punjab',
    arrivalDate: '2026-07-14',
    minPricePerQuintal: 2320,
    maxPricePerQuintal: 2460,
    modalPricePerQuintal: 2390,
    mspPricePerQuintal: 2275,
    trend: 'stable',
  },
  {
    id: 'mandi-5',
    commodity: 'Pomegranate (Bhagwa)',
    mandiName: 'Solapur APMC',
    district: 'Solapur',
    state: 'Maharashtra',
    arrivalDate: '2026-07-14',
    minPricePerQuintal: 6500,
    maxPricePerQuintal: 10500,
    modalPricePerQuintal: 8400,
    trend: 'up',
  },
];

// 11. Farm Land Records & Documents (7/12, Soil Card, KCC)
const initialFarmDocuments: FarmDocument[] = [
  {
    id: 'doc-1',
    title: '7/12 Extract (Satbara Utara)',
    docType: '7_12_extract',
    docNumber: 'Gat No. 142/2A - Pimpalgaon',
    issueDate: '2026-04-01',
    fileSize: '1.4 MB (PDF)',
    uploadedAt: '2026-04-05',
  },
  {
    id: 'doc-2',
    title: 'Soil Health Card Report',
    docType: 'soil_health_card',
    docNumber: 'SHC-MH-NSK-2025-991',
    issueDate: '2025-10-15',
    expiryDate: '2027-10-15',
    fileSize: '850 KB (PDF)',
    uploadedAt: '2025-10-20',
  },
  {
    id: 'doc-3',
    title: 'PMFBY Kharif Crop Insurance Policy Receipt',
    docType: 'crop_insurance',
    docNumber: 'PMFBY-KH-2026-44129',
    issueDate: '2026-06-28',
    expiryDate: '2026-11-30',
    fileSize: '520 KB (PDF)',
    uploadedAt: '2026-06-29',
  },
  {
    id: 'doc-4',
    title: 'Kisan Credit Card (KCC) Bank Passbook',
    docType: 'kcc_passbook',
    docNumber: 'BOM-KCC-601928441',
    issueDate: '2024-03-12',
    fileSize: '1.1 MB (PDF)',
    uploadedAt: '2024-03-15',
  },
];

// 12. Kisan Credit Card (KCC) Loan Tracker
const initialLoans: LoanRecord[] = [
  {
    id: 'loan-1',
    lenderName: 'Bank of Maharashtra (Pimpalgaon Branch)',
    loanType: 'Kisan Credit Card (KCC)',
    accountNumber: 'KCC-60192844102',
    principalAmount: 150000,
    subsidizedInterestRate: 4.0, // 4% after 3% Prompt Repayment Incentive
    sanctionDate: '2025-08-10',
    dueDate: '2026-08-10',
    amountRepaid: 35000,
    status: 'active',
  },
];

const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Kisan Krishi Seva Kendra, Pimpalgaon',
    contactPerson: 'Sachin Jagtap',
    email: 'kisanagro.pimpalgaon@gmail.com',
    phone: '+91 98224 55123',
    address: 'Near Old Bus Stand, Pimpalgaon Baswant, Nashik',
    productsSupplied: ['IFFCO Fertilizers', 'Mahyco Seeds', 'Pesticides'],
    rating: 4.9,
    lastOrderDate: '2026-06-18',
  },
  {
    id: 'sup-2',
    name: 'Jain Irrigation Systems Dealership',
    contactPerson: 'Sunil Sonawane',
    email: 'jaindrip.niphad@gmail.com',
    phone: '+91 94222 88910',
    address: 'Nashik-Aurangabad Highway, Niphad',
    productsSupplied: ['Drip Lines', 'Venturi Pumps', 'Micro Sprinklers', 'Filters'],
    rating: 4.8,
    lastOrderDate: '2026-05-15',
  },
];

const initialWorkers: Worker[] = [
  {
    id: 'worker-1',
    fullName: 'Ramesh Shinde',
    role: 'worker',
    phone: '+91 94230 77112',
    email: 'ramesh.shinde@farmsync.io',
    dailyWage: 450,
    assignedTasksCount: 2,
    status: 'active',
    attendanceStatus: 'present',
  },
  {
    id: 'worker-2',
    fullName: 'Balu More',
    role: 'worker',
    phone: '+91 98901 33245',
    email: 'balu.more@farmsync.io',
    dailyWage: 400,
    assignedTasksCount: 1,
    status: 'active',
    attendanceStatus: 'present',
  },
  {
    id: 'worker-3',
    fullName: 'Sunita Jadhav',
    role: 'worker',
    phone: '+91 97654 22109',
    email: 'sunita.jadhav@farmsync.io',
    dailyWage: 380,
    assignedTasksCount: 1,
    status: 'active',
    attendanceStatus: 'present',
  },
];

const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    workerId: 'worker-1',
    workerName: 'Ramesh Shinde',
    date: '2026-07-14',
    status: 'present',
    checkIn: '08:00 AM',
    notes: 'Tractor spraying in Cotton Plot A',
  },
  {
    id: 'att-2',
    workerId: 'worker-2',
    workerName: 'Balu More',
    date: '2026-07-14',
    status: 'present',
    checkIn: '08:15 AM',
    notes: 'Silage mixing & dairy shed cleaning',
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Market Price Surge',
    message: 'Lasalgaon APMC: Red Onion arrivals up 15%, modal rate reached ₹2,450/q (+₹220).',
    type: 'mandi_price_alert',
    isRead: false,
    link: '/market',
    createdAt: '25m ago',
  },
  {
    id: 'notif-2',
    title: 'Heavy Rainfall Alert',
    message: 'IMD Alert: Moderate to heavy showers forecast in Nashik district over next 36 hours. Postpone spraying.',
    type: 'weather_alert',
    isRead: false,
    link: '/weather',
    createdAt: '1h ago',
  },
  {
    id: 'notif-3',
    title: 'PM-KISAN Installment Update',
    message: '17th installment of PM-KISAN ₹2,000 processed via DBT to Aadhaar linked account.',
    type: 'scheme_alert',
    isRead: false,
    link: '/schemes',
    createdAt: '3h ago',
  },
];

const initialFieldLogs: FieldLog[] = [
  {
    id: 'flog-1',
    userName: 'Ramesh Shinde',
    action: 'completed Cotton drip fertigation (19:19:19 15kg).',
    module: 'Irrigation',
    details: '20m ago • Water pressure stabilized at 1.8 kg/cm²',
    timestamp: '20m ago',
  },
  {
    id: 'flog-2',
    userName: 'Savita Patil',
    action: 'logged morning milk collection (17.0 Litres, Avg Fat 6.1%).',
    module: 'Livestock',
    details: '2h ago • Dispatched to Amul Dairy Society',
    timestamp: '2h ago',
  },
  {
    id: 'flog-3',
    userName: 'Rajesh Patil',
    action: 'checked Lasalgaon APMC onion rates on e-NAM.',
    module: 'Market',
    details: '4h ago • Modal rate ₹2,450/q',
    timestamp: '4h ago',
  },
];

const initialInvites: Invite[] = [
  {
    id: 'inv-1',
    farmId: 'farm-kisan-01',
    farmName: 'Kisan Agro Farm',
    code: 'KISAN-MGR-2026',
    role: 'manager',
    email: 'assistant@farmsync.io',
    createdBy: 'user-rajesh',
    createdByName: 'Rajesh Patil (Owner)',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    maxUses: 3,
    usedCount: 0,
    status: 'active',
  },
  {
    id: 'inv-2',
    farmId: 'farm-kisan-01',
    farmName: 'Kisan Agro Farm',
    code: 'KISAN-WRK-2026',
    role: 'worker',
    email: '',
    createdBy: 'user-savita',
    createdByName: 'Savita Patil (Manager)',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    maxUses: 10,
    usedCount: 1,
    status: 'active',
  },
];

// Main In-Memory & LocalStorage State Container
class FarmSyncStore {
  private farm: Farm = initialFarm;
  private currentUser: UserProfile = demoUsers[0]; // Savita Patil (Manager)
  private users: UserProfile[] = demoUsers;
  private invites: Invite[] = initialInvites;
  private crops: Crop[] = initialCrops;
  private cropLogs: CropLog[] = initialCropLogs;
  private livestock: Livestock[] = initialLivestock;
  private milkEntries: MilkEntry[] = initialMilkEntries;
  private healthRecords: LivestockHealthRecord[] = initialHealthRecords;
  private inventory: InventoryItem[] = initialInventory;
  private stockMovements: StockMovement[] = initialStockMovements;
  private equipment: Equipment[] = initialEquipment;
  private maintenanceLogs: MaintenanceLog[] = initialMaintenanceLogs;
  private tasks: Task[] = initialTasks;
  private transactions: Transaction[] = initialTransactions;
  private mandiPrices: MandiPrice[] = initialMandiPrices;
  private schemes: GovernmentScheme[] = GOVERNMENT_SCHEMES_LIST;
  private farmDocuments: FarmDocument[] = initialFarmDocuments;
  private loans: LoanRecord[] = initialLoans;
  private suppliers: Supplier[] = initialSuppliers;
  private workers: Worker[] = initialWorkers;
  private attendance: AttendanceRecord[] = initialAttendance;
  private notifications: NotificationItem[] = initialNotifications;
  private fieldLogs: FieldLog[] = initialFieldLogs;
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('farmsync_state_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.farm) this.farm = parsed.farm;
        if (parsed.currentUser) this.currentUser = parsed.currentUser;
        if (parsed.users) this.users = parsed.users;
        if (parsed.invites) this.invites = parsed.invites;
        if (parsed.crops) this.crops = parsed.crops;
        if (parsed.cropLogs) this.cropLogs = parsed.cropLogs;
        if (parsed.livestock) this.livestock = parsed.livestock;
        if (parsed.milkEntries) this.milkEntries = parsed.milkEntries;
        if (parsed.healthRecords) this.healthRecords = parsed.healthRecords;
        if (parsed.inventory) this.inventory = parsed.inventory;
        if (parsed.stockMovements) this.stockMovements = parsed.stockMovements;
        if (parsed.equipment) this.equipment = parsed.equipment;
        if (parsed.maintenanceLogs) this.maintenanceLogs = parsed.maintenanceLogs;
        if (parsed.tasks) this.tasks = parsed.tasks;
        if (parsed.transactions) this.transactions = parsed.transactions;
        if (parsed.mandiPrices) this.mandiPrices = parsed.mandiPrices;
        if (parsed.farmDocuments) this.farmDocuments = parsed.farmDocuments;
        if (parsed.loans) this.loans = parsed.loans;
        if (parsed.suppliers) this.suppliers = parsed.suppliers;
        if (parsed.workers) this.workers = parsed.workers;
        if (parsed.attendance) this.attendance = parsed.attendance;
        if (parsed.notifications) this.notifications = parsed.notifications;
        if (parsed.fieldLogs) this.fieldLogs = parsed.fieldLogs;
      }
    } catch {
      // fallback
    }
    this.initialized = true;
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const data = {
        farm: this.farm,
        currentUser: this.currentUser,
        users: this.users,
        invites: this.invites,
        crops: this.crops,
        cropLogs: this.cropLogs,
        livestock: this.livestock,
        milkEntries: this.milkEntries,
        healthRecords: this.healthRecords,
        inventory: this.inventory,
        stockMovements: this.stockMovements,
        equipment: this.equipment,
        maintenanceLogs: this.maintenanceLogs,
        tasks: this.tasks,
        transactions: this.transactions,
        mandiPrices: this.mandiPrices,
        farmDocuments: this.farmDocuments,
        loans: this.loans,
        suppliers: this.suppliers,
        workers: this.workers,
        attendance: this.attendance,
        notifications: this.notifications,
        fieldLogs: this.fieldLogs,
      };
      localStorage.setItem('farmsync_state_v1', JSON.stringify(data));
    } catch {
      // storage quota
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in store listener:', err);
      }
    });
  }

  // Getters
  public getFarm() { return this.farm; }
  public getCurrentUser() { return this.currentUser; }
  public getUsers() { return this.users; }
  public getCrops() { return this.crops; }
  public getCropLogs() { return this.cropLogs; }
  public getLivestock() { return this.livestock; }
  public getMilkEntries() { return this.milkEntries; }
  public getHealthRecords() { return this.healthRecords; }
  public getInventory() { return this.inventory; }
  public getStockMovements() { return this.stockMovements; }
  public getEquipment() { return this.equipment; }
  public getMaintenanceLogs() { return this.maintenanceLogs; }
  public getTasks() { return this.tasks; }
  public getTransactions() { return this.transactions; }
  public getMandiPrices() { return this.mandiPrices; }
  public getGovernmentSchemes() { return this.schemes; }
  public getFarmDocuments() { return this.farmDocuments; }
  public getLoanRecords() { return this.loans; }
  public getSuppliers() { return this.suppliers; }
  public getWorkers() { return this.workers; }
  public getAttendance() { return this.attendance; }
  public getNotifications() { return this.notifications; }
  public getFieldLogs() { return this.fieldLogs; }
  public getInvites() { return this.invites; }

  // Milk Operations
  public addMilkEntry(entry: Omit<MilkEntry, 'id'>) {
    const newEntry: MilkEntry = {
      ...entry,
      id: `milk-${Date.now()}`,
    };
    this.milkEntries = [newEntry, ...this.milkEntries];
    this.addFieldLog('Livestock', `Recorded milk collection: ${entry.quantityLitres}L (${entry.session})`);
    this.notify();
    return newEntry;
  }

  public deleteMilkEntry(id: string) {
    this.milkEntries = this.milkEntries.filter((m) => m.id !== id);
    this.notify();
  }

  // Document Vault
  public addFarmDocument(doc: Omit<FarmDocument, 'id' | 'uploadedAt'>) {
    const newDoc: FarmDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    this.farmDocuments = [newDoc, ...this.farmDocuments];
    this.addFieldLog('Staff', `Saved document to vault: ${doc.title}`);
    this.notify();
    return newDoc;
  }

  public deleteFarmDocument(id: string) {
    this.farmDocuments = this.farmDocuments.filter((d) => d.id !== id);
    this.notify();
  }

  // Loan & Credit Tracker
  public addLoanRecord(loan: Omit<LoanRecord, 'id'>) {
    const newLoan: LoanRecord = {
      ...loan,
      id: `loan-${Date.now()}`,
    };
    this.loans = [newLoan, ...this.loans];
    this.addFieldLog('Finance', `Added agricultural credit record: ${loan.lenderName} (${loan.loanType})`);
    this.notify();
    return newLoan;
  }

  public updateLoanRecord(id: string, updates: Partial<LoanRecord>) {
    this.loans = this.loans.map((l) => (l.id === id ? { ...l, ...updates } : l));
    this.notify();
  }

  public deleteLoanRecord(id: string) {
    this.loans = this.loans.filter((l) => l.id !== id);
    this.notify();
  }

  // Area Unit Setting
  public setDefaultAreaUnit(unit: AreaUnit) {
    this.farm = { ...this.farm, defaultAreaUnit: unit };
    this.currentUser = { ...this.currentUser, defaultAreaUnit: unit };
    this.notify();
  }

  // Invite Management System
  public createInvite(data: {
    role: UserRole;
    email?: string;
    expiryDuration: '24h' | '7d' | '30d';
    maxUses?: number;
  }): Invite {
    if (this.currentUser.role === 'worker') {
      throw new Error('Worker accounts are not authorized to create invites.');
    }
    if (this.currentUser.role === 'manager' && data.role !== 'worker') {
      throw new Error('Farm Managers can only generate invite codes for Workers.');
    }

    const durationDays = data.expiryDuration === '24h' ? 1 : data.expiryDuration === '7d' ? 7 : 30;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    
    const farmPrefix = 'KISAN';
    const rolePrefix = data.role.toUpperCase().slice(0, 3);
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `${farmPrefix}-${rolePrefix}-${randomHex}`;

    const newInvite: Invite = {
      id: `inv-${Date.now()}`,
      farmId: this.farm.id,
      farmName: this.farm.name,
      code,
      role: data.role,
      email: data.email?.trim() || undefined,
      createdBy: this.currentUser.id,
      createdByName: `${this.currentUser.fullName} (${this.currentUser.role.toUpperCase()})`,
      createdAt: new Date().toISOString(),
      expiresAt,
      maxUses: data.maxUses && data.maxUses > 0 ? data.maxUses : 1,
      usedCount: 0,
      status: 'active',
    };

    this.invites = [newInvite, ...this.invites];
    this.addFieldLog('Staff', `Generated invite code ${code} for role ${data.role.toUpperCase()}`);
    this.notify();
    return newInvite;
  }

  public revokeInvite(id: string): boolean {
    const invite = this.invites.find((i) => i.id === id);
    if (!invite) return false;

    if (this.currentUser.role === 'worker') {
      throw new Error('Worker accounts cannot revoke invites.');
    }
    if (this.currentUser.role === 'manager' && invite.role !== 'worker') {
      throw new Error('Farm Managers can only manage Worker invites.');
    }

    this.invites = this.invites.map((i) =>
      i.id === id ? { ...i, status: 'revoked' as const } : i
    );
    this.addFieldLog('Staff', `Revoked invite code ${invite.code}`);
    this.notify();
    return true;
  }

  public validateInviteCode(
    code: string,
    expectedRole?: UserRole
  ): { valid: boolean; message: string; invite?: Invite } {
    if (!code || !code.trim()) {
      return { valid: false, message: 'Please enter a farm invite code.' };
    }
    const clean = code.trim().toUpperCase();
    const invite = this.invites.find((i) => i.code.toUpperCase() === clean);

    if (!invite) {
      return {
        valid: false,
        message: 'Invalid invite code. Please request an invite code from your Farm Owner.',
      };
    }

    if (invite.status === 'revoked') {
      return {
        valid: false,
        message: 'This invite code has been revoked by the farm administrator.',
      };
    }

    if (new Date(invite.expiresAt).getTime() <= Date.now()) {
      if (invite.status !== 'expired') {
        invite.status = 'expired';
        this.notify();
      }
      return {
        valid: false,
        message: 'This invite code has expired. Please request a new invite from the farm owner.',
      };
    }

    if (invite.usedCount >= invite.maxUses) {
      if (invite.status !== 'used') {
        invite.status = 'used';
        this.notify();
      }
      return {
        valid: false,
        message: 'This invite code has already reached its maximum allowed uses.',
      };
    }

    if (expectedRole && invite.role !== expectedRole) {
      return {
        valid: false,
        message: `This invite code was issued for the "${invite.role.toUpperCase()}" role, but "${expectedRole.toUpperCase()}" was selected.`,
      };
    }

    return {
      valid: true,
      message: `Valid invite code for "${invite.farmName}" as ${invite.role.toUpperCase()}`,
      invite,
    };
  }

  // Registration & Direct User Provisioning
  public registerUser(data: {
    fullName: string;
    email: string;
    phone?: string;
    password?: string;
    role: UserRole;
    farmName?: string;
    farmLocation?: string;
    inviteCode?: string;
  }): { success: boolean; message: string; user?: UserProfile } {
    const existing = this.users.find(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (existing) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    let assignedFarmId = this.farm.id;
    let assignedFarmName = this.farm.name;
    let assignedRole: UserRole = data.role;

    if (data.role === 'owner') {
      if (data.inviteCode && data.inviteCode.trim()) {
        const validation = this.validateInviteCode(data.inviteCode, 'owner');
        if (!validation.valid || !validation.invite) {
          return { success: false, message: validation.message };
        }
        const inv = validation.invite;
        inv.usedCount += 1;
        if (inv.usedCount >= inv.maxUses) inv.status = 'used';
        assignedFarmId = inv.farmId;
        assignedFarmName = inv.farmName;
        assignedRole = 'owner';
      } else {
        assignedFarmId = `farm-${Date.now()}`;
        assignedFarmName = data.farmName?.trim() || 'Kisan Agro Farm';
        const newFarm: Farm = {
          id: assignedFarmId,
          name: assignedFarmName,
          ownerId: `user-${Date.now()}`,
          ownerName: data.fullName,
          location: data.farmLocation?.trim() || 'Nashik, Maharashtra',
          latitude: 20.1706,
          longitude: 73.9858,
          totalAreaAcres: 25,
          defaultAreaUnit: 'acre',
          soilType: 'Black Cotton (Regur)',
          farmType: 'Diversified Cash Crops, Horticulture & Desi Dairy',
          irrigationType: 'drip',
          logoUrl: '',
        };
        this.farm = newFarm;
        assignedRole = 'owner';
      }
    } else {
      if (!data.inviteCode || !data.inviteCode.trim()) {
        return {
          success: false,
          message: `A Farm Invite Code is required to join as ${data.role.toUpperCase()}.`,
        };
      }
      const validation = this.validateInviteCode(data.inviteCode, data.role);
      if (!validation.valid || !validation.invite) {
        return { success: false, message: validation.message };
      }
      const inv = validation.invite;
      inv.usedCount += 1;
      if (inv.usedCount >= inv.maxUses) inv.status = 'used';
      assignedFarmId = inv.farmId;
      assignedFarmName = inv.farmName;
      assignedRole = inv.role;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim(),
      role: assignedRole,
      farmId: assignedFarmId,
      farmName: assignedFarmName,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
    };

    this.users = [...this.users, newUser];
    this.addWorker({
      fullName: newUser.fullName,
      role: newUser.role,
      phone: newUser.phone || '',
      email: newUser.email,
      assignedTasksCount: 0,
      status: 'active',
      attendanceStatus: 'present',
    });

    this.currentUser = newUser;
    this.addFieldLog('Staff', `Registered new member ${newUser.fullName} as ${newUser.role.toUpperCase()}`);
    this.notify();

    return {
      success: true,
      message: `Account created successfully! Welcome to ${assignedFarmName}.`,
      user: newUser,
    };
  }

  public addUserDirectly(data: {
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
    temporaryPassword?: string;
  }): { success: boolean; message: string; user?: UserProfile } {
    if (this.currentUser.role !== 'owner') {
      return {
        success: false,
        message: 'Only Farm Owners have permission to directly provision new accounts.',
      };
    }

    const existing = this.users.find(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (existing) {
      return {
        success: false,
        message: 'A user account with this email address already exists.',
      };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim(),
      role: data.role,
      farmId: this.farm.id,
      farmName: this.farm.name,
      mustChangePassword: true,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
    };

    this.users = [...this.users, newUser];
    this.addWorker({
      fullName: newUser.fullName,
      role: newUser.role,
      phone: newUser.phone || '',
      email: newUser.email,
      assignedTasksCount: 0,
      status: 'active',
    });

    this.addFieldLog(
      'Staff',
      `Owner provisioned direct ${data.role.toUpperCase()} account for ${newUser.fullName}`
    );
    this.notify();

    return {
      success: true,
      message: `User ${newUser.fullName} added! Temporary password set; must change on first login.`,
      user: newUser,
    };
  }

  public changePassword(userId: string): boolean {
    this.currentUser = { ...this.currentUser, mustChangePassword: false };
    this.users = this.users.map((u) =>
      u.id === userId ? { ...u, mustChangePassword: false } : u
    );
    this.notify();
    return true;
  }

  // User & Role Switching
  public setCurrentUserRole(role: UserRole) {
    const matched = this.users.find((u) => u.role === role);
    if (matched) {
      this.currentUser = { ...matched };
    } else {
      this.currentUser = { ...this.currentUser, role };
    }
    this.notify();
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    this.notify();
  }

  public updateProfile(updates: Partial<UserProfile>) {
    this.currentUser = { ...this.currentUser, ...updates };
    this.users = this.users.map((u) => (u.id === this.currentUser.id ? this.currentUser : u));
    this.notify();
  }

  // Farm Profile
  public updateFarm(updates: Partial<Farm>) {
    this.farm = { ...this.farm, ...updates };
    this.notify();
  }

  // Crops
  public addCrop(crop: Omit<Crop, 'id'>) {
    const newCrop: Crop = {
      ...crop,
      id: `crop-${Date.now()}`,
    };
    this.crops = [newCrop, ...this.crops];
    this.addFieldLog('Crops', `Added new crop planting: ${crop.name} (${crop.areaAcres} Ac)`);
    this.notify();
    return newCrop;
  }

  public updateCrop(id: string, updates: Partial<Crop>) {
    this.crops = this.crops.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.notify();
  }

  public deleteCrop(id: string) {
    this.crops = this.crops.filter((c) => c.id !== id);
    this.notify();
  }

  public addCropLog(log: Omit<CropLog, 'id'>) {
    const newLog: CropLog = {
      ...log,
      id: `clog-${Date.now()}`,
    };
    this.cropLogs = [newLog, ...this.cropLogs];
    this.addFieldLog('Crops', `Logged ${log.activityType} for ${log.cropName}`);
    this.notify();
    return newLog;
  }

  // Livestock
  public addLivestock(animal: Omit<Livestock, 'id'>) {
    const newAnimal: Livestock = {
      ...animal,
      id: `live-${Date.now()}`,
    };
    this.livestock = [newAnimal, ...this.livestock];
    this.addFieldLog('Livestock', `Registered livestock: ${animal.breed} (Tag: ${animal.tagId})`);
    this.notify();
    return newAnimal;
  }

  public updateLivestock(id: string, updates: Partial<Livestock>) {
    this.livestock = this.livestock.map((l) => (l.id === id ? { ...l, ...updates } : l));
    this.notify();
  }

  public deleteLivestock(id: string) {
    this.livestock = this.livestock.filter((l) => l.id !== id);
    this.notify();
  }

  public addHealthRecord(record: Omit<LivestockHealthRecord, 'id'>) {
    const newRec: LivestockHealthRecord = {
      ...record,
      id: `lhr-${Date.now()}`,
    };
    this.healthRecords = [newRec, ...this.healthRecords];
    this.addFieldLog('Livestock', `Added health record: ${record.treatment} for ${record.tagId}`);
    this.notify();
    return newRec;
  }

  // Inventory
  public addInventoryItem(item: Omit<InventoryItem, 'id'>) {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    this.inventory = [newItem, ...this.inventory];
    this.addFieldLog('Inventory', `Added stock item: ${item.name} (${item.quantity} ${item.unit})`);
    this.notify();
    return newItem;
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    this.inventory = this.inventory.map((i) => (i.id === id ? { ...i, ...updates } : i));
    this.notify();
  }

  public deleteInventoryItem(id: string) {
    this.inventory = this.inventory.filter((i) => i.id !== id);
    this.notify();
  }

  public recordStockMovement(
    inventoryItemId: string,
    movementType: 'IN' | 'OUT' | 'ADJUSTMENT',
    quantity: number,
    reason: string
  ) {
    const item = this.inventory.find((i) => i.id === inventoryItemId);
    if (!item) return;

    let newQty = item.quantity;
    if (movementType === 'IN') newQty += quantity;
    else if (movementType === 'OUT') newQty = Math.max(0, newQty - quantity);
    else newQty = quantity;

    this.updateInventoryItem(inventoryItemId, { quantity: newQty });

    const movement: StockMovement = {
      id: `sm-${Date.now()}`,
      inventoryItemId,
      itemName: item.name,
      movementType,
      quantity,
      reason,
      performedBy: this.currentUser.fullName,
      date: new Date().toISOString().split('T')[0],
    };

    this.stockMovements = [movement, ...this.stockMovements];

    if (newQty <= item.reorderLevel) {
      this.notifications.unshift({
        id: `notif-stock-${Date.now()}`,
        title: 'Low Stock Alert',
        message: `${item.name} is down to ${newQty} ${item.unit}. Please place an order.`,
        type: 'low_stock',
        isRead: false,
        link: '/inventory',
        createdAt: 'Just now',
      });
    }

    this.addFieldLog(
      'Inventory',
      `Stock ${movementType}: ${quantity} ${item.unit} of ${item.name} (${reason})`
    );
    this.notify();
  }

  // Equipment
  public addEquipment(eq: Omit<Equipment, 'id'>) {
    const newEq: Equipment = {
      ...eq,
      id: `eq-${Date.now()}`,
    };
    this.equipment = [newEq, ...this.equipment];
    this.addFieldLog('Equipment', `Added implement: ${eq.name} (${eq.model})`);
    this.notify();
    return newEq;
  }

  public updateEquipment(id: string, updates: Partial<Equipment>) {
    this.equipment = this.equipment.map((e) => (e.id === id ? { ...e, ...updates } : e));
    this.notify();
  }

  public deleteEquipment(id: string) {
    this.equipment = this.equipment.filter((e) => e.id !== id);
    this.notify();
  }

  public addMaintenanceLog(log: Omit<MaintenanceLog, 'id'>) {
    const newLog: MaintenanceLog = {
      ...log,
      id: `ml-${Date.now()}`,
    };
    this.maintenanceLogs = [newLog, ...this.maintenanceLogs];
    this.addFieldLog('Equipment', `Logged service: ${log.serviceType} for ${log.equipmentName}`);
    this.notify();
    return newLog;
  }

  // Tasks
  public addTask(task: Omit<Task, 'id'>) {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    };
    this.tasks = [newTask, ...this.tasks];
    this.addFieldLog('Tasks', `Created field task: ${task.title}`);
    this.notify();
    return newTask;
  }

  public updateTaskStatus(id: string, status: Task['status']) {
    this.tasks = this.tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status,
            progressPercentage: status === 'completed' ? 100 : t.progressPercentage,
            completed: status === 'completed',
          }
        : t
    );
    this.addFieldLog('Tasks', `Updated task status to ${status.toUpperCase()}`);
    this.notify();
  }

  public updateTask(id: string, updates: Partial<Task>) {
    this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    this.notify();
  }

  public deleteTask(id: string) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.notify();
  }

  // Transactions (Sales & Expenses in ₹)
  public addTransaction(tx: Omit<Transaction, 'id'>) {
    const newTx: Transaction = { ...tx, id: `tx-${Date.now()}` };
    this.transactions = [newTx, ...this.transactions];
    this.addFieldLog(
      'Finance',
      `Recorded ${tx.type.toUpperCase()}: ₹${tx.amount.toLocaleString('en-IN')} for ${tx.category} (${tx.description})`
    );
    this.notify();
    return newTx;
  }

  public deleteTransaction(id: string) {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    this.notify();
  }

  // Suppliers
  public addSupplier(sup: Omit<Supplier, 'id'>) {
    const newSup: Supplier = { ...sup, id: `sup-${Date.now()}` };
    this.suppliers = [newSup, ...this.suppliers];
    this.notify();
    return newSup;
  }

  public updateSupplier(id: string, updates: Partial<Supplier>) {
    this.suppliers = this.suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.notify();
  }

  public deleteSupplier(id: string) {
    this.suppliers = this.suppliers.filter((s) => s.id !== id);
    this.notify();
  }

  // Workers & Daily Attendance
  public addWorker(worker: Omit<Worker, 'id'>) {
    const newWorker: Worker = { ...worker, id: `worker-${Date.now()}` };
    this.workers = [newWorker, ...this.workers];
    this.notify();
    return newWorker;
  }

  public updateWorker(id: string, updates: Partial<Worker>) {
    this.workers = this.workers.map((w) => (w.id === id ? { ...w, ...updates } : w));
    this.notify();
  }

  public markAttendance(workerId: string, status: AttendanceRecord['status'], notes?: string) {
    const worker = this.workers.find((w) => w.id === workerId);
    if (!worker) return;

    const today = new Date().toISOString().split('T')[0];
    const existingIndex = this.attendance.findIndex(
      (a) => a.workerId === workerId && a.date === today
    );

    const checkIn = ['present', 'late'].includes(status)
      ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : undefined;

    if (existingIndex >= 0) {
      this.attendance[existingIndex] = {
        ...this.attendance[existingIndex],
        status,
        checkIn: this.attendance[existingIndex].checkIn || checkIn,
        notes: notes || this.attendance[existingIndex].notes,
      };
    } else {
      this.attendance.unshift({
        id: `att-${Date.now()}`,
        workerId,
        workerName: worker.fullName,
        date: today,
        status,
        checkIn,
        notes,
      });
    }

    this.workers = this.workers.map((w) =>
      w.id === workerId ? { ...w, attendanceStatus: status } : w
    );

    this.addFieldLog('Staff', `Marked ${worker.fullName} attendance as ${status.toUpperCase()}`);
    this.notify();
  }

  // Notifications
  public markNotificationAsRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.notify();
  }

  public markAllNotificationsAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.notify();
  }

  // Field Logs
  public addFieldLog(module: FieldLog['module'], action: string) {
    const newLog: FieldLog = {
      id: `flog-${Date.now()}`,
      userName: this.currentUser.fullName,
      action,
      module,
      details: 'Just now • Verified by FarmSync Telemetry',
      timestamp: 'Just now',
    };
    this.fieldLogs = [newLog, ...this.fieldLogs.slice(0, 20)];
    this.notify();
  }

  // Reset to Indian Farm baseline
  public resetToDefaults() {
    this.farm = initialFarm;
    this.currentUser = demoUsers[0];
    this.users = demoUsers;
    this.crops = initialCrops;
    this.cropLogs = initialCropLogs;
    this.livestock = initialLivestock;
    this.milkEntries = initialMilkEntries;
    this.healthRecords = initialHealthRecords;
    this.inventory = initialInventory;
    this.stockMovements = initialStockMovements;
    this.equipment = initialEquipment;
    this.maintenanceLogs = initialMaintenanceLogs;
    this.tasks = initialTasks;
    this.transactions = initialTransactions;
    this.mandiPrices = initialMandiPrices;
    this.schemes = GOVERNMENT_SCHEMES_LIST;
    this.farmDocuments = initialFarmDocuments;
    this.loans = initialLoans;
    this.suppliers = initialSuppliers;
    this.workers = initialWorkers;
    this.attendance = initialAttendance;
    this.notifications = initialNotifications;
    this.fieldLogs = initialFieldLogs;
    this.invites = initialInvites;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('farmsync_state_v1');
    }
    this.notify();
  }
}

export const farmStore = new FarmSyncStore();
