# Project Management Application

A modern, feature-rich project management tool built with Next.js 14, showcasing full-stack development capabilities.

## Features

- **User Authentication**: Secure login and registration with Next Auth
- **Project Management**: Create, edit, and manage projects
- **Kanban Board**: Interactive drag-and-drop task management
- **Dashboard**: Real-time statistics and project overviews
- **Team Collaboration**: Invite team members and assign tasks
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Theme support with system preference detection

## Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - React
  - TypeScript
  - TailwindCSS
  - Shadcn UI Components
  - Lucide Icons

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - SQLite Database (easily swappable with PostgreSQL for production)

- **Authentication**:
  - NextAuth.js

- **Other**:
  - Drag and Drop with @hello-pangea/dnd
  - Form validation with Zod and React Hook Form
  - Data fetching with SWR

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/project-management.git
cd project-management
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database
```bash
npx prisma db push
```

5. Run the development server
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── dashboard/   # Dashboard components
│   │   └── projects/    # Project-related components
│   ├── lib/             # Utility functions and libraries
│   └── styles/          # Global styles
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── ...
```

## Deployment

This application is designed to be easily deployed to Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/project-management)

## Roadmap

- [ ] Email notifications
- [ ] File uploads for projects
- [ ] Advanced filtering and searching
- [ ] Calendar view for deadlines
- [ ] Performance analytics
- [ ] Mobile app with React Native

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/) 