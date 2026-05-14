"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  ArrowUpRight, 
  Utensils,
  Store,
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  MenuSquare
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MerchantDashboard() {
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy thông tin quán ăn của Merchant
  const fetchMyStore = async () => {
    setLoading(true);
    try {
      const res = await api.get("/restaurants/my-restaurant"); 
      let store = res.data?.data || res.data;
      if (store && store.data && store.id === undefined) {
          store = store.data;
      }
      if (store && (store.id || store._id)) {
        setStoreData(store);
      }
    } catch (error: any) {
      console.log("Chưa có cửa hàng hoặc lỗi tải:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStore();
  }, []);

  // Hàm kiểm tra xem quán đã có audio ở bất kỳ ngôn ngữ nào chưa
  const hasAudio = () => {
    const audioData = storeData?.audioUrl || storeData?.audioUrlRaw;
    if (!audioData) return false;
    const audios = Object.values(audioData);
    return audios.some(url => typeof url === 'string' && url.length > 0);
  };

  // Trợ thủ lấy text đa ngôn ngữ (ưu tiên tiếng Việt)
  const getLabel = (data: any): string => {
    if (!data) return "Chưa cập nhật";
    if (typeof data === "string") return data;
    return data.vi || data.en || "Chưa cập nhật";
  };

  // Các thẻ thống kê mới phù hợp với mô hình Thông tin Du lịch
  const merchantStats = [
    { 
      title: "Trạng thái hiển thị", 
      value: storeData?.status === 'approved' ? "Đã duyệt" : (storeData ? "Chờ duyệt" : "Chưa có"), 
      icon: storeData?.status === 'approved' ? CheckCircle2 : Clock, 
      trend: storeData?.status === 'approved' ? "Đang xuất hiện trên App" : "Admin đang xử lý", 
      color: storeData?.status === 'approved' ? "text-emerald-600" : "text-amber-600", 
      bg: storeData?.status === 'approved' ? "bg-emerald-50" : "bg-amber-50" 
    },
    { 
      title: "Món ăn đặc sản", 
      value: storeData?.foods?.length?.toString() || storeData?.menu?.length?.toString() || "0", 
      icon: Utensils, 
      trend: "Món trong thực đơn", 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    
    { 
      title: "Đánh giá của khách", 
      value: "Chưa có", // Dữ liệu giả lập
      icon: Star, 
      trend: "0 lượt đánh giá", 
      color: "text-rose-500", 
      bg: "bg-rose-50" 
    },
  ];

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Store className="text-indigo-600" /> Tổng quan Đối tác
          </h1>
          <p className="text-sm text-muted-foreground italic">Quản lý nội dung hiển thị trên bản đồ Food Tourism</p>
        </div>
      </div>

      {/* CẢNH BÁO NẾU CHƯA CÓ CỬA HÀNG */}
      {!storeData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-500 shrink-0" />
            <span className="font-bold text-sm">Bạn chưa khởi tạo thông tin cửa hàng! Hãy đăng ký ngay để thu hút khách du lịch.</span>
          </div>
          <Link href="/merchant/my-store">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 font-bold rounded-xl shadow-sm">
              Tạo hồ sơ ngay
            </Button>
          </Link>
        </div>
      )}

      {/* 4 THẺ THỐNG KÊ (Đã đổi thành dữ liệu Thông tin/Menu) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {merchantStats.map((stat, index) => (
          <Card key={index} className="border shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 bg-slate-50/50 border-b">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-slate-300" /> {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Cột trái: Bảng điều khiển Quản lý Nội dung (Thay thế cho Đơn hàng) */}
        <Card className="col-span-4 border shadow-sm bg-white rounded-xl overflow-hidden flex flex-col">
          <CardHeader className="bg-slate-50/50 border-b p-5">
            <CardTitle className="font-bold text-slate-800 flex items-center gap-2">
              <MenuSquare className="h-5 w-5 text-indigo-600" /> Quản lý nội dung cửa hàng
            </CardTitle>
            <CardDescription className="text-xs mt-1">Cập nhật thông tin để khách hàng dễ dàng tìm thấy bạn.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-5 flex-1 flex flex-col justify-center">
            {storeData ? (
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-800">{getLabel(storeData?.name || storeData?.nameRaw)}</h3>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" /> {getLabel(storeData?.address || storeData?.addressRaw)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link href="/merchant/my-store" className="block">
                    <Button variant="outline" className="w-full h-14 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl flex flex-col items-center justify-center gap-1">
                      <span>Cập nhật Thông tin & Audio</span>
                    </Button>
                  </Link>
                  <Link href="/merchant/foods" className="block">
                    <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl shadow-md shadow-indigo-200 flex flex-col items-center justify-center gap-1">
                      <span>Quản lý Món ăn đặc sản</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 opacity-50">
                <Store className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">Hồ sơ trống</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cột phải: Trạng thái Bản đồ GPS (Giữ nguyên vì rất cần thiết) */}
        <Card className="col-span-3 border-none shadow-md bg-indigo-600 text-white overflow-hidden relative rounded-xl">
          <div className="absolute top-[-40px] right-[-40px] h-48 w-48 bg-indigo-400/30 rounded-full blur-3xl pointer-events-none" />
          
          <CardHeader className="relative z-10 p-5 pb-3">
            <CardTitle className="flex items-center gap-2 font-bold text-lg text-white">
              <MapPin className="h-5 w-5" /> Trạng thái Bản đồ
            </CardTitle>
            <CardDescription className="text-indigo-200 mt-1">
              Thông tin định vị dành cho du khách.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10 p-5 pt-0">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Tọa độ hiện tại</p>
              <p className="text-base font-mono font-bold mt-1 text-white">
                {storeData?.location?.lat ? `${storeData.location.lat.toFixed(4)}, ${storeData.location.lng.toFixed(4)}` : "Chưa cập nhật"}
              </p>
            </div>
            
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Audio thuyết minh</p>
              {hasAudio() ? (
                <p className="text-sm mt-1 font-medium text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Đã tải lên hệ thống
                </p>
              ) : (
                <p className="text-sm mt-1 font-medium text-amber-200 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  Chưa có audio
                </p>
              )}
            </div>

            <Link href="/merchant/my-store" className="block mt-2">
              <Button variant="secondary" className="w-full bg-white hover:bg-slate-50 text-indigo-600 font-bold shadow-md transition-all">
                Kiểm tra tọa độ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}