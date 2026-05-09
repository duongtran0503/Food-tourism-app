"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { LayoutDashboard, UtensilsCrossed, MapPin, Music, LogOut, Store, Tags, StoreIcon } from "lucide-react";

import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, 
  SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel, SidebarGroupContent 
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const merchantNavItems = [
  {
    title: "Tổng quan cửa hàng",
    url: "/merchant",
    icon: LayoutDashboard,
  },
  {
    title: "Thông tin cửa hàng",
    url: "/merchant/my-store",
    icon: StoreIcon,
  },
  {
    title: "Danh mục món ăn",
    url: "/merchant/categories",
    icon: Tags,
  },
  {
    title: "Quản lý món ăn",
    url: "/merchant/foods",
    icon: UtensilsCrossed,
  },
];

export function MerchantSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [merchant, setMerchant] = useState<any>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setMerchant(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi đọc session:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-200 bg-slate-50/30">
      {/* Header Logo */}
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-slate-200/60">
        <Link href="/merchant" className="flex items-center gap-3 px-2 w-full">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="font-black italic text-xl tracking-tighter text-slate-800 group-data-[collapsible=icon]:hidden">
            MERCHANT<span className="text-indigo-600">HUB</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="scroll-smooth mt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Vận hành hệ thống
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 px-2">
              {merchantNavItems.map((item) => {
                const isActive = item.url === "/merchant" 
                  ? pathname === "/merchant" 
                  : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-11 rounded-xl transition-all hover:bg-indigo-50 hover:text-indigo-700 data-[active=true]:bg-indigo-600 data-[active=true]:text-white font-bold text-slate-600"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200/60 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link 
              href="/merchant/profile" 
              className="flex items-center gap-3 px-2 py-3 group-data-[collapsible=icon]:hidden rounded-xl hover:bg-indigo-50/80 transition-colors cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 overflow-hidden shadow-inner">
                {merchant?.avatar ? (
                  <img src={merchant.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <Store className="h-5 w-5 text-indigo-400" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-sm font-bold truncate text-slate-800 group-hover:text-indigo-700 transition-colors">
                  {merchant?.fullName || "Đang tải..."}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest truncate mt-0.5">
                  {merchant?.email || "ĐỐI TÁC CỬA HÀNG"}
                </span>
              </div>
            </Link>
            
            <SidebarMenuButton 
                onClick={handleLogout}
                className="mt-1 h-11 w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 font-bold rounded-xl transition-colors"
                tooltip="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Thoát kênh bán</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}