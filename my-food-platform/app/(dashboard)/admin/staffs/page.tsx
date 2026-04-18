"use client";

import { useEffect, useState } from "react";
import { StaffService } from "@/lib/staff-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Plus, Pencil, Trash2, Mail, Phone, ShieldCheck, Search, Store, Lock 
} from "lucide-react";
import { toast } from "sonner";

export default function StaffManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  
  // State phục vụ thanh tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await StaffService.getAll();
      // Vì Backend đã gom gọn meta và items, ta lấy đúng mảng items
      setUsers(res.data.data.items || []);
    } catch (error) {
      toast.error("Không thể tải danh sách nhân sự");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: any = {
      fullName: formData.get("fullName"),
      phoneNumber: formData.get("phoneNumber"),
      role: formData.get("role"),
    };

    if (!editingUser) {
      payload.email = formData.get("email");
      const password = formData.get("password") as string;
      if (password.length < 6) {
        return toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      }
      payload.password = password;
    }

    try {
      if (editingUser) {
        await StaffService.update(editingUser.id, payload);
        toast.success("Cập nhật thông tin thành công");
      } else {
        await StaffService.create(payload);
        toast.success("Đã cấp tài khoản mới thành công");
      }
      setIsOpen(false);
      loadData();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi dữ liệu";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const renderRoleBadge = (role: string) => {
    const currentRole = role?.toUpperCase();
    if (currentRole === "ADMIN") {
      return <Badge className="bg-red-100 text-red-700 border-none hover:bg-red-100"><ShieldCheck className="w-3 h-3 mr-1" /> Admin</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-700 border-none hover:bg-orange-100"><Store className="w-3 h-3 mr-1" /> Chủ quán ăn</Badge>;
  };

  // LOGIC LỌC: Kết hợp tìm kiếm (Data đã được lọc ADMIN/STAFF từ backend nên chỉ cần lọc text)
  const filteredUsers = users.filter(user => {
    return user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.phoneNumber?.includes(searchTerm);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <ShieldCheck className="text-indigo-600" /> Quản trị Nhân sự & Đối tác
          </h1>
          <p className="text-sm text-muted-foreground italic">Quản lý tài khoản Chủ quán ăn và Quản trị viên hệ thống</p>
        </div>
        <Button onClick={() => { setEditingUser(null); setIsOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" /> Cấp tài khoản
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Tìm theo tên, email, SĐT..." 
            className="max-w-xs border-none shadow-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Thông tin</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-indigo-500" /></TableCell></TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Chưa có nhân sự hoặc đối tác nào</TableCell></TableRow>
            ) : filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="font-semibold text-slate-700">{user.fullName}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</div>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">
                   <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {user.phoneNumber || "Chưa cập nhật"}</span>
                </TableCell>
                <TableCell>{renderRoleBadge(user.role)}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setIsOpen(true); }}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { 
                    if(confirm("Xóa vĩnh viễn tài khoản này?")) 
                      StaffService.delete(user.id).then(() => {
                        toast.success("Đã xóa tài khoản");
                        loadData();
                      }).catch((err) => {
                        toast.error(err.response?.data?.message || "Không thể xóa tài khoản");
                      }); 
                  }}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
               {editingUser ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
               {editingUser ? "Cập nhật tài khoản" : "Cấp tài khoản nội bộ/đối tác"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Họ và tên</label>
              <Input name="fullName" defaultValue={editingUser?.fullName} required placeholder="Ví dụ: Lê Văn Thanh" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email định danh</label>
              <Input name="email" type="email" defaultValue={editingUser?.email} required placeholder="admin@example.com" disabled={!!editingUser} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Số điện thoại (10 số)</label>
              <Input 
                name="phoneNumber" 
                defaultValue={editingUser?.phoneNumber} 
                required 
                placeholder="0988777666" 
                pattern="[0-9]{10}" 
                title="Vui lòng nhập đúng 10 chữ số"
              />
            </div>

            {!editingUser && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1">
                   <Lock className="w-3.5 h-3.5" /> Mật khẩu khởi tạo
                </label>
                <Input 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="Ít nhất 6 ký tự..." 
                  minLength={6}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Vai trò hệ thống</label>
              <select 
                name="role" 
                defaultValue={editingUser?.role || "STAFF"}
                className="w-full p-2 border rounded-md text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="STAFF">STAFF (Chủ quán ăn)</option>
                <option value="ADMIN">ADMIN (Quản trị viên)</option>
              </select>
            </div>

            <Button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 transition-colors">
               {editingUser ? "Lưu thay đổi" : "Khởi tạo tài khoản"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}