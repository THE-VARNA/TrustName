export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export type RuleKind =
  | "primary-domain-required"
  | "verified-x-handle"
  | "verified-record"
  | "wallet-age-proxy"
  | "issuer-subdomain"
  | "manual-allow"
  | "manual-deny";

export type RuleSeverity = "required" | "weighted" | "warning";

export interface CampaignRule {
  id: string;
  kind: RuleKind;
  label: string;
  description: string;
  weight: number;
  threshold?: number;
  recordType?: string;
  severity: RuleSeverity;
  enabled: boolean;
}

export interface Campaign {
  id: string;
  slug: string;
  name: string;
  issuer: string;
  issuerDomain: string;
  status: CampaignStatus;
  targetAction: string;
  timeframe: {
    start: string;
    end: string;
  };
  autoApproveScore: number;
  manualReviewBelow: number;
  budgetAtRiskUsd: number;
  rules: CampaignRule[];
  createdAt: string;
}

export interface EvidenceItem {
  id: string;
  label: string;
  source: "sns-primary" | "sns-record-v2" | "sns-x" | "sns-subdomain" | "wallet" | "manual" | "attestation";
  value: string;
  verified: boolean;
  onChain: boolean;
  fresh: boolean | null;
  rightOfAssociation: boolean | null;
  points: number;
  explanation: string;
}

export interface IdentityProfile {
  wallet: string;
  primaryDomain?: string;
  domainAddress?: string;
  xHandle?: string;
  subdomains: string[];
  records: EvidenceItem[];
  evidence: EvidenceItem[];
  lastResolvedAt: string;
  demoFixture?: boolean;
}

export interface ClusterSignal {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  wallets: string[];
  domains: string[];
  explanation: string;
  evidenceIds: string[];
}

export interface EligibilityReport {
  id: string;
  campaignId: string;
  wallet: string;
  domain?: string;
  pass: boolean;
  score: number;
  maxScore: number;
  status: "approved" | "manual-review" | "denied";
  reasons: string[];
  warnings: string[];
  evidence: EvidenceItem[];
  clusterSignals: ClusterSignal[];
  evaluatedAt: string;
  evidenceHash: string;
  rulesetHash: string;
}

export interface AttestationProof {
  id: string;
  campaignId: string;
  wallet: string;
  score: number;
  evidenceHash: string;
  rulesetHash: string;
  signature?: string;
  pda: string;
  explorerUrl: string;
  mintedAt: string;
  mode: "demo" | "devnet";
}

export interface DashboardMetrics {
  budgetAtRiskUsd: number;
  activeClaims: number;
  flaggedWallets: number;
  approvalRate: number;
}
