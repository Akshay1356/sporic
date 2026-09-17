import { desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { contactInquiry } from '../db/schema/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { notifyAdmins } from '../services/notification.service.js';

export async function submitInquiry(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return errorResponse(res, 'All inquiry fields (name, email, subject, message) are required.', 400, 'MISSING_FIELDS');
    }

    const [inquiry] = await db
      .insert(contactInquiry)
      .values({ name, email: email.toLowerCase(), subject, message, status: 'NEW' })
      .returning();

    await notifyAdmins({
      title: 'New SpoRIC Inquiry',
      message: `Inquiry from ${name} (${email}): '${subject}'.`,
      type: 'ANNOUNCEMENT',
    });

    return successResponse(res, inquiry, 'Inquiry submitted successfully. Our team will contact you shortly.', 201);
  } catch (err) {
    next(err);
  }
}

export async function getInquiries(req, res, next) {
  try {
    const inquiries = await db.select().from(contactInquiry).orderBy(desc(contactInquiry.createdAt));
    return successResponse(res, inquiries, 'Contact inquiries retrieved');
  } catch (err) {
    next(err);
  }
}
