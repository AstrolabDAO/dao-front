import { addressZero, l2s, unwraps, wraps } from "../constants";
import { clearNetworkTypeFromSlug, shortenAddress, unslug } from "../utils/format";
import { Optional } from "../utils/typing";
import { Audit } from './Audit';
import { Brand } from "./Brand";
import { ProtocolScoring } from "./Scoring";
import { NetworkStatus, ProtocolType, Resource } from "./enums";
import { Req } from "./types";


export class Network extends Brand {

  static resource: Resource = "network";
  id=0;
  hexId="0x0";
  lzId=0;
  lzEndpoint=addressZero;
  isL2=false;

  httpRpcs: string[]=[];
  wsRpcs: string[]=[];
  explorers: string[]=[];
  explorerApi="";

  status=NetworkStatus.UP_CLEAR;
  gasToken?: Token;
  // provider?: JsonRpcProvider;

  constructor() {
    super();
  }

  public async init(o: Partial<Network>={}): Promise<Network> {
    // store indexes (pre-construct)
    const chainSlug = clearNetworkTypeFromSlug(o.slug ?? "");
    // complete props with brand data
    if (o.slug && (!o.description || !o.logo)) {
      const brand = await Brand.get(chainSlug);
      if (brand) {
        o = Object.assign(brand, o);
        if (o.slug?.includes("testnet")) {
          o.name = (brand as Brand).name + " Testnet";
        }
      } else {
        o.name = unslug(o.slug as string);
      }
    }
    await super.init(o as Brand);
    this.logo = `/svgs/networks/${this.slug}`; // || "/svgs/mask.svg"
    this.description = o.description ?? this.description ?? "";
    this.id = o.id ?? 0;
    this.isL2 = o.isL2 ?? l2s.some((s) => this.slug?.includes(s));
    this.hexId = this.getHexId();
    this.lzId = o.lzId ?? 0;
    this.lzEndpoint = o.lzEndpoint ?? "";
    this.httpRpcs = []; // o.httpRpcs?.length ? o.httpRpcs : cache.endpoints.get(this.slug)?.httpRpcs ?? [];
    this.wsRpcs = []; // o.wsRpcs?.length ? o.wsRpcs : cache.endpoints.get(this.slug)?.wsRpcs ?? [];
    this.explorers = []; // o.explorers?.length ? o.explorers : conf.endpoints[this.slug]?.explorers ?? [];
    this.explorerApi = ""; // o.explorerApi ? o.explorerApi : conf.endpoints[this.slug]?.explorerApi ?? '';
    this.status = o.status ?? NetworkStatus.UP_CLEAR;
    this.gasToken = await Token.get(o.gasToken);
    this.populateSearchIndex?.();
    return this;
  }

  protected override populateSearchIndex?() {
    // const gasToken = this.getGasToken();
    this.updateSearchIndex([
      this.name,
      this.slug,
      this.id,
      this.hexId,
      // gasToken?.name,
      // gasToken?.slug,
      // gasToken?.symbol,
    ]);
  }

  public getHexId(): string {
    if (typeof this.id === "object")
      return this.id;
    return "0x" + this.id.toString(16);
  }

  public isLive(): boolean {
    return !this.slug?.match(/localhost|testnet|dummy/i)
      && this.httpRpcs.length > 0
      && this.id > 0
      && this.status != NetworkStatus.DOWN;
  }

  // public getRpcInfo(): Partial<IServerInfo> {
  //   return populateServerInfo({
  //     name: `${this.name} RPC`,
  //     root: this.httpRpcs?.[0] as string,
	// 		protocol: NetworkProtocol.RPC,
  //     timeoutS: 10,
  //   });
  // }

  // NB: if using QR code template, qrcode: false
  public toWalletConnectOptions(): any {
    return { rpcMap: { [this.id]: this.httpRpcs[0] } }
  }

  public toMetamaskOptions(): any {
    return {}
  }

