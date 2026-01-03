
import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Beef, 
  Sprout, 
  Wrench, 
  ClipboardList, 
  Calculator, 
  Bell,
  Settings,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'hub', label: 'Hub', icon: LayoutDashboard },
    { id: 'cattle-market', label: 'Marketplace', icon: Store },
    { id: 'food-market', label: 'Fresh Market', icon: ShoppingBag },
    { id: 'agri-mgmt', label: 'Agri Pro', icon: Sprout },
    { id: 'cattle-mgmt', label: 'Herd Mgmt', icon: Beef },
    { id: 'machinery', label: 'Machines', icon: Wrench },
    { id: 'calculator', label: 'AI Profit', icon: Calculator },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-100 flex flex-col fixed left-0 top-0 hidden md:flex z-50 shadow-sm">
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800 leading-none">AgriCattle.in</h1>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Smart Farm</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold shadow-md shadow-green-100 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-green-600 font-medium'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-50">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-green-600 w-full rounded-2xl transition-colors font-semibold">
          <Settings size={20} />
          <span>Control Panel</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
