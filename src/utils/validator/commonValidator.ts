import { z } from "zod";

export const name = z.string().min(1, "Tên là bắt buộc").max(100).trim();
export const description = z
    .string()
    .min(1, "Mô tả là bắt buộc")
    .max(100, "Mô tả tối đa 500 ký tự")
    .trim();

export const email = z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ")
    .max(100)
    .trim();

export const password = z
    .string()
    .min(8, "Mật khẩu là bắt buộc")
    .max(100)
    .trim()
    .optional();

export const employee_code = z
    .string()
    .min(1, "Mã nhân viên không được để trống")
    .max(20)
    .trim();
export const full_name = z
    .string()
    .min(1, "Tên nhân viên không được để trống")
    .max(100)
    .trim();