  public toCoinbaseWalletOptions(): any {
    // return { url: this.httpRpcs[0], supportedChainIds: [this.id] }
  }

  public toFortmaticOptions(): any {
    return { rpcUrl: this.httpRpcs[0], chainId: this.id }
  }

  public toLedgerOptions(): any {
    return { rpcUrl: this.httpRpcs[0] }
  }

  public toTrezorOptions(): any {
    return { rpcUrl: this.httpRpcs[0] }
  }

  public toOnboardOptions(): any {
    return {
      id: "0x" + this.id.toString(16), // NB: we use an hexadecimal base as per the docs
      namespace: "evm",
      rpcUrl: this.httpRpcs[0],
      label: this.name,
      // @ts-ignore
      color: this.color1,
      icon: this.logo,
    }
  }

  // public getProvider(): JsonRpcProvider {
  //   if (this?.provider) { return this.provider; }
  //   this.provider = new JsonRpcProvider(this.httpRpcs[0]);
  //   return this.provider;
  // }

  public static dummy: Optional<Network>;
  public static async getDummy(): Promise<Network> {
    if (!this.dummy)
      this.dummy = await new Network().init({
        slug: "ethereum",
        name: "Ethereum",
        description: "Ethereum layer 1 is the OG EVM network. The first to have introduced programmability through smart contracts.",
        color1: "#bbbbbb",
        color2: "#444444",
      });
    return this.dummy;
  }
}

export class Protocol extends Brand {

  static resource: Resource = "protocol";
  id=0;
  types: ProtocolType[]=[];
  networks: Network[]=[];
  rewardTokens: Token[]=[];
  governanceToken?: Token;
  audits: Audit[] = [];
  scoring?: ProtocolScoring;

  constructor() {
    super();
  }

  public async init(o: Partial<Protocol>): Promise<Protocol> {

    // complete props with brand data
    if (o.slug && (!o.description || !o.logo)) {
      const brand = await Brand.get(o.slug);
      if (brand)
        o = Object.assign(brand, o);
    }
    await super.init(o as Brand);
    this.logo = `/svgs/protocols/${this.slug}`; // || "/svgs/mask.svg";
    this.description = o.description ?? this.description ?? "";

    this.id = o.id || 0;

    this.types = o.types || [];
    this.networks = await Network.getAll(o.networks);
    this.rewardTokens = await Token.getAll(o.rewardTokens);
    this.governanceToken = await Token.get(o.governanceToken);
    if (this.governanceToken) {
      this.governanceToken.protocol = this;
      if (!this.governanceToken.logo || this.governanceToken.logo == `/svgs/mask.svg`)
        this.governanceToken.logo = this.logo
    }
    this.audits = o.audits || [];
    this.scoring = o.scoring ? await ProtocolScoring.get(o.scoring) : undefined;
    this.populateSearchIndex?.();
    return this;
  }

  public stripName(): string {
    return this.name.replace(/\s?(Finance|Protocol|Network|Capital)\b/g, '');
  }

  protected override populateSearchIndex?() {
    // this.updateSearchIndex([
    //   this.name,
    //   this.slug,
    //   this.types?.join(),
    //   this.networks?.map(n => n?.slug)?.join(),
    //   this.networks?.map(n => n?.name)?.join(),
    //   this.networks?.map(n => n?.id)?.join(),
    //   this.networks?.map(n => n?.hexId)?.join(),
    // ]);
  }

  public isLive(): boolean {
    return !this.slug?.match(/localhost|testnet|dummy/i)
      && this.networks.length > 0;
  }
}

export class Token extends Brand {

  static symbolByAddress: { [address: string]: string } = {};

  static resource: Resource = "token";
  symbol="";

  nativeAddress="";
  shortAddress="";

  nonNativeAddresses: string[] = []; // NA for gas tokens
  nativeNetwork={} as Network;
  exposureNetworks: Network[] = [];

  unwrappedSymbol="";
  protocol?: Protocol;

