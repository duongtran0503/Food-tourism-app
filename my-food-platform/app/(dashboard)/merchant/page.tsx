"use client";

import { 
  ShoppingBag, 
  Users, 
  Star, 
  MapPin, 
  ArrowUpRight, 
  Utensils,
  Clock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Dữ liệu mẫu cho Merchant
const merchantStats = [
  { title: "Doanh thu hôm nay", value: "2,450,000đ", icon: ShoppingBag, trend: "+15%", color: "text-orange-600" },
  { title: "Đơn hàng mới", value: "12", icon: Utensils, trend: "4 đơn chờ", color: "text-blue-600" },
  { title: "Khách ghé qua GPS", value: "85", icon: MapPin, trend: "+12 lượt", color: "text-green-600" },
  { title: "Đánh giá quán", value: "4.8/5", icon: Star, trend: "20 lượt", color: "text-yellow-500" },
];

const recentOrders = [
  { id: "#ORD-001", items: "Phở Bò, Trà Đá", total: "70,000đ", time: "5 phút trước", status: "Mới" },
  { id: "#ORD-002", items: "Bún Chả, Nước Sâm", total: "55,000đ", time: "12 phút trước", status: "Đang làm" },
  { id: "#ORD-003", items: "Cơm Tấm Ba Rọi", total: "45,000đ", time: "20 phút trước", status: "Đã giao" },
];

export default function MerchantDashboard() {
  return (
    <div className="space-y-8">
      {/* Header Chào mừng */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Kênh Quản Lý Cửa Hàng</h1>
          <p className="text-muted-foreground">Chúc bạn một ngày buôn may bán đắt, Phở Thìn Lò Đúc!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Xem báo cáo tháng</Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20">
            Tạo khuyến mãi
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {merchantStats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1 italic">
                {stat.trend} so với hôm qua
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Cột trái: Đơn hàng gần đây */}
        <Card className="col-span-4 border-none shadow-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Đơn hàng vừa nhận</CardTitle>
              <CardDescription>Danh sách các khách hàng vừa đặt món.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-orange-600">Xem tất cả</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-orange-200 transition-all cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                      {order.id.slice(-3)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{order.items}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {order.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-bold text-orange-600">{order.total}</p>
                    <Badge variant={order.status === "Mới" ? "default" : "secondary"} className={order.status === "Mới" ? "bg-blue-500" : ""}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cột phải: Trạng thái Food Tourism */}
        <Card className="col-span-3 border-none shadow-sm bg-orange-500 text-white overflow-hidden relative">
          {/* Decor background */}
          <div className="absolute top-[-20px] right-[-20px] h-32 w-32 bg-white/10 rounded-full blur-3xl" />
          
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Trạng thái GPS
            </CardTitle>
            <CardDescription className="text-orange-100">Cửa hàng của bạn đang hiển thị trên bản đồ du lịch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-xs uppercase font-bold tracking-widest text-orange-100">Tọa độ hiện tại</p>
              <p className="text-lg font-mono mt-1">10.762, 106.660</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-xs uppercase font-bold tracking-widest text-orange-100">Audio thuyết minh</p>
              <p className="text-sm mt-1 font-medium">✅ Đã tải lên (giới thiệu_pho_thin.mp3)</p>
            </div>
            <Button variant="secondary" className="w-full font-bold text-orange-600 py-6 text-md rounded-xl shadow-xl">
              Chỉnh sửa thông tin Food Tourism
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}