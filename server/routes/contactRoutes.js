import express from "express";
const router = express.Router();

// Controllers
import {
  submitContactForm,
  getContacts,
  getContactById,
  deleteContact,
} from "../controllers/contactController.js";

// Validators
import { contactFormValidator } from "../validator/contactValidator.js";

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact message handling
 */

/**
 * @swagger
 * /api/contacts/add:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message saved successfully
 */
router.post("/add", contactFormValidator, submitContactForm);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contact messages (paginated)
 *     tags: [Contacts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Contact messages retrieved
 */
router.get("/", getContacts);

/**
 * @swagger
 * /api/contacts/{id}/view:
 *   get:
 *     summary: Get a single contact message by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Single contact message
 */
router.get("/:id/view", getContactById);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact message by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted
 */
router.delete("/:id", deleteContact);

export default router;
