"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import api from "@/lib/axios"; 
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
  CheckCircle2, Ban, Clock, UtensilsCrossed, Music,
  ChevronLeft, ChevronRight // Thêm Icon cho nút chuyển trang
} from "lucide-react";
import { toast } from "sonner";

const getLabel = (data: any, lang = "vi"): string => {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null) {
    const val = data[lang] || data.vi || data.en || data.jp || Object.values(data)[0];
    return typeof val === "string" ? val : ""; 
  }
  return String(data);
};

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [allFoods, setAllFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States cho Form và Bộ lọc
  const [isOpen, setIsOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<any | null>(null);
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [formLang, setFormLang] = useState<'vi' | 'en' | 'jp' | 'zh' | 'ru'>('vi');

  // --- STATES CHO PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Số lượng nhà hàng hiển thị trên 1 trang

  // Ref và State cho tính năng Upload Âm thanh
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);

  // Khởi tạo state cho dữ liệu form đa ngôn ngữ
  const initialForm = {
    name: { vi: "", en: "", jp: "", zh: "", ru: "" },
    address: { vi: "", en: "", jp: "", zh: "", ru: "" },
    description: { vi: "", en: "", jp: "", zh: "", ru: "" },
    openingHours: { vi: "", en: "", jp: "", zh: "", ru: "" },
    audioUrl: { vi: "", en: "", jp: "", zh: "", ru: "" },
    phoneNumber: "",
    location: { lat: 0, lng: 0 },
    imagesStr: "", 
  };
  const [formData, setFormData] = useState<any>(initialForm);

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

  // Đưa người dùng về trang 1 nếu họ thay đổi bộ lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

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
      
      const wrapLang = (val: any) => {
        if (!val) return { vi: "", en: "", jp: "", zh: "", ru: "" };
        if (typeof val === 'object') return { ...initialForm.name, ...val };
        return { ...initialForm.name, vi: val };
      };

      setFormData({
        name: wrapLang(data.nameRaw || data.name),
        address: wrapLang(data.addressRaw || data.address),
        description: wrapLang(data.descriptionRaw || data.description),
        openingHours: wrapLang(data.openingHoursRaw || data.openingHours || data.openTime),
        audioUrl: wrapLang(data.audioUrlRaw || data.audioUrl), 
        phoneNumber: data.phoneNumber || data.phone || "",
        location: data.location || { lat: 0, lng: 0 },
        imagesStr: (data.images || []).join(', '),
      });

      const ids = (data.foods || []).map((f: any) => typeof f === 'string' ? f : (f.id || f._id));
      setSelectedFoodIds(ids);
      setFormLang('vi'); 
      setIsOpen(true);
    } catch (error) {
      toast.error("Lỗi lấy thông tin chi tiết nhà hàng");
    }
  };

  const handleChange = (field: string, value: any, isMultiLang = false) => {
    if (isMultiLang) {
      setFormData((prev: any) => ({
        ...prev,
        [field]: { ...prev[field], [formLang]: value }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleLocationChange = (coord: 'lat' | 'lng', value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      location: { ...prev.location, [coord]: Number(value) || 0 }
    }));
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await api.post('/upload/audio', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = res.data?.audioUrl || res.data?.data?.audioUrl;

      if (uploadedUrl) {
        setFormData((prev: any) => ({
          ...prev,
          audioUrl: { ...prev.audioUrl, [formLang]: uploadedUrl }
        }));
        toast.success(`Tải âm thanh tiếng ${formLang.toUpperCase()} thành công!`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải file âm thanh lên server!");
    } finally {
      setIsUploadingAudio(false);
      if (audioInputRef.current) audioInputRef.current.value = ''; 
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const payload: any = {
      name: formData.name, 
      address: formData.address,
      description: formData.description,
      openingHours: formData.openingHours,
      audioUrl: formData.audioUrl,
      phoneNumber: formData.phoneNumber,
      location: {
        lat: Number(formData.location.lat),
        lng: Number(formData.location.lng),
      },
      images: formData.imagesStr.split(',').map((s: string) => s.trim()).filter(Boolean),
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

  // --- LOGIC LỌC VÀ CẮT TRANG ---
  const filteredRestaurants = restaurants.filter(res => {
    const matchesSearch = getLabel(res.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getLabel(res.address).toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "ALL") return matchesSearch;
    return matchesSearch && (res.status === activeTab || (!res.status && activeTab === "pending"));
  });

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          onClick={() => { 
            setEditingRes(null); 
            setSelectedFoodIds([]); 
            setFormData(initialForm);
            setIsOpen(true); 
          }} 
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
            <TabsTrigger value="approved" className="rounded-md px-4 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-emerald-600">Đã DUYỆT</TabsTrigger>
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

      <div className="bg-white border rounded-xl shadow-sm flex flex-col">
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
            ) : paginatedRestaurants.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">Không tìm thấy dữ liệu phù hợp</TableCell></TableRow>
            ) : paginatedRestaurants.map((res) => (
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

        {/* GIAO DIỆN NÚT CHUYỂN TRANG */}
        {!loading && filteredRestaurants.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
            <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Đang hiển thị <span className="text-indigo-600 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="text-indigo-600 font-bold">{Math.min(currentPage * itemsPerPage, filteredRestaurants.length)}</span> / {filteredRestaurants.length} kết quả
            </div>
            
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-slate-200 text-slate-500 hover:text-indigo-600"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 border-none" 
                    : "border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-slate-200 text-slate-500 hover:text-indigo-600"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-black uppercase text-xl italic tracking-tighter">
              {editingRes ? <Pencil className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
              {editingRes ? "Cập nhật đối tác" : "Khởi tạo nhà hàng mới"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 pt-2">
            
            <div className="col-span-2 flex flex-wrap bg-slate-100 p-1 rounded-xl w-fit">
              {['vi', 'en', 'jp', 'zh', 'ru'].map((l) => (
                <button 
                  key={l} type="button"
                  onClick={() => setFormLang(l as any)} 
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all uppercase ${formLang === l ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-slate-600">Tên nhà hàng ({formLang}) {formLang === 'vi' && '*'}</label>
              <Input value={formData.name[formLang] || ''} onChange={(e) => handleChange('name', e.target.value, true)} required={formLang === 'vi'} className="rounded-xl" />
            </div>
            
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-slate-600">Giờ hoạt động ({formLang})</label>
              <Input value={formData.openingHours[formLang] || ''} onChange={(e) => handleChange('openingHours', e.target.value, true)} placeholder="08:00 - 22:00" className="rounded-xl" />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-bold text-slate-600">Địa chỉ chi tiết ({formLang}) {formLang === 'vi' && '*'}</label>
              <Input value={formData.address[formLang] || ''} onChange={(e) => handleChange('address', e.target.value, true)} required={formLang === 'vi'} className="rounded-xl" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-bold text-slate-600">Mô tả ngắn ({formLang})</label>
              <textarea value={formData.description[formLang] || ''} onChange={(e) => handleChange('description', e.target.value, true)} className="w-full min-h-[80px] p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div className="space-y-2 col-span-2 pt-2 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-600">
                Âm thanh giới thiệu ({formLang.toUpperCase()})
              </label>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Music className="absolute left-4 top-2.5 text-slate-400" size={18} />
                  <Input 
                    value={formData.audioUrl?.[formLang] || ''} 
                    onChange={(e) => handleChange('audioUrl', e.target.value, true)}
                    className="pl-12 rounded-xl"
                    placeholder={`Dán link mp3 tiếng ${formLang.toUpperCase()}...`}
                  />
                </div>

                <input 
                  type="file" 
                  ref={audioInputRef} 
                  onChange={handleAudioUpload}
                  accept="audio/mpeg, audio/wav, audio/ogg" 
                  className="hidden" 
                />

                <Button 
                  type="button" 
                  variant="outline"
                  disabled={isUploadingAudio}
                  onClick={() => audioInputRef.current?.click()}
                  className="px-5 font-bold rounded-xl border-slate-200 text-slate-600 shrink-0"
                >
                  {isUploadingAudio ? (
                    <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Đang tải...</>
                  ) : (
                    "Tải file lên"
                  )}
                </Button>
              </div>
              
              {formData.audioUrl?.[formLang] && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Nghe thử ({formLang.toUpperCase()}):</p>
                  <audio controls className="w-full h-10 outline-none" key={formData.audioUrl[formLang]}>
                    <source src={formData.audioUrl[formLang]} type="audio/mpeg" />
                    Trình duyệt không hỗ trợ thẻ audio.
                  </audio>
                </div>
              )}
            </div>

            <div className="col-span-2 my-2 border-t border-slate-100" />

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-slate-600">Số điện thoại *</label>
              <Input value={formData.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} required className="rounded-xl" />
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="text-sm font-bold text-slate-600">Vĩ độ (Lat) *</label>
              <Input type="number" step="any" value={formData.location.lat} onChange={(e) => handleLocationChange('lat', e.target.value)} required className="rounded-xl" />
            </div>
            
            <div className="space-y-1.5 col-span-1">
              <label className="text-sm font-bold text-slate-600">Kinh độ (Lng) *</label>
              <Input type="number" step="any" value={formData.location.lng} onChange={(e) => handleLocationChange('lng', e.target.value)} required className="rounded-xl" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-bold text-slate-600">URL Hình ảnh (phân cách bằng dấu phẩy)</label>
              <Input value={formData.imagesStr} onChange={(e) => handleChange('imagesStr', e.target.value)} className="rounded-xl" placeholder="https://url1.jpg, https://url2.jpg" />
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