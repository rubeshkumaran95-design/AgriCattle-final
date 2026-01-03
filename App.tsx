
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import MarketplaceCard from './components/MarketplaceCard';
import { MOCK_PRODUCTS, INITIAL_CATTLE, INITIAL_SHEDS, INITIAL_POULTRY, INITIAL_CULTIVATIONS } from './constants';
import { Category, FoodType, Product, CattleRecord, Shed, PoultryBatch, SmallLivestock, Cultivation, CultivationExpense } from './types';
import { 
  Search, 
  Plus, 
  LayoutDashboard, 
  Calculator, 
  Beef, 
  Sprout, 
  ShoppingBag, 
  Wrench, 
  Truck, 
  ArrowRight, 
  ChevronLeft, 
  Settings, 
  Camera, 
  ShieldCheck, 
  Navigation, 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  Home,
  Tag,
  Stethoscope,
  TrendingUp,
  PieChart,
  Weight,
  Layers,
  Bird,
  Wheat,
  Clock,
  Gavel,
  Leaf,
  Flower2,
  PawPrint,
  FileCheck,
  Baby,
  Droplets,
  MapPin,
  Filter,
  Zap,
  ChevronRight,
  Heart,
  Calendar,
  DollarSign,
  Droplet,
  Thermometer,
  CloudRain,
  UserPlus
} from 'lucide-react';
import { getGeneralAgriCattleAdvice } from './services/geminiService';

interface NavButton {
  id: string;
  label: string;
  icon: any;
  gradient: string;
  tab: string;
  shadow: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hub');
  const [mgmtSubTab, setMgmtSubTab] = useState<'Portfolio' | 'Herd' | 'Sheds' | 'Poultry'>('Portfolio');
  const [agriMgmtSubTab, setAgriMgmtSubTab] = useState<'Active' | 'Finance' | 'Upcoming'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [cattleSubFilter, setCattleSubFilter] = useState<'All' | 'Cow' | 'Sheep' | 'Horse' | 'Dog' | 'Hens' | 'Rabbits' | 'Elephant'>('All');
  const [agriSubFilter, setAgriSubFilter] = useState<'All' | 'Grains' | 'Fruits' | 'Vegetables' | 'Spices' | 'Essentials' | 'Herbs' | 'Fertilizer' | 'Pesticides' | 'Feeds'>('All');
  const [machinerySubFilter, setMachinerySubFilter] = useState<'All' | 'Agri' | 'Cattle' | 'Services'>('All');
  const [radiusFilter, setRadiusFilter] = useState<number>(5); // Default 5km
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Cultivation Management State
  const [cultivations, setCultivations] = useState<Cultivation[]>(INITIAL_CULTIVATIONS);

  // Livestock Management State
  const [cattleList, setCattleList] = useState<CattleRecord[]>(INITIAL_CATTLE);
  const [shedList, setShedList] = useState<Shed[]>(INITIAL_SHEDS);
  const [poultryList, setPoultryList] = useState<PoultryBatch[]>(INITIAL_POULTRY);

  // Profit Calculator State
  const [calcSector, setCalcSector] = useState<'Agri' | 'Cattle'>('Agri');
  const [calcInputs, setCalcInputs] = useState({ name: '', labor: 0, seed: 0, cow: 0, feed: 0, other: 0, revenue: 0 });
  const [calcResult, setCalcResult] = useState<{ profit: number; advice: string } | null>(null);
  const [loadingCalc, setLoadingCalc] = useState(false);

