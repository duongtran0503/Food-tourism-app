import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Store, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 bg-white/5 backdrop-blur-2xl rounded-[30px] border border-white/10 shadow-2xl">
          <CheckCircle size={80} className="text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white">Đăng ký thành công!</h2>
          <p className="text-gray-400 mt-2">Đang chuyển hướng đến trang đăng nhập...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-4">
      {/* Glow Effects */}
      <div className="absolute w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[200px] -top-40 -right-40 animate-pulse"/>
      <div className="absolute w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[200px] -bottom-40 -left-40 animate-pulse"/>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-[30px] shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row-reverse">
        
        {/* RIGHT SIDE: Brand/Message */}
        <div className="hidden md:flex md:w-5/12 relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 to-black/60 p-12 flex flex-col justify-between text-white">
            <h2 className="text-3xl font-black uppercase">Gia nhập cộng đồng</h2>
            <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs text-white">1</div> Tạo tài khoản</div>
                <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs text-white">2</div> Chọn vai trò</div>
            </div>
          </div>
        </div>

        {/* LEFT SIDE: Form */}
        <div className="w-full md:w-7/12 p-10 md:p-14 text-white">
          <button onClick={() => navigate('/login')} className="flex items-center text-sm text-gray-400 hover:text-orange-500 mb-8 transition-colors"><ArrowLeft size={18} className="mr-2" /> Quay lại đăng nhập</button>
          <h2 className="text-4xl font-black mb-2">Bắt đầu hành trình</h2>
          <p className="text-gray-400 mb-10">Tạo tài khoản mới của bạn</p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button type="button" onClick={() => setFormData({...formData, role: 'user'})} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.role === 'user' ? 'border-orange-500 bg-orange-500/10 text-orange-500 shadow-lg shadow-orange-500/20' : 'border-white/10 bg-white/5 text-gray-500'}`}>
                <User size={24} /> <span className="text-xs font-bold uppercase">Khách du lịch</span>
              </button>
              <button type="button" onClick={() => setFormData({...formData, role: 'merchant'})} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.role === 'merchant' ? 'border-orange-500 bg-orange-500/10 text-orange-500 shadow-lg shadow-orange-500/20' : 'border-white/10 bg-white/5 text-gray-500'}`}>
                <Store size={24} /> <span className="text-xs font-bold uppercase">Chủ quán ăn</span>
              </button>
            </div>

            <div className="space-y-4 text-white">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input type="text" required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-600" placeholder="Họ và tên của bạn" onChange={(e) => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input type="email" required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-600" placeholder="Email của bạn" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input type={showPassword ? 'text' : 'password'} required className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-600" placeholder="Mật khẩu bảo mật" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl font-bold text-white hover:scale-[1.02] active:scale-95 transition shadow-lg shadow-orange-500/20">Tạo tài khoản ngay</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;