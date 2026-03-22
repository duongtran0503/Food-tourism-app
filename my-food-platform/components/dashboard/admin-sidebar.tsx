"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Store,
  BarChart3,
  Users,
  Settings,
  LogOut,
  UtensilsCrossed,
  Bell,
  ShieldCheck,
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
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
  {
    title: "Tổng quan",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý Quán ăn",
    url: "/admin/restaurants",
    icon: Store,
  },
  {
    title: "Thống kê sàn",
    url: "/admin/statistics",
    icon: BarChart3,
  },
  {
    title: "Người dùng",
    url: "/admin/users",
    icon: Users,
  },
];

const settingItems = [
  {
    title: "Thông báo",
    url: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Cài đặt hệ thống",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border">
      {/* Header: Logo thương hiệu */}
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
            FOOD<span className="text-primary">ADMIN</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Nhóm Menu chính */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Quản trị viên
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-11 transition-all hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
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

        <Separator className="mx-4 my-2 opacity-50" />

        {/* Nhóm Cấu hình */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Hệ thống
          </SidebarGroupLabel>
          <SidebarMenu>
            {settingItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  className="h-11 transition-all hover:bg-primary/10 hover:text-primary"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Thông tin User & Logout */}
      <SidebarFooter className="border-t border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">Admin Lợi</span>
                <span className="text-xs text-muted-foreground truncate">admin@foodapp.com</span>
              </div>
            </div>
            <SidebarMenuButton 
                className="mt-2 w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                tooltip="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium group-data-[collapsible=icon]:hidden">Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}