import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@food.com" && password === "123456") {
      navigate("/admin/dashboard");
    } else {
      setError("Email hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">

      {/* Animated gradient background */}
      <div className="absolute w-[800px] h-[800px] bg-orange-500/20 rounded-full blur-[200px] animate-pulse -top-40 -left-40"/>
      <div className="absolute w-[700px] h-[700px] bg-blue-500/20 rounded-full blur-[200px] animate-pulse -bottom-40 -right-40"/>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-[30px] shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden flex"
      >

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden group">

          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
            alt=""
          />

          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-black/80 p-12 flex flex-col justify-between text-white">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-orange-600 font-black text-xl">
                F
              </div>
              <span className="text-xl font-bold uppercase tracking-wide">
                Food Tour
              </span>
            </div>

            <div>
              <h2 className="text-5xl font-black leading-tight mb-4">
                Khám phá <br /> ẩm thực Việt
              </h2>

              <p className="text-white/80 max-w-sm">
                Đăng nhập để bắt đầu hành trình khám phá các món ăn nổi tiếng
                khắp Việt Nam.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-12 text-white">

          <h2 className="text-3xl font-bold mb-2">
            Chào mừng trở lại 👋
          </h2>

          <p className="text-gray-400 mb-8">
            Đăng nhập để tiếp tục
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400">Email</label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400">Mật khẩu</label>

              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="relative w-full py-4 rounded-xl font-bold text-white overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02] transition"
            >
              <span className="flex items-center justify-center gap-2">
                Đăng nhập
                <ArrowRight size={20}/>
              </span>
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-white/10"/>
            <span className="px-4 text-xs text-gray-500">
              HOẶC
            </span>
            <div className="flex-1 h-px bg-white/10"/>
          </div>

          {/* Social login */}
          <div className="flex gap-4">

            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
              <Chrome size={18} className="text-red-400"/>
              Google
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
              <Github size={18}/>
              Github
            </button>

          </div>

          <p className="text-center mt-8 text-gray-400 text-sm">
            Chưa có tài khoản?
            <button
              onClick={() => navigate("/register")}
              className="text-orange-500 ml-2 font-semibold hover:underline"
            >
              Đăng ký
            </button>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;