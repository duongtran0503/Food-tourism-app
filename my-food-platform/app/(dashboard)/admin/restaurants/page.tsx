"use client";

import { useEffect, useState, useMemo } from "react";
import { RestaurantService, FoodService } from "@/lib/restaurant-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Plus, Pencil, Store, MapPin, Search, 
  CheckCircle2, Ban, Clock, UtensilsCrossed, Phone, Info
} from "lucide-react";
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

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [allFoods, setAllFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<any | null>(null);
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const foodMap = useMemo(() => {
    return new Map(allFoods.map(f => [f.id || f._id, f.name]));
  }, [allFoods]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, foodData] = await Promise.all([
        RestaurantService.getAll(),
        FoodService.getAll()
      ]);
      
      const resItems = resData.data?.data?.items || resData.data?.items || [];
      const foodItems = foodData.data?.data?.items || foodData.data?.items || [];
      
      setRestaurants(resItems);
      setAllFoods(foodItems);
    } catch (error) {
      toast.error("Không thể tải danh sách dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const isApprove = newStatus === "approved";
    try {
      await RestaurantService.approve(id, newStatus as 'approved' | 'rejected');
      toast.success(isApprove ? "Đã phê duyệt đối tác thành công!" : "Đã từ chối quyền kinh doanh!");
      loadData();
    } catch (error) {
      toast.error("Thao tác thất bại, vui lòng kiểm tra lại quyền hạn!");
    }
  };

  const handleEdit = async (res: any) => {
    try {
      const detail = await RestaurantService.getById(res.id || res._id);
      const data = detail.data?.data || detail.data;
      
      setEditingRes(data);
      const ids = (data.foods || []).map((f: any) => typeof f === 'string' ? f : (f.id || f._id));
      setSelectedFoodIds(ids);
      setIsOpen(true);
    } catch (error) {
      toast.error("Lỗi lấy thông tin chi tiết nhà hàng");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload: any = {
      name: { vi: formData.get("name") }, 
      address: { vi: formData.get("address") },
      description: { vi: formData.get("description") },
      openingHours: { vi: formData.get("openingHours") },
      phoneNumber: formData.get("phoneNumber"),
      location: {
        lat: Number(formData.get("lat")),
        lng: Number(formData.get("lng")),
      },
      images: (formData.get("images") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      foods: selectedFoodIds,
    };

    if (!editingRes) payload.status = "pending";

    try {
      const targetId = editingRes?.id || editingRes?._id;
      if (targetId) {
        await RestaurantService.update(targetId, payload);
        toast.success("Cập nhật thông tin thành công");
      } else {
        await RestaurantService.create(payload);
        toast.success("Đã gửi yêu cầu đăng ký mới");
      }
      setIsOpen(false);
      loadData();
    } catch (error) {
      toast.error("Lưu dữ liệu thất bại");
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã duyệt</Badge>;
      case "rejected":
        return <Badge className="bg-rose-50 text-rose-600 border-none font-bold text-[10px] uppercase"><Ban className="w-3 h-3 mr-1" /> Từ chối</Badge>;
      default:
        return <Badge className="bg-amber-50 text-amber-600 border-none font-bold text-[10px] uppercase"><Clock className="w-3 h-3 mr-1" /> Chờ duyệt</Badge>;
    }
  };

  const filteredRestaurants = restaurants.filter(res => {
    const matchesSearch = getLabel(res.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getLabel(res.address).toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "ALL") return matchesSearch;
    return matchesSearch && (res.status === activeTab || (!res.status && activeTab === "pending"));
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Store className="text-indigo-600" /> Quản lý Nhà hàng
          </h1>
          <p className="text-sm text-muted-foreground italic">Phê duyệt và kiểm soát hệ thống nhà hàng trên sàn Food Tour</p>
        </div>
        <Button 
          onClick={() => { setEditingRes(null); setSelectedFoodIds([]); setIsOpen(true); }} 
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold uppercase text-xs tracking-wider"
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm nhà hàng
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 border rounded-xl shadow-sm">
        <Tabs defaultValue="ALL" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="ALL" className="rounded-md px-4 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600">TẤT CẢ</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-md px-4 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-amber-600">CHỜ DUYỆT</TabsTrigger>
            <TabsTrigger value="approved" className="rounded-md px-4 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-emerald-600">ĐÃ DUYỆT</TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-md px-4 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-rose-600">TỪ CHỐI</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Tìm theo tên, địa chỉ..." 
            className="pl-9 rounded-xl border-slate-200" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="pl-6">Nhà hàng & Địa chỉ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Món đặc sản</TableHead>
              <TableHead className="text-right pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-indigo-500" /></TableCell></TableRow>
            ) : filteredRestaurants.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">Không tìm thấy dữ liệu phù hợp</TableCell></TableRow>
            ) : filteredRestaurants.map((res) => (
              <TableRow key={res.id || res._id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="pl-6">
                  <div className="font-bold text-slate-700">{getLabel(res.name)}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin size={12} className="text-slate-300" /> {getLabel(res.address)}
                  </div>
                </TableCell>
                <TableCell>{renderStatusBadge(res.status || "pending")}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[220px]">
                    {res.foods?.slice(0, 2).map((fid: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[9px] font-bold px-2 py-0.5">
                        {getLabel(foodMap.get(typeof fid === 'string' ? fid : (fid.id || fid._id)))}
                      </Badge>
                    ))}
                    {res.foods?.length > 2 && <span className="text-[10px] text-slate-400">+{res.foods.length - 2}</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6 space-x-1">
                  {(res.status === "pending" || !res.status) && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(res.id || res._id, "approved")} className="h-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-xs">
                        DUYỆT
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(res.id || res._id, "rejected")} className="h-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold text-xs">
                        TỪ CHỐI
                      </Button>
                    </>
                  )}
                  {res.status === "approved" && (
                    <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(res.id || res._id, "rejected")} className="h-8 text-rose-500 hover:bg-rose-50 font-bold text-xs">
                      HỦY DUYỆT
                    </Button>
                  )}
                  {res.status === "rejected" && (
                    <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(res.id || res._id, "approved")} className="h-8 text-indigo-600 hover:bg-indigo-50 font-bold text-xs">
                      DUYỆT LẠI
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(res)} className="rounded-lg hover:bg-slate-100 h-8 w-8">
                    <Pencil className="h-4 w-4 text-slate-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-black uppercase text-xl italic tracking-tighter">
              {editingRes ? <Pencil className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
              {editingRes ? "Cập nhật đối tác" : "Khởi tạo nhà hàng mới"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-bold text-slate-600">Tên nhà hàng</label>
              <Input name="name" defaultValue={getLabel(editingRes?.name)} required className="rounded-xl" />
            </div>
            
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-slate-600">Số điện thoại</label>
              <Input name="phoneNumber" defaultValue={editingRes?.phoneNumber || editingRes?.phone} required className="rounded-xl" />
            </div>
            
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-slate-600">Giờ hoạt động</label>
              <Input name="openingHours" defaultValue={getLabel(editingRes?.openingHours || editingRes?.openTime)} placeholder="08:00 - 22:00" className="rounded-xl" />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-bold text-slate-600">Địa chỉ chi tiết</label>
              <Input name="address" defaultValue={getLabel(editingRes?.address)} required className="rounded-xl" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-bold text-slate-600">Mô tả ngắn</label>
              <textarea name="description" defaultValue={getLabel(editingRes?.description)} className="w-full min-h-[80px] p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Vĩ độ (Lat)</label>
              <Input name="lat" type="number" step="any" defaultValue={editingRes?.location?.lat} required className="rounded-xl" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Kinh độ (Lng)</label>
              <Input name="lng" type="number" step="any" defaultValue={editingRes?.location?.lng} required className="rounded-xl" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-bold text-slate-600">URL Hình ảnh (phân cách bằng dấu phẩy)</label>
              <Input name="images" defaultValue={editingRes?.images?.join(', ')} className="rounded-xl" placeholder="https://url1.jpg, https://url2.jpg" />
            </div>

            <div className="col-span-2 space-y-2 mt-2">
              <label className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-1">
                <UtensilsCrossed size={14} /> Đặc sản liên kết
              </label>
              <div className="grid grid-cols-2 gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50/50 max-h-40 overflow-y-auto">
                {allFoods.map((food) => (
                  <div key={food.id || food._id} className="flex items-center space-x-2 bg-white p-2 px-3 rounded-lg border border-slate-100 shadow-sm">
                    <Checkbox 
                      id={food.id || food._id} 
                      checked={selectedFoodIds.includes(food.id || food._id)}
                      onCheckedChange={(checked) => {
                        const id = food.id || food._id;
                        setSelectedFoodIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
                      }}
                    />
                    <label htmlFor={food.id || food._id} className="cursor-pointer font-medium text-[11px] truncate text-slate-600">{getLabel(food.name)}</label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full col-span-2 mt-4 bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-black uppercase tracking-widest transition-all">
               Xác nhận lưu dữ liệu
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}