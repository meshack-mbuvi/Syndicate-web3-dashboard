export abstract class EncodeCalls {
  web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  public allowModule(token: string, module: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'module',
            type: 'address'
          },
          {
            internalType: 'bool',
            name: 'allowed',
            type: 'bool'
          }
        ],
        name: 'updateModule',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, module, true] as string[]
    );
  }

  public setTotalSupplyRequirements(token: string, number: number): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'maxTotalSupply_',
            type: 'uint256'
          }
        ],
        name: 'setMixinRequirements',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, number] as string[]
    );
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

  public setMaxPerMemberRequirements(
    token: string,
    maxPerMember: number
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
            internalType: 'uint256',
            name: 'maxPerMember_',
            type: 'uint256'
          }
        ],
        name: 'setMixinRequirements',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, maxPerMember] as string[]
    );
  }

  public updateEthPrice(token: string, price: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'collective',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'ethPrice_',
            type: 'uint256'
          }
        ],
        name: 'updateEthPrice',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, price]
    );
  }

  public updateModuleMixins(
    token: string,
    module: string,
    mixins: string[]
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
            internalType: 'address',
            name: 'module',
            type: 'address'
          },
          {
            internalType: 'address[]',
            name: 'mixins_',
            type: 'address[]'
          }
        ],
        name: 'updateModuleMixins',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, module, mixins] as string[]
    );
  }

  public updateDefaultMixins(token: string, mixins: string[]): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          },
          {
            internalType: 'address[]',
            name: 'mixins_',
            type: 'address[]'
          }
        ],
        name: 'updateDefaultMixins',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, mixins] as string[]
    );
  }

  public updateTokenURI(token: string, uri: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'collective',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string'
          }
        ],
        name: 'updateTokenURI',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, uri]
    );
  }
}
