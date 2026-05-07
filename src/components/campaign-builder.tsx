"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, FileCheck2, SlidersHorizontal, Sparkles } from "lucide-react";
import { ruleTemplates } from "@/lib/demo-data";
import type { CampaignRule } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { StatusChip, Surface } from "@/components/ui/surface";

const steps = ["Template", "Rules", "Review"];

export function CampaignBuilder() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("SNS Genesis Airdrop");
  const [threshold, setThreshold] = useState(78);
  const [rules, setRules] = useState<CampaignRule[]>([...ruleTemplates.snsNativeAirdrop]);

  const enabledRules = useMemo(() => rules.filter((rule) => rule.enabled), [rules]);
  const maxScore = useMemo(() => enabledRules.reduce((total, rule) => total + rule.weight, 0), [enabledRules]);

  function toggleRule(ruleId: string) {
    setRules((current) => current.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Surface className="p-6">
        <StatusChip>campaign builder</StatusChip>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal">Create reusable SNS eligibility rules.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Build a campaign judges can understand in one pass: identity primitive, evidence checks, scoring threshold, then publish.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {steps.map((label, index) => (
            <div key={label} className={`rounded-md border p-3 ${index === step ? "border-primary/50 bg-primary/10" : "border-white/10 bg-white/6"}`}>
              <span className="text-sm text-muted-foreground">Step {index + 1}</span>
              <p className="font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </Surface>

      {step === 0 ? (
        <Surface className="p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">Template</h2>
          </div>
          <label className="mt-6 block text-sm font-medium" htmlFor="campaign-name">Campaign name</label>
          <input
            id="campaign-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-md border border-white/12 bg-white/8 px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoComplete="off"
          />
          <div className="mt-5 rounded-md border border-primary/25 bg-primary/10 p-4">
            <h3 className="font-semibold">SNS Native Airdrop</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Requires fresh primary domain, awards Records V2 and X handle points, and routes weak-trust cases to manual review.
            </p>
          </div>
        </Surface>
      ) : null}

      {step === 1 ? (
        <Surface className="p-6">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">Rules</h2>
          </div>
          <div className="mt-6 grid gap-3">
            {rules.map((rule) => (
              <label key={rule.id} className="flex cursor-pointer items-start gap-3 rounded-md border border-white/10 bg-white/6 p-4">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={() => toggleRule(rule.id)}
                  className="mt-1 h-5 w-5 rounded border-white/20 bg-transparent text-primary focus:ring-ring"
                />
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2 font-semibold">
                    {rule.label}
                    <StatusChip tone={rule.severity === "required" ? "danger" : "neutral"}>{rule.severity}</StatusChip>
                    <span className="font-mono text-sm text-primary">+{rule.weight}</span>
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{rule.description}</span>
                </span>
              </label>
            ))}
          </div>
          <label className="mt-6 block text-sm font-medium" htmlFor="threshold">Auto-approve threshold: {threshold}</label>
          <input
            id="threshold"
            type="range"
            min="40"
            max="100"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className="mt-3 w-full accent-primary"
          />
        </Surface>
      ) : null}

      {step === 2 ? (
        <Surface className="p-6">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">Publish summary</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Surface subtle className="p-4">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="mt-2 font-semibold">{name}</p>
            </Surface>
            <Surface subtle className="p-4">
              <p className="text-sm text-muted-foreground">Max score</p>
              <p className="mt-2 font-semibold">{maxScore}</p>
            </Surface>
            <Surface subtle className="p-4">
              <p className="text-sm text-muted-foreground">Auto approve</p>
              <p className="mt-2 font-semibold">{threshold}+</p>
            </Surface>
          </div>
          <div className="mt-5 space-y-2">
            {enabledRules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                {rule.label}: {rule.description}
              </div>
            ))}
          </div>
          <Button asChild className="mt-6">
            <Link href="/campaigns/camp-genesis">Publish demo campaign</Link>
          </Button>
        </Surface>
      ) : null}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        <Button onClick={() => setStep((current) => Math.min(2, current + 1))} disabled={step === 2}>
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
