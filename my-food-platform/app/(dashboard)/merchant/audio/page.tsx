"use client";

import { useEffect, useState } from "react";
import { 
  Music, Play, Pause, Trash2, Upload, Volume2, Globe, 
  ShieldCheck, Loader2, CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AudioService } from "@/lib/audio-service";
import { toast } from "sonner";

export default function AudioPage() {
  const [audios, setAudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 🔄 Tải danh sách audio từ Server
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await AudioService.getAll();
      setAudios(res.data.data.items || []);
    } catch (error) {
      toast.error("Không thể tải danh sách âm thanh");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ⬆️ Xử lý tải file lên
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // Giới hạn 10MB
      return toast.error("File quá lớn! Vui lòng chọn file dưới 10MB.");
    }

    setUploading(true);
    setProgress(0);

    try {
      const res = await AudioService.upload(file, (percent) => {
        setProgress(percent);
      });
      
      toast.success("Tải lên thành công!");
      // Sau khi upload xong, bạn có thể gọi API lưu metadata vào DB tại đây
      loadData(); 
    } catch (error) {
      toast.error("Lỗi khi tải file lên hệ thống");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-black tracking-tighter text-slate-800 uppercase italic">Thuyết minh âm thanh</h2>
        <p className="text-muted-foreground text-sm font-medium">Quản lý các đoạn âm thanh tự động phát trên hệ thống Food Tour.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* CỘT TRÁI: UPLOAD (INDIGO STYLE) */}
        <Card className="md:col-span-1 border-none shadow-xl bg-indigo-600 text-white rounded-[2.5rem] overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Tải lên Audio mới</CardTitle>
            <CardDescription className="text-indigo-100 text-xs">Định dạng hỗ trợ: MP3, WAV (Max 10MB)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group relative border-2 border-dashed border-white/30 rounded-[2rem] p-8 text-center hover:bg-white/10 transition-all cursor-pointer">
              {uploading ? (
                <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
              ) : (
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-80" />
              )}
              <p className="text-xs font-bold uppercase tracking-widest">
                {uploading ? "Đang xử lý..." : "Chọn file âm thanh"}
              </p>
              <input 
                type="file" 
                accept="audio/*" 
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>

            {uploading && (
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase">
                   <span>Tiến độ: {progress}%</span>
                 </div>
                 <Progress value={progress} className="h-1.5 bg-white/20" />
              </div>
            )}
            
            <Button variant="secondary" className="w-full font-black text-indigo-600 rounded-xl h-12 uppercase tracking-tighter shadow-lg">
               {uploading ? "Vui lòng đợi..." : "Hoàn tất chọn file"}
            </Button>
          </CardContent>
        </Card>

        {/* CỘT PHẢI: DANH SÁCH AUDIO */}
        <Card className="md:col-span-2 border-none shadow-sm bg-white rounded-[2.5rem]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-700">Thư viện của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></div>
              ) : audios.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm italic">Chưa có bản thuyết minh nào được tải lên.</div>
              ) : audios.map((audio) => (
                <div key={audio.id || audio._id} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-transparent hover:border-indigo-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <button className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 hover:scale-105 transition-transform">
                      <Play className="h-4 w-4 fill-current" />
                    </button>
                    <div>
                      <p className="font-bold text-sm text-slate-700">{audio.title || "Âm thanh không tên"}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[9px] text-slate-400 uppercase font-black tracking-widest">
                          <Globe className="h-3 w-3" /> {audio.language || "Việt Nam"}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-slate-400 uppercase font-black tracking-widest">
                          <Volume2 className="h-3 w-3" /> {audio.duration || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold px-3 py-1 rounded-full">
                       <CheckCircle2 className="w-3 h-3 mr-1" /> ONLINE
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { if(confirm("Xóa bản thuyết minh này?")) AudioService.delete(audio.id || audio._id).then(loadData); }}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MẸO CHO MERCHANT (INDIGO STYLE) */}
      <div className="bg-indigo-50 p-5 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-indigo-200 shadow-lg">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 text-sm uppercase mb-1">Lời khuyên từ hệ thống</h4>
          <p className="text-xs text-indigo-700 leading-relaxed font-medium">
            Để tăng trải nghiệm khách hàng, Lợi nên tải lên các file âm thanh giới thiệu đặc sản vùng miền. 
            Hệ thống sẽ tự động kích hoạt Audio khi khách hàng cách quán của bạn <strong>50 mét</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}