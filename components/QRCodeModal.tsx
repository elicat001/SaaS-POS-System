
import React from 'react';
import { X, Download, Share2 } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: string;
  subtext?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, title, data, subtext }) => {
  if (!isOpen) return null;

  // Using a reliable QR code generation API for the MVP to ensure visual rendering 
  // without complex peer dependency management for React 19 in this environment.
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6">
             <img src={qrUrl} alt="QR Code" className="w-48 h-48 object-contain" />
          </div>
          
          <div className="bg-slate-50 rounded px-3 py-1.5 text-xs font-mono text-slate-500 mb-4 max-w-full truncate">
            {data}
          </div>

          {subtext && (
            <p className="text-sm text-slate-500 mb-6">
              {subtext}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 w-full">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
              <Share2 size={16} /> 分享
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-medium transition-colors">
              <Download size={16} /> 下载
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
