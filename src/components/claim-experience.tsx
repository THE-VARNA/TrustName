"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ArrowLeft, BadgeCheck, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";
import { EvidenceList } from "@/components/evidence-list";
import { Button } from "@/components/ui/button";
import { StatCard, StatusChip, Surface } from "@/components/ui/surface";
import { createDemoAttestation } from "@/lib/attestation";
import { buildDemoReport } from "@/lib/demo-data";
import type { AttestationProof, Campaign, EligibilityReport } from "@/lib/types";

type RunState = "idle" | "loading" | "success" | "error";

export function ClaimExperience({ campaign }: { campaign: Campaign }) {
  const { publicKey, connected } = useWallet();
  const [state, setState] = useState<RunState>("idle");
  const [report, setReport] = useState<EligibilityReport | null>(null);
  const [attestation, setAttestation] = useState<AttestationProof | null>(null);
  const wallet = useMemo(
    () => publicKey?.toBase58() ?? "FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ",
    [publicKey]
  );

  async function runEligibility() {
    setState("loading");
    setAttestation(null);
    await new Promise((resolve) => setTimeout(resolve, 850));
    try {
      setReport(buildDemoReport(campaign.id, wallet));
      setState("success");
    } catch {
      setState("error");
    }
  }

  function mintAttestation() {
    if (!report) return;
    setAttestation(createDemoAttestation(report));
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <Link href="/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to app
      </Link>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <Surface className="p-6">
          <StatusChip>participant claim</StatusChip>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-6xl">{campaign.name}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Connect a wallet, resolve SNS identity, evaluate campaign rules, and mint a reusable eligibility attestation when approved.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <WalletButton />
            <Button onClick={runEligibility} disabled={state === "loading"}>
              {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
              Run eligibility
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {connected ? "Using connected devnet wallet." : "No wallet connected; demo identity is preloaded for judges."}
          </p>
        </Surface>

        <Surface className="p-5">
          <h2 className="text-xl font-semibold">Claim state</h2>
          <div className="mt-5 grid gap-4">
            <StatCard label="Auto-approve" value={`${campaign.autoApproveScore}+`} detail="Required campaign score" />
            <StatCard label="Rules" value={campaign.rules.filter((rule) => rule.enabled).length.toString()} detail="SNS evidence checks" tone="text-cyan-100" />
          </div>
        </Surface>
      </section>

      {state === "idle" ? (
        <Surface className="mt-6 p-6">
          <h2 className="text-xl font-semibold">Ready to evaluate</h2>
          <p className="mt-2 text-muted-foreground">The flow will check primary domain, Records V2, X linkage, issuer subdomain evidence, and campaign-local warnings.</p>
        </Surface>
      ) : null}

      {state === "error" ? (
        <Surface className="mt-6 border-destructive/40 p-6">
          <h2 className="text-xl font-semibold text-rose-100">Evaluation failed</h2>
          <p className="mt-2 text-muted-foreground">Try again or switch to the seeded demo wallet.</p>
        </Surface>
      ) : null}

      {report ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <Surface className="p-5">
            <StatusChip tone={report.status === "approved" ? "success" : report.status === "denied" ? "danger" : "warning"}>{report.status}</StatusChip>
            <p className="mt-5 text-6xl font-semibold tracking-normal">{report.score}</p>
            <p className="mt-2 text-muted-foreground">of {report.maxScore} possible points</p>
            <div className="luminous-line my-5" />
            {report.warnings.length > 0 ? (
              <div className="space-y-2">
                {report.warnings.map((warning) => (
                  <p key={warning} className="rounded-md bg-amber-300/10 p-3 text-sm text-amber-100">{warning}</p>
                ))}
              </div>
            ) : (
              <p className="rounded-md bg-emerald-300/10 p-3 text-sm text-emerald-100">All enabled SNS trust checks passed.</p>
            )}
            <Button onClick={mintAttestation} disabled={report.status !== "approved"} className="mt-5 w-full">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              Mint attestation
            </Button>
            {attestation ? (
              <div className="mt-4 rounded-md border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Demo attestation ready
                </div>
                <p className="mt-2 break-all font-mono text-xs">{attestation.pda}</p>
              </div>
            ) : null}
          </Surface>
          <Surface className="p-5">
            <h2 className="text-xl font-semibold">Evidence</h2>
            <div className="mt-5">
              <EvidenceList evidence={report.evidence} />
            </div>
          </Surface>
        </section>
      ) : null}
    </main>
  );
}
