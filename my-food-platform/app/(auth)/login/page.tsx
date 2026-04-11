"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, LogIn, UtensilsCrossed, ChevronLeft, Loader2 } from "lucide-react";
import api from "@/lib/axios"; // Đảm bảo Lợi đã cấu hình axios instance
import { toast } from "sonner"; // Thư viện thông báo

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginFormValues } from "@/lib/zod-schemas";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", values);
      const { tokens, userInfo } = response.data.data;

      // ĐỔI SANG SESSIONSTORAGE Ở ĐÂY
      sessionStorage.setItem("accessToken", tokens.accessToken);
      sessionStorage.setItem("user", JSON.stringify(userInfo));

      toast.success(`Chào Admin ${userInfo.fullName}!`);

      // Điều hướng theo Role (đã tách ADMIN và MERCHANT)
      if (userInfo.role === "ADMIN") {
        router.push("/admin/users");
      } else if (userInfo.role === "MERCHANT") {
        router.push("/merchant");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đăng nhập thất bại.";
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Quay lại trang chủ
      </Link>

      <div className="w-full max-w-[420px] space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <UtensilsCrossed className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground pt-4">Hệ thống Đăng nhập</h1>
          <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại với Food tour.</p>
        </div>

        <div className="bg-card border border-border p-8 rounded-[2rem] shadow-xl shadow-black/5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Email tài khoản</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="tour@foodplatform.com" 
                          className="pl-10 h-11 border-muted focus-visible:ring-primary transition-all bg-muted/10" 
                          disabled={loading}
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-semibold">Mật khẩu</FormLabel>
                      <Link href="#" className="text-xs text-primary hover:underline">Quên mật khẩu?</Link>
                    </div>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 h-11 border-muted focus-visible:ring-primary transition-all bg-muted/10" 
                          disabled={loading}
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 text-base font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" /> Đăng nhập ngay
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
             <Button variant="outline" className="h-11 border-muted hover:bg-muted/50" disabled={loading}>
                Tiếp tục với Google
             </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản đối tác?{" "}
          <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
            Đăng ký Merchant
          </Link>
        </p>
      </div>
    </div>
  );
}