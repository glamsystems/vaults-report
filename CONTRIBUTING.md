# Contributing to Vaults Report

Guidelines for adding protocols and suggesting changes.

## Adding a Protocol

1. **Check scope.** Must be vault adjacent (see [TAXONOMY](TAXONOMY.md))
2. **Verify it's not listed.** Search `directory.csv` first
3. **Gather required fields:**

| Field | Required | Notes |
|-------|----------|-------|
| name | ✓ | Official protocol name |
| slug | ✓ | Lowercase, no spaces (used in URLs) |
| url | ✓ | Primary website |
| description | ✓ | 20 to 35 words, factual, no marketing language |
| category | ✓ | One of the five categories |
| sub_category | | Only if category has sub categories |
| chains | | Comma separated if multi chain |
| status | ✓ | `active`, `beta`, or `inactive` |

4. **Submit.** Open a PR or issue with the protocol details

## Writing Descriptions

- **Length:** 20 to 35 words
- **Format:** Start with protocol type, then primary function, then key differentiator
- **Tone:** Factual and neutral with no superlatives or marketing claims
- **Example:** "Solana based protocol providing programmable vaults with embedded policies for institutional asset managers to launch tokenized investment products."

## Suggesting Changes

- **Misclassification:** Open an issue explaining why a protocol belongs in a different category
- **Outdated info:** Submit a PR with updated fields and source links
- **New category:** Open a discussion as taxonomy changes require broader review

## Code of Conduct

See [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md)
