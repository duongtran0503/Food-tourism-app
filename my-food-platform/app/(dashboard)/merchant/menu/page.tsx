"use client";

import { Plus, Utensils, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { id: 1, name: "Phở Bò Đặc Biệt", price: "65,000đ", status: "Còn món" },
  { id: 2, name: "Quẩy Giòn", price: "5,000đ", status: "Còn món" },
  { id: 3, name: "Trà Đá", price: "2,000đ", status: "Hết món" },
];

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Thực đơn của quán</h2>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" /> Thêm món mới
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Utensils className="text-orange-600 h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.price}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={item.status === "Còn món" ? "default" : "secondary"}>{item.status}</Badge>
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}