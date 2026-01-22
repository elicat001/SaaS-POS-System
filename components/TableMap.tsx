
import React from 'react';
import { Table, TableStatus } from '../types';
import { Users, Coffee } from 'lucide-react';

interface TableMapProps {
  tables: Table[];
}

const TableMap: React.FC<TableMapProps> = ({ tables }) => {
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400 hover:shadow-emerald-100';
      case TableStatus.SCANNED:
      case TableStatus.UNPAID:
        return 'bg-red-50 border-red-200 text-red-700';
      case TableStatus.PAID:
        return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-slate-100 border-slate-200 text-slate-400';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Table Management</h2>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 text-sm text-slate-600">
             <div className="w-3 h-3 rounded-full bg-white border border-slate-300"></div> Available
           </div>
           <div className="flex items-center gap-2 text-sm text-slate-600">
             <div className="w-3 h-3 rounded-full bg-red-50 border border-red-200"></div> Occupied
           </div>
           <div className="flex items-center gap-2 text-sm text-slate-600">
             <div className="w-3 h-3 rounded-full bg-amber-50 border border-amber-200"></div> Paid
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tables.map(table => (
          <div 
            key={table.id}
            className={`
              relative aspect-square rounded-2xl border-2 p-6 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm hover:shadow-md
              ${getStatusColor(table.status)}
            `}
          >
            <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold opacity-70">
               <Users size={14} />
               {table.capacity}
            </div>
            
            <div className="mb-3 p-4 rounded-full bg-current bg-opacity-10">
               <Coffee size={32} />
            </div>
            
            <h3 className="text-lg font-bold mb-1">{table.name}</h3>
            <span className="text-xs font-medium uppercase tracking-wider opacity-80">{table.status}</span>
            
            {(table.status === TableStatus.SCANNED || table.status === TableStatus.UNPAID) && (
              <div className="mt-4 w-full">
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span>Time</span>
                  <span>24m</span>
                </div>
                <div className="w-full bg-current bg-opacity-10 rounded-full h-1.5">
                  <div className="bg-current h-1.5 rounded-full w-1/2"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableMap;