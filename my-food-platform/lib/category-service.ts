import api from "@/lib/axios";

export const CategoryService = {
  // GET: Lấy danh sách public hoặc toàn bộ (Admin)
  getAll: (params?: any) => api.get("/categories", { params }),

  // GET: Lấy danh sách của riêng tôi (Dành cho phân quyền Staff)
  getMe: (params?: any) => api.get("/categories/me", { params }),

  // POST: Tạo mới
  create: (data: any) => api.post("/categories", data),

  // PATCH: Cập nhật
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),

  // DELETE: Xóa
  delete: (id: string) => api.delete(`/categories/${id}`),
};