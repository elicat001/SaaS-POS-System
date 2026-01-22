import React, { useState } from 'react';
import { Sparkles, Bot, Send } from 'lucide-react';
import { generateBusinessInsight } from '../services/geminiService';
import { Order } from '../types';

interface AIAssistantProps {
  orders: Order[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ orders }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const handleGenerateInsight = async () => {
    setLoading(true);
    const salesData = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      averageOrderValue: orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length) : 0,
    };
    
    const result = await generateBusinessInsight(salesData, orders);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-violet-200">
           <Sparkles className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">KeRuYun AI Business Manager</h2>
        <p className="text-slate-500">Leverage Google Gemini to analyze your restaurant's performance.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Bot size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Daily Performance Analysis</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Get instant strategic feedback based on your current sales data, order volume, and revenue trends.
            </p>
            <button
              onClick={handleGenerateInsight}
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Analyzing Data...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Generate Insight
                </>
              )}
            </button>
         </div>

         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-600"></div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-fuchsia-500" />
              AI Analysis Result
            </h3>
            
            <div className="bg-slate-50 rounded-xl p-6 h-64 overflow-y-auto border border-slate-100">
              {insight ? (
                <div className="prose prose-sm prose-slate">
                  <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {insight}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                  <Bot size={32} className="mb-2 opacity-20" />
                  <p className="text-sm">No analysis generated yet.<br/>Click the button to start.</p>
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AIAssistant;