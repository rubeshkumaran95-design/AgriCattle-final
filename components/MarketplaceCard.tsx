
import React from 'react';
import { Product } from '../types';
import { MapPin, User, ArrowRight, ShieldCheck, Navigation, Droplets, Baby, Heart, Layers, Weight, ShoppingCart, Clock, Zap } from 'lucide-react';

interface MarketplaceCardProps {
  product: Product;
  onClick: () => void;
  variant?: 'default' | 'compact';
  isWishlisted?: boolean;
  onWishlistToggle?: (e: React.MouseEvent) => void;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ 
  product, 
  onClick, 
  variant = 'default',
  isWishlisted = false,
  onWishlistToggle
}) => {
  const isLivestock = product.category === 'Cattle' || product.category === 'Pets' || product.category === 'Poultry';
  const isMachinery = product.category === 'Machinery';
  const isHire = product.category === 'Hire/Logistics';
  
  if (variant === 'compact') {
    return (
      <div 
        className="bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-slate-100 group flex flex-col h-full hover:scale-[1.02] active:scale-[0.98]"
        onClick={onClick}
      >
        <div className="relative h-34 w-full overflow-hidden shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.isFeatured && (
            <div className="absolute top-2 right-2">
              <span className="bg-yellow-400 text-yellow-900 p-1.5 rounded-lg shadow-sm">
                <Zap size={11} className="fill-current" />
              </span>
            </div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle?.(e);
            }}
            className="absolute top-2 left-2 p-1.5 bg-white/40 backdrop-blur-md rounded-lg text-white hover:bg-white/60 transition-colors"
          >
            <Heart size={12} className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"} />
          </button>
          {product.subType && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-white/90 text-slate-800 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-sm">
                {product.subType}
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-black text-slate-800 text-[12px] leading-tight line-clamp-1 tracking-tight mb-1">{product.name}</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-slate-900 font-black text-base">₹{product.price.toLocaleString()}</span>
            {product.unit && <span className="text-[9px] text-slate-400 font-bold uppercase">/{product.unit}</span>}
          </div>
          
          <div className="mt-auto space-y-1.5">
            {product.totalStock && (
              <div className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                <Weight size={9} /> {product.totalStock}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 truncate">
              <MapPin size={9} /> {product.location}
            </div>
          </div>
          <button className="mt-3 w-full bg-slate-900 text-white font-black py-2 rounded-xl text-[9px] uppercase tracking-widest flex items-center justify-center gap-1">
            View <ArrowRight size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-slate-50 group flex flex-col h-full hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="relative h-44 md:h-52 w-full overflow-hidden shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isBulk && (
            <span className="bg-orange-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-orange-900/20">
              <Layers size={10} /> BULK SUPPLY
            </span>
          )}
          {(isMachinery || isHire) && product.listingType === 'Rental' && (
            <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-900/20">
              <Clock size={10} /> FOR HIRE
            </span>
          )}
          {(isMachinery || isHire) && product.listingType === 'Service' && (
            <span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-900/20">
              <Zap size={10} /> SERVICE
            </span>
          )}
          {product.distance !== undefined && (
            <span className="bg-slate-900/60 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Navigation size={10} className="fill-white" /> {product.distance} KM
            </span>
          )}
          {product.isFarmerVerified && (
            <span className="bg-emerald-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-900/20">
              <ShieldCheck size={10} /> VERIFIED
            </span>
          )}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.(e);
          }}
          className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 transition-colors z-10"
        >
          <Heart size={16} className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"} />
        </button>

        {product.subType && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/95 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
              {product.subType}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-col mb-4">
          <h3 className="font-black text-slate-800 text-lg leading-tight line-clamp-2 tracking-tight group-hover:text-green-600 transition-colors min-h-[3rem]">{product.name}</h3>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-slate-900 font-black text-xl tracking-tighter">
              ₹{product.price.toLocaleString()}
            </span>
            {product.rateInfo ? (
              <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase ml-1">{product.rateInfo}</span>
            ) : product.unit && (
              <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">/ {product.unit}</span>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-6 mt-auto">
          {product.totalStock && (
            <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-black bg-emerald-50/80 px-4 py-2 rounded-2xl border border-emerald-100/50">
              <Weight size={12} className="fill-emerald-600" /> STOCK: {product.totalStock}
            </div>
          )}

          {product.minOrderQuantity && (
            <div className="flex items-center gap-2 text-[10px] text-orange-600 font-black bg-orange-50/80 px-4 py-2 rounded-2xl border border-orange-100/50">
              <ShoppingCart size={12} /> MIN ORDER: {product.minOrderQuantity}
            </div>
          )}

          {isLivestock && product.milkCapacity && (
            <div className="flex items-center gap-2 text-[10px] text-blue-600 font-black bg-blue-50/80 px-4 py-2 rounded-2xl border border-blue-100/50">
              <Droplets size={12} className="fill-blue-600" /> {product.milkCapacity}L / DAILY
            </div>
          )}
          
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                <User size={14} className="text-slate-400" />
              </div>
              <span className="truncate">{product.seller}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                <MapPin size={14} className="text-slate-400" />
              </div>
              <span className="truncate">{product.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <button className="bg-slate-900 text-white font-black py-4 rounded-2xl text-[11px] flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-widest">
            {product.listingType === 'Service' ? 'Book Now' : product.listingType === 'Rental' ? 'Hire' : 'Buy Now'} <ArrowRight size={14} />
          </button>
          
          <button className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-black py-4 rounded-2xl text-[11px] flex items-center justify-center gap-2 border border-slate-100 uppercase tracking-widest">
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCard;
