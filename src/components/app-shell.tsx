import Link from "next/link";
import { Activity, Blocks, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/campaigns/new", label: "New campaign", icon: Sparkles },
  { href: "/campaigns/camp-genesis", label: "Campaign", icon: ShieldCheck },
  { href: "/clusters", label: "Clusters", icon: Blocks },
  { href: "/claim/genesis-drop", label: "Claim demo", icon: Activity }
] satisfies Array<{ href: string; label: string; icon: typeof Gauge }>;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/dashboard" className="flex min-h-10 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-semibold">TrustName</span>
              <span className="block text-xs text-muted-foreground">SNS eligibility proofs</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href as never}
                className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
          <WalletButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
