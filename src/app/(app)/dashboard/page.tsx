import Link from "next/link";
import { Activity, AlertTriangle, ArrowUpRight, CheckCircle2, Download, ShieldCheck } from "lucide-react";
import { campaigns, liveEvents, metrics, reports } from "@/lib/demo-data";
import { formatUsd } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatCard, StatusChip, Surface } from "@/components/ui/surface";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <Surface className="overflow-hidden p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <StatusChip>devnet-first MVP</StatusChip>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-foreground md:text-6xl">
                SNS identity proofs for claims that judges can audit.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Campaigns score primary domains, Records V2, X handles, subdomains, and risk warnings with evidence that can mint an attestation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/campaigns/new">Create campaign</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/claim/genesis-drop">Run claim demo</Link>
              </Button>
            </div>
          </div>
          <div className="luminous-line my-6" />
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Budget at risk" value={formatUsd(metrics.budgetAtRiskUsd)} detail="Across live campaigns" />
            <StatCard label="Active claims" value={metrics.activeClaims.toLocaleString()} detail="42 evaluated in last hour" tone="text-cyan-100" />
            <StatCard label="Flagged wallets" value={metrics.flaggedWallets.toString()} detail="Interpretable warnings" tone="text-amber-200" />
            <StatCard label="Approval rate" value={`${Math.round(metrics.approvalRate * 100)}%`} detail="Auto + reviewer approved" tone="text-emerald-200" />
          </div>
        </Surface>
        <Surface className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Live event feed</h2>
            <Activity className="h-5 w-5 text-primary animate-soft-pulse" aria-hidden="true" />
          </div>
          <div className="mt-5 grid gap-3">
            {liveEvents.map((event, index) => (
              <div key={event} className="rounded-md border border-white/10 bg-white/6 p-3 text-sm text-muted-foreground">
                <span className="mr-2 font-mono text-xs text-primary">0{index + 1}</span>
                {event}
              </div>
            ))}
          </div>
        </Surface>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Surface className="p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Recent campaigns</h2>
            <Button variant="secondary" className="px-3" aria-label="Export recent campaigns">
              <Download className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3">Campaign</th>
                  <th>Issuer</th>
                  <th>Status</th>
                  <th>Threshold</th>
                  <th>Risk</th>
                  <th>Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="py-4 font-medium">{campaign.name}</td>
                    <td className="font-mono text-cyan-100/80">{campaign.issuerDomain}</td>
                    <td><StatusChip tone={campaign.status === "active" ? "success" : "warning"}>{campaign.status}</StatusChip></td>
                    <td>{campaign.autoApproveScore}</td>
                    <td>{formatUsd(campaign.budgetAtRiskUsd)}</td>
                    <td>
                      <Link href={`/campaigns/${campaign.id}`} className="inline-flex min-h-10 items-center gap-1 rounded-md px-2 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        View <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>

        <Surface className="p-5">
          <h2 className="text-xl font-semibold">Review queue</h2>
          <div className="mt-5 grid gap-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/identity/${report.domain ?? report.wallet}`}
                className="rounded-md border border-white/10 bg-white/6 p-4 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-cyan-100">{report.domain ?? report.wallet}</span>
                  {report.status === "approved" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-200" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-200" aria-hidden="true" />
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Score {report.score}/{report.maxScore}</span>
                  <StatusChip tone={report.status === "approved" ? "success" : "warning"}>{report.status}</StatusChip>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-md bg-primary/10 p-3 text-sm text-cyan-50">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Evidence hashes are ready for Anchor attestation.
          </div>
        </Surface>
      </section>
    </div>
  );
}
