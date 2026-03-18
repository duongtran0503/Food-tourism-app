import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Search, Heart, User, LogOut, Menu, X, Compass, Navigation2 } from 'lucide-react';

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hiệu ứng đổi màu Nav khi cuộn trang
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Khám phá', path: '/', icon: Compass },
    { label: 'Hành trình', path: '/tours', icon: Navigation2 },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-orange-500/30">
      {/* 🟢 NAVIGATION BAR */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-12 py-4 ${
          isScrolled 
          ? 'bg-[#020617]/70 backdrop-blur-2xl border-b border-white/5 py-3' 
          : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="w-11 h-11 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              F
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              FoodTour
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                  location.pathname === link.path ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="activeUserNav"
                    className="absolute inset-0 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex p-3 text-gray-400 hover:text-orange-500 hover:bg-white/5 rounded-xl transition-all">
              <Heart size={22} />
            </button>
            
            <div 
              className="group flex items-center gap-3 pl-3 pr-1.5 py-1.5 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-orange-500/50 transition-all"
              onClick={() => navigate('/profile')}
            >
              <span className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-widest">Lợi Nguyễn</span>
              <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-orange-500 to-yellow-500 p-[2px]">
                <div className="w-full h-full rounded-[10px] bg-[#020617] flex items-center justify-center text-[10px] font-black">LN</div>
              </div>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-3 text-gray-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#020617] pt-28 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl text-xl font-black uppercase italic italic tracking-tighter"
                >
                  <link.icon size={24} className="text-orange-500" />
                  {link.label}
                </button>
              ))}
              <button className="flex items-center gap-4 p-6 text-red-400 font-bold">
                <LogOut size={24} /> Đăng xuất
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔵 MAIN CONTENT */}
      <main className="relative">
        {/* Background Glows */}
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        {/* Nội dung trang (Explore, FoodTourList, v.v.) */}
        <div className="pt-24 min-h-screen">
          <Outlet />
        </div>
      </main>

      {/* 🟠 FOOTER Tinh tế */}
      <footer className="py-12 px-8 border-t border-white/5 text-center text-gray-600">
        <p className="text-xs font-bold uppercase tracking-[0.3em]">© 2026 Food Tourism App • Seminar Project</p>
      </footer>
    </div>
  );
};

export default UserLayout;