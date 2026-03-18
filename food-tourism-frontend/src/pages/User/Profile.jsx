import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Bookmark, History, 
  ShieldCheck, MapPin, Bell, ChevronRight , LogOut
} from 'lucide-react';

const Profile = () => {
  // Dữ liệu giả lập cho User
  const userData = {
    name: "Lợi Nguyễn",
    email: "loinguyen@foodtour.com",
    level: "Thực thần Level 5",
    toursCount: 12,
    avatarInitials: "LN"
  };

  const menuOptions = [
    { label: 'Địa điểm đã lưu', icon: Bookmark, desc: '24 quán ăn yêu thích', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Lịch sử hành trình', icon: History, desc: 'Xem lại các tour đã tham gia', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Bảo mật tài khoản', icon: ShieldCheck, desc: 'Mật khẩu & Quyền riêng tư', color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Thông báo', icon: Bell, desc: 'Cập nhật tin tức món ngon', color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      {/* 🟠 HEADER PROFILE CARD */}
      <div className="relative p-8 md:p-12 bg-white/5 border border-white/10 rounded-[50px] overflow-hidden backdrop-blur-3xl">
        {/* Glow hiệu ứng */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full -z-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar với Gradient */}
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-orange-500 to-yellow-500 p-1 relative z-10">
              <div className="w-full h-full rounded-[38px] bg-[#020617] flex items-center justify-center text-4xl font-black text-white">
                {userData.avatarInitials}
              </div>
            </div>
          </div>

          <div className="text-center md:text-left flex-1 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h2 className="text-4xl font-black tracking-tight text-white">{userData.name}</h2>
              <span className="w-fit mx-auto md:mx-0 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold uppercase text-orange-500">
                {userData.level}
              </span>
            </div>
            <p className="text-gray-400 font-medium">{userData.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <MapPin size={14} className="text-orange-500"/> Hà Nội, Việt Nam
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <History size={14} className="text-blue-500"/> {userData.toursCount} Tours
              </div>
            </div>
          </div>

          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:scale-110 transition-all text-gray-400 hover:text-white">
            <Settings size={22} />
          </button>
        </div>
      </div>

      {/* 🔵 GRID MENU OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuOptions.map((item, i) => (
          <motion.button 
            key={i}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[32px] hover:border-white/30 transition-all text-left group overflow-hidden relative"
          >
            <div className="flex items-center gap-6 relative z-10">
              <div className={`p-4 ${item.bg} rounded-2xl group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div>
                <p className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors">{item.label}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{item.desc}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-700 group-hover:text-white transition-colors" />
            
            {/* Hiệu ứng tia sáng chạy qua khi hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        ))}
      </div>

      {/* 🔴 DANGER ZONE */}
      <div className="pt-4">
        <button className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-[24px] text-red-500 font-bold text-sm transition-all flex items-center justify-center gap-2">
          <LogOut size={18} /> ĐĂNG XUẤT TÀI KHOẢN
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;