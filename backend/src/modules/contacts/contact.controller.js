import { contactService } from "./contact.service.js";
import { ApiError } from "../../common/errors/ApiError.js";

/**
 * Create a new contact
 * POST /api/v1/contacts
 */
const createContact = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError(401, "UNAUTHORIZED", "Not authenticated");
        }

        const { name, email, phone } = req.body;

        const contact = await contactService.createContact(userId, {
            name,
            email,
            phone,
        });

        return res.status(201).json({
            success: true,
            data: contact,
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Get paginated list of contacts
 * GET /api/v1/contacts
 */
const listContacts = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError(401, "UNAUTHORIZED", "Not authenticated");
        }

        const options = req.validated?.query || req.query;

        const result = await contactService.listContacts(userId, options);

        return res.status(200).json({
            success: true,
            data: result.contacts,
            pagination: result.pagination,
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Get a single contact by ID
 * GET /api/v1/contacts/:id
 */
const getContact = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError(401, "UNAUTHORIZED", "Not authenticated");
        }

        const { id } = req.params;

        const contact = await contactService.getContactById(userId, id);

        return res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Update a contact
 * PUT /api/v1/contacts/:id
 */
const updateContact = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError(401, "UNAUTHORIZED", "Not authenticated");
        }

        const { id } = req.params;
        const updateData = req.body;

        const contact = await contactService.updateContact(userId, id, updateData);

        return res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Delete a contact
 * DELETE /api/v1/contacts/:id
 */
const deleteContact = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError(401, "UNAUTHORIZED", "Not authenticated");
        }

        const { id } = req.params;

        await contactService.deleteContact(userId, id);

        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (err) {
        return next(err);
    }
};

export const contactController = {
    createContact,
    listContacts,
    getContact,
    updateContact,
    deleteContact,
};
