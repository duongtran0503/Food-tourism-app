"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { 
  Phone, Shield, Calendar, Camera, 
  Loader2, CheckCircle2, Edit, KeyRound, 
  ChevronRight, LayoutGrid, Globe, ArrowLeft, 
  Fingerprint, LucideIcon, Store
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function MerchantProfilePage() {
  // Đã xóa phần params gây lỗi do đây không phải là dynamic route
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setProfile(res.data.data);
      } catch (error) {
        toast.error("Không thể tải hồ sơ Merchant");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
      <div className="relative flex items-center justify-center">
        <Loader2 className="animate-spin h-16 w-16 text-primary/20" />
        <Fingerprint className="absolute h-8 w-8 text-primary animate-pulse" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Đang tải hồ sơ...</p>
    </div>
  );

  // Lấy ID trực tiếp từ dữ liệu API trả về
  const userId = profile?._id || profile?.id || "N/A";

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <Link href="/merchant" className="hover:text-primary">Merchant</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">Quản Lý Hồ Sơ</span>
        </nav>
        <Link href="/merchant">
          <Button variant="ghost" size="sm" className="rounded-full gap-2 font-bold text-xs uppercase">
            <ArrowLeft size={14} /> Về Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-2xl shadow-black/5 bg-white/60 backdrop-blur-xl rounded-[3rem] overflow-hidden">
            <CardContent className="p-10 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-44 w-44 rounded-[2.5rem] p-1.5 border-2 border-dashed border-primary/20">
                  <img 
                    src={profile?.avatar || "https://www.gravatar.com/avatar/?d=mp"} 
                    className="h-full w-full rounded-[2.2rem] object-cover shadow-2xl" 
                    alt="avatar"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl border-4 border-white hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>

              <div className="space-y-1 mb-8">
                <h2 className="text-3xl font-black tracking-tighter text-slate-800">{profile?.fullName || "Chưa cập nhật tên"}</h2>
                <Badge variant="secondary" className="rounded-full px-4 font-bold">{profile?.email || "Chưa cập nhật email"}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-primary/5 p-4 rounded-3xl text-center">
                  <p className="text-[10px] font-black text-primary uppercase mb-1">Vai trò</p>
                  <p className="text-sm font-bold text-slate-700">{profile?.role === 'merchant' ? 'Đối tác' : profile?.role || 'Merchant'}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-3xl text-center">
                  <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Trạng thái</p>
                  <p className="text-sm font-bold text-slate-700 italic">Hoạt động</p>
                </div>
              </div>

              <div className="w-full pt-8 space-y-3">
                <Button className="w-full rounded-2xl h-12 font-bold bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800">
                  <Edit className="mr-2 h-4 w-4" /> Cập nhật hồ sơ
                </Button>
                <Button variant="outline" className="w-full rounded-2xl h-12 font-bold border-slate-200">
                  <KeyRound className="mr-2 h-4 w-4" /> Đổi mật khẩu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="sm:col-span-2 border-none shadow-2xl shadow-black/5 rounded-[3rem] p-10 bg-white/40 backdrop-blur-md">
            <div className="flex items-center gap-3 font-black text-xl uppercase tracking-tighter mb-10 text-slate-700 border-l-4 border-primary pl-4">
              <LayoutGrid className="text-primary" size={24} /> Thông Tin Liên Hệ
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <InfoItem label="Số điện thoại" value={profile?.phoneNumber || "Chưa cập nhật"} icon={Phone} />
               <InfoItem label="Ngày tham gia" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : "N/A"} icon={Calendar} />
               <InfoItem label="Khu vực" value="Hồ Chí Minh, VN" icon={Globe} />
               {/* Rút gọn ID cho dễ nhìn nhưng vẫn giữ tính độc nhất */}
               <InfoItem label="Mã Đối Tác" value={userId !== "N/A" ? userId.slice(-6).toUpperCase() : userId} icon={Shield} />
            </div>
          </Card>

          <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[3rem] p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                <Store size={24} />
              </div>
              <h4 className="text-xl font-black uppercase italic tracking-widest">Ghi chú bảo mật</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Tài khoản Merchant này được dùng để quản lý cửa hàng, thực đơn và theo dõi doanh thu. Vui lòng không chia sẻ tài khoản cho người khác.
              </p>
            </div>
            <div className="pt-6 font-mono text-[10px] opacity-40 uppercase">
               MERCHANT_ID: {userId}
            </div>
          </Card>

          <Card className="border-none shadow-2xl bg-primary text-white rounded-[3rem] p-10 flex flex-col justify-between">
            <div className="space-y-4">
               <CheckCircle2 size={40} className="opacity-30" />
               <h4 className="text-2xl font-black uppercase tracking-tighter leading-none">Đối Tác<br/>Xác Thực</h4>
            </div>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
               <div className="h-full w-[100%] bg-white" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-5 group">
      <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
        <Icon size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <span className="text-slate-800 font-bold tracking-tight text-lg">{value}</span>
      </div>
    </div>
  );
}