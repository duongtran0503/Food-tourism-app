"use client";

import { useEffect, useState } from "react";
import { FoodAPI, FoodItem, MOCK_CATEGORIES, MOCK_POIS } from "@/lib/mock-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Utensils, Tag, MapPin, Search } from "lucide-react";
import { toast } from "sonner";

export default function MerchantFoodPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Partial<FoodItem> | null>(null);
  
  // Giả lập ID của Merchant hiện tại (Lấy từ Auth sau này)
  const currentMerchantId = "merchant-123";

  const loadData = async () => {
    const allFoods = await FoodAPI.getAll();
    // CHỈ LỌC MÓN CỦA MERCHANT NÀY
    setFoods(allFoods.filter(f => f.merchantId === currentMerchantId));
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = { 
      ...Object.fromEntries(formData.entries()), 
      id: editingFood?.id,
      merchantId: currentMerchantId,
      status: editingFood?.status || "Còn món"
    };
    
    await FoodAPI.save(data as any);
    toast.success(editingFood ? "Đã cập nhật món ăn" : "Đã thêm món mới vào thực đơn");
    setIsOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-orange-600">Thực đơn của quán</h2>
          <p className="text-muted-foreground">Quản lý danh sách món ăn, giá cả và vị trí hiển thị trên bản đồ.</p>
        </div>
        <Button onClick={() => { setEditingFood(null); setIsOpen(true); }} className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20">
          <Plus className="mr-2 h-4 w-4" /> Thêm món mới
        </Button>
      </div>

      {/* DANH SÁCH MÓN ĂN DẠNG CARD (Dễ nhìn hơn Table trên mobile) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {foods.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
             Chưa có món ăn nào. Hãy nhấn "Thêm món mới" để bắt đầu!
          </div>
        ) : (
          foods.map((food) => (
            <div key={food.id} className="bg-card border rounded-3xl p-5 hover:border-orange-200 transition-all shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                  <Utensils className="h-6 w-6" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingFood(food); setIsOpen(true); }} className="h-8 w-8 text-blue-500">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { FoodAPI.delete(food.id); loadData(); }} className="h-8 w-8 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-1">{food.name}</h3>
              <p className="text-primary font-mono font-bold text-sm mb-3">
                {Number(food.minPrice).toLocaleString()}đ - {Number(food.maxPrice).toLocaleString()}đ
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" /> 
                  {MOCK_CATEGORIES.find(c => c.id === food.categoryId)?.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-orange-500" /> 
                  Gắn với: {MOCK_POIS.find(p => p.id === food.poiId)?.name}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <Badge variant={food.status === "Còn món" ? "default" : "secondary"} className={food.status === "Còn món" ? "bg-green-500/10 text-green-600" : ""}>
                  {food.status}
                </Badge>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">ID: {food.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DIALOG THÊM/SỬA MÓN ĂN */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-600">
              {editingFood ? "Cập nhật món ăn" : "Thêm vào thực đơn"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Tên món ăn</label>
              <Input name="name" defaultValue={editingFood?.name} placeholder="Ví dụ: Phở Bò Tái Lăn" required className="rounded-xl" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Giá Min (VNĐ)</label>
                <Input name="minPrice" type="number" defaultValue={editingFood?.minPrice} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Giá Max (VNĐ)</label>
                <Input name="maxPrice" type="number" defaultValue={editingFood?.maxPrice} required className="rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Danh mục</label>
                <Select name="categoryId" defaultValue={editingFood?.categoryId}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Gắn POI du lịch</label>
                <Select name="poiId" defaultValue={editingFood?.poiId}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn địa điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_POIS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg rounded-xl">
                {editingFood ? "Lưu thay đổi" : "Thêm ngay"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}