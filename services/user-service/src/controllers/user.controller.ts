import { eq } from 'drizzle-orm';
import { getDb, users } from '@soa/shared-drizzle';
import type { User, UserUpdate, ChangePasswordDTO, ConflictError } from '@soa/shared-types';
import type { Logger } from '@soa/shared-utils';
import bcrypt from 'bcrypt';

const db = getDb();

export class UserController {
  constructor(private logger: Logger) {}

  async getProfile(userId: number): Promise<User> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ConflictError('User not found');
    }

    return user as User;
  }

  async updateProfile(
    userId: number,
    data: UserUpdate
  ): Promise<User> {
    // Check if email already exists
    if (data.email) {
      const existing = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (existing && existing.id !== userId) {
        throw new ConflictError('Email already in use');
      }
    }

    const [updated] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updated) {
      throw new ConflictError('User not found');
    }

    this.logger.info('User profile updated', { userId });
    return updated as User;
  }

  async deleteAccount(userId: number): Promise<void> {
    const [deleted] = await db
      .update(users)
      .set({
        emailVerified: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!deleted) {
      throw new ConflictError('User not found');
    }

    // In a real app, you might want to soft delete
    this.logger.info('User account deactivated', { userId });
  }

  async changePassword(
    userId: number,
    dto: ChangePasswordDTO
  ): Promise<void> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new ConflictError('User not found');
    }

    if (!user.passwordHash) {
      throw new ConflictError('User uses OAuth login, cannot change password');
    }

    const isValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isValid) {
      throw new ConflictError('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await db
      .update(users)
      .set({
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    this.logger.info('User password changed', { userId });
  }
}
