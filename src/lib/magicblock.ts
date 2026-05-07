export interface MagicBlockPlan {
  enabled: boolean;
  mode: "disabled" | "er" | "tee";
  endpoint?: string;
  reason: string;
}

export function getMagicBlockPlan(): MagicBlockPlan {
  const teeToken = process.env.MAGICBLOCK_TEE_AUTH_TOKEN;
  const erEndpoint = process.env.MAGICBLOCK_ER_RPC_URL;

  if (teeToken) {
    return {
      enabled: true,
      mode: "tee",
      endpoint: `https://devnet-tee.magicblock.app?token=${teeToken}`,
      reason: "TEE token detected; private review data can be routed to MagicBlock PER."
    };
  }

  if (erEndpoint) {
    return {
      enabled: true,
      mode: "er",
      endpoint: erEndpoint,
      reason: "Ephemeral Rollup RPC detected; bulk claim state can use low-latency execution."
    };
  }

  return {
    enabled: false,
    mode: "disabled",
    reason: "Core SNS eligibility runs locally/devnet without paid infrastructure or MagicBlock secrets."
  };
}
