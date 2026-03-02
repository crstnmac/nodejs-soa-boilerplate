import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import * as authSchema from './auth-schema.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/soa_db';

const client = postgres(connectionString, { max: 10 });

const fullSchema = {
  ...schema,
  ...authSchema,
  users: authSchema.user,
  sessions: authSchema.session,
};

export const getDb = () => drizzle(client, { schema: fullSchema });

export { schema, authSchema, fullSchema };
export const { accounts, categories, products, orders, orderItems } = schema;
export const { user, session, account, verification } = authSchema;

// Backward-compatible aliases used by services.
export const users = user;
export const sessions = session;
