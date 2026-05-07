import { NextResponse } from "next/server";
import { getCampaign, reports } from "@/lib/demo-data";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = getCampaign(id);
  const allowlist = reports
    .filter((report) => report.campaignId === campaign.id && report.status === "approved")
    .map((report) => ({
      wallet: report.wallet,
      domain: report.domain,
      score: report.score,
      evidenceHash: report.evidenceHash,
      rulesetHash: report.rulesetHash
    }));

  return NextResponse.json({ campaign: campaign.slug, allowlist });
}
