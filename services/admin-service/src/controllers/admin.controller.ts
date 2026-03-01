// @ts-nocheck
import { eq, and, desc, sql, like, or, inArray } from 'drizzle-orm';
import { getDb, users, products, categories, orders, orderItems } from '@soa/shared-drizzle';
import type { Logger } from '@soa/shared-utils';
import type { CacheService } from '@soa/shared-utils';
import { NotFoundError, ConflictError } from '@soa/shared-types';

const db = getDb();

export class AdminController {
  constructor(
    private logger: Logger,
    private cache: CacheService
  ) {}

  // ============================================
  // User Management
  // ============================================

  async listUsers(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? or(
          like(users.email, `%${search}%`),
          like(users.name || '', `%${search}%`)
        )
      : undefined;

    const [usersData, totalCount] = await Promise.all([
      db.query.users.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: [desc(users.createdAt)],
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(users)
        .where(whereClause),
    ]);

    return {
      data: usersData,
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil((Number(totalCount[0]?.count || 0) / limit)),
      },
    };
  }

  async getUserById(id: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return user;
  }

  async updateUser(id: number, data: { role?: string; status?: string }) {
    const updateData: any = {};

    if (data.role) {
      updateData.role = data.role;
    }

    if (data.status === 'active') {
      updateData.emailVerified = true;
    } else if (data.status === 'inactive') {
      updateData.emailVerified = false;
    }

    if (Object.keys(updateData).length === 0) {
      const user = await this.getUserById(id);
      return user;
    }

    updateData.updatedAt = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundError('User', id);
    }

    this.logger.info('User updated', { userId: id, updateData });

    return updatedUser;
  }

  async deleteUser(id: number) {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!deletedUser) {
      throw new NotFoundError('User', id);
    }

    this.logger.info('User deleted', { userId: id });

    return deletedUser;
  }

  async changeUserRole(id: number, role: string) {
    if (role !== 'user' && role !== 'admin') {
      throw new ConflictError('Invalid role');
    }

    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundError('User', id);
    }

    this.logger.info('User role changed', { userId: id, role });

    return updatedUser;
  }

  // ============================================
  // Product Management
  // ============================================

  async listProducts(params: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: number;
  }) {
    const { page, limit, search, categoryId } = params;
    const offset = (page - 1) * limit;

    const whereClause = search || categoryId
      ? and(
          search ? like(products.name, `%${search}%`) : undefined,
          categoryId ? eq(products.categoryId, categoryId) : undefined
        )
      : undefined;

    const [productsData, totalCount] = await Promise.all([
      db.query.products.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: [desc(products.createdAt)],
        with: {
          category: true,
        },
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(products)
        .where(whereClause),
    ]);

    return {
      data: productsData,
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil((Number(totalCount[0]?.count || 0) / limit)),
      },
    };
  }

  async getProductById(id: number) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    return product;
  }

  async createProduct(data: {
    name: string;
    description?: string;
    price: string;
    stock: number;
    categoryId?: number;
    image?: string;
  }) {
    const [newProduct] = await db
      .insert(products)
      .values({
        ...data,
        status: 'active',
      })
      .returning();

    if (!newProduct) {
      throw new ConflictError('Failed to create product');
    }

    this.logger.info('Product created', { productId: newProduct.id, name: data.name });

    return newProduct;
  }

  async updateProduct(id: number, data: {
    name?: string;
    description?: string;
    price?: string;
    stock?: number;
    categoryId?: number;
    image?: string;
    status?: 'active' | 'inactive' | 'archived';
  }) {
    const updateData: any = { ...data };
    updateData.updatedAt = new Date();

    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) {
      throw new NotFoundError('Product', id);
    }

    this.logger.info('Product updated', { productId: id, updateData });

    return updatedProduct;
  }

  async deleteProduct(id: number) {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!deletedProduct) {
      throw new NotFoundError('Product', id);
    }

    this.logger.info('Product deleted', { productId: id });

    return deletedProduct;
  }

  // ============================================
  // Category Management
  // ============================================

  async listCategories() {
    const categoriesData = await db.query.categories.findMany({
      orderBy: [desc(categories.createdAt)],
    });

    return {
      data: categoriesData,
    };
  }

  async createCategory(data: { name: string; description?: string }) {
    const [newCategory] = await db
      .insert(categories)
      .values(data)
      .returning();

    if (!newCategory) {
      throw new ConflictError('Failed to create category');
    }

    this.logger.info('Category created', { categoryId: newCategory.id, name: data.name });

    return newCategory;
  }

  async updateCategory(id: number, data: { name?: string; description?: string }) {
    const updateData: any = { ...data };
    updateData.updatedAt = new Date();

    const [updatedCategory] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      throw new NotFoundError('Category', id);
    }

    this.logger.info('Category updated', { categoryId: id, updateData });

    return updatedCategory;
  }

  async deleteCategory(id: number) {
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (!deletedCategory) {
      throw new NotFoundError('Category', id);
    }

    this.logger.info('Category deleted', { categoryId: id });

    return deletedCategory;
  }

  // ============================================
  // Order Management
  // ============================================

  async listOrders(params: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = params;
    const offset = (page - 1) * limit;

    const whereClause = status ? eq(orders.status, status as any) : undefined;

    const [ordersData, totalCount] = await Promise.all([
      db.query.orders.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: [desc(orders.createdAt)],
        with: {
          items: {
            with: {
              product: true,
            },
          },
          user: true,
        },
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(whereClause),
    ]);

    return {
      data: ordersData,
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil((Number(totalCount[0]?.count || 0) / limit)),
      },
    };
  }

  async getOrderById(id: number) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order', id);
    }

    return order;
  }

  async updateOrderStatus(
    id: number,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  ) {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    if (!order) {
      throw new NotFoundError('Order', id);
    }

    this.logger.info('Order status updated', { orderId: id, status });

    return order;
  }

  async cancelOrder(id: number) {
    const order = await this.getOrderById(id);

    if (order.status === 'cancelled') {
      throw new ConflictError('Order already cancelled');
    }

    await db
      .update(orders)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(orders.id, id));

    this.logger.info('Order cancelled', { orderId: id });

    return { success: true, message: 'Order cancelled successfully' };
  }

  // ============================================
  // Dashboard Statistics
  // ============================================

  async getDashboardStats() {
    const [
      userCount,
      productCount,
      categoryCount,
      orderCount,
      activeProductCount,
      pendingOrderCount,
      recentOrders,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(products),
      db.select({ count: sql<number>`count(*)` }).from(categories),
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ count: sql<number>`count(*)` })
        .from(products)
        .where(eq(products.status, 'active')),
      db.select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(eq(orders.status, 'pending')),
      db.query.orders.findMany({
        orderBy: [desc(orders.createdAt)],
        limit: 10,
        with: {
          user: true,
        },
      }),
    ]);

    // Calculate total revenue from delivered orders
    const revenueResult = await db
      .select({ total: sql<number>`sum(cast(total as numeric))` })
      .from(orders)
      .where(eq(orders.status, 'delivered'));

    return {
      users: {
        total: Number(userCount[0]?.count || 0),
      },
      products: {
        total: Number(productCount[0]?.count || 0),
        active: Number(activeProductCount[0]?.count || 0),
      },
      categories: {
        total: Number(categoryCount[0]?.count || 0),
      },
      orders: {
        total: Number(orderCount[0]?.count || 0),
        pending: Number(pendingOrderCount[0]?.count || 0),
      },
      revenue: Number(revenueResult[0]?.total || 0),
      recentOrders,
    };
  }
}
