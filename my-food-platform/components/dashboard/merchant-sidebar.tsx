"use client";

import * as React from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  MapPin,
  Music,
  LogOut,
  Store,
  Tags,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const merchantNavItems = [
  {
    title: "Tổng quan quán",
    url: "/merchant",
    icon: LayoutDashboard,
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
  {
    title: "Tọa độ & GPS",
    url: "/merchant/location",
    icon: MapPin,
  },
  {
    title: "Audio thuyết minh",
    url: "/merchant/audio",
    icon: Music,
  },
];

export function MerchantSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border bg-orange-50/10 dark:bg-zinc-950">
      {/* Header: Logo Merchant */}
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <Link href="/merchant" className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/20">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
            MERCHANT<span className="text-orange-500">HUB</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="scroll-smooth">
        {/* Nhóm Menu Vận hành duy nhất */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Vận hành hệ thống
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {merchantNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-11 transition-all hover:bg-orange-500/10 hover:text-orange-600 data-[active=true]:bg-orange-500/10 data-[active=true]:text-orange-600"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Thông tin Merchant */}
      <SidebarFooter className="border-t border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Store className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-sm font-bold truncate text-foreground">Phở Thìn Lò Đúc</span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-widest">Đối tác vàng</span>
              </div>
            </div>
            <SidebarMenuButton 
                className="mt-2 w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                tooltip="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium group-data-[collapsible=icon]:hidden">Thoát kênh bán</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}