"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, ArrowRight, User, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerSchema, type RegisterFormValues } from "@/lib/zod-schemas";

export default function RegisterPage() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-xl">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Hợp tác cùng chúng tôi</h1>
          <p className="text-muted-foreground mt-2">Điền thông tin để bắt đầu kinh doanh trên Food Platform.</p>
        </div>

        <div className="bg-card/50 backdrop-blur-md border border-border p-8 rounded-3xl shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => console.log(v))} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên quán ăn</FormLabel>
                    <FormControl>
                      <Input placeholder="Cơm Niêu Ba Miền" className="h-11 bg-background/50 border-muted" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email liên hệ</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@shop.com" className="h-11 bg-background/50 border-muted" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mạnh</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="h-11 bg-background/50 border-muted" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận lại mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="h-11 bg-background/50 border-muted" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full h-12 text-lg group bg-primary hover:brightness-110">
                Đăng ký ngay <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </Form>
          
          <div className="mt-8 pt-6 border-t border-border flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center">
               Bảo mật thông tin <ShieldCheck className="ml-1 h-4 w-4 text-green-500" />
            </span>
            <Link href="/login" className="text-primary font-bold hover:underline">
              Đã có tài khoản?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}