import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Minimum of 8 characters required"),
});

export const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }), // Name validation
  email: z.string().email({ message: "Invalid email format" }), // Email validation
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }), // Password validation
});
