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

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await CategoryService.getAll();
      // Truy cập đúng cấu trúc data từ backend trả về
      setCategories(res.data?.data?.items || res.data?.items || []); 
    } catch (error) {
      toast.error("Không thể kết nối dữ liệu danh mục");
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

    // SỬA ĐỔI TẠI ĐÂY: Đóng gói payload đúng chuẩn Backend yêu cầu
    const payload: any = {
      // Backend yêu cầu name là Object { vi: string, en?: string... }
      name: { 
        vi: nameValue 
      },
      slug: generateSlug(nameValue),
    };

    // Chỉ gửi icon nếu có giá trị để tránh lỗi @IsUrl khi gửi chuỗi rỗng
    if (iconValue && iconValue.trim() !== "") {
      payload.icon = iconValue;
    }

    try {
      if (editingCat?.id || editingCat?._id) {
        await CategoryService.update(editingCat.id || editingCat._id, payload);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await CategoryService.create(payload);
        toast.success("Đã thêm danh mục mới");
      }
      setIsOpen(false);
      loadData();
    } catch (error: any) {
      // Log chi tiết lỗi từ backend để dễ dàng xử lý (thường là lỗi validation)
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
    } catch (error) {
      toast.error("Không thể xóa danh mục này");
    }
  };

  // Lọc dữ liệu tại client cho ô tìm kiếm
  const filteredCategories = categories.filter(cat => 
    getLabel(cat.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <LayoutGrid className="text-indigo-600" /> Quản lý Danh mục
          </h1>
          <p className="text-sm text-muted-foreground italic">Phân loại món ăn cho dự án Food Tours</p>
        </div>
        <Button onClick={() => { setEditingCat(null); setIsOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
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
              <TableHead className="w-[100px]">Biểu tượng</TableHead>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Mã nhận diện (Slug)</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-indigo-500" /></TableCell></TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-10 text-slate-400">Chưa có dữ liệu phân loại</TableCell></TableRow>
            ) : filteredCategories.map((cat) => (
              <TableRow key={cat.id || cat._id} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 overflow-hidden shadow-inner">
                    {cat.icon ? <img src={cat.icon} className="h-full w-full object-cover" alt="icon" /> : <ImageIcon className="h-5 w-5 text-indigo-300" />}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-700">
                  {getLabel(cat.name)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-[10px] bg-slate-100 text-slate-600 border-none">
                    {cat.slug}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingCat(cat); setIsOpen(true); }}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id || cat._id)}>
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
            <DialogTitle className="flex items-center gap-2 font-bold text-xl">
               {editingCat ? <Pencil className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
               {editingCat ? "Cập nhật danh mục" : "Tạo danh mục mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5 pt-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">Tên hiển thị</label>
              <Input name="name" defaultValue={getLabel(editingCat?.name)} placeholder="Ví dụ: Đặc sản Hội An" required className="rounded-xl border-slate-200" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600">Đường dẫn Icon (URL)</label>
              <div className="relative">
                <Input name="icon" defaultValue={editingCat?.icon} placeholder="https://cdn.com/icon.png" className="pl-10 rounded-xl border-slate-200" />
                <LinkIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-[11px] text-indigo-700 italic flex gap-2 items-start">
               <span className="font-bold">💡 Mẹo:</span> 
               Mã Slug chuẩn SEO sẽ được hệ thống tự động sinh ra từ tên bạn nhập.
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100">
               XÁC NHẬN LƯU
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}