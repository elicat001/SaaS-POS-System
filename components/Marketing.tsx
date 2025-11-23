
import React, { useState } from 'react';
import { 
  ChevronLeft, Plus, Trash2, Save, Search, Gift, CreditCard, Users, Percent, 
  Settings, Calendar, Image as ImageIcon, DollarSign, Clock, Ticket, 
  Zap, Share2, UserPlus, LayoutGrid, ToggleLeft, ToggleRight
} from 'lucide-react';

// --- Types & Interfaces ---

type ToolId = 
  | 'RECHARGE' | 'GROUP_BUY' | 'ADS' | 'POINTS' 
  | 'DISTRIBUTION' | 'MEMBER' | 'WHEEL' | 'SCRATCH' 
  | 'STAMP' | 'DISCOUNT' | 'RECHARGE_CODE' | 'COUPON_CODE' 
  | 'CHECKIN' | 'EXCHANGE' | 'INVITE' | 'FLASH_SALE';

interface ToolDef {
  id: ToolId;
  icon: string;
  color: string;
  title: string;
  desc: string;
}

// --- Shared Components ---

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`transition-colors duration-200 ${checked ? 'text-emerald-500' : 'text-slate-300'}`}
  >
    {checked ? <ToggleRight size={40} strokeWidth={1.5} fill="currentColor" className="text-emerald-100" /> : <ToggleLeft size={40} strokeWidth={1.5} />}
  </button>
);

const ToolLayout = ({ 
  title, 
  onBack, 
  children, 
  onSave,
  isEnabled,
  setIsEnabled 
}: { 
  title: string; 
  onBack: () => void; 
  children?: React.ReactNode; 
  onSave: () => void;
  isEnabled: boolean;
  setIsEnabled: (v: boolean) => void;
}) => (
  <div className="bg-white rounded-sm shadow-sm min-h-[80vh] flex flex-col animate-in slide-in-from-right duration-300">
    <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2 text-sm">
          <span className={isEnabled ? "text-emerald-600 font-medium" : "text-slate-400"}>{isEnabled ? "已开启" : "已关闭"}</span>
          <Toggle checked={isEnabled} onChange={setIsEnabled} />
        </div>
      </div>
      <button 
        onClick={onSave}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-200 transition-all active:scale-95"
      >
        <Save size={16} /> 保存配置
      </button>
    </div>
    <div className="p-8 max-w-5xl mx-auto w-full">
      {isEnabled ? children : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
             <Settings size={40} className="text-slate-300" />
           </div>
           <p>该功能目前处于关闭状态</p>
           <button onClick={() => setIsEnabled(true)} className="mt-4 text-emerald-500 hover:underline">立即开启</button>
        </div>
      )}
    </div>
  </div>
);

// --- Feature Editors ---

const RechargeEditor = () => {
  const [rules, setRules] = useState([{ id: 1, deposit: 100, bonus: 10 }, { id: 2, deposit: 200, bonus: 30 }]);
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CreditCard size={18} /> 充值规则设置</h3>
        <div className="space-y-3">
          {rules.map((rule, idx) => (
            <div key={rule.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-400 w-8">#{idx + 1}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">充值</span>
                <input type="number" value={rule.deposit} onChange={(e) => {
                  const newRules = [...rules];
                  newRules[idx].deposit = Number(e.target.value);
                  setRules(newRules);
                }} className="w-24 px-3 py-1.5 border border-slate-300 rounded focus:border-emerald-500 outline-none" />
                <span className="text-sm text-slate-600">元</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-emerald-600">送</span>
                <input type="number" value={rule.bonus} onChange={(e) => {
                  const newRules = [...rules];
                  newRules[idx].bonus = Number(e.target.value);
                  setRules(newRules);
                }} className="w-24 px-3 py-1.5 border border-slate-300 rounded focus:border-emerald-500 outline-none" />
                <span className="text-sm text-slate-600">元</span>
              </div>
              <button onClick={() => setRules(rules.filter(r => r.id !== rule.id))} className="ml-auto text-slate-400 hover:text-red-500 p-2"><Trash2 size={18} /></button>
            </div>
          ))}
          <button onClick={() => setRules([...rules, { id: Date.now(), deposit: 0, bonus: 0 }])} className="w-full py-3 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-emerald-400 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} /> 添加充值规则
          </button>
        </div>
      </div>
      <div className="bg-orange-50 p-4 rounded border border-orange-100 text-sm text-orange-800">
        <p className="font-bold mb-1">说明：</p>
        <ul className="list-disc list-inside space-y-1 opacity-80">
          <li>充值金额将直接存入用户余额。</li>
          <li>赠送金额不可提现，仅用于消费抵扣。</li>
        </ul>
      </div>
    </div>
  );
};

