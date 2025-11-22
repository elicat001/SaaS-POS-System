
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../constants';
import { Search, Plus, Download, Upload, MoreHorizontal, Edit, Trash2, QrCode, Image as ImageIcon, Minus, DollarSign } from 'lucide-react';
import QRCodeModal from './QRCodeModal';

// Accept props instead of importing PRODUCTS directly
interface ProductListProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onUpdateProduct }) => {
  const [qrModal, setQrModal] = useState<{isOpen: boolean, title: string, data: string}>({
    isOpen: false,
    title: '',
    data: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  const [editingCostId, setEditingCostId] = useState<string | null>(null);
  const [tempCost, setTempCost] = useState<string>('');

  const handleShowQR = (product: Product) => {
    setQrModal({
      isOpen: true,
      title: '商品二维码',
      data: `https://store.keruyun.clone/product/${product.id}`, // Simulated Deep Link
    });
  };

  const handleImageClick = (productId: string) => {
    setUploadingId(productId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const product = products.find(p => p.id === uploadingId);
        if (product) {
          onUpdateProduct({ ...product, image: reader.result as string });
        }
        setUploadingId(null);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickStockChange = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    onUpdateProduct({ ...product, stock: newStock });
  };

  const startEditCost = (product: Product) => {
    setEditingCostId(product.id);
    setTempCost(product.costPrice?.toString() || '');
  };

  const saveCost = (product: Product) => {
    const newCost = parseFloat(tempCost);
    if (!isNaN(newCost) && newCost >= 0) {
      onUpdateProduct({ ...product, costPrice: newCost });
    }
    setEditingCostId(null);
  };

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      <div className="bg-white p-4 rounded-sm shadow-sm">
         {/* Filters */}
         <div className="flex flex-wrap gap-4 items-end mb-4">
            <div className="flex flex-col gap-1">
               <label className="text-xs text-slate-500">商品名称</label>
               <input type="text" placeholder="商品名称" className="border border-slate-200 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="flex flex-col gap-1">
               <label className="text-xs text-slate-500">售卖方式</label>
               <select className="border border-slate-200 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-emerald-500 text-slate-600">
                 <option>请选择</option>
               </select>
            </div>
            <button className="bg-emerald-500 text-white px-6 py-1.5 rounded text-sm font-medium hover:bg-emerald-600">查询</button>
         </div>

         {/* Actions Bar */}
         <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <div className="flex gap-3">
               <button className="bg-emerald-500 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-emerald-600 flex items-center gap-1">
                 发布新商品
               </button>
               <button className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50">
                 批量发布商品
               </button>
               <button className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50">
                 excel导入
               </button>
               <button className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50">
                 导出
               </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
               <span>商品排序</span>
               <SettingsIcon />
            </div>
         </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
         {/* Tabs */}
         <div className="flex border-b border-slate-200">
            {['全部商品', '在售商品', '已售罄商品', '已下架商品'].map((tab, idx) => (
               <button 
                  key={tab}
                  className={`px-6 py-3 text-sm font-medium ${idx === 1 ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-600 hover:text-emerald-500'}`}
               >
                 {tab}
               </button>
            ))}
         </div>

         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
               <tr>
                  <th className="p-4 w-10"><input type="checkbox" /></th>
                  <th className="p-4">商品名</th>
                  <th className="p-4">价格 & 成本</th>
                  <th className="p-4">所属分类</th>
                  <th className="p-4">库存</th>
                  <th className="p-4">利润率 (估)</th>
                  <th className="p-4">上架</th>
                  <th className="p-4">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {products.map(product => {
                  const profitMargin = product.costPrice && product.price 
                    ? ((product.price - product.costPrice) / product.price * 100).toFixed(0) 
                    : '-';
                  
                  return (
                  <tr key={product.id} className="hover:bg-slate-50 group">
                     <td className="p-4"><input type="checkbox" /></td>
                     <td className="p-4">
                        <div className="flex gap-3">
                           <div 
                              className="w-12 h-12 rounded relative cursor-pointer overflow-hidden bg-slate-100 shrink-0 group/img"
                              onClick={() => handleImageClick(product.id)}
                              title="点击上传图片"
                           >
                              {product.image ? (
                                 <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon size={20} />
                                 </div>
                              )}
                              <div className="absolute inset-0 bg-black/30 hidden group-hover/img:flex items-center justify-center text-white transition-opacity">
                                 <Upload size={16} />
                              </div>
                           </div>
                           
                           <div>
                              <div className="font-medium text-slate-800 line-clamp-1">{product.name}</div>
                              <div className="text-xs text-slate-400">ID: {product.id}1006</div>
                           </div>
                        </div>
                     </td>
                     <td className="p-4">
                        <div className="font-medium text-slate-800">¥{product.price.toFixed(2)}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                           成本: 
                           {editingCostId === product.id ? (
                             <div className="flex items-center gap-1">
                               <input 
                                 autoFocus
                                 className="w-16 border border-emerald-300 rounded px-1 py-0.5 text-xs outline-none"
                                 value={tempCost}
                                 onChange={e => setTempCost(e.target.value)}
                                 onBlur={() => saveCost(product)}
                                 onKeyDown={e => e.key === 'Enter' && saveCost(product)}
                               />
                             </div>
                           ) : (
                             <span 
                               className="cursor-pointer hover:text-emerald-600 hover:underline border-b border-dashed border-slate-300"
                               onClick={() => startEditCost(product)}
                               title="点击修改成本价"
                             >
                               {product.costPrice?.toFixed(2) || '0.00'}
                             </span>
                           )}
                        </div>
                     </td>
                     <td className="p-4 text-slate-600">
                        {CATEGORIES.find(c => c.id === product.categoryId)?.name}
                     </td>
                     <td className="p-4">
                        <div className="flex items-center gap-2">
                           <button 
                              onClick={() => handleQuickStockChange(product, -1)}
                              className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                              disabled={product.stock <= 0}
                           >
                              <Minus size={12} />
                           </button>
                           <span className={`${product.stock <= (product.minStock || 0) ? 'text-red-500 font-bold' : 'text-slate-600 font-medium'} w-8 text-center`}>
                             {product.stock}
                           </span>
                           <button 
                              onClick={() => handleQuickStockChange(product, 1)}
                              className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-emerald-500 hover:border-emerald-200 transition-colors"
                           >
                              <Plus size={12} />
                           </button>
                        </div>
                     </td>
                     <td className="p-4">
                        <div className="flex items-center gap-1">
                           <span className={`text-xs px-2 py-0.5 rounded font-medium ${parseInt(profitMargin) > 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                              {profitMargin}%
                           </span>
                        </div>
                     </td>
                     <td className="p-4">
                        <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${product.isOnShelf ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                           <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${product.isOnShelf ? 'left-[22px]' : 'left-0.5'}`}></div>
                        </div>
                     </td>
                     <td className="p-4">
                        <div className="flex gap-3 text-sm items-center">
                           <span className="text-emerald-500 cursor-pointer hover:underline">编辑</span>
                           <button 
                              onClick={() => handleShowQR(product)}
                              className="text-slate-400 hover:text-slate-600"
                              title="生成二维码"
                           >
                             <QrCode size={16} />
                           </button>
                        </div>
                     </td>
                  </tr>
               )})}
            </tbody>
         </table>
      </div>

      <QRCodeModal 
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal({...qrModal, isOpen: false})}
        title={qrModal.title}
        data={qrModal.data}
        subtext="扫描二维码查看商品详情"
      />
    </div>
  );
};

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
)

export default ProductList;
