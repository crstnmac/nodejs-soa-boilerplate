// @ts-nocheck
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import { getDb, orders, orderItems, products } from '@soa/shared-drizzle';
import type { Logger } from '@soa/shared-utils';
import type { CacheService } from '@soa/shared-utils';
import type { Order } from '@soa/shared-types';
import { NotFoundError, ConflictError } from '@soa/shared-types';

const db = getDb();

export class OrderController {
  constructor(
    private logger: Logger,
    private cache: CacheService
  ) {}

  async getUserOrders(userId: number, params: { page: number; limit: number }) {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [ordersData, totalCount] = await Promise.all([
      db.query.orders.findMany({
        where: eq(orders.userId, userId),
        limit,
        offset,
        orderBy: [desc(orders.createdAt)],
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(eq(orders.userId, userId)),
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

  async getOrderById(id: number, userId?: number): Promise<Order> {
    const whereClause = userId 
      ? and(eq(orders.id, id), eq(orders.userId, userId)) 
      : eq(orders.id, id);

    const order = await db.query.orders.findFirst({
      where: whereClause,
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Order', id);
    }

    return order as Order;
  }

  async createOrder(
    userId: number,
    data: { items: Array<{ productId: number; quantity: number }> }
  ): Promise<Order> {
    // Validate products and calculate total
    const productIds = data.items.map((item) => item.productId);
    const productsData = await db.query.products.findMany({
      where: productIds.length > 0 ? inArray(products.id, productIds) : undefined,
    });

    if (productsData.length !== productIds.length) {
      throw new ConflictError('One or more products not found');
    }

    let total = 0;
    const orderItemsData = [];

    for (const item of data.items) {
      const product = productsData.find((p: any) => p.id === item.productId);
      if (!product) continue;

      const price = parseFloat(product.price || '0');
      const subtotal = price * item.quantity;
      total += subtotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: subtotal.toFixed(2),
      });
    }

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        userId,
        total: total.toFixed(2),
        status: 'pending',
      })
      .returning();

    if (!order) {
      throw new ConflictError('Failed to create order');
    }

    // Create order items
    if (orderItemsData.length > 0) {
      await db.insert(orderItems).values(
        orderItemsData.map((item) => ({
          ...item,
          orderId: order.id,
        }))
      );
    }

    this.logger.info('Order created', { orderId: order.id, userId, total });

    return order as Order;
  }

  async updateOrderStatus(
    id: number,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  ): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    if (!order) {
      throw new NotFoundError('Order', id);
    }

    this.logger.info('Order status updated', { orderId: id, status });

    return order as Order;
  }

  async cancelOrder(id: number, userId: number): Promise<void> {
    const order = await this.getOrderById(id, userId);

    if (order.status !== 'pending' && order.status !== 'processing') {
      throw new ConflictError('Cannot cancel this order');
    }

    await db
      .update(orders)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(orders.id, id));

    this.logger.info('Order cancelled', { orderId: id, userId });
  }

  async getOrdersByStatus(
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    params: { page: number; limit: number }
  ): Promise<any> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [ordersData, totalCount] = await Promise.all([
      db.query.orders.findMany({
        where: eq(orders.status, status),
        limit,
        offset,
        orderBy: [desc(orders.createdAt)],
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(eq(orders.status, status)),
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
}
