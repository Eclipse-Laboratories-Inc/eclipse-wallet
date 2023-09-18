/*
 * SLIP-0044 : Registered coin types for BIP-0044 (SatoshiLabs Improvement Proposals)
 * BIP-0044 defines a logical hierarchy for deterministic wallets. Level 2 of the hierarchy describes a coin type in use.
 *
 * See https://github.com/satoshilabs/slips/blob/master/slip-0044.md
 */

const BTC = 0;
const TESTNET = 1;
const ETH = 60;
const NEAR = 397;
const SOL = 501;

module.exports = { BTC, TESTNET, ETH, NEAR, SOL };
