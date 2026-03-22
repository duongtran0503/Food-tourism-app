"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Search, UserCheck, UserX, Shield } from "lucide-react";

const users = [
  { id: 1, name: "Lợi Admin", email: "loi@food.com", role: "ADMIN", status: "Active", avatar: "L" },
  { id: 2, name: "Trần Thế Khang", email: "khang@merchant.com", role: "MERCHANT", status: "Active", avatar: "K" },
  { id: 3, name: "Nguyễn Văn An", email: "an@gmail.com", role: "CUSTOMER", status: "Banned", avatar: "A" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
          <p className="text-muted-foreground">Phân quyền và kiểm soát truy cập hệ thống.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm email, tên..." className="pl-9 bg-card" />
           </div>
           <Button className="bg-primary shadow-lg shadow-primary/20">Thêm Admin</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px]">Người dùng</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {user.role === "ADMIN" && <Shield className="h-3 w-3 text-orange-500" />}
                    <span className="text-xs font-semibold">{user.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === "Active" ? "default" : "destructive"}
                    className={user.status === "Active" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}