# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` or `pnpm dev` 
- **Build for production**: `npm run build` or `pnpm build`
- **Type checking**: `npm run type-check` or `pnpm type-check`
- **Linting**: `npm run lint` or `pnpm lint`
- **Start production server**: `npm run start` or `pnpm start`
- **Clean build artifacts**: `npm run clean` or `pnpm clean`

**Package Manager**: This project uses pnpm (version 10.15.0) as specified in package.json

## Architecture Overview

**Framework**: Next.js 15 with TypeScript and App Router
**Styling**: Tailwind CSS v4 with custom design system
**Authentication**: Supabase Auth with SSR support
**UI Components**: Radix UI primitives with custom shadcn/ui components
**State Management**: React hooks with Supabase client-side state

### Key Directories

- **`app/`**: Next.js App Router pages and layouts
  - Route-based file structure (dashboard, auth, practice, etc.)
  - Each route has dedicated page.tsx and loading.tsx files
  - Authentication routes under `app/auth/`
- **`components/`**: Reusable React components
  - `ui/`: Base UI components (buttons, dialogs, forms)
  - `auth/`: Authentication-related components
  - `layout/`: Layout and navigation components
- **`lib/`**: Utility functions and configurations
  - `supabase/`: Supabase client setup and middleware
  - `utils.ts`: Tailwind utility functions
- **`public/`**: Static assets
- **`styles/`**: Global CSS files

### Authentication Flow

- Uses Supabase Auth with Google OAuth
- Middleware handles session management across routes: `middleware.ts`
- Server-side auth utilities in `lib/supabase/server.ts`
- Client-side auth utilities in `lib/supabase/client.ts`
- Protected routes automatically redirect to login

### Component Patterns

- Components use Radix UI primitives with custom styling
- Tailwind classes combined using `cn()` utility from `lib/utils.ts`
- TypeScript interfaces defined inline or imported from component libraries
- shadcn/ui pattern for composable, customizable components

### Styling System

- Tailwind CSS v4 configuration in `postcss.config.js`
- Custom color palette with gradient themes (rose, orange, yellow)
- Responsive design patterns with mobile-first approach
- Glass morphism effects with backdrop-blur utilities

## Build Configuration

- **TypeScript**: Build errors ignored via `ignoreBuildErrors: true`
- **ESLint**: Ignored during builds via `ignoreDuringBuilds: true`
- **Images**: Unoptimized via `unoptimized: true`
- **Supabase**: External package handling via `serverExternalPackages`

## Database Schema

### Core Tables
- **`profiles`**: User profile information linked to auth.users
- **`pitch_sessions`**: Practice session records with audio storage
  - Includes audio blob URLs, scores, feedback, and metadata
  - Links recordings to Vercel Blob storage
- **`user_goals`**: User objective tracking and progress metrics

### Audio Processing & Storage
- **Memory-First Approach**: Initial recordings kept in memory for immediate AI processing
- **Storage Integration**: Optional saving to Vercel Blob storage for persistence
- **VoiceRecorder Component**: Configurable recording with `saveToStorage` and `autoUpload` props
- **Audio Utilities**: Helper functions in `lib/audio-utils.ts` for processing, validation, and API transmission
- **Database Integration**: Use `PitchSessionService` class and `usePitchSessions` hook for saved sessions

## Base Blockchain Payments

### Integration Overview
- **Payment System**: Base (Layer 2) ETH payments for premium features
- **Wallet Support**: MetaMask, Coinbase Wallet, and other Ethereum wallets
- **Network**: Base Sepolia (testnet) for development, Base mainnet for production
- **Components**: Located in `components/payments/` directory
- **Configuration**: Web3 settings in `lib/web3-config.ts`

### Payment Types
- **Premium Session**: 0.01 ETH for single advanced AI session
- **Monthly Subscription**: 0.05 ETH for unlimited premium sessions
- **Yearly Subscription**: 0.5 ETH for annual plan with savings

### Key Components
- **WalletConnector**: Handles wallet connection and network switching
- **PaymentButton**: Processes individual payments with transaction handling
- **PaymentFlow**: Complete payment interface combining wallet connection and payment options
- **PaymentService**: Backend service for payment verification and database operations

### Database Schema
- **payments** table: Tracks transaction hashes, payment types, amounts, and confirmation status
- **RLS enabled**: Users can only access their own payment records
- **Migration**: Located in `supabase/migrations/001_payments_table.sql`

### API Endpoints
- **POST /api/verify-payment**: Verifies blockchain transactions and updates payment status

## Environment Setup

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)
- `BLOB_READ_WRITE_TOKEN` (for Vercel Blob storage)
- `NEXT_PUBLIC_BASE_RECEIVER_ADDRESS` (Your Base wallet address for receiving payments)