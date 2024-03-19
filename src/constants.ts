import { transposeObject } from "./utils/reflexion";

export const dbConfig = {
  version: 1, // prseInt(process.env.npm_package_version!.split('.')[0]),
  name: "astrolab",
  stores: [
    { name: "svg", keyPath: "id" },
    { name: "lottie", keyPath: "id" },
    { name: "img", keyPath: "id" },
    { name: "video", keyPath: "id" },
    { name: "endpoint", keyPath: "id" },
    { name: "md", keyPath: "slug" },
    { name: "brands", keyPath: "slug" },
    { name: "networks", keyPath: "slug", indexes: [{ key: "value.id", unique: true }] },
    { name: "protocols", keyPath: "slug" },
    { name: "tokens", keyPath: "slug", indexes: [{ key: "value.symbol", unique: false }] },
  ]
};

export const apis: { [key: string]: string } = {
  astrolab: process.env.API_ROOT ?? 'https://api.astrolab.fi/v1/',
  coinGecko: 'https://api.coingecko.com/api/v3/',
  coinMarketCap: 'https://pro-api.coinmarketcap.com/v1/',
  deDotFi: 'https://api-scanner.defiyield.app/',
  defiSafety: 'https://api.defisafety.com/',
  exponential: 'https://api.exponential.fi/',
  defiLlama: 'https://api.llama.fi/',
  defiLlamaYield: 'https://yields.llama.fi/',
  defiLlamaToken: 'https://coins.llama.fi/',
  chainlink: 'https://data.chain.link/api/',
  _1inch: 'https://api.1inch.dev/swap/v5.2/',
  debank: 'https://pro-openapi.debank.com/v1/',
  cointool: 'https://cointool.glitch.me/',
}
export const addressZero = '0x0000000000000000000000000000000000000000';
export const mockIcon = "/svgs/mask.svg";
export const theme = {
  fg: ['#fbf8f4', "#ececec", "#c8c8c8"],
  bg: ['#061834', "#091747", "#071765"],
  primary: '#477bff',
  secondary: '#afcaff',
  signature: '#1543D8',
  error: '#ff4242',
  success: '#00cc7a',
};
export const l2s: string[] = ["arbitrum", "optimism", "linea", "mantle", "scroll", "zksync", "zkevm", "metis", "loopring"];

// NB: default rpcs are defined in endpoints.json (first one is used for each)
export const unwraps: { [symbol: string]: string } = {
  weth: 'eth',
  wmatic: 'matic',
  warb: 'arb',
  wop: 'op',
  wftm: 'ftm',
  wbnb: 'bnb',
  wavax: 'avax',
  wmovr: 'movr',
  wglmr: 'glmr',
  wkava: 'kava',
  wcanto: 'canto',
  wsol: 'sol',
  wsui: 'sui',
  wapt: 'apt',
  wbtc: 'btc',
  wbch: 'bch',
  wltc: 'ltc',
  wcro: 'cro',
  wcelo: 'celo',
  wrose: 'rose',
};
export const wraps = transposeObject(unwraps);
