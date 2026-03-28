#![allow(non_snake_case)]
#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, log, Env, Symbol, Address, symbol_short, Vec};

// Tracks overall airdrop statistics across the platform
#[contracttype]
#[derive(Clone)]
pub struct AirdropStats {
    pub total_campaigns: u64,   // Total number of airdrop campaigns created
    pub total_claimed: u64,     // Total number of individual claims processed
    pub total_tokens_dist: u64, // Total tokens distributed across all campaigns
}

// Symbol key for global stats
const ALL_STATS: Symbol = symbol_short!("ALL_STATS");

// Unique counter for campaign IDs
const CAMP_COUNT: Symbol = symbol_short!("C_CAMP");

// Maps campaign_id -> Campaign struct
#[contracttype]
pub enum CampaignBook {
    Campaign(u64),
}

// Maps (campaign_id, claimer_address) -> bool (has claimed)
#[contracttype]
pub enum ClaimBook {
    Claim(u64, Address),
}

// Represents an airdrop campaign
#[contracttype]
#[derive(Clone)]
pub struct Campaign {
    pub campaign_id: u64,       // Unique identifier for the campaign
    pub token_amount: u64,      // Tokens each eligible address can claim
    pub total_supply: u64,      // Maximum tokens available for this campaign
    pub distributed: u64,       // Tokens distributed so far
    pub is_active: bool,        // Whether the campaign is still accepting claims
    pub created_at: u64,        // Ledger timestamp when campaign was created
}

#[contract]
pub struct AirdropManagerContract;

#[contractimpl]
impl AirdropManagerContract {

    /// Creates a new airdrop campaign. Returns the new campaign_id.
    /// Admin calls this to set up a campaign with a fixed token_amount per claim
    /// and a total_supply cap.
    pub fn create_campaign(env: Env, token_amount: u64, total_supply: u64) -> u64 {
        // Validate inputs
        if token_amount == 0 || total_supply == 0 {
            log!(&env, "token_amount and total_supply must be greater than zero");
            panic!("token_amount and total_supply must be greater than zero");
        }
        if token_amount > total_supply {
            log!(&env, "token_amount cannot exceed total_supply");
            panic!("token_amount cannot exceed total_supply");
        }

        let mut camp_count: u64 = env.storage().instance().get(&CAMP_COUNT).unwrap_or(0);
        camp_count += 1;

        let time = env.ledger().timestamp();

        let campaign = Campaign {
            campaign_id: camp_count,
            token_amount,
            total_supply,
            distributed: 0,
            is_active: true,
            created_at: time,
        };

        // Update global stats
        let mut stats = Self::view_stats(env.clone());
        stats.total_campaigns += 1;

        env.storage().instance().set(&CampaignBook::Campaign(camp_count), &campaign);
        env.storage().instance().set(&ALL_STATS, &stats);
        env.storage().instance().set(&CAMP_COUNT, &camp_count);
        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "Campaign created with ID: {}", camp_count);
        camp_count
    }

    /// Allows an eligible address to claim tokens from an active campaign.
    /// Each address can only claim once per campaign.
    pub fn claim_airdrop(env: Env, campaign_id: u64, claimer: Address) {
        // Require the claimer to authorize this transaction
        claimer.require_auth();

        let claim_key = ClaimBook::Claim(campaign_id, claimer.clone());

        // Check if already claimed
        let already_claimed: bool = env.storage().instance().get(&claim_key).unwrap_or(false);
        if already_claimed {
            log!(&env, "Address has already claimed from campaign: {}", campaign_id);
            panic!("Already claimed from this campaign");
        }

        // Load campaign
        let mut campaign = Self::view_campaign(env.clone(), campaign_id);

        if !campaign.is_active {
            log!(&env, "Campaign {} is not active", campaign_id);
            panic!("Campaign is not active");
        }

        // Check sufficient supply remaining
        if campaign.distributed + campaign.token_amount > campaign.total_supply {
            log!(&env, "Campaign {} has insufficient supply remaining", campaign_id);
            panic!("Insufficient campaign supply");
        }

        // Record the claim
        campaign.distributed += campaign.token_amount;

        // Auto-deactivate campaign when fully distributed
        if campaign.distributed >= campaign.total_supply {
            campaign.is_active = false;
            log!(&env, "Campaign {} fully distributed and deactivated", campaign_id);
        }

        // Update global stats
        let mut stats = Self::view_stats(env.clone());
        stats.total_claimed += 1;
        stats.total_tokens_dist += campaign.token_amount;

        // Persist changes
        env.storage().instance().set(&claim_key, &true);
        env.storage().instance().set(&CampaignBook::Campaign(campaign_id), &campaign);
        env.storage().instance().set(&ALL_STATS, &stats);
        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "Airdrop claimed by address from campaign: {}", campaign_id);
    }

    /// Admin can deactivate a campaign to stop further claims.
    pub fn deactivate_campaign(env: Env, campaign_id: u64) {
        let mut campaign = Self::view_campaign(env.clone(), campaign_id);

        if !campaign.is_active {
            log!(&env, "Campaign {} is already inactive", campaign_id);
            panic!("Campaign is already inactive");
        }

        campaign.is_active = false;

        env.storage().instance().set(&CampaignBook::Campaign(campaign_id), &campaign);
        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "Campaign {} has been deactivated", campaign_id);
    }

    /// Returns the details of a specific campaign by its ID.
    pub fn view_campaign(env: Env, campaign_id: u64) -> Campaign {
        env.storage()
            .instance()
            .get(&CampaignBook::Campaign(campaign_id))
            .unwrap_or(Campaign {
                campaign_id: 0,
                token_amount: 0,
                total_supply: 0,
                distributed: 0,
                is_active: false,
                created_at: 0,
            })
    }

    /// Returns global airdrop platform statistics.
    pub fn view_stats(env: Env) -> AirdropStats {
        env.storage().instance().get(&ALL_STATS).unwrap_or(AirdropStats {
            total_campaigns: 0,
            total_claimed: 0,
            total_tokens_dist: 0,
        })
    }

    /// Checks if a specific address has already claimed from a given campaign.
    pub fn has_claimed(env: Env, campaign_id: u64, claimer: Address) -> bool {
        let claim_key = ClaimBook::Claim(campaign_id, claimer);
        env.storage().instance().get(&claim_key).unwrap_or(false)
    }
}