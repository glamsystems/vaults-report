# Vaults Report Taxonomy

Classification system for the DeFi vault ecosystem.

## Categories

| Category | Sub-categories | What belongs here |
|----------|---------------|-------------------|
| **Infrastructure** | Vault Platforms, Protocol-Native Vaults, Cross-Chain Platforms | Protocols that enable vault creation and operation |
| **Management & Curation** | — | Teams and firms that operate strategies inside vaults |
| **Lending & Yield** | — | Lending, borrowing, and yield optimization protocols |
| **Asset Tokenization** | Treasury Securities, Tokenization Platforms, Private Credit & Alternative Assets | Tokenized real-world and financial assets |
| **Tooling** | Security Monitoring, Key Management, Access Control | Security, custody, and access control infrastructure |

## Key Distinctions

**Infrastructure vs Management & Curation**
- Builds the vault infrastructure → Infrastructure
- Manages strategies on existing infrastructure → Management & Curation

**Vault Platforms vs Protocol-Native Vaults**
- General-purpose vault infrastructure (Enzyme, GLAM) → Vault Platforms
- Vaults built into a DEX/perps platform (Drift, Meteora) → Protocol-Native Vaults

**Infrastructure vs Lending & Yield**
- Primary product is lending with vault layer on top (Morpho, Kamino) → Lending & Yield

## Design Principles

- **Chain-agnostic:** Chain info goes in the `chains` field, not category names
- **Primary function:** Classify by what the protocol is primarily known for
- **Scope:** Only vault-adjacent protocols; generic DeFi tooling is out of scope