  scale=0; // == decimals
  weiPerUnit=0; // pow(10, scale)
  supplyByAddress: { [address: string]: number } = {}; // stakes of each holding address
  addressCount=0;
  issuancePrice=0; // initial value in $
  markPrice=0; // last average DEX price == token value
  issuanceSupply=0; // initial supply == inception premints
  supply=0; // current supply == total token minted
  maxSupply=0; // if fully minted, can be infinite
  lockedSupply=0; // currentSupply - time/LP locked
  circulatingSupply=0; // supply - lockedSupply
  marketCap=0; // markPrice * supply
  dilutedMarketCap=0; // markPrice * maxSupply

  buyEnabled=true;
  sellEnabled=true;
  buyTax=0;
  sellTax=0;
  minBuy=0;
  maxBuy=0;
  minSell=0;
  maxSell=0;

  // transients
  symbolVariations: Optional<string[]>;

  constructor() {
    super();
  }

  public async init(o: Partial<Token>={}): Promise<Token> {

    if (!o.name && o.symbol && o.nativeNetwork) {
      const networkName = typeof o.nativeNetwork == 'string' ? o.nativeNetwork : o.nativeNetwork.name;
      o.name = `${o.symbol} [${networkName}]`;
    }
    await super.init(o as Brand);
    this.description = o.description ?? this.description ?? "";
    this.symbol = o.symbol ?? this.slug;
    this.unwrappedSymbol = this.unwrapSymbol();
    this.nativeAddress = (o.nativeAddress ?? addressZero).toLowerCase();
    this.shortAddress = (o.shortAddress ?? shortenAddress(this.nativeAddress)).toLowerCase();
    this.nativeNetwork = await Network.get(o.nativeNetwork) as Network;
    this.exposureNetworks = await Network.getAll(o.exposureNetworks);
    this.nonNativeAddresses = o.nonNativeAddresses ?? [];
    this.protocol = await Protocol.get(o.protocol);
    this.logo = `/svgs/tokens/${this.unwrappedSymbol}`;
    this.scale = o.scale ?? 18;
    this.weiPerUnit = o.weiPerUnit ?? Math.pow(10, this.scale);
    this.supplyByAddress = o.supplyByAddress ?? {};
    this.issuancePrice = o.issuancePrice ?? 0.00;
    this.markPrice = o.markPrice ?? 0.00;
    this.issuanceSupply = o.issuanceSupply ?? 0.00;
    this.supply = o.supply ?? 0.00;
    this.maxSupply = o.maxSupply ?? 0.00;
    this.lockedSupply = o.lockedSupply ?? 0.00;
    this.circulatingSupply = o.circulatingSupply ?? 0.00;
    this.marketCap = o.marketCap ?? 0.00;
    this.dilutedMarketCap = o.dilutedMarketCap ?? 0.00;
    this.addressCount = o.addressCount ?? 0;
    this.buyEnabled = o.buyEnabled ?? false;
    this.sellEnabled = o.sellEnabled ?? false;
    this.buyTax = o.buyTax ?? 0.00;
    this.sellTax = o.sellTax ?? 0.00;
    this.minBuy = o.minBuy ?? 0.00;
    this.maxBuy = o.maxBuy ?? 1_000_000_000;
    this.minSell = o.minSell ?? 0.00;
    this.maxSell = o.maxSell ?? 1_000_000_000;
    this.populateSearchIndex?.();

    // populate indexes (TODO: delegate to store?)
    Token.symbolByAddress[this.nativeAddress] = this.symbol;
    return this;
  }

  protected override populateSearchIndex?() {
    this.updateSearchIndex([
      this.name,
      this.symbol,
      this.slug,
      this.nativeAddress,
      this.nativeNetwork?.slug,
      this.nativeNetwork?.name,
      this.nativeNetwork?.id,
      this.nativeNetwork?.hexId,
    ]);
  }

  public static getChainSymbol(token: string|Token): [string, string] {
    let [chain, symbol] = ["eth", "eth"];
    if (token) {
      if (typeof token == "string")
        symbol = token;
      else if (token?.symbol)
        symbol = token.symbol;
    }
    if (symbol.includes(":"))
      [chain, symbol] = symbol.split(":");
    return [chain, symbol];
  }

