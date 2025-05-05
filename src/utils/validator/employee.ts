import { z } from "zod";
import { full_name, employee_code } from "./commonValidator";

export const employee_email = z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ")
    .max(100)
    .trim()
    .refine(
        (email) => {
            const domainRegex = /@(kiasoft\.com\.vn|kiaisoft\.com)$/;
            const prefixRegex = /^kiaisoft/;
            return domainRegex.test(email) || prefixRegex.test(email);
        },
        {
            message:
                'Email phải có tiền tố "kiaisoft" hoặc hậu tố "kiasoft.com.vn" hoặc "kiaisoft.com".',
        }
    );

export const employeeSchema = z.object({
    employee_code: employee_code,
    full_name: full_name,
    email: employee_email,
});
export type EmployeeSchemaType = typeof employeeSchema;
export type EmployeeDataType = z.infer<typeof employeeSchema>;
