import api from "@/lib/axios";

export const StaffService = {
  // Lấy danh sách toàn bộ người dùng (items, meta)
  getAll: (params?: any) => api.get("/staffs", { params }),

  // Xem chi tiết một người dùng
  getById: (id: string) => api.get(`/staffs/${id}`),

  // Khởi tạo tài khoản mới
  create: async (data: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    password?: string;
    role: "STAFF" | "ADMIN";
  }) => {
    return await api.post("/staffs", data);
  },

  // Cập nhật thông tin
  update: (id: string, data: any) => api.patch(`/staffs/${id}`, data),

  // Xóa vĩnh viễn tài khoản
  delete: (id: string) => api.delete(`/staffs/${id}`),
};