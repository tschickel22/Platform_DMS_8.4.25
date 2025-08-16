# Renter Insight CRM/DMS – Modular Architecture

This repository contains the full modular source for Renter Insight's RV/MH CRM and dealership management system. Each module is deployed independently and consumed by the core shell app (`renterinsight-core`).

## Structure

- `renterinsight-core/`: Main shell UI and routing host
- `apps/`: Independent feature modules
- `shared/`: Common libraries for auth, UI, and API calls

## How to Use

1. Clone this repo and push to GitHub
2. Install Netlify CLI globally: `npm install -g netlify-cli`
2. Import each module folder into Bolt.new
3. Follow architecture guide in root documentation
4. Start with renterinsight-core, then attach modules

Includes Bolt manifest and OpenAPI for invoice-payments.

## ⚙️ Bolt Development Guidelines

- ❌ Do NOT use hardcoded data. Only use mock test data temporarily.
- ✅ Prepare every module for future MySQL Rails backend integration.
- ✅ Use modern, responsive layouts (mobile-first).
- ✅ Avoid runtime blank screens: add fallback states and error boundaries.
- ✅ Ensure each module inherits shared-core styling and tenant branding.
- ✅ Write modules to be fully extensible and compatible with RBAC and multi-tenant support.

## 🧩 Shared Company & Platform Settings

All modules must connect to shared tenant logic:

- Use `shared-core` hooks to read/write **company-level** settings
  - (e.g. branding, roles, custom fields, integrations)
- Use `platform settings` for global defaults and feature gating
  - (e.g. package tiers, RBAC defaults, subscription plans)

### Module Communication Guidelines

- Never store company-level config inside individual modules.
- Modules **must use shared company ID logic** and fallback to defaults if none found.
- When adding a new module, check if it needs:
  - `company_id` from `auth context`
  - `field overrides` from company settings
  - `platform default templates` (like notifications, automations, permissions)

✅ This ensures all modules remain composable, extensible, and future-proof.
