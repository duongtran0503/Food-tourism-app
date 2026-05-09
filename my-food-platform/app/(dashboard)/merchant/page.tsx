"use client";

import { 
  ShoppingBag, 
  Star, 
  MapPin, 
  ArrowUpRight, 
  Utensils,
  Clock,
  Store
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

const merchantStats = [
  { title: "Doanh thu hôm nay", value: "2,450,000đ", icon: ShoppingBag, trend: "+15%", color: "text-indigo-600", bg: "bg-indigo-50" },
  { title: "Đơn hàng mới", value: "12", icon: Utensils, trend: "4 đơn chờ", color: "text-blue-500", bg: "bg-blue-50" },
  { title: "Khách ghé qua GPS", value: "85", icon: MapPin, trend: "+12 lượt", color: "text-emerald-500", bg: "bg-emerald-50" },
  { title: "Đánh giá quán", value: "4.8/5", icon: Star, trend: "20 lượt", color: "text-amber-500", bg: "bg-amber-50" },
];

const recentOrders = [
  { id: "#ORD-001", items: "Phở Bò, Trà Đá", total: "70,000đ", time: "5 phút trước", status: "Mới" },
  { id: "#ORD-002", items: "Bún Chả, Nước Sâm", total: "55,000đ", time: "12 phút trước", status: "Đang làm" },
  { id: "#ORD-003", items: "Cơm Tấm Ba Rọi", total: "45,000đ", time: "20 phút trước", status: "Đã giao" },
];

export default function MerchantDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Chào mừng - Font chữ gọn gàng giống Categories */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Store className="text-indigo-600" /> Tổng quan cửa hàng
          </h1>
          <p className="text-sm text-muted-foreground italic">Theo dõi doanh thu và trạng thái hoạt động</p>
        </div>
        {/* Đã xóa 2 nút Báo cáo tháng & Tạo khuyến mãi */}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {merchantStats.map((stat, index) => (
          <Card key={index} className="border shadow-sm bg-white rounded-xl overflow-hidden">
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
                <ArrowUpRight className="h-3 w-3 text-emerald-500" /> {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Cột trái: Đơn hàng gần đây */}
        <Card className="col-span-4 border shadow-sm bg-white rounded-xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between p-4">
            <div>
              <CardTitle className="font-bold text-slate-800">Đơn hàng vừa nhận</CardTitle>
              <CardDescription className="text-xs mt-1">Khách hàng vừa đặt món trực tuyến.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-indigo-600 font-medium">
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                      {order.id.slice(-3)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{order.items}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {order.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1 flex flex-col items-end">
                    <p className="text-sm font-bold text-indigo-600">{order.total}</p>
                    <Badge variant="secondary" className={`font-mono text-[10px] border-none ${order.status === "Mới" ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"}`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cột phải: Trạng thái Food Tourism */}
        <Card className="col-span-3 border-none shadow-md bg-indigo-600 text-white overflow-hidden relative rounded-xl">
          {/* Decor background */}
          <div className="absolute top-[-40px] right-[-40px] h-48 w-48 bg-indigo-400/30 rounded-full blur-3xl pointer-events-none" />
          
          <CardHeader className="relative z-10 p-5 pb-3">
            <CardTitle className="flex items-center gap-2 font-bold text-lg text-white">
              <MapPin className="h-5 w-5" /> Trạng thái GPS
            </CardTitle>
            <CardDescription className="text-indigo-200 mt-1">
              Điểm đến của bạn trên bản đồ Food Tourism.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10 p-5 pt-0">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Tọa độ hiện tại</p>
              <p className="text-base font-mono font-bold mt-1 text-white">10.762, 106.660</p>
            </div>
            
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Audio thuyết minh</p>
              <p className="text-sm mt-1 font-medium text-white flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Đã tải lên hệ thống
              </p>
            </div>

            <Button variant="secondary" className="w-full bg-white hover:bg-slate-50 text-indigo-600 font-bold shadow-md mt-2 transition-all">
              Chỉnh sửa thông tin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}