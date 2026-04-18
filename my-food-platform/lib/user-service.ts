import api from "@/lib/axios";

export const UserService = {

  getAll: async (params?: any) => {
    return await api.get("/users", { params });
  },

  getById: async (id: string) => {
    return await api.get(`/users/${id}`);
  },

  create: async (data: any) => {
    return await api.post("/users", data);
  },

  update: async (id: string, data: any) => {
    return await api.patch(`/users/${id}`, data);
  },

  delete: async (id: string) => {
    return await api.delete(`/users/${id}`);
  }
};