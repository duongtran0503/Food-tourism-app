"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Store, BarChart3, Users, 
  LogOut, UtensilsCrossed, ShieldCheck
} from "lucide-react";

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const adminNavItems = [
  { title: "Tổng quan", url: "/admin", icon: LayoutDashboard },
  { title: "Nhà hàng", url: "/admin/restaurants", icon: Store },
  { title: "Người dùng", url: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setAdmin(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi đọc session:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  const userId = admin?.id || admin?._id;
  const profileUrl = userId ? `/admin/profile/${userId}` : "#";

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-100 bg-white">
      {/* 🔝 HEADER */}
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-slate-50">
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
            <UtensilsCrossed className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter group-data-[collapsible=icon]:hidden uppercase text-slate-800">
            Food<span className="text-indigo-600">Admin</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
            Hệ thống quản trị
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1">
              {adminNavItems.map((item) => {
                // 🛠️ LOGIC: Fix lỗi Tổng quan luôn active
                const isActive = item.url === "/admin" 
                  ? pathname === "/admin" 
                  : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`
                        h-12 rounded-xl transition-all duration-200
                        /* 🟢 KHI ĐƯỢC CHỌN (ACTIVE) */
                        data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-600
                        /* ⚪ KHI RÊ CHUỘT (HOVER) -> Không có hiệu ứng nền */
                        hover:bg-transparent hover:text-slate-800
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                        <span className="font-bold text-sm tracking-tight">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 👤 FOOTER */}
      <SidebarFooter className="border-t border-slate-50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link 
              href={profileUrl} 
              className={`flex items-center gap-3 p-2 rounded-2xl transition-all ${
                profileUrl !== "#" && pathname.includes(profileUrl) ? "bg-indigo-50/50 border border-indigo-100" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 border border-indigo-200 overflow-hidden">
                {admin?.avatar ? (
                  <img src={admin.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                )}
              </div>
              
              <div className="flex flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-black truncate text-slate-800 leading-none mb-1 uppercase tracking-tighter">
                  {admin?.fullName || "Admin Lợi"}
                </span>
                <span className="text-[10px] text-slate-400 truncate font-medium italic">
                  {admin?.email || "admin@foodtour.vn"}
                </span>
              </div>
            </Link>

            <SidebarMenuButton 
                onClick={handleLogout}
                className="mt-4 w-full justify-start text-slate-400 hover:text-red-500 hover:bg-transparent rounded-xl h-10 transition-colors"
                tooltip="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-black text-[10px] uppercase tracking-widest group-data-[collapsible=icon]:hidden">Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}