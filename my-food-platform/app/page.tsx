import Image from "next/image";
import Link from "next/link"; // Dùng Link để chuyển trang không bị load lại
import { UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <main className="max-w-3xl space-y-8">
        {/* Logo & Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <UtensilsCrossed className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
            Food <span className="text-primary">Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Hệ thống quản lý ẩm thực và du lịch thông minh. Khám phá hương vị địa phương qua từng bước chân.
          </p>
        </div>

        {/* Buttons điều hướng */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg">
              Bắt đầu ngay <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Link href="/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg">
              Trở thành đối tác
            </Button>
          </Link>
        </div>

        {/* Placeholder cho tính năng */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-border">
          <div className="space-y-2">
            <h3 className="font-bold">Quản lý Admin</h3>
            <p className="text-sm text-muted-foreground">Điều hành toàn bộ hệ thống quán ăn và người dùng.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Dành cho Merchant</h3>
            <p className="text-sm text-muted-foreground">Cập nhật thực đơn, tọa độ và audio giới thiệu.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Food Tourism</h3>
            <p className="text-sm text-muted-foreground">Tích hợp GPS dẫn đường và thuyết minh món ăn.</p>
          </div>
        </div>
      </main>
    </div>
  );
}