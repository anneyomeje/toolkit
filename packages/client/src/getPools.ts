import UniswapV2Pair from "@uniswap/v2-core/build/UniswapV2Pair.json";
import { getAddress, ParamChainName } from "@zetachain/protocol-contracts";
import SystemContract from "@zetachain/protocol-contracts/abi/SystemContract.sol/SystemContract.json";
import { ethers } from "ethers";

import { MulticallContract } from "../../../types/balances.types";
import { ZetaChainClient } from "./client";
import MULTICALL3_ABI from "./multicall3.json";

type Pair = {
  key: string;
  tokenA: string;
  tokenB: string;
};

interface Reserves {
  _blockTimestampLast: number;
  _reserve0: bigint;
  _reserve1: bigint;
}

interface Zrc20Details {
  [key: string]: {
    decimals?: number;
    symbol?: string;
  };
}

export const getPools = async function (this: ZetaChainClient) {
  const rpc = this.getEndpoint("evm", `zeta_${this.network}`);
  const provider = new ethers.JsonRpcProvider(rpc);
  const zetaNetwork = `zeta_${this.network}` as ParamChainName;
  const uniswapV2FactoryAddress = getAddress("uniswapV2Factory", zetaNetwork);

  if (!uniswapV2FactoryAddress) {
    throw new Error("uniswapV2Factory is not defined");
  }

  const systemContractAddress = getAddress("systemContract", zetaNetwork);
  if (!systemContractAddress) {
    throw new Error("System contract is not defined");
  }

  const systemContract = new ethers.Contract(
    systemContractAddress,
    SystemContract.abi,
    provider
  );

  const zetaTokenAddress = getAddress("zetaToken", zetaNetwork);
  if (!zetaTokenAddress) {
    throw new Error("ZETA token address is not defined");
  }

  const foreignCoins = await this.getForeignCoins();
  const tokenAddresses = foreignCoins.map(
    (coin) => coin.zrc20_contract_address
  );
  tokenAddresses.push(zetaTokenAddress);

  const uniquePairs: Pair[] = tokenAddresses.reduce(
    (pairs: Pair[], tokenA: string, i: number) => {
      tokenAddresses.slice(i + 1).forEach((tokenB: string) => {
        const pairKey = [tokenA, tokenB].sort().join("-");
        if (!pairs.some((p: Pair) => p.key === pairKey)) {
          pairs.push({ key: pairKey, tokenA, tokenB });
        }
      });
      return pairs;
    },
    []
  );

  const multicallAddress = "0xca11bde05977b3631167028862be2a173976ca11";
  const multicallContract: MulticallContract = new ethers.Contract(
    multicallAddress,
    MULTICALL3_ABI,
    provider
  );

  const calls = uniquePairs.map(({ tokenA, tokenB }) => ({
    callData: systemContract.interface.encodeFunctionData("uniswapv2PairFor", [
      uniswapV2FactoryAddress,
      tokenA,
      tokenB,
    ]),
    target: systemContractAddress,
  }));

  if (!multicallContract.aggregate) {
    throw new Error("aggregate method not available on Multicall Contract");
  }

  const [, returnData] = await multicallContract.aggregate.staticCall(calls);

  const validPairs = returnData
    .map((data) => {
      try {
        const pair = systemContract.interface.decodeFunctionResult(
          "uniswapv2PairFor",
          data
        )[0] as string;
        return pair !== ethers.ZeroAddress ? pair : null;
      } catch {
        return null;
      }
    })
    .filter((pair: string | null) => pair !== null);

  const pairCalls = validPairs
    .map((pair: string) => [
      {
        callData: new ethers.Interface(UniswapV2Pair.abi).encodeFunctionData(
          "token0"
        ),
        target: pair,
      },
      {
        callData: new ethers.Interface(UniswapV2Pair.abi).encodeFunctionData(
          "token1"
        ),
        target: pair,
      },
      {
        callData: new ethers.Interface(UniswapV2Pair.abi).encodeFunctionData(
          "getReserves"
        ),
        target: pair,
      },
    ])
    .flat();

  const [, pairReturnData] = await multicallContract.aggregate.staticCall(
    pairCalls
  );

  const pools = [];
  const uniswapInterface = new ethers.Interface(UniswapV2Pair.abi);

  for (let i = 0; i < pairReturnData.length; i += 3) {
    const pairIndex = Math.floor(i / 3);
    const pair = validPairs[pairIndex];

    if (
      !pairReturnData[i] ||
      !pairReturnData[i + 1] ||
      !pairReturnData[i + 2]
    ) {
      console.warn(`Missing data for pair ${pair} at index ${i}`);
      continue;
    }

    const token0Data = pairReturnData[i];
    const token1Data = pairReturnData[i + 1];
    const reservesData = pairReturnData[i + 2];

    // Check if data can be decoded
    let token0, token1: string;
    let reserves: Reserves;

    try {
      token0 = uniswapInterface.decodeFunctionResult(
        "token0",
        token0Data
      )[0] as string;
      token1 = uniswapInterface.decodeFunctionResult(
        "token1",
        token1Data
      )[0] as string;
      const decodedReserves = uniswapInterface.decodeFunctionResult(
        "getReserves",
        reservesData
      );
      reserves = {
        _blockTimestampLast: decodedReserves[2] as number,
        _reserve0: decodedReserves[0] as bigint,
        _reserve1: decodedReserves[1] as bigint,
      };
    } catch {
      continue;
    }
    pools.push({
      pair,
      t0: { address: token0, reserve: reserves._reserve0 },
      t1: { address: token1, reserve: reserves._reserve1 },
    });
  }

  const zrc20Details = foreignCoins.reduce((acc: Zrc20Details, coin) => {
    acc[coin.zrc20_contract_address.toLowerCase()] = {
      decimals: coin.decimals,
      symbol: coin.symbol,
    };
    return acc;
  }, {} as Zrc20Details);

  const formattedPools = pools.map((t) => {
    const zeta = { decimals: 18, symbol: "WZETA" };
    const t0 = t.t0.address.toLowerCase();
    const t1 = t.t1.address.toLowerCase();
    const t0ZETA = t0 === zetaTokenAddress.toLowerCase() && zeta;
    const t1ZETA = t1 === zetaTokenAddress.toLowerCase() && zeta;

    return {
      ...t,
      t0: {
        ...t.t0,
        ...(zrc20Details[t0] || t0ZETA),
      },
      t1: {
        ...t.t1,
        ...(zrc20Details[t1] || t1ZETA),
      },
    };
  });

  return formattedPools;
};
