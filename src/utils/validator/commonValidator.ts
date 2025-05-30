import { z } from "zod";

export const name = z
    .string()
    .min(1, "Tên là bắt buộc")
    .max(100, "Tên tôi đa 100 ký tự")
    .trim();
export const description = z
    .string()
    .min(1, "Mô tả là bắt buộc")
    .max(255, "Mô tả tối đa 255 ký tự")
    .trim();

export const email = z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ")
    .max(100, "Email tối đa 100 ký tự")
    .trim();

export const password = z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .max(100, "Mật khẩu tối đa 100 ký tự")
    .trim()
    .optional();

export const employee_code = z
    .string()
    .min(1, "Mã nhân viên không được để trống")
    .max(5, "Mã nhân viên tối đa 5 ký tự")
    .trim()
    .regex(
        /^K\d{4}$/,
        "Mã nhân viên phải bắt đầu bằng 'K' và theo sau là 4 chữ số"
    );

export const full_name = z
    .string()
    .min(1, "Tên nhân viên không được để trống")
    .max(100, "Tên nhân viên tối đa 100 ký tự")
    .trim();
