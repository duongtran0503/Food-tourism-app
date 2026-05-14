"use client";

import { useEffect, useState } from "react";
import { CategoryService } from "@/lib/category-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, LayoutGrid, ImageIcon, Link as LinkIcon, Search } from "lucide-react";
import { toast } from "sonner";

const generateSlug = (text: string) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d").replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
};

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Hàm tải dữ liệu: Chỉ lấy danh mục của chính Merchant này
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await CategoryService.getMe(); 
      
      console.log("🔍 [DEBUG] Dữ liệu API /me:", res.data); 
      let items = [];
      if (Array.isArray(res.data?.items)) {
        items = res.data.items;
      } else if (Array.isArray(res.data?.data?.items)) {
        items = res.data.data.items;
      } else if (Array.isArray(res.data)) {
        items = res.data;
      }
      setCategories(items); 
    } catch (error: any) {
      console.error("Lỗi tải dữ liệu:", error.response?.data || error.message);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nameValue = formData.get("name") as string;
    const iconValue = formData.get("icon") as string;

    // Chuẩn hóa payload theo yêu cầu của Backend (MultiLanguage name)
    const payload: any = {
      name: { vi: nameValue },
      slug: generateSlug(nameValue),
    };

    if (iconValue && iconValue.trim() !== "") {
      payload.icon = iconValue;
    }

    try {
      if (editingCat?.id) {
        await CategoryService.update(editingCat.id, payload);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await CategoryService.create(payload);
        toast.success("Đã thêm danh mục mới");
      }
      setIsOpen(false);
      loadData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi khi lưu dữ liệu";
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa danh mục này sẽ ảnh hưởng đến các món ăn liên quan. Tiếp tục?")) return;
    try {
      await CategoryService.delete(id);
      toast.success("Đã xóa danh mục");
      loadData();
    } catch (error: any) {
      // Hiển thị lỗi từ backend (ví dụ: lỗi Forbidden nếu xóa nhầm đồ của người khác)
      toast.error(error.response?.data?.message || "Không thể xóa danh mục này");
    }
  };

  const filteredCategories = categories.filter(cat => 
    (cat.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.slug || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <LayoutGrid className="text-indigo-600" /> Danh mục của tôi
          </h1>
          <p className="text-sm text-muted-foreground italic">Quản lý các nhóm món ăn bạn đang kinh doanh</p>
        </div>
        <Button onClick={() => { setEditingCat(null); setIsOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Thêm mới
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Tìm nhanh danh mục..." 
            className="max-w-xs border-none shadow-none focus-visible:ring-0" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">Icon</TableHead>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-indigo-500" /></TableCell></TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-10 text-slate-400">Bạn chưa tạo danh mục nào</TableCell></TableRow>
            ) : filteredCategories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 overflow-hidden">
                    {cat.icon ? <img src={cat.icon} className="h-full w-full object-cover" alt="icon" /> : <ImageIcon className="h-5 w-5 text-indigo-300" />}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-700">{cat.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-[10px] bg-slate-100 text-slate-600">
                    {cat.slug}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingCat(cat); setIsOpen(true); }}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
               {editingCat ? "Cập nhật danh mục" : "Tạo danh mục mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5 pt-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">Tên hiển thị</label>
              <Input name="name" defaultValue={editingCat?.name} placeholder="Ví dụ: Bánh Mì & Xôi" required className="rounded-xl" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">URL Icon</label>
              <div className="relative">
                <Input name="icon" defaultValue={editingCat?.icon} placeholder="https://..." className="pl-10 rounded-xl" />
                <LinkIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold transition-all">
               XÁC NHẬN
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}