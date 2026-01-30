
import React, { useState } from 'react';
import { 
  Save, Upload, Info, Plus, X, Smartphone, 
  CreditCard, Truck, MapPin, Bell, Calendar, 
  FileText, MessageSquare, Image as ImageIcon, 
  Clock, CheckCircle, AlertCircle, Trash2
} from 'lucide-react';

type TabType = 
  | 'BASIC' | 'SHARE' | 'PAYMENT' | 'DELIVERY' | 'EXPRESS' 
  | 'NOTIFY' | 'SEAT' | 'PREORDER' | 'FORM' | 'REMARKS' 
  | 'LOADING' | 'TEMPLATE';

const ConfigSystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('BASIC');
  
  // --- Local State for Interactive Demos ---
  const [remarks, setRemarks] = useState(['微辣', '中辣', '特辣', '少冰', '去冰', '多糖', '少糖']);
  const [newRemark, setNewRemark] = useState('');

  // --- Helper Components ---
  
  const SectionHeader = ({ title, desc }: { title: string, desc?: string }) => (
    <div className="mb-6 border-b border-slate-100 pb-4">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {desc && <p className="text-sm text-slate-400 mt-1">{desc}</p>}
    </div>
  );

  const FormItem = ({ label, children, tip, required }: { label: string, children?: React.ReactNode, tip?: string, required?: boolean }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {tip && <div className="text-xs text-slate-400 mt-1.5 flex items-start gap-1"><Info size={12} className="mt-0.5 shrink-0"/> {tip}</div>}
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange?: () => void }) => (
    <button 
      onClick={onChange}
      className={`relative w-11 h-6 transition-colors rounded-full focus:outline-none ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`}
    >
      <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  const ImageUploader = ({ text = "上传图片" }: { text?: string }) => (
    <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all">
      <Upload size={20} className="mb-1" />
      <span className="text-xs">{text}</span>
    </div>
  );

  // --- Render Functions for Each Tab ---

  const renderBasic = () => (
    <div>
      <SectionHeader title="基础设置" desc="设置小程序的全局基础信息与显示规则" />
      <div className="max-w-2xl">
        <FormItem label="版权图标" tip="显示在小程序页面底部的品牌标识，建议尺寸 100x48px">
           <div className="flex items-center gap-4">
              <ImageUploader />
              <div className="text-xs text-slate-400">支持 JPG, PNG 格式<br/>大小不超过 2MB</div>
           </div>
        </FormItem>
        <FormItem label="首次授权弹窗" tip="新用户首次访问时，是否强制弹出授权申请">
           <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="text-sm text-slate-700">开启头像昵称授权</div>
              <Toggle checked={true} />
           </div>
        </FormItem>
        <FormItem label="门店列表展示模式">
           <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 border border-emerald-500 bg-emerald-50 rounded cursor-pointer">
                 <input type="radio" name="storeMode" defaultChecked className="text-emerald-500" />
                 <span className="text-sm font-medium text-emerald-800">传统列表模式</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                 <input type="radio" name="storeMode" className="text-emerald-500" />
                 <span className="text-sm text-slate-600">按城市分组模式</span>
              </label>
           </div>
        </FormItem>
        <FormItem label="手机号授权规则">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <input type="checkbox" id="forcePhone" className="rounded text-emerald-500 focus:ring-emerald-500" />
                 <label htmlFor="forcePhone" className="text-sm text-slate-600">强制获取手机号</label>
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" id="allowSkip" className="rounded text-emerald-500 focus:ring-emerald-500" defaultChecked />
                 <label htmlFor="allowSkip" className="text-sm text-slate-600">允许用户跳过</label>
              </div>
           </div>
        </FormItem>
      </div>
    </div>
  );

  const renderShare = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SectionHeader title="转发设置" desc="自定义用户转发小程序给好友或群聊时的卡片样式" />
        <FormItem label="转发标题" required>
           <input type="text" defaultValue="棠小一：减糖甜品，美味更健康！" className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
        </FormItem>
        <FormItem label="转发描述">
           <input type="text" defaultValue="新人注册送大额优惠券，快来看看吧~" className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
        </FormItem>
        <FormItem label="转发图片" tip="建议尺寸 5:4，不上传则默认截取当前页面">
           <ImageUploader text="更换图片" />
        </FormItem>
      </div>
      {/* Visual Preview */}
      <div className="bg-slate-100 p-6 rounded-xl flex items-center justify-center">
         <div className="bg-white w-64 rounded-lg shadow-sm overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex items-center gap-2">
               <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600 text-xs">棠</div>
               <div className="text-xs font-medium text-slate-800">棠小一小程序</div>
            </div>
            <div className="p-3">
               <div className="text-sm font-bold text-slate-800 mb-2 leading-snug">棠小一：减糖甜品，美味更健康！</div>
               <div className="aspect-[5/4] bg-slate-200 rounded flex items-center justify-center text-slate-400">
                  <ImageIcon size={32} />
               </div>
            </div>
            <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1 text-[10px] text-slate-400">
               <Smartphone size={10} /> 小程序
            </div>
         </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div>
      <SectionHeader title="支付设置" desc="配置微信支付商户号及相关证书" />
      <div className="max-w-2xl space-y-6">
         <div className="bg-orange-50 border border-orange-100 text-orange-700 px-4 py-3 rounded text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div>
               <p className="font-bold">重要提示</p>
               <p>请确保支付参数配置正确，否则用户将无法完成付款。证书文件请妥善保管。</p>
            </div>
         </div>

         <FormItem label="微信支付商户号 (MchID)" required>
            <input type="text" defaultValue="1500008888" className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-mono" />
         </FormItem>
         <FormItem label="支付秘钥 (API Key)" required>
            <div className="relative">
               <input type="password" defaultValue="e10adc3949ba59abbe56e057f20f883e" className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-mono" />
               <span className="absolute right-3 top-2 text-xs text-blue-500 cursor-pointer">查看</span>
            </div>
         </FormItem>
         <FormItem label="支付证书 (apiclient_cert.p12)" tip="退款、发放红包等敏感操作需要上传证书">
            <div className="flex items-center gap-3">
               <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                  <Upload size={16} /> 上传证书
               </button>
               <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle size={12}/> 已上传</span>
            </div>
         </FormItem>
         
         <div className="border-t border-slate-100 pt-6">
            <h3 className="font-bold text-slate-800 mb-4">支付方式开关</h3>
            <div className="space-y-3">
               {['微信支付', '余额支付', '货到付款/线下支付', '支付宝 (需特殊申请)'].map(method => (
                  <div key={method} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                     <span className="text-sm text-slate-700">{method}</span>
                     <Toggle checked={method !== '支付宝 (需特殊申请)'} />
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderDelivery = () => (
    <div>
      <SectionHeader title="配送设置" desc="商家自配送规则设置 (非第三方跑腿)" />
      <div className="max-w-2xl">
         <FormItem label="起送金额 (元)">
            <input type="number" defaultValue="20" className="w-full border border-slate-200 rounded px-3 py-2 text-sm" />
         </FormItem>
         <FormItem label="基础配送费 (元)">
            <input type="number" defaultValue="5" className="w-full border border-slate-200 rounded px-3 py-2 text-sm" />
         </FormItem>
         <FormItem label="满额免配送费 (元)" tip="设置为 0 则代表不开启免邮">
            <input type="number" defaultValue="88" className="w-full border border-slate-200 rounded px-3 py-2 text-sm" />
         </FormItem>
         <FormItem label="配送半径 (km)">
            <input type="number" defaultValue="5.5" className="w-full border border-slate-200 rounded px-3 py-2 text-sm" />
         </FormItem>
         <FormItem label="配送时间段" tip="不在时间段内无法选择配送">
            <div className="flex items-center gap-2">
               <input type="time" defaultValue="09:00" className="border border-slate-200 rounded px-2 py-1.5 text-sm" />
               <span className="text-slate-400">至</span>
               <input type="time" defaultValue="22:00" className="border border-slate-200 rounded px-2 py-1.5 text-sm" />
            </div>
         </FormItem>
      </div>
    </div>
  );

  const renderExpress = () => (
    <div>
      <SectionHeader title="快递设置" desc="发货物流配置 (用于电商/周边商品)" />
      <div className="max-w-2xl">
         <FormItem label="开启物流查询">
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg mb-2">
               <span className="text-sm text-slate-700">启用快递100接口</span>
               <Toggle checked={true} />
            </div>
         </FormItem>
         <FormItem label="快递100 Customer">
            <input type="text" className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-mono" placeholder="请输入Customer" />
         </FormItem>
         <FormItem label="快递100 Key">
            <input type="text" className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-mono" placeholder="请输入Key" />
         </FormItem>
         <FormItem label="默认发货人信息">
             <div className="space-y-3">
                <input type="text" placeholder="发货人姓名" className="w-full border border-slate-200 rounded px-3 py-2 text-sm" />
                <input type="text" placeholder="发货人电话" className="w-full border border-slate-200 rounded px-3 py-2 text-sm" />
                <textarea placeholder="发货详细地址" className="w-full border border-slate-200 rounded px-3 py-2 text-sm h-20 resize-none"></textarea>
             </div>
         </FormItem>
      </div>
    </div>
  );

  const renderNotify = () => (
    <div>
      <SectionHeader title="等单提醒" desc="排队取号时的通知策略" />
      <div className="max-w-2xl">
         <FormItem label="开启微信通知">
            <Toggle checked={true} />
         </FormItem>
         <FormItem label="提醒阈值" tip="当排队前方剩余多少桌时，发送提醒">
            <div className="flex items-center gap-2">
               <span className="text-sm text-slate-600">前方剩余</span>
               <input type="number" defaultValue="3" className="w-20 border border-slate-200 rounded px-2 py-1 text-center font-bold text-emerald-600" />
               <span className="text-sm text-slate-600">桌时，自动提醒用户</span>
            </div>
         </FormItem>
         <FormItem label="提醒文案模板">
             <textarea 
               className="w-full border border-slate-200 rounded px-3 py-2 text-sm h-24 bg-slate-50 text-slate-600" 
               defaultValue="尊敬的 {name}，您前面还有 {num} 桌，预计等待 {time} 分钟，请您留意叫号信息，避免过号。"
             ></textarea>
         </FormItem>
      </div>
    </div>
  );

  const renderSeat = () => (
    <div>
      <SectionHeader title="座位预约" desc="在线订座规则配置" />
      <div className="max-w-2xl">
         <FormItem label="开启预约功能">
            <Toggle checked={true} />
         </FormItem>
         <FormItem label="需要支付定金">
            <div className="flex items-center gap-4">
               <Toggle checked={false} />
               <input type="number" placeholder="金额" className="w-24 border border-slate-200 rounded px-2 py-1 text-sm disabled:bg-slate-100" disabled />
               <span className="text-sm text-slate-500">元/桌</span>
            </div>
         </FormItem>
         <FormItem label="可预约时间段">
            <div className="flex flex-wrap gap-2">
               {['午市 11:00-14:00', '晚市 17:00-21:00'].map(time => (
                  <span key={time} className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded border border-emerald-100 text-sm flex items-center gap-2">
                     {time} <X size={12} className="cursor-pointer hover:text-red-500"/>
                  </span>
               ))}
               <button className="px-3 py-1 bg-white border border-dashed border-slate-300 text-slate-400 rounded text-sm hover:border-emerald-500 hover:text-emerald-500">
                  + 添加时间段
               </button>
            </div>
         </FormItem>
         <FormItem label="预约保留时长 (分钟)">
             <input type="number" defaultValue="15" className="w-full border border-slate-200 rounded px-3 py-2 text-sm" />
         </FormItem>
      </div>
    </div>
  );

  const renderPreorder = () => (
    <div>
       <SectionHeader title="下单预约" desc="自取/配送订单的预约时间配置" />
       <div className="max-w-2xl">
          <FormItem label="支持预约单">
             <Toggle checked={true} />
          </FormItem>
          <FormItem label="最早可预约时间">
             <select className="w-full border border-slate-200 rounded px-3 py-2 text-sm">
                <option>下单后 30 分钟</option>
                <option>下单后 1 小时</option>
                <option>次日</option>
             </select>
          </FormItem>
          <FormItem label="最晚可预约时间">
             <select className="w-full border border-slate-200 rounded px-3 py-2 text-sm">
                <option>3天内</option>
                <option>7天内</option>
             </select>
          </FormItem>
       </div>
    </div>
  );

  const renderForm = () => (
    <div>
       <SectionHeader title="下单表单" desc="顾客下单时需要填写的额外信息" />
       <div className="max-w-2xl space-y-4">
          {[
             { label: '用餐人数 (堂食)', required: true },
             { label: '联系电话 (堂食)', required: false },
             { label: '餐具数量', required: true },
             { label: '备注信息', required: false },
             { label: '发票抬头', required: false },
          ].map((item, idx) => (
             <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white">
                <div className="flex items-center gap-2">
                   <span className="font-medium text-slate-700">{item.label}</span>
                   {item.required && <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded">必填</span>}
                </div>
                <Toggle checked={true} />
             </div>
          ))}
          <button className="w-full py-3 border border-dashed border-slate-300 rounded text-slate-500 hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2">
             <Plus size={16} /> 添加自定义字段
          </button>
       </div>
    </div>
  );

  const renderRemarks = () => (
    <div>
       <SectionHeader title="常用备注" desc="顾客下单时可快速选择的口味偏好标签" />
       <div className="max-w-2xl">
          <div className="flex flex-wrap gap-3 mb-6">
             {remarks.map(tag => (
                <div key={tag} className="group relative px-4 py-2 bg-slate-100 rounded text-sm text-slate-700 border border-transparent hover:border-slate-300 hover:bg-white transition-all">
                   {tag}
                   <button 
                     onClick={() => setRemarks(remarks.filter(r => r !== tag))}
                     className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <X size={10} />
                   </button>
                </div>
             ))}
          </div>
          <div className="flex gap-2">
             <input 
               type="text" 
               value={newRemark}
               onChange={e => setNewRemark(e.target.value)}
               placeholder="输入新标签，如：微辣" 
               className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
               onKeyDown={e => {
                  if(e.key === 'Enter' && newRemark.trim()) {
                     setRemarks([...remarks, newRemark.trim()]);
                     setNewRemark('');
                  }
               }}
             />
             <button 
               onClick={() => {
                  if(newRemark.trim()) {
                     setRemarks([...remarks, newRemark.trim()]);
                     setNewRemark('');
                  }
               }}
               className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-600"
             >
                添加
             </button>
          </div>
       </div>
    </div>
  );

  const renderLoading = () => (
    <div>
       <SectionHeader title="加载图标" desc="自定义小程序全局Loading动画" />
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
             <FormItem label="全局加载Logo" tip="建议使用透明背景PNG，尺寸 80x80px">
                <ImageUploader text="上传Logo" />
             </FormItem>
             <FormItem label="加载文字颜色">
                <input type="color" defaultValue="#10b981" className="h-10 w-20 p-1 border border-slate-200 rounded" />
             </FormItem>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-100 rounded-xl h-64 border-2 border-slate-200 border-dashed">
             <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div>
             <div className="text-emerald-500 text-sm font-medium">加载中...</div>
             <div className="text-xs text-slate-400 mt-8">预览效果</div>
          </div>
       </div>
    </div>
  );

  const renderTemplate = () => (
    <div>
       <SectionHeader title="模板消息" desc="配置微信订阅消息Template ID" />
       <div className="space-y-4 max-w-3xl">
          {[
             { name: '支付成功通知', id: 'pay_success' },
             { name: '订单配送通知', id: 'delivery_start' },
             { name: '退款成功通知', id: 'refund_success' },
             { name: '取餐提醒', id: 'pickup_notify' },
             { name: '会员升级通知', id: 'level_up' },
          ].map(tpl => (
             <div key={tpl.id} className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-slate-700 text-right">{tpl.name}</label>
                <input 
                  type="text" 
                  placeholder={`请输入 ${tpl.name} Template ID`}
                  className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-500" 
                />
                <button className="text-xs text-blue-500 hover:underline">去后台获取</button>
             </div>
          ))}
          <div className="bg-blue-50 text-blue-700 p-4 rounded text-sm mt-6">
             提示：请登录微信小程序后台，在“订阅消息”中选用对应模板，并将模板ID填入上方。
          </div>
       </div>
    </div>
  );

  const TABS: { id: TabType, label: string, icon: any }[] = [
    { id: 'BASIC', label: '基础设置', icon: Smartphone },
    { id: 'SHARE', label: '转发设置', icon: MessageSquare },
    { id: 'PAYMENT', label: '支付设置', icon: CreditCard },
    { id: 'DELIVERY', label: '配送设置', icon: MapPin },
    { id: 'EXPRESS', label: '快递设置', icon: Truck },
    { id: 'NOTIFY', label: '等单提醒', icon: Bell },
    { id: 'SEAT', label: '座位预约', icon: Calendar },
    { id: 'PREORDER', label: '下单预约', icon: Clock },
    { id: 'FORM', label: '下单表单', icon: FileText },
    { id: 'REMARKS', label: '常用备注', icon: CheckCircle },
    { id: 'LOADING', label: '加载图标', icon: ImageIcon },
    { id: 'TEMPLATE', label: '模板消息', icon: MessageSquare },
  ];

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-white rounded-sm shadow-sm overflow-hidden -m-6 rounded-none">
      {/* Sidebar Navigation */}
      <div className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-200">
           <h3 className="font-bold text-slate-800">系统设置</h3>
        </div>
        <div className="flex-1 p-2 space-y-1">
           {TABS.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all ${
                 activeTab === tab.id 
                   ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                   : 'text-slate-600 hover:bg-slate-100'
               }`}
             >
               <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
         <div className="flex-1 overflow-y-auto p-8 relative">
            {activeTab === 'BASIC' && renderBasic()}
            {activeTab === 'SHARE' && renderShare()}
            {activeTab === 'PAYMENT' && renderPayment()}
            {activeTab === 'DELIVERY' && renderDelivery()}
            {activeTab === 'EXPRESS' && renderExpress()}
            {activeTab === 'NOTIFY' && renderNotify()}
            {activeTab === 'SEAT' && renderSeat()}
            {activeTab === 'PREORDER' && renderPreorder()}
            {activeTab === 'FORM' && renderForm()}
            {activeTab === 'REMARKS' && renderRemarks()}
            {activeTab === 'LOADING' && renderLoading()}
            {activeTab === 'TEMPLATE' && renderTemplate()}
         </div>

         {/* Sticky Footer */}
         <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center z-10">
            <div className="text-xs text-slate-400">上次保存: 10:42 AM</div>
            <div className="flex gap-4">
               <button 
                 onClick={() => window.location.reload()}
                 className="px-6 py-2 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50"
               >
                 重置
               </button>
               <button className="px-6 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600 shadow-sm flex items-center gap-2">
                 <Save size={16} /> 保存修改
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ConfigSystemSettings;
