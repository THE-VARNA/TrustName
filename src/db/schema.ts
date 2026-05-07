import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const campaignsTable = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  issuer: text("issuer").notNull(),
  issuerDomain: text("issuer_domain").notNull(),
  name: text("name").notNull(),
  rulesetJson: text("ruleset_json").notNull(),
  status: text("status").notNull(),
  autoApproveScore: integer("auto_approve_score").notNull(),
  createdAt: text("created_at").notNull()
});

export const identityProfilesTable = sqliteTable("identity_profiles", {
  wallet: text("wallet").primaryKey(),
  primaryDomain: text("primary_domain"),
  domainAddress: text("domain_address"),
  evidenceJson: text("evidence_json").notNull(),
  lastResolvedAt: text("last_resolved_at").notNull()
});

export const eligibilityReportsTable = sqliteTable("eligibility_reports", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  wallet: text("wallet").notNull(),
  score: integer("score").notNull(),
  status: text("status").notNull(),
  evidenceHash: text("evidence_hash").notNull(),
  rulesetHash: text("ruleset_hash").notNull(),
  evidenceJson: text("evidence_json").notNull(),
  evaluatedAt: text("evaluated_at").notNull()
});

export const attestationsTable = sqliteTable("attestations", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  wallet: text("wallet").notNull(),
  score: integer("score").notNull(),
  pda: text("pda").notNull(),
  signature: text("signature"),
  evidenceHash: text("evidence_hash").notNull(),
  rulesetHash: text("ruleset_hash").notNull(),
  mintedAt: text("minted_at").notNull()
});
