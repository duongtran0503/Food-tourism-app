"use client";

import React, { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { 
  Store, MapPin, Phone, Clock, FileText, 
  Save, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle,
  X, Navigation, Music
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function MyStorePage() {
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Mở rộng các ngôn ngữ được hỗ trợ
  const [lang, setLang] = useState<'vi' | 'en' | 'jp' | 'zh' | 'ru'>('vi');
  
  // Ref và State cho tính năng Upload ảnh
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Ref và State cho tính năng Upload Âm thanh
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);

  // Form State mặc định (Bổ sung audioUrl đa ngôn ngữ)
  const initialForm = {
    name: { vi: "", en: "", jp: "", zh: "", ru: "" },
    address: { vi: "", en: "", jp: "", zh: "", ru: "" },
    description: { vi: "", en: "", jp: "", zh: "", ru: "" },
    openingHours: { vi: "", en: "", jp: "", zh: "", ru: "" },
    phoneNumber: "",
    location: { lat: 15.87944, lng: 108.33194 },
    images: [] as string[],
    audioUrl: { vi: "", en: "", jp: "", zh: "", ru: "" }, 
  };

  const [formData, setFormData] = useState<any>(initialForm);

// Gọi API lấy thông tin cửa hàng
  const fetchMyStore = async () => {
    setLoading(true);
    try {
      const res = await api.get("/restaurants/my-restaurant"); 
      
      let store = res.data?.data || res.data;
      if (store && store.data && store.id === undefined) {
          store = store.data;
      }

      if (store && (store.id || store._id)) {
        setStoreData(store);
        setFormData({
          name: store.name || { vi: "", en: "", jp: "", zh: "", ru: "" },
          address: store.address || { vi: "", en: "", jp: "", zh: "", ru: "" },
          description: store.description || { vi: "", en: "", jp: "", zh: "", ru: "" },
          openingHours: store.openingHours || { vi: "", en: "", jp: "", zh: "", ru: "" },
          phoneNumber: store.phoneNumber || "",
          location: store.location 
          ? { lat: store.location.lat, lng: store.location.lng } 
          : { lat: 15.87944, lng: 108.33194 },
          images: store.images || [],
          // Đổ dữ liệu âm thanh cũ (nếu có)
          audioUrl: store.audioUrlRaw || store.audioUrl || { vi: "", en: "", jp: "", zh: "", ru: "" }, 
        });
      } else {
        setStoreData(null); 
      }
      
    } catch (error: any) {
      if (error.response?.status === 404) {
        setStoreData(null); 
      } else {
        toast.error("Không thể tải thông tin quán");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStore();
  }, []);

  // Xử lý thay đổi các trường text
  const handleChange = (field: string, value: any, isMultiLang = false) => {
    if (isMultiLang) {
      setFormData((prev: any) => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  // Xử lý thay đổi tọa độ
  const handleLocationChange = (coord: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev: any) => ({
      ...prev,
      location: { ...prev.location, [coord]: numValue }
    }));
  };

  // NÚT CHỌN ẢNH -> GỌI API UPLOAD
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await api.post('/upload/image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = res.data?.imageUrl || res.data?.data?.imageUrl;

      if (uploadedUrl) {
        setFormData((prev: any) => ({
          ...prev,
          images: [uploadedUrl] 
        }));
        toast.success("Tải ảnh lên thành công!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải ảnh lên server!");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // NÚT CHỌN ÂM THANH -> GỌI API UPLOAD
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      // Gọi đúng API endpoint bạn đã khai báo trong backend
      const res = await api.post('/upload/audio', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Lấy link trả về (khớp với cấu trúc upload.controller.ts)
      const uploadedUrl = res.data?.audioUrl || res.data?.data?.audioUrl;

      if (uploadedUrl) {
        setFormData((prev: any) => ({
          ...prev,
          audioUrl: { ...prev.audioUrl, [lang]: uploadedUrl }
        }));
        toast.success(`Tải âm thanh tiếng ${lang.toUpperCase()} thành công!`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải file âm thanh lên server!");
    } finally {
      setIsUploadingAudio(false);
      if (audioInputRef.current) audioInputRef.current.value = ''; 
    }
  };

  // Xử lý lưu Form
  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (!storeData) {
        await api.post("/restaurants", formData);
        toast.success("Đăng ký cửa hàng thành công!");
        setIsRegistering(false);
        fetchMyStore();
      } else {
        await api.patch(`/restaurants/${storeData.id}`, formData);
        toast.success("Cập nhật thông tin quán thành công!");
        fetchMyStore();
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  // UI: TRẠNG THÁI 1 - CHƯA CÓ QUÁN
  if (!storeData && !isRegistering) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-28 w-28 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center rotate-3 hover:rotate-0 transition-all">
          <Store size={56} />
        </div>
        <div className="max-w-md">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bạn chưa có cửa hàng!</h2>
          <p className="text-slate-500 mt-3 font-medium leading-relaxed">
            Hệ thống không tìm thấy hồ sơ nhà hàng nào liên kết với tài khoản của bạn. Hãy đăng ký thông tin để bắt đầu kinh doanh.
          </p>
        </div>
        <Button 
          onClick={() => {
            setFormData(initialForm); 
            setIsRegistering(true);
          }} 
          className="h-14 px-10 font-bold rounded-2xl text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
        >
          Đăng ký cửa hàng ngay
        </Button>
      </div>
    );
  }

  // UI: TRẠNG THÁI 2, 3, 4 - FORM NHẬP LIỆU
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-800 flex items-center gap-3">
            <Store className="text-primary" size={32} /> 
            {storeData ? "Quản Lý Cửa Hàng" : "Đăng Ký Cửa Hàng Mới"}
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            {storeData 
              ? "Cập nhật thông tin hiển thị của quán trên ứng dụng." 
              : "Điền đầy đủ thông tin bên dưới để gửi yêu cầu duyệt quán."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!storeData && (
            <Button variant="outline" onClick={() => setIsRegistering(false)} className="font-bold h-12 rounded-xl px-6 border-slate-200">
              <X className="mr-2" size={18} /> Hủy
            </Button>
          )}

          <Button onClick={handleSubmit} disabled={saving || isUploadingImage || isUploadingAudio} className="font-bold h-12 rounded-xl px-8 shadow-lg shadow-primary/20">
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={20} />}
            {storeData ? "Lưu thay đổi" : "Gửi thông tin đăng ký"}
          </Button>
        </div>
      </div>

      {/* BANNERS TRẠNG THÁI */}
      {storeData && storeData.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="text-amber-500 shrink-0" />
          <span className="font-bold text-sm">Hồ sơ cửa hàng của bạn đang chờ Admin xét duyệt. Bạn vẫn có thể chỉnh sửa thông tin trong lúc chờ.</span>
        </div>
      )}

      {storeData && storeData.status === 'approved' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="text-emerald-500 shrink-0" />
          <span className="font-bold text-sm">Cửa hàng đã được xác thực và đang hiển thị công khai trên ứng dụng.</span>
        </div>
      )}

      {storeData && storeData.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="text-red-500 shrink-0" />
          <span className="font-bold text-sm">Hồ sơ của bạn đã bị từ chối. Vui lòng kiểm tra lại thông tin và cập nhật.</span>
        </div>
      )}

      {/* FORM FIELDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI (THÔNG TIN) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-100">
            <CardHeader className="border-b border-slate-100 pb-6 px-8 pt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="text-primary" /> Thông tin chung
                </CardTitle>
                
                {/* MENU CHỌN NGÔN NGỮ */}
                <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl">
                  {['vi', 'en', 'jp', 'zh', 'ru'].map((l) => (
                    <button 
                      key={l}
                      onClick={() => setLang(l as any)} 
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all uppercase ${lang === l ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Tên quán ({lang.toUpperCase()}) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name[lang] || ''} 
                  onChange={(e) => handleChange('name', e.target.value, true)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  placeholder={`Tên quán hiển thị bằng tiếng ${lang.toUpperCase()}...`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Mô tả quán ({lang.toUpperCase()}) <span className="text-red-500">*</span></label>
                <textarea 
                  value={formData.description[lang] || ''} 
                  onChange={(e) => handleChange('description', e.target.value, true)}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px] font-medium"
                  placeholder={`Giới thiệu quán bằng tiếng ${lang.toUpperCase()}...`}
                />
              </div>

              {/* KHU VỰC NHẬP ÂM THANH THEO NGÔN NGỮ + NÚT TẢI LÊN */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Âm thanh giới thiệu ({lang.toUpperCase()}) (Tùy chọn)
                </label>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Music className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.audioUrl?.[lang] || ''} 
                      onChange={(e) => handleChange('audioUrl', e.target.value, true)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
                      placeholder={`Dán link mp3 tiếng ${lang.toUpperCase()}...`}
                    />
                  </div>

                  {/* THẺ INPUT FILE ẨN DÀNH CHO AUDIO */}
                  <input 
                    type="file" 
                    ref={audioInputRef} 
                    onChange={handleAudioUpload}
                    accept="audio/mpeg, audio/wav, audio/ogg" 
                    className="hidden" 
                  />

                  {/* NÚT TẢI LÊN FILE ÂM THANH */}
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={isUploadingAudio}
                    onClick={() => audioInputRef.current?.click()}
                    className="h-12 px-5 font-bold rounded-xl border-slate-200 text-slate-600 shrink-0"
                  >
                    {isUploadingAudio ? (
                      <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Đang tải...</>
                    ) : (
                      "Tải file lên"
                    )}
                  </Button>
                </div>
                
                {/* TRÌNH PHÁT NHẠC */}
                {formData.audioUrl?.[lang] && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Nghe thử ({lang.toUpperCase()}):</p>
                    <audio controls className="w-full h-10 outline-none" key={formData.audioUrl[lang]}>
                      <source src={formData.audioUrl[lang]} type="audio/mpeg" />
                      Trình duyệt không hỗ trợ thẻ audio.
                    </audio>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-100">
             <CardHeader className="border-b border-slate-100 px-8 pt-8 pb-6">
               <CardTitle className="text-xl font-bold flex items-center gap-2">
                 <MapPin className="text-primary" /> Vị trí & Liên hệ
               </CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Địa chỉ chi tiết ({lang.toUpperCase()}) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.address[lang] || ''} 
                    onChange={(e) => handleChange('address', e.target.value, true)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    placeholder="VD: 26 Thái Phiên, phường Minh An..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Số điện thoại <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.phoneNumber || ''} 
                        onChange={(e) => handleChange('phoneNumber', e.target.value, false)}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary outline-none font-medium"
                        placeholder="0901234567"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Giờ hoạt động ({lang.toUpperCase()}) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.openingHours[lang] || ''} 
                        onChange={(e) => handleChange('openingHours', e.target.value, true)}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary outline-none font-medium"
                        placeholder="07:00 - 22:00"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Vĩ độ (Latitude) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Navigation className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        value={formData.location.lat} 
                        onChange={(e) => handleLocationChange('lat', e.target.value)}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary outline-none font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Kinh độ (Longitude) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Navigation className="absolute left-4 top-3.5 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        value={formData.location.lng} 
                        onChange={(e) => handleLocationChange('lng', e.target.value)}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-primary outline-none font-medium"
                      />
                    </div>
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* CỘT PHẢI (HÌNH ẢNH) */}
        <div className="space-y-6">
           <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-100 bg-primary text-white overflow-hidden relative">
             <CardContent className="p-8 text-center space-y-4">
                
                {/* Khu vực hiển thị ảnh (Lấy trực tiếp từ formData.images[0]) */}
                <div className="mx-auto bg-white/20 w-32 h-32 rounded-[2rem] flex items-center justify-center overflow-hidden border-2 border-dashed border-white/40">
                  {formData.images && formData.images.length > 0 ? (
                    <img src={formData.images[0]} alt="Store Cover" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={48} className="opacity-80" />
                  )}
                </div>

                <h3 className="font-bold text-lg">Ảnh đại diện quán</h3>
                <p className="text-xs text-primary-foreground/80 leading-relaxed px-4">
                  Tải lên hình ảnh mặt tiền hoặc logo rõ nét (Tối đa 5MB, JPG/PNG/WebP).
                </p>

                {/* THẺ INPUT ẨN */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  className="hidden" 
                />

                {/* NÚT KÍCH HOẠT UPLOAD */}
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploadingImage}
                  variant="secondary" 
                  type="button" 
                  className="w-full font-bold mt-4 rounded-xl text-primary shadow-lg"
                >
                  {isUploadingImage ? (
                    <><Loader2 className="animate-spin mr-2" size={18} /> Đang tải lên...</>
                  ) : formData.images && formData.images.length > 0 ? (
                    "Đổi ảnh khác"
                  ) : (
                    "Chọn ảnh tải lên"
                  )}
                </Button>

             </CardContent>
           </Card>
        </div>
        
      </div>
    </div>
  );
}