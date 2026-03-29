# Airdrop Manager

A decentralized smart contract built on the **Stellar blockchain** using the **Soroban SDK**, designed to manage token airdrop campaigns in a transparent, tamper-proof, and efficient manner.

---

## Table of Contents

- [Project Title](#airdrop-manager)
- [Project Description](#project-description)
- [Project Vision](#project-vision)
- [Key Features](#key-features)
- [Contract Functions](#contract-functions)
- [Data Structures](#data-structures)
- [Future Scope](#future-scope)

---

## Project Description

**Airdrop Manager** is a Soroban-based smart contract that enables project administrators to create and manage token airdrop campaigns on the Stellar network. Each campaign defines a fixed token reward per eligible address and a total supply cap. Users can claim their allocation from any active campaign — with on-chain guarantees preventing double-claiming.

The contract maintains a global statistics ledger, tracking total campaigns created, total individual claims processed, and total tokens distributed — giving both admins and community members full transparency into distribution activity.

---

## Project Vision

Token airdrops are a powerful mechanism for community bootstrapping, reward distribution, and decentralized governance participation — but they are often plagued by opaque off-chain processes, double-claim vulnerabilities, and no auditability.

**Airdrop Manager** aims to bring trust and transparency to the airdrop lifecycle by:

- Moving the entire claim and campaign lifecycle **on-chain**
- Ensuring **one claim per address per campaign** via contract-enforced rules
- Providing **real-time, publicly verifiable** distribution statistics
- Giving admins granular control over campaign activation and deactivation
- Laying the groundwork for **fully permissionless, community-driven** airdrop infrastructure

---

## Key Features

| Feature | Description |
|---|---|
| **Campaign Creation** | Admins can launch airdrop campaigns with a defined per-claim token amount and total supply cap |
| **Claim Enforcement** | Each wallet address can claim from a campaign exactly once — double-claims are rejected on-chain |
| **Auto-Deactivation** | Campaigns automatically deactivate when fully distributed, preventing over-distribution |
| **Admin Control** | Admins can manually deactivate any active campaign at any time |
| **Global Statistics** | Platform-wide stats track total campaigns, claims, and tokens distributed |
| **Claim Verification** | Anyone can query whether a specific address has claimed from a given campaign |
| **Authorization** | Claimer address authorization is enforced using Soroban's `require_auth()` |

---

## Contract Functions

### `create_campaign(env, token_amount, total_supply) -> u64`
Creates a new airdrop campaign. Returns the unique `campaign_id`.

- `token_amount`: Number of tokens each eligible address receives per claim
- `total_supply`: Maximum total tokens available for the campaign
- Validates that `token_amount > 0`, `total_supply > 0`, and `token_amount <= total_supply`

---

### `claim_airdrop(env, campaign_id, claimer)`
Allows a user to claim tokens from an active campaign.

- Requires `claimer` authorization via `require_auth()`
- Rejects if the address has already claimed from this campaign
- Rejects if the campaign is inactive or supply is exhausted
- Auto-deactivates the campaign when fully distributed

---

### `deactivate_campaign(env, campaign_id)`
Admin function to manually stop an active campaign from accepting further claims.

- Panics if the campaign is already inactive

---

### `view_campaign(env, campaign_id) -> Campaign`
Returns the full details of a campaign by its ID. Returns a default zeroed-out struct if the campaign does not exist.

---

### `view_stats(env) -> AirdropStats`
Returns platform-wide airdrop statistics including total campaigns, total claims, and total tokens distributed.

---

### `has_claimed(env, campaign_id, claimer) -> bool`
Returns `true` if the given address has already claimed from the specified campaign, `false` otherwise.

---

## Data Structures

### `Campaign`
```rust
pub struct Campaign {
    pub campaign_id: u64,    // Unique identifier
    pub token_amount: u64,   // Tokens per claim
    pub total_supply: u64,   // Max tokens for this campaign
    pub distributed: u64,    // Tokens distributed so far
    pub is_active: bool,     // Whether claims are still accepted
    pub created_at: u64,     // Ledger timestamp of creation
}
```

### `AirdropStats`
```rust
pub struct AirdropStats {
    pub total_campaigns: u64,    // Total campaigns ever created
    pub total_claimed: u64,      // Total individual claims processed
    pub total_tokens_dist: u64,  // Total tokens distributed across all campaigns
}
```

---

## Future Scope

| Enhancement | Description |
|---|---|
| **Merkle Proof Whitelisting** | Restrict claims to a pre-approved whitelist using Merkle tree verification — only addresses included in the Merkle root can claim |
| **Time-Bounded Campaigns** | Add `start_time` and `end_time` fields to campaigns so claims are only valid within a defined window |
| **Multi-Token Support** | Integrate with the Stellar Asset Contract (SAC) to support actual token transfers upon claim, not just accounting |
| **Vesting Schedules** | Allow token claims to be released over multiple claim events rather than a single lump sum |
| **Tiered Rewards** | Support multiple reward tiers within a single campaign (e.g., early claimers get more) |
| **Role-Based Access Control** | Introduce formal admin roles with multi-sig requirements for sensitive operations like campaign creation and deactivation |
| **Campaign Metadata** | Add IPFS-linked metadata to campaigns for human-readable names, logos, and descriptions |
| **Cross-Contract Composability** | Expose claim hooks so other contracts (e.g., governance, staking) can react to airdrop claim events |

---

## Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- Stellar Testnet/Mainnet account

### Build

```bash
cargo build --target wasm32-unknown-unknown --release
```

### Deploy

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/airdrop_manager.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

### Invoke Example

```bash
# Create a campaign (1000 tokens per claim, 100000 total supply)
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <ADMIN_SECRET> \
  --network testnet \
  -- create_campaign \
  --token_amount 1000 \
  --total_supply 100000

# Claim airdrop
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <USER_SECRET> \
  --network testnet \
  -- claim_airdrop \
  --campaign_id 1 \
  --claimer <USER_ADDRESS>
```

---
## Contract Details:

Contract ID: CD763ITNHCRXXUANJDM4I4ES2KH6JLLXS2M5WZRW4C6I6RCNS2E6YJQX 
<img width="1908" height="1055" alt="image" src="https://github.com/user-attachments/assets/74bc5fbf-d989-4163-956e-9551d558a8d2" />

## Frontend Interface Preview

The screenshot below highlights the Airdrop Manager web interface, including wallet connectivity and campaign management workflows.
<img width="1917" height="1054" alt="image" src="https://github.com/user-attachments/assets/a5ee7982-9066-43e6-9878-041def34997f" />


## License

This project is open-source and available under the [MIT License](LICENSE).
