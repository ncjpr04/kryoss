import express from "express";
import authRouter from "../modules/auth/auth.route.js";
import contactRouter from "../modules/contacts/contact.route.js";

const router = express.Router();

// Mount authentication routes
router.use("/auth", authRouter);

// Mount contact routes
router.use("/contacts", contactRouter);

export default router;
