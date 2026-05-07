# TrustName Judge Demo Runbook

Goal: Show the complete TrustName workflow in under 3 minutes with almost no talking.

Demo URL:

```text
http://localhost:3000/dashboard
```

Total target time: 2 minutes 45 seconds

## 0:00-0:15 — Dashboard

Route:

```text
/dashboard
```

Show:
- TrustName headline
- Budget at risk
- Active claims
- Flagged wallets
- Approval rate
- Recent campaigns table

Click:
- Nothing for the first few seconds.
- Then click `Create campaign`.

Judges should understand:
- This is a campaign eligibility and sybil-risk product.
- It is not just a profile page.

## 0:15-0:45 — Create Campaign

Route:

```text
/campaigns/new
```

Do:
1. Click inside `Campaign name`.
2. Replace the text with:

```text
SNS Judge Demo Claim
```

3. Pause briefly on the `SNS Native Airdrop` template.
4. Click `Next`.

Show:
- Multi-step campaign builder
- SNS Native Airdrop template
- Primary domain, Records V2, X handle, and manual review are part of the campaign rules

Judges should understand:
- Campaign owners can configure reusable SNS eligibility rules.

## 0:45-1:10 — Configure Rules

Route:

```text
/campaigns/new
```

Do:
1. Toggle `Verified X handle` off.
2. Toggle `Verified X handle` back on.
3. Move the `Auto-approve threshold` slider slightly.
4. Click `Next`.

Show:
- Fresh primary `.sol` domain required
- Verified X handle
- Verified SOL record
- Verified URL/CNAME record
- Issuer subdomain membership
- Wallet age proxy

Judges should understand:
- TrustName scores real SNS identity evidence, not arbitrary numbers.

## 1:10-1:25 — Review And Publish

Route:

```text
/campaigns/new
```

Do:
1. Pause on the publish summary.
2. Show the enabled rules list.
3. Click `Publish demo campaign`.

Show:
- Campaign name
- Max score
- Auto-approve threshold
- Human-readable rules summary

Judges should understand:
- The campaign is understandable before launch.

## 1:25-1:50 — Campaign Detail

Route:

```text
/campaigns/camp-genesis
```

Do:
1. Show the campaign header.
2. Scroll or point attention to the participant table.
3. Pause on `fida.sol` approved result.
4. Pause on `sprout42.sol` manual-review or warning result.

Show:
- Participant score
- Pass/fail/manual-review status
- Warning count
- Manual review drawer
- Evidence list

Click:
- Click `fida.sol`.

Judges should understand:
- Admins can review individual participants with evidence.

## 1:50-2:10 — Identity Evidence

Route:

```text
/identity/fida.sol
```

Do:
1. Pause on identity summary cards.
2. Show `Primary domain`.
3. Show `X linkage`.
4. Show `Records health`.
5. Scroll to evidence cards if needed.

Show:
- Primary domain
- X handle
- Records V2 health
- Fresh check
- RoA check
- Points awarded

Judges should understand:
- SNS primary domains and verified records materially affect eligibility.

Click:
- Use top navigation and click `Claim demo`.

## 2:10-2:40 — Claim Flow And Attestation

Route:

```text
/claim/genesis-drop
```

Do:
1. Do not connect a wallet unless it is already ready.
2. Click `Run eligibility`.
3. Wait for the result.
4. Pause on score and evidence.
5. Click `Mint attestation`.

Show:
- Participant-facing claim page
- Eligibility score
- Evidence-based result
- Mint attestation button
- `Demo attestation ready` success state

Judges should understand:
- End users can check eligibility and receive an attestation.

## 2:40-2:55 — Cluster Risk

Route:

Click:
- In top navigation, click `Clusters`.

Show:
- Risk graph
- Grouped signals
- X handle mismatch cluster
- Weak Records V2 coverage

Judges should understand:
- TrustName flags sybil risk with interpretable evidence, not black-box claims.

## 2:55-3:00 — Export/API Proof

Route:

Open directly if time allows:

```text
/api/campaigns/camp-genesis/allowlist
```

Show:
- JSON allowlist
- wallet
- domain
- score
- evidenceHash
- rulesetHash

Judges should understand:
- Campaign owners can export verified allowlists or integrate through an API.

## Exact Silent Demo Click Path

Use this if you do not want to think during the demo:

1. Open `/dashboard`
2. Click `Create campaign`
3. Type `SNS Judge Demo Claim`
4. Click `Next`
5. Toggle `Verified X handle` off
6. Toggle `Verified X handle` on
7. Move threshold slider slightly
8. Click `Next`
9. Click `Publish demo campaign`
10. Pause on participant table
11. Click `fida.sol`
12. Pause on identity evidence
13. Click `Claim demo`
14. Click `Run eligibility`
15. Click `Mint attestation`
16. Click `Clusters`
17. Open `/api/campaigns/camp-genesis/allowlist`

## One-Line Backup Explanation

Use only if judges ask what they are seeing:

```text
TrustName turns verified SNS identity signals like primary .sol domains, Records V2, X handles, and subdomains into reusable campaign eligibility reports and on-chain attestations.
```

## Do Not Spend Time On

- Do not explain the code.
- Do not explain Anchor unless asked.
- Do not connect a wallet unless it is already smooth.
- Do not discuss MagicBlock unless asked.
- Do not stay on JSON for more than 5 seconds.

## If Something Breaks During Demo

If wallet connection is slow:
- Skip wallet connection.
- Use the no-wallet claim demo.
- Click `Run eligibility`.

If claim result does not load:
- Go to `/identity/fida.sol`.
- Show evidence cards.

If route navigation is slow:
- Directly paste the next route path.

If time is short:
- Show `/dashboard`
- Show `/campaigns/camp-genesis`
- Show `/claim/genesis-drop`
- Show `/clusters`
