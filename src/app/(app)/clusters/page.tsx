import { Network, Search } from "lucide-react";
import { clusterSignals } from "@/lib/demo-data";
import { shortAddress } from "@/lib/utils";
import { StatusChip, Surface } from "@/components/ui/surface";

const graphNodes = [
  { domain: "sprout42.sol", left: 18, top: 20, signalId: "cluster-shared-x" },
  { domain: "sprout43.sol", left: 43, top: 32, signalId: "cluster-shared-x" },
  { domain: "sprout44.sol", left: 68, top: 20, signalId: "cluster-shared-x" },
  { domain: "mint-lane.sol", left: 18, top: 62, signalId: "cluster-weak-records" },
  { domain: "mint-lane-2.sol", left: 43, top: 74, signalId: "cluster-weak-records" }
];

const graphEdges = [
  { from: "sprout42.sol", to: "sprout43.sol", severity: "high" },
  { from: "sprout43.sol", to: "sprout44.sol", severity: "high" },
  { from: "mint-lane.sol", to: "mint-lane-2.sol", severity: "medium" }
];

export default function ClustersPage() {
  const nodeByDomain = new Map(graphNodes.map((node) => [node.domain, node]));

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
          <div className="relative mt-6 aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/6">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" role="img" aria-label="Risk links between grouped SNS domains">
              {graphEdges.map((edge) => {
                const from = nodeByDomain.get(edge.from);
                const to = nodeByDomain.get(edge.to);
                if (!from || !to) return null;
                const tone = edge.severity === "high" ? "rgba(251, 191, 36, 0.58)" : "rgba(125, 211, 252, 0.42)";
                return (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    x1={from.left + 8}
                    y1={from.top + 8}
                    x2={to.left + 8}
                    y2={to.top + 8}
                    stroke={tone}
                    strokeWidth="0.45"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            {graphNodes.map((node) => {
              const signal = clusterSignals.find((item) => item.id === node.signalId);
              const tone = signal?.severity === "high" ? "border-amber-200/40 bg-amber-200/10" : "border-primary/30 bg-primary/10";
              return (
                <div
                  key={node.domain}
                  className={`absolute z-10 flex h-24 w-24 items-center justify-center rounded-full border p-3 text-center text-xs font-semibold text-cyan-50 ${tone}`}
                  style={{
                    left: `${node.left}%`,
                    top: `${node.top}%`
                  }}
                  title={signal?.label}
                >
                  {node.domain}
                </div>
              );
            })}
            <div className="absolute bottom-4 left-4 right-4 z-20 grid gap-2 rounded-md border border-white/10 bg-background/72 p-3 text-xs text-muted-foreground backdrop-blur">
              <p><span className="text-amber-100">Amber line</span> means the domains belong to the same high-risk signal group.</p>
              <p><span className="text-cyan-100">Cyan line</span> means the domains share a weaker manual-review signal.</p>
            </div>
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
