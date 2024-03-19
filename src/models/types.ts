import { ResCode } from "../utils/http-responses";
import { ContentType, HTTPMethod, ResponseType, TokenBearing } from "./enums";

export interface ISlugged {
  slug?: string;
  name?: string;
}

export type Route = {
  title: string,
  component?: () => Promise<{ default: any }>,
  props?: Record<string, any>
}

export type NavRoute = {
  title: string,
  path?: string,
  icon?: string,
  children?: NavRoute[]
}

export interface ILottie {
  src?: string|any|ArrayBuffer;
  container?: HTMLElement;
  renderer?: 'svg' | 'canvas' | 'html';
  rendererSettings?: any;
  width?: number;
  height?: number;
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
  play?(): void;
  pause?(): void;
  stop?(): void;
}


export interface IHttpMessage {
  uri?: string,
  method?: HTTPMethod,
  headers?: {[key: string]: any},
  status?: ResCode,
  body?: string|any,
  queryParams?: {[key: string]: any},
  ping?: number, // ms
  date?: number
}

export interface IHttpRequest {
  url: string; // request endpoint
  method?: HTTPMethod,
  contentType?: ContentType;
  headers?: { [key: string]: any }; // map of headers
  tokenBearing?: TokenBearing;
  token?: string;
  queryString?: string; // querystring already put together
  queryParameters?: { [key: string]: any }; // query parameters as keys & values
  body?: any;
  responseType?: ResponseType; // XMLHttpRequestResponseType;
  async?: boolean;
  onprogress?: (payload: IHttpMessage|ProgressEvent) => any;
  onload?: (payload: IHttpMessage|ProgressEvent) => any;
  onredirect?: (payload: IHttpMessage|ProgressEvent) => any;
  oninformation?: (payload: IHttpMessage|ProgressEvent) => any;
  onsuccess?: (payload: IHttpMessage|ProgressEvent) => any;
  onerror?: (payload: IHttpMessage|ProgressEvent) => any;
}

export interface IBlockInfo {
  extraData: string;
  baseFeePerGas?: number;
  gasLimit: number;
  gasUsed: number;
  hash: string;
  logsBloom?: string;
  miner: string;
  nonce: string;
  number: number;
  parentHash: string;
  receiptRoot?: string;
  sha3Uncles?: string;
  size?: number;
  stateRoot?: string;
  timestamp: number;
  difficulty: number;
  totalDifficulty?: number;
  transactions: string[];
  transactionsRoot?: string;
  uncles?: string[];
}

export interface IGasHistoryResponse {
  oldestBlock: number;
  reward: number[][];
  baseFeePerGas: string[];
  gasUsedRatio: number[];
}

export interface IGasHistoryFormatted {
  number: number;
  baseFeePerGas: number;
  gasUsedRatio: number;
  priorityFeePerGas: number[];
}

export interface IDescriptionSlide {
  title?: string;
  icon?: string;
  body: string;
  links?: NavRoute[];
}


export namespace Req {
  export interface INetworkCurrency {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number; // 18 by default
  }

  export interface INetwork {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency: INetworkCurrency;
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[]; // Currently ignored.
  }

  export interface IWatchAsset {
    type: 'ERC20'; // In the future, other standards will be supported
    options: {
      address: string; // The address of the token contract
      symbol: string; // A ticker symbol or shorthand, up to 5 characters
      decimals: number; // The number of token decimals
      image: string; // A string url of the token logo
    };
  }
}
