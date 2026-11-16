## Setup & Run
1. `npm install` *(automatically runs `prisma generate`)*
2. Copy `.env.example` to `.env` and set your MySQL credentials in `DATABASE_URL`
3. Ensure MySQL is running locally, then run `npx prisma db push` to create `solitaire_db`
4. `npm run dev`