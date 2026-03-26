import { z } from "zod";

/** * 1. Định nghĩa TẤT CẢ các Role có trong hệ thống 
 * Dùng để định nghĩa kiểu dữ liệu cho User trong Mock API hoặc Database
 */
export const UserRoleEnum = z.enum(["ADMIN", "CUSTOMER", "MERCHANT"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

// ---

// Schema cho Đăng nhập
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

/**
 * 2. Schema cho Đăng ký
 * Lưu ý: 'role' ở đây chỉ giới hạn 2 loại để người lạ không thể tự đăng ký làm ADMIN.
 */
export const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string()
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
    .min(10, "Số điện thoại phải có ít nhất 10 số"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
  confirmPassword: z.string(),
  role: z.enum(["CUSTOMER", "MERCHANT"]), // Chỉ cho phép 2 role này tại trang Register
  avatar: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// ---

// Type export để dùng trong Component
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;