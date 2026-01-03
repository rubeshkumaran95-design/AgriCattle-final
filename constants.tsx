
import { Product, Category, CattleRecord, Shed, PoultryBatch, Cultivation } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // Bulk Grains
  {
    id: 'bulk-rice-1',
    name: 'Sona Masoori Rice (Raw)',
    category: Category.AGRI_PRODUCE,
    subType: 'Grains',
    price: 42,
    unit: 'Kg',
    isBulk: true,
    isFeatured: true,
    totalStock: '25 Tons',
    minOrderQuantity: '500 Kg',
    seller: 'Kurnool Agri Exports',
    location: 'Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
    description: 'A-Grade Sona Masoori Rice, 1-year old. Ideal for wholesale distribution.'
  },
  {
    id: 'bulk-paddy-1',
    name: 'Paddy IR-64 (Fine Grain)',
    category: Category.AGRI_PRODUCE,
    subType: 'Grains',
    price: 1850,
    unit: 'Quintal',
    isBulk: true,
    totalStock: '100 Tons',
    minOrderQuantity: '10 Tons',
    seller: 'Telangana Rythu Sangam',
    location: 'Warangal',
    image: 'https://images.unsplash.com/photo-1536633101755-a508f7b7f94d?auto=format&fit=crop&q=80&w=400',
    description: 'Direct harvest from Telangana fields. High moisture stability.'
  },
  {
    id: 'bulk-maize-1',
    name: 'Yellow Maize (Hybrid)',
    category: Category.AGRI_PRODUCE,
    subType: 'Grains',
    price: 21,
    unit: 'Kg',
    isBulk: true,
    isFeatured: true,
    totalStock: '50 Tons',
    minOrderQuantity: '5 Tons',
    seller: 'Maharashtra Grain Mart',
    location: 'Nashik',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400',
    description: 'High quality yellow maize for cattle feed and industrial use.'
  },

  // Fertilizer
  {
    id: 'fert-1',
    name: 'NPK 19:19:19 Water Soluble',
    category: Category.FERTILIZER,
    price: 120,
    unit: 'Kg',
    isFeatured: true,
    seller: 'Green Earth Agrochemicals',
    location: 'Surat',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=400',
    description: 'High quality balanced fertilizer for all types of crops.'
  },
  {
    id: 'fert-2',
    name: 'Organic Neem Cake Fertilizer',
    category: Category.FERTILIZER,
    price: 45,
    unit: 'Kg',
    isFeatured: true,
    seller: 'Eco-Farm Solutions',
    location: 'Mysore',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
    description: 'Natural pest repellent and nitrogen booster for soil.'
  },

  // Pesticides
  {
    id: 'pest-1',
    name: 'Bio-Neem Oil Concentrate',
    category: Category.PESTICIDES,
    price: 450,
    unit: 'Litre',
    isFeatured: true,
    seller: 'Organic Shield',
    location: 'Indore',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=400',
    description: 'Effective against 200+ species of insects. 100% organic.'
  },
  {
    id: 'pest-2',
    name: 'Broad Spectrum Insecticide',
    category: Category.PESTICIDES,
    price: 850,
    unit: '500ml',
    isFeatured: true,
    seller: 'Crop Guard Ltd',
    location: 'Pune',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400',
    description: 'Systemic insecticide for controlled pest management.'
  },

  // Feeds
  {
    id: 'feed-cow-1',
    name: 'High Protein Cattle Feed Pellets',
    category: Category.FEEDS,
    subType: 'Cow',
    price: 32,
    unit: 'Kg',
    isFeatured: true,
    isBulk: true,
    minOrderQuantity: '500 Kg',
    seller: 'Milky Way Feeds',
    location: 'Ambala',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
    description: 'Balanced nutrition for lactating cows. Improves fat content.'
  },
  {
    id: 'feed-poultry-1',
    name: 'Layer Chick Mash',
    category: Category.FEEDS,
    subType: 'Poultry',
    price: 38,
    unit: 'Kg',
    isFeatured: true,
    seller: 'Hatchery Pride',
    location: 'Namakkal',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400',
    description: 'Nutrient-rich starter feed for healthy poultry growth.'
  },

  // Machinery - Agriculture
  {
    id: 'mach-tractor-1',
    name: 'John Deere 5050D Tractor',
    category: Category.MACHINERY,
    subType: 'Tractor',
    price: 850,
    unit: 'Hour',
    rateInfo: 'Per Hour',
    listingType: 'Rental',
    seller: 'Siva Agri Rentals',
    location: 'Guntur',
    image: 'https://images.unsplash.com/photo-1592919016334-08f36070a924?auto=format&fit=crop&q=80&w=400',
    description: 'Powerful tractor for heavy plowing and transport. Operator included.'
  },

  // Cows (Market)
  {
    id: 'c-cow-1',
    name: 'HF Cross Breed Cow',
    category: Category.CATTLE,
    subType: 'Cow',
    price: 75000,
    isFeatured: true,
    seller: 'Arun Dairy',
    location: 'Salem',
    milkCapacity: 22,
    hasVerifiedReport: true,
    isFarmerVerified: true,
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=400',
    description: 'High yielding HF cross cow. 3rd lactation.'
  },
  {
    id: 'c-cow-2',
    name: 'Gir Pureline Heifer',
    category: Category.CATTLE,
    subType: 'Cow',
    price: 120000,
    isFeatured: true,
    seller: 'Somnath Dairy',
    location: 'Junagadh',
    milkCapacity: 14,
    hasVerifiedReport: true,
    isFarmerVerified: true,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400',
    description: 'Purebred Gir heifer. Excellent lineage.'
  }
];

