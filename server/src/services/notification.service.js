import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { notification, user } from '../db/schema/index.js';

export async function createNotification({ userId, title, message, type = 'SYSTEM' }) {
  try {
    const [created] = await db
      .insert(notification)
      .values({ userId, title, message, type, isRead: false })
      .returning();
    return created;
  } catch (err) {
    console.error('Failed to create notification:', err.message);
    return null;
  }
}

export async function notifyAdmins({ title, message, type = 'SYSTEM' }) {
  try {
    const admins = await db.select({ id: user.id }).from(user).where(eq(user.role, 'ADMIN'));

    if (admins.length === 0) return null;

    return await db.insert(notification).values(
      admins.map((admin) => ({
        userId: admin.id,
        title,
        message,
        type,
        isRead: false,
      }))
    );
  } catch (err) {
    console.error('Failed to notify admins:', err.message);
    return null;
  }
}
