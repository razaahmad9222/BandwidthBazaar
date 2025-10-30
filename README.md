# BandwidthBazaar

BandwidthBazaar is a bootstrap monorepo for a Global DePIN platform that lets users monetize idle bandwidth by contributing to decentralized AI training and web services. This repo contains a Vite + React frontend, an Anchor-based Solana program, test harnesses, and deployment scripts to help you get started quickly.

## Repository layout

- app/ — Frontend (Vite + React + Tailwind)
  - src/ — React source files (App.jsx, main.jsx, index.css)
  - package.json, vite.config.js, tailwind.config.js, postcss.config.js
- programs/bandwidth-bazaar/ — Anchor Solana program (Rust)
  - src/lib.rs, Cargo.toml
- tests/ — Anchor + mocha/ts tests for the Solana program
- migrations/ — deployment scaffolding and scripts
- Anchor.toml — Anchor configuration
- .gitignore

## Quick start (developer machine)

Prerequisites
- Node.js (>=18 recommended) and npm or pnpm
- Rust toolchain (rustup, cargo)
- Anchor CLI (install via npm or cargo; see Anchor docs)
- Solana CLI (for local validator / devnet)
- Git, GitHub CLI (optional, helpful for PRs)

Frontend: run locally
1. Install deps:
   cd app
   npm ci
2. Start dev server:
   npm run dev
3. Build for production:
   npm run build
   npm run preview

Solana program: build & test
1. Install Rust target and tools if not already:
   rustup update
   rustup toolchain install stable
2. Install Anchor CLI (if you haven't):
   npm i -g @coral-xyz/anchor-cli
3. Start a local validator (optional) or use devnet:
   solana-test-validator
4. Build the program:
   anchor build
5. Run tests:
   anchor test

Notes:
- Anchor.toml currently targets `devnet` and references a wallet at `~/.config/solana/id.json`. Update that path or document a local dev key in your onboarding docs.
- The frontend currently simulates wallet connection and contribution flows for demo. Integrate a real Solana wallet adapter (Phantom / solana-wallet-adapter) in a follow-up.

## CI (GitHub Actions)
This repo includes a CI workflow that:
- Installs Node, caches dependencies, builds and tests the frontend
- Installs Rust/Anchor toolchain, builds the Solana program, and runs Anchor tests using a local Solana test validator

See `.github/workflows/ci.yml` for the exact configuration.

## Security and release checklist (recommended next steps)
- Add a LICENSE file (MIT / Apache-2.0 etc.)
- Add CODEOWNERS (if necessary) and configure branch protections
- Add a CONTRIBUTING.md with local setup, how to run tests, and coding standards
- Add secrets to GitHub Actions (if deploying or running private steps)
- Add CI steps to run linters, formatters, and security checks
- Replace simulated frontend wallet with a proper wallet adapter, and implement secure on-chain flows for minting and USDC transfers
- Run security audit for the Anchor program before deploying to mainnet

## Contributing
1. Fork the repo and create a branch for your feature
2. Run tests locally and ensure builds pass
3. Open a PR against `main` with a descriptive title and the checklist from the PR template

## Contact / Maintainers
- Repo owner: @razaahmad9222

Thank you for contributing to BandwidthBazaar — let’s build the decentralized bandwidth economy!