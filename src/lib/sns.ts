import { Connection, PublicKey } from "@solana/web3.js";
import {
  GUARDIANS,
  Record as SnsRecord,
  getHandleAndRegistryKey,
  getPrimaryDomain,
  getRecordV2,
  verifyRightOfAssociation,
  verifyStaleness
} from "@bonfida/spl-name-service";
import type { EvidenceItem, IdentityProfile } from "@/lib/types";

const DEFAULT_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

function evidenceBase(id: string, label: string, value: string): Omit<EvidenceItem, "source"> {
  return {
    id,
    label,
    value,
    verified: false,
    onChain: true,
    fresh: null,
    rightOfAssociation: null,
    points: 0,
    explanation: "Not evaluated yet."
  };
}

export function createSnsConnection(endpoint = DEFAULT_RPC) {
  return new Connection(endpoint, "confirmed");
}

export async function resolveIdentityEvidence(walletAddress: string, endpoint = DEFAULT_RPC): Promise<IdentityProfile> {
  const connection = createSnsConnection(endpoint);
  const wallet = new PublicKey(walletAddress);
  const evidence: EvidenceItem[] = [];
  let primaryDomain: string | undefined;
  let domainAddress: string | undefined;
  let xHandle: string | undefined;

  try {
    const primary = await getPrimaryDomain(connection, wallet);
    primaryDomain = primary.reverse;
    domainAddress = primary.domain.toBase58();
    evidence.push({
      ...evidenceBase("sns-primary", "Primary domain", primary.reverse ?? "None"),
      source: "sns-primary",
      verified: Boolean(primary.reverse) && !primary.stale,
      fresh: !primary.stale,
      points: primary.reverse && !primary.stale ? 30 : 0,
      explanation: primary.reverse && !primary.stale
        ? "Primary domain resolved on-chain through SNS."
        : "No fresh primary domain was found for this wallet."
    });
  } catch (error) {
    evidence.push({
      ...evidenceBase("sns-primary-error", "Primary domain", "Unavailable"),
      source: "sns-primary",
      explanation: error instanceof Error ? error.message : "SNS primary lookup failed."
    });
  }

  if (primaryDomain) {
    await pushVerifiedRecordEvidence(connection, primaryDomain, SnsRecord.SOL, "SOL record V2", evidence, 22);
    await pushVerifiedRecordEvidence(connection, primaryDomain, SnsRecord.Url, "URL record V2", evidence, 12);
  }

  try {
    const [handle] = await getHandleAndRegistryKey(connection, wallet);
    xHandle = handle ?? undefined;
    evidence.push({
      ...evidenceBase("sns-x", "X handle", handle ? `@${handle}` : "None"),
      source: "sns-x",
      verified: Boolean(handle),
      fresh: Boolean(handle),
      rightOfAssociation: Boolean(handle),
      points: handle ? 18 : 0,
      explanation: handle
        ? "SNS direct X handle lookup returned a handle. Reverse lookup can be used for stricter production checks."
        : "No SNS X handle was found for this wallet."
    });
  } catch (error) {
    evidence.push({
      ...evidenceBase("sns-x-error", "X handle", "Unavailable"),
      source: "sns-x",
      explanation: error instanceof Error ? error.message : "SNS X handle lookup failed."
    });
  }

  return {
    wallet: wallet.toBase58(),
    primaryDomain,
    domainAddress,
    xHandle,
    subdomains: [],
    records: evidence.filter((item) => item.source === "sns-record-v2"),
    evidence,
    lastResolvedAt: new Date().toISOString()
  };
}

async function pushVerifiedRecordEvidence(
  connection: Connection,
  domain: string,
  record: SnsRecord,
  label: string,
  evidence: EvidenceItem[],
  points: number
) {
  const id = `sns-record-${String(record).toLowerCase()}`;
  try {
    const retrieved = await getRecordV2(connection, domain, record, { deserialize: true });
    const fresh = await verifyStaleness(connection, record, domain);
    const guardian = GUARDIANS.get(record);
    const content = retrieved.retrievedRecord.getContent();
    const verifier = guardian ? guardian.toBuffer() : content;
    const roa = verifier ? await verifyRightOfAssociation(connection, record, domain, verifier) : false;

    evidence.push({
      ...evidenceBase(id, label, retrieved.deserializedContent ?? content.toString("utf8") ?? "Set"),
      source: "sns-record-v2",
      verified: fresh && roa,
      fresh,
      rightOfAssociation: roa,
      points: fresh && roa ? points : 0,
      explanation:
        fresh && roa
          ? `${label} passed SNS Records V2 staleness and right-of-association checks.`
          : `${label} did not pass both required SNS Records V2 checks.`
    });
  } catch (error) {
    evidence.push({
      ...evidenceBase(id, label, "Missing"),
      source: "sns-record-v2",
      explanation: error instanceof Error ? error.message : `${label} lookup failed.`
    });
  }
}
