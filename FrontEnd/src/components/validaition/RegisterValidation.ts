import { z } from "zod";

export const Registerchema = z.object({
  name: z.string("Name is Required"),
  email: z.email("Email is Required"),
  password: z.string().min(6, "Min 6 char required"),
});

export type RegisterForm = z.infer<typeof Registerchema>;
