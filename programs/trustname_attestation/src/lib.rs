use anchor_lang::prelude::*;

declare_id!("Fd1e9ECkDJrGyqzpWV2nLM8xBghiDA8PCVWdJD7Fybag");

#[program]
pub mod trustname_attestation {
    use super::*;

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        slug: String,
        ruleset_hash: [u8; 32],
        auto_approve_score: u16,
    ) -> Result<()> {
        require!(slug.len() <= Campaign::MAX_SLUG_LEN, TrustNameError::SlugTooLong);
        require!(auto_approve_score <= 100, TrustNameError::InvalidScore);

        let campaign = &mut ctx.accounts.campaign;
        campaign.issuer = ctx.accounts.issuer.key();
        campaign.slug = slug;
        campaign.ruleset_hash = ruleset_hash;
        campaign.auto_approve_score = auto_approve_score;
        campaign.created_at = Clock::get()?.unix_timestamp;
        campaign.bump = ctx.bumps.campaign;
        Ok(())
    }

    pub fn issue_attestation(
        ctx: Context<IssueAttestation>,
        score: u16,
        ruleset_hash: [u8; 32],
        evidence_hash: [u8; 32],
    ) -> Result<()> {
        require!(score <= 100, TrustNameError::InvalidScore);
        require_keys_eq!(
            ctx.accounts.campaign.issuer,
            ctx.accounts.issuer.key(),
            TrustNameError::UnauthorizedIssuer
        );
        require!(
            ctx.accounts.campaign.ruleset_hash == ruleset_hash,
            TrustNameError::RulesetMismatch
        );

        let attestation = &mut ctx.accounts.attestation;
        attestation.campaign = ctx.accounts.campaign.key();
        attestation.subject = ctx.accounts.subject.key();
        attestation.issuer = ctx.accounts.issuer.key();
        attestation.score = score;
        attestation.ruleset_hash = ruleset_hash;
        attestation.evidence_hash = evidence_hash;
        attestation.issued_at = Clock::get()?.unix_timestamp;
        attestation.bump = ctx.bumps.attestation;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(slug: String)]
pub struct CreateCampaign<'info> {
    #[account(mut)]
    pub issuer: Signer<'info>,
    #[account(
        init,
        payer = issuer,
        space = 8 + Campaign::INIT_SPACE,
        seeds = [b"campaign", issuer.key().as_ref(), slug.as_bytes()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IssueAttestation<'info> {
    #[account(mut)]
    pub issuer: Signer<'info>,
    pub subject: SystemAccount<'info>,
    #[account(
        seeds = [b"campaign", campaign.issuer.as_ref(), campaign.slug.as_bytes()],
        bump = campaign.bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(
        init,
        payer = issuer,
        space = 8 + EligibilityAttestation::INIT_SPACE,
        seeds = [b"attestation", campaign.key().as_ref(), subject.key().as_ref()],
        bump
    )]
    pub attestation: Account<'info, EligibilityAttestation>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    pub issuer: Pubkey,
    #[max_len(64)]
    pub slug: String,
    pub ruleset_hash: [u8; 32],
    pub auto_approve_score: u16,
    pub created_at: i64,
    pub bump: u8,
}

impl Campaign {
    pub const MAX_SLUG_LEN: usize = 64;
}

#[account]
#[derive(InitSpace)]
pub struct EligibilityAttestation {
    pub campaign: Pubkey,
    pub subject: Pubkey,
    pub issuer: Pubkey,
    pub score: u16,
    pub ruleset_hash: [u8; 32],
    pub evidence_hash: [u8; 32],
    pub issued_at: i64,
    pub bump: u8,
}

#[error_code]
pub enum TrustNameError {
    #[msg("Campaign slug is too long")]
    SlugTooLong,
    #[msg("Score must be between 0 and 100")]
    InvalidScore,
    #[msg("Only the campaign issuer can issue attestations")]
    UnauthorizedIssuer,
    #[msg("Submitted ruleset hash does not match campaign")]
    RulesetMismatch,
}
