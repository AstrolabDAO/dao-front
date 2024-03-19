
export class Score {
  value=0; // weighted sum of risk scores
  weight=0;
  description="";

  constructor() {}

  public async init(o?: Partial<Score>): Promise<Score> {
    this.value = o?.value ?? 1;
    this.weight = o?.weight ?? 1;
    this.description = o?.description ?? "";
    return this;
  }

  public compute(): number {
    return (this.value ?? 0) * this.weight;
  }

  public static computeComposite(...scores: Score[]) {
    const product = scores.reduce((acc, s) => acc * (s.compute() ?? 1), 1);
    return Math.pow(product, 1/scores.length);
  }

  public static async get(s?: Partial<Score>) {
    return s instanceof Score ? s : (new Score()).init(s);
  }
}

export class ProtocolScoring extends Score {
  ops = {} as Score; // team and protocol track record, audit, design, contract ownership...
  governance = {} as Score; // ownership, DAO activity, decentralization, lock scheme...
  tokenomics = {} as Score;

  constructor() {
    super();
  }

  public async init(o: Partial<ProtocolScoring>): Promise<ProtocolScoring> {
    await super.init(o as Score);
    this.ops = await Score.get(o.ops);
    this.governance = await Score.get(o.governance);
    this.tokenomics = await Score.get(o.tokenomics);
    return this;
  }

  public compute(): number {
    if (!this.value)
      this.value = Score.computeComposite(this.ops, this.governance, this.tokenomics);
    return this.value;
  }

  public static async get(s: any): Promise<ProtocolScoring> {
    return s instanceof ProtocolScoring ? s : (new ProtocolScoring()).init(s);
  }

  public static async dummy() {
    return new ProtocolScoring().init({
      ops: await Score.get({ value: 4, weight: 1, description: "Ops" }),
      governance: await Score.get({ value: 4, weight: 1, description: "Governance" }),
      tokenomics: await Score.get({ value: 4, weight: 1, description: "Tokenomics" }),
    });
  }
}

export class StrategyScoring extends Score {
  safety = {} as Score;
  profitability = {} as Score;
  scalability = {} as Score;
  liquidity = {} as Score;

  constructor() { super(); }

  public async init(o?: Partial<StrategyScoring>): Promise<StrategyScoring> {
    await super.init(o as Score);
    this.safety = await Score.get(o?.safety);
    this.profitability = await Score.get(o?.profitability);
    this.scalability = await Score.get(o?.scalability);
    this.liquidity = await Score.get(o?.liquidity);
    return this;
  }

  // compute perf score == risk adjusted perf (APR, volatility, SSE, epoch winrate, recovery...)
  public compute(): number {
    if (!this.value)
      this.value = Score.computeComposite(this.safety, this.profitability, this.scalability, this.liquidity);
    return this.value;
  }

  public static async get(s: any) {
    return s instanceof StrategyScoring ? s : (new StrategyScoring()).init(s);
  }
}