  public static unwrapSymbol(token: string|Token): string {
    const [_, symbol] = Token.getChainSymbol(token);
    return unwraps?.[symbol.toLowerCase()] ?? symbol.toLowerCase();
  }

  public static wrapSymbol(token: string|Token): string {
    const [_, symbol] = Token.getChainSymbol(token);
    return wraps?.[symbol.toLowerCase()] ?? symbol.toLowerCase();
  }

  public static getSymbolVariations(token: string|Token): string[] {
    const [_, symbol] = Token.getChainSymbol(token);
    const unwrap = unwraps?.[symbol.toLowerCase()];
    const wrap = wraps?.[symbol.toLowerCase()];
    return Array.from(new Set([symbol.toLowerCase(), wrap, unwrap].filter(v => !!v)));
  }

  public static getFullSymbol(token: string|Token): string {
    const [chain, symbol] = Token.getChainSymbol(token);
    const variations = Token.getSymbolVariations(symbol);
    for (const s of variations)
      if (s && s != symbol)
        return chain + ":" + s;
    return "";
  }

  public static matchSymbol(token: string|Token, symbol: string): boolean {
    return Token.getSymbolVariations(token).includes(symbol.toLowerCase().trim());
  }

  public static matchSymbols(token: string|Token, symbols: string[]): boolean {
    return symbols.some(s => Token.matchSymbol(token, s));
  }

  public unwrapSymbol(): string {
    return Token.unwrapSymbol(this.symbol ?? this.slug);
  }

  public wrapSymbol(): string {
    return Token.wrapSymbol(this.symbol ?? this.slug);
  }

  public getSymbolVariations(): string[] {
    if (!this.symbolVariations)
      this.symbolVariations = Token.getSymbolVariations(this.symbol ?? this.slug);
    return this.symbolVariations;
  }

  public matchSymbol(symbol: string): boolean {
    return Token.matchSymbol(this.symbol ?? this.slug, symbol);
  }

  public matchSymbols(symbols: string[]): boolean {
    return Token.matchSymbols(this.symbol ?? this.slug, symbols);
  }

  public getFullSymbol(): string {
    return Token.getFullSymbol(this.symbol ?? this.slug);
  }

  public toOnboardOptions(): any { return this.symbol }

  public asReqParam(): Req.INetworkCurrency {
    return {
      name: this.name,
      symbol: this.symbol,
      decimals: this.scale
    }
  }

  // public getNetworkReqParam(): Req.INetwork {
  //   return this.nativeNetwork.asReqParam();
  // }

  // // exponential proxies
  // public getExponentialUrl(): string {
  //   return Exponential.getTokenUrl(this.exponentialId);
  // }

  // public async getExponentialInfo(): Promise<Optional<Exponential.TokenInfo>> {
  //   return await Exponential.getTokenInfo(this.exponentialId);
  // }

  // // de.fi proxies
  // public getDeDotFiUrl(): string {
  //   return DeDotFi.getContractUrl(this.nativeAddress, this.nativeNetwork.id);
  // }

  // public async getDeDotFiInfo(): Promise<Optional<DeDotFi.TokenInfo>> {
  //   return await DeDotFi.getTokenInfo(this.nativeAddress, this.nativeNetwork.id);
  // }

  // // cmc proxies
  // public getCoinMarketCapUrl(): string {
  //   return `${sites.coinMarketCap.root}/currencies/${this.coinMarketCapId}`;
  // }

  // // coingecko proxies
  // public getCoinGeckoUrl(): string {
  //   return CoinGecko.getTokenUrl(this.coinGeckoId);
  // }

  // public async getCoinGeckoInfo(): Promise<Optional<CoinGecko.TokenInfo>> {
  //   return await CoinGecko.getTokenInfo(this.coinGeckoId);
  // }

