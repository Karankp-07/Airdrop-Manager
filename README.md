# Airdrop Manager

Production-style full-stack decentralized application for creating and managing token airdrop campaigns on Stellar Soroban.

## Overview

Airdrop Manager combines:

- A Soroban smart contract backend written in Rust
- A React + Freighter wallet frontend for campaign operations
- On-chain tracking of campaign and claim analytics

The platform is designed to make token distribution transparent, auditable, and resistant to double-claim abuse.

## Table of Contents

- [Live Demo](#live-demo)
- [Architecture](#architecture)
- [Key Capabilities](#key-capabilities)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Smart Contract API](#smart-contract-api)
- [Data Model](#data-model)
- [Local Development](#local-development)
- [Testing Flow](#testing-flow)
- [Deployment](#deployment)
- [Contract Details](#contract-details)
- [Frontend Preview](#frontend-preview)
- [Roadmap](#roadmap)
- [License](#license)

## Live Demo

Try the deployed frontend here:

https://airdrop-manager-nine.vercel.app/

## Architecture

### Frontend Layer

- React dashboard for campaign creation, claiming, querying, and stats
- Freighter integration for wallet connection and transaction signing
- Soroban RPC transaction lifecycle: build -> prepare -> sign -> submit -> poll

### Smart Contract Layer

- Campaign lifecycle and claim rules fully on-chain
- One-claim-per-address-per-campaign enforcement
- Global statistics ledger for total campaigns, total claims, and distributed amount

### Trust Model

- Business rules enforced by contract state, not by frontend assumptions
- Publicly verifiable campaign state and claim records on Stellar network

## Key Capabilities

- Create campaigns with fixed claim amount and supply cap
- Claim from active campaigns with signature authorization
- Manual campaign deactivation
- Auto-deactivation when supply is exhausted
- Check whether an address has already claimed
- View detailed campaign state
- View global airdrop analytics

## Tech Stack

### Smart Contract

- Rust
- Soroban SDK
- Soroban CLI

### Frontend

- React (Create React App)
- @stellar/stellar-sdk
- @stellar/freighter-api
- CSS-based responsive UI with light/dark theming

### Deployment

- Vercel or Netlify for frontend
- Soroban Testnet/Mainnet for contract deployment

## Repository Structure

```text
Airdrop-Manager/
├── contract/
│   ├── Cargo.toml
│   └── contracts/contract/src/lib.rs
├── public/
├── src/
│   ├── components/
│   │   ├── Freighter.js
│   │   ├── Soroban.js
│   │   ├── Header.js
│   │   ├── CreateCampaign.js
│   │   ├── ClaimAirdrop.js
│   │   ├── DeactivateCampaign.js
│   │   ├── ViewCampaign.js
│   │   └── ViewStats.js
│   ├── App.js
│   └── App.css
├── package.json
└── README.md
```

## Smart Contract API

### `create_campaign(env, token_amount, total_supply) -> u64`

Creates a campaign and returns `campaign_id`.

Validation:

- `token_amount > 0`
- `total_supply > 0`
- `token_amount <= total_supply`

### `claim_airdrop(env, campaign_id, claimer)`

Processes a claim for `claimer`.

Rules:

- `claimer.require_auth()` required
- Rejects duplicate claim for same campaign/address
- Rejects inactive campaign
- Rejects over-cap claims
- Auto-deactivates when campaign reaches max distribution

### `deactivate_campaign(env, campaign_id)`

Manually deactivates an active campaign.

### `view_campaign(env, campaign_id) -> Campaign`

Returns full campaign details.

### `view_stats(env) -> AirdropStats`

Returns aggregate platform stats.

### `has_claimed(env, campaign_id, claimer) -> bool`

Returns whether `claimer` has already claimed in `campaign_id`.

## Data Model

### `Campaign`

```rust
pub struct Campaign {
    pub campaign_id: u64,
    pub token_amount: u64,
    pub total_supply: u64,
    pub distributed: u64,
    pub is_active: bool,
    pub created_at: u64,
}
```

### `AirdropStats`

```rust
pub struct AirdropStats {
    pub total_campaigns: u64,
    pub total_claimed: u64,
    pub total_tokens_dist: u64,
}
```

## Local Development

### Prerequisites

- Rust toolchain + `wasm32-unknown-unknown` target
- Soroban CLI
- Node.js (18+ recommended)
- Freighter wallet extension
- Testnet funded wallet (Friendbot)

### 1) Smart Contract: Build

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
```

### 2) Frontend: Install and Run

```bash
npm install
npm start
```

The app runs locally and connects through Freighter for signing.

### 3) Frontend Contract Configuration

Set the deployed contract address in:

- `src/components/Soroban.js`

## Testing Flow

Recommended end-to-end validation sequence:

1. Connect wallet
2. Create campaign (for example: 100 token amount, 1000 total supply)
3. View campaign and confirm initial state
4. Claim from same wallet once and verify success
5. Attempt second claim from same wallet and verify rejection
6. Check `has_claimed` for the wallet
7. View global stats and verify updated counters

## Deployment

### Contract Deployment

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/airdrop_manager.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

### Frontend Deployment (Vercel / Netlify)

Build settings:

- Build command: `npm run build`
- Output directory: `build`

After deployment, share the generated HTTPS URL with users. They must use Freighter on the same network as your contract deployment.

## Contract Details

- Network: Stellar Testnet
- Contract ID: `CD763ITNHCRXXUANJDM4I4ES2KH6JLLXS2M5WZRW4C6I6RCNS2E6YJQX`

<img width="1908" height="1055" alt="Contract Details" src="https://github.com/user-attachments/assets/74bc5fbf-d989-4163-956e-9551d558a8d2" />

## Frontend Preview

<img width="1917" height="1054" alt="Airdrop Manager Frontend" src="https://github.com/user-attachments/assets/a5ee7982-9066-43e6-9878-041def34997f" />

## Roadmap

- Whitelist support (Merkle proof)
- Time-bounded campaigns
- Role-based admin controls
- Multi-token transfer integration via Stellar Asset Contract (SAC)
- Campaign metadata support (IPFS)
- Advanced analytics dashboard

## License

This project is open-source and available under the MIT License.
