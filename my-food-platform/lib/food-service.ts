import api from "@/lib/axios";

export const FoodService = {
  getMe: (params?: any) => api.get("/foods/me", { params }),

  getAll: (params?: any) => api.get("/foods", { params }),

  create: (data: any) => api.post("/foods", data),
  update: (id: string, data: any) => api.patch(`/foods/${id}`, data),
  delete: (id: string) => api.delete(`/foods/${id}`),

  assignCategory: (foodId: string, categoryId: string) => 
    api.patch(`/foods/${foodId}/categories`, { categoryId }),
  removeCategory: (foodId: string) => 
    api.delete(`/foods/${foodId}/categories`),
};

export const CategoryService = {
  getMe: (params?: any) => api.get("/categories/me", { params }),
  
  getAll: (params?: any) => api.get("/categories", { params }),
};