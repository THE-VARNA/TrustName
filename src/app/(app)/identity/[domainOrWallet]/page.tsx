import { CalendarCheck, Fingerprint, Link2, ShieldCheck } from "lucide-react";
import { getDemoProfile, reports } from "@/lib/demo-data";
import { EvidenceList } from "@/components/evidence-list";
import { StatCard, StatusChip, Surface } from "@/components/ui/surface";

export default async function IdentityPage({ params }: { params: Promise<{ domainOrWallet: string }> }) {
  const { domainOrWallet } = await params;
  const profile = getDemoProfile(decodeURIComponent(domainOrWallet));
  const identityReports = reports.filter((report) => report.wallet === profile.wallet);

  return (
    <div className="space-y-6">
      <Surface className="p-6">
        <StatusChip>identity evidence</StatusChip>
        <h1 className="mt-4 break-all text-4xl font-semibold tracking-normal">{profile.primaryDomain ?? profile.wallet}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          TrustName explains exactly which SNS signals are fresh, associated, on-chain, and useful for campaign eligibility.
        </p>
      </Surface>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Primary domain" value={profile.primaryDomain ?? "None"} detail="SNS primary lookup" />
        <StatCard label="X linkage" value={profile.xHandle ?? "None"} detail="Direct/reverse capable" tone="text-cyan-100" />
        <StatCard label="Records health" value={`${profile.records.filter((record) => record.verified).length}/${profile.records.length}`} detail="Records V2 verified" tone="text-emerald-200" />
        <StatCard label="Outcomes" value={identityReports.length.toString()} detail="Campaign reports" tone="text-amber-200" />
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Surface className="p-5">
          <h2 className="text-xl font-semibold">Trust explanation</h2>
          <div className="mt-5 grid gap-4">
            <div className="flex gap-3">
              <Fingerprint className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">A fresh primary `.sol` domain proves the wallet has selected a canonical SNS identity.</p>
            </div>
            <div className="flex gap-3">
              <Link2 className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">Records V2 only contribute points when both staleness and right-of-association checks pass.</p>
            </div>
            <div className="flex gap-3">
              <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">Campaign outcomes are reusable, but each campaign keeps its own ruleset and evidence hash.</p>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">Approved reports can mint a compact Anchor attestation for gated access or allowlists.</p>
            </div>
          </div>
        </Surface>
        <Surface className="p-5">
          <h2 className="text-xl font-semibold">Evidence set</h2>
          <div className="mt-5">
            <EvidenceList evidence={profile.evidence} />
          </div>
        </Surface>
      </section>
    </div>
  );
}
