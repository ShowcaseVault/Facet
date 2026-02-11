# [Facet](https://facet-one.vercel.app)

> **Curate your GitHub portfolio with style**

Facet is a modern platform that transforms your GitHub repositories into beautifully organized, shareable collections. Think of it as your personal GitHub showcase—where you control the narrative.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## ✨ Features

- **📚 Smart Collections** - Organize your repositories into themed collections (e.g., "AI Projects", "Open Source Contributions")
- **✍️ Custom Notes** - Add context and highlights to each repository
- **🎨 Beautiful Profiles** - Auto-generated public profile pages showcasing your curated work
- **🔄 Drag & Drop** - Intuitive reordering of collections and repositories
- **🔍 GitHub Integration** - Seamless OAuth login and real-time repository syncing
- **🌐 Hybrid Data** - Works for both Facet users and non-registered GitHub profiles
- **📱 Responsive Design** - Premium UI that looks great on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (for database and authentication)
- GitHub OAuth App credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ShowcaseVault/Facet.git
   cd facet
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**

   Run the SQL schema from `docs/models.sql` in your Supabase SQL editor to create the necessary tables.

5. **Configure GitHub OAuth**

   In your Supabase dashboard:
   - Go to Authentication → Providers → GitHub
   - Enable GitHub provider
   - Add your GitHub OAuth App credentials
   - Set callback URL to: `http://localhost:3000/auth/callback`

6. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### For Users

1. **Sign in** with your GitHub account
2. **Create collections** to organize your repositories
3. **Add repositories** from your GitHub account to collections
4. **Customize** with descriptions and notes
5. **Share** your public profile: `facet.app/yourusername`

### For Visitors

- Browse any GitHub user's profile (e.g., `/torvalds`)
- View curated collections from registered Facet users
- See all public repositories for non-registered users

## 🏗️ Project Structure

```
facet/
├── app/                    # Next.js App Router pages
│   ├── [username]/        # Public profile pages
│   ├── dashboard/         # User dashboard
│   ├── auth/              # Authentication callbacks
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── shared/            # Reusable components
│   └── ui/                # Base UI components
├── lib/                   # Utilities and integrations
│   ├── github/            # GitHub API client
│   ├── supabase/          # Supabase client & queries
│   └── utils.ts           # Helper functions
├── docs/                  # Documentation
└── public/                # Static assets
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: GitHub OAuth via Supabase Auth
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) folder:

- [Architecture Overview](./docs/architecture.md) - System design and component relationships
- [Data Flow](./docs/data-flow.md) - How data moves through the application
- [Database Schema](./docs/database_schema.md) - Complete database structure
- [Development Guide](./docs/development.md) - Contributing and development workflows
- [Project Aim](./docs/faucet_aim.md) - Vision and goals

## 🤝 Contributing

We welcome contributions! Please see our [Development Guide](./docs/development.md) for details on:

- Setting up your development environment
- Code style and conventions
- Submitting pull requests
- Reporting issues

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- GitHub API integration
- UI inspired by modern design systems

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/facet/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/facet/discussions)

---

**Made with ❤️ for the GitHub community**