const GroupBuyEditor = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800">拼团活动列表</h3>
          <button className="bg-emerald-500 text-white px-4 py-2 rounded text-sm hover:bg-emerald-600 flex items-center gap-2"><Plus size={16}/> 新建拼团</button>
       </div>
       <table className="w-full text-left text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 text-slate-600">
             <tr>
                <th className="p-3 border-b">活动名称</th>
                <th className="p-3 border-b">拼团商品</th>
                <th className="p-3 border-b">成团人数</th>
                <th className="p-3 border-b">拼团价</th>
                <th className="p-3 border-b">状态</th>
                <th className="p-3 border-b text-right">操作</th>
             </tr>
          </thead>
          <tbody>
             <tr className="hover:bg-slate-50">
                <td className="p-3">夏季饮品3人团</td>
                <td className="p-3">杨枝甘露(大杯)</td>
                <td className="p-3">3人</td>
                <td className="p-3 text-emerald-600 font-bold">¥9.90</td>
                <td className="p-3"><span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-xs">进行中</span></td>
                <td className="p-3 text-right text-blue-500 cursor-pointer">编辑</td>
             </tr>
          </tbody>
       </table>
    </div>
  );
};

const PointsEditor = () => (
  <div className="max-w-2xl space-y-8">
     <div className="grid grid-cols-2 gap-8">
        <div className="p-6 border border-slate-200 rounded-lg">
           <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ArrowUpIcon className="text-emerald-500"/> 积分获取</h4>
           <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-slate-600">每消费</span>
              <input type="number" defaultValue="1" className="w-20 px-2 py-1 border rounded text-center" />
              <span className="text-sm text-slate-600">元，获得</span>
              <input type="number" defaultValue="1" className="w-20 px-2 py-1 border rounded text-center font-bold text-emerald-600" />
              <span className="text-sm text-slate-600">积分</span>
           </div>
           <p className="text-xs text-slate-400">顾客消费完成后自动发放到账户</p>
        </div>
        <div className="p-6 border border-slate-200 rounded-lg">
           <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ArrowDownIcon className="text-orange-500"/> 积分抵扣</h4>
           <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-slate-600">每使用</span>
              <input type="number" defaultValue="100" className="w-20 px-2 py-1 border rounded text-center" />
              <span className="text-sm text-slate-600">积分，抵扣</span>
              <input type="number" defaultValue="1" className="w-20 px-2 py-1 border rounded text-center font-bold text-orange-600" />
              <span className="text-sm text-slate-600">元</span>
           </div>
           <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">
              <span>最高抵扣订单金额的</span>
              <input type="number" defaultValue="50" className="w-16 px-2 py-1 border rounded text-center" />
              <span>%</span>
           </div>
        </div>
     </div>
     
     <div>
        <h4 className="font-bold text-slate-800 mb-4">签到送积分</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
           {[1,2,3,4,5,6,7].map(day => (
              <div key={day} className="flex-1 min-w-[80px] border border-slate-200 rounded p-3 flex flex-col items-center gap-2">
                 <span className="text-xs text-slate-500">第{day}天</span>
                 <input type="number" defaultValue={day*5} className="w-full text-center border-b border-slate-200 focus:border-emerald-500 outline-none font-bold text-emerald-600" />
              </div>
           ))}
        </div>
     </div>
  </div>
);

