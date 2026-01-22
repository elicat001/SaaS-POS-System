
import React, { useState, useMemo } from 'react';
import { Product, CartItem, Table } from '../types';
import { CATEGORIES } from '../constants';
import { Search, Maximize2, ShoppingCart, Trash2, Wallet, CreditCard } from 'lucide-react';

interface POSProps {
  tables: Table[];
  products: Product[]; // New Prop
  onPlaceOrder: (tableId: string, items: CartItem[], total: number) => void;
}

const POS: React.FC<POSProps> = ({ tables, products, onPlaceOrder }) => {
  const [activeTab, setActiveTab] = useState('DINE_IN'); 
  const [selectedCategory, setSelectedCategory] = useState<string>('c1');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableInput, setTableInput] = useState('');

  const filteredProducts = useMemo(() => {
    let prods = products; // Use dynamic products
    if (selectedCategory && selectedCategory !== 'c1') {
      prods = prods.filter(p => p.categoryId === selectedCategory);
    }
    if (searchQuery) {
      prods = prods.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return prods;
  }, [products, selectedCategory, searchQuery]);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return; // Prevent adding out of stock

    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Check stock limit
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const maxStock = product ? product.stock : 9999;
        const newQty = item.quantity + delta;
        
        if (newQty > maxStock) return item; // Cap at stock
        return { ...item, quantity: Math.max(0, newQty) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handlePlaceOrderClick = () => {
      if(cart.length === 0) return;
      onPlaceOrder(tableInput || 'Quick', cart, cartTotal);
      setCart([]);
      setTableInput('');
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-slate-50 gap-4 -m-6 p-4">
      
      {/* LEFT PANEL - Order Configuration & Cart */}
      <div className="w-[360px] bg-white flex flex-col shadow-sm rounded-lg overflow-hidden border border-slate-200">
        
        <div className="p-4 pb-2">
           <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded font-medium text-sm transition-colors mb-4">
             选择用户
           </button>
           
           <div className="flex border rounded overflow-hidden border-emerald-500 text-xs font-medium mb-4">
              <button 
                className={`flex-1 py-1.5 ${activeTab === 'DINE_IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-600'}`}
                onClick={() => setActiveTab('DINE_IN')}
              >
                堂食
              </button>
              <button 
                className={`flex-1 py-1.5 border-l border-emerald-200 ${activeTab === 'SELF_PICKUP' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-600'}`}
                onClick={() => setActiveTab('SELF_PICKUP')}
              >
                自取
              </button>
              <button 
                className={`flex-1 py-1.5 border-l border-emerald-200 ${activeTab === 'DELIVERY' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-600'}`}
                onClick={() => setActiveTab('DELIVERY')}
              >
                配送
              </button>
           </div>

           <div className="flex gap-2 mb-2">
             <input 
               type="text" 
               placeholder="桌台号/取餐号" 
               className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
               value={tableInput}
               onChange={e => setTableInput(e.target.value)}
             />
             <button 
               onClick={() => {setCart([]); setTableInput('');}}
               className="px-4 text-sm text-slate-600 hover:text-red-500"
             >
               清空
             </button>
           </div>
        </div>

        {/* Cart List */}
        <div className="flex-1 overflow-y-auto border-t border-slate-100 bg-[#f8fafc]">
          {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <ShoppingCart size={40} className="mb-2 text-slate-300" />
               <span className="text-xs">点餐列表为空</span>
             </div>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white border-b border-slate-100">
                   <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{item.name}</div>
                      <div className="text-xs text-slate-500">¥{item.price}</div>
                   </div>
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100"
                      >-</button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= (products.find(p => p.id === item.id)?.stock || 0)}
                        className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >+</button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-slate-200 bg-white p-3">
           <div className="flex justify-between items-center mb-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="print" />
                <label htmlFor="print">打印制作单</label>
              </div>
              <div className="font-bold text-lg text-slate-800">
                 共{cart.reduce((a,b)=>a+b.quantity, 0)}件 ¥{cartTotal.toFixed(2)}
              </div>
           </div>
           
           <div className="grid grid-cols-3 gap-2">
              <button onClick={handlePlaceOrderClick} className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded text-xs flex flex-col items-center justify-center gap-1 h-12">
                 <Wallet size={16} />
                 微信/支付宝
              </button>
              <button onClick={handlePlaceOrderClick} className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded text-xs flex flex-col items-center justify-center gap-1 h-12">
                 <CreditCard size={16} />
                 现金
              </button>
              <button onClick={handlePlaceOrderClick} className="border border-slate-200 hover:bg-slate-50 text-slate-600 py-2 rounded text-xs flex flex-col items-center justify-center gap-1 h-12">
                 更多支付
              </button>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL - Product Selection */}
      <div className="flex-1 bg-white flex flex-col shadow-sm rounded-lg overflow-hidden border border-slate-200">
        {/* Top Bar */}
        <div className="h-14 border-b border-slate-200 flex items-center px-4 justify-between">
           <h2 className="font-bold text-lg text-slate-800">代客下单</h2>
           <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded">先付费</span>
              <button className="p-2 hover:bg-slate-100 rounded"><Maximize2 size={16} className="text-slate-500" /></button>
           </div>
        </div>
        
        {/* Search Bar */}
        <div className="p-3 border-b border-slate-200 flex gap-3">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
                type="text" 
                placeholder="搜索全部商品"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
           {/* Categories Nav (Tabs Style) */}
           <div className="w-full h-full flex flex-col">
              <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide bg-white">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`
                        px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                        ${selectedCategory === cat.id 
                          ? 'border-emerald-500 text-emerald-600 bg-emerald-50/30' 
                          : 'border-transparent text-slate-600 hover:text-emerald-500 hover:bg-slate-50'}
                      `}
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProducts.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className={`
                          group cursor-pointer bg-white rounded-lg overflow-hidden border hover:shadow-md transition-all relative
                          ${product.stock <= 0 ? 'border-slate-200 opacity-70 grayscale' : 'border-slate-200 hover:border-emerald-400'}
                        `}
                      >
                         {/* Image */}
                         <div className="aspect-square bg-slate-200 relative">
                           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                             <span className={`text-xs font-bold ${product.stock <= 0 ? 'text-red-300' : 'text-white'}`}>
                               {product.stock <= 0 ? '已售罄' : `剩${product.stock}${product.unit}`}
                             </span>
                           </div>
                         </div>
                         
                         {/* Info */}
                         <div className="p-2">
                            <h3 className="text-xs font-medium text-slate-800 line-clamp-2 h-8 mb-1">{product.name}</h3>
                            <div className="flex items-center justify-between">
                               <span className="font-bold text-slate-900">¥{product.price.toFixed(2)}</span>
                            </div>
                         </div>

                         {/* Hover Add */}
                         {product.stock > 0 && (
                           <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                 <span className="text-xl font-bold">+</span>
                              </div>
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
