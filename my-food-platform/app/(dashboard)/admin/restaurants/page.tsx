"use client";

import { useEffect, useState } from "react";
import { RestaurantAPI, Restaurant, MOCK_FOODS, Food } from "@/lib/mock-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox"; // npx shadcn@latest add checkbox
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Pencil, Trash2, UtensilsCrossed, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<Partial<Restaurant> | null>(null);
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    setRestaurants(await RestaurantAPI.getRestaurants());
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleEdit = (res: Restaurant) => {
    setEditingRes(res);
    setSelectedFoodIds(res.foodIds || []);
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      id: editingRes?.id,
      foodIds: selectedFoodIds,
    };

    await RestaurantAPI.saveRestaurant(data);
    toast.success("Đã lưu thông tin nhà hàng");
    setIsOpen(false);
    loadData();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Đối tác Merchant</h2>
        <Button onClick={() => { setEditingRes(null); setSelectedFoodIds([]); setIsOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Thêm nhà hàng
        </Button>
      </div>

      {loading ? <Loader2 className="animate-spin mx-auto mt-20" /> : (
        <div className="grid gap-4">
          {restaurants.map((res) => (
            <RestaurantCard key={res.id} res={res} onEdit={() => handleEdit(res)} onDelete={() => { RestaurantAPI.delete(res.id); loadData(); }} />
          ))}
        </div>
      )}

      {/* DIALOG CREATE / UPDATE */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingRes ? "Sửa nhà hàng" : "Thêm nhà hàng mới"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Tên nhà hàng</label>
              <Input name="fullName" defaultValue={editingRes?.fullName} required />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Hotline</label>
              <Input name="phoneNumber" defaultValue={editingRes?.phoneNumber} required />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Địa chỉ chính xác</label>
              <Input name="address" defaultValue={editingRes?.address} required />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Giờ mở cửa</label>
              <Input name="openingHours" placeholder="08:00 - 22:00" defaultValue={editingRes?.openingHours} />
            </div>

            {/* CHỌN DANH SÁCH MÓN ĂN */}
            <div className="col-span-2 space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" /> Thực đơn của quán
              </label>
              <div className="grid grid-cols-2 gap-2 border rounded-xl p-4 bg-muted/20">
                {MOCK_FOODS.map((food) => (
                  <div key={food.id} className="flex items-center space-x-2 bg-background p-2 rounded-lg border">
                    <Checkbox 
                      id={food.id} 
                      checked={selectedFoodIds.includes(food.id)}
                      onCheckedChange={(checked) => {
                        setSelectedFoodIds(prev => checked ? [...prev, food.id] : prev.filter(id => id !== food.id));
                      }}
                    />
                    <label htmlFor={food.id} className="text-xs font-medium cursor-pointer flex-1">
                      {food.name} <span className="text-muted-foreground ml-1">({food.price.toLocaleString()}đ)</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="col-span-2 mt-4">Xác nhận lưu</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component Card hiển thị cho đẹp
function RestaurantCard({ res, onEdit, onDelete }: { res: Restaurant, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="bg-card border rounded-2xl p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group">
      {/* Avatar giả lập */}
      <div className="h-24 w-24 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0 font-bold text-2xl">
        {res.fullName.charAt(0)}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">{res.fullName}</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit} className="text-blue-500"><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {res.address}</div>
          <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {res.phoneNumber}</div>
          <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {res.openingHours}</div>
        </div>

        {/* Render danh sách món ăn đang có */}
        <div className="pt-2 flex flex-wrap gap-2">
          {res.foodIds.length > 0 ? res.foodIds.map(fid => {
            const food = MOCK_FOODS.find(f => f.id === fid);
            return <Badge key={fid} variant="secondary" className="bg-primary/5 text-primary border-primary/10">{food?.name}</Badge>
          }) : <span className="text-xs italic text-muted-foreground">Chưa có món nào được gán</span>}
        </div>
      </div>
    </div>
  );
}