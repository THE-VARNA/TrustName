import { NextResponse } from "next/server";
import { z } from "zod";
import { getCampaign } from "@/lib/demo-data";
import { resolveIdentityEvidence } from "@/lib/sns";
import { evaluateEligibility } from "@/lib/scoring";

const verifySchema = z.object({
  campaign: z.string(),
  wallet: z.string(),
  demo: z.boolean().optional()
});

export async function POST(request: Request) {
  const body = verifySchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const campaign = getCampaign(body.data.campaign);

  if (body.data.demo) {
    const { buildDemoReport } = await import("@/lib/demo-data");
    return NextResponse.json({ report: buildDemoReport(campaign.id, body.data.wallet) });
  }

  const profile = await resolveIdentityEvidence(body.data.wallet);
  const report = evaluateEligibility(campaign, profile);
  return NextResponse.json({ report });
}
