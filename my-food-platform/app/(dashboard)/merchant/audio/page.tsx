"use client";

import { Music, Play, Pause, Trash2, Upload, Volume2, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const audioList = [
  { id: 1, title: "Giới thiệu quán & Lịch sử", language: "Tiếng Việt", duration: "02:30", status: "Đang phát" },
  { id: 2, title: "Sự tích món Phở Bò", language: "Tiếng Việt", duration: "01:45", status: "Đang phát" },
  { id: 3, title: "Introduction (English version)", language: "Tiếng Anh", duration: "02:15", status: "Bản nháp" },
];

export default function AudioPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Thuyết minh âm thanh</h2>
        <p className="text-muted-foreground">Quản lý các đoạn âm thanh tự động phát khi du khách đến gần quán của bạn.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Cột trái: Upload mới */}
        <Card className="md:col-span-1 border-none shadow-lg bg-orange-500 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Tải lên Audio mới</CardTitle>
            <CardDescription className="text-orange-100">Định dạng hỗ trợ: MP3, WAV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group relative border-2 border-dashed border-white/30 rounded-2xl p-6 text-center hover:bg-white/10 transition-all cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-medium">Nhấn để chọn file</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-xs font-medium">
                  <span>Đang tải: 60%</span>
               </div>
               <Progress value={60} className="h-1 bg-white/20" />
            </div>
            <Button variant="secondary" className="w-full font-bold text-orange-600">Hoàn tất tải lên</Button>
          </CardContent>
        </Card>

        {/* Cột phải: Danh sách Audio */}
        <Card className="md:col-span-2 border-none shadow-md bg-card/50">
          <CardHeader>
            <CardTitle>Danh sách thuyết minh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audioList.map((audio) => (
                <div key={audio.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-transparent hover:border-orange-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                      <Play className="h-4 w-4 fill-current" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{audio.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          <Globe className="h-3 w-3" /> {audio.language}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          <Volume2 className="h-3 w-3" /> {audio.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={audio.status === "Đang phát" ? "default" : "secondary"} className={audio.status === "Đang phát" ? "bg-green-500/10 text-green-600 border-none" : ""}>
                      {audio.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gợi ý cho Merchant */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
        <div className="p-2 bg-blue-500 rounded-lg text-white">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Mẹo:</strong> Hãy tải lên phiên bản tiếng Anh để thu hút khách du lịch quốc tế. Hệ thống sẽ tự động ưu tiên phát ngôn ngữ dựa trên cài đặt điện thoại của khách.
        </p>
      </div>
    </div>
  );
}

// Nhớ import ShieldCheck từ lucide-react nhé
import { ShieldCheck } from "lucide-react";