import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Store, Map, LogOut, Bell } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'stats', label: 'Thống kê', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: 'Người dùng', icon: Users, path: '/admin/users' },
    { id: 'merchants', label: 'Duyệt quán', icon: Store, path: '/admin/approve', badge: '5' },
    { id: 'tours', label: 'Quản lý Tour', icon: Map, path: '/admin/tours' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans overflow-hidden">
      {/* SIDEBAR - Tông màu xanh chuyên nghiệp */}
      <aside className="w-80 bg-[#020617]/80 border-r border-white/10 p-6 flex flex-col backdrop-blur-3xl h-screen sticky top-0 z-50">
        <div className="relative mb-12 px-2 py-4">
          <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full -z-10 opacity-50" />
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[20px] flex items-center justify-center font-black text-2xl shadow-2xl text-white">A</div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Admin</h1>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.15em]">Control Panel</span>
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
                  <motion.div layoutId="activeAdminNav" className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg rounded-2xl" />
                )}
                <div className={`relative z-10 flex items-center gap-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  <item.icon size={22} />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="relative z-10 bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <button className="mt-auto pt-6 border-t border-white/5 flex items-center gap-4 px-5 py-4 text-red-400/60 font-bold hover:text-red-400">
          <LogOut size={20} /> <span className="text-sm">Đăng xuất</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-screen overflow-y-auto relative p-12">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <header className="mb-10 relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Hệ thống Quản trị 👋</h1>
            <p className="text-gray-400 text-sm italic">Chào mừng trở lại, Admin Lợi Nguyễn</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white"><Bell size={20}/></button>
             <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">AD</div>
          </div>
        </header>

        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;