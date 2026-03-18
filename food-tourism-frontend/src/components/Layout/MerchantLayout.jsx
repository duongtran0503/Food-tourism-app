import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Utensils, Bell, LogOut, MapPin } from 'lucide-react';

const MerchantLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, path: '/merchant/dashboard' },
    { id: 'menu', label: 'Quản lý Menu', icon: Utensils, path: '/merchant/menu' },
    { id: 'orders', label: 'Đơn hàng', icon: Bell, path: '/merchant/orders', badge: '12' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans overflow-hidden">
      {/* SIDEBAR DÙNG CHUNG */}
      <aside className="w-80 bg-[#020617]/80 border-r border-white/10 p-6 flex flex-col backdrop-blur-3xl h-screen sticky top-0">
        <div className="relative mb-12 px-2 py-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[20px] flex items-center justify-center font-black text-2xl shadow-2xl shadow-orange-500/20">M</div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">Merchant</h1>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em]">Food Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="relative group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 outline-none"
              >
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg rounded-2xl" />
                )}
                <div className={`relative z-10 flex items-center gap-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  <item.icon size={22} />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="relative z-10 bg-orange-500/10 text-orange-500 text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
        
        <button className="mt-auto pt-6 border-t border-white/5 flex items-center gap-4 px-5 py-4 text-red-400/60 font-bold hover:text-red-400">
          <LogOut size={20} /> <span className="text-sm">Đăng xuất</span>
        </button>
      </aside>

      {/* NỘI DUNG THAY ĐỔI THEO ĐỊA CHỈ (URL) */}
      <main className="flex-1 h-screen overflow-y-auto p-12 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <header className="mb-12 relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Quản lý cửa hàng 👋</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm"><MapPin size={16} className="text-orange-500"/> Phở Cồ Gia Truyền</div>
        </header>
        
        {/* Đây là nơi nội dung của Overview, MenuManagement, OrderManagement sẽ hiện ra */}
        <Outlet />
      </main>
    </div>
  );
};

export default MerchantLayout;