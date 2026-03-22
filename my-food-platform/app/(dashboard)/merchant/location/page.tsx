"use client";

import { MapPin, Music, Save, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LocationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Cấu hình Food Tourism</h2>
        <p className="text-muted-foreground">Thiết lập tọa độ GPS và âm thanh thuyết minh để du khách tìm thấy bạn.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Cấu hình Tọa độ */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" /> Tọa độ GPS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Vĩ độ (Latitude)</Label>
              <Input placeholder="Ví dụ: 10.762622" />
            </div>
            <div className="space-y-2">
              <Label>Kinh độ (Longitude)</Label>
              <Input placeholder="Ví dụ: 106.660172" />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Cập nhật vị trí
            </Button>
          </CardContent>
        </Card>

        {/* Cấu hình Audio */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-orange-500" /> Audio Thuyết minh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center space-y-2 hover:bg-orange-50/50 transition-colors cursor-pointer">
              <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm font-medium">Kéo thả file audio vào đây</p>
              <p className="text-xs text-muted-foreground">Định dạng MP3, WAV (Tối đa 10MB)</p>
            </div>
            <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
              Chọn file từ máy tính
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}