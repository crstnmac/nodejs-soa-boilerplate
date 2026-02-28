// @ts-nocheck
import { eq, desc, like, and, sql } from 'drizzle-orm';
import { getDb, products, categories } from '@soa/shared-drizzle';
import type { Logger } from '@soa/shared-utils';
import type { CacheService } from '@soa/shared-utils';
import type { Product } from '@soa/shared-types';
import { NotFoundError } from '@soa/shared-types';

const db = getDb();

export class ProductController {
  constructor(
    private logger: Logger,
    private cache: CacheService
  ) {}

  async getAllProducts(params: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: number;
  }) {
    const { page, limit, search, categoryId } = params;
    const offset = (page - 1) * limit;

    // Check cache
    const cacheKey = `products:${page}:${limit}:${search || ''}:${categoryId || ''}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) {
      this.logger.debug('Products cache hit', { cacheKey });
      return cached;
    }

    let whereConditions = sql`${products.status} = 'active'`;

    if (search) {
      whereConditions = sql`${whereConditions} AND (${like(products.name, `%${search}%`)})`;
    }

    if (categoryId) {
      whereConditions = sql`${whereConditions} AND ${products.categoryId} = ${categoryId}`;
    }

    const [productsData, totalCount] = await Promise.all([
      db.query.products.findMany({
        where: whereConditions,
        limit,
        offset,
        orderBy: [desc(products.createdAt)],
        with: {
          category: true,
        },
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(products)
        .where(whereConditions),
    ]);

    const result = {
      data: productsData,
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil((Number(totalCount[0]?.count || 0) / limit)),
      },
    };

    // Cache for 5 minutes
    await this.cache.set(cacheKey, result, 300);

    return result;
  }

  async getProductById(id: number): Promise<Product> {
    const cacheKey = `product:${id}`;
    const cached = await this.cache.get<Product>(cacheKey);
    if (cached) {
      this.logger.debug('Product cache hit', { id });
      return cached;
    }

    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
        },
    });

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    // Cache for 30 minutes
    await this.cache.set(cacheKey, product, 1800);

    return product as Product;
  }

  async createProduct(
    data: {
      name: string;
      description?: string;
      price: string;
      stock: number;
      categoryId?: number;
      image?: string;
    }
  ): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(data)
      .returning();

    this.logger.info('Product created', { productId: product.id });

    // Invalidate cache
    await this.cache.delete(`product:${product.id}`);
    await this.cache.invalidatePattern('products:*');

    return product as Product;
  }

  async updateProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: string;
      stock?: number;
      categoryId?: number;
      image?: string;
      status?: 'active' | 'inactive' | 'archived';
    }
  ): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    this.logger.info('Product updated', { productId: id });

    // Invalidate cache
    await this.cache.delete(`product:${id}`);
    await this.cache.invalidatePattern('products:*');

    return product as Product;
  }

  async deleteProduct(id: number): Promise<void> {
    const [deleted] = await db
      .update(products)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundError('Product', id);
    }

    this.logger.info('Product deleted (soft)', { productId: id });

    // Invalidate cache
    await this.cache.delete(`product:${id}`);
    await this.cache.invalidatePattern('products:*');
  }

  async getAllCategories() {
    const cacheKey = 'categories:all';
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) {
      this.logger.debug('Categories cache hit');
      return cached;
    }

    const categoriesData = await db.query.categories.findMany({
      orderBy: [desc(categories.createdAt)],
    });

    // Cache for 1 hour
    await this.cache.set(cacheKey, categoriesData, 3600);

    return categoriesData;
  }

  async createCategory(data: { name: string; description?: string }) {
    const [category] = await db.insert(categories).values(data).returning();

    this.logger.info('Category created', { categoryId: category.id });

    // Invalidate cache
    await this.cache.delete('categories:all');

    return category;
  }
}
