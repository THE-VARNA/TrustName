import { PublicKey } from "@solana/web3.js";
import type { AttestationProof, EligibilityReport } from "@/lib/types";
import { stableHash } from "@/lib/utils";

export const TRUSTNAME_ATTESTATION_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_TRUSTNAME_PROGRAM_ID ?? "Fd1e9ECkDJrGyqzpWV2nLM8xBghiDA8PCVWdJD7Fybag"
);

export function deriveCampaignPda(issuer: string, slug: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), new PublicKey(issuer).toBuffer(), Buffer.from(slug)],
    TRUSTNAME_ATTESTATION_PROGRAM_ID
  )[0].toBase58();
}

export function deriveAttestationPda(campaignPda: string, subject: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("attestation"), new PublicKey(campaignPda).toBuffer(), new PublicKey(subject).toBuffer()],
    TRUSTNAME_ATTESTATION_PROGRAM_ID
  )[0].toBase58();
}

export function createDemoAttestation(report: EligibilityReport): AttestationProof {
  const pda = `demo_${stableHash({ campaignId: report.campaignId, wallet: report.wallet })}`;
  return {
    id: `att-${report.id}`,
    campaignId: report.campaignId,
    wallet: report.wallet,
    score: report.score,
    evidenceHash: report.evidenceHash,
    rulesetHash: report.rulesetHash,
    signature: stableHash({ report, type: "demo-attestation" }),
    pda,
    explorerUrl: `https://explorer.solana.com/address/${pda}?cluster=devnet`,
    mintedAt: new Date().toISOString(),
    mode: "demo"
  };
}
