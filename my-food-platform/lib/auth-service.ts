import api from "@/lib/axios";

export const AuthService = {
  // Đăng nhập
  login: async (data: any) => {
    const res = await api.post("/auth/login", data);
    const { tokens, userInfo } = res.data.data;
    
    // Lưu token để dùng cho các request sau
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("user", JSON.stringify(userInfo));
    
    return res.data.data;
  },

  // Đăng ký (Gửi kèm phoneNumber)
  register: (data: any) => api.post("/auth/register", data),

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};