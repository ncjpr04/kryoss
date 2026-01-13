import express from "express";
import { contactController } from "./contact.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";
import {
    createContactSchema,
    listContactsSchema,
    getContactSchema,
    updateContactSchema,
    deleteContactSchema,
} from "./contact.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already exists
 */
router.post(
    "/",
    auth,
    validate(createContactSchema),
    contactController.createContact
);

/**
 * @swagger
 * /api/v1/contacts:
 *   get:
 *     summary: Get list of contacts with pagination and search
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, email, createdAt]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of contacts
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    auth,
    validate(listContactsSchema),
    contactController.listContacts
);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   get:
 *     summary: Get a single contact by ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */
router.get(
    "/:id",
    auth,
    validate(getContactSchema),
    contactController.getContact
);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *       409:
 *         description: Email already exists
 */
router.put(
    "/:id",
    auth,
    validate(updateContactSchema),
    contactController.updateContact
);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */
router.delete(
    "/:id",
    auth,
    validate(deleteContactSchema),
    contactController.deleteContact
);

export default router;
