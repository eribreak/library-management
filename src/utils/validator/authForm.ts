import { email, password } from "./commonValidator";
import { z } from "zod";

export const loginSchema = z.object({
    email: email,
    password: password,
});
export type LoginSchemaType = typeof loginSchema;
export type LoginDataType = z.infer<typeof loginSchema>;
