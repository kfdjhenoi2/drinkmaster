# Overview

This is a drinking game web application called "Juomapeli" that allows players to create games with different categories of tasks/challenges. The application features a React frontend with a modern UI built using shadcn/ui components and a Node.js/Express backend. Players can add themselves to a game, select from different task categories (Spicy, Funny, Party), and take turns completing challenges.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side application is built with React and TypeScript, using Vite as the build tool. Key architectural decisions include:

- **Component Library**: Uses shadcn/ui components built on top of Radix UI primitives for a consistent, accessible design system
- **Styling**: Tailwind CSS with CSS variables for theming and dark mode support
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation through @hookform/resolvers

The frontend follows a component-based architecture with separate pages and reusable UI components. The main game flow includes player setup, category selection, and the actual game screen.

## Backend Architecture

The server uses Express.js with TypeScript and follows a RESTful API design:

- **Framework**: Express.js with TypeScript for type safety
- **Database Layer**: Drizzle ORM configured for PostgreSQL with Neon Database serverless connection
- **Storage Pattern**: Interface-based storage abstraction with in-memory implementation for development
- **API Structure**: RESTful endpoints for game management and task retrieval
- **Development Server**: Vite integration for hot module replacement in development

The backend implements a clean separation between routes, storage logic, and data schemas using shared TypeScript types.

## Data Storage Solutions

- **Database**: PostgreSQL configured through Drizzle ORM with migrations support
- **Connection**: Uses @neondatabase/serverless for serverless PostgreSQL connections
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Development Storage**: In-memory storage implementation for local development
- **Shared Types**: Common TypeScript interfaces between frontend and backend in the `/shared` directory

## Authentication and Authorization

Currently, the application does not implement user authentication. Games are created and accessed through unique IDs without user accounts or session management.

# External Dependencies

## Database Services

- **Neon Database**: Serverless PostgreSQL database service
- **Drizzle ORM**: TypeScript ORM for database operations
- **Drizzle Kit**: Database migration and management tool

## Frontend Libraries

- **React Query**: Server state management and caching
- **Wouter**: Lightweight React router
- **shadcn/ui**: Component library built on Radix UI
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form state management
- **Zod**: TypeScript schema validation

## Backend Libraries

- **Express.js**: Web application framework
- **tsx**: TypeScript execution environment for development
- **esbuild**: JavaScript bundler for production builds

## Development Tools

- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Replit Integration**: Development environment integration with cartographer and error overlay plugins