import TIME_REQUIREMENTS_ABI from '@/contracts/TimeRequirements.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class TimeRequirements extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, TIME_REQUIREMENTS_ABI as AbiItem[]);
  }

  public setTimeRequirements(
    token: string,
    start: string,
    end: string
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          },
          {
            components: [
              {
                internalType: 'uint128',
                name: 'startTime',
                type: 'uint128'
              },
              {
                internalType: 'uint128',
                name: 'endTime',
                type: 'uint128'
              }
            ],
            internalType: 'struct TimeBased.TimeWindow',
            name: 'timeWindow_',
            type: 'tuple'
          }
        ],
        name: 'setMixinRequirements',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, { startTime: start, endTime: end }] as string[]
    );
  }
}
