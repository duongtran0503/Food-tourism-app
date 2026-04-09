"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, LogIn, UtensilsCrossed, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }

      if (data.accessToken) {
        localStorage.setItem("access_token", data.accessToken);
      }

      router.push("/admin/restaurants"); 

    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground pt-4">Đăng nhập Admin</h1>
          <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại với hệ thống quản trị.</p>
        </div>

        <div className="bg-card border border-border p-8 rounded-[2rem] shadow-xl shadow-black/5">
          {errorMsg && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 rounded-lg text-center font-medium">
              {errorMsg}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Email hệ thống</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="admin@foodplatform.com" 
                          className="pl-10 h-11 border-muted focus-visible:ring-primary transition-all bg-muted/10" 
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
                disabled={isLoading}
                className="w-full h-11 text-base font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                <LogIn className="mr-2 h-5 w-5" /> 
                {isLoading ? "Đang xử lý..." : "Đăng nhập ngay"}
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
             <Button variant="outline" className="h-11 border-muted hover:bg-muted/50">
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