"use client";

import { useEffect, useState, useMemo } from "react";
import { FoodService, CategoryService } from "@/lib/food-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Utensils, Tag, DollarSign, ImageIcon, Search, Globe } from "lucide-react";
import { toast } from "sonner";

const getLabel = (data: any): string => {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null) {
    const val = data.vi || data.en || data.jp || Object.values(data)[0];
    return typeof val === "string" ? val : ""; 
  }
  return String(data);
};

const generateSlug = (text: string) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d").replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
};

export default function MerchantFoodsPage() {
  const [foods, setFoods] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [foodRes, catRes] = await Promise.all([
        FoodService.getAll(),
        CategoryService.getAll()
      ]);

      const foodItems = foodRes.data?.data?.items || foodRes.data?.items || [];
      const catItems = catRes.data?.data?.items || catRes.data?.items || [];
      
      setFoods(foodItems);
      setCategories(catItems);
    } catch (error) {
      toast.error("Không thể tải dữ liệu thực đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nameValue = formData.get("name") as string;
    const catId = formData.get("categoryId") as string;

    const payload = {
      name: nameValue,
      slug: generateSlug(nameValue),
      category: catId !== "none" ? catId : null,
      minPrice: Number(formData.get("minPrice")),
      maxPrice: Number(formData.get("maxPrice")),
      images: (formData.get("imagesUrl") as string)?.split(',').map(s => s.trim()).filter(s => s) || [],
      status: "AVAILABLE",
    };

    if (!payload.category) return toast.error("Vui lòng chọn danh mục cho món ăn!");

    try {
      if (editingFood?.id || editingFood?._id) {
        await FoodService.update(editingFood.id || editingFood._id, payload);
        toast.success("Cập nhật món ăn thành công!");
      } else {
        await FoodService.create(payload);
        toast.success("Thêm món mới thành công!");
      }
      setIsOpen(false);
      loadData();
    } catch (error) {
      toast.error("Lưu dữ liệu thất bại. Vui lòng kiểm tra lại!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Utensils className="text-indigo-600" /> Quản lý Thực đơn
          </h1>
          <p className="text-sm text-muted-foreground italic">Cập nhật danh sách món ăn và giá cả cho nhà hàng</p>
        </div>
        <Button onClick={() => { setEditingFood(null); setIsOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Thêm món mới
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Tìm kiếm món ăn..." 
            className="max-w-xs border-none shadow-none focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">Hình ảnh</TableHead>
              <TableHead>Tên món ăn</TableHead>
              <TableHead>Khoảng giá (VNĐ)</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-indigo-500" /></TableCell></TableRow>
            ) : foods.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-400">Chưa có món ăn nào trong thực đơn</TableCell></TableRow>
            ) : foods.map((food) => (
              <TableRow key={food.id || food._id} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100 shadow-inner">
                    {food.images?.[0] ? <img src={food.images[0]} className="object-cover h-full w-full" /> : <ImageIcon className="h-5 w-5 text-indigo-200" />}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-700">{getLabel(food.name)}</TableCell>
                <TableCell>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-xs border border-indigo-100">
                    {food.priceRange?.min?.toLocaleString()} - {food.priceRange?.max?.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold">
                    {getLabel(categories.find(c => (c.id || c._id) === food.category)?.name) || "Chưa gán"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingFood(food); setIsOpen(true); }}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={async () => { if(confirm("Xóa món ăn này khỏi thực đơn?")) { await FoodService.delete(food.id || food._id); loadData(); } }}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-xl">
               {editingFood ? <Pencil className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
               {editingFood ? "Cập nhật món ăn" : "Thêm món mới vào bếp"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">Tên món ăn</label>
              <Input name="name" defaultValue={getLabel(editingFood?.name)} required className="rounded-xl" placeholder="Ví dụ: Mì Quảng gà ta" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">Danh mục món</label>
              <select 
                name="categoryId" 
                defaultValue={editingFood?.category || "none"} 
                className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500" 
                required
              >
                <option value="none" disabled>-- Chọn một danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>{getLabel(cat.name)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">Link hình ảnh (URL)</label>
              <Input name="imagesUrl" defaultValue={editingFood?.images?.join(', ')} className="rounded-xl" placeholder="Ngăn cách bằng dấu phẩy (,)" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600">Giá thấp nhất</label>
                <div className="relative">
                  <Input name="minPrice" type="number" defaultValue={editingFood?.priceRange?.min} required className="pl-8 rounded-xl" />
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-600">Giá cao nhất</label>
                <div className="relative">
                  <Input name="maxPrice" type="number" defaultValue={editingFood?.priceRange?.max} required className="pl-8 rounded-xl" />
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-[11px] text-indigo-700 italic flex gap-2">
              <span className="font-bold">💡 Tip:</span> 
              Mã Slug sẽ tự động được tạo để tối ưu tìm kiếm trên App Food Tour.
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 uppercase tracking-wider">
               Xác nhận lưu món
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}