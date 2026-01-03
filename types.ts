
export enum Category {
  CATTLE = 'Cattle',
  POULTRY = 'Poultry',
  AGRI_PRODUCE = 'Agri Produce',
  CONSUMABLES = 'Daily Consumables',
  MACHINERY = 'Machinery',
  HIRE = 'Hire/Logistics',
  FEEDS = 'Feeds',
  PETS = 'Pets',
  FERTILIZER = 'Fertilizer',
  PESTICIDES = 'Pesticides'
}

export type MachineryType = 
  | 'Harvester' 
  | 'Borewell Rig' 
  | 'Tractor' 
  | 'Plow' 
  | 'Drone Sprayer' 
  | 'Gun Sprayer' 
  | 'Incubator' 
  | 'Cages' 
  | 'Cattle Mats' 
  | 'Other';

export type TransportType = 'Truck' | 'LCV' | 'Auto' | 'Open Body' | 'Closed Body' | 'Van';
export type FoodType = 'Milk' | 'Vegetables' | 'Grains' | 'Fruits' | 'Roots' | 'Flowers' | 'Herbs' | 'Spices' | 'Essentials';

export type AgriListingType = 'Buy Now' | 'Bidding' | 'Tender' | 'Rental' | 'Service';
export type AvailabilityStatus = 'Ready Now' | 'Future Harvest' | 'Available Now';
export type LivestockType = 'Cow' | 'Sheep' | 'Horse' | 'Dog' | 'Hens' | 'Rabbits' | 'Elephant' | 'Goat';

export interface Product {
  id: string;
  name: string;
  category: Category;
  subType?: MachineryType | TransportType | FoodType | LivestockType | string;
  price: number;
  unit?: string;
  seller: string;
  location: string;
  image: string;
  description: string;
  isNearby?: boolean;
  distance?: number; 
  isFarmerVerified?: boolean; 
  isFeatured?: boolean; 
  
  // Agri specific fields
  listingType?: AgriListingType;
  harvestDate?: string;
  availability?: AvailabilityStatus;
  hasSample?: boolean;
  minBid?: number;
  weightInfo?: string; 

  // Bulk Supply Fields
  totalStock?: string; // e.g., "15 Tons", "500 Quintals"
  minOrderQuantity?: string; // e.g., "500 Kg", "2 Tons"
  isBulk?: boolean;

  // Rental/Service fields
  rateInfo?: string; // e.g., "Per Hour", "Per Acre", "Per Day"

  // Livestock specific fields
  milkCapacity?: number; // Litres per day
  calfBirthDate?: string;
  hasVerifiedReport?: boolean;
  breed?: string;
}

export interface CultivationExpense {
  id: string;
  category: 'Seeds' | 'Fertilizer' | 'Pesticide' | 'Labor' | 'Machinery' | 'Other';
  amount: number;
  date: string;
  note: string;
}

export interface Cultivation {
  id: string;
  landName: string;
  cropName: string;
  areaAcres: number;
  startDate: string;
  harvestTargetDate: string;
  nextWateringDate: string;
  nextFertilizerDate: string;
  nextPesticideDate: string;
  expenses: CultivationExpense[];
  estimatedRevenue: number;
  status: 'Growing' | 'Harvesting' | 'Completed' | 'Planning';
}

export interface CattleRecord {
  id: string;
  tagName: string;
  type: LivestockType;
  age: number; // in months
  lactationPeriod?: number; // current lactation number
  milkCapacity?: number;
  calfBirthDate?: string;
  medicalInfo: string;
  physicalProblems: string;
  estimatedValue: number;
  hasVerifiedReport?: boolean;
}

export interface SmallLivestock {
  id: string;
  name: string;
  type: 'Sheep' | 'Goat' | 'Rabbits' | 'Hens';
  age: number; // in months
  weight: number; // in kg
}

export interface Shed {
  id: string;
  name: string; // e.g., "Shed 1"
  animals: SmallLivestock[];
  maintenanceCost: number;
  feedCost: number;
  laborCost: number;
  transportCost: number;
  medicalCost: number;
  pricePerKg: number; // Current market rate for calculation
}

export interface PoultryBatch {
  id: string;
  type: 'Chicken' | 'Hen';
  count: number;
  avgWeight: number;
  unitPrice: number;
}
