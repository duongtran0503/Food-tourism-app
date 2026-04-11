import api from "@/lib/axios";

export const CategoryService = {
  // GET: Lấy danh sách (Backend trả về CategoryResponse)
  getAll: (params?: any) => api.get("/categories", { params }),

  // POST: Tạo mới (Dùng CreateCategoryRequest)
  create: (data: any) => api.post("/categories", data),

  // PATCH: Cập nhật (Dùng UpdateCategoryRequest)
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),

  // DELETE: Xóa
  delete: (id: string) => api.delete(`/categories/${id}`),
};