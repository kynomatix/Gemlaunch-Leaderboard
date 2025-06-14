# Gemlaunch Rewards System

## Overview

Gemlaunch is a blockchain-based rewards platform that tracks user activities on the BNB Chain and awards points for various actions like token creation, fair launches, presales, volume trading, and referrals. The system features a comprehensive leaderboard, accolade system, and admin dashboard for managing point configurations.

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
- June 14, 2025: Initial setup
- June 14, 2025: Deep dive into Gemlaunch source code styling completed
  - Extracted exact brand colors from Create Token page (#0a0f0c background, #253935 form containers, #0f1713 inputs, #22cda6 buttons)
  - Fixed color implementation by replacing CSS variables with direct hex colors for reliability
  - Implemented layout matching homepage structure with three-column grid and statistics cards
  - Redesigned leaderboard page to replace existing Gemlaunch placeholder with our rewards system
  - Added authentic token listings (neom, ACC, SON) and statistics (5 projects, $39.76 raised, 2 participants)
  - Applied exact color scheme (#253935 containers, #22cda6 accents) with perfect accuracy
  - Updated teal color from #26d0ce to #22cda6 throughout entire application for better brand consistency
  - Removed unwanted hero section and fixed top bar to show proper network selection (BSC Mainnet) and wallet address display
  - Created clean leaderboard interface with Latest Pools, Private Sales, New Tokens sections and proper tabs
- June 14, 2025: Wallet connection and referral system implementation
  - Implemented simulated wallet connection using 0x2d9b878DD5f779aF723a430F8d56f21dAc847592 for testing
  - Created complete user registration system with welcome bonus and sample activities
  - Added Gemlaunch Pioneer accolade system for early users
  - Updated all referral links to use production domain https://gemlaunch.io/
  - Established real data flow between frontend and backend with authentic user tracking
- June 14, 2025: Anti-sybil notice and accolades system enhancement
  - Moved anti-sybil farming notice to Activities panel as collapsible button with Shield icon
  - Connected Activities panel to real API data instead of mock data
  - Added support for "accolade_earned" and "welcome_bonus" activity types
  - Enhanced activity display to show "Gemlaunch Pioneer Earned" for accolade activities
  - Cleaned up admin panel organization by moving blockchain controls from user-facing Activities section
  - Removed test activities from user wallet to ensure clean slate for real platform usage
- June 14, 2025: Available Accolades section and Pioneer badge refinement
  - Added comprehensive "Available Accolades" section below Point Earning Activities
  - Displays all 22 achievements with icons, unlock criteria, point rewards, and rarity levels
  - Updated Gemlaunch Pioneer to reflect exclusive first 50 users status (uncommon rarity)
  - Fixed all remaining "GemLaunch" spelling to correct "Gemlaunch" throughout codebase
- June 14, 2025: Accolade display system overhaul and Pioneer badge correction
  - Fixed "Unknown Accolade" error by adding missing accolade definitions to ACCOLADES array
  - Replaced confusing expand/collapse system with intuitive inline display (first 2 icons + clean "+X" badge)
  - Corrected Gemlaunch Pioneer distribution - awarded to first 2 users who joined before current user
  - Updated point totals to include all accolade bonuses (2500pts, 1575pts, 300pts)
  - Enhanced tooltips show specific accolade names, descriptions, and point values
- June 14, 2025: Activities panel accolades integration
  - Added "Available Accolades" section under Point Earning Activities showing all 22 accolade cards
  - Added "Accolades Earned" section in right column under Recent Activity and Fair Distribution Notice
  - Maintained original Point Earning Activities and Recent Activity sections with proper Gemlaunch styling
  - Removed separate accolades page, consolidating all functionality into unified Activities interface
  - Applied exact brand colors (#22cda6, #253935, #0f1713) throughout entire Activities panel