import { cn } from "@/lib/utils";

export function Surface({
  children,
  className,
  subtle = false
}: {
  children: React.ReactNode;
  className?: string;
  subtle?: boolean;
}) {
  return <section className={cn(subtle ? "glass-subtle" : "glass", "rounded-lg", className)}>{children}</section>;
}

export function StatCard({
  label,
  value,
  detail,
  tone = "text-primary"
}: {
  label: string;
  value: string;
  detail: string;
  tone?: string;
}) {
  return (
    <Surface className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-normal ${tone}`}>{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </Surface>
  );
}

export function StatusChip({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: "success" | "warning" | "danger" | "neutral";
}) {
  const tones = {
    success: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
    warning: "border-amber-300/25 bg-amber-300/10 text-amber-100",
    danger: "border-rose-300/25 bg-rose-300/10 text-rose-100",
    neutral: "border-cyan-100/15 bg-cyan-100/8 text-cyan-50"
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
