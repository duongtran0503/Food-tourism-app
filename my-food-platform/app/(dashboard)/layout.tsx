"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { MerchantSidebar } from "@/components/dashboard/merchant-sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");

  return (
    // 2. Bao bọc tất cả bằng TooltipProvider
    <TooltipProvider delayDuration={0}> 
      <SidebarProvider>
        {isAdminPath ? <AdminSidebar /> : <MerchantSidebar />}
        <SidebarInset>
          {/* Header của bạn... */}
          <main className="p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}