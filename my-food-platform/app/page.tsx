"use client";

import Link from "next/link";
import { 
  MapPin, 
  Headphones, 
  Globe, 
  ArrowRight, 
  Utensils, 
  Smartphone, 
  Store,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* 1. HEADER / NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-md shadow-indigo-200">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-800">FOOD<span className="text-indigo-600">TOUR</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Tính năng</a>
            <a href="#app" className="hover:text-indigo-600 transition-colors">Tải Ứng dụng</a>
            <a href="#merchant-info" className="hover:text-indigo-600 transition-colors">Dành cho Chủ quán</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-xl px-5 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">Bắt đầu ngay</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decor background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-24 left-10 w-72 h-72 bg-indigo-400/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-400/20 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 text-center space-y-8">
          <Badge variant="outline" className="py-1.5 px-4 rounded-full border-indigo-200 text-indigo-700 bg-indigo-50 font-bold uppercase tracking-wider text-[10px] animate-bounce">
            📍 Bản đồ Ẩm thực Đa ngôn ngữ
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-800 max-w-4xl mx-auto leading-[1.1]">
            Đừng chỉ ăn, hãy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500 italic">Lắng nghe</span> câu chuyện.
          </h1>
          <p className="text-slate-500 font-medium text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Nền tảng Food Tourism kết hợp Bản đồ GPS và Thuyết minh âm thanh tự động (Audio Guide). Khám phá văn hóa ẩm thực địa phương qua từng bước chân của bạn.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Link giả lập hoặc điều hướng tải App */}
            <a href="#app">
              <Button size="lg" className="h-14 rounded-2xl px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-xl flex items-center gap-2">
                <Smartphone className="w-5 h-5" /> Tải App Du Lịch
              </Button>
            </a>
            
            {/* CHỈNH SỬA: Bấm vào đây bắt buộc phải qua trang Đăng nhập trước */}
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 rounded-2xl px-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-base flex items-center gap-2">
                <Store className="w-5 h-5" /> Quản lý Gian hàng
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section id="features" className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-800 mb-4">Trải nghiệm du lịch hoàn toàn mới</h2>
            <p className="text-slate-500">Khám phá những quán ăn ẩn mình trong ngõ hẻm mà chỉ người bản địa mới biết, và nghe những câu chuyện lịch sử đằng sau mỗi món ăn.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MapPin className="h-6 w-6 text-rose-500" />}
              bg="bg-rose-50"
              title="Bản đồ Đặc sản GPS"
              desc="Tự động định vị và gợi ý các quán ăn truyền thống, món ngon đặc sản xung quanh vị trí của bạn."
            />
            <FeatureCard 
              icon={<Headphones className="h-6 w-6 text-indigo-500" />}
              bg="bg-indigo-50"
              title="Audio Storytelling"
              desc="Quét mã hoặc đến gần quán để nghe thuyết minh tự động về nguồn gốc món ăn bằng chính ngôn ngữ của bạn."
            />
            <FeatureCard 
              icon={<Globe className="h-6 w-6 text-emerald-500" />}
              bg="bg-emerald-50"
              title="Hỗ trợ Đa ngôn ngữ"
              desc="Hệ thống nội dung và âm thanh được dịch thuật chuẩn xác sang Tiếng Anh, Nhật, Trung, Hàn và Nga."
            />
          </div>
        </div>
      </section>

      {/* 4. MERCHANT CTA SECTION */}
      <section id="merchant-info" className="py-24 container mx-auto px-4">
        <div className="bg-indigo-600 rounded-[3rem] overflow-hidden relative shadow-2xl shadow-indigo-600/20">
          <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center p-12 lg:p-20">
            <div className="space-y-6 text-white relative z-10">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1.5 font-bold uppercase tracking-wider text-[10px]">
                Dành cho Nhà hàng / Quán ăn
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                Đưa hương vị của bạn lên bản đồ du lịch thế giới.
              </h2>
              <p className="text-indigo-100 text-lg">
                Đăng ký trở thành đối tác của FoodTour để tự quản lý hồ sơ, tải lên âm thanh giới thiệu và tiếp cận hàng ngàn khách du lịch quốc tế mỗi ngày.
              </p>
              <ul className="space-y-3 pt-2">
                {['Miễn phí đăng ký gian hàng', 'Tự upload Audio MP3', 'Cập nhật Menu đa ngôn ngữ'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-indigo-50">
                    <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-emerald-900" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              {/* NÚT ĐĂNG KÝ CHO ĐỐI TÁC MỚI */}
              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/register">
                  <Button className="h-14 rounded-2xl px-8 bg-white text-indigo-600 hover:bg-slate-50 font-black text-base shadow-xl">
                    Đăng ký Đối tác mới
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="h-14 rounded-2xl px-8 bg-indigo-700/50 text-white hover:bg-indigo-800 font-bold text-base border border-indigo-400/30">
                    Đăng nhập Cửa hàng
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Mockup Dashboard */}
            <div className="relative z-10 hidden lg:block">
              <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center relative">
                  <PlayCircle className="w-16 h-16 text-white/50" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="w-1/2 h-2 bg-white/20 rounded-full mb-2"></div>
                    <div className="w-3/4 h-2 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm font-medium">
          <p>© 2026 FoodTour Platform. Hệ sinh thái bản đồ ẩm thực du lịch.</p>
        </div>
      </footer>
    </div>
  );
}

// Sub-components 
function FeatureCard({ icon, title, desc, bg }: { icon: React.ReactNode, title: string, desc: string, bg: string }) {
  return (
    <Card className="border border-slate-100 shadow-xl shadow-slate-100/50 bg-white group hover:-translate-y-2 transition-transform duration-300 rounded-3xl">
      <CardContent className="pt-8 pb-8 px-6 text-center space-y-5">
        <div className={`h-16 w-16 ${bg} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-black text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}