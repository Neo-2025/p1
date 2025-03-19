# P1 Next.js SaaS Template

A production-ready Next.js 14 SaaS template with Supabase, Stripe, and S4 integration.

## Features

- 🚀 Next.js 14 with App Router
- 🔐 Supabase Authentication & Database
- 💳 Stripe Payments Integration
- 🧪 Testing Setup (Jest, React Testing Library, Cypress)
- 📱 Responsive UI with Tailwind CSS
- 🔄 Branch-First Development Workflow
- 🤖 S4 AI Integration
- 📊 Analytics & Monitoring
- 🌐 Internationalization Ready
- 🔒 Security Best Practices

## Quick Start

```bash
# Clone the template
git clone https://github.com/your-org/p1-nextjs-saas.git

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

## Project Structure

```bash
p1/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   ├── marketing/        # Marketing components
│   └── ui/               # Shared UI components
├── lib/                  # Utility functions
│   ├── supabase/        # Supabase client & utils
│   ├── stripe/          # Stripe integration
│   └── db/              # Drizzle ORM setup
└── utils/               # Helper functions
```

## Environment Variables

Required environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Database
DATABASE_URL=

# Vercel
VERCEL_PROJECT_ID=
VERCEL_ORG_ID=
```

## Development Workflow

1. Create a new branch for your feature
2. Make changes and commit
3. Push to trigger preview deployment
4. Create PR for review
5. Merge to main for production

## Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run all tests with coverage
pnpm test:coverage
```

## Deployment

The template is configured for deployment on Vercel with:
- Automatic preview deployments for PRs
- Production deployments on main branch
- Environment variable management
- Branch-first development workflow

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 