  // Portfolio Logic
  const portfolioStats = useMemo(() => {
    const cattleValue = cattleList.reduce((acc, c) => acc + c.estimatedValue, 0);
    const shedsValue = shedList.reduce((acc, shed) => {
      const totalWeight = shed.animals.reduce((a, s) => a + s.weight, 0);
      return acc + (totalWeight * shed.pricePerKg);
    }, 0);
    const poultryValue = poultryList.reduce((acc, p) => acc + (p.count * p.avgWeight * p.unitPrice), 0);
    const agriValue = cultivations.reduce((acc, cult) => acc + (cult.status === 'Growing' ? cult.estimatedRevenue : 0), 0);
    return { cattleValue, shedsValue, poultryValue, agriValue, totalNetWorth: cattleValue + shedsValue + poultryValue + agriValue };
  }, [cattleList, shedList, poultryList, cultivations]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const getDaysCountdown = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const renderAgriMgmt = () => {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-fadeIn">
        {/* Agri Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex gap-2 p-1.5 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
            {(['Active', 'Finance', 'Upcoming'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setAgriMgmtSubTab(tab)} 
                className={`flex-1 py-3 px-6 rounded-2xl text-[11px] font-black transition-all whitespace-nowrap ${agriMgmtSubTab === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'Active' ? 'ACTIVE LANDS' : tab === 'Finance' ? 'PROFIT LEDGER' : 'PLANNING'}
              </button>
            ))}
          </div>
          <button className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-100 active:scale-95 transition-all">
            <Plus size={18} /> START NEW CULTIVATION
          </button>
        </div>

        {agriMgmtSubTab === 'Active' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cultivations.map(cult => {
              const totalExpenses = cult.expenses.reduce((acc, exp) => acc + exp.amount, 0);
              const projectedProfit = cult.estimatedRevenue - totalExpenses;
              
              return (
                <div key={cult.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-2xl hover:shadow-emerald-50 transition-all group overflow-hidden relative">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <Leaf size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{cult.cropName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cult.landName} • {cult.areaAcres} Acres</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {cult.status}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Started {new Date(cult.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Countdowns Row */}
                  <div className="grid grid-cols-4 gap-3 mb-8">
                    <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
                      <Droplet size={16} className="text-blue-500 mb-1" />
                      <p className="text-[8px] font-black text-blue-400 uppercase">Water</p>
                      <p className="text-sm font-black text-blue-700">{getDaysCountdown(cult.nextWateringDate)}d</p>
                    </div>
                    <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
                      <Zap size={16} className="text-emerald-500 mb-1" />
                      <p className="text-[8px] font-black text-emerald-400 uppercase">Fert</p>
                      <p className="text-sm font-black text-emerald-700">{getDaysCountdown(cult.nextFertilizerDate)}d</p>
                    </div>
                    <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100 flex flex-col items-center text-center">
                      <CloudRain size={16} className="text-purple-500 mb-1" />
                      <p className="text-[8px] font-black text-purple-400 uppercase">Pest</p>
                      <p className="text-sm font-black text-purple-700">{getDaysCountdown(cult.nextPesticideDate)}d</p>
                    </div>
                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 flex flex-col items-center text-center">
                      <Calendar size={16} className="text-amber-500 mb-1" />
                      <p className="text-[8px] font-black text-amber-400 uppercase">Harvest</p>
                      <p className="text-sm font-black text-amber-700">{getDaysCountdown(cult.harvestTargetDate)}d</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                    <button className="bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0">
                      <UserPlus size={14} /> Hire Labor
                    </button>
                    <button className="bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0">
                      <Truck size={14} /> Hire Transport
                    </button>
                    <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0 shadow-lg">
                      <ShoppingBag size={14} /> List Harvest
                    </button>
                  </div>

                  {/* Financial Summary */}
                  <div className="bg-slate-900 rounded-3xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Cycle Valuation</h4>
                      <TrendingUp size={16} className="text-emerald-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Total Investment</p>
                        <p className="text-xl font-black">₹{totalExpenses.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Est. Profit</p>
                        <p className="text-xl font-black text-emerald-400">₹{projectedProfit.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {agriMgmtSubTab === 'Finance' && (
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Financial Ledger</h3>
              <div className="flex gap-2">
                <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600"><PieChart size={20} /></button>
                <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600"><Tag size={20} /></button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cultivation</th>
                    <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Note</th>
                    <th className="py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-600">
                  {cultivations.flatMap(c => c.expenses.map(e => (
                    <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-black text-slate-800">{c.cropName}</td>
                      <td className="py-4">
                        <span className="bg-slate-100 px-3 py-1 rounded-lg text-[9px] font-black uppercase text-slate-500">{e.category}</span>
                      </td>
                      <td className="py-4 text-slate-400">{new Date(e.date).toLocaleDateString()}</td>
                      <td className="py-4 italic">{e.note}</td>
                      <td className="py-4 text-right font-black text-rose-500">₹{e.amount.toLocaleString()}</td>
                    </tr>
                  )))}
                  <tr className="bg-emerald-50/30">
                    <td colSpan={4} className="py-6 font-black text-slate-800 text-right uppercase text-[10px] tracking-widest">Total Active Investment</td>
                    <td className="py-6 text-right font-black text-slate-900 text-xl">
                      ₹{cultivations.reduce((acc, c) => acc + c.expenses.reduce((s, e) => s + e.amount, 0), 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {agriMgmtSubTab === 'Upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white">
              <h4 className="text-lg font-black mb-4 flex items-center gap-2"><Sparkles className="text-yellow-400 fill-yellow-400" /> AI Rotation Planner</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">Based on your current <b>Paddy</b> harvest in East Field, soil nutrients will be low in nitrogen. Our AI suggests planting <b>Black Gram (Urad)</b> or <b>Cowpeas</b> to restore soil health naturally.</p>
              <button className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl text-xs uppercase tracking-widest">Generate Full 2025 Plan</button>
            </div>
            <div className="bg-white border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
              <Plus size={48} className="text-slate-300 mb-4" />
              <h4 className="text-lg font-black text-slate-800">New Land Registration</h4>
              <p className="text-xs text-slate-400 mb-6">Register a new field or leased land to begin tracking its productivity.</p>
              <button className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Register Land</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleProfitCalculation = async () => {
    setLoadingCalc(true);
    const totalInvestment = calcInputs.labor + calcInputs.other + (calcSector === 'Agri' ? calcInputs.seed : (calcInputs.cow + calcInputs.feed));
    const profit = calcInputs.revenue - totalInvestment;
    try {
      const advice = await getGeneralAgriCattleAdvice({
        sector: calcSector, name: calcInputs.name || 'Current Batch',
        investments: calcSector === 'Agri' ? { Labor: calcInputs.labor, Seeds: calcInputs.seed, Other: calcInputs.other } : { Labor: calcInputs.labor, Cow: calcInputs.cow, Feed: calcInputs.feed, Other: calcInputs.other },
        revenue: calcInputs.revenue, profit: profit
      });
      setCalcResult({ profit, advice });
    } catch (err) {
      setCalcResult({ profit, advice: "Optimize resources to ensure better yield margins." });
    } finally {
      setLoadingCalc(false);
    }
  };

  const primaryButtons: NavButton[] = [
    { id: 'cattle-market', label: 'Cattle/Pets', icon: Beef, gradient: 'bg-gradient-to-br from-orange-400 to-rose-600', tab: 'cattle-market', shadow: 'shadow-orange-200' },
    { id: 'agri-market', label: 'Agri Hub', icon: Sprout, gradient: 'bg-gradient-to-br from-emerald-400 to-green-600', tab: 'agri-marketplace', shadow: 'shadow-emerald-200' },
  ];

  const secondaryButtons: NavButton[] = [
    { id: 'food-market', label: 'Local Food', icon: ShoppingBag, gradient: 'bg-gradient-to-br from-yellow-300 to-amber-500', tab: 'food-market', shadow: 'shadow-yellow-100' },
    { id: 'machinery-market', label: 'Machines', icon: Wrench, gradient: 'bg-gradient-to-br from-blue-400 to-indigo-600', tab: 'machinery-market', shadow: 'shadow-blue-100' },
    { id: 'transport-market', label: 'Vehicles', icon: Truck, gradient: 'bg-gradient-to-br from-red-400 to-pink-600', tab: 'transport-market', shadow: 'shadow-red-100' },
    { id: 'agri-mgmt', label: 'Agri Pro', icon: Wheat, gradient: 'bg-gradient-to-br from-teal-400 to-cyan-600', tab: 'agri-mgmt', shadow: 'shadow-teal-100' },
    { id: 'cattle-mgmt', label: 'Herd Mgmt', icon: LayoutDashboard, gradient: 'bg-gradient-to-br from-indigo-400 to-violet-600', tab: 'cattle-mgmt', shadow: 'shadow-indigo-100' },
    { id: 'calculator', label: 'Profit AI', icon: Calculator, gradient: 'bg-gradient-to-br from-emerald-500 to-teal-700', tab: 'calculator', shadow: 'shadow-emerald-200' },
  ];

  const renderPortfolio = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-violet-800 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] uppercase font-black opacity-70 tracking-[0.3em] mb-2 flex items-center gap-2">
            <Zap size={10} className="fill-yellow-400 text-yellow-400" /> Active Assets Valuation
          </p>
          <h2 className="text-5xl font-black mb-6 tracking-tight">₹{portfolioStats.totalNetWorth.toLocaleString()}</h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-[8px] opacity-80 font-bold tracking-widest uppercase">Cattle</p>
              <p className="text-sm font-black">₹{(portfolioStats.cattleValue/1000).toFixed(1)}k</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-[8px] opacity-80 font-bold tracking-widest uppercase">Sheds</p>
              <p className="text-sm font-black">₹{(portfolioStats.shedsValue/1000).toFixed(1)}k</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-[8px] opacity-80 font-bold tracking-widest uppercase">Poultry</p>
              <p className="text-sm font-black">₹{(portfolioStats.poultryValue/1000).toFixed(1)}k</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-[8px] opacity-80 font-bold tracking-widest uppercase">Agri</p>
              <p className="text-sm font-black">₹{(portfolioStats.agriValue/1000).toFixed(1)}k</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );

  const FeaturedHorizontalSection = ({ 
    title, 
    category, 
    onViewAll 
  }: { 
    title: string; 
    category: Category | string; 
    onViewAll: () => void 
  }) => {
    const filteredProducts = MOCK_PRODUCTS.filter(p => p.category === category || p.subType === category);
    if (filteredProducts.length === 0) return null;

    return (
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
          <button 
            onClick={onViewAll}
            className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
          >
            More <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2 -mx-2">
          {filteredProducts.slice(0, 5).map(product => (
            <div key={product.id} className="w-[185px] shrink-0">
              <MarketplaceCard 
                product={product} 
                onClick={() => {}} 
                variant="compact" 
                isWishlisted={wishlist.includes(product.id)}
                onWishlistToggle={() => toggleWishlist(product.id)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHub = () => (
    <div className="max-w-7xl mx-auto py-4 px-3 animate-fadeIn space-y-8">
      <div className="flex flex-col items-center text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
          <Sparkles size={12} className="text-yellow-500 fill-yellow-500" /> Powered by Smart Agri
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
          Farm smarter with <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">AgriCattle.in</span>
        </h2>
        <p className="text-slate-400 text-sm font-medium max-w-md">Connect, calculate, and cultivate your livestock business with AI precision.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {primaryButtons.map((btn) => (
          <button 
            key={btn.id} 
            onClick={() => setActiveTab(btn.tab)} 
            className={`group relative glass-card rounded-[2.5rem] p-8 shadow-xl border-slate-100 flex flex-col items-center text-center transition-all hover:scale-[1.03] active:scale-95`}
          >
            <div className={`w-20 h-20 md:w-28 md:h-28 rounded-3xl ${btn.gradient} text-white flex items-center justify-center mb-5 shadow-2xl ${btn.shadow} group-hover:rotate-6 transition-transform duration-500`}>
              <btn.icon size={48} className="md:w-16 md:h-16" />
            </div>
            <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">{btn.label}</h3>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Explore Market <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {secondaryButtons.map((btn) => (
          <button 
            key={btn.id} 
            onClick={() => setActiveTab(btn.tab)} 
            className="group bg-white rounded-3xl p-4 shadow-lg border border-slate-50 flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95"
          >
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${btn.gradient} text-white flex items-center justify-center mb-3 shadow-lg ${btn.shadow} group-hover:scale-110 transition-transform`}>
              <btn.icon size={24} className="md:w-8 md:h-8" />
            </div>
            <h3 className="text-[11px] font-extrabold text-slate-700 leading-tight uppercase tracking-tighter">{btn.label}</h3>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 pb-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white flex flex-col justify-between relative shadow-2xl overflow-hidden border border-slate-700">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-1">Livestock Summary</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Real-time Portfolio Tracking</p>
            <p className="text-3xl font-black text-white mb-6 tracking-tight">₹{(portfolioStats.totalNetWorth/1000).toFixed(1)}k <span className="text-sm font-bold text-green-400">+12%</span></p>
            <button 
              onClick={() => { setActiveTab('cattle-mgmt'); setMgmtSubTab('Portfolio'); }} 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-black px-6 py-3 rounded-2xl transition-all border border-white/5"
            >
              Detailed Analytics
            </button>
          </div>
          <TrendingUp size={120} className="text-white opacity-5 absolute -right-4 -bottom-4 rotate-12" />
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between relative shadow-2xl overflow-hidden shadow-emerald-200">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-1">Local Fresh Circle</h3>
            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-6">Nearby Producer Connection</p>
            <div className="flex -space-x-3 mb-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-green-500 bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] font-black">
                  U{i}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-green-500 bg-emerald-700 flex items-center justify-center text-[10px] font-black">+12</div>
            </div>
            <button 
              onClick={() => setActiveTab('food-market')} 
              className="bg-white text-emerald-700 text-xs font-black px-6 py-3 rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              Shop Local Market
            </button>
          </div>
          <ShoppingBag size={100} className="text-white opacity-10 absolute -right-4 -bottom-4 rotate-12" />
        </div>
      </div>

      <div className="space-y-10 pb-24">
        <FeaturedHorizontalSection 
          title="Featured Agri Product" 
          category={Category.AGRI_PRODUCE} 
          onViewAll={() => setActiveTab('agri-marketplace')} 
        />
        <FeaturedHorizontalSection 
          title="Featured Cows" 
          category="Cow" 
          onViewAll={() => setActiveTab('cattle-market')} 
        />
        <FeaturedHorizontalSection 
          title="Featured Fertilizer" 
          category={Category.FERTILIZER} 
          onViewAll={() => setActiveTab('agri-marketplace')} 
        />
        <FeaturedHorizontalSection 
          title="Featured Pesticides" 
          category={Category.PESTICIDES} 
          onViewAll={() => setActiveTab('agri-marketplace')} 
        />
        <FeaturedHorizontalSection 
          title="Featured Feeds" 
          category={Category.FEEDS} 
          onViewAll={() => setActiveTab('agri-marketplace')} 
        />
      </div>
    </div>
  );

  const renderFoodMarketplace = () => {
    const filteredFood = MOCK_PRODUCTS.filter(p => 
      p.category === Category.CONSUMABLES && 
      (p.distance === undefined || p.distance <= radiusFilter) &&
      (searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.subType?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    return (
      <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto pb-12 px-2">
        <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 p-6 rounded-[2rem] text-white shadow-xl shadow-amber-50 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black tracking-tight mb-1">Local Fresh Circle</h2>
            <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Nearby Farmers within {radiusFilter}km</p>
          </div>
          <div className="flex flex-col items-end gap-1 relative z-10">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-80">Radius</label>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-3 py-1.5">
              <MapPin size={12} />
              <select 
                value={radiusFilter} 
                onChange={(e) => setRadiusFilter(Number(e.target.value))}
                className="bg-transparent text-[11px] font-black outline-none cursor-pointer"
              >
                {[1, 2, 5, 10, 20, 50].map(r => (
                  <option key={r} value={r} className="text-slate-900">{r} KM</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredFood.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Search size={24} className="text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-black text-slate-800">No local produce found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFood.map(product => (
              <MarketplaceCard 
                key={product.id} 
                product={product} 
                onClick={() => {}} 
                variant="compact" 
                isWishlisted={wishlist.includes(product.id)}
                onWishlistToggle={() => toggleWishlist(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderWishlist = () => {
    const wishlistedItems = MOCK_PRODUCTS.filter(p => wishlist.includes(p.id));
    return (
      <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
        <div className="bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-rose-100 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight mb-2">My Wishlist</h2>
            <p className="text-[11px] font-bold uppercase opacity-80 tracking-[0.3em]">Your favorite cattle, produce & tools</p>
          </div>
          <Heart size={150} className="absolute -right-10 -bottom-10 opacity-10 rotate-12 fill-white" />
        </div>
        
        {wishlistedItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-rose-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Your wishlist is empty</h3>
            <p className="text-slate-400 font-medium">Items you favorite will appear here for quick access.</p>
            <button onClick={() => setActiveTab('hub')} className="mt-8 bg-slate-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all">Explore Marketplace</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistedItems.map(product => (
              <MarketplaceCard 
                key={product.id} 
                product={product} 
                onClick={() => {}} 
                isWishlisted={true}
                onWishlistToggle={() => toggleWishlist(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:pl-64 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Fixed Header */}
      <header className="shrink-0 bg-white/80 backdrop-blur-xl p-4 border-b border-slate-100 md:px-8 z-40">
        <div className="flex items-center justify-between mb-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {activeTab !== 'hub' && (
              <button onClick={() => setActiveTab('hub')} className="p-2 bg-slate-50 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors">
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">
                {activeTab === 'hub' ? 'AgriCattle.in' : 
                 activeTab === 'calculator' ? 'Profit Pro AI' : 
                 activeTab === 'cattle-mgmt' ? 'Herd Command' : 
                 activeTab === 'agri-marketplace' ? 'Produce Hub' : 
                 activeTab === 'cattle-market' ? 'Live Livestock' : 
                 activeTab === 'food-market' ? 'Fresh Circle' : 
                 activeTab === 'machinery-market' ? 'Equip Hub' : 
                 activeTab === 'transport-market' ? 'Logistics Hire' : 
                 activeTab === 'agri-mgmt' ? 'Agri Management' :
                 activeTab === 'wishlist' ? 'My Favorites' : 'Market Center'}
              </h1>
              {activeTab === 'hub' && <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">Smart Farming Network</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`relative p-2 transition-colors ${activeTab === 'wishlist' ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
            >
               <Heart size={20} className={wishlist.length > 0 ? "fill-rose-500 text-rose-500" : ""} />
               {wishlist.length > 0 && (
                 <div className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">{wishlist.length}</div>
               )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-100">JD</div>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by breed, crop, tonnage, or location..." 
            className="w-full bg-slate-100 border-none rounded-[1.25rem] py-3.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-green-400 transition-all font-medium text-slate-700 placeholder:text-slate-400" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
      </header>
      
      {/* Scrollable Main Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
        {activeTab === 'hub' && renderHub()}
        {activeTab === 'agri-mgmt' && renderAgriMgmt()}
        {activeTab === 'calculator' && (
          <div className="max-w-xl mx-auto space-y-8 pb-20 animate-fadeIn">
            <div className="glass-card p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-6">
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                {(['Agri', 'Cattle'] as const).map(s => (
                  <button 
                    key={s} 
                    onClick={() => setCalcSector(s)} 
                    className={`flex-1 py-3 rounded-[1.1rem] text-xs font-black transition-all ${calcSector === s ? 'bg-white text-slate-900 shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {s.toUpperCase()} SECTOR
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Crop/Batch Name</label>
                  <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-bold" placeholder="e.g., Kesar Mango" value={calcInputs.name} onChange={e => setCalcInputs({...calcInputs, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Labor Cost (₹)</label>
                    <input type="number" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" value={calcInputs.labor} onChange={e => setCalcInputs({...calcInputs, labor: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{calcSector === 'Agri' ? 'Seeds' : 'Feed'} (₹)</label>
                    <input type="number" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" value={calcSector === 'Agri' ? calcInputs.seed : calcInputs.feed} onChange={e => setCalcInputs({...calcInputs, [calcSector === 'Agri' ? 'seed' : 'feed']: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Revenue (₹)</label>
                  <input type="number" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-lg font-black text-emerald-600 focus:ring-2 focus:ring-emerald-400 transition-all outline-none" value={calcInputs.revenue} onChange={e => setCalcInputs({...calcInputs, revenue: Number(e.target.value)})} />
                </div>
              </div>
              <button 
                onClick={handleProfitCalculation} 
                disabled={loadingCalc} 
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-black py-4 rounded-[1.25rem] shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                {loadingCalc ? <Sparkles className="animate-spin" /> : <Zap size={20} className="fill-yellow-400 text-yellow-400" />}
                {loadingCalc ? 'RUNNING AI SIMULATION...' : 'PREDICT PROFITABILITY'}
              </button>
            </div>
            {calcResult && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-6 animate-fadeIn relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-800 text-lg tracking-tight">AI Strategy Insight</h4>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${calcResult.profit >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {calcResult.profit >= 0 ? 'HEALTHY MARGIN' : 'RISK DETECTED'}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{calcResult.profit.toLocaleString()}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Projected Net Surplus</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed font-medium relative">
                  <Sparkles size={24} className="absolute -top-3 -right-3 text-yellow-400 fill-yellow-400 opacity-50" />
                  "{calcResult.advice}"
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'cattle-mgmt' && (
          <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fadeIn">
            <div className="flex gap-2 p-1.5 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar max-w-sm mx-auto">
              {(['Portfolio', 'Herd', 'Sheds'] as const).map(tab => (
                <button key={tab} onClick={() => setMgmtSubTab(tab as any)} className={`flex-1 py-3 px-6 rounded-2xl text-[11px] font-black transition-all whitespace-nowrap ${mgmtSubTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{tab.toUpperCase()}</button>
              ))}
            </div>
            {mgmtSubTab === 'Portfolio' && renderPortfolio()}
            {mgmtSubTab === 'Herd' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                 <div className="flex items-center justify-between col-span-full px-2">
                   <h3 className="text-xl font-black text-slate-800">Your Herd Tracking</h3>
                   <button className="bg-green-600 text-white p-2.5 rounded-2xl shadow-lg shadow-green-100 hover:scale-105 active:scale-95 transition-all"><Plus size={20}/></button>
                 </div>
                 {cattleList.map(item => (
                    <div key={item.id} className="bg-white rounded-[2rem] p-6 border border-slate-50 shadow-xl hover:shadow-2xl transition-all group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform duration-500">
                            {item.type === 'Cow' ? <Beef size={32} /> : item.type === 'Horse' ? <TrendingUp size={32} /> : <PawPrint size={32} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5"><h4 className="font-black text-slate-800 text-lg leading-none">{item.tagName}</h4>{item.hasVerifiedReport && <FileCheck size={16} className="text-blue-500" />}</div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.type} • {item.age} MO</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-green-600 leading-none">₹{item.estimatedValue.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                        {item.milkCapacity && (<div className="flex items-center gap-3"><div className="w-9 h-9 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Droplets size={16} /></div><div><p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Yield</p><p className="text-xs font-black">{item.milkCapacity}L</p></div></div>)}
                        {item.calfBirthDate && (<div className="flex items-center gap-3"><div className="w-9 h-9 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"><Baby size={16} /></div><div><p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Born</p><p className="text-xs font-black">{new Date(item.calfBirthDate).toLocaleDateString()}</p></div></div>)}
                        <div className="flex items-start gap-2.5 col-span-2 bg-slate-50 p-4 rounded-2xl"><Stethoscope size={18} className="text-blue-400 shrink-0 mt-0.5" /><p className="text-xs text-slate-600 leading-relaxed"><b>Status:</b> {item.medicalInfo} • <b>Physical:</b> {item.physicalProblems}</p></div>
                      </div>
                    </div>
                 ))}
               </div>
            )}
          </div>
        )}
        {activeTab === 'agri-marketplace' && (
          <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
            <div className="vibrant-gradient-2 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-100 flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black tracking-tight mb-2">Bulk Produce Hub</h2>
                <p className="text-[11px] font-bold uppercase opacity-80 tracking-[0.3em]">Industrial Supply & Export Hub</p>
              </div>
              <button className="bg-white text-emerald-700 px-8 py-4 rounded-[1.25rem] text-sm font-black shadow-2xl active:scale-95 transition-all relative z-10">LIST MY HARVEST</button>
              <Sprout size={150} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1">
              {['All', 'Grains', 'Fruits', 'Vegetables', 'Spices', 'Essentials', 'Herbs', 'Fertilizer', 'Pesticides', 'Feeds'].map(f => (
                <button key={f} onClick={() => setAgriSubFilter(f as any)} className={`px-5 py-2 rounded-xl text-[9px] font-black transition-all shrink-0 border-2 ${agriSubFilter === f ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-300'}`}>{f.toUpperCase()}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {MOCK_PRODUCTS.filter(p => (p.category === Category.AGRI_PRODUCE || p.category === Category.FERTILIZER || p.category === Category.PESTICIDES || p.category === Category.FEEDS) && (agriSubFilter === 'All' || p.subType === agriSubFilter || p.category === agriSubFilter)).map(product => (
                <MarketplaceCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => {}} 
                  isWishlisted={wishlist.includes(product.id)}
                  onWishlistToggle={() => toggleWishlist(product.id)}
                />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'cattle-market' && (
          <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
             <div className="vibrant-gradient-1 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-orange-100 flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black tracking-tight mb-2">Livestock Trading</h2>
                <p className="text-[11px] font-bold uppercase opacity-80 tracking-[0.3em]">Verified Health & Origin Reports</p>
              </div>
              <button className="bg-white text-orange-600 px-8 py-4 rounded-[1.25rem] text-sm font-black shadow-2xl active:scale-95 transition-all relative z-10">SELL ANIMAL</button>
              <Beef size={150} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1">
              {['All', 'Cow', 'Sheep', 'Horse', 'Dog', 'Hens', 'Rabbits', 'Elephant'].map(f => (
                <button key={f} onClick={() => setCattleSubFilter(f as any)} className={`px-5 py-2 rounded-xl text-[9px] font-black transition-all shrink-0 border-2 ${cattleSubFilter === f ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-orange-300'}`}>{f.toUpperCase()}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {MOCK_PRODUCTS.filter(p => (p.category === Category.CATTLE || p.category === Category.PETS) && (cattleSubFilter === 'All' || p.subType === cattleSubFilter)).map(product => (
                <MarketplaceCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => {}} 
                  isWishlisted={wishlist.includes(product.id)}
                  onWishlistToggle={() => toggleWishlist(product.id)}
                />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'food-market' && renderFoodMarketplace()}
        {activeTab === 'wishlist' && renderWishlist()}
      </main>

      {/* Fixed Bottom Navigation */}
      <nav className="shrink-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center h-20 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:hidden rounded-t-[2.5rem]">
        <button onClick={() => setActiveTab('hub')} className={`flex flex-col items-center transition-all ${activeTab === 'hub' ? 'text-green-600 scale-110' : 'text-slate-400'}`}><LayoutDashboard size={24} /><span className="text-[9px] font-black mt-1">HUB</span></button>
        <button onClick={() => setActiveTab('agri-mgmt')} className={`flex flex-col items-center transition-all ${activeTab === 'agri-mgmt' ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}><Wheat size={24} /><span className="text-[9px] font-black mt-1">AGRI</span></button>
        <button onClick={() => setActiveTab('cattle-market')} className={`flex flex-col items-center transition-all ${activeTab === 'cattle-market' ? 'text-orange-500 scale-110' : 'text-slate-400'}`}><Beef size={24} /><span className="text-[9px] font-black mt-1">MARKET</span></button>
        <button onClick={() => setActiveTab('calculator')} className={`flex flex-col items-center transition-all ${activeTab === 'calculator' ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}><Calculator size={24} /><span className="text-[9px] font-black mt-1">AI PRO</span></button>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
