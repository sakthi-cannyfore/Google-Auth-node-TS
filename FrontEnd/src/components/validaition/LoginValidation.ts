import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email Is Required"),
  password: z.string("Password is Required"),
  twoFactorCode: z.string().optional(),
});

export type LoginFormValidation = z.infer<typeof loginSchema>;
