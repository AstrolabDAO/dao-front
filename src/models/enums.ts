// web2 generic enums
export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  FATAL = 'fatal',
}

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  HEAD = 'HEAD',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  UPDATE = PATCH,
  OPTIONS = 'OPTIONS',
}

export enum ContentType {
  JSON = 'application/json',
  XML = 'application/xml',
  HTML = 'text/html',
  CSV = 'text/csv',
  BYTES = 'application/octet-stream',
  ZIP = 'application/zip',
  TEXT = 'text/plain',
  PROTO = BYTES,
}

export const MIME_TYPE_BY_EXTENSION: {[key: string]: ContentType} = {
  json: ContentType.JSON,
  xml: ContentType.XML,
  html: ContentType.HTML,
  csv: ContentType.CSV,
  zip: ContentType.ZIP,
  txt: ContentType.TEXT,
  proto: ContentType.PROTO,
}

export enum ResponseType {
  JSON = 'json',
  HTML = 'document',
  XML = 'document',
  BYTES = 'arraybuffer', // or blob >> arraybuffer = js
  TEXT = 'text',
  PROTO = BYTES,
}

export enum ResponseStatus {
  NONE = 0,
  INFO = 1,
  SUCCESS = 2,
  REDIRECT = 3,
  CLIENT_ERROR = 4,
  SERVER_ERROR = 5,
}

export enum TokenBearing {
  NONE = 0,
  HEADER = 1,
  QUERY = 2,
  BODY = 3,
}

// TODO v2: review exhaustive list + compatibility with all web3 providers
export enum RpcMethod {
  // Context methods
  GET_WEB3_CLIENTVERSION = 'web3_clientVersion',
  GET_WEB3_SHA3 = 'web3_sha3',
  GET_NET_VERSION = 'net_version',
  GET_NET_PEERCOUNT = 'net_peerCount',
  GET_NET_LISTENING = 'net_listening',
  GET_ETH_PROTOCOLVERSION = 'eth_protocolVersion',
  GET_ETH_SYNCING = 'eth_syncing',
  GET_ETH_MINING = 'eth_mining',
  GET_ETH_HASHRATE = 'eth_hashrate',
  GET_GAS_PRICE = 'eth_gasPrice',
  GET_FEE_HISTORY = 'eth_feeHistory',
  GET_MAX_PRIORITY_FEE = 'eth_maxPriorityFeePerGas',
  ESTIMATE_GAS = 'eth_estimateGas',
  GET_BLOCK_NUMBER = 'eth_blockNumber',
  GET_BLOCK_BY_NUMBER = 'eth_getBlockByNumber',
  GET_BLOCK_TRANSACTION_COUNT_BY_HASH = 'eth_getBlockTransactionCountByHash',
  GET_BLOCK_TRANSACTION_COUNT_BY_NUMBER = 'eth_getBlockTransactionCountByNumber',
  GET_BLOCK_BY_HASH = 'eth_getBlockByHash',
  GET_TRANSACTION_COUNT = 'eth_getTransactionCount',

  // Restricted methods
  REQUEST_ACCOUNTS = 'eth_requestAccounts',
  // Unrestricted methods
  DECRYPT = 'eth_decrypt',
  GET_PUBKEY_ENCRYPTION = 'eth_getEncryptionPublicKey',
  GET_ACCOUNTS = 'eth_accounts',
  CALL = 'eth_call',
  GET_BALANCE = 'eth_getbalance',
  SEND_TX = 'eth_sendTransaction',
  SEND_RAW_TX = 'eth_sendRawTransaction', // not on metamask ?
  SIGN = 'eth_sign',
  PERSONAL_SIGN = 'personal_sign',
  SIGN_TYPED = 'eth_signTypedData', // not on metamask ?
  SIGN_TX = 'eth_signTransaction', // not on metamask ?
  SUBSCRIBE = 'eth_subscribe',
  UNSUBSCRIBE = 'eth_unsubscribe',
  CREATE_ACCESS_LIST = 'eth_createAccessList',

  // misc
  PING = 'ping',

  // wallet methods
  GET_PERMISSION = 'wallet_getPermissions',
  REQUEST_PERMISSION = 'wallet_requestPermissions',
  ADD_NETWORK = 'wallet_addEthereumChain',
  SWITCH_NETWORK = 'wallet_switchEthereumChain',
  REGISTER_ONBOARDING = 'wallet_registerOnboarding',
  WATCH_ASSET = 'wallet_watchAsset',
  // Mobile Specific RPC Methods
  SCAN_QR_CODE = 'wallet_scanQRCode',
}

