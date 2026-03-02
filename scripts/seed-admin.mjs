import postgres from 'postgres';

const usage = `
Promote an existing user to admin.

Usage:
  npm run seed:admin -- --email you@example.com

Options:
  --email, -e   User email to promote (or set ADMIN_EMAIL)
  --help, -h    Show this help
`.trim();

const parseArgs = (argv) => {
  let email;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      return { help: true };
    }
    if (arg === '--email' || arg === '-e') {
      email = argv[i + 1];
      i += 1;
    }
  }

  return { email };
};

const main = async () => {
  const { help, email: emailArg } = parseArgs(process.argv.slice(2));
  if (help) {
    console.log(usage);
    return;
  }

  const email = emailArg ?? process.env.ADMIN_EMAIL;
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
  if (!email) {
    throw new Error('Missing email. Pass --email or set ADMIN_EMAIL in your environment.');
  }

  const sql = postgres(databaseUrl, { max: 1 });

  try {
    const users = await sql`
      select id, email, role
      from "user"
      where email = ${email}
      limit 1
    `;

    if (users.length === 0) {
      throw new Error(`User not found for email: ${email}. Sign up first, then run seed:admin.`);
    }

    const current = users[0];
    if (current.role === 'admin') {
      console.log(`User is already admin: ${current.email} (${current.id})`);
      return;
    }

    const updated = await sql`
      update "user"
      set role = 'admin', updated_at = now()
      where id = ${current.id}
      returning id, email, role
    `;

    if (updated.length === 0) {
      throw new Error(`Failed to promote user: ${email}`);
    }

    console.log(`Promoted to admin: ${updated[0].email} (${updated[0].id})`);
  } finally {
    await sql.end({ timeout: 5 });
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
