import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb, users, sessions } from '@soa/shared-drizzle';
import { nanoid } from 'nanoid';

const db = getDb();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'credential',
    users: users,
    sessions: sessions,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // TODO: Implement email sending service
      console.log(`Password reset email sent to: ${user.email}, URL: ${url}`);
    },
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Implement email sending service
      console.log(`Verification email sent to: ${user.email}, URL: ${url}`);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookiePrefix: 'soa',
    generateSessionId: () => nanoid(),
  },
  baseURL: process.env.AUTH_URL || 'http://localhost:3000/auth',
  trustedOrigins: [
    process.env.BETTER_AUTH_ORIGIN || 'http://localhost:3000',
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      enabled: !!process.env.GITHUB_CLIENT_ID,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
