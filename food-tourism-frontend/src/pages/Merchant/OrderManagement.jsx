import React from 'react';
import { Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const OrderManagement = () => {
  const orders = [
    { id: "#1204", customer: "Nguyễn Văn A", items: "2x Bún Đậu, 1x Trà Chanh", total: "135.000đ", time: "10 phút trước" },
    { id: "#1205", customer: "Trần Thị B", items: "1x Cơm Tấm", total: "45.000đ", time: "Vừa xong" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black uppercase tracking-tighter text-orange-500 mb-6">Đơn hàng mới</h2>
      
      {orders.map((order) => (
        <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-[28px] flex items-center justify-between backdrop-blur-md hover:border-orange-500/30 transition-all">
          <div className="flex gap-6 items-center">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 font-black">
              {order.id}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{order.customer}</h3>
              <p className="text-sm text-gray-500 italic">{order.items}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <Clock size={12}/> {order.time}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <span className="text-xl font-black text-white">{order.total}</span>
            <div className="flex gap-2">
              <button className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20"><CheckCircle size={20}/></button>
              <button className="p-3 bg-white/5 text-gray-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={20}/></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderManagement;