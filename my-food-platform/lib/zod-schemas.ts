import { z } from "zod";

export const UserRoleEnum = z.enum(["ADMIN", "USER", "STAFF"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string()
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
    .min(10, "Số điện thoại phải có ít nhất 10 số"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
  confirmPassword: z.string(),
  role: z.enum(["USER", "STAFF"]), 
  avatar: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;