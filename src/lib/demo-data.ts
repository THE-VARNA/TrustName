import type { Campaign, ClusterSignal, DashboardMetrics, EligibilityReport, EvidenceItem, IdentityProfile } from "@/lib/types";
import { stableHash } from "@/lib/utils";

export const ruleTemplates = {
  snsNativeAirdrop: [
    {
      id: "rule-primary",
      kind: "primary-domain-required",
      label: "Fresh primary .sol domain",
      description: "Wallet must have a primary SNS domain that is not stale.",
      weight: 30,
      severity: "required",
      enabled: true
    },
    {
      id: "rule-x",
      kind: "verified-x-handle",
      label: "Verified X handle",
      description: "SNS X handle direct and reverse lookup should agree.",
      weight: 18,
      severity: "weighted",
      enabled: true
    },
    {
      id: "rule-sol-record",
      kind: "verified-record",
      label: "Verified SOL record",
      description: "Records V2 SOL entry passes staleness and right-of-association checks.",
      weight: 22,
      recordType: "SOL",
      severity: "weighted",
      enabled: true
    },
    {
      id: "rule-url",
      kind: "verified-record",
      label: "Verified URL/CNAME record",
      description: "Public project/community record has SNS guardian-backed RoA verification.",
      weight: 12,
      recordType: "URL",
      severity: "weighted",
      enabled: true
    },
    {
      id: "rule-subdomain",
      kind: "issuer-subdomain",
      label: "Issuer namespace membership",
      description: "Community subdomain under issuer-owned namespace contributes scoped trust.",
      weight: 10,
      severity: "weighted",
      enabled: true
    },
    {
      id: "rule-wallet-age",
      kind: "wallet-age-proxy",
      label: "Wallet age proxy",
      description: "Non-invasive proxy based on observed campaign history, never KYC.",
      weight: 8,
      threshold: 30,
      severity: "warning",
      enabled: true
    }
  ]
} as const satisfies Record<string, Campaign["rules"]>;

export const campaigns: Campaign[] = [
  {
    id: "camp-genesis",
    slug: "genesis-drop",
    name: "Genesis Builders Drop",
    issuer: "GNBz9qWf8w4R5VnC2YqE3rL7zZqErLsfUi2Yb2jL1xQ",
    issuerDomain: "builders.sol",
    status: "active",
    targetAction: "Airdrop allowlist and claim attestation",
    timeframe: { start: "2026-05-01", end: "2026-05-31" },
    autoApproveScore: 78,
    manualReviewBelow: 55,
    budgetAtRiskUsd: 128000,
    rules: [...ruleTemplates.snsNativeAirdrop],
    createdAt: "2026-05-01T09:00:00.000Z"
  },
  {
    id: "camp-dao",
    slug: "dao-council",
    name: "DAO Council Gate",
    issuer: "DoAcY51RwL5hrxWqa7k8s3zRacSL5k2Ke2Yf4h7jTdb",
    issuerDomain: "council.sol",
    status: "active",
    targetAction: "Private forum and proposal access",
    timeframe: { start: "2026-04-20", end: "2026-06-01" },
    autoApproveScore: 82,
    manualReviewBelow: 62,
    budgetAtRiskUsd: 44000,
    rules: [...ruleTemplates.snsNativeAirdrop].map((rule) =>
      rule.id === "rule-x" ? { ...rule, enabled: false } : rule
    ),
    createdAt: "2026-04-20T12:00:00.000Z"
  },
  {
    id: "camp-quest",
    slug: "community-quest",
    name: "Community Quest Claim",
    issuer: "CmQnKUUGv5p8XjSPxQg2FJgxFh6i2MzP5PFXoMNjsWKC",
    issuerDomain: "quest.sol",
    status: "paused",
    targetAction: "Quest badge and gated Discord role",
    timeframe: { start: "2026-04-01", end: "2026-05-18" },
    autoApproveScore: 75,
    manualReviewBelow: 50,
    budgetAtRiskUsd: 19000,
    rules: [...ruleTemplates.snsNativeAirdrop],
    createdAt: "2026-04-01T15:30:00.000Z"
  }
];

