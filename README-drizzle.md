# Drizzle ORM + Postgres Setup

1. Install dependencies:
   - `pnpm add drizzle-orm pg`
2. Create `.env` with your Postgres connection string:
   - `DATABASE_URL=postgres://user:password@host:port/dbname`
3. Drizzle config and schema are in `drizzle/config.js` and `drizzle/schema.js`.
4. Migrations folder: `drizzle/migrations/`
5. To run migrations, use the exported `runMigrations` function from `drizzle/config.js`.

## Usage Example

- Import and use Drizzle in your app:

```js
import { db } from './drizzle/config.js';
import { users } from './drizzle/schema.js';

// Query users
db.select().from(users).then(console.log);
```

- Run migrations:

```js
import { runMigrations } from './drizzle/config.js';
runMigrations();
```

See Drizzle ORM docs for advanced usage.
