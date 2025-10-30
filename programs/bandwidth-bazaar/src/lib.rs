use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("BWbazaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

#[program]
pub mod bandwidth_bazaar {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.authority = ctx.accounts.authority.key();
        global_state.total_bandwidth_gb = 0;
        global_state.total_users = 0;
        global_state.total_tokens_minted = 0;
        global_state.platform_fee_bps = 1500;
        global_state.tokens_per_gb = 1_000_000;
        global_state.usdc_per_token = 950000;
        
        msg!("BandwidthBazaar initialized!");
        Ok(())
    }

    pub fn register_user(ctx: Context<RegisterUser>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let global_state = &mut ctx.accounts.global_state;
        
        user_account.owner = ctx.accounts.user.key();
        user_account.total_bandwidth_gb = 0;
        user_account.tokens_earned = 0;
        user_account.tokens_claimed = 0;
        user_account.registration_time = Clock::get()?.unix_timestamp;
        user_account.last_contribution_time = 0;
        user_account.is_active = true;
        user_account.reputation_score = 100;
        
        global_state.total_users += 1;
        
        msg!("User {} registered successfully!", ctx.accounts.user.key());
        Ok(())
    }

    pub fn contribute_bandwidth(
        ctx: Context<ContributeBandwidth>,
        bandwidth_gb: u64,
        bandwidth_mb: u64,
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let global_state = &mut ctx.accounts.global_state;
        
        require!(user_account.is_active, ErrorCode::UserInactive);
        require!(bandwidth_gb > 0 || bandwidth_mb > 0, ErrorCode::InvalidBandwidth);
        
        let total_bandwidth_mb = (bandwidth_gb * 1024) + bandwidth_mb;
        let bandwidth_in_gb = total_bandwidth_mb as f64 / 1024.0;
        let tokens_to_mint = ((global_state.tokens_per_gb as f64) * bandwidth_in_gb) as u64;
        
        user_account.total_bandwidth_gb += total_bandwidth_mb;
        user_account.tokens_earned += tokens_to_mint;
        user_account.last_contribution_time = Clock::get()?.unix_timestamp;
        
        global_state.total_bandwidth_gb += total_bandwidth_mb;
        global_state.total_tokens_minted += tokens_to_mint;
        
        msg!(
            "User {} contributed {:.2} GB, earned {} BW tokens",
            user_account.owner,
            bandwidth_in_gb,
            tokens_to_mint
        );
        
        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>, bw_amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let global_state = &ctx.accounts.global_state;
        
        require!(user_account.is_active, ErrorCode::UserInactive);
        require!(bw_amount > 0, ErrorCode::InvalidAmount);
        
        let usdc_amount = (bw_amount as u128)
            .checked_mul(global_state.usdc_per_token as u128)
            .unwrap()
            .checked_div(1_000_000)
            .unwrap() as u64;
        
        require!(usdc_amount > 0, ErrorCode::InvalidAmount);
        user_account.tokens_claimed += bw_amount;
        
        msg!(
            "User {} claimed {} BW tokens for {} USDC",
            user_account.owner,
            bw_amount,
            usdc_amount
        );
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = GlobalState::LEN
    )]
    pub global_state: Account<'info, GlobalState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,
    #[account(
        init,
        payer = user,
        space = UserAccount::LEN,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ContributeBandwidth<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub user_account: Account<'info, UserAccount>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub global_state: Account<'info, GlobalState>,
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub user_account: Account<'info, UserAccount>,
}

#[account]
pub struct GlobalState {
    pub authority: Pubkey,
    pub total_bandwidth_gb: u64,
    pub total_users: u64,
    pub total_tokens_minted: u64,
    pub platform_fee_bps: u16,
    pub tokens_per_gb: u64,
    pub usdc_per_token: u64,
}

impl GlobalState {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 2 + 8 + 8;
}

#[account]
pub struct UserAccount {
    pub owner: Pubkey,
    pub total_bandwidth_gb: u64,
    pub tokens_earned: u64,
    pub tokens_claimed: u64,
    pub registration_time: i64,
    pub last_contribution_time: i64,
    pub is_active: bool,
    pub reputation_score: u16,
}

impl UserAccount {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 8 + 8 + 1 + 2;
}

#[error_code]
pub enum ErrorCode {
    #[msg("User account is inactive")]
    UserInactive,
    #[msg("Invalid bandwidth amount")]
    InvalidBandwidth,
    #[msg("Invalid token amount")]
    InvalidAmount,
  }
