import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { notification } from '../db/schema/index.js';
import { successResponse } from '../utils/response.js';

export async function getMyNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const notifications = await db
      .select()
      .from(notification)
      .where(eq(notification.userId, userId))
      .orderBy(desc(notification.createdAt))
      .limit(50);

    return successResponse(res, notifications, 'Notifications retrieved');
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db
      .update(notification)
      .set({ isRead: true })
      .where(and(eq(notification.id, id), eq(notification.userId, userId)));

    return successResponse(res, null, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user.id;

    await db
      .update(notification)
      .set({ isRead: true })
      .where(and(eq(notification.userId, userId), eq(notification.isRead, false)));

    return successResponse(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}
