import React, { useState } from 'react';
import { Plus, Star, Edit, Trash2 } from 'lucide-react';

const MenuManagement = () => {
  const [menuItems] = useState([
    { id: 1, name: "Bún Đậu Đặc Biệt", price: "55,000đ", status: "Còn món", rating: 4.8 },
    { id: 2, name: "Trà Chanh Giã Tay", price: "25,000đ", status: "Hết món", rating: 4.5 },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-orange-500">Thực đơn</h2>
        <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-105 transition-all">
          <Plus size={20}/> Thêm món mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-[40px] p-2 group hover:bg-white/[0.08] transition-all">
            <div className="h-48 bg-gray-800 rounded-[32px] relative m-1 overflow-hidden">
              <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                <Star size={12} className="text-orange-500 fill-orange-500"/> {item.rating}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-black">{item.price}</span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${item.status === 'Còn món' ? 'text-green-500' : 'text-red-500'}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-white/5 rounded-xl font-bold hover:bg-orange-500 transition-all">Sửa</button>
                <button className="px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;