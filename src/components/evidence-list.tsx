import { CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react";
import type { EvidenceItem } from "@/lib/types";
import { StatusChip, Surface } from "@/components/ui/surface";

export function EvidenceList({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <div className="grid gap-3">
      {evidence.map((item) => (
        <Surface key={item.id} subtle className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-3">
              <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-md bg-white/8">
                {item.verified ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-200" aria-hidden="true" />
                ) : (
                  <CircleAlert className="h-5 w-5 text-amber-200" aria-hidden="true" />
                )}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{item.label}</h3>
                  <StatusChip tone={item.verified ? "success" : "warning"}>{item.verified ? "verified" : "review"}</StatusChip>
                  {item.onChain ? <StatusChip>on-chain</StatusChip> : null}
                </div>
                <p className="mt-1 break-all font-mono text-sm text-cyan-100/85">{item.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.explanation}</p>
              </div>
            </div>
            <div className="grid min-w-44 grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
              <span className="rounded-md bg-white/6 p-2">Fresh<br />{String(item.fresh ?? "n/a")}</span>
              <span className="rounded-md bg-white/6 p-2">RoA<br />{String(item.rightOfAssociation ?? "n/a")}</span>
              <span className="rounded-md bg-white/6 p-2 text-primary">+{item.points}</span>
            </div>
          </div>
        </Surface>
      ))}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        Final eligibility only awards trust-sensitive points when required SNS verification flags pass.
      </div>
    </div>
  );
}
