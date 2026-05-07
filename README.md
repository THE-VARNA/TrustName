# TrustName

TrustName is an SNS-powered eligibility and sybil-resistance engine for airdrops, DAO access, community campaigns, and gated claims. It turns `.sol` identity signals into transparent eligibility reports and compact attestation proofs that protocols can reuse without asking users for invasive KYC.

## What Is This?

TrustName helps campaign owners decide whether a wallet is eligible for a claim by checking its Solana Name Service identity evidence:

- Fresh primary `.sol` domain ownership
- Verified SNS Records V2 data
- X handle linkage
- Issuer/community subdomain evidence
- Campaign-specific score thresholds and warnings

The app gives judges and campaign owners a clear dashboard, a claim flow, an evidence breakdown, suspicious cluster views, and a deployed Anchor attestation program for storing campaign and eligibility attestations on Solana devnet.

## Problem

Airdrops and community campaigns often struggle with two bad options:

- Open claims are easy to farm with low-quality wallets.
- Strict identity checks add friction, privacy risk, or centralized review.

Most wallet eligibility systems also hide their reasoning. Users and campaign owners see an accept/reject result, but not the evidence behind it.

## Solution

TrustName uses SNS identity as a lightweight trust layer. Instead of treating every wallet as equal, it evaluates public, user-owned identity signals and produces an evidence-first eligibility report.

The goal is not to claim perfect human identity. The goal is to make campaign eligibility more auditable, reusable, and resistant to obvious farming while keeping the user experience simple.

## Deployed Program

- Program ID: `Fd1e9ECkDJrGyqzpWV2nLM8xBghiDA8PCVWdJD7Fybag`
- Network: Solana devnet
- Explorer: `https://explorer.solana.com/address/Fd1e9ECkDJrGyqzpWV2nLM8xBghiDA8PCVWdJD7Fybag?cluster=devnet`
- Upgrade authority: `D2tbVMQzu2hyKK6H7TkNzJhgfDgdg94taFteodztNs6X`

Verify locally:

```bash
solana program show -u devnet Fd1e9ECkDJrGyqzpWV2nLM8xBghiDA8PCVWdJD7Fybag
```

## Core Flow

1. Campaign owner opens `/dashboard` to review campaign health, eligibility activity, and risk signals.
2. Campaign owner creates or reviews a campaign using SNS-based scoring rules.
3. User opens `/claim/genesis-drop`, connects a wallet, or uses the seeded judge demo wallet.
4. TrustName resolves SNS evidence and scores the wallet against the campaign rules.
5. User and campaign owner can inspect every evidence item, including pass/fail state, freshness, and warning context.
6. Approved reports can generate an attestation proof. The Anchor program provides the on-chain primitive for campaign and attestation PDAs.
7. Campaign owner can review claim data and allowlist-style exports from the campaign page.

## Tech Stack

- Next.js App Router for the frontend, pages, and API routes
- React and Tailwind CSS for the interface
- Solana Wallet Adapter for wallet connection
- `@bonfida/spl-name-service` and `@solana-name-service/sns-sdk-kit` for SNS lookups
- Anchor `0.31.1` for the Solana attestation program
- Drizzle schema for the production campaign/report/attestation data model
- Vitest for scoring logic tests
- Vercel for web deployment

## Architecture

TrustName is split into three layers:

- App layer: Next.js routes render the dashboard, campaign builder, claim flow, identity pages, and cluster review screens.
- Eligibility layer: TypeScript utilities resolve SNS evidence, normalize identity profiles, score campaign rules, and produce deterministic evidence/ruleset hashes.
- Attestation layer: The Anchor program stores campaign PDAs and eligibility attestation PDAs on devnet.

The current web demo is seeded so judges can test it without paid infrastructure or fragile setup. Live SNS reads are supported through `NEXT_PUBLIC_SOLANA_RPC_URL`, and the deployed program ID is wired through `NEXT_PUBLIC_TRUSTNAME_PROGRAM_ID`.

## Sponsor Tool Usage

### Solana Name Service

TrustName uses SNS as the core identity signal source. It reads primary domains, Records V2, and X handle data, then checks freshness and right-of-association where applicable. The product is designed around making `.sol` identity useful for real campaign operations instead of only displaying names.

### Anchor

The Solana program is built with Anchor and deployed to devnet. It defines deterministic PDAs for campaigns and attestations, validates issuer authority, stores score and hash commitments, and keeps the full evidence report off-chain in the app/export layer.

### MagicBlock

MagicBlock support is modeled as the production acceleration path in `src/lib/magicblock.ts`. Core judging works without MagicBlock secrets, while Ephemeral Rollups or TEE routing can be enabled later for low-latency bulk claim evaluation and private reviewer data.

### Vercel

The app is built as a Next.js project and is ready for Vercel deployment. Vercel hosts the dashboard, public claim flow, and API routes used by the demo.

## Anchor Program

Program source: `programs/trustname_attestation/src/lib.rs`

The program exposes two instructions:

- `create_campaign`: creates a campaign PDA for an issuer and slug.
- `issue_attestation`: creates an eligibility attestation PDA for a campaign and subject wallet.

PDA seeds:

- Campaign PDA: `["campaign", issuer, slug]`
- Attestation PDA: `["attestation", campaign, subject]`

Stored campaign fields:

- Issuer
- Slug
- Ruleset hash
- Auto-approve score
- Created timestamp
- Bump

Stored attestation fields:

- Campaign
- Subject wallet
- Issuer
- Score
- Ruleset hash
- Evidence hash
- Issued timestamp
- Bump

## Folder Structure

```text
.
├── Anchor.toml
├── programs/
│   └── trustname_attestation/
│       ├── Cargo.toml
│       └── src/lib.rs
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   ├── (public)/
│   │   └── api/
│   ├── components/
│   ├── db/schema.ts
│   └── lib/
│       ├── attestation.ts
│       ├── demo-data.ts
│       ├── magicblock.ts
│       ├── scoring.ts
│       ├── sns.ts
│       └── types.ts
├── docs/
├── package.json
└── README.md
```

## Quick Start

Install dependencies:

```bash
npm install
```

Run the local app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/dashboard
```

Optional environment variables:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_TRUSTNAME_PROGRAM_ID=Fd1e9ECkDJrGyqzpWV2nLM8xBghiDA8PCVWdJD7Fybag
```

Run checks:

```bash
npm run typecheck
npm test
npm run build
npm run anchor:build
```

## Vercel Deployment Notes

Use these settings in the Vercel dashboard:

- Framework: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Root directory: repository root
- Environment: `NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com`
- Environment: `NEXT_PUBLIC_TRUSTNAME_PROGRAM_ID=Fd1e9ECkDJrGyqzpWV2nLM8xBghiDA8PCVWdJD7Fybag`
