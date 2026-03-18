import React from 'react';
import { Check, X, MapPin } from 'lucide-react';

const ApproveStore = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-black uppercase tracking-tighter text-blue-500">Yêu cầu phê duyệt mới</h2>
    {[
      { name: "Phở Gánh Xưa", address: "Hà Nội", owner: "Nguyễn Văn A" },
      { name: "Trà Sữa Mixi", address: "TP.HCM", owner: "Trần Thị B" },
    ].map((shop, i) => (
      <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-md hover:border-blue-500/30 transition-all">
        <div className="flex gap-6 items-center">
          <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 font-black">STORE</div>
          <div>
            <h3 className="text-xl font-bold">{shop.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12}/> {shop.address} • Chủ: {shop.owner}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20">Duyệt</button>
          <button className="px-6 py-2 bg-white/5 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">Từ chối</button>
        </div>
      </div>
    ))}
  </div>
);

export default ApproveStore;