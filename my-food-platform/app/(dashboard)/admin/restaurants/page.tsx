"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";

const restaurants = [
  { id: "1", name: "Bún Bò Huế O Xuân", address: "Quận 1, HCM", status: "Active", type: "Truyền thống" },
  { id: "2", name: "Pizza Home", address: "Quận 3, HCM", status: "Pending", type: "Âu Mỹ" },
  { id: "3", name: "Cơm Gà Bà Luận", address: "Tam Kỳ, Quảng Nam", status: "Active", type: "Đặc sản" },
];

export default function RestaurantsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Danh sách Quán ăn</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm tên quán..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên quán</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Phân loại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurants.map((res) => (
              <TableRow key={res.id}>
                <TableCell className="font-medium">{res.name}</TableCell>
                <TableCell>{res.address}</TableCell>
                <TableCell>{res.type}</TableCell>
                <TableCell>
                  <Badge variant={res.status === "Active" ? "default" : "secondary"}>
                    {res.status === "Active" ? "Đang hoạt động" : "Chờ duyệt"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                  {res.status === "Pending" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}