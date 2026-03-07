# VoraDeck - AI-Powered Presentation Generator

VoraDeck is a modern, high-performance web application that leverages artificial intelligence to transform your ideas, documents, or prompts into professional-grade presentations in seconds.

## 🚀 Features

- **AI Generation**: Powered by Google Gemini and Groq for high-quality content structuring.
- **Instant PPTX Export**: Generate and download presentations in standard PowerPoint format.
- **Modern UI/UX**: Built with React 19, Next.js 16, and Framer Motion for a fluid, premium experience.
- **Secure Authentication**: Integrated with Better Auth for robust user management.
- **Real-time Database**: Uses Neon (PostgreSQL) with Drizzle ORM for efficient data handling.
- **Turbopack Optimized**: Blazing fast development builds using Next.js Turbopack.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Database**: [Neon](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js installed
- PNPM installed (`npm install -g pnpm`)
- Database URL (Neon/PostgreSQL)
- API Keys for Gemini and Groq

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd 03_PPT_Generator
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   DATABASE_URL=your_database_url
   BETTER_AUTH_SECRET=your_auth_secret
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Push the database schema:

   ```bash
   pnpm push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

## 🔧 Troubleshooting

### Benchmark I/O Error

If you encounter the error: `Failed to benchmark file I/O: The system cannot find the path specified. (os error 3)`, it is likely due to Turbopack trying to run disk benchmarks on a restricted or non-existent path.

**Solution:**
You can bypass the benchmarks by setting an environment variable:

```bash
$env:TURBO_ENGINE_DISABLE_BENCHMARKS=1; pnpm dev
```

Alternatively, clear the `.next` directory:

```bash
rm -rf .next
pnpm dev
```

## 📄 License

Individual work for specialized presentation generation.
