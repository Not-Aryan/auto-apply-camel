# Auto Apply

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/auto-apply-camel.git
   cd auto-apply-camel
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   # or
   bun prisma migrate dev
   ```

5. Initialize storage (if needed):
   ```bash
   npm run setup-storage
   # or
   bun run setup-storage
   ```

6. Start the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
