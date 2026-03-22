"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { TrendingUp, Users, ShoppingBag, ArrowUpRight } from "lucide-react";

const dataRevenue = [
  { name: "Tháng 10", total: 1200 },
  { name: "Tháng 11", total: 2100 },
  { name: "Tháng 12", total: 1800 },
  { name: "Tháng 1", total: 2400 },
  { name: "Tháng 2", total: 3200 },
  { name: "Tháng 3", total: 4500 },
];

const dataCategories = [
  { name: "Cơm", value: 400, color: "#f97316" },
  { name: "Bún/Phở", value: 300, color: "#3b82f6" },
  { name: "Đồ uống", value: 200, color: "#22c55e" },
  { name: "Ăn vặt", value: 150, color: "#a855f7" },
];

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Thống kê chuyên sâu</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Quick Stats có thể dùng lại component Stats Card */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Biểu đồ doanh thu Area Chart */}
        <Card className="col-span-4 border-none shadow-sm bg-card/50">
          <CardHeader>
            <CardTitle>Tăng trưởng doanh thu (Triệu VNĐ)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataRevenue}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px" }}
                  />
                  <Area type="monotone" dataKey="total" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Biểu đồ danh mục phổ biến */}
        <Card className="col-span-3 border-none shadow-sm bg-card/50">
          <CardHeader>
            <CardTitle>Danh mục đặt nhiều</CardTitle>
            <CardDescription>Dựa trên 1,000 đơn hàng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCategories} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={70} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                    {dataCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}