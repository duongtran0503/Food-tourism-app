"use client";

import { ShoppingCart, Check, X } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Đơn hàng hiện tại</h2>
      
      {/* Empty State mẫu */}
      <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed border-muted">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="text-muted-foreground h-8 w-8" />
        </div>
        <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
        <p className="text-sm text-muted-foreground">Các đơn hàng mới sẽ xuất hiện tại đây.</p>
      </div>
    </div>
  );
}