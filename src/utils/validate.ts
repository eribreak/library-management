import { z } from "zod";

export const formSchema = z
    .object({
        username: z
            .string()
            .min(1, "Tên người dùng là bắt buộc")
            .max(100, "Tên người dùng tối đa 100 ký tự")
            .trim()
            .optional(),
        phoneNumber: z
            .string()
            .min(1, "Số điện thoại là bắt buộc")
            .regex(
                /^\+[1-9]\d{1,14}$/,
                "Số điện thoại phải theo định dạng quốc tế (ví dụ: +84123456789)"
            )
            .optional(),
        email: z
            .string()
            .min(1, "Email là bắt buộc")
            .email("Email không hợp lệ")
            .max(100)
            .trim()
            .optional(),
        password: z
            .string()
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ in hoa")
            .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số")
            .regex(
                /[^A-Za-z0-9]/,
                "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
            )
            .optional(),
        newPassword: z
            .string()
            .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
            .regex(/[A-Z]/, "Mật khẩu mới phải chứa ít nhất một chữ in hoa")
            .regex(/[0-9]/, "Mật khẩu mới phải chứa ít nhất một chữ số")
            .regex(
                /[^A-Za-z0-9]/,
                "Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt"
            )
            .optional(),
        confirmPassword: z
            .string()
            .min(1, "Xác nhận mật khẩu là bắt buộc")
            .optional(),
        confirmNewPassword: z
            .string()
            .min(1, "Xác nhận mật khẩu mới là bắt buộc")
            .optional(),
        userGenders: z
            .array(z.string(), {
                required_error: "Vui lòng chọn giới tính",
            })
            .optional(),
        isAgree: z
            .boolean()
            .refine((val) => val === true, {
                message: "Bạn phải đồng ý với các điều khoản và điều kiện",
            })
            .optional(),
        province: z
            .array(z.string())
            .optional()
            .refine((val) => typeof val !== "undefined", {
                message: "Vui lòng chọn tỉnh/thành phố",
            }),
        district: z
            .array(z.string())
            .optional()
            .refine((val) => typeof val !== "undefined", {
                message: "Vui lòng chọn quận/huyện",
            }),
        ward: z
            .array(z.string())
            .optional()
            .refine((val) => typeof val !== "undefined", {
                message: "Vui lòng chọn xã/phường",
            }),
    })
    .refine(
        (data) => {
            if (data.password && data.confirmPassword) {
                return data.password === data.confirmPassword;
            }
            return true;
        },
        {
            path: ["confirmPassword"],
            message: "Mật khẩu xác nhận không khớp",
        }
    )
    .refine(
        (data) => {
            if (data.newPassword && data.confirmNewPassword) {
                return data.newPassword === data.confirmNewPassword;
            }
            return true;
        },
        {
            path: ["confirmNewPassword"],
            message: "Mật khẩu mới xác nhận không khớp",
        }
    )
    .refine(
        (data) => {
            if (data.newPassword && data.password) {
                return data.newPassword !== data.password;
            }
            return true;
        },
        {
            path: ["newPassword"],
            message: "Mật khẩu mới phải khác mật khẩu hiện tại",
        }
    );

export type FormSchemaType = typeof formSchema;
export type FormDataType = z.infer<FormSchemaType>;
