import { describe, expect, it } from "vitest";
import { campaigns, getDemoProfile } from "@/lib/demo-data";
import { evaluateEligibility } from "@/lib/scoring";

describe("TrustName eligibility engine", () => {
  it("approves a wallet with fresh primary domain and verified SNS records", () => {
    const report = evaluateEligibility(campaigns[0], getDemoProfile("fida.sol"));

    expect(report.status).toBe("approved");
    expect(report.score).toBeGreaterThanOrEqual(campaigns[0].autoApproveScore);
    expect(report.evidence.some((item) => item.source === "sns-record-v2" && item.rightOfAssociation)).toBe(true);
  });

  it("routes weak SNS identity to review or denial with explicit warnings", () => {
    const report = evaluateEligibility(
      campaigns[0],
      getDemoProfile("7sybil111111111111111111111111111111111111111")
    );

    expect(report.status).not.toBe("approved");
    expect(report.warnings.length).toBeGreaterThan(0);
    expect(report.warnings.join(" ")).toContain("X handle");
  });
});
