import { z } from "zod";

// Contact field validation schemas
const contactNameSchema = z.string().min(1, "Name is required").max(120, "Name must be less than 120 characters");

const contactEmailSchema = z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(200, "Email must be less than 200 characters");

const contactPhoneSchema = z
    .string()
    .min(10, "Phone must be at least 10 characters")
    .max(25, "Phone must be less than 25 characters")
    .regex(/^[0-9+\-\s()]+$/, "Phone must contain only numbers and standard formatting characters (+, -, spaces, parentheses)");

// POST /api/v1/contacts - Create contact
export const createContactSchema = z.object({
    body: z.object({
        name: contactNameSchema,
        email: contactEmailSchema,
        phone: contactPhoneSchema,
    }),
});

// PUT /api/v1/contacts/:id - Update contact
export const updateContactSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Contact ID is required"),
    }),
    body: z.object({
        name: contactNameSchema.optional(),
        email: contactEmailSchema.optional(),
        phone: contactPhoneSchema.optional(),
    }).refine((data) => {
        // At least one field must be provided
        return data.name || data.email || data.phone;
    }, {
        message: "At least one field (name, email, or phone) must be provided for update",
    }),
});

// GET /api/v1/contacts - List contacts with pagination, search, sort
export const listContactsSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).optional().default("1"),
        limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive().max(100)).optional().default("10"),
        search: z.string().max(200).optional(),
        sortBy: z.enum(["name", "email", "createdAt"]).optional().default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    }),
});

// GET /api/v1/contacts/:id - Get single contact
export const getContactSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Contact ID is required"),
    }),
});

// DELETE /api/v1/contacts/:id - Delete contact
export const deleteContactSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Contact ID is required"),
    }),
});
