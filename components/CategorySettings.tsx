
import React, { useState, useMemo } from 'react';
import { Category, Product } from '../types';
import { CATEGORIES } from '../constants';
import { 
  Search, Plus, Edit, Trash2, GripVertical, Check, X, 
  Coffee, Utensils, Beer, Wine, Cake, Croissant, 
  IceCream, Sandwich, Pizza, Leaf, AlertCircle, Save
} from 'lucide-react';

interface CategorySettingsProps {
  products: Product[];
}

// Extended interface for local state management
interface ExtendedCategory extends Category {
  sortOrder: number;
  isActive: boolean;
}

const AVAILABLE_ICONS = [
  { name: 'LayoutGrid', label: '通用', icon: <div className="w-5 h-5 border-2 border-current rounded-sm grid grid-cols-2 gap-0.5"><div className="bg-current"></div><div className="bg-current"></div><div className="bg-current"></div></div> },
  { name: 'Store', label: '店铺', icon: <div className="w-5 h-5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg></div> },
  { name: 'Gift', label: '福利', icon: <div className="w-5 h-5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg></div> },
  { name: 'Coffee', label: '咖啡', icon: <Coffee size={20} /> },
  { name: 'Cake', label: '蛋糕', icon: <Cake size={20} /> },
  { name: 'Croissant', label: '烘焙', icon: <Croissant size={20} /> },
  { name: 'Dessert', label: '甜点', icon: <IceCream size={20} /> },
  { name: 'Swiss', label: '卷类', icon: <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center text-[8px] font-bold">@</div> },
  { name: 'Beer', label: '酒水', icon: <Beer size={20} /> },
  { name: 'Utensils', label: '热菜', icon: <Utensils size={20} /> },
  { name: 'Pizza', label: '披萨', icon: <Pizza size={20} /> },
  { name: 'Sandwich', label: '轻食', icon: <Sandwich size={20} /> },
  { name: 'Leaf', label: '素食', icon: <Leaf size={20} /> },
];

const CategorySettings: React.FC<CategorySettingsProps> = ({ products }) => {
  // Initialize state with constants, adding local fields
  const [categories, setCategories] = useState<ExtendedCategory[]>(
    CATEGORIES.map((c, index) => ({
      ...c,
      sortOrder: (index + 1) * 10,
      isActive: true
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<ExtendedCategory>({
    id: '',
    name: '',
    icon: 'LayoutGrid',
    sortOrder: 10,
    isActive: true
  });

  // Calculate product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter & Sort
  const filteredCategories = categories
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Handlers
  const handleOpenModal = (category?: ExtendedCategory) => {
    if (category) {
      setEditingId(category.id);
      setFormData({ ...category });
    } else {
      setEditingId(null);
      setFormData({
        id: `c-${Date.now()}`,
        name: '',
        icon: 'LayoutGrid',
        sortOrder: (categories.length + 1) * 10,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      setCategories(prev => prev.map(c => c.id === editingId ? formData : c));
    } else {
      setCategories(prev => [...prev, formData]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (categoryCounts[id] > 0) {
      alert(`无法删除：该分类下还有 ${categoryCounts[id]} 个商品。请先移除商品。`);
      return;
    }
    if (window.confirm('确定要删除此分类吗？')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const getIconComponent = (iconName: string | undefined) => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    return found ? found.icon : <div className="w-5 h-5 bg-slate-200 rounded-sm"></div>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">商品分类设置</h2>
          <p className="text-sm text-slate-500 mt-1">管理前台菜单的分类结构、图标及排序</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="搜索分类" 
               className="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-emerald-500 w-full md:w-64"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={16} /> 新建分类
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-4 w-16 text-center">排序</th>
              <th className="p-4 w-20 text-center">图标</th>
              <th className="p-4">分类名称</th>
              <th className="p-4 text-center">关联商品数</th>
              <th className="p-4 w-32 text-center">状态</th>
              <th className="p-4 w-40 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCategories.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50 group">
                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-2 text-slate-400 cursor-move hover:text-emerald-500">
                    <GripVertical size={16} />
                    <span className="font-mono text-xs">{category.sortOrder}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                    {getIconComponent(category.icon)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-800">{category.name}</div>
                  <div className="text-xs text-slate-400">ID: {category.id}</div>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (categoryCounts[category.id] || 0) > 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {categoryCounts[category.id] || 0} 件
                  </span>
                </td>
                <td className="p-4 text-center">
                   <button 
                     onClick={() => handleToggleStatus(category.id)}
                     className={`relative w-11 h-6 transition-colors rounded-full focus:outline-none ${category.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                   >
                      <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${category.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                   </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded" 
                      title="编辑"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded" 
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400">
                  没有找到相关分类
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">{editingId ? '编辑分类' : '新建分类'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-5">
               {/* Name */}
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">分类名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-emerald-500"
                    placeholder="例如：招牌热卖"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    autoFocus
                  />
               </div>

               {/* Sort Order */}
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">排序权重</label>
                  <div className="flex items-center gap-2">
                     <input 
                        type="number" 
                        className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-emerald-500"
                        placeholder="数字越小越靠前"
                        value={formData.sortOrder}
                        onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                     />
                     <span className="text-xs text-slate-400 whitespace-nowrap">越小越靠前</span>
                  </div>
               </div>

               {/* Icon Selection */}
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">选择图标</label>
                  <div className="grid grid-cols-5 gap-2 border border-slate-100 rounded-lg p-3 bg-slate-50">
                     {AVAILABLE_ICONS.map(icon => (
                        <div 
                          key={icon.name}
                          onClick={() => setFormData({...formData, icon: icon.name})}
                          className={`
                             aspect-square rounded flex flex-col items-center justify-center cursor-pointer transition-all border
                             ${formData.icon === icon.name 
                               ? 'bg-emerald-100 border-emerald-500 text-emerald-600' 
                               : 'bg-white border-transparent hover:border-emerald-200 hover:shadow-sm text-slate-500'}
                          `}
                        >
                           {icon.icon}
                           <span className="text-[10px] mt-1 scale-90">{icon.label}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Status */}
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-sm font-medium text-slate-700">是否启用</span>
                  <button 
                     onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                     className={`relative w-11 h-6 transition-colors rounded-full focus:outline-none ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                      <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
               </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
               <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
               <button onClick={handleSave} className="px-6 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600 shadow-sm">
                  {editingId ? '保存修改' : '立即创建'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySettings;
