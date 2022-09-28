import { IActiveNetwork } from '@/state/wallet/types';
import TokenGated_ABI from 'src/contracts/TokenGated.json';
import { ContractBase } from './ContractBase';

export class TokenGatedMixin extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, TokenGated_ABI as AbiItem[]);
  }

  public setTokenGatedRequirements(
    token: string,
    logicOperator: boolean,
    tokens: string[],
    balances: number[]
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      // @ts-expect-error TS(2345): Argument of type 'AbiItem | undefined' is not assig... Remove this comment to see the full error message
      this.getAbiObject('setMixinRequirements'),
      [token, logicOperator, tokens, balances] as string[]
    );
  }

  public async updateTokenGatedRequirements(
    account: string,
    token: string,
    logicOperator: boolean,
    tokens: string[],
    balances: string[],
    onTxConfirm: (transactionHash: any) => void,
    onTxReceipt: (receipt: any) => void,
    onTxFail: (err: any) => void
  ): Promise<void> {
    await this.send(
      account,
      () =>
        this.contract.methods.setMixinRequirements(
          token,
          logicOperator,
          tokens,
          balances
        ),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    token: string,
    logicOperator: boolean,
    tokens: string[],
    balances: string[],
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () =>
        this.contract.methods.setMixinRequirements(
          token,
          logicOperator,
          tokens,
          balances
        ),
      onResponse
    );
  }
}
