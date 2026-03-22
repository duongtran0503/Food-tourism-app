"use client";

import { useState } from "react";
import { User, Mail, Shield, Key, Camera, Save, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Cài đặt tài khoản</h1>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và thiết lập bảo mật của bạn.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Cột 1: Ảnh đại diện & Thông tin nhanh */}
        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-orange-500" />
            <CardContent className="pt-0 -mt-12 text-center">
              <div className="relative inline-block group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">L</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold">Lợi Admin</h3>
                <p className="text-sm text-muted-foreground italic">Quản trị viên hệ thống</p>
              </div>
              <div className="mt-6 flex justify-center gap-2">
                <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20">
                  <Shield className="mr-1 h-3 w-3" /> Xác thực
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BellRing className="h-4 w-4 text-primary" /> Thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Thông báo đơn hàng</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Cập nhật hệ thống</Label>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cột 2 & 3: Form chỉnh sửa chi tiết */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Cập nhật họ tên và địa chỉ email liên hệ.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="fullname" defaultValue="Lợi Admin" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" defaultValue="admin@foodplatform.com" className="pl-10" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Giới thiệu ngắn</Label>
                <textarea 
                  id="bio" 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Viết vài dòng về bản thân..."
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-md border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Bảo mật & Mật khẩu</CardTitle>
              <CardDescription>Thay đổi mật khẩu định kỳ để bảo vệ tài khoản.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <p className="text-xs text-muted-foreground italic">Lần cuối đổi mật khẩu: 3 tháng trước</p>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/5">
                <Key className="mr-2 h-4 w-4" /> Cập nhật mật khẩu
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
