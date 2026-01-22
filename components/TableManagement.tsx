
import React, { useState } from 'react';
import { INITIAL_TABLES, MOCK_RESERVATIONS } from '../constants';
import { Table, TableStatus, Reservation, ReservationStatus } from '../types';
import { Search, Plus, Maximize, MoreHorizontal, Calendar, Clock, Users, X, Printer, Wallet, RefreshCw, Trash2 } from 'lucide-react';

const TableManagement: React.FC = () => {
  // --- Main State ---
  const [viewMode, setViewMode] = useState<'map' | 'reservations'>('map');
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [areas, setAreas] = useState<string[]>(['大厅', '包厢', '露台']);
  const [activeArea, setActiveArea] = useState<string>('ALL');
  
  // --- Modal Visibility States ---
  const [modals, setModals] = useState({
    reservation: false,
    addTable: false,
    settings: false,
    openTable: false,
    order: false
  });

  // --- Active Selection States ---
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  
  // --- Form States ---
  const [newRes, setNewRes] = useState<Partial<Reservation>>({
    customerName: '', customerPhone: '', guests: 2, tableId: '', reservationTime: '', notes: ''
  });
  
  const [newTable, setNewTable] = useState<{name: string; capacity: number; area: string}>({
    name: '', capacity: 4, area: '大厅'
  });

  const [guestCount, setGuestCount] = useState<number>(2);
  const [newAreaName, setNewAreaName] = useState('');

  // --- Handlers ---

  // 1. Reservation Handlers
  const handleOpenResModal = (tableId?: string) => {
    setNewRes({
      customerName: '', customerPhone: '', guests: 2, tableId: tableId || '', reservationTime: '', notes: ''
    });
    setModals(prev => ({...prev, reservation: true}));
  };

  const handleAddReservation = () => {
    if (!newRes.customerName || !newRes.reservationTime || !newRes.tableId) return;
    const res: Reservation = {
      id: `res-${Date.now()}`,
      tableId: newRes.tableId!,
      customerName: newRes.customerName!,
      customerPhone: newRes.customerPhone || '',
      reservationTime: newRes.reservationTime!,
      guests: newRes.guests || 2,
      status: ReservationStatus.CONFIRMED,
      notes: newRes.notes
    };
    setReservations([...reservations, res]);
    setModals(prev => ({...prev, reservation: false}));
  };

  // 2. Table Management Handlers
  const handleAddTable = (keepOpen: boolean = false) => {
    if(!newTable.name.trim()) return;
    
    // Validation: Check for duplicates
    if (tables.some(t => t.name === newTable.name.trim())) {
        alert('该桌台名称已存在，请使用其他名称');
        return;
    }

    const table: Table = {
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: newTable.name.trim(),
      status: TableStatus.AVAILABLE,
      capacity: newTable.capacity,
      area: newTable.area
    };
    
    setTables(prev => [...prev, table]);
    
    if (keepOpen) {
        // Auto-increment logic for easier bulk entry
        const match = newTable.name.match(/(\d+)$/);
        if (match) {
            const numberStr = match[1];
            const number = parseInt(numberStr, 10) + 1;
            // Pad with leading zeros if original had them
            const newNumberStr = number.toString().padStart(numberStr.length, '0');
            const newName = newTable.name.substring(0, match.index) + newNumberStr;
            setNewTable(prev => ({ ...prev, name: newName }));
        } else {
            // If no number, just clear name but keep other settings
            setNewTable(prev => ({ ...prev, name: '' }));
        }
    } else {
        setModals(prev => ({...prev, addTable: false}));
        // Reset, but keep the area as it's likely the next table is in the same area
        setNewTable(prev => ({name: '', capacity: 4, area: prev.area}));
    }
  };

  // 3. Area Management Handlers
  const handleAddArea = () => {
    if(!newAreaName || areas.includes(newAreaName)) return;
    setAreas([...areas, newAreaName]);
    setNewAreaName('');
  };
  
  const handleDeleteArea = (area: string) => {
    setAreas(areas.filter(a => a !== area));
  };

  // 4. Open Table Handlers
  const promptOpenTable = (table: Table) => {
    setActiveTable(table);
    setGuestCount(table.capacity); // Default to capacity
    setModals(prev => ({...prev, openTable: true}));
  };

  const confirmOpenTable = () => {
    if(!activeTable) return;
    setTables(tables.map(t => t.id === activeTable.id ? {...t, status: TableStatus.UNPAID} : t));
    setModals(prev => ({...prev, openTable: false}));
    setActiveTable(null);
  };

  // 5. Order Actions Handlers
  const promptOrderDetails = (table: Table) => {
    setActiveTable(table);
    setModals(prev => ({...prev, order: true}));
  };

  const handleSettleOrder = () => {
    if(!activeTable) return;
    setTables(tables.map(t => t.id === activeTable.id ? {...t, status: TableStatus.PAID} : t));
    setModals(prev => ({...prev, order: false}));
    setActiveTable(null);
  };

  const handleClearTable = () => {
    if(!activeTable) return;
    setTables(tables.map(t => t.id === activeTable.id ? {...t, status: TableStatus.AVAILABLE} : t));
    setModals(prev => ({...prev, order: false}));
    setActiveTable(null);
  };

  // Helpers
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'border-slate-200 hover:border-emerald-400';
      case TableStatus.SCANNED: return 'border-blue-400 bg-blue-50';
      case TableStatus.UNPAID: return 'border-red-400 bg-red-50';
      case TableStatus.PAID: return 'border-amber-400 bg-amber-50';
      default: return 'border-slate-200';
    }
  };

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'bg-emerald-500';
      case TableStatus.SCANNED: return 'bg-blue-600';
      case TableStatus.UNPAID: return 'bg-red-500';
      case TableStatus.PAID: return 'bg-amber-500';
    }
  };

  const getResStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED: return <span className="px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-600">已确认</span>;
      case ReservationStatus.PENDING: return <span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-600">待确认</span>;
      case ReservationStatus.ARRIVED: return <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-600">已到店</span>;
      case ReservationStatus.CANCELLED: return <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-500">已取消</span>;
    }
  };

  // Filter tables
  const displayedTables = activeArea === 'ALL' ? tables : tables.filter(t => t.area === activeArea);

  return (
    <div className="space-y-4 relative">
      {/* Header */}
      <div className="bg-white p-4 rounded-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-4 text-lg font-bold text-slate-800">
            桌台管理 <Maximize size={16} className="text-slate-400 hidden md:block" />
            <div className="flex bg-slate-100 rounded-lg p-1 text-sm font-medium">
               <button 
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-1 rounded-md transition-all ${viewMode === 'map' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 地图模式
               </button>
               <button 
                  onClick={() => setViewMode('reservations')}
                  className={`px-4 py-1 rounded-md transition-all ${viewMode === 'reservations' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 预订管理
               </button>
            </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input type="text" placeholder={viewMode === 'reservations' ? "搜索预约人/手机号" : "搜索桌台"} className="pl-9 pr-4 py-1.5 border border-slate-200 rounded text-sm w-full md:w-64 focus:outline-none focus:border-emerald-500" />
            </div>
            {viewMode === 'reservations' ? (
               <button onClick={() => handleOpenResModal()} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1">
                  <Plus size={16} /> 新增预订
               </button>
            ) : (
               <button onClick={() => setModals(p => ({...p, addTable: true}))} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1">
                  <Plus size={16} /> 添加桌台
               </button>
            )}
            <button onClick={() => setModals(p => ({...p, settings: true}))} className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50">
               设置
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-sm shadow-sm min-h-[600px]">
         
         {/* TABLE MAP VIEW */}
         {viewMode === 'map' && (
            <>
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                 <button 
                    onClick={() => setActiveArea('ALL')}
                    className={`px-4 py-1 text-sm font-medium rounded transition-all ${activeArea === 'ALL' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                 >
                    全部区域
                 </button>
                 {areas.map(area => (
                    <button 
                       key={area}
                       onClick={() => setActiveArea(area)}
                       className={`px-4 py-1 text-sm font-medium rounded transition-all ${activeArea === area ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                    >
                       {area}
                    </button>
                 ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-sm mb-8 border-b border-slate-100 pb-4">
                 <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded font-medium">全部({tables.length})</div>
                 <div className="flex items-center gap-2 text-slate-600"><span className="w-3 h-3 rounded-sm bg-emerald-500"></span> 空闲中</div>
                 <div className="flex items-center gap-2 text-slate-600"><span className="w-3 h-3 rounded-sm bg-blue-600"></span> 已扫码</div>
                 <div className="flex items-center gap-2 text-slate-600"><span className="w-3 h-3 rounded-sm bg-red-500"></span> 未结账</div>
                 <div className="flex items-center gap-2 text-slate-600"><span className="w-3 h-3 rounded-sm bg-amber-500"></span> 已结账</div>
                 <div className="flex items-center gap-2 text-slate-600 ml-4 border-l pl-4"><span className="w-3 h-3 rounded-full bg-purple-500"></span> 有预订</div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                 {displayedTables.map(table => {
                    const hasReservation = reservations.some(r => r.tableId === table.id && r.status === ReservationStatus.CONFIRMED);
                    return (
                      <div key={table.id} className={`border-2 rounded-xl overflow-hidden bg-white shadow-sm group transition-all hover:shadow-md ${getStatusColor(table.status)}`}>
                         <div className={`h-9 flex items-center justify-between px-3 text-white text-sm font-medium ${getStatusBadge(table.status)}`}>
                            <span>{table.name}号桌</span>
                            <div className="flex gap-2">
                               {hasReservation && <Calendar size={14} className="text-white animate-pulse" />}
                               <MoreHorizontal size={16} className="cursor-pointer opacity-80 hover:opacity-100" />
                            </div>
                         </div>
                         <div className="p-4 flex flex-col items-center justify-center min-h-[100px]">
                            {table.status === TableStatus.AVAILABLE ? (
                               <div className="text-center w-full">
                                  <div className="text-xs text-slate-400 mb-3 flex items-center justify-center gap-1">
                                     <Users size={12} /> {table.capacity}人座 {table.area && ` · ${table.area}`}
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                       onClick={() => promptOpenTable(table)}
                                       className="flex-1 bg-emerald-50 text-emerald-600 border border-emerald-200 py-1.5 rounded text-xs font-medium hover:bg-emerald-100 transition-colors"
                                    >
                                       开台
                                    </button>
                                    <button 
                                      onClick={() => handleOpenResModal(table.id)}
                                      className="flex-1 bg-white text-slate-600 border border-slate-200 py-1.5 rounded text-xs font-medium hover:bg-slate-50 hover:text-emerald-500 transition-colors"
                                    >
                                       预订
                                    </button>
                                  </div>
                                  {hasReservation && (
                                     <div className="mt-2 text-[10px] text-purple-600 bg-purple-50 px-2 py-1 rounded text-center">
                                        今日有预订
                                     </div>
                                  )}
                               </div>
                            ) : (
                               <div className="text-center w-full">
                                  <div className="text-lg font-bold text-slate-700 mb-1">
                                     {table.status === TableStatus.PAID ? <span className="text-emerald-500">已结账</span> : '¥ 185.00'}
                                  </div>
                                  <div className="text-xs text-slate-400 mb-3">00:24:15</div>
                                  <button 
                                     onClick={() => promptOrderDetails(table)}
                                     className="bg-slate-50 text-slate-600 border border-slate-200 w-full py-1.5 rounded text-xs font-medium hover:bg-slate-100 transition-colors"
                                  >
                                     查看订单
                                  </button>
                               </div>
                            )}
                         </div>
                      </div>
                    );
                 })}
                 {displayedTables.length === 0 && (
                    <div className="col-span-full text-center py-20 text-slate-400">
                       该区域暂无桌台，请切换区域或添加桌台
                    </div>
                 )}
              </div>
            </>
         )}

         {/* RESERVATION LIST VIEW */}
         {viewMode === 'reservations' && (
            <div className="animate-in fade-in duration-300">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-600">
                    <tr>
                       <th className="p-4 font-medium">预订时间</th>
                       <th className="p-4 font-medium">客户信息</th>
                       <th className="p-4 font-medium">人数</th>
                       <th className="p-4 font-medium">预订桌台</th>
                       <th className="p-4 font-medium">状态</th>
                       <th className="p-4 font-medium">备注</th>
                       <th className="p-4 font-medium text-right">操作</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {reservations.map(res => (
                       <tr key={res.id} className="hover:bg-slate-50">
                          <td className="p-4">
                             <div className="flex items-center gap-2">
                                <Clock size={16} className="text-slate-400" />
                                <span className="font-medium text-slate-700">
                                   {new Date(res.reservationTime).toLocaleString('zh-CN', {month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'})}
                                </span>
                             </div>
                          </td>
                          <td className="p-4">
                             <div>
                                <div className="font-medium text-slate-800">{res.customerName}</div>
                                <div className="text-xs text-slate-400">{res.customerPhone}</div>
                             </div>
                          </td>
                          <td className="p-4 text-slate-600">{res.guests}人</td>
                          <td className="p-4">
                             <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                                {tables.find(t => t.id === res.tableId)?.name}号桌
                             </span>
                          </td>
                          <td className="p-4">
                             {getResStatusBadge(res.status)}
                          </td>
                          <td className="p-4 text-slate-500 text-xs truncate max-w-[150px]">{res.notes || '-'}</td>
                          <td className="p-4 text-right">
                             <div className="flex justify-end gap-3">
                                {res.status === ReservationStatus.PENDING && (
                                   <button className="text-emerald-500 hover:bg-emerald-50 px-2 py-1 rounded transition-colors">确认</button>
                                )}
                                <button className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors">编辑</button>
                                {res.status !== ReservationStatus.CANCELLED && (
                                   <button className="text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors">取消</button>
                                )}
                             </div>
                          </td>
                       </tr>
                    ))}
                    {reservations.length === 0 && (
                       <tr><td colSpan={7} className="p-12 text-center text-slate-400">暂无预订记录</td></tr>
                    )}
                 </tbody>
              </table>
            </div>
         )}
      </div>

      {/* ---------------- MODALS ---------------- */}

      {/* Add Reservation Modal */}
      {modals.reservation && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">新增预订</h3>
                  <button onClick={() => setModals(p => ({...p, reservation: false}))} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
               </div>
               <div className="p-6 space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">客户姓名 <span className="text-red-500">*</span></label>
                     <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:border-emerald-500"
                           placeholder="请输入姓名" value={newRes.customerName} onChange={e => setNewRes({...newRes, customerName: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
                     <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:border-emerald-500"
                           placeholder="请输入手机号" value={newRes.customerPhone} onChange={e => setNewRes({...newRes, customerPhone: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">预订时间 <span className="text-red-500">*</span></label>
                        <input type="datetime-local" className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-slate-600"
                           value={newRes.reservationTime} onChange={e => setNewRes({...newRes, reservationTime: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">人数</label>
                        <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded"
                           value={newRes.guests} onChange={e => setNewRes({...newRes, guests: parseInt(e.target.value)})} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">选择桌台 <span className="text-red-500">*</span></label>
                     <select className="w-full px-3 py-2 border border-slate-200 rounded bg-white"
                        value={newRes.tableId} onChange={e => setNewRes({...newRes, tableId: e.target.value})}>
                        <option value="">请选择桌台</option>
                        {tables.map(t => (<option key={t.id} value={t.id}>{t.name}号桌 ({t.capacity}人)</option>))}
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">备注信息</label>
                     <textarea className="w-full px-3 py-2 border border-slate-200 rounded h-20 resize-none"
                        placeholder="如有特殊需求请备注" value={newRes.notes} onChange={e => setNewRes({...newRes, notes: e.target.value})}></textarea>
                  </div>
               </div>
               <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setModals(p => ({...p, reservation: false}))} className="px-4 py-2 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-100">取消</button>
                  <button onClick={handleAddReservation} className="px-6 py-2 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600">确定预订</button>
               </div>
            </div>
         </div>
      )}

      {/* Add Table Modal */}
      {modals.addTable && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">添加桌台</h3>
                  <button onClick={() => setModals(p => ({...p, addTable: false}))} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
               </div>
               <div className="p-6 space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">桌台名称/号码 <span className="text-red-500">*</span></label>
                     <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:border-emerald-500"
                        placeholder="如：A01" 
                        value={newTable.name} 
                        autoFocus
                        onChange={e => setNewTable({...newTable, name: e.target.value})}
                        onKeyDown={e => e.key === 'Enter' && handleAddTable(false)}
                     />
                     <p className="text-[10px] text-slate-400 mt-1">支持批量添加时自动递增数字后缀 (例: A01 &rarr; A02)</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">所属区域</label>
                     <select className="w-full px-3 py-2 border border-slate-200 rounded bg-white"
                        value={newTable.area} onChange={e => setNewTable({...newTable, area: e.target.value})}>
                        {areas.map(a => <option key={a} value={a}>{a}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">容纳人数</label>
                     <div className="flex items-center gap-3">
                        <button onClick={() => setNewTable(p => ({...p, capacity: Math.max(1, p.capacity-1)}))} className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">-</button>
                        <span className="w-12 text-center font-medium">{newTable.capacity}</span>
                        <button onClick={() => setNewTable(p => ({...p, capacity: p.capacity+1}))} className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50">+</button>
                     </div>
                  </div>
               </div>
               <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center gap-2">
                  <button onClick={() => setModals(p => ({...p, addTable: false}))} className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700">取消</button>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => handleAddTable(true)} 
                        className="px-3 py-2 border border-emerald-500 text-emerald-600 rounded text-sm font-medium hover:bg-emerald-50 transition-colors"
                     >
                        保存并继续
                     </button>
                     <button 
                        onClick={() => handleAddTable(false)} 
                        className="px-4 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600 shadow-sm shadow-emerald-200 transition-colors"
                     >
                        确认添加
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Settings Modal (Area Management) */}
      {modals.settings && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">桌台设置</h3>
                  <button onClick={() => setModals(p => ({...p, settings: false}))} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
               </div>
               <div className="p-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">区域管理</h4>
                  <div className="flex gap-2 mb-4">
                     <input 
                        type="text" 
                        className="flex-1 px-3 py-2 border border-slate-200 rounded text-sm" 
                        placeholder="输入新区域名称"
                        value={newAreaName}
                        onChange={e => setNewAreaName(e.target.value)}
                     />
                     <button onClick={handleAddArea} className="px-4 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600">添加</button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                     {areas.map(area => (
                        <div key={area} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100 group">
                           <span className="text-sm text-slate-700">{area}</span>
                           <button onClick={() => handleDeleteArea(area)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={16} />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Open Table Modal */}
      {modals.openTable && activeTable && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xs overflow-hidden animate-in zoom-in duration-200">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 text-center">
                  <h3 className="font-bold text-slate-800">{activeTable.name}号桌 开台</h3>
               </div>
               <div className="p-8 flex flex-col items-center">
                  <label className="text-sm text-slate-500 mb-4">请确认就餐人数</label>
                  <div className="flex items-center gap-4 mb-6">
                     <button onClick={() => setGuestCount(Math.max(1, guestCount-1))} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl hover:bg-slate-50">-</button>
                     <span className="text-3xl font-bold text-slate-800 w-12 text-center">{guestCount}</span>
                     <button onClick={() => setGuestCount(guestCount+1)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xl hover:bg-slate-50">+</button>
                  </div>
                  <button onClick={confirmOpenTable} className="w-full py-2 bg-emerald-500 text-white rounded font-medium hover:bg-emerald-600 shadow-md shadow-emerald-200">
                     立即开台
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Order Details / Checkout Modal */}
      {modals.order && activeTable && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <div>
                     <h3 className="font-bold text-slate-800 text-lg">{activeTable.name}号桌 订单详情</h3>
                     <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>{new Date().toLocaleString()}</span>
                        <span className={`px-1.5 py-0.5 rounded ${getStatusBadge(activeTable.status)} text-white`}>
                           {activeTable.status === 'UNPAID' ? '未结账' : '已结账'}
                        </span>
                     </div>
                  </div>
                  <button onClick={() => setModals(p => ({...p, order: false}))} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                  <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-6">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                           <tr>
                              <th className="p-3">商品名称</th>
                              <th className="p-3 text-center">数量</th>
                              <th className="p-3 text-right">单价</th>
                              <th className="p-3 text-right">金额</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {/* Mock Order Items */}
                           {[
                              {name: '2件方形切件蛋糕', price: 12.90, qty: 1},
                              {name: '海盐蛋糕', price: 12.89, qty: 2},
                              {name: '巧克力贝果', price: 10.80, qty: 1},
                              {name: '抹茶瑞士卷', price: 8.80, qty: 3},
                           ].map((item, idx) => (
                              <tr key={idx}>
                                 <td className="p-3 font-medium text-slate-700">{item.name}</td>
                                 <td className="p-3 text-center text-slate-600">x{item.qty}</td>
                                 <td className="p-3 text-right text-slate-500">¥{item.price}</td>
                                 <td className="p-3 text-right font-medium text-slate-800">¥{(item.price * item.qty).toFixed(2)}</td>
                              </tr>
                           ))}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-slate-100">
                           <tr>
                              <td colSpan={3} className="p-3 text-right font-bold text-slate-600">合计</td>
                              <td className="p-3 text-right font-bold text-lg text-emerald-600">¥ 76.08</td>
                           </tr>
                        </tfoot>
                     </table>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-4">
                     <button className="flex flex-col items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors shadow-sm">
                        <Printer size={24} />
                        <span className="font-medium">打印小票</span>
                     </button>
                     
                     {activeTable.status === TableStatus.PAID ? (
                        <button 
                           onClick={handleClearTable}
                           className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                        >
                           <RefreshCw size={24} />
                           <span className="font-medium">清台 (设为空闲)</span>
                        </button>
                     ) : (
                        <button 
                           onClick={handleSettleOrder}
                           className="flex flex-col items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-200 col-span-2"
                        >
                           <Wallet size={24} />
                           <span className="font-bold text-lg">收款 ¥76.08</span>
                        </button>
                     )}
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default TableManagement;
