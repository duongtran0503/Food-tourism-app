import React from 'react';
import { DollarSign, Package, Star, TrendingUp } from 'lucide-react';

const Overview = () => {
  const stats = [
    { label: 'Doanh thu hôm nay', value: '2.450.000đ', icon: DollarSign, color: 'text-green-400' },
    { label: 'Đơn hàng mới', value: '12', icon: Package, color: 'text-blue-400' },
    { label: 'Đánh giá trung bình', value: '4.8/5', icon: Star, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <stat.icon className={stat.color} size={28} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>
      {/* Có thể thêm biểu đồ doanh thu tại đây */}
    </div>
  );
};

export default Overview;