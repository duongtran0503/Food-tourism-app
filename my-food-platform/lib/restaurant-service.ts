import api from "@/lib/axios"; // Dùng duy nhất một instance đã cấu hình

export const RestaurantService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; foodId?: string }) => 
    api.get("/restaurants", { params }),

  getById: (id: string) => 
    api.get(`/restaurants/${id}`),

  create: (data: any) => 
    api.post("/restaurants", data),

  update: (id: string, data: any) => 
    api.patch(`/restaurants/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/restaurants/${id}`),

  approve: (id: string, status: 'approved' | 'rejected') => 
    api.patch(`/restaurants/${id}/approve`, { status }),

  getMyRestaurant: () => api.get("/restaurants/my-restaurant"),

  linkFood: (restaurantId: string, foodIds: string[]) => 
    api.post(`/restaurants/${restaurantId}/foods`, { foodIds }),
};

export const FoodService = {
  getAll: () => api.get("/foods"),
};

