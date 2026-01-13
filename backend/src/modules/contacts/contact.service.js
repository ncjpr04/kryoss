import { prisma } from "../../config/db.js";
import { ApiError } from "../../common/errors/ApiError.js";

/**
 * Create a new contact for a user
 */
export const createContact = async (userId, contactData) => {
    const { name, email, phone } = contactData;

    // Check if contact with this email already exists for this user
    const existingContact = await prisma.contact.findUnique({
        where: {
            email_userId: {
                email,
                userId,
            },
        },
    });

    if (existingContact) {
        throw new ApiError(409, "DUPLICATE_EMAIL", "A contact with this email already exists");
    }

    const contact = await prisma.contact.create({
        data: {
            name,
            email,
            phone,
            userId,
        },
    });

    return contact;
};

/**
 * Get paginated list of contacts with search and sorting
 */
export const listContacts = async (userId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = {
        userId,
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ],
        }),
    };

    // Get total count for pagination
    const total = await prisma.contact.count({ where });

    // Get contacts
    const contacts = await prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    return {
        contacts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get a single contact by id
 */
export const getContactById = async (userId, contactId) => {
    const contact = await prisma.contact.findFirst({
        where: {
            id: contactId,
            userId,
        },
    });

    if (!contact) {
        throw new ApiError(404, "CONTACT_NOT_FOUND", "Contact not found");
    }

    return contact;
};

/**
 * Update a contact
 */
export const updateContact = async (userId, contactId, updateData) => {
    // Check if contact exists and belongs to user
    const existingContact = await prisma.contact.findFirst({
        where: {
            id: contactId,
            userId,
        },
    });

    if (!existingContact) {
        throw new ApiError(404, "CONTACT_NOT_FOUND", "Contact not found");
    }

    // If email is being updated, check for duplicates
    if (updateData.email && updateData.email !== existingContact.email) {
        const duplicateContact = await prisma.contact.findUnique({
            where: {
                email_userId: {
                    email: updateData.email,
                    userId,
                },
            },
        });

        if (duplicateContact) {
            throw new ApiError(409, "DUPLICATE_EMAIL", "A contact with this email already exists");
        }
    }

    const updatedContact = await prisma.contact.update({
        where: { id: contactId },
        data: updateData,
    });

    return updatedContact;
};

/**
 * Delete a contact
 */
export const deleteContact = async (userId, contactId) => {
    // Check if contact exists and belongs to user
    const existingContact = await prisma.contact.findFirst({
        where: {
            id: contactId,
            userId,
        },
    });

    if (!existingContact) {
        throw new ApiError(404, "CONTACT_NOT_FOUND", "Contact not found");
    }

    await prisma.contact.delete({
        where: { id: contactId },
    });

    return { success: true };
};

export const contactService = {
    createContact,
    listContacts,
    getContactById,
    updateContact,
    deleteContact,
};
