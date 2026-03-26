"use client";

import Link from "next/link";
import { 
  MapPin, 
  Headphones, 
  Search, 
  ArrowRight, 
  Utensils, 
  Navigation, 
  Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER / NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tighter">FOODTOUR</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Khám phá</Link>
            <Link href="#" className="hover:text-primary transition-colors">Bản đồ</Link>
            <Link href="#" className="hover:text-primary transition-colors">Dành cho chủ quán</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full px-5 shadow-lg shadow-primary/20">Bắt đầu ngay</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decor background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-24 left-10 w-72 h-72 bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 text-center space-y-8">
          <Badge variant="outline" className="py-1 px-4 rounded-full border-primary/20 text-primary bg-primary/5 animate-bounce">
            📍 Khám phá ẩm thực qua từng bước chân
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Đừng chỉ ăn, hãy <span className="text-primary italic">Thưởng thức</span> câu chuyện.
          </h1>
          <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
            Nền tảng đầu tiên kết hợp bản đồ GPS và thuyết minh âm thanh tự động, giúp bạn khám phá linh hồn của từng món ăn địa phương.
          </p>
          
          {/* Search bar xịn xò */}
          <div className="max-w-2xl mx-auto flex items-center p-2 bg-card border rounded-full shadow-2xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <div className="flex items-center gap-2 flex-1 px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Bạn muốn ăn gì ở Sài Gòn hôm nay?" 
                className="border-none bg-transparent focus-visible:ring-0 text-md"
              />
            </div>
            <Button size="lg" className="rounded-full px-8 hidden sm:flex">Tìm kiếm</Button>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Navigation className="h-6 w-6 text-blue-500" />}
              title="Dẫn đường GPS"
              desc="Tự động chỉ đường đến những quán ăn ẩn mình trong ngõ hẻm mà chỉ người bản địa mới biết."
            />
            <FeatureCard 
              icon={<Headphones className="h-6 w-6 text-orange-500" />}
              title="Audio Storytelling"
              desc="Nghe thuyết minh về lịch sử quán và bí quyết món ăn ngay khi bạn vừa bước chân đến cửa."
            />
            <FeatureCard 
              icon={<Star className="h-6 w-6 text-yellow-500" />}
              title="Đánh giá thực tế"
              desc="Cộng đồng du khách sành ăn cùng nhau chia sẻ những trải nghiệm ẩm thực chân thực nhất."
            />
          </div>
        </div>
      </section>

      {/* 4. TRENDING RESTAURANTS */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold">Quán ngon đang "Hot"</h2>
            <p className="text-muted-foreground">Những địa điểm được khách du lịch ghé thăm nhiều nhất tuần qua.</p>
          </div>
          <Button variant="link" className="text-primary font-bold">Xem tất cả <ArrowRight className="ml-1 h-4 w-4" /></Button>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <RestaurantCard name="Phở Thìn Lò Đúc" tag="Truyền thống" dist="500m" rating="4.9" />
          <RestaurantCard name="Bánh Mì Huỳnh Hoa" tag="Ăn vặt" dist="1.2km" rating="4.8" />
          <RestaurantCard name="Cơm Tấm Ba Ghiền" tag="Bữa chính" dist="2.5km" rating="4.7" />
          <RestaurantCard name="Ốc Đào Quận 1" tag="Hải sản" dist="800m" rating="4.9" />
        </div>
      </section>
    </div>
  );
}

// Sub-components giúp code sạch hơn
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="border-none shadow-none bg-transparent group cursor-default">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="h-14 w-14 bg-background rounded-2xl shadow-sm flex items-center justify-center mx-auto group-hover:scale-110 group-hover:shadow-primary/20 transition-all">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}

function RestaurantCard({ name, tag, dist, rating }: { name: string, tag: string, dist: string, rating: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[4/3] rounded-3xl bg-muted mb-4 overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-md">{tag}</Badge>
        </div>
        <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-400 group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-lg">{name}</h4>
          <span className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
             <Star className="h-3 w-3 fill-current mr-1" /> {rating}
          </span>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" /> Cách bạn {dist}
        </p>
      </div>
    </div>
  );
}