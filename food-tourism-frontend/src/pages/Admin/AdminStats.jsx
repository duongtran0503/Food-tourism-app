import React from 'react';
import { Users, Store, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminStats = () => {
  const stats = [
    { label: 'Tổng người dùng', value: '12,543', icon: Users, color: 'text-blue-400' },
    { label: 'Đối tác Quán ăn', value: '856', icon: Store, color: 'text-purple-400' },
    { label: 'Báo cáo vi phạm', value: '24', icon: AlertCircle, color: 'text-red-400' },
    { label: 'Trạng thái Server', value: '99.9%', icon: ShieldCheck, color: 'text-green-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <stat.icon className={stat.color} size={28} />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
          <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;