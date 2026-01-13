import { z } from "zod";

// Contact validation schema
export const contactSchema = z.object({
    name: z.string().min(1, "Name is required").max(120, "Name must be less than 120 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format").max(200),
    phone: z
        .string()
        .min(10, "Phone must be at least 10 characters")
        .max(25, "Phone must be less than 25 characters")
        .regex(/^[0-9+\-\s()]+$/, "Phone must contain only numbers and standard formatting"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Auth validation schemas
export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required").max(120),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
