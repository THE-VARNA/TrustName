import Link from "next/link";
import { Download, Eye, ShieldAlert, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { clusterSignals, getCampaign, reports } from "@/lib/demo-data";
import { EvidenceList } from "@/components/evidence-list";
import { Button } from "@/components/ui/button";
import { StatCard, StatusChip, Surface } from "@/components/ui/surface";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = getCampaign(id);
  const campaignReports = reports.filter((report) => report.campaignId === campaign.id);
  const approvals = campaignReports.filter((report) => report.status === "approved").length;

  return (
    <div className="space-y-6">
      <Surface className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <StatusChip tone={campaign.status === "active" ? "success" : "warning"}>{campaign.status}</StatusChip>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal">{campaign.name}</h1>
            <p className="mt-2 text-muted-foreground">{campaign.targetAction}</p>
            <p className="mt-2 font-mono text-sm text-cyan-100/80">Issuer: {campaign.issuerDomain}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">
              <Download className="h-4 w-4" aria-hidden="true" />
              Export allowlist
            </Button>
            <Button asChild>
              <Link href={`/claim/${campaign.slug}`}>Open claim</Link>
            </Button>
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Participants" value="1,284" detail="Seeded demo + live-ready API" />
        <StatCard label="Auto approved" value={`${approvals}/${campaignReports.length}`} detail="Based on evidence threshold" tone="text-emerald-200" />
        <StatCard label="Manual review" value="19%" detail="Warnings without auto-denial" tone="text-amber-200" />
        <StatCard label="Ruleset hash" value="tn_9f42" detail="Stored with attestations" tone="text-cyan-100" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Surface className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Participants</h2>
            <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3">Identity</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Warnings</th>
                  <th>Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {campaignReports.map((report) => (
                  <tr key={report.id}>
                    <td className="py-4">
                      <Link href={`/identity/${report.domain ?? report.wallet}`} className="font-mono text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {report.domain ?? report.wallet}
                      </Link>
                    </td>
                    <td>{report.score}/{report.maxScore}</td>
                    <td><StatusChip tone={report.status === "approved" ? "success" : report.status === "denied" ? "danger" : "warning"}>{report.status}</StatusChip></td>
                    <td>{report.warnings.length}</td>
                    <td>
                      <Button variant="ghost" className="px-2" aria-label={`Review ${report.domain ?? report.wallet}`}>
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>

        <Surface className="p-5">
          <h2 className="text-xl font-semibold">Manual review drawer</h2>
          <p className="mt-2 text-sm text-muted-foreground">Selected participant: {campaignReports[1]?.domain}</p>
          {campaignReports[1] ? <EvidenceList evidence={campaignReports[1].evidence} /> : null}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button variant="secondary">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              Deny
            </Button>
            <Button>
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Approve
            </Button>
          </div>
        </Surface>
      </section>

      <Surface className="p-5">
        <h2 className="text-xl font-semibold">Campaign risk signals</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {clusterSignals.map((signal) => (
            <div key={signal.id} className="rounded-md border border-white/10 bg-white/6 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{signal.label}</h3>
                <StatusChip tone={signal.severity === "high" ? "danger" : "warning"}>{signal.severity}</StatusChip>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{signal.explanation}</p>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}