  // public async getHisto(currency=Currency.USD, days=60): Promise<Optional<CoinGecko.TokenSeries>> {
  //   return await CoinGecko.getTokenHisto(this.coinGeckoId, currency as Currency, days);
  // }

  // public async populateThirdPartyData(): Promise<void> {
  //   if (isDummy(this) || isLocal(this) || isTestnet(this))
  //     return;

  //   this.exponentialInfo = await this.getExponentialInfo();
  //   if (this.exponentialInfo) {
  //     this.description ||= this.exponentialInfo.description + " (source: Exponential DeFi)";
  //   } else {
  //     logWarning(`exponentialInfo missing for ${this.slug}`);
  //   }

  //   this.coinGeckoInfo = await this.getCoinGeckoInfo();
  //   if (this.coinGeckoInfo) {
  //     if (this.coinGeckoInfo.asset_platform_id)
  //       this.nativeNetwork ||= Network.get(this.coinGeckoInfo.asset_platform_id, false) as Network;
  //     if (this.coinGeckoInfo.platforms) {
  //       this.name ||= this.coinGeckoInfo.name;
  //       this.symbol ||= this.coinGeckoInfo.symbol;
  //       this.exposureNetworks = Object.keys(this.coinGeckoInfo.platforms)
  //         .map(k => Network.get(k, false) as Network).filter(n => !!n);
  //       this.scale ??= this.coinGeckoInfo.detail_platforms[this.nativeNetwork.coinGeckoId]
  //         ?.decimal_places;
  //       if (this.scale)
  //         this.weiPerUnit = Math.pow(10, this.scale);
  //     }
  //     this.description ||= this.coinGeckoInfo.description + " (source: CoinGecko)";
  //   }

  //   // this.deDotFiInfo = await this.getDeDotFiInfo();
  //   this.coinGeckoHisto = await this.getHisto();
  // }

  // // chainlink proxies
  // public getChainLinkUrl(): string {
  //   return ChainLink.getTokenUrl(this.chainlinkId);
  // }

  // public async getCoinGeckoPrice(): Promise<Optional<number>> {
  //   return await CoinGecko.getTokenPrice(this.coinGeckoId);
  // }

  // public async getChainLinkPrice(): Promise<Optional<number>> {
  //   return await ChainLink.getTokenPrice(this.chainlinkId);
  // }

  // public getQuoteToken(symbol="usdc"): Token {
  //   return Token.get(`${this.nativeNetwork.gasToken.toLowerCase().split(':')[0]}:${symbol}`) as Token;
  // }

  // public toWei = (n: number | bigint | string | BigNumber): BigNumber => {
  //   return parseUnits(n.toString(), this.scale);
  // };

  // public async get1inchPrice(symbol="usdc"): Promise<Optional<number>> {
  //   const quoteAsset = this.getQuoteToken(symbol)!;
  //   return (await _1inch.getQuote(quoteAsset.nativeAddress, this.nativeAddress, quoteAsset.weiPerUnit, this.nativeNetwork.id) ?? 0) / this.weiPerUnit;
  // }

  // public async get1inchQuote(amount: number, sell=true, quoteSymbol="usdc"): Promise<Optional<number>> {
  //   const quoteAsset = this.getQuoteToken()!;
  //   if (sell)
  //     return (await _1inch.getQuote(this.nativeAddress, quoteAsset.nativeAddress, amount * this.weiPerUnit, this.nativeNetwork.id) ?? 0) / quoteAsset.weiPerUnit;
  //   else
  //     return (await _1inch.getQuote(quoteAsset.nativeAddress, this.nativeAddress, amount * quoteAsset.weiPerUnit, this.nativeNetwork.id) ?? 0) / this.weiPerUnit;
  // }

  // public toAmount = (n: number | bigint | string | BigNumber): number => {
  //   const weiString = formatUnits(n, this.scale);
  //   return parseFloat(weiString);
  // };

  public getGweiPerUnit = () => this.weiPerUnit / 1e9;

}
