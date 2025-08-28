# Phase 3: Cross-Module Account/Contact Integration Plan

## Overview
This document outlines where Account/Contact context should appear across all modules and the implementation approach for each.

## Module Integration Map

### ✅ Completed Modules
- **CRM Accounts** - Full implementation with modern UI
- **CRM Contacts** - Full implementation with modern UI  
- **Dashboard** - Updated with Account/Contact tiles

### 🔄 Modules Requiring Account/Contact Integration

#### 1. CRM Prospecting (Leads)
**File:** `src/modules/crm-prospecting/CRMProspecting.tsx`
**Current State:** Has `accountId` and `contactId` in mock data
**Required Changes:**
- **List View:** Add Account/Contact chips in lead rows
- **Detail View:** Show Account/Contact in header section
- **Form:** Add Account/Contact pickers when creating/editing leads

#### 2. Quote Builder
**File:** `src/modules/quote-builder/QuoteBuilder.tsx`
**Current State:** Needs `accountId`/`contactId` added to Quote type
**Required Changes:**
- **List View:** Show customer context (Account/Contact chips)
- **Detail View:** Customer section with Account/Contact details
- **Form:** Customer picker for quote recipient

#### 3. Agreement Vault
**File:** `src/modules/agreement-vault/AgreementVault.tsx`
**Current State:** Has `customerId`, `customerName` - needs Account/Contact linking
**Required Changes:**
- **List View:** Replace customer name with Account/Contact chips
- **Detail View:** Customer section showing Account/Contact details
- **Form:** Account/Contact selection for agreement parties

#### 4. Service Operations
**File:** `src/modules/service-ops/ServiceOps.tsx`
**Current State:** Has `customerId`, `customerName` in tickets
**Required Changes:**
- **Ticket List:** Account/Contact chips in customer column
- **Ticket Detail:** Customer section with Account/Contact context
- **New Ticket Form:** Customer picker (Account/Contact)

#### 5. Delivery Tracker
**File:** `src/modules/delivery-tracker/DeliveryTracker.tsx`
**Current State:** Has `customerId` in Delivery type
**Required Changes:**
- **Delivery List:** Customer column with Account/Contact chips
- **Delivery Detail:** Customer information section
- **Schedule Form:** Customer selection

#### 6. Invoice & Payments
**File:** `src/modules/invoice-payments/InvoicePayments.tsx`
**Current State:** Has `customerId` and `customerName`
**Required Changes:**
- **Invoice List:** Customer column with Account/Contact chips
- **Invoice Detail:** Billing information with Account/Contact details
- **New Invoice Form:** Customer picker

## Implementation Strategy

### Step 1: Update Mock Data
For each module, ensure mock data includes `accountId` and `contactId` fields:

```typescript
// Example for Service Tickets
{
  id: 'ticket-001',
  customerId: 'cust-001', // Keep for backward compatibility
  customerName: 'John Smith', // Keep for backward compatibility
  accountId: 'acc-001', // NEW: Link to Account
  contactId: 'con-001', // NEW: Link to Contact
  // ... rest of ticket data
}
```

### Step 2: Add EntityChip Components
In list views, replace plain customer names with EntityChip components:

```typescript
// Before
<span>{ticket.customerName}</span>

// After
<div className="space-y-1">
  <EntityChip
    type="account"
    id={ticket.accountId}
    name={getAccountById(ticket.accountId)?.name}
    linkTo={`/crm/accounts/${ticket.accountId}`}
  />
  <EntityChip
    type="contact"
    id={ticket.contactId}
    name={getContactById(ticket.contactId)?.name}
    linkTo={`/crm/contacts/${ticket.contactId}`}
  />
</div>
```

### Step 3: Add Customer Sections to Detail Views
Create consistent customer information sections:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Customer Information</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {/* Account */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Account</label>
        <div className="mt-1">
          {ticket.accountId ? (
            <EntityChip
              type="account"
              id={ticket.accountId}
              name={getAccountById(ticket.accountId)?.name}
              linkTo={`/crm/accounts/${ticket.accountId}`}
            />
          ) : (
            <span className="text-muted-foreground">No account assigned</span>
          )}
        </div>
      </div>
      
      {/* Contact */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Contact</label>
        <div className="mt-1">
          {ticket.contactId ? (
            <EntityChip
              type="contact"
              id={ticket.contactId}
              name={getContactById(ticket.contactId)?.name}
              linkTo={`/crm/contacts/${ticket.contactId}`}
            />
          ) : (
            <span className="text-muted-foreground">No contact assigned</span>
          )}
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

### Step 4: Add Customer Pickers to Forms
Include Account/Contact selection in create/edit forms:

```typescript
<FormSection
  title="Customer Information"
  description="Select the account and contact for this record"
>
  <FormGrid>
    <SelectField
      label="Account"
      value={formData.accountId}
      onChange={(value) => handleFieldChange('accountId', value)}
      options={accountOptions}
      placeholder="Select an account"
    />
    <SelectField
      label="Contact"
      value={formData.contactId}
      onChange={(value) => handleFieldChange('contactId', value)}
      options={contactOptions.filter(c => !formData.accountId || c.accountId === formData.accountId)}
      placeholder="Select a contact"
    />
  </FormGrid>
</FormSection>
```

## Priority Order for Implementation

1. **High Priority** (customer-facing modules):
   - Service Operations (tickets need customer context)
   - Invoice & Payments (billing requires customer info)
   - Agreement Vault (contracts need parties)

2. **Medium Priority** (sales process):
   - CRM Prospecting (leads to accounts/contacts)
   - Quote Builder (quotes need recipients)

3. **Lower Priority** (operational):
   - Delivery Tracker (has customer context but less critical)

## Quality Checklist

For each module integration:
- [ ] Mock data includes `accountId` and `contactId`
- [ ] List views show Account/Contact chips (or "N/A")
- [ ] Detail views have Customer Information section
- [ ] Forms include Account/Contact pickers
- [ ] No crashes when Account/Contact lookups return null
- [ ] EntityChip hover cards work properly
- [ ] Deep links to Account/Contact details function
- [ ] "Assign..." actions work for missing associations

## Testing Scenarios

1. **Happy Path:** Record with both Account and Contact assigned
2. **Partial Data:** Record with Account but no Contact (or vice versa)
3. **Missing Data:** Record with neither Account nor Contact
4. **Invalid References:** Record with IDs that don't exist in mock data
5. **Navigation:** Clicking chips navigates to correct detail pages
6. **Form Validation:** Creating records with/without customer assignments

This systematic approach ensures Account/Contact context appears consistently across all modules while maintaining data integrity and user experience.