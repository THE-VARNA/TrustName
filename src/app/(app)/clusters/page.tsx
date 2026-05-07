import { Network, Search } from "lucide-react";
import { clusterSignals } from "@/lib/demo-data";
import { shortAddress } from "@/lib/utils";
import { StatusChip, Surface } from "@/components/ui/surface";

export default function ClustersPage() {
  return (
    <div className="space-y-6">
      <Surface className="p-6">
        <StatusChip>interpretable heuristics</StatusChip>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal">Sybil-risk explorer without black-box claims.</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          TrustName surfaces overlaps and weak SNS evidence. It does not pretend to know private off-chain identity or impossible chain-analysis facts.
        </p>
      </Surface>

      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Surface className="p-5">
          <div className="flex items-center gap-3">
            <Network className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Risk graph</h2>
          </div>
          <div className="relative mt-6 aspect-square rounded-lg border border-white/10 bg-white/6">
            {clusterSignals.flatMap((signal, signalIndex) =>
              signal.domains.map((domain, index) => (
                <div
                  key={domain}
                  className="absolute flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-primary/10 p-3 text-center text-xs text-cyan-50"
                  style={{
                    left: `${18 + index * 25}%`,
                    top: `${20 + signalIndex * 38 + (index % 2) * 12}%`
                  }}
                >
                  {domain}
                </div>
              ))
            )}
            <div className="absolute left-[32%] top-[38%] h-px w-48 rotate-12 bg-amber-200/35" />
            <div className="absolute left-[26%] top-[66%] h-px w-56 -rotate-6 bg-cyan-200/24" />
          </div>
        </Surface>

        <Surface className="p-5">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Grouped signals</h2>
          </div>
          <div className="mt-5 grid gap-4">
            {clusterSignals.map((signal) => (
              <div key={signal.id} className="rounded-md border border-white/10 bg-white/6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold">{signal.label}</h3>
                  <StatusChip tone={signal.severity === "high" ? "danger" : "warning"}>{signal.severity}</StatusChip>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{signal.explanation}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Wallets</p>
                    {signal.wallets.map((wallet) => (
                      <p key={wallet} className="mt-2 font-mono text-sm text-cyan-100/80">{shortAddress(wallet)}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Domains</p>
                    {signal.domains.map((domain) => (
                      <p key={domain} className="mt-2 font-mono text-sm text-cyan-100/80">{domain}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </section>
    </div>
  );
}