const ArrowUpIcon = (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>;
const ArrowDownIcon = (props: any) => <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>;

const WheelEditor = () => {
  const [prizes, setPrizes] = useState([
    {id: 1, name: '5元优惠券', type: 'COUPON', chance: 20},
    {id: 2, name: '谢谢惠顾', type: 'NONE', chance: 50},
    {id: 3, name: '免单券', type: 'COUPON', chance: 1},
  ]);

  return (
    <div className="grid grid-cols-3 gap-8">
       <div className="col-span-1">
          <div className="aspect-square rounded-full border-8 border-orange-400 bg-orange-100 relative flex items-center justify-center shadow-lg">
             <div className="text-center">
                <div className="font-bold text-orange-600 text-lg">大转盘</div>
                <div className="text-xs text-orange-400">预览效果</div>
             </div>
             {/* Segments visual placeholder */}
             <div className="absolute inset-0 rounded-full border-4 border-white opacity-30"></div>
          </div>
       </div>
       <div className="col-span-2 space-y-6">
          <div>
             <h3 className="font-bold text-slate-800 mb-4">奖品配置 (总概率: {prizes.reduce((a,b)=>a+b.chance,0)}%)</h3>
             <div className="space-y-3">
                {prizes.map((prize, idx) => (
                   <div key={prize.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded bg-slate-50">
                      <span className="w-6 text-center font-bold text-slate-400">{idx+1}</span>
                      <input type="text" value={prize.name} onChange={(e) => {
                         const n = [...prizes]; n[idx].name = e.target.value; setPrizes(n);
                      }} className="flex-1 border border-slate-300 rounded px-2 py-1" placeholder="奖品名称" />
                      <select className="border border-slate-300 rounded px-2 py-1 text-sm bg-white">
                         <option>优惠券</option>
                         <option>积分</option>
                         <option>实物/核销</option>
                         <option>未中奖</option>
                      </select>
                      <div className="flex items-center gap-1">
                         <input type="number" value={prize.chance} onChange={(e) => {
                            const n = [...prizes]; n[idx].chance = Number(e.target.value); setPrizes(n);
                         }} className="w-16 border border-slate-300 rounded px-2 py-1 text-center" />
                         <span className="text-xs text-slate-500">%</span>
                      </div>
                      <button onClick={() => setPrizes(prizes.filter(p => p.id !== prize.id))} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                   </div>
                ))}
                <button onClick={() => setPrizes([...prizes, {id: Date.now(), name: '', type: 'NONE', chance: 0}])} className="text-emerald-500 text-sm font-medium flex items-center gap-1 hover:underline">
                   <Plus size={16}/> 添加奖项
                </button>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">每日免费次数</label>
                <input type="number" defaultValue="1" className="w-full border border-slate-200 rounded px-3 py-2" />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">消耗积分抽奖</label>
                <input type="number" defaultValue="50" className="w-full border border-slate-200 rounded px-3 py-2" />
             </div>
          </div>
       </div>
    </div>
  );
};

const FlashSaleEditor = () => (
  <div className="space-y-6">
     <div className="bg-white p-4 border border-slate-200 rounded-lg flex items-center gap-4">
        <div className="flex-1">
           <label className="block text-xs text-slate-500 mb-1">活动名称</label>
           <input type="text" defaultValue="限时秒杀" className="w-full font-bold text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-emerald-500 outline-none" />
        </div>
        <div className="flex-1">
           <label className="block text-xs text-slate-500 mb-1">开始时间</label>
           <input type="datetime-local" className="w-full text-sm border-slate-200 rounded" />
        </div>
        <div className="flex-1">
           <label className="block text-xs text-slate-500 mb-1">结束时间</label>
           <input type="datetime-local" className="w-full text-sm border-slate-200 rounded" />
        </div>
     </div>

     <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
           <h4 className="font-bold text-slate-700 text-sm">秒杀商品</h4>
           <button className="text-emerald-500 text-xs font-medium hover:underline">+ 添加商品</button>
        </div>
        <table className="w-full text-left text-sm">
           <thead>
              <tr className="text-slate-500 border-b border-slate-100">
                 <th className="p-4">商品</th>
                 <th className="p-4">原价</th>
                 <th className="p-4">秒杀价</th>
                 <th className="p-4">限量</th>
                 <th className="p-4">限购</th>
                 <th className="p-4">操作</th>
              </tr>
           </thead>
           <tbody>
              <tr className="hover:bg-slate-50">
                 <td className="p-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded"></div>
                    <span>巴斯克蛋糕</span>
                 </td>
                 <td className="p-4 text-slate-400 decoration-line-through">¥19.90</td>
                 <td className="p-4"><input type="number" defaultValue="9.90" className="w-20 border rounded px-2 py-1 text-red-500 font-bold"/></td>
                 <td className="p-4"><input type="number" defaultValue="100" className="w-20 border rounded px-2 py-1"/></td>
                 <td className="p-4"><input type="number" defaultValue="1" className="w-20 border rounded px-2 py-1"/></td>
                 <td className="p-4 text-red-500 cursor-pointer"><Trash2 size={16}/></td>
              </tr>
           </tbody>
        </table>
     </div>
  </div>
);

const CouponGenEditor = ({ type }: { type: 'RECHARGE' | 'COUPON' }) => (
  <div className="max-w-xl mx-auto space-y-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
     <h3 className="font-bold text-slate-800 text-lg text-center mb-6">
        {type === 'RECHARGE' ? '批量生成充值码' : '批量生成优惠券码'}
     </h3>
     
     <div className="space-y-4">
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">生成数量 (张)</label>
           <input type="number" className="w-full border border-slate-300 rounded px-3 py-2 focus:border-emerald-500 outline-none" placeholder="最多一次生成1000张" />
        </div>
        
        {type === 'RECHARGE' ? (
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">面额 (元)</label>
              <input type="number" className="w-full border border-slate-300 rounded px-3 py-2 focus:border-emerald-500 outline-none" placeholder="每张充值卡的金额" />
           </div>
        ) : (
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">关联优惠券</label>
              <select className="w-full border border-slate-300 rounded px-3 py-2 focus:border-emerald-500 outline-none bg-white">
                 <option>选择优惠券模板...</option>
                 <option>5元无门槛</option>
                 <option>8折折扣券</option>
              </select>
           </div>
        )}

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">备注信息</label>
           <input type="text" className="w-full border border-slate-300 rounded px-3 py-2 focus:border-emerald-500 outline-none" placeholder="如：公司年会赠送" />
        </div>

        <button className="w-full bg-emerald-500 text-white py-3 rounded font-bold hover:bg-emerald-600 shadow-md mt-4">
           立即生成并导出Excel
        </button>
     </div>
  </div>
);

const AdsEditor = () => (
  <div className="space-y-6">
     <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-slate-800 rounded-xl aspect-[9/16] p-4 relative overflow-hidden border-4 border-slate-900 shadow-xl">
           {/* Mobile Preview */}
           <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
              <div className="w-4/5 aspect-[3/4] bg-white rounded-lg overflow-hidden relative">
                 <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80" className="w-full h-full object-cover" alt="ad" />
                 <button className="absolute top-2 right-2 bg-black/20 rounded-full p-1 text-white hover:bg-black/40"><div className="w-4 h-4 text-center leading-4 text-xs">×</div></button>
              </div>
           </div>
           <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-xs">预览效果</div>
        </div>
        
        <div className="col-span-2 space-y-6">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">上传广告图</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 cursor-pointer transition-colors bg-slate-50">
                 <ImageIcon size={32} className="mb-2" />
                 <span>点击上传图片 (建议比例 3:4)</span>
              </div>
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">跳转链接</label>
              <input type="text" className="w-full border border-slate-200 rounded px-3 py-2 text-sm" placeholder="/pages/..." />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">弹出频率</label>
                 <select className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white">
                    <option>每天一次</option>
                    <option>每次打开</option>
                    <option>仅首次</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">生效人群</label>
                 <select className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white">
                    <option>所有用户</option>
                    <option>仅会员</option>
                    <option>非会员</option>
                 </select>
              </div>
           </div>
        </div>
     </div>
  </div>
);

const GeneralRuleEditor = ({ title, fields }: { title: string, fields: {label: string, placeholder?: string, type?: string}[] }) => (
  <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-lg p-8">
     <h3 className="font-bold text-slate-800 mb-6 text-lg">{title}</h3>
     <div className="space-y-5">
        {fields.map((f, i) => (
           <div key={i}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
              {f.type === 'textarea' ? (
                 <textarea className="w-full border border-slate-200 rounded px-3 py-2 focus:border-emerald-500 outline-none min-h-[100px]" placeholder={f.placeholder}></textarea>
              ) : (
                 <input type={f.type || 'text'} className="w-full border border-slate-200 rounded px-3 py-2 focus:border-emerald-500 outline-none" placeholder={f.placeholder} />
              )}
           </div>
        ))}
     </div>
  </div>
);

// --- Main Component ---

const Marketing: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  // Mock state for tools enabled status
  const [toolStatus, setToolStatus] = useState<Record<string, boolean>>({
    'RECHARGE': true, 'POINTS': true, 'WHEEL': false
  });

  const tools: ToolDef[] = [
    { id: 'RECHARGE', icon: '💰', color: 'bg-emerald-400', title: '余额充值', desc: '允许客户充值并使用余额支付' },
    { id: 'GROUP_BUY', icon: '👥', color: 'bg-emerald-500', title: '商品拼团', desc: '多人拼团购买，裂变营销' },
    { id: 'ADS', icon: '📺', color: 'bg-emerald-400', title: '弹窗广告', desc: '首页弹窗广告配置' },
    { id: 'POINTS', icon: '★', color: 'bg-emerald-500', title: '积分管理', desc: '消费返积分，积分抵现' },
    { id: 'DISTRIBUTION', icon: '🤝', color: 'bg-emerald-400', title: '分销员', desc: '全员分销佣金设置' },
    { id: 'MEMBER', icon: '👑', color: 'bg-emerald-500', title: '会员权益', desc: '会员等级与权益配置' },
    { id: 'WHEEL', icon: '🎡', color: 'bg-emerald-400', title: '幸运大转盘', desc: '积分抽奖活动' },
    { id: 'SCRATCH', icon: '🎫', color: 'bg-emerald-500', title: '刮刮乐', desc: '趣味刮奖活动' },
    { id: 'STAMP', icon: '🎖', color: 'bg-emerald-400', title: '集章活动', desc: '下单集章兑换好礼' },
    { id: 'DISCOUNT', icon: '🏷', color: 'bg-emerald-500', title: '满减活动', desc: '订单满额立减' },
    { id: 'RECHARGE_CODE', icon: '💳', color: 'bg-emerald-400', title: '充值兑换码', desc: '批量生成充值卡密' },
    { id: 'COUPON_CODE', icon: '🎟', color: 'bg-emerald-500', title: '券兑换码', desc: '批量生成优惠券码' },
    { id: 'CHECKIN', icon: '📅', color: 'bg-emerald-400', title: '签到有礼', desc: '每日签到奖励设置' },
    { id: 'EXCHANGE', icon: '🔁', color: 'bg-emerald-500', title: '超级换购', desc: '加价换购超值商品' },
    { id: 'INVITE', icon: '📩', color: 'bg-emerald-400', title: '邀请奖励', desc: '拉新奖励配置' },
    { id: 'FLASH_SALE', icon: '⚡', color: 'bg-emerald-500', title: '限时折扣', desc: '限时秒杀抢购' },
  ];

  const renderToolContent = () => {
    switch (activeTool) {
      case 'RECHARGE': return <RechargeEditor />;
      case 'GROUP_BUY': return <GroupBuyEditor />;
      case 'ADS': return <AdsEditor />;
      case 'POINTS': return <PointsEditor />;
      case 'WHEEL': return <WheelEditor />;
      case 'FLASH_SALE': return <FlashSaleEditor />;
      case 'RECHARGE_CODE': return <CouponGenEditor type="RECHARGE" />;
      case 'COUPON_CODE': return <CouponGenEditor type="COUPON" />;
      
      // Generic Fallbacks for simplified tools
      case 'DISTRIBUTION': return <GeneralRuleEditor title="分销设置" fields={[
          {label: '一级佣金比例 (%)', type: 'number', placeholder: '10'},
          {label: '二级佣金比例 (%)', type: 'number', placeholder: '5'},
          {label: '分销员申请条件', placeholder: '无条件 / 消费满100元 / 购买指定商品'}
      ]} />;
      case 'MEMBER': return <GeneralRuleEditor title="会员设置" fields={[
          {label: '会员等级名称', placeholder: '如：黄金会员'},
          {label: '升级条件 (累计消费)', type: 'number', placeholder: '1000'},
          {label: '会员权益描述', type: 'textarea', placeholder: '享受9折优惠...'}
      ]} />;
      case 'DISCOUNT': return <GeneralRuleEditor title="满减规则" fields={[
          {label: '活动名称', placeholder: '满100减10'},
          {label: '满足金额', type: 'number'},
          {label: '减免金额', type: 'number'},
          {label: '活动时间', type: 'date'}
      ]} />;
      case 'CHECKIN': return <GeneralRuleEditor title="签到规则" fields={[
          {label: '每日签到获得积分', type: 'number', placeholder: '1'},
          {label: '连续7天额外奖励', type: 'number', placeholder: '10'},
          {label: '补签消耗积分', type: 'number', placeholder: '5'}
      ]} />;
      case 'EXCHANGE': return <GeneralRuleEditor title="超值换购" fields={[
          {label: '订单满额触发', type: 'number', placeholder: '50'},
          {label: '换购商品ID', placeholder: '输入商品ID'},
          {label: '加价金额', type: 'number', placeholder: '9.9'}
      ]} />;
      
      default: return <div className="text-center py-20 text-slate-400">功能开发中...</div>;
    }
  };

  if (activeTool) {
    const tool = tools.find(t => t.id === activeTool)!;
    return (
      <ToolLayout 
        title={tool.title} 
        onBack={() => setActiveTool(null)}
        onSave={() => {
           alert('配置已保存'); 
           setActiveTool(null);
        }}
        isEnabled={toolStatus[activeTool] ?? false}
        setIsEnabled={(v) => setToolStatus({...toolStatus, [activeTool]: v})}
      >
        {renderToolContent()}
      </ToolLayout>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
       <div className="flex border-b border-slate-200 bg-white px-6 pt-4 rounded-t-sm">
          <button className="px-4 py-3 text-sm font-medium border-b-2 border-emerald-500 text-slate-800">营销功能</button>
          <button className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-emerald-500">同享互斥规则</button>
       </div>

       <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {tools.map((tool) => (
                <div 
                  key={tool.id} 
                  onClick={() => setActiveTool(tool.id)}
                  className="bg-white p-4 rounded shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex gap-4 items-start border border-transparent hover:border-emerald-100 relative overflow-hidden group"
                >
                   <div className={`w-12 h-12 ${tool.color} text-white rounded-lg flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                      {tool.icon}
                   </div>
                   <div className="flex-1">
                      <div className="font-bold text-slate-800 text-sm mb-1 flex justify-between">
                        {tool.title}
                        {toolStatus[tool.id] && <span className="w-2 h-2 bg-emerald-500 rounded-full" title="已开启"></span>}
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">{tool.desc}</div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default Marketing;
