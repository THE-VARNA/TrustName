import { ClaimExperience } from "@/components/claim-experience";
import { getCampaign } from "@/lib/demo-data";

export default async function ClaimPage({ params }: { params: Promise<{ campaignSlug: string }> }) {
  const { campaignSlug } = await params;
  const campaign = getCampaign(campaignSlug);
  return <ClaimExperience campaign={campaign} />;
}
