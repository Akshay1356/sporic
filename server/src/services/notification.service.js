import prisma from '../config/prisma.js';

export async function createNotification({ userId, title, message, type = 'SYSTEM' }) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        isRead: false,
      },
    });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
    return null;
  }
}

export async function notifyAdmins({ title, message, type = 'SYSTEM' }) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    const notifications = admins.map((admin) => ({
      userId: admin.id,
      title,
      message,
      type,
      isRead: false,
    }));

    return await prisma.notification.createMany({
      data: notifications,
    });
  } catch (err) {
    console.error('Failed to notify admins:', err.message);
    return null;
  }
}
