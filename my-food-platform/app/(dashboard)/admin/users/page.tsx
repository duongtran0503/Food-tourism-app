"use client";
import { useEffect, useState } from "react";
import { UserService } from "@/lib/user-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Plus, Pencil, Trash2, Users, Mail, Phone, ShieldCheck, Search, UserCircle, Store, Lock 
} from "lucide-react";
import { toast } from "sonner";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await UserService.getAll();
      setUsers(res.data?.data?.items || res.data?.items || []);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng");
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
      payload.password = formData.get("password");
    }

    try {
      if (editingUser) {
        await UserService.update(editingUser.id || editingUser._id, payload);
        toast.success("Cập nhật thành công");
      } else {
        await UserService.create(payload);
        toast.success("Khởi tạo tài khoản thành công");
      }
      setIsOpen(false);
      loadData();
    } catch (error: any) {
      toast.error("Lưu dữ liệu thất bại");
    }
  };

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-rose-50 text-rose-600 border-none font-bold uppercase text-[10px]"><ShieldCheck className="w-3 h-3 mr-1" /> Quản trị</Badge>;
      case "STAFF":
      case "MERCHANT":
        return <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold uppercase text-[10px]"><Store className="w-3 h-3 mr-1" /> Chủ quán</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-500 border-none font-bold uppercase text-[10px]"><UserCircle className="w-3 h-3 mr-1" /> Du khách</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "ALL") return matchesSearch;
    if (activeTab === "MERCHANT") return matchesSearch && (user.role === "STAFF" || user.role === "MERCHANT");
    return matchesSearch && user.role === activeTab;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Users className="text-indigo-600" /> Quản lý người dùng
          </h1>
          <p className="text-sm text-muted-foreground italic">Quản trị viên có quyền quản lý mọi cấp bậc tài khoản</p>
        </div>
        <Button onClick={() => { setEditingUser(null); setIsOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold uppercase text-xs tracking-wider">
          <Plus className="mr-2 h-4 w-4" /> Thêm tài khoản
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 border rounded-xl shadow-sm">
        <Tabs defaultValue="ALL" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="ALL" className="rounded-md px-4 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600">TẤT CẢ</TabsTrigger>
            <TabsTrigger value="USER" className="rounded-md px-4 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600">DU KHÁCH</TabsTrigger>
            <TabsTrigger value="MERCHANT" className="rounded-md px-4 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600">CHỦ QUÁN</TabsTrigger>
            <TabsTrigger value="ADMIN" className="rounded-md px-4 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-600">QUẢN TRỊ</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Tìm theo tên, email..." 
            className="pl-9 rounded-xl border-slate-200" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Thành viên</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Phân quyền</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="animate-spin mx-auto text-indigo-500" /></TableCell></TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">Không có người dùng nào thuộc nhóm này</TableCell></TableRow>
            ) : filteredUsers.map((user) => (
              <TableRow key={user.id || user._id} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="font-bold text-slate-700">{user.fullName}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</div>
                </TableCell>
                <TableCell className="text-slate-500 text-sm font-medium">
                   <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-indigo-400" /> {user.phoneNumber || "N/A"}</div>
                </TableCell>
                <TableCell>{renderRoleBadge(user.role)}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setIsOpen(true); }} className="rounded-lg hover:bg-indigo-50">
                    <Pencil className="h-4 w-4 text-indigo-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { if(confirm("Xóa vĩnh viễn tài khoản này?")) UserService.delete(user.id || user._id).then(() => loadData()); }} className="rounded-lg hover:bg-red-50">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-black uppercase text-xl italic tracking-tighter">
               {editingUser ? <Pencil className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
               {editingUser ? "Sửa tài khoản" : "Cấp tài khoản mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Họ và tên</label>
              <Input name="fullName" defaultValue={editingUser?.fullName} required className="rounded-xl" placeholder="Ví dụ: Lê Văn Lợi" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Email (ID đăng nhập)</label>
              <Input name="email" type="email" defaultValue={editingUser?.email} required className="rounded-xl" disabled={!!editingUser} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600">Vai trò hệ thống</label>
              <select 
                name="role" 
                defaultValue={editingUser?.role || "USER"}
                className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="USER">USER (Khách du lịch)</option>
                <option value="STAFF">MERCHANT (Chủ quán ăn)</option>
                <option value="ADMIN">ADMIN (Quản trị viên)</option>
              </select>
            </div>

            {!editingUser && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-600">Mật khẩu khởi tạo</label>
                <Input name="password" type="password" required className="rounded-xl" minLength={6} />
              </div>
            )}

            <Button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-black uppercase tracking-widest transition-all">
               Xác nhận lưu
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}