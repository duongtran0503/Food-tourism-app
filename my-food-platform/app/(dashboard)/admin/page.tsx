"use client";

import { 
  Users, 
  Store, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
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

// Dữ liệu mẫu (Sau này bạn sẽ fetch từ API)
const stats = [
  { title: "Tổng doanh thu", value: "128,450,000đ", icon: DollarSign, trend: "+12.5%", color: "text-green-600" },
  { title: "Quán ăn đối tác", value: "156", icon: Store, trend: "+4 quán mới", color: "text-blue-600" },
  { title: "Người dùng mới", value: "2,840", icon: Users, trend: "+18% tháng này", color: "text-purple-600" },
  { title: "Đơn hàng hôm nay", value: "432", icon: TrendingUp, trend: "Đang tăng", color: "text-orange-600" },
];

const pendingRestaurants = [
  { id: 1, name: "Phở Thìn Lò Đúc", owner: "Nguyễn Văn A", date: "22/03/2026", status: "Chờ duyệt" },
  { id: 2, name: "Bánh Mì Huỳnh Hoa", owner: "Lê Thị B", date: "21/03/2026", status: "Chờ duyệt" },
  { id: 3, name: "Pizza 4P's", owner: "Trần Văn C", date: "20/03/2026", status: "Chờ duyệt" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều hành hệ thống</h1>
        <p className="text-muted-foreground">Chào buổi chiều, Lợi. Đây là những gì đang diễn ra trên hệ thống hôm nay.</p>
      </div>

      {/* Grid thẻ thống kê */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">
                <span className="text-green-500 font-medium">{stat.trend}</span> so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Biểu đồ giả lập (Chiếm 4 cột) */}
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Biểu đồ tăng trưởng</CardTitle>
            <CardDescription>Thống kê lượng người dùng truy cập trong 7 ngày qua.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between gap-2 px-6">
            {/* Đây là nơi đặt Recharts. Tạm thời dùng các cột div để minh họa */}
            {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
              <div 
                key={i} 
                className="w-full bg-primary/20 hover:bg-primary transition-colors rounded-t-lg" 
                style={{ height: `${height}%` }}
              />
            ))}
          </CardContent>
        </Card>

        {/* Danh sách chờ duyệt (Chiếm 3 cột) */}
        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Phê duyệt đối tác</CardTitle>
            <CardDescription>Bạn có {pendingRestaurants.length} yêu cầu đăng ký mới.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pendingRestaurants.map((res) => (
                <div key={res.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{res.name}</p>
                    <p className="text-xs text-muted-foreground">Chủ: {res.owner}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2 text-xs border-green-500 text-green-600 hover:bg-green-50">
                      Duyệt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-primary text-xs">Xem tất cả yêu cầu</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}