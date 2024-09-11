/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../../../common";

export type ZContextStruct = {
  origin: PromiseOrValue<BytesLike>;
  sender: PromiseOrValue<string>;
  chainID: PromiseOrValue<BigNumberish>;
};

export type ZContextStructOutput = [string, string, BigNumber] & {
  origin: string;
  sender: string;
  chainID: BigNumber;
};

export type RevertContextStruct = {
  origin: PromiseOrValue<BytesLike>;
  sender: PromiseOrValue<string>;
  chainID: PromiseOrValue<BigNumberish>;
};

export type RevertContextStructOutput = [string, string, BigNumber] & {
  origin: string;
  sender: string;
  chainID: BigNumber;
};

export interface UniversalContractInterface extends utils.Interface {
  functions: {
    "onCrossChainCall((bytes,address,uint256),address,uint256,bytes)": FunctionFragment;
    "onRevert((bytes,address,uint256),address,uint256,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "onCrossChainCall" | "onRevert"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "onCrossChainCall",
    values: [
      ZContextStruct,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "onRevert",
    values: [
      RevertContextStruct,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "onCrossChainCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "onRevert", data: BytesLike): Result;

  events: {};
}

export interface UniversalContract extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UniversalContractInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    onCrossChainCall(
      context: ZContextStruct,
      zrc20: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    onRevert(
      context: RevertContextStruct,
      zrc20: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  onCrossChainCall(
    context: ZContextStruct,
    zrc20: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    message: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  onRevert(
    context: RevertContextStruct,
    zrc20: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    message: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    onCrossChainCall(
      context: ZContextStruct,
      zrc20: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    onRevert(
      context: RevertContextStruct,
      zrc20: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    onCrossChainCall(
      context: ZContextStruct,
      zrc20: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    onRevert(
      context: RevertContextStruct,
      zrc20: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    onCrossChainCall(
      context: ZContextStruct,
      zrc20: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    onRevert(
      context: RevertContextStruct,
      zrc20: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
