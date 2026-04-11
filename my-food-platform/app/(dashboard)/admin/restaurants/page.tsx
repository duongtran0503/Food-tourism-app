"use client";

import { useEffect, useState, useMemo } from "react";
import { RestaurantService, FoodService } from "@/lib/restaurant-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Plus, Pencil, Trash2, Store, MapPin, Phone, Clock, Search, UtensilsCrossed 
} from "lucide-react";
import { toast } from "sonner";

/**
 * 🛡️ HELPER: Xử lý dữ liệu đa ngôn ngữ (i18n)
 * Đảm bảo không bao giờ bị lỗi "Objects are not valid as a React child"
 */
const getLabel = (data: any): string => {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null) {
    // Ưu tiên Tiếng Việt, sau đó đến các ngôn ngữ khác
    const val = data.vi || data.en || data.jp || data.zh || data.ru || Object.values(data)[0];
    return typeof val === "string" ? val : ""; 
  }
  return String(data);
};

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [allFoods, setAllFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<any | null>(null);
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

  // Map tra cứu tên món ăn từ danh sách ID
  const foodMap = useMemo(() => {
    return new Map(allFoods.map(f => [f.id || f._id, f.name]));
  }, [allFoods]);

  /**
   * 🔄 HÀM TẢI DỮ LIỆU: Bóc tách đúng cấu trúc JSON của bạn
   */
  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const [resData, foodData] = await Promise.all([
        RestaurantService.getAll({ page, limit: 10, search: searchQuery }),
        FoodService.getAll()
      ]);

      // 🎯 BÓC TÁCH DỮ LIỆU: Khớp với JSON res.data.data.items
      const responseBody = resData.data.data; 
      
      if (responseBody) {
        setRestaurants(responseBody.items || []); 
        setPagination(responseBody.meta || { totalPages: 1, currentPage: page });
      }

      // Xử lý dữ liệu món ăn cho Checkbox
      const foodsRaw = foodData.data?.data?.items || foodData.data?.items || [];
      setAllFoods(foodsRaw);

    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Không thể tải danh sách nhà hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleEdit = async (res: any) => {
    try {
      const detail = await RestaurantService.getById(res.id || res._id);
      // Backend chi tiết trả về: { data: { ...restaurant_info } }
      const data = detail.data.data || detail.data;
      setEditingRes(data);

      // Chuyển mảng foods về ID để Checkbox nhận diện
      const ids = (data.foods || []).map((f: any) => typeof f === 'string' ? f : (f.id || f._id));
      setSelectedFoodIds(ids);
      setIsOpen(true);
    } catch (error) {
      toast.error("Lỗi lấy thông tin chi tiết");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      name: formData.get("name"), 
      address: formData.get("address"),
      phoneNumber: formData.get("phoneNumber"),
      openingHours: formData.get("openingHours"),
      location: {
        lat: Number(formData.get("lat")),
        lng: Number(formData.get("lng")),
      },
      foods: selectedFoodIds,
    };

    try {
      const targetId = editingRes?.id || editingRes?._id;
      if (targetId) {
        await RestaurantService.update(targetId, payload);
        toast.success("Cập nhật thành công");
        loadData(pagination.currentPage);
      } else {
        await RestaurantService.create(payload);
        toast.success("Thêm nhà hàng mới thành công");
        loadData(1);
      }
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lưu dữ liệu thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa nhà hàng này?")) return;
    try {
      await RestaurantService.delete(id);
      toast.success("Đã xóa nhà hàng");
      loadData(pagination.currentPage);
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 1. Header: Indigo Style */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Store className="text-indigo-600" /> Quản trị Nhà hàng
          </h1>
          <p className="text-sm text-muted-foreground italic">Quản lý mạng lưới quán ăn trên hệ thống Food Tour</p>
        </div>
        <Button onClick={() => { setEditingRes(null); setSelectedFoodIds([]); setIsOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Thêm nhà hàng
        </Button>
      </div>

      {/* 2. Table: Phong cách Indigo Table giống trang User */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Tìm kiếm quán ăn..." 
            className="max-w-xs border-none shadow-none focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadData(1)}
          />
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Thông tin nhà hàng</TableHead>
              <TableHead>Liên hệ & Giờ mở cửa</TableHead>
              <TableHead>Thực đơn</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-indigo-500" /></TableCell></TableRow>
            ) : restaurants.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Không tìm thấy dữ liệu nhà hàng</TableCell></TableRow>
            ) : restaurants.map((res) => (
              <TableRow key={res.id || res._id} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="font-semibold text-slate-700">{getLabel(res.name)}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {getLabel(res.address)}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">
                   <div className="flex items-center gap-1.5 font-medium"><Phone size={14} className="text-indigo-600" /> {res.phoneNumber || "N/A"}</div>
                   <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                     <Clock size={14} /> {getLabel(res.openingHours) || "Chưa cập nhật"}
                   </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {res.foods?.slice(0, 2).map((fid: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700 border-none text-[10px] px-2 py-0">
                        {getLabel(foodMap.get(typeof fid === 'string' ? fid : (fid.id || fid._id)))}
                      </Badge>
                    ))}
                    {res.foods?.length > 2 && <span className="text-[10px] text-slate-400">+{res.foods.length - 2}</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(res)}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(res.id || res._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 3. DIALOG: Form 2 cột sạch sẽ */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-xl">
               {editingRes ? <Pencil className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
               {editingRes ? "Cập nhật dữ liệu quán" : "Thêm quán ăn mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm font-semibold">Tên nhà hàng</label>
              <Input name="name" defaultValue={getLabel(editingRes?.name)} required className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm font-semibold">Số điện thoại</label>
              <Input name="phoneNumber" defaultValue={editingRes?.phoneNumber} className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-semibold">Địa chỉ chi tiết</label>
              <Input name="address" defaultValue={getLabel(editingRes?.address)} required className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Vĩ độ (Lat)</label>
              <Input name="lat" type="number" step="any" defaultValue={editingRes?.location?.lat || 10.762} required className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Kinh độ (Lng)</label>
              <Input name="lng" type="number" step="any" defaultValue={editingRes?.location?.lng || 106.66} required className="rounded-xl" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-semibold">Giờ hoạt động</label>
              <Input name="openingHours" defaultValue={getLabel(editingRes?.openingHours)} placeholder="07:00 - 22:00" className="rounded-xl" />
            </div>

            {/* PHẦN CHỌN MÓN ĂN */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold flex items-center gap-1 text-indigo-600">
                <UtensilsCrossed size={14} /> Thực đơn liên kết
              </label>
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-xl bg-slate-50 max-h-40 overflow-y-auto">
                {allFoods.map((food) => (
                  <div key={food.id || food._id} className="flex items-center space-x-2 bg-white p-2 rounded-lg border text-xs shadow-sm">
                    <Checkbox 
                      id={food.id || food._id} 
                      checked={selectedFoodIds.includes(food.id || food._id)}
                      onCheckedChange={(checked) => {
                        const id = food.id || food._id;
                        setSelectedFoodIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
                      }}
                    />
                    <label htmlFor={food.id || food._id} className="cursor-pointer font-medium truncate flex-1">{getLabel(food.name)}</label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full col-span-2 mt-4 bg-indigo-600 hover:bg-indigo-700 transition-all font-bold h-12 rounded-xl">
               {editingRes ? "LƯU THAY ĐỔI" : "KHỞI TẠO QUÁN"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}