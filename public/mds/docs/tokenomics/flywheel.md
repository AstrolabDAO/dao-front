# Flywheel tokenomics

Flywheel tokenomics is the result of a positive feedback loop between TVL, token price and protocol revenue. To illustrate, increasing TVL increases protocol revenue, which in turn further increases TVL. This positive feedback loop aligns the incentives between depositors, $ASL holders and stakers to ensure the protocol’s success.

![flywheel](/media/Flywheel-2.png)

## Why?

Astrolab's Crates are tokenized, meaning that deposits into Crates are represented by tokens that can be traded in liquidity pools or used as collateral for loans. Our goal is to provide deep liquidity for Crates as this improves the general user experience and opens the door for further ecosystem integrations.

#### User experience improvements:

- Users can swap their tokens instead of withdrawing, preserving the AUM as no withdrawals happen, and reducing gas costs.
- Users can LP with crate tokens, earning yield in crate tokens on top of the yield provided by the crate itself.
- Crate token market prices can be followed on websites such as DexScreener or Coingecko.

#### Ecosystem integrations:

- Creating an oracle for Crates is easier as there's a market price.
- Crates can be used as collateral, and liquidations can happen without needing to withdraw funds.
- **Collateralization of the Crates opens the door for leveraging, and multiplication of the AUM, and performance fees**.

Such integrations are harder to replicate by competitors and provide protection against "vampire attacks" where another protocol launches a similar product subsidized by their governance tokens.

## How?

Astrolab plans to take advantage of [Aura](https://aura.finance/) and its control over [Balancer](https://balancer.fi/)'s $BAL emissions.

Balancer is a DEX that incentivizes liquidity providers with their governance token $BAL. Holders of $BAL can lock their tokens and receive vote-escrowed BAL (veBAL) in exchange, which has voting power. This voting power is used to allocate the $BAL emissions to specific liquidity pools on the DEX, creating a circular effect.

> If you want to learn more about veTokenomics, we recommend this excellent [article](https://perpprotocol.mirror.xyz/GzzvxvNFeTjH9au6cllJ_4ffshySn3M3iAmKe34sxdw) from Perp protocol.

Aura is a metagovernance layer for Balancer, that has acquired and locked a large amount of $BAL tokens. Their native token $AURA can also be locked and then used as a proxy to direct veBAL voting power. In essence, Aura buys $BAL and then $AURA can be used as ‘leveraged voting’ to redirect $BAL emissions.

As a result, it is currently much more profitable to vote using $AURA than $BAL tokens, as $1 worth of $AURA controls $1.42 of BAL tokens, increasing over time as the protocol accumulates more BAL. Astrolab plans to acquire as much $AURA as possible and use it to direct emissions to our various liquidity pools, including pools featuring crate tokens.

> Our calculations show that currently, it is very profitable to incentivize liquidity this way: 60k$ of $AURA votes is enough to provide a 1M$ pool with a 10% APR. You can view more metrics regarding Aura [here](https://oni-giri-analytics-aura-metrics-z9juz6.streamlitapp.com/).

A StablecoinCrate-USDC 80%/20% pool, incentivized with 10% APR paid out in $BAL could be very profitable. Assuming that the Crate itself offers an APR of 10%, Astrolab's users would earn a total of 18% by providing liquidity to this pool. 10% paid in $BAL and an additional 8% from holding the Crate tokens.

The high yield on the BAL pool would incentivize deposits and minting of Crate tokens, further growing Astrolab's TVL, and therefore increasing the amount of performance fees earned.

A share of those performance fees can be directed to accumulate $AURA to boost the liquidity yield. As Astrolab’s TVL grows, the protocol can acquire more and more $AURA. The circle of voting with Aura to acquire more Aura sits at the core of Astrolab's flywheel tokenomics.

## Execution

Those mechanisms require accumulating $Aura early in $Astrolab's life, to then kickstart the positive feedback loop between TVL and APR increases.

An initial treasury of $AURA will be acquired during the public sale of the $ASL token.

Subsequently, an Initial Farming Offer (IFO) will be conducted in which users can stake their assets (e.g. $USDC) and earn $ASL in exchange for their Crate yield, which in turn is used to acquire more $AURA. It is important to note that this farming opportunity is lossless because Astrolab only acquires $AURA using yield from the staked assets, therefore allowing users to withdraw 100% of their deposits at any time.

The mechanism offers the following advantages:

- Unlike the classic distribution offered by liquidity farming protocols, Astrolab accumulates protocol-controlled value (PCV) hence backing the underlying value of $ASL over time.
- Acquired $AURA will be directed towards the Crates’ metapools, thereby providing an increasing yield for the pools over time.
- The IFO doesn’t have to last for 100 years, as many DAOs plan for. Once the initial accumulation is done, inflation stops and potential selling pressure is relieved.

To improve the speed of the accumulation, assets from users can be deposited into Astrolab's crates, then added to Astrolab's metapools, and stacked into Aura, for maximum yield generation and optimal asset recovery.

The following options may be considered to favorably align incentives:

- Distribute $ASL at a fixed rate (as Concentrator did with some success). This prevents any incentive to sell if the price of $ASL is lower than the $AURA market rate.
- Enable insurance staking from the start of the IFO, with boosted $ASL rewards to incentivize users to lock their tokens.
- Execute a ‘lock-drop’ whereby users deposit their assets and agree to receive their rewards when the farming period ends. This worked well for other protocols such as Bastion on Aurora.
- Create a 80%/20% pool with ASL/graviAURA. BadgerDAO emits $graviAURA which is an auto-accumulating $AURA token that votes for the pool it is deposited in. - This means that the pool improves its yield without a need for more votes.
- As a more extreme option, a 98%/2% pool with $ASL on the 2% side would create a significant slippage for $ASL sellers.
- ‘Bribe’ Aura governance with $ASL tokens to incentivize an ASL/ETH pool at the start of the IFO, thereby allowing Astrolab to add liquidity to the pool and recover the incentives.
