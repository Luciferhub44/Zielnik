# Product Requirement Document (PRD)

## Project Name: Zielnik
**Version:** 1.0  
**Phase:** 1 (Frontend Blueprint Only)  
**Target Market:** Poland (Medical Cannabis Patients)

---

## 1. Project Objective
Zielnik is an aggregator platform for medical cannabis patients in Poland. The app resolves two user pain points: finding which pharmacies (apteki) have specific imported medical cannabis strains in stock, and providing quick access to legal compliance documents ("Police Mode") during law enforcement checks.

---

## 2. Technical Stack Definition

### Frontend (Phase 1 Focus)
*   **Framework:** Next.js 15+ (App Router, React Server Components)
*   **Styling:** Tailwind CSS (Utility-first)
*   **Component Library:** Shadcn/UI (Radix UI Primitives)
*   **State Management:** React Context (for local filter states)
*   **Icons:** Lucide React

### External Architecture (Phase 2 Integration)
*   **Authentication:** Clerk (Pre-built components for MFA, Session Management)
*   **Database & API:** Supabase (PostgreSQL, Realtime, Row-Level Security)

---

## 3. Brand Identity & Global CSS Configuration

### Typography
*   **Primary Font:** Inter or Geist Sans (San-serif, highly legible for medical data).

### Color Palette (Tailwind Configuration)
The interface avoids recreational motifs, utilizing a clinical, botanical scheme.

```css
@theme {
  /* Brand Clinical Palette */
  --color-primary: #1B4332;       /* Deep Forest Green */
  --color-primary-light: #40916C; /* Sage Green */
  --color-accent: #FF9F1C;        /* Amber Alert (Low Stock) */
  
  /* Interface Foundations */
  --color-bg-medical: #F8FAF9;    /* Sterile Off-White */
  --color-text-main: #081C15;     /* Charcoal Dark */
  --color-surface: #FFFFFF;       /* Pure White Cards */
  --color-border-muted: #E2E8F0;  /* Slate Border Light */
  
  /* System States */
  --color-status-success: #2D6A4F;
  --color-status-warning: #F59E0B;
  --color-status-error: #EF4444;  /* Out of Stock */
}
```

---

## 4. Frontend Component & Page Architecture

To ensure complete presentation state verification before database integration, frontend layouts must use static mock datasets representing Polish medical cannabis cultivars (e.g., Aurora 22/1, Canopy Growth 20/1, Tilray 18/1).

### 4.1. Core Application Layout Structure

```
app/
├── layout.tsx             # Global Providers (Clerk Stubs, Theme)
├── page.tsx               # Landing Page & Strain Discovery
├── search/
│   └── page.tsx           # Live Inventory Search & Map Split-View
├── patient/
│   ├── dashboard/page.tsx # Patient Journal & Prescription Hub
│   └── wallet/page.tsx    # "Police Mode" Ultra-High-Contrast Interface
└── components/
    ├── search-bar.tsx     # Fuzzy text input with batch property tags
    ├── inventory-list.tsx # Pharmacy rows with stock indicator badges
    └── legal-card.tsx     # Compliant document view container
```

### 4.2. Mandatory Component Views

#### A. Search & Filter Interface (/search)
*   **Input Field:** Real-time character matching for strain names, manufacturers, or exact THC/CBD ratios.
*   **Filter Pill Group:** Sativa, Indica, Hybrid, High THC (>20%), Balanced (1:1).
*   **Inventory Cards:** Must display:
    *   Strain commercial name and importer brand label.
    *   Pharmacy name, city voivodeship, and street address.
    *   Price per gram (formatted in PLN).
    *   Expiration date badge (Color changes to Amber if within 30 days of expiry).

#### B. "Police Mode" Wallet View (/patient/wallet)
*   **Design Constraints:** Zero-scroll interface. Maximum contrast layout optimized for low-light roadside conditions.
*   **Data Fields Container:**
    *   Active 4-digit e-prescription access code placeholder.
    *   Patient Full Name and PESEL placeholder.
    *   Downloadable/Viewable Pharmacy Invoice (Faktura Imienna) element.
    *   Statutory Legal Reference: Visible excerpt of Article 62a of the Polish Act on Counteracting Drug Addiction confirming legal patient status.

---

## 5. Excluded Scope & Content Boundaries

### Negative Keywords (Prohibited Content & Marketing Terms)
The frontend application copy must maintain a strictly medical posture. The following terms are banned from the codebase, UI copy, and documentation:
*   weed, marihuana (Use "Medyczna Marihuana" or "Konopie Medyczne" only)
*   stoner, high, blunt, joint, dispensary
*   recreational, legalize, 420

### Phase 1 Exclusions (Postponed to Backend Phase)
*   Live API connections to inventory scrapers.
*   Actual Clerk verification tokens or authentication route guards.
*   Database writes for user symptom tracking logs.
*   Real-time geospatial proximity distance calculations (Static sort variables only).

---

## 6. Frontend Acceptance Criteria

*   All routes in the layout structure must resolve to populated UI states without build errors.
*   Responsive layout breakpoints must preserve the split-map inventory view down to 320px width device viewports.
*   The "Police Mode" interface element must be accessible from any application view via a single global navigation header action.