const evidenceBank: Record<string, EvidenceItem[]> = {
  "FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ": [
    {
      id: "ev-primary-fida",
      label: "Primary domain",
      source: "sns-primary",
      value: "fida.sol",
      verified: true,
      onChain: true,
      fresh: true,
      rightOfAssociation: null,
      points: 30,
      explanation: "Primary domain resolved from SNS and marked fresh."
    },
    {
      id: "ev-sol-fida",
      label: "SOL record V2",
      source: "sns-record-v2",
      value: "FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ",
      verified: true,
      onChain: true,
      fresh: true,
      rightOfAssociation: true,
      points: 22,
      explanation: "SOL record passed staleness and self-signed right-of-association checks."
    },
    {
      id: "ev-x-fida",
      label: "X handle",
      source: "sns-x",
      value: "@bonfida",
      verified: true,
      onChain: true,
      fresh: true,
      rightOfAssociation: true,
      points: 18,
      explanation: "Direct and reverse SNS X handle lookups agree."
    },
    {
      id: "ev-url-fida",
      label: "URL record",
      source: "sns-record-v2",
      value: "https://sns.id",
      verified: true,
      onChain: true,
      fresh: true,
      rightOfAssociation: true,
      points: 12,
      explanation: "URL record uses guardian-backed right-of-association verification."
    },
    {
      id: "ev-sub-fida",
      label: "Issuer subdomain",
      source: "sns-subdomain",
      value: "fida.builders.sol",
      verified: true,
      onChain: true,
      fresh: true,
      rightOfAssociation: null,
      points: 10,
      explanation: "Subdomain belongs to issuer namespace and is scored as scoped community membership."
    },
    {
      id: "ev-age-fida",
      label: "Wallet age proxy",
      source: "wallet",
      value: "Observed in 7 prior campaigns",
      verified: true,
      onChain: false,
      fresh: null,
      rightOfAssociation: null,
      points: 8,
      explanation: "Non-invasive local campaign-history proxy."
    }
  ],
  "7sybil111111111111111111111111111111111111111": [
    {
      id: "ev-primary-syb",
      label: "Primary domain",
      source: "sns-primary",
      value: "sprout42.sol",
      verified: true,
      onChain: true,
      fresh: true,
      rightOfAssociation: null,
      points: 30,
      explanation: "Primary domain exists and is fresh."
    },
    {
      id: "ev-sol-syb",
      label: "SOL record V2",
      source: "sns-record-v2",
      value: "Missing",
      verified: false,
      onChain: true,
      fresh: null,
      rightOfAssociation: null,
      points: 0,
      explanation: "No verified SOL record was found, so no record points were awarded."
    },
    {
      id: "ev-x-syb",
      label: "X handle",
      source: "sns-x",
      value: "@sprout_claims",
      verified: false,
      onChain: true,
      fresh: true,
      rightOfAssociation: false,
      points: 0,
      explanation: "Reverse lookup did not resolve back to this wallet."
    },
    {
      id: "ev-age-syb",
      label: "Wallet age proxy",
      source: "wallet",
      value: "First seen today",
      verified: false,
      onChain: false,
      fresh: null,
      rightOfAssociation: null,
      points: 0,
      explanation: "Campaign-local history suggests a new wallet; this is a warning, not a denial by itself."
    }
  ]
};

export const identityProfiles: IdentityProfile[] = Object.entries(evidenceBank).map(([wallet, evidence]) => ({
  wallet,
  primaryDomain: evidence.find((item) => item.source === "sns-primary")?.value,
  domainAddress: wallet === "FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ" ? "4uQeVj5tqViQh7yWWGStvkEG1Zmhx6uasJtWCJziofM" : "9uQeDemoDomain1111111111111111111111111111111",
  xHandle: evidence.find((item) => item.source === "sns-x")?.value,
  subdomains: evidence.filter((item) => item.source === "sns-subdomain").map((item) => item.value),
  records: evidence.filter((item) => item.source === "sns-record-v2"),
  evidence,
  lastResolvedAt: "2026-05-07T07:00:00.000Z",
  demoFixture: true
}));

