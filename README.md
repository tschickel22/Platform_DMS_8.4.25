# Renter Insight CRM/DMS – Modular Architecture

This repository contains the full modular source for Renter Insight's RV/MH CRM and dealership management system. The application is built with a modern React architecture and deployed using Bolt hosting.

## Structure

- `src/`: Main application source code
  - `modules/`: Feature modules (CRM, Inventory, Finance, etc.)
  - `components/`: Shared UI components
  - `contexts/`: React contexts for state management
  - `hooks/`: Custom React hooks
  - `utils/`: Utility functions and helpers
- `public/`: Static assets
- `dist/`: Built application files

## How to Use

1. Open this project in Bolt.new
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Build for production: `npm run build`
5. Deploy using Bolt hosting

## Features

- **Multi-tenant CRM/DMS** for RV and Manufactured Home dealerships
- **Modular architecture** with independent feature modules
- **Client portal** for customer self-service
- **Website builder** for creating dealer websites
- **Comprehensive reporting** and analytics
- **Mobile-responsive design** with modern UI

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Zustand
- **Routing**: React Router v6
- **Testing**: Vitest + React Testing Library
- **Hosting**: Bolt.new platform

## ⚙️ Bolt Development Guidelines

- ❌ Do NOT use hardcoded data. Only use mock test data temporarily.
- ✅ Prepare every module for future backend integration.
- ✅ Use modern, responsive layouts (mobile-first).
- ✅ Avoid runtime blank screens: add fallback states and error boundaries.
- ✅ Ensure each module inherits shared styling and tenant branding.
- ✅ Write modules to be fully extensible and compatible with RBAC and multi-tenant support.

## 🧩 Shared Company & Platform Settings

All modules must connect to shared tenant logic:

- Use shared hooks to read/write **company-level** settings
  - (e.g. branding, roles, custom fields, integrations)
- Use `platform settings` for global defaults and feature gating
  - (e.g. package tiers, RBAC defaults, subscription plans)

### Module Communication Guidelines

- Never store company-level config inside individual modules.
- Modules **must use shared tenant context** and fallback to defaults if none found.
- When adding a new module, check if it needs:
  - `tenantId` from auth context
  - `field overrides` from company settings
  - `platform default templates` (like notifications, automations, permissions)

✅ This ensures all modules remain composable, extensible, and future-proof.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Module Structure

Each module follows a consistent structure:

```
src/modules/[module-name]/
├── components/          # Module-specific components
├── hooks/              # Module-specific hooks
├── types.ts            # TypeScript type definitions
├── [ModuleName].tsx    # Main module component
└── mocks/              # Mock data for development
```

## Contributing

1. Follow the established file organization patterns
2. Use TypeScript for all new code
3. Add tests for new functionality
4. Ensure mobile responsiveness
5. Follow the design system guidelines
6. Add proper error boundaries and loading states