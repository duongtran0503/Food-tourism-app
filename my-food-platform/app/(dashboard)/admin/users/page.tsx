"use client";

import { useEffect, useState } from "react";
import { UserMockAPI, UserItem } from "@/lib/mock-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2, MoreHorizontal, ShieldAlert, UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Load data
  const fetchUsers = async () => {
    setLoading(true);
    const data = await UserMockAPI.getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  // Xử lý Lưu (Cả Thêm mới và Sửa)
  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    try {
      if (editingUser) {
        await UserMockAPI.updateUser(editingUser.id, userData as any);
        toast.success("Cập nhật người dùng thành công");
      } else {
        await UserMockAPI.createUser(userData as any);
        toast.success("Thêm người dùng mới thành công");
      }
      setIsDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Thao tác thất bại");
    }
  };

  // Xử lý Xóa
  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này?")) {
      await UserMockAPI.deleteUser(id);
      toast.error("Đã xóa người dùng");
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Users</h2>
          <p className="text-muted-foreground">Thêm, sửa, xóa và phân quyền người dùng hệ thống.</p>
        </div>
        
        {/* MODAL THÊM MỚI */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingUser(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Chỉnh sửa thông tin" : "Tạo người dùng mới"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveUser} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Họ và tên</Label>
                <Input name="fullName" defaultValue={editingUser?.fullName} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" defaultValue={editingUser?.email} required />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input name="phoneNumber" defaultValue={editingUser?.phoneNumber} required />
              </div>
              <div className="space-y-2">
                <Label>Vai trò (Role)</Label>
                <Select name="role" defaultValue={editingUser?.role || "CUSTOMER"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                    <SelectItem value="MERCHANT">Chủ quán ăn</SelectItem>
                    <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full">Lưu thay đổi</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
      ) : (
        <div className="rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                  <TableCell>
                    <Badge className={user.status === "ACTIVE" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setIsDialogOpen(true); }}>
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}