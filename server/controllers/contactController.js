import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Contact from "../models/contactModel.js";
import sendEmail from "../utils/sendEmail.js";
import { getCache, setCache, delCache } from "../utils/cache.js";

// 📩 Submit Contact Form
export const submitContactForm = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Name, email, and message are required." });
  }

  const contact = await Contact.create({ name, email, phone, message });

  if (!contact) {
    return res
      .status(500)
      .json({ message: "Failed to save contact in database." });
  }

  const subject = `New Contact Message from ${name}`;
  const text = `
You received a new message from your portfolio/contact form:

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

Message:
${message}
`;

  try {
    await sendEmail(subject, text, email);
  } catch (err) {
    console.error("📧 Email sending failed:", err.message);
  }

  await delCache("allContact-*"); // Invalidate all paginated cache

  return res.status(201).json({
    message: "Message saved successfully" + (email ? " and email sent." : ""),
  });
});

// 📄 Get Paginated Contacts
export const getContacts = expressAsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const cacheKey = `allContact-Page:${page}_limit${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.status(200).json({ from: "cache", ...cached });
  }
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    lean: true,
  };

  const contacts = await Contact.paginate({},options);

  if (!contacts.docs.length) {
    return res.status(404).json({ message: "No contacts found" });
  }

  const response = {
    data: contacts.docs,
    pagination: {
      totalDocs: contacts.totalDocs,
      limit: contacts.limit,
      totalPages: contacts.totalPages,
      currentPage: contacts.page,
      pagingCounter: contacts.pagingCounter,
      hasPrevPage: contacts.hasPrevPage,
      hasNextPage: contacts.hasNextPage,
      prevPage: contacts.prevPage,
      nextPage: contacts.nextPage,
    },
  };

  await setCache(cacheKey, response, 300);
  res.status(200).json({ from: "db", ...response });
});

// 🔍 Get Contact by ID
export const getContactById = expressAsyncHandler(async (req, res) => {
  const cacheKey = `contact:${req.params.id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.status(200).json({
      from: "cache",
      message: "Contact message fetched from cache",
      contact: cached,
    });
  }

  const contact = await Contact.findById(req.params.id).lean();

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  await setCache(cacheKey, contact, 300);
  res.status(200).json({
    from: "db",
    message: "Contact message fetched successfully",
    contact,
  });
});

// 🗑️ Delete Contact
export const deleteContact = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id).lean();
  
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  await delCache("allContact-*");
  await delCache(`contact:${req.params.id}`);

  res.status(200).json({ message: "Contact deleted successfully" });
});