export const clusterSignals: ClusterSignal[] = [
  {
    id: "cluster-shared-x",
    label: "X handle mismatch cluster",
    severity: "high",
    wallets: [
      "7sybil111111111111111111111111111111111111111",
      "7sybil222222222222222222222222222222222222222",
      "7sybil333333333333333333333333333333333333333"
    ],
    domains: ["sprout42.sol", "sprout43.sol", "sprout44.sol"],
    explanation: "Three wallets claim adjacent domains and overlapping social handles, but reverse X lookups do not return the submitting wallets.",
    evidenceIds: ["ev-x-syb", "ev-age-syb"]
  },
  {
    id: "cluster-weak-records",
    label: "Weak Records V2 coverage",
    severity: "medium",
    wallets: [
      "9weak111111111111111111111111111111111111111",
      "9weak222222222222222222222222222222222222222"
    ],
    domains: ["mint-lane.sol", "mint-lane-2.sol"],
    explanation: "Primary domains are fresh, but both lack verified SOL and URL records. TrustName routes these to manual review rather than auto-denial.",
    evidenceIds: ["ev-sol-weak", "ev-url-weak"]
  }
];

export function getCampaign(idOrSlug: string) {
  return campaigns.find((campaign) => campaign.id === idOrSlug || campaign.slug === idOrSlug) ?? campaigns[0];
}

export function getDemoProfile(domainOrWallet: string) {
  return (
    identityProfiles.find(
      (profile) => profile.wallet === domainOrWallet || profile.primaryDomain === domainOrWallet
    ) ?? identityProfiles[0]
  );
}

export function buildDemoReport(campaignId: string, wallet: string): EligibilityReport {
  const campaign = getCampaign(campaignId);
  const profile = getDemoProfile(wallet);
  const evidence = profile.evidence;
  const score = evidence.reduce((total, item) => total + item.points, 0);
  const maxScore = campaign.rules.filter((rule) => rule.enabled).reduce((total, rule) => total + rule.weight, 0);
  const warnings = [
    ...evidence.filter((item) => !item.verified).map((item) => `${item.label}: ${item.explanation}`),
    ...(profile.wallet.startsWith("7sybil") ? ["Cluster signal: similar weak-trust wallets submitted within the same campaign window."] : [])
  ];
  const pass = score >= campaign.autoApproveScore && warnings.length === 0;
  const status = pass ? "approved" : score < campaign.manualReviewBelow ? "denied" : "manual-review";

  return {
    id: `report-${campaign.id}-${profile.wallet.slice(0, 6)}`,
    campaignId: campaign.id,
    wallet: profile.wallet,
    domain: profile.primaryDomain,
    pass,
    score,
    maxScore,
    status,
    reasons: evidence.filter((item) => item.points > 0).map((item) => `${item.label} contributed ${item.points} points.`),
    warnings,
    evidence,
    clusterSignals: profile.wallet.startsWith("7sybil") ? [clusterSignals[0]] : [],
    evaluatedAt: new Date().toISOString(),
    evidenceHash: stableHash(evidence),
    rulesetHash: stableHash(campaign.rules)
  };
}

export const reports: EligibilityReport[] = [
  buildDemoReport("camp-genesis", "FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
  buildDemoReport("camp-genesis", "7sybil111111111111111111111111111111111111111")
];

export const metrics: DashboardMetrics = {
  budgetAtRiskUsd: campaigns.reduce((total, campaign) => total + campaign.budgetAtRiskUsd, 0),
  activeClaims: 1248,
  flaggedWallets: 37,
  approvalRate: 0.78
};

export const liveEvents = [
  "fida.sol minted attestation for Genesis Builders Drop",
  "sprout42.sol routed to manual review: X reverse lookup mismatch",
  "builders.sol exported 842-wallet allowlist",
  "DAO Council Gate updated threshold from 78 to 82",
  "mint-lane.sol warning: missing verified SOL record"
];
