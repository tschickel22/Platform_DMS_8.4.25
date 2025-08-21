# Renter Insight CRM/DMS – Modular Architecture

This repository contains the full modular source for Renter Insight's RV/MH CRM and dealership management system. The application is built with a modern React architecture, currently deployed using Bolt hosting, with plans for future Rails API integration.

## 🚀 Architecture Roadmap

**Current State**: React frontend with local storage persistence
**Future State**: React frontend + Rails API backend

All modules are designed to be **backend-agnostic** and ready for seamless Rails integration when the API is available.

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
- **Current Data Layer**: Local Storage (development/demo)
- **Future Data Layer**: Rails API with PostgreSQL
- **Testing**: Vitest + React Testing Library
- **Hosting**: Bolt.new platform

## 🔄 Rails Integration Readiness

### Current Implementation
- All modules use **service layer abstraction** for data operations
- Mock data provides realistic development experience
- Local storage simulates backend persistence
- API client structure ready for Rails endpoints

### Rails Migration Path
When Rails API becomes available:
1. **Service Layer**: Update service implementations to call Rails endpoints
2. **Authentication**: Replace mock auth with Rails JWT authentication
3. **Data Models**: TypeScript types already match planned Rails models
4. **API Client**: Update `src/utils/apiClient.ts` to use Rails endpoints
5. **Error Handling**: Existing error boundaries will handle API errors

### Module Preparation Guidelines
- ✅ **Use service layer** - Never call localStorage directly from components
- ✅ **Handle async operations** - All data operations return Promises
- ✅ **Error boundaries** - Proper error handling for network failures
- ✅ **Loading states** - UI handles pending/loading states
- ✅ **TypeScript types** - Strong typing for all data models
- ✅ **Optimistic updates** - UI updates immediately, syncs with backend

## ⚙️ Bolt Development Guidelines

- ❌ Do NOT use hardcoded data. Use service layer with mock data for development.
- ✅ Prepare every module for future backend integration.
- ✅ Use async/await patterns for all data operations.
- ✅ Implement proper error handling and loading states.
- ✅ Use modern, responsive layouts (mobile-first).
- ✅ Avoid runtime blank screens: add fallback states and error boundaries.
- ✅ Ensure each module inherits shared styling and tenant branding.
- ✅ Write modules to be fully extensible and compatible with RBAC and multi-tenant support.

## 🏗️ Backend Integration Strategy

### Service Layer Pattern
```typescript
// ✅ GOOD: Use service layer
const { leads, createLead } = useLeadManagement()

// ❌ BAD: Direct storage access
const leads = JSON.parse(localStorage.getItem('leads'))
```

### API-Ready Components
```typescript
// ✅ Components handle loading/error states
function LeadList() {
  const { leads, loading, error } = useLeads()
  
  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage />
  return <LeadTable data={leads} />
}
```

### Future Rails Endpoints
When Rails API is ready, these endpoints will be implemented:
- `GET /api/v1/leads` - Replace mock lead data
- `POST /api/v1/leads` - Replace localStorage lead creation
- `PUT /api/v1/leads/:id` - Replace localStorage lead updates
- `DELETE /api/v1/leads/:id` - Replace localStorage lead deletion

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
├── services/           # Data service layer (Rails-ready)
├── hooks/              # Module-specific hooks
├── types.ts            # TypeScript type definitions
├── [ModuleName].tsx    # Main module component
└── mocks/              # Mock data for development
```

## Contributing

1. **Always use the service layer** for data operations
1. Follow the established file organization patterns
2. Use TypeScript for all new code
3. Add tests for new functionality
4. Ensure mobile responsiveness
5. Follow the design system guidelines
6. Add proper error boundaries and loading states
7. Prepare components for async data operations
8. Use proper loading and error states

## 🔮 Future Enhancements

With Rails API integration, we'll gain:
- **Real-time collaboration** - Multiple users editing simultaneously
- **Advanced permissions** - Granular RBAC with database backing
- **Data analytics** - Rich reporting with SQL queries
- **Integrations** - Third-party API connections
- **Scalability** - Handle enterprise-level data volumes
- **Backup & Recovery** - Professional data management