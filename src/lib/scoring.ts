import { getCampaign, getDemoProfile } from "@/lib/demo-data";
import type { Campaign, EligibilityReport, IdentityProfile } from "@/lib/types";
import { stableHash } from "@/lib/utils";

export function evaluateEligibility(campaign: Campaign, profile: IdentityProfile): EligibilityReport {
  const activeRules = campaign.rules.filter((rule) => rule.enabled);
  const evidence = profile.evidence.map((item) => ({ ...item }));
  const maxScore = activeRules.reduce((total, rule) => total + rule.weight, 0);
  const requiredPrimary = activeRules.some((rule) => rule.kind === "primary-domain-required" && rule.severity === "required");
  const hasFreshPrimary = evidence.some((item) => item.source === "sns-primary" && item.verified && item.fresh === true);
  const score = evidence.reduce((total, item) => total + item.points, 0);
  const warnings = evidence
    .filter((item) => !item.verified || item.fresh === false || item.rightOfAssociation === false)
    .map((item) => `${item.label}: ${item.explanation}`);

  if (requiredPrimary && !hasFreshPrimary) {
    warnings.unshift("Required fresh primary .sol domain is missing.");
  }

  const pass = score >= campaign.autoApproveScore && warnings.length === 0;
  const status = pass ? "approved" : score < campaign.manualReviewBelow || (requiredPrimary && !hasFreshPrimary) ? "denied" : "manual-review";

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
    clusterSignals: [],
    evaluatedAt: new Date().toISOString(),
    evidenceHash: stableHash({ wallet: profile.wallet, evidence }),
    rulesetHash: stableHash(activeRules)
  };
}

export function evaluateDemo(campaignIdOrSlug: string, domainOrWallet: string) {
  const campaign = getCampaign(campaignIdOrSlug);
  const profile = getDemoProfile(domainOrWallet);
  return evaluateEligibility(campaign, profile);
}