export const INITIAL_CATTLE: CattleRecord[] = [
  { 
    id: '1', 
    tagName: 'C-101', 
    type: 'Cow',
    age: 48, 
    lactationPeriod: 3, 
    milkCapacity: 18,
    calfBirthDate: '2024-11-20',
    medicalInfo: 'Vaccinated Jun 2023', 
    physicalProblems: 'None', 
    estimatedValue: 65000,
    hasVerifiedReport: true 
  },
  { 
    id: '2', 
    tagName: 'H-201', 
    type: 'Horse',
    age: 60, 
    medicalInfo: 'Annual checkup done', 
    physicalProblems: 'None', 
    estimatedValue: 180000,
    hasVerifiedReport: true 
  },
];

export const INITIAL_CULTIVATIONS: Cultivation[] = [
  {
    id: 'cult-1',
    landName: 'East Field',
    cropName: 'Paddy (Sona Masoori)',
    areaAcres: 5,
    startDate: '2024-01-15',
    harvestTargetDate: '2024-05-20',
    nextWateringDate: '2024-06-15', // Mock logic for countdowns
    nextFertilizerDate: '2024-06-18',
    nextPesticideDate: '2024-06-25',
    status: 'Growing',
    estimatedRevenue: 450000,
    expenses: [
      { id: 'exp-1', category: 'Seeds', amount: 15000, date: '2024-01-16', note: 'Hybrid Rice Seeds' },
      { id: 'exp-2', category: 'Labor', amount: 8000, date: '2024-01-18', note: 'Sowing Labor' },
      { id: 'exp-3', category: 'Fertilizer', amount: 12000, date: '2024-02-10', note: 'NPK First Dose' }
    ]
  },
  {
    id: 'cult-2',
    landName: 'North Slope',
    cropName: 'Turmeric',
    areaAcres: 2,
    startDate: '2024-04-01',
    harvestTargetDate: '2024-12-15',
    nextWateringDate: '2024-06-14',
    nextFertilizerDate: '2024-07-05',
    nextPesticideDate: '2024-07-15',
    status: 'Growing',
    estimatedRevenue: 180000,
    expenses: [
      { id: 'exp-4', category: 'Seeds', amount: 25000, date: '2024-04-02', note: 'Rhizomes' }
    ]
  }
];

export const INITIAL_SHEDS: Shed[] = [
  {
    id: 'shed-1',
    name: 'Shed One (Sheep)',
    animals: [
      { id: 's1', name: 'Alpha', type: 'Sheep', age: 12, weight: 45 },
      { id: 's2', name: 'Beta', type: 'Sheep', age: 14, weight: 48 },
    ],
    maintenanceCost: 5000,
    feedCost: 12000,
    laborCost: 8000,
    transportCost: 2000,
    medicalCost: 1500,
    pricePerKg: 450
  }
];

export const INITIAL_POULTRY: PoultryBatch[] = [
  { id: 'p1', type: 'Hen', count: 500, avgWeight: 1.8, unitPrice: 180 }
];
