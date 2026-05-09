// food-service.ts

import api from "@/lib/axios";

export const FoodService = {
  // Lấy danh sách món ăn
  getAll: (params?: any) => api.get("/foods", { params }),

  // Tạo món ăn mới
  create: (data: any) => api.post("/foods", data),

  // Cập nhật thông tin món ăn
  update: (id: string, data: any) => api.patch(`/foods/${id}`, data),

  // Xóa món ăn
  delete: (id: string) => api.delete(`/foods/${id}`),

  // Quản lý danh mục
  assignCategory: (foodId: string, categoryId: string) => 
    api.patch(`/foods/${foodId}/categories`, { categoryId }),

  removeCategory: (foodId: string) => 
    api.delete(`/foods/${foodId}/categories`),

};

export const CategoryService = {
  getAll: (params?: any) => api.get("/categories", { params }),
};