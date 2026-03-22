// lib/zod-schemas.ts
import { z } from "zod";

// Schema cho Đăng nhập
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Schema cho Đăng ký (mở rộng từ Login)
export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Hiển thị lỗi ở ô confirmPassword
  });

// Type export để dùng trong Component
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;