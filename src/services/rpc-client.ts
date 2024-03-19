import { session } from "../store";
import { ContentType, RpcMethod } from "../models/enums";
import { IHttpMessage, IHttpRequest, IBlockInfo, IGasHistoryFormatted, IGasHistoryResponse } from "../models/types";
import { HttpClient } from "./http-client";

const historicalBlocks = 10;

export interface IRpc {
  method: RpcMethod,
  endpoint?: string,
  params?: any[],
  id?: number,
  jsonrpc?: string,
  response?: any,
}

export class Rpc implements IRpc {
  method: RpcMethod;
  endpoint: string;
  params: any[];
  id: number;
  jsonrpc: string;

  constructor(o: IRpc) {
    this.method = o.method;
    this.endpoint = o.endpoint ?? session.rpcByNetwork[session.networks[0]?.slug as string] as string;
    this.params = o.params ?? [];
    this.jsonrpc = o.jsonrpc ?? "2.0";
    this.id = o.id ?? 1;
  }

  public async send(nologs=false): Promise<IHttpMessage> {

    if (!this.endpoint)
      throw new Error("No RPC endpoint provided");

    try {
      const options: IHttpRequest = {
        contentType: ContentType.JSON,
        url: this.endpoint,
        body: {
          method: this.method,
          params: this.params,
          id: this.id,
          jsonrpc: this.jsonrpc
        }
      }
      // rpc is post-only
      const res = await HttpClient.post(options);
      return res;
    } catch(e: any) {
      if (!nologs)
        console.warn(e);
      return e;
    }
  }
}

async function request(o: IRpc, nologs=false): Promise<IHttpMessage> {
  return await new Rpc(o).send(nologs);
}

// cost: 0/1
export async function ping(endpoint=session.rpcByNetwork[session.networks[0]], noLogs=false): Promise<number> {
  try {
    const res = await request({ endpoint, method: RpcMethod.PING }, noLogs);
    return res.ping as number;
  } catch(e: any) {
    // soft failure: even errors carry a ping
    return e?.ping ?? -1;
  }
}

// cost: 1
export async function getGasPrice(endpoint=session.rpcByNetwork[session.networks[0]], noLogs=false): Promise<number> {
  const res = await request({ endpoint, method: RpcMethod.GET_GAS_PRICE }, noLogs);
  return parseInt(res.body.result);
}

// cost: 2
export async function getLastBlock(endpoint=session.rpcByNetwork[session.networks[0]]): Promise<IBlockInfo> {
  const res = await request({ endpoint, method: RpcMethod.GET_BLOCK_BY_NUMBER, params: ["latest", false] });
  const block = (res as any).body.result;
  for (const prop of ["gasLimit", "gasUsed", "baseFeePerGas", "number", "nonce", "size", "timestamp", "difficulty", "totalDifficulty"])
    block[prop] = parseInt(block[prop]);
  return block as IBlockInfo;
}

// cost: 1
export async function getBlockNumber(endpoint=session.rpcByNetwork[session.networks[0]]): Promise<number> {
  const res = await request({ endpoint, method: RpcMethod.GET_BLOCK_NUMBER, params: [] });
  return parseInt((res as any).body.result);
}

export async function getBlockByNumber(endpoint=session.rpcByNetwork[session.networks[0]], hash="pending", nologs=true): Promise<number|null> {
  // true (second param) === block details (default to false)
  const res = await request({ endpoint, method: RpcMethod.GET_BLOCK_BY_NUMBER, params: [hash, true]}, nologs);
  return res.body.result?.baseFeePerGas ? parseInt((res as any).body.result.baseFeePerGas) : null;
}

// cost: 1
export async function getFeeHistory(endpoint=session.rpcByNetwork[session.networks[0]], noLogs=false): Promise<IGasHistoryFormatted[]> {
  const blockPercentiles = [1, 50, 99];
  const res = await request({ endpoint, method: RpcMethod.GET_FEE_HISTORY, params: [historicalBlocks, "pending", blockPercentiles ]}, noLogs);
  return res.body.result ? formatFeeHistory(res.body.result) : [];
}

export async function getMaxPriorityFee(endpoint=session.rpcByNetwork[session.networks[0]]): Promise<number> {
  const res = await request({ endpoint, method: RpcMethod.GET_MAX_PRIORITY_FEE, params: [] });
  return parseInt((res as any).body.result);
}

export function formatFeeHistory(result: IGasHistoryResponse): IGasHistoryFormatted[] {
  let blockNum = result.oldestBlock;
  let index = 0;
  const blocks: IGasHistoryFormatted[] = [];
  if (!result.gasUsedRatio)
    return blocks;
  while (blockNum < result.oldestBlock + historicalBlocks) {
    blocks.push({
      number: blockNum,
      baseFeePerGas: Number(result.baseFeePerGas[index]),
      gasUsedRatio: Number(result.gasUsedRatio[index]),
      priorityFeePerGas: result.reward[index].map(x => Number(x)),
    });
    blockNum += 1;
    index += 1;
  }
  return blocks;
}

export const getRpc = (o: any, idx=0): string => {
  return o.httpRpcs?.[idx] ?? o.nativeNetwork?.httpRpcs?.[idx] ?? o.rpcs?.[idx] ?? o.rpc ?? "";
}

export const RpcClient = {
  request,
  ping,
  getGasPrice,
  getBlockNumber,
  getLastBlock,
  getFeeHistory,
  getMaxPriorityFee,
  getBlockByNumber,
  getRpc
}
