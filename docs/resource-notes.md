# TrustName Resource Notes

These notes are the implementation constraints extracted from the official SNS and MagicBlock docs before architecture decisions were made.

## SNS Constraints

- SNS maps human-readable `.sol` names to on-chain data such as wallet addresses, IPFS CIDs, images, text, and records. TrustName treats `.sol` identity as a reusable trust primitive, not profile decoration.
- SNS SDKs are available for web3.js v1, `@solana/kit`, Rust, React, and Vue. TrustName uses web3.js v1 compatible packages because the requested stack includes `@solana/web3.js`, Anchor, and wallet adapter.
- Primary domains are the recommended display identity for a wallet. `getPrimaryDomain(connection, wallet)` returns a domain and reverse address in `@bonfida/spl-name-service`; the `@solana-name-service/sns-sdk-kit` form returns `domainAddress`, `domainName`, and a `stale` flag. TrustName records the stale status and refuses primary-domain points when stale.
- `getMultiplePrimaryDomains` supports up to 100 wallet lookups and is optimized for bulk discovery. TrustName can use this for admin search and bulk review, but each final report still stores evidence and verification status.
- Records V2 are mandatory for trust-sensitive records. Every record used in eligibility must pass both:
  - `verifyStaleness(connection, record, domain)`
  - `verifyRightOfAssociation(connection, record, domain, verifier)`
- A record is stale when it was created by a prior domain owner. Stale records must not contribute to eligibility.
- Right of Association proves record authenticity. SNS currently documents RoA support for SOL, ETH, INJ, BNB, URL, and CNAME records, with self-signing behavior for SOL/ETH/BNB/INJ where the record content itself is used as verifier. TrustName labels unsupported records as discovery-only unless a known verifier is available.
- On-chain `.sol` resolution is not simply "read owner":
  1. If tokenized, token holder is the valid destination.
  2. Else use SOL Record V2 only if staleness and RoA are verified.
  3. Else use SOL Record V1 only if signature is valid.
  4. Else resolve to domain owner.
- X handles are represented under the `.twitter` TLD, whose documented root parent registry key is `4YcexoW3r78zz16J2aqmukBLRwGq6rAvWzJpkYAXqebv`. Direct lookup uses `getHandleAndRegistryKey(connection, pubkey)`; reverse lookup uses `getTwitterRegistry(connection, handle)`. TrustName cross-checks direct and reverse data when available.
- Subdomains behave like normal domains with a different parent. Parent owners can transfer subdomains without subdomain-owner signature, so issuer-managed subdomain namespaces are useful but carry weaker independence than user-owned primary domains. TrustName scores community subdomains as issuer-membership evidence, not as full user-owned identity.
- The SNS API base URL is `https://sns-api.bonfida.com`. The docs explicitly state API responses are snapshots and not a replacement for blockchain truth. TrustName may use the API for discovery, search, and UX hints only; final eligibility decisions are backed by on-chain/SNS SDK verification outputs.
- Domain registration is not required for the MVP. TrustName may link to/register through SNS later, but core judge demo focuses on resolving and verifying existing `.sol` identities.

## MagicBlock Constraints

- Ephemeral Rollups delegate/lock state accounts into a specialized SVM runtime. Transactions are routed through specialized RPCs, executed on the ephemeral layer, periodically committed back, and undelegated when complete.
- ER capabilities include faster block times, gasless transactions, integrated scheduling, synchronization with base-layer programs/state, and horizontal scaling. TrustName can use ER as an accelerator for real-time bulk campaign evaluation, but not as the source of identity truth.
- Session Keys are ephemeral keys with instruction scoping and contract-level expiry/access constraints. They reduce repeated wallet popups for repeated actions. TrustName treats them as an optional UX improvement for reviewers approving many reports, not a dependency for core claims.
- MagicBlock Private Ephemeral Rollup uses TEEs to run sensitive logic in hardware-protected ER state. Accounts are public by default; programs explicitly define access rules.
- TEE/PER authorization uses a Permission Program with groups, permissions, and authenticated client access tokens. The documented devnet TEE endpoint requires an authorization token: `https://devnet-tee.magicblock.app?token={authToken}`.
- Because the MVP must run with zero paid infrastructure and no required secrets, TrustName ships core SNS eligibility and Anchor attestations first. MagicBlock is documented and stubbed as a force multiplier for private review weights and high-throughput bulk evaluation, activated when a TEE token/RPC is provided.

## Architecture Decisions From These Constraints

- The campaign engine is evidence-first. Scores are derived from named SNS signals: fresh primary domain, verified SOL/URL/CNAME records, X handle cross-check, issuer subdomain membership, and transparent weak-trust warnings.
- The demo uses seeded fixtures for repeatable judging, but the same `resolveIdentityEvidence` interface supports live devnet RPC verification.
- Trust-sensitive evidence items include `source`, `fresh`, `rightOfAssociation`, `onChain`, `verified`, and `explanation` fields so the UI can show why a score passed or failed.
- The on-chain program stores compact attestations: campaign, subject wallet, score, ruleset hash, evidence hash, and issuer. The full evidence report remains exportable from the app/API.
- SNS API discovery results never directly set `verified: true`.
