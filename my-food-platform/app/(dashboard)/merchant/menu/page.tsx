"use client";

import { useEffect, useState } from "react";
import { FoodAPI, FoodItem, MOCK_CATEGORIES, MOCK_POIS } from "@/lib/mock-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Utensils, Tag, MapPin, Search, Filter } from "lucide-react";
import { toast } from "sonner";

export default function MerchantFoodPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Partial<FoodItem> | null>(null);

  // --- STATE CHO BỘ LỌC ---
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [poiFilter, setPoiFilter] = useState("all");
  
  const currentMerchantId = "merchant-123";

  const loadData = async () => {
    const allFoods = await FoodAPI.getAll();
    setFoods(allFoods.filter(f => f.merchantId === currentMerchantId));
  };

  useEffect(() => { loadData(); }, []);

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || food.categoryId === categoryFilter;
    const matchesPoi = poiFilter === "all" || food.poiId === poiFilter;
    return matchesSearch && matchesCategory && matchesPoi;
  });

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
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-orange-600">Thực đơn của quán</h2>
          <p className="text-muted-foreground font-medium">Quản lý danh sách món ăn, giá cả và vị trí hiển thị trên bản đồ.</p>
        </div>
        <Button onClick={() => { setEditingFood(null); setIsOpen(true); }} className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 rounded-2xl h-12 px-6">
          <Plus className="mr-2 h-5 w-5" /> Thêm món mới
        </Button>
      </div>

      {/* 2. THANH TÌM KIẾM & BỘ LỌC (PHẦN THÊM MỚI) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white border rounded-3xl shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm tên món ăn..." 
            className="pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-orange-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="rounded-xl bg-slate-50 border-none">
            <SelectValue placeholder="Theo danh mục" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {MOCK_CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={poiFilter} onValueChange={setPoiFilter}>
          <SelectTrigger className="rounded-xl bg-slate-50 border-none">
            <SelectValue placeholder="Theo địa điểm (POI)" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Tất cả địa điểm</SelectItem>
            {MOCK_POIS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* 3. DANH SÁCH MÓN ĂN DẠNG CARD */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFoods.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-[2rem] text-muted-foreground bg-slate-50/50">
             <Utensils className="h-10 w-10 mx-auto mb-2 opacity-20" />
             <p>Không tìm thấy món ăn nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          filteredFoods.map((food) => (
            <div key={food.id} className="bg-card border rounded-[2rem] p-6 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
                  <Utensils className="h-7 w-7" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingFood(food); setIsOpen(true); }} className="h-9 w-9 text-blue-500 bg-blue-50 rounded-full">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { if(confirm("Xóa món này?")) {FoodAPI.delete(food.id); loadData();} }} className="h-9 w-9 text-red-500 bg-red-50 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-1 text-slate-800">{food.name}</h3>
              <p className="text-orange-600 font-mono font-black text-lg mb-4">
                {Number(food.minPrice).toLocaleString()}đ - {Number(food.maxPrice).toLocaleString()}đ
              </p>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none rounded-lg font-bold">
                    <Tag className="h-3 w-3 mr-1.5" /> 
                    {MOCK_CATEGORIES.find(c => c.id === food.categoryId)?.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-none rounded-lg font-bold">
                    <MapPin className="h-3 w-3 mr-1.5" /> 
                    POI: {MOCK_POIS.find(p => p.id === food.poiId)?.name}
                  </Badge>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t flex justify-between items-center">
                <Badge className={food.status === "Còn món" ? "bg-emerald-500 text-white border-none rounded-full px-4" : "bg-slate-200 text-slate-600 border-none rounded-full px-4"}>
                  {food.status}
                </Badge>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">ID: {food.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. DIALOG THÊM/SỬA */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-orange-600">
              {editingFood ? "Cập nhật món ăn" : "Thêm vào thực đơn"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Tên món ăn</label>
              <Input name="name" defaultValue={editingFood?.name} placeholder="Ví dụ: Phở Bò Tái Lăn" required className="rounded-xl h-12 bg-slate-50 border-none shadow-inner" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Giá Min (VNĐ)</label>
                <Input name="minPrice" type="number" defaultValue={editingFood?.minPrice} required className="rounded-xl h-12 bg-slate-50 border-none shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Giá Max (VNĐ)</label>
                <Input name="maxPrice" type="number" defaultValue={editingFood?.maxPrice} required className="rounded-xl h-12 bg-slate-50 border-none shadow-inner" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Danh mục</label>
                <Select name="categoryId" defaultValue={editingFood?.categoryId}>
                  <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none shadow-inner">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    {MOCK_CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Gắn POI du lịch</label>
                <Select name="poiId" defaultValue={editingFood?.poiId}>
                  <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none shadow-inner">
                    <SelectValue placeholder="Chọn địa điểm" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    {MOCK_POIS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 h-14 text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95">
                {editingFood ? "Lưu thay đổi" : "Xác nhận thêm món"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}