import { defineConfig } from 'prisma/config';

export default defineConfig({
  // schema: 'src/prisma/schema.prisma',
  schema: 'src/prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
