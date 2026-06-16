# Production Launch Checklist: Zielnik

This checklist serves as the final quality assurance framework to cross-check the built frontend, backend, and data ingestion pipeline against production-readiness standards.

Legend: ✅ done · ⚠️ manual step · 🔲 pending build

---

## 1. Frontend & UI/UX Cross-Check (`/search`, `/patient`)

- [x] **Clinical Design System Enforcement** ✅
  - No recreational terms (`weed`, `marihuana`, `stoner`, `420`) found in codebase.
  - CSS variables confirmed: `--color-primary: #1B4332`, `--color-bg-medical: #F8FAF9`.
- [x] **Responsive Inventory Layouts** ✅
  - Search filter pills use `overflow-x-auto scrollbar-hide` on mobile, wrap on `sm:`.
  - `InventoryList` cards use `min-w-0` + truncation classes; no overflow on long strings.
- [x] **"Police Mode" High-Contrast Interface (`/patient/wallet`)** ✅
  - Wallet layout is `max-w-sm flex-col` — single-column, no horizontal overflow.
  - Legal text collapsed behind `<details>` — zero-scroll on standard mobile (375×667).
  - PESEL + code on dark `#020d07` bg; green-400 on dark = ~5.4:1 contrast (WCAG AA ✅).
  - Invoice download links to `doc.invoice_url` when present.
- [x] **State & Performance Optimization** ✅
  - Filter pills use local `useState` — no network calls on filter change.
  - All images use `next/image` with `fill` + `sizes` + `priority` where above fold.

---

## 2. Backend & Security Cross-Check (Clerk & Supabase)

- [x] **Authentication Foundations (Clerk)** ✅ / ⚠️
  - `clerkMiddleware()` + `createRouteMatcher` in `middleware.ts` guards `/patient/*`.
  - ⚠️ **MFA enforcement**: must be configured in Clerk Dashboard → Organization Settings → "Require MFA for all members". Not enforceable in middleware without session claims check.
  - ⚠️ **`user.created` webhook**: not yet implemented. Needed for provisioning patient DB entries on sign-up. Add a `app/api/webhooks/clerk/route.ts` handler with `svix` signature verification.
- [x] **Row-Level Security (RLS) & Isolation Policies** ✅
  - RLS `ON` confirmed for all 6 tables: `inventory`, `journal_entries`, `patient_documents`, `pharmacies`, `prescriptions`, `strains`.
  - Isolation policy `(auth.uid())::text = user_id` on `journal_entries`, `patient_documents`, `prescriptions`.
  - Public read-only on `inventory`, `pharmacies`, `strains`.
  - ⚠️ **Clerk JWT template**: must create "supabase" template in Clerk Dashboard → Configure → JWT Templates → New → Supabase preset. Without this `auth.uid()` is null and RLS blocks all patient data.
- [x] **Database Constraints & Indices** ✅
  - `unique_pharmacy_strain_batch` unique constraint confirmed on `inventory`.
  - `pg_trgm` GIN indices added on `strains.name` and `pharmacies.city` (migration `add_trgm_search_indices`).

---

## 3. Data Ingestion & Scraper Pipeline Cross-Check (Python Pipeline)

- 🔲 **String Normalization Correctness**
  - Pipeline not yet built. Target: normalize `Cannabis Flos Aurora Typ 22%` → `Aurora 22/1`.
- 🔲 **Atomic Transaction Updates**
  - Schema supports UPSERT via `unique_pharmacy_strain_batch`. Pipeline must use `ON CONFLICT DO UPDATE`.
- 🔲 **Operational Guardrails & Bounds**
  - Headless Playwright runner + strain whitelist filter — implement in scraper Phase 3.
- 🔲 **Fail-Safe & Alert Thresholds**
  - Abort on >15% parse failure — implement as pre-commit check in scraper pipeline.

---

## 4. Environment & Deployment Checklist

- [x] **Production Keys Isolation** ✅
  - `.gitignore` covers `.env`, `.env.local`, `.env.*.local`.
  - No secrets in git history (`.next/` scrubbed via `git-filter-repo`).
  - ⚠️ `SUPABASE_SERVICE_ROLE_KEY` not yet in `.env.local` (not needed until webhook/admin API). Add to Vercel/Fly env when scraper pipeline is wired.
- 🔲 **GDPR / RODO Compliance Verification**
  - Supabase project region: confirm it is `eu-central-1` (Frankfurt). Check in Supabase Dashboard → Project Settings → Infrastructure.
  - Invoice PDFs in Supabase Storage: ensure bucket is private (not public) with signed URLs, and storage region matches project region.

---

## Open Manual Steps (blocking before public launch)

1. **Clerk JWT template** — Dashboard → Configure → JWT Templates → New → "Supabase" preset → Save
2. **Clerk MFA** — Dashboard → Organization Settings → Require MFA
3. **Supabase region** — Confirm Frankfurt (`eu-central-1`) for RODO
4. **Clerk webhook** — Implement `app/api/webhooks/clerk/route.ts` for `user.created`
5. **Seed real data** — Add prescriptions/journal/documents for test user (SQL in previous message)
6. **Scraper Phase 3** — Python/Playwright pipeline for live pharmacy inventory