export enum ReqError {
  // EIP 1193 >> user rejection
  REJECTED_BY_USER = 4001,
  UNAUTHORIZED_BY_USER = 4100,
  METHOD_NOT_SUPPORTED_BY_PROVIDER = 4200,
  PROVIDER_DISCONNECTED = 4900, // disconnected from all networks
  PROVIDER_DISCONNECTED_FROM_NETWORK = 4901, // from single network
  NETWORK_UNKNOWN_BY_PROVIDER = 4902, // from single network
  // JSON RPC 2.0 >> protocol rejection
  INVALID_PAYLOAD = -32700,
  INVALID_REQUEST = -32600,
  INVALID_METHOD = -32601,
  INVALID_PARAMETER = -32602,
  INTERNAL_ERROR = -32603,
  // EIP 1474 >> blockchain rejection
  INVALID_INPUT = -32000,
  RESOURCE_NOT_FOUND = -32001,
  RESOURCE_UNAVAILABLE = -32002,
  TRANSACTION_REJECTED = -32003,
  METHOD_NOT_SUPPORTED = -32004,
  LIMIT_EXCEEDED = -32005,
}

export enum ActivityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  IN_PROGRESS = 'in progress',
  // job/pipeline status
  SUCCESS = 'success',
  FAILURE = 'failure',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum NetworkStatus {
  UP_CLEAR = 'up',
  UP_CONGESTED = 'congested',
  DOWN = 'down',
}

export enum SchedulingType {
  CRON = 'cron',
  INTERVAL = 'interval',
  DATE = 'date',
}

export type Resource = "updatable" | "brand" | "protocol" | "network" | "token" | "audit" | "user";

export enum ProtocolType {
  // infra
  INFRA = "infrastructure",
  ORACLE = "oracle",
  PRIVACY = "privacy",
  BRIDGE = "bridge",
  BRIDGE_AGGREGATOR = "bridge_aggregator",

  // financing
  LAUNCHPAD = "launchpad",

  // rwa
  RWA = "real_world_assets",
  CORPORATE_DEBT = "corporate_debt",
  GOV_DEBT = "government_debt",
  REAL_ESTATE = "real_estate",

  // lending (money markets)
  LENDING = "lending",
  BORROWING = "borrowing",

  // market making
  AMM = "automated_market_making", // LP+AMM

  // staking/restaking/hyperstaking
  STAKING = "staking", // staking/liquid staking

  // LSD = "liquid_staking",
  RESTAKING = "restaking", // restaking (eg. eigenlayer)
  HYPERSTAKING = "hyperstaking", // leveraged staking

  // trading
  LEVERAGING = "leveraging",
  SPOT_EXCHANGE = "spot_exchange",
  DERIVATIVES_EXCHANGE = "derivatives_exchange",
  TRADING = "trading",
  SPOT_TRADING = "spot_trading",
  DERIVATIVES_TRADING = "derivatives_trading",

  // structured finance
  STABLECOIN_ISSUER = "stablecoin_issuer",
  DERIVATIVES_ISSUER = "derivatives_issuer",
  DEFI_AGGREGATOR = "defi_aggregator",
  YIELD_OPTIMIZER = "yield_optimizer",
  YIELD_AGGREGATOR = "yield_aggregator",
  STRUCTURED_FINANCE = "structured_finance",
  LIQUIDITY_AGGREGATOR = "liquidity_aggregator",
  LIQUIDITY_INCENTIVIZATION = "liquidity_incentivization",
  COVERAGE = "coverage",
  MULTI = "multi",
}

export enum AggregationLevel {
  MULTI_ASSET = 0, // eg. all of AAVE's stable pool (as.AMS)
  MULTI_STRATEGY = 1, // eg. all of Optimism's lvl 0 stable strategies (as.OPMS)
  CROSS_CHAIN = 2, // eg. all network lvl 1 multistrategy vaults (as.USDC)
}

export const PROTOCOL_TYPES = Object.keys(ProtocolType).map(p => ProtocolType[p as keyof typeof ProtocolType]);

