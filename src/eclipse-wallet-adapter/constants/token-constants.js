const { PublicKey } = require('@solana/web3.js');

const SOL_DECIMALS = 6;
const SOL_SYMBOL = 'SOL';
const SOL_NAME = 'Eclipse';
const SOL_LOGO = 'https://i.imgur.com/y0JEPfQ.png';
const SOL_ADDRESS = 'So11111111111111111111111111111111111111112';

const USDC_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';


const BTC_LOGO = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png';

const ETH_ADDRESS = 'eth';

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const ME_PROGRAM_ID = "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K";

module.exports = {
  SOL_DECIMALS,
  SOL_SYMBOL,
  SOL_NAME,
  SOL_LOGO,
  SOL_ADDRESS,
  TOKEN_PROGRAM_ID,
  USDC_ADDRESS,
  BTC_LOGO,
  ETH_ADDRESS,
  ME_PROGRAM_ID
};
