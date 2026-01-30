
import React from 'react';
import { PlusCircle } from 'lucide-react';

const ConfigPrinterSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-sm shadow-sm min-h-[80vh] p-8">
       <div className="text-slate-500 text-sm mb-6">当前还可以添加 20 台打印机</div>
       
       <div className="w-64 h-32 bg-slate-50 border border-dashed border-slate-300 rounded flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-emerald-400 hover:text-emerald-500 transition-colors">
          <PlusCircle size={32} className="mb-2" />
          <span>添加打印机</span>
       </div>
    </div>
  );
};

export default ConfigPrinterSettings;