export const PROTOCOL_ACTIONS_BY_TYPE: { [key: string]: string[] } = {
  [ProtocolType.LENDING]: ["Lend on", "Track utilization on"],
  [ProtocolType.BORROWING]: ["Borrow on", "Lever up on", "Monitor margins on", "Arb rates on"],
  [ProtocolType.GOV_DEBT]: ["Earn from treasury bonds on", "Farm govies on"],
  [ProtocolType.CORPORATE_DEBT]: ["Earn from IG corporate debt on", "Earn from HY corporate debt on"],
  [ProtocolType.REAL_ESTATE]: ["Earn from real estate loans on"],
  [ProtocolType.BRIDGE]: ["Bridge with"],
  [ProtocolType.AMM]: ["Provide liquidity to", "Market make on", "Manage LPs on"],
  [ProtocolType.COVERAGE]: ["Get insured on"],
  [ProtocolType.DERIVATIVES_EXCHANGE]: ["Trade on", "Hedge risk on", "Monitor margins on", "Provide liquidity to", "Arb funding rates on"],
  [ProtocolType.DERIVATIVES_ISSUER]: ["Trade on"],
  [ProtocolType.DERIVATIVES_TRADING]: ["Earn on"],
  [ProtocolType.INFRA]: ["Make use of", "Contribute to", "Aggregate data from"],
  [ProtocolType.LIQUIDITY_AGGREGATOR]: ["Swap on", "Trade on"],
  [ProtocolType.ORACLE]: ["Make use of", "Pull data from", "Aggregate data from", "Provide data to"],
  [ProtocolType.RWA]: ["Earn on"],
  [ProtocolType.TRADING]: ["Trade on"],
  [ProtocolType.SPOT_EXCHANGE]: ["Trade on", "Swap on", "Provide liquidity to"],
  [ProtocolType.SPOT_TRADING]: ["Earn on"],
  [ProtocolType.STABLECOIN_ISSUER]: ["Mint on"],
  [ProtocolType.STAKING]: ["Stake on", "Earn on"],
  [ProtocolType.RESTAKING]: ["Re-stake on", "Stake on"],
  [ProtocolType.HYPERSTAKING]: ["Hyper-stake on", "Stake on"],
  [ProtocolType.STRUCTURED_FINANCE]: ["Earn on"],
};

export const PROTOCOL_SHOWCASE_TYPES = Object.keys(PROTOCOL_ACTIONS_BY_TYPE) as ProtocolType[];

export const PROTOCOL_NAMES_BY_TYPE: { [key: string]: string[] } = {
  [ProtocolType.BORROWING]: ["Money Markets", "Borrowing", "Leveraging"],
  [ProtocolType.BRIDGE]: ["Bridges"],
  [ProtocolType.AMM]: ["AMMs", "Market Making"],
  [ProtocolType.COVERAGE]: ["Insurance", "Coverage"],
  [ProtocolType.DERIVATIVES_EXCHANGE]: ["Derivatives", "Futures", "Options"],
  [ProtocolType.DERIVATIVES_ISSUER]: ["Derivatives Issuers"],
  [ProtocolType.DERIVATIVES_TRADING]: ["Derivatives Trading"],
  [ProtocolType.INFRA]: ["Infra"],
  [ProtocolType.LENDING]: ["Money Markets", "Lending"],
  [ProtocolType.LIQUIDITY_AGGREGATOR]: ["Liquidity Aggregators"],
  [ProtocolType.ORACLE]: ["Oracles", "Data Providers"],
  [ProtocolType.RWA]: ["RWA", "Real World Assets"],
  [ProtocolType.SPOT_EXCHANGE]: ["DEXs", "Spot Exchanges"],
  [ProtocolType.TRADING]: ["Trading"],
  [ProtocolType.SPOT_TRADING]: ["Spot Trading"],
  [ProtocolType.STABLECOIN_ISSUER]: ["Stable Issuers"],
  [ProtocolType.STAKING]: ["Staking", "ReStaking"],
  [ProtocolType.RESTAKING]: ["Staking", "ReStaking"],
  [ProtocolType.HYPERSTAKING]: ["Staking", "ReStaking"],
  [ProtocolType.STRUCTURED_FINANCE]: ["Structured Finance"],
};

export const STRATEGY_TYPES: ProtocolType[] = [
  ProtocolType.AMM, // LP+AMM
  ProtocolType.LENDING, // money markets
  ProtocolType.TRADING, // spot/derivatives
  ProtocolType.RWA, // corp/gov/p2p debt/real estate
  ProtocolType.STAKING, // staking/restaking/hyperstaking
  ProtocolType.STRUCTURED_FINANCE, // multi
  ProtocolType.MULTI,
];

export enum WalletProviderType {
  INJECTED = 'injected',
  EXTERNAL = 'external',
  HYBRID = 'hybrid',
}
