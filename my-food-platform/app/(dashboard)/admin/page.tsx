"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios"; 
import { RestaurantService } from "@/lib/restaurant-service"; 
import { io } from "socket.io-client"; 
import { 
  Users, Store, 
  Loader2, User, Calendar, ChevronRight, Activity 
} from "lucide-react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

const getLabel = (data: any, lang = "vi"): string => {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null) {
    const val = data[lang] || data.vi || data.en || Object.values(data)[0];
    return typeof val === "string" ? val : ""; 
  }
  return String(data);
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [latestActivities, setLatestActivities] = useState<any[]>([]);
  const [pendingRestaurants, setPendingRestaurants] = useState<any[]>([]);
  
  // STATE ĐẾM SỐ USER ONLINE THEO THỜI GIAN THỰC
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Đã gỡ bỏ revenue và orders
  const [dashboardStats, setDashboardStats] = useState({
    restaurants: 0,
    users: 0,
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const resData = await RestaurantService.getAll();
      const resItems = resData.data?.data?.items || resData.data?.items || [];
      const pending = resItems.filter((res: any) => res.status === 'pending' || !res.status);
      const approvedCount = resItems.filter((res: any) => res.status === 'approved').length;
      setPendingRestaurants(pending);

      let usersCount = 0;
      let usersList = [];
      try {
        const userRes = await api.get('/users');
        usersList = userRes.data?.data?.items || userRes.data?.items || [];
        usersCount = userRes.data?.data?.totalItems || usersList.length || 0;
      } catch (error) {}

      const formattedUsers = usersList.map((u: any) => ({
        id: u.id || u._id,
        name: u.fullName || u.email || "Người dùng mới",
        type: "USER",
        date: u.createdAt,
        status: "active"
      }));

      const formattedRes = resItems.map((r: any) => ({
        id: r.id || r._id,
        name: getLabel(r.name),
        type: "RESTAURANT",
        date: r.createdAt,
        status: r.status || "pending"
      }));

      const combined = [...formattedUsers, ...formattedRes]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7);

      setLatestActivities(combined);
      // Chỉ set lại những dữ liệu cần thiết
      setDashboardStats({ restaurants: approvedCount, users: usersCount });

    } catch (error) {
      toast.error("Lỗi đồng bộ dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Trỏ về Port 8080 của Backend
    const socket = io("http://localhost:8080", {
      transports: ['websocket'],
    });
    
    socket.on("connect", () => {
      console.log("Web Admin đã kết nối Socket thành công!");
    });

    socket.on("onlineUsersCount", (count) => {
      console.log("Số người online nhận được:", count);
      setOnlineUsers(count);
    });

    socket.on("connect_error", (err) => {
      console.log("Lỗi kết nối Socket Web:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Chỉ giữ lại thẻ Đối tác và Đang Online
  const displayStats = [
    { title: "Đối tác", value: dashboardStats.restaurants.toString(), icon: Store, color: "text-blue-600" },
    { title: "Đang Online", value: onlineUsers.toString(), icon: Activity, color: "text-pink-600" },
  ];

  return (
    <div className="space-y-8 p-2">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-800">Bảng điều hành</h1>
        <p className="text-muted-foreground font-medium">Hệ thống đang hoạt động ổn định. Kiểm tra các cập nhật mới nhất.</p>
      </div>

      {/* Điều chỉnh lại layout grid cho 2 thẻ: md:grid-cols-2 lg:grid-cols-2 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {displayStats.map((stat, index) => (
          <Card key={index} className="border-none shadow-xl shadow-slate-100/50 bg-white/80 backdrop-blur-md rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-slate-400 tracking-wider">{stat.title}</CardTitle>
              <div className={`p-2 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon size={16} />
              </div>
            </CardHeader>
            <CardContent>
              {loading && stat.title !== "Đang Online" ? (
                 <Loader2 className="animate-spin text-slate-200 h-6 w-6 mt-1" />
              ) : (
                <div className="text-2xl font-black text-slate-800">
                  {stat.title === "Đang Online" && <span className="inline-block h-3 w-3 mr-2 bg-green-500 rounded-full animate-pulse"></span>}
                  {stat.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 border-none shadow-xl shadow-slate-100/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold">Hoạt động mới nhất</CardTitle>
                    <CardDescription className="font-medium text-xs">Tổng số người dùng: {dashboardStats.users}</CardDescription>
                </div>
                <Users size={20} className="text-indigo-500 opacity-20" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="pl-8 text-[10px] font-bold uppercase text-slate-400">Tên / Đối tượng</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400 text-center">Loại</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase text-slate-400 text-right pr-8">Ngày tham gia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-slate-200" /></TableCell></TableRow>
                ) : latestActivities.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-20 text-slate-400 italic">Chưa có hoạt động mới</TableCell></TableRow>
                ) : latestActivities.map((item) => (
                  <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-8 py-4">
                      <div className="font-bold text-slate-700 text-sm">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">ID: {item.id.slice(-6)}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`border-none font-bold text-[9px] uppercase px-2 py-0.5 ${
                        item.type === 'USER' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {item.type === 'USER' ? <User size={10} className="mr-1"/> : <Store size={10} className="mr-1"/>}
                        {item.type === 'USER' ? 'Người dùng' : 'Đối tác'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="text-xs font-bold text-slate-500 flex items-center justify-end gap-1.5">
                        <Calendar size={12} className="text-slate-300" />
                        {new Date(item.date).toLocaleDateString('vi-VN')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-xl shadow-slate-100/50 rounded-[2rem] flex flex-col">
          <CardHeader className="px-8 py-6 border-b border-slate-100">
            <CardTitle className="text-lg font-bold">Yêu cầu chờ duyệt</CardTitle>
            <CardDescription className="font-medium text-xs">Có {pendingRestaurants.length} quán đang đợi bạn</CardDescription>
          </CardHeader>
          <CardContent className="px-8 py-6 flex-1">
            <div className="space-y-5">
              {loading ? (
                 <Loader2 className="animate-spin text-primary mx-auto" />
              ) : pendingRestaurants.length === 0 ? (
                <div className="text-center py-10 text-slate-400 italic text-sm">Sạch bóng yêu cầu!</div>
              ) : (
                pendingRestaurants.slice(0, 5).map((res) => (
                  <div key={res.id || res._id} className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-indigo-600 transition-colors">{getLabel(res.name)}</p>
                      <p className="text-[10px] font-medium text-slate-400">SĐT: {res.phoneNumber}</p>
                    </div>
                    <Link href="/admin/restaurants">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg">
                          <ChevronRight size={16} />
                        </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <Link href="/admin/restaurants" className="block mt-8">
              <Button variant="outline" className="w-full text-xs font-bold border-slate-100 text-slate-500 hover:bg-slate-50 rounded-xl py-5">
                ĐI ĐẾN TRANG PHÊ DUYỆT
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}