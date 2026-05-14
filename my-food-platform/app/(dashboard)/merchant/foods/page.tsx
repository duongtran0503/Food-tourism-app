"use client";

import { useEffect, useState } from "react";
import { FoodService, CategoryService } from "@/lib/food-service";
import api from "@/lib/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Loader2, Plus, Pencil, Trash2, Utensils, 
  ImageIcon, DollarSign, Search, Link as LinkIcon 
} from "lucide-react";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "jp", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

const getLabel = (data: any, lang = "vi"): string => {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null) {
    return data[lang] || data.vi || data.en || Object.values(data)[0] || "";
  }
  return String(data);
};

const generateSlug = (text: string) => {
  if (!text) return "food-" + Date.now();
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
  
  const [myRestaurantId, setMyRestaurantId] = useState<string | null>(null);
  
  const [multiLangName, setMultiLangName] = useState<Record<string, string>>({ vi: "", en: "", jp: "", zh: "", ru: "" });
  const [multiLangDesc, setMultiLangDesc] = useState<Record<string, string>>({ vi: "", en: "", jp: "", zh: "", ru: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Lấy ID của cửa hàng (Để phục vụ cho việc gắn món ăn vào cửa hàng lúc tạo mới)
      try {
        const myStoreRes = await api.get("/restaurants/my-restaurant");
        let storeData = myStoreRes.data?.data || myStoreRes.data;
        if (storeData && storeData.data && !storeData.id) storeData = storeData.data;
        setMyRestaurantId(storeData?.id || storeData?._id);
      } catch (err) {
        toast.warning("Bạn chưa có cửa hàng! Vui lòng đăng ký quán trước.");
      }

      // 2. Lấy dữ liệu món ăn & danh mục song song từ API /me
      const [foodsRes, catsRes] = await Promise.all([
        FoodService.getMe(),
        CategoryService.getMe()
      ]);

      // Tự động tìm mảng items dù có bọc interceptor hay không
      const foodsData = foodsRes.data?.items || foodsRes.data?.data?.items || foodsRes.data || [];
      const catsData = catsRes.data?.items || catsRes.data?.data?.items || catsRes.data || [];

      setFoods(foodsData);
      setCategories(catsData);

    } catch (error) {
      console.error("Load Data Error:", error);
      toast.error("Không thể tải dữ liệu thực đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenForm = (food: any = null) => {
    if (food) {
      setEditingFood(food);
      const nameData = food.nameRaw || (typeof food.name === 'object' ? food.name : { vi: food.name || "" });
      const descData = food.descriptionRaw || (typeof food.description === 'object' ? food.description : { vi: food.description || "" });

      setMultiLangName({ 
        vi: nameData?.vi || "", en: nameData?.en || "", jp: nameData?.jp || "",
        zh: nameData?.zh || "", ru: nameData?.ru || ""
      });
      setMultiLangDesc({ 
        vi: descData?.vi || "", en: descData?.en || "", jp: descData?.jp || "",
        zh: descData?.zh || "", ru: descData?.ru || ""
      });
    } else {
      setEditingFood(null);
      setMultiLangName({ vi: "", en: "", jp: "", zh: "", ru: "" });
      setMultiLangDesc({ vi: "", en: "", jp: "", zh: "", ru: "" });
    }
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: multiLangName,
      description: multiLangDesc,
      slug: generateSlug(multiLangName.vi),
      category: formData.get("categoryId"), // DTO BE nhận 'category'
      minPrice: Number(formData.get("minPrice")),
      maxPrice: Number(formData.get("maxPrice")),
      images: (formData.get("imagesUrl") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
    };

    try {
      const id = editingFood?.id || editingFood?._id;
      if (id) {
        await FoodService.update(id, payload);
        toast.success("Cập nhật món ăn thành công");
      } else {
        if (!myRestaurantId) {
           toast.error("Bạn chưa có cửa hàng để thêm món! Vui lòng đăng ký quán trước.");
           return;
        }
        const createRes = await FoodService.create(payload);
        const newFoodId = createRes.data?.data?.id || createRes.data?.id || createRes.data?.data?._id;
        
        // Sau khi tạo Food, link vào Restaurant của mình
        if (newFoodId) {
          await api.post(`/restaurants/${myRestaurantId}/foods`, { foodIds: [newFoodId] });
          toast.success("Thêm món ăn mới vào thực đơn thành công");
        }
      }
      setIsOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message?.[0] || error.response?.data?.message || "Lỗi hệ thống khi lưu món ăn");
    }
  };

  const filteredFoods = foods.filter(f => 
    getLabel(f.nameRaw || f.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Utensils className="text-indigo-600" /> Quản lý Món ăn
          </h1>
          <p className="text-sm text-muted-foreground italic">Cấu hình thực đơn và giá bán đa ngôn ngữ</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-indigo-600 hover:bg-indigo-700 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Thêm món ăn
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Tìm nhanh món ăn..." 
            className="max-w-xs border-none shadow-none focus-visible:ring-0" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">Ảnh</TableHead>
              <TableHead>Tên món ăn</TableHead>
              <TableHead>Giá bán (VNĐ)</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-indigo-500" /></TableCell></TableRow>
            ) : filteredFoods.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-400">Chưa có món ăn nào trong thực đơn</TableCell></TableRow>
            ) : filteredFoods.map((food) => (
              <TableRow key={food.id || food._id} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 overflow-hidden shadow-inner">
                    {food.images?.[0] ? <img src={food.images[0]} className="h-full w-full object-cover" alt="food" /> : <ImageIcon className="h-5 w-5 text-indigo-300" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-700">{food.name || getLabel(food.nameRaw)}</div>
                  <div className="text-[10px] text-slate-400 italic font-mono truncate max-w-[200px]">{food.slug}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-mono">
                    {food.priceRange?.min?.toLocaleString()} - {food.priceRange?.max?.toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell>
                   <Badge className="bg-slate-100 text-slate-600 border-none font-medium">
                    {getLabel(categories.find(c => String(c.id || c._id) === String(food.categoryId || food.category))?.name) || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenForm(food)}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { 
                    if(confirm("Bạn có chắc chắn muốn xóa món ăn này khỏi hệ thống?")) {
                      FoodService.delete(food.id || food._id).then(() => {
                        toast.success("Đã xóa món ăn");
                        loadData();
                      }).catch((err) => toast.error(err.response?.data?.message || "Lỗi khi xóa"));
                    }
                  }}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Form */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-xl">
               {editingFood ? <Pencil className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
               {editingFood ? "Cập nhật món ăn" : "Tạo món ăn mới"}
            </DialogTitle>
          </DialogHeader>

          <form key={editingFood?.id || 'new'} onSubmit={handleSave} className="space-y-4 pt-2">
            <Tabs defaultValue="vi" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-100 rounded-xl p-1">
                {LANGUAGES.map(lang => (
                  <TabsTrigger key={lang.code} value={lang.code} className="text-[10px] sm:text-xs font-bold px-1">
                    {lang.flag} <span className="hidden sm:inline ml-1">{lang.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {LANGUAGES.map(lang => (
                <TabsContent key={lang.code} value={lang.code} className="space-y-3 mt-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Tên món ({lang.code}) {lang.code === 'vi' && <span className="text-red-500">*</span>}</label>
                    <Input 
                      value={multiLangName[lang.code] || ""} 
                      onChange={(e) => setMultiLangName({...multiLangName, [lang.code]: e.target.value})}
                      placeholder={`Tên món ăn bằng ${lang.label}...`} 
                      className="rounded-xl border-slate-200" 
                      required={lang.code === 'vi'}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Mô tả ({lang.code})</label>
                    <textarea 
                      value={multiLangDesc[lang.code] || ""} 
                      onChange={(e) => setMultiLangDesc({...multiLangDesc, [lang.code]: e.target.value})}
                      placeholder={`Mô tả ngắn về món ăn bằng ${lang.label}...`}
                      className="w-full min-h-[70px] p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Danh mục món ăn <span className="text-red-500">*</span></label>
              <select name="categoryId" defaultValue={editingFood?.categoryId || editingFood?.category || ""} className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white" required>
                <option value="" disabled>-- Chọn một danh mục --</option>
                {categories.map(cat => <option key={cat.id || cat._id} value={cat.id || cat._id}>{getLabel(cat.name)}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Giá thấp nhất <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Input name="minPrice" type="number" defaultValue={editingFood?.priceRange?.min} className="pl-8 rounded-xl border-slate-200" required />
                  <DollarSign className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Giá cao nhất <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Input name="maxPrice" type="number" defaultValue={editingFood?.priceRange?.max} className="pl-8 rounded-xl border-slate-200" required />
                  <DollarSign className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Đường dẫn ảnh (URL)</label>
              <div className="relative">
                <Input name="imagesUrl" defaultValue={editingFood?.images?.join(', ')} placeholder="https://..." className="pl-8 rounded-xl border-slate-200" />
                <LinkIcon className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all mt-6">
               XÁC NHẬN LƯU THỰC ĐƠN
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}