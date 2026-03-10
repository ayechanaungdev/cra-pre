# Car Rental System (CRA) - Project Overview

This is a mobile application prototype for a Car Rental System, built using **React Native (Expo)** and **Supabase**. It connects car owners with renters and provides an administrative interface for system management.

## Tech Stack

- **Frontend Framework:** React Native with [Expo](https://expo.dev) (v54+)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction) (File-based routing)
- **UI Components:** [Gluestack UI v3](https://gluestack.io/ui)
- **Styling:** [NativeWind v4](https://www.nativewind.dev) (Tailwind CSS for React Native)
- **Backend:** [Supabase](https://supabase.com) (Auth, PostgreSQL Database, Storage, Realtime)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Icons:** Lucide React Native & Expo Symbols
- **Language:** TypeScript

## Project Architecture

The project follows a standard Expo Router structure:

- `app/`: Contains the application routes and screens.
  - `(tabs)/`: Main navigation for logged-in users.
  - `auth/`: Authentication flow (Login, Signup, Start).
  - `car/`, `booking/`, `messages/`, `owner/`: Role-specific and feature-specific routes.
- `components/`: Reusable UI components.
  - `ui/`: Gluestack UI primitives and customized components.
- `lib/`: Utility libraries and service initializations (e.g., `supabase.ts`).
- `store/`: Zustand state management (e.g., `useAuthStore.ts`).
- `types/`: TypeScript definitions, including `database.types.ts` generated from Supabase.
- `project-specs/`: Contains detailed functional and technical specifications.

## Core Features

- **Multi-Role Support:** Specific interfaces for Admins, Car Owners, and Renters.
- **Authentication:** Secure login/signup via Supabase Auth.
- **Car Management:** Owners can list and manage vehicles; Admins approve/reject listings.
- **Booking System:** Renters can browse cars, check availability, and submit booking requests.
- **Real-time Chat:** Integrated messaging between renters and owners.
- **Profile & Verification:** User profile management with license upload capabilities.

## Building and Running

### Prerequisites
- Node.js (v20+)
- Expo Go app (for mobile testing) or Android/iOS simulators.

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure Environment:
   Ensure `.env` contains valid `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

### Development Commands
- **Start App:** `npx expo start`
- **Android:** `npm run android`
- **iOS:** `npm run ios`
- **Web:** `npm run web`
- **Lint:** `npm run lint`

## Development Conventions

- **Styling:** Use Tailwind classes via NativeWind's `className` prop. Prefer Gluestack UI components for complex UI patterns.
- **State:** Use the `useAuthStore` for user session and profile data. Local state should be managed with React `useState` or additional Zustand stores if shared.
- **Backend Interaction:** All database and storage operations should go through the Supabase client in `lib/supabase.ts`.
- **Icons:** Use `Lucide` icons or `IconSymbol` (mapped to SF Symbols on iOS).
- **Type Safety:** Always refer to `Database` types from `types/database.types.ts` when interacting with Supabase.

## Documentation Reference
Detailed requirements, database schema, and UI flows can be found in `project-specs/spec_content.txt`.
