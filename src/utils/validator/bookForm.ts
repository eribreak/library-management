import { z } from "zod";

const currentYear = new Date().getFullYear();

export const createNumberSchema = (errorMsg: string, defaultValue?: number) =>
    z.union([
        z.number().int().positive(errorMsg),
        z
            .string()
            .refine(
                (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
                errorMsg
            )
            .transform((val) => (val ? Number(val) : defaultValue)),
    ]);

export const createSelectSchema = (errorMsg: string) =>
    z.union([
        z.number().positive(errorMsg),
        z
            .string()
            .refine((val) => val && !isNaN(Number(val)), errorMsg)
            .transform((val) => Number(val)),
        z
            .array(z.string())
            .nonempty(errorMsg)
            .transform((arr) => Number(arr[0])),
    ]);

export const bookSchema = z.object({
    title: z.string().min(1, "Tên sách là bắt buộc"),
    short_description: z
        .string()
        .min(1, "Mô tả ngắn là bắt buộc")
        .max(10000, "Mô tả ngắn không được vượt quá 10.000 ký tự")
        .optional(),
    long_description: z
        .string()
        .min(1, "Mô tả chi tiết là bắt buộc")
        .max(20000, "Mô tả chi tiết không được vượt quá 20.000 ký tự")
        .optional(),
    page_count: createNumberSchema("Số trang phải là số dương").optional(),

    published_year: z.union([
        z.string().refine((val) => {
            if (!val) return false;
            const year = Number(val);
            return !isNaN(year) && year >= 1000 && year <= currentYear;
        }, `Năm xuất bản phải là số từ 1000 đến ${currentYear}`),
        z
            .array(z.string())
            .nonempty()
            .transform((arr) => arr[0]),
    ]),

    quantity: createNumberSchema("Số lượng phải là số dương", 1),

    category_ids: z
        .array(z.union([z.string(), z.number()]))
        .min(1, "Phải chọn ít nhất một danh mục"),

    author_ids: z
        .array(z.union([z.string(), z.number()]))
        .min(1, "Phải chọn ít nhất một tác giả"),

    publisher_id: createSelectSchema("Nhà xuất bản là bắt buộc"),

    thumbnailFile: z
        .union([
            z.string().min(1, "Ảnh thumbnail là bắt buộc"),
            z.instanceof(File),
            z.null(),
        ])
        .refine((val) => val !== null, {
            message: "Ảnh thumbnail là bắt buộc",
        }),
    imageFiles: z.union([
        z.array(z.string()).min(1, "Cần ít nhất 1 ảnh sách"),
        z.array(z.instanceof(File)).min(1, "Cần ít nhất 1 ảnh sách"),
        z
            .array(z.union([z.string(), z.instanceof(File)]))
            .min(1, "Cần ít nhất 1 ảnh sách"),
        z.array(z.any()).refine((arr) => arr.length > 0, {
            message: "Cần ít nhất 1 ảnh sách",
        }),
    ]),
});

export type BookSchemaType = typeof bookSchema;
export type BookFormDataType = z.infer<typeof bookSchema>;
