# GemLaunch Rewards System

## Overview

GemLaunch is a blockchain-based rewards platform that tracks user activities on the BNB Chain and awards points for various actions like token creation, fair launches, presales, volume trading, and referrals. The system features a comprehensive leaderboard, accolade system, and admin dashboard for managing point configurations.

## System Architecture

The application follows a full-stack architecture with a clear separation between frontend, backend, and database layers:

- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Real-time Updates**: WebSocket connections for live data

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL adapter
- **Database Provider**: Neon serverless PostgreSQL
- **WebSocket**: Native WebSocket for real-time updates
- **API Design**: RESTful endpoints with JSON responses

### Database Schema
The system uses six main tables:
- `users`: Stores wallet addresses, usernames, points, and referral information
- `activities`: Tracks all point-earning activities with metadata
- `referrals`: Manages referral relationships and earnings
- `accolades`: Achievement system with multipliers
- `pointConfigs`: Configurable point values for different activities
- `blockchainEvents`: Tracks blockchain transactions and events

### Component Structure
- **Pages**: Leaderboard, Admin, and Not Found pages
- **UI Components**: Comprehensive shadcn/ui component library
- **Feature Components**: Specialized components for leaderboard, referrals, and activities
- **Hooks**: Custom hooks for WebSocket connections and mobile detection

## Data Flow

1. **User Connection**: Users connect their Web3 wallets (MetaMask, etc.)
2. **Blockchain Monitoring**: Backend monitors BNB Chain for relevant transactions
3. **Activity Processing**: Smart contract events are processed and converted to point activities
4. **Real-time Updates**: WebSocket broadcasts updates to connected clients
5. **Leaderboard Calculation**: Points are aggregated and rankings calculated
6. **Accolade System**: Achievements are unlocked based on activity patterns

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, Wouter for routing
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns library

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL, Drizzle ORM
- **Blockchain**: Web3.js for BNB Chain interaction
- **Session Management**: connect-pg-simple for PostgreSQL sessions
- **WebSocket**: ws library for real-time connections
- **Validation**: Zod with drizzle-zod integration

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Strict configuration with path mapping
- **Database Migration**: Drizzle Kit for schema management
- **Linting**: Built-in TypeScript checking

## Deployment Strategy

The application is configured for Replit deployment with:
- **Environment**: Node.js 20 with PostgreSQL 16
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Production Serving**: Express serves static files and API
- **Auto-scaling**: Configured for Replit's autoscale deployment
- **Port Configuration**: Backend on port 5000, exposed as port 80

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `BNB_RPC_URL`: BNB Chain RPC endpoint (optional, defaults to public endpoint)

### Build Commands
- Development: `npm run dev` (starts both frontend and backend)
- Production Build: `npm run build` (builds both frontend and backend)
- Production Start: `npm run start` (serves production build)
- Database Migration: `npm run db:push` (applies schema changes)

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 14, 2025. Initial setup