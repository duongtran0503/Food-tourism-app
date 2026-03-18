import React from 'react';
import { Plus, Map, Navigation } from 'lucide-react';

const TourManagement = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-black uppercase tracking-tighter text-blue-500">Hành trình khám phá</h2>
      <button className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2">
        <Plus size={20}/> TẠO TOUR MỚI
      </button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((t) => (
        <div key={t} className="p-8 bg-white/5 border border-white/10 rounded-[32px] group">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 mb-6"><Map size={24}/></div>
          <h3 className="text-2xl font-bold mb-6">Foodtour Hà Nội về đêm #{t}</h3>
          <div className="grid grid-cols-3 gap-3 mb-8">
             <div className="bg-white/5 p-3 rounded-2xl text-center"><p className="text-[10px] text-gray-500 font-bold uppercase">Địa điểm</p><p className="font-bold">5 điểm</p></div>
             <div className="bg-white/5 p-3 rounded-2xl text-center"><p className="text-[10px] text-gray-500 font-bold uppercase">Thời gian</p><p className="font-bold">4 giờ</p></div>
             <div className="bg-white/5 p-3 rounded-2xl text-center"><p className="text-[10px] text-gray-500 font-bold uppercase">Độ khó</p><p className="font-bold text-blue-400">Dễ</p></div>
          </div>
          <button className="w-full py-4 bg-white/5 rounded-xl font-bold border border-white/10 hover:border-blue-500/50 hover:text-blue-500 transition-all flex items-center justify-center gap-2"><Navigation size={18}/> Xem lộ trình</button>
        </div>
      ))}
    </div>
  </div>
);

export default TourManagement;