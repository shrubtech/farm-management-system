// FarmSync Core TypeScript Type Definitions - Localized for Indian Agriculture

export type UserRole = 'owner' | 'manager' | 'worker';

export type AreaUnit = 'acre' | 'hectare' | 'guntha' | 'bigha';
export type WeightUnit = 'kg' | 'quintal' | 'tonne';
export type CropSeason =
  | 'kharif'
  | 'rabi'
  | 'zaid'
  | 'annual'
  | 'Kharif'
  | 'Rabi'
  | 'Zaid'
  | 'Annual'
  | 'Perennial';
export type IrrigationType =
  | 'rainfed'
  | 'borewell'
  | 'canal'
  | 'drip'
  | 'sprinkler'
  | 'farm_pond';
export type FarmerCategory = 'marginal' | 'small' | 'medium' | 'large';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  farmId: string;
  farmName?: string;
  mustChangePassword?: boolean;
  defaultAreaUnit?: AreaUnit;
  simpleMode?: boolean;
  fontSizePreference?: 'standard' | 'large' | 'extra_large';
}

export type InviteStatus = 'active' | 'used' | 'expired' | 'revoked';

export interface Invite {
  id: string;
  farmId: string;
  farmName: string;
  code: string;
  role: UserRole;
  email?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  expiresAt: string;
  usedBy?: string;
  usedAt?: string;
  maxUses: number;
  usedCount: number;
  status: InviteStatus;
}

export interface Farm {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  location: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  pincode?: string;
  surveyNumber?: string;
  satbara712?: string;
  latitude: number;
  longitude: number;
  totalAreaAcres: number;
  defaultAreaUnit: AreaUnit;
  soilType: string;
  farmType: string;
  irrigationType: IrrigationType;
  farmerCategory?: FarmerCategory;
  logoUrl?: string;
}

export type CropStatus = 'planted' | 'growing' | 'harvested' | 'fallow';

export interface Crop {
  id: string;
  name: string;
  variety: string;
  fieldPlot: string;
  areaAcres: number;
  areaUnit?: AreaUnit;
  season?: CropSeason;
  plantingDate: string;
  expectedHarvestDate: string;
  status: CropStatus;
  estimatedYield?: number;
  actualYield?: number;
  yieldUnit: string;
  color?: string;
  notes?: string;
}

export interface CropLog {
  id: string;
  cropId: string;
  cropName: string;
  activityType: 'Fertilizer' | 'Pesticide' | 'Irrigation' | 'Scouting' | 'Harvest';
  description: string;
  quantity?: number;
  unit?: string;
  appliedBy: string;
  date: string;
}

export type HealthStatus = 'healthy' | 'treatment' | 'quarantine' | 'critical';
export type AnimalGender = 'male' | 'female';

export interface Livestock {
  id: string;
  tagId: string;
  inaphTagId?: string; // Pashu Aadhaar / INAPH 12-digit number
  animalType: 'Cow' | 'Buffalo' | 'Goat' | 'Sheep' | 'Poultry' | 'Bullock' | 'Horse';
  breed: string;
  ageMonths: number;
  gender: AnimalGender;
  healthStatus: HealthStatus;
  weightKg: number;
  pastureLocation: string;
  feedSchedule: string;
  dailyMilkMorningLitres?: number;
  dailyMilkEveningLitres?: number;
  milkFatPercentage?: number;
  milkSnfPercentage?: number;
  calvingDate?: string;
  lastHeatDate?: string;
  expectedDeliveryDate?: string;
  lastVaccinationDate?: string;
  nextVaccinationDate?: string;
}

export interface MilkEntry {
  id: string;
  livestockId?: string;
  tagId?: string;
  animalBreed?: string;
  date: string;
  session: 'morning' | 'evening';
  quantityLitres: number;
  fatPercentage: number;
  snfPercentage?: number;
  ratePerLitre: number;
  totalAmount: number;
  buyer?: string; // e.g. Amul Dairy Cooperative, Mahanand, Mother Dairy, Local Collection Center
  purchaserName?: string;
}

export interface LivestockHealthRecord {
  id: string;
  livestockId: string;
  tagId: string;
  recordType: 'Vaccination' | 'Checkup' | 'Treatment' | 'Breeding';
  treatment: string;
  dosage?: string;
  veterinarian: string;
  date: string;
  nextDueDate?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Feed' | 'Tools' | 'Irrigation' | 'Fuel';
  sku: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitCost: number; // in INR ₹
  supplierId?: string;
  supplierName?: string;
  storageLocation: string;
  expiryDate?: string;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  itemName: string;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  performedBy: string;
  date: string;
}

export type EquipmentStatus = 'active' | 'under_maintenance' | 'retired';

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: EquipmentStatus;
  purchaseDate: string;
  purchaseCost: number; // in INR ₹
  lastServiceDate: string;
  nextServiceDue: string;
  assignedOperator: string;
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  equipmentId: string;
  equipmentName: string;
  serviceType: string;
  cost: number; // in INR ₹
  servicedBy: string;
  date: string;
  description: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'normal' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToName: string;
  assignedToId: string;
  dueDate: string;
  relatedPlot?: string;
  relatedCropName?: string;
  relatedLivestockTag?: string;
  progressPercentage: number;
  completed?: boolean;
}

export type TransactionType = 'sale' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number; // Net amount in INR ₹
  grossAmount?: number;
  date: string;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  referenceNumber: string;
  description: string;
  supplierName?: string;
  customerName?: string;
  buyerType?: 'apmc_mandi' | 'trader_arhatiya' | 'direct_consumer' | 'dairy_cooperative' | 'fpo';
  commodity?: string;
  quantityQuintals?: number;
  ratePerQuintal?: number;
  commissionAdat?: number;
  transportCost?: number;
  weighingHamali?: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: string[];
  rating: number;
  lastOrderDate: string;
}

export interface Worker {
  id: string;
  fullName: string;
  role: UserRole;
  phone: string;
  email: string;
  dailyWage?: number; // in INR ₹
  assignedTasksCount: number;
  status: 'active' | 'on_leave';
  attendanceStatus?: 'present' | 'absent' | 'late' | 'on_leave';
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type:
    | 'low_stock'
    | 'maintenance_due'
    | 'task_assigned'
    | 'vaccination_due'
    | 'weather_alert'
    | 'mandi_price_alert'
    | 'scheme_alert';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface FieldLog {
  id: string;
  userName: string;
  action: string;
  module:
    | 'Irrigation'
    | 'Logistics'
    | 'IoT Mesh'
    | 'Batch Manifest'
    | 'Crops'
    | 'Livestock'
    | 'Inventory'
    | 'Equipment'
    | 'Tasks'
    | 'Finance'
    | 'Staff'
    | 'Market'
    | 'Telemetry';
  details: string;
  timestamp: string;
}

// Mandi Price Data & APMC
export interface MandiPrice {
  id: string;
  commodity: string;
  variety?: string;
  mandiName: string;
  market?: string;
  district: string;
  state: string;
  arrivalDate: string;
  date?: string;
  arrivalQuantity?: string;
  minPricePerQuintal: number;
  maxPricePerQuintal: number;
  modalPricePerQuintal: number;
  minPrice?: number;
  maxPrice?: number;
  modalPrice?: number;
  unit?: string;
  mspPricePerQuintal?: number;
  trend: 'up' | 'down' | 'stable';
}

// Government Schemes & Support
export interface GovernmentScheme {
  id: string;
  name: string;
  tagline: string;
  category: 'direct_benefit' | 'crop_insurance' | 'credit' | 'soil_solar' | 'market_infra';
  benefitAmount: string;
  eligibility: string;
  documentsRequired: string[];
  officialUrl: string;
}

// Land & Farm Legal Documents (Satbara, Soil Health Card, KCC)
export interface FarmDocument {
  id: string;
  title: string;
  docType:
    | '7_12_extract'
    | 'soil_health_card'
    | 'kcc_passbook'
    | 'crop_insurance'
    | 'aadhaar'
    | 'electricity_bill';
  docNumber?: string;
  issueDate: string;
  expiryDate?: string;
  fileUrl?: string;
  fileSize?: string;
  uploadedAt: string;
}

// Agricultural Credit & Kisan Credit Card (KCC) Loans
export interface LoanRecord {
  id: string;
  lenderName: string;
  loanType: 'Kisan Credit Card (KCC)' | 'Tractor Loan' | 'Drip Irrigation Subsidy' | 'Dairy Development';
  accountNumber: string;
  principalAmount: number;
  subsidizedInterestRate: number; // e.g. 4% with prompt repayment subvention
  sanctionDate: string;
  dueDate: string;
  amountRepaid: number;
  status: 'active' | 'due_soon' | 'overdue' | 'cleared';
}
