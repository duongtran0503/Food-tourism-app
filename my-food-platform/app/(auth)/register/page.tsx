"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Store, ArrowRight, User, Mail, ShieldCheck, 
  Phone, Lock, ImagePlus, Camera 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { registerSchema, type RegisterFormValues } from "@/lib/zod-schemas";

export default function RegisterPage() {
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      fullName: "", 
      email: "", 
      phoneNumber: "", 
      password: "", 
      confirmPassword: "",
      role: "CUSTOMER"
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-xl">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Tạo tài khoản mới</h1>
          <p className="text-muted-foreground mt-2">Tham gia cộng đồng Food Platform ngay hôm nay.</p>
        </div>

        <div className="bg-card/50 backdrop-blur-md border border-border p-8 rounded-3xl shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => console.log(v))} className="space-y-6">
              
              {/* PHẦN CHỌN AVATAR */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-primary/20 p-1">
                    <AvatarImage src={preview || ""} />
                    <AvatarFallback className="bg-muted">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">Ảnh đại diện (Tùy chọn)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Nguyễn Văn A" className="pl-10 bg-background/50" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Phone Number */}
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="0901234567" className="pl-10 bg-background/50" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Email */}
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="example@gmail.com" className="pl-10 bg-background/50" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Role Selection */}
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bạn là ai?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Khách du lịch</SelectItem>
                        <SelectItem value="MERCHANT">Chủ quán ăn (Đối tác)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Password */}
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" className="pl-10 bg-background/50" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Confirm Password */}
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" className="pl-10 bg-background/50" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <Button type="submit" className="w-full h-12 text-lg group bg-primary hover:brightness-110 shadow-lg shadow-primary/20">
                Đăng ký ngay <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </Form>
          
          <div className="mt-8 pt-6 border-t border-border flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center">
               Thông tin bảo mật <ShieldCheck className="ml-1 h-4 w-4 text-green-500" />
            </span>
            <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}