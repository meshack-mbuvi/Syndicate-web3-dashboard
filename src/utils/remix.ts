/* eslint-disable @typescript-eslint/no-unsafe-call */
import { FuncABI } from '@/types/remix';
import { addHexPrefix, toBuffer } from 'ethereumjs-util';
import { ethers } from 'ethers';
import { Fragment } from 'ethers/lib/utils';

/* 
  Copyright (c) 2016-2018 Contributors, released under MIT License 
  https://github.com/ethereum/remix-project/blob/master/LICENSE
  */

export function parseFunctionParams(params: any): any {
  const args = [];
  // Check if parameter string starts with array or string
  let startIndex = isArrayOrStringStart(params, 0) ? -1 : 0;
  for (let i = 0; i < params.length; i++) {
    // If a quote is received
    if (params.charAt(i) === '"') {
      startIndex = -1;
      let endQuoteIndex = false;
      // look for closing quote. On success, push the complete string in arguments list
      for (let j = i + 1; !endQuoteIndex; j++) {
        if (params.charAt(j) === '"') {
          args.push(params.substring(i + 1, j));
          endQuoteIndex = true;
          i = j;
        }
        // Throw error if end of params string is arrived but couldn't get end quote
        if (!endQuoteIndex && j === params.length - 1) {
          throw new Error('invalid params');
        }
      }
    } else if (params.charAt(i) === '[') {
      // If an array/struct opening bracket is received
      startIndex = -1;
      let bracketCount = 1;
      let j;
      for (j = i + 1; bracketCount !== 0; j++) {
        // Increase count if another array opening bracket is received (To handle nested array)
        if (params.charAt(j) === '[') {
          bracketCount++;
        } else if (params.charAt(j) === ']') {
          // // Decrease count if an array closing bracket is received (To handle nested array)
          bracketCount--;
        }
        // Throw error if end of params string is arrived but couldn't get end of tuple
        if (bracketCount !== 0 && j === params.length - 1) {
          throw new Error('invalid tuple params');
        }
        if (bracketCount === 0) break;
      }
      args.push(parseFunctionParams(params.substring(i + 1, j)));
      i = j - 1;
    } else if (params.charAt(i) === ',' || i === params.length - 1) {
      // , or end of string
      // if startIndex >= 0, it means a parameter was being parsed, it can be first or other parameter
      if (startIndex >= 0) {
        let param = params.substring(
          startIndex,
          i === params.length - 1 ? undefined : i
        );
        const trimmed = param.trim();
        if (param.startsWith('0x')) param = `${param}`;
        if (/[0-9]/g.test(trimmed)) param = `${trimmed}`;
        if (typeof param === 'string') {
          if (trimmed === 'true') param = true;
          if (trimmed === 'false') param = false;
        }
        args.push(param);
      }
      // Register start index of a parameter to parse
      startIndex = isArrayOrStringStart(params, i + 1) ? -1 : i + 1;
    }
  }
  return args;
}

export function encodeParams(funABI: any, args: any) {
  const types = [];
  if (funABI.inputs && funABI.inputs.length) {
    for (let i = 0; i < funABI.inputs.length; i++) {
      const type = funABI.inputs[i].type;
      // "false" will be converting to `false` and "true" will be working
      // fine as abiCoder assume anything in quotes as `true`
      if (type === 'bool' && args[i] === 'false') {
        args[i] = false;
      }
      types.push(
        type.indexOf('tuple') === 0
          ? makeFullTypeDefinition(funABI.inputs[i])
          : type
      );
      if (args.length < types.length) {
        args.push('');
      }
    }
  }

  // NOTE: the caller will concatenate the bytecode and this
  //       it could be done here too for consistency
  const abiCoder = new ethers.utils.AbiCoder();
  return abiCoder.encode(types, args);
}

export function isArrayOrStringStart(str: string, index: number) {
  return str.charAt(index) === '"' || str.charAt(index) === '[';
}

export function sortAbiFunction(contractabi: any): Fragment[] {
  // Check if function is constant (introduced with Solidity 0.6.0)
  // @ts-expect-error ts: 2339 Property 'stateMutability' does not exist on type 'Fragment'.ts(2339)
  const isConstant = ({ stateMutability }: Fragment) =>
    stateMutability === 'view' || stateMutability === 'pure';
  // Sorts the list of ABI entries. Constant functions will appear first,
  // followed by non-constant functions. Within those t wo groupings, functions
  // will be sorted by their names.
  // @ts-expect-error: Type error: Not all code paths return a value.
  return contractabi.sort(function (a: Fragment, b: Fragment) {
    if (isConstant(a) && !isConstant(b)) {
      return 1;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    } else if (isConstant(b) && !isConstant(a)) {
      return -1;
    }
    // If we reach here, either a and b are both constant or both not; sort by name then
    // special case for fallback, receive and constructor function
    if (a.type === 'function' && typeof a.name !== 'undefined') {
      return a.name.localeCompare(b.name);
    } else if (
      a.type === 'constructor' ||
      a.type === 'fallback' ||
      a.type === 'receive'
    ) {
      return 1;
    }
  });
}

export const shortenAddress = (address: string, numCharsStartEnd?: number) => {
  const len = address.length;

  return (
    address.slice(0, numCharsStartEnd ?? 5) +
    '...' +
    address.slice(len - (numCharsStartEnd ?? 5), len)
  );
};

export const isNumeric = (value: string) => {
  return /^\+?(0|[1-9]\d*)$/.test(value);
};

export const is0XPrefixed = (value: string) => {
  return value.substr(0, 2) === '0x';
};

export const isHexadecimal = (value: string) => {
  return /^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0;
};

// @ts-expect-error TS(7030): Not all code paths return a value.
export function getReceiveInterface(abi: FuncABI[]) {
  for (let i = 0; i < abi.length; i++) {
    if (abi[i].type === 'receive') {
      return abi[i];
    }
  }
}
// @ts-expect-error TS(7030): Not all code paths return a value.
export function getFallbackInterface(abi: FuncABI[]) {
  for (let i = 0; i < abi.length; i++) {
    if (abi[i].type === 'fallback') {
      return abi[i];
    }
  }
}

export function inputParametersDeclarationToString(abiinputs: any) {
  const inputs = (abiinputs || []).map((inp: any) => inp.type + ' ' + inp.name);
  return inputs.join(', ');
}

export function encodeFunctionId(funABI: any) {
  if (funABI.type === 'fallback' || funABI.type === 'receive') return '0x';
  const abi = new ethers.utils.Interface([funABI]);
  return abi.getSighash(funABI.name);
}

export function getInputs(funABI: any): string {
  if (!funABI.inputs) {
    return '';
  }
  return inputParametersDeclarationToString(funABI.inputs);
}

export function extractSize(type: any) {
  const size = type.match(/([a-zA-Z0-9])(\[.*\])/);
  return size ? size[2] : '';
}

async function runTx(
  args: any,
  confirmationCb: any,
  continueCb: any,
  promptCb: any,
  cb: any
) {
  const getGasLimit = () => {
    return new Promise((resolve, reject) => {
      console.log('TODO: add gas handling', resolve, reject);
      // if (this.transactionContextAPI.getGasLimit) {
      //   return this.transactionContextAPI.getGasLimit(
      //     (err: any, value: any) => {
      //       if (err) return reject(err);
      //       return resolve(value);
      //     }
      //   );
      // }
      return resolve(3000000);
    });
  };
  const queryValue = () => {
    return new Promise((resolve, reject) => {
      if (args.value) {
        return resolve(args.value);
      }
      // if (args.useCall || !this.transactionContextAPI.getValue) {
      //   return resolve(0);
      // }

      console.log('TODO: handle get value', resolve, reject);

      // this.transactionContextAPI.getValue((err: any, value: any) => {
      //   if (err) return reject(err);
      //   return resolve(value);
      // });
    });
  };
  const getAccount = () => {
    return new Promise((resolve, reject) => {
      if (args.from) {
        return resolve(args.from);
      }

      console.log('TODO: handle get address', resolve, reject);
      // if (this.transactionContextAPI.getAddress) {
      //   return this.transactionContextAPI.getAddress(function (
      //     err: any,
      //     address: any
      //   ) {
      //     if (err) return reject(err);
      //     if (!address)
      //       return reject(
      //         '"from" is not defined. Please make sure an account is selected. If you are using a public node, it is likely that no account will be provided. In that case, add the public node to your injected provider (type Metamask) and use injected provider in Remix.'
      //       );
      //     return resolve(address);
      //   });
      // }
      // this.getAccounts(function (err: any, accounts: any) {
      //   if (err) return reject(err);
      //   const address = accounts[0];

      //   if (!address) return reject('No accounts available');
      //   // if (
      //   //   this.executionContext.isVM() &&
      //   //   !this.providers.vm.RemixSimulatorProvider.Accounts.accounts[address]
      //   // ) {
      //   //   return reject('Invalid account selected');
      //   // }
      //   return resolve(address);
      // });
    });
  };

  const runTransaction = async () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      let fromAddress;
      let value;
      let gasLimit;
      try {
        fromAddress = await getAccount();
        value = await queryValue();
        gasLimit = await getGasLimit();
      } catch (e) {
        reject(e);
        return;
      }

      const tx = {
        to: args.to,
        data: args.data.dataHex,
        useCall: args.useCall,
        from: fromAddress,
        value: value,
        gasLimit: gasLimit,
        timestamp: args.data.timestamp
      };
      // const payLoad = {
      //   funAbi: args.data.funAbi,
      //   funArgs: args.data.funArgs,
      //   contractBytecode: args.data.contractBytecode,
      //   contractName: args.data.contractName,
      //   contractABI: args.data.contractABI,
      //   linkReferences: args.data.linkReferences
      // };

      if (!tx.timestamp) tx.timestamp = Date.now();
      const timestamp = tx.timestamp;

      console.log('TODO: handle run transaction', resolve, reject, timestamp);

      // this.event.trigger('initiatingTransaction', [timestamp, tx, payLoad]);
      // try {
      //   this.txRunner.rawRun(
      //     tx,
      //     confirmationCb,
      //     continueCb,
      //     promptCb,
      //     async (error: any, result: any) => {
      //       if (error) {
      //         if (typeof error !== 'string') {
      //           if (error.message) error = error.message;
      //           else {
      //             try {
      //               error = 'error: ' + JSON.stringify(error);
      //             } catch (e) {
      //               console.log(e);
      //             }
      //           }
      //         }
      //         return reject(error);
      //       }

      //       const isVM = this.executionContext.isVM();
      //       if (isVM && tx.useCall) {
      //         try {
      //           result.transactionHash =
      //             await this.web3().eth.getHashFromTagBySimulator(timestamp);
      //         } catch (e) {
      //           console.log('unable to retrieve back the "call" hash', e);
      //         }
      //       }
      //       // const eventName = tx.useCall
      //       //   ? 'callExecuted'
      //       //   : 'transactionExecuted';

      //       // this.event.trigger(eventName, [
      //       //   error,
      //       //   tx.from,
      //       //   tx.to,
      //       //   tx.data,
      //       //   tx.useCall,
      //       //   result,
      //       //   timestamp,
      //       //   payLoad
      //       // ]);
      //       return resolve({ result, tx });
      //     }
      //   );
      // } catch (err: any) {
      //   let error = err;
      //   if (error && typeof error !== 'string') {
      //     if (error.message) error = error.message;
      //     else {
      //       try {
      //         error = 'error: ' + JSON.stringify(error);
      //       } catch (e) {
      //         console.log(e);
      //       }
      //     }
      //   }
      //   return reject(error);
      // }
    });
  };
  try {
    const transaction: any = await runTransaction();
    const txResult = transaction.result;
    const tx = transaction.tx;
    /*
    value of txResult is inconsistent:
        - transact to contract:
          {"receipt": { ... }, "tx":{ ... }, "transactionHash":"0x7ba4c05075210fdbcf4e6660258379db5cc559e15703f9ac6f970a320c2dee09"}
        - call to contract:
          {"result":"0x0000000000000000000000000000000000000000000000000000000000000000","transactionHash":"0x5236a76152054a8aad0c7135bcc151f03bccb773be88fbf4823184e47fc76247"}
    */
    // const isVM = this.executionContext.isVM();
    // let execResult;
    let returnValue = null;
    // if (isVM) {
    //   const hhlogs = await this.web3().eth.getHHLogsForTx(
    //     txResult.transactionHash
    //   );

    //   if (hhlogs && hhlogs.length) {
    //     let finalLogs = '<b>console.log:</b>\n';
    //     for (const log of hhlogs) {
    //       let formattedLog;
    //       // Hardhat implements the same formatting options that can be found in Node.js' console.log,
    //       // which in turn uses util.format: https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_format_format_args
    //       // For example: console.log("Name: %s, Age: %d", remix, 6) will log 'Name: remix, Age: 6'
    //       // We check first arg to determine if 'util.format' is needed
    //       if (
    //         typeof log[0] === 'string' &&
    //         (log[0].includes('%s') || log[0].includes('%d'))
    //       ) {
    //         formattedLog = format(log[0], ...log.slice(1));
    //       } else {
    //         formattedLog = log.join(' ');
    //       }
    //       finalLogs = finalLogs + '&emsp;' + formattedLog + '\n';
    //     }
    //     // _paq.push(['trackEvent', 'udapp', 'hardhat', 'console.log']);
    //     // this.call('terminal', 'log', { type: 'info', value: finalLogs });
    //   }
    //   execResult = await this.web3().eth.getExecutionResultFromSimulator(
    //     txResult.transactionHash
    //   );
    //   if (execResult) {
    //     // if it's not the VM, we don't have return value. We only have the transaction, and it does not contain the return value.
    //     returnValue = execResult
    //       ? execResult.returnValue
    //       : toBuffer(
    //           addHexPrefix(txResult.result) ||
    //             '0x0000000000000000000000000000000000000000000000000000000000000000'
    //         );
    //     const compiledContracts = await this.call(
    //       'compilerArtefacts',
    //       'getAllContractDatas'
    //     );
    //     // const vmError = txExecution.checkVMError(execResult, compiledContracts);
    //     if (vmError.error) {
    //       return cb(vmError.message);
    //     }
    //   }
    // }

    // if (!isVM && tx && tx.useCall) {
    if (tx && tx.useCall) {
      returnValue = toBuffer(addHexPrefix(txResult.result));
    }

    let address = null;
    if (txResult && txResult.receipt) {
      address = txResult.receipt.contractAddress;
    }

    cb(null, txResult, address, returnValue);
  } catch (error) {
    cb(error);
  }
}

export function makeFullTypeDefinition(typeDef: any) {
  if (typeDef && typeDef.type.indexOf('tuple') === 0 && typeDef.components) {
    const innerTypes = typeDef.components.map((innerType: any) => {
      return makeFullTypeDefinition(innerType);
    });
    return `tuple(${innerTypes.join(',')})${extractSize(typeDef.type)}`;
  }
  return typeDef.type;
}

export function decodeResponse(response: any, fnabi: any) {
  // Only decode if there supposed to be fields
  if (fnabi.outputs && fnabi.outputs.length > 0) {
    try {
      let i;
      const outputTypes = [];
      for (i = 0; i < fnabi.outputs.length; i++) {
        const type = fnabi.outputs[i].type;
        outputTypes.push(
          type.indexOf('tuple') === 0
            ? makeFullTypeDefinition(fnabi.outputs[i])
            : type
        );
      }
      if (!response || !response.length)
        response = new Uint8Array(32 * fnabi.outputs.length); // ensuring the data is at least filled by 0 cause `AbiCoder` throws if there's not engouh data
      // decode data
      const abiCoder = new ethers.utils.AbiCoder();
      const decodedObj = abiCoder.decode(outputTypes, response);

      const json = {};
      for (i = 0; i < outputTypes.length; i++) {
        const name = fnabi.outputs[i].name;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        json[i] =
          outputTypes[i] +
          ': ' +
          (name ? name + ' ' + decodedObj[i] : decodedObj[i]);
      }

      return json;
    } catch (e) {
      return { error: 'Failed to decode output: ' + e };
    }
  }
  return {};
}

export function buildData(
  // contractName: any,
  // contract: any,
  // contracts: any,
  // isConstructor: any,
  funAbi: any,
  params: any,
  callback: any
  // callbackStep: any,
  // callbackDeployLibrary: any
) {
  let funArgs: any[] = [];
  let data: Buffer | string = '';
  let dataHex = '';

  if (params.indexOf('raw:0x') === 0) {
    // in that case we consider that the input is already encoded and *does not* contain the method signature
    dataHex = params.replace('raw:0x', '');
    data = Buffer.from(dataHex, 'hex');
  } else {
    try {
      if (params.length > 0) {
        funArgs = parseFunctionParams(params);
      }
    } catch (e) {
      return callback('Error encoding arguments: ' + e);
    }
    try {
      data = encodeParams(funAbi, funArgs);
      dataHex = data.toString();
    } catch (e) {
      return callback('Error encoding arguments: ' + e);
    }
    if (data.slice(0, 9) === 'undefined') {
      dataHex = data.slice(9);
    }
    if (data.slice(0, 2) === '0x') {
      dataHex = data.slice(2);
    }
  }
  // let contractBytecode: any;
  // if (isConstructor) {
  //   contractBytecode = contract.evm.bytecode.object;
  //   let bytecodeToDeploy = contract.evm.bytecode.object;
  //   if (bytecodeToDeploy.indexOf('_') >= 0) {
  //     linkBytecode(
  //       contract,
  //       contracts,
  //       (err: any, bytecode: any) => {
  //         if (err) {
  //           callback('Error deploying required libraries: ' + err);
  //         } else {
  //           bytecodeToDeploy = bytecode + dataHex;
  //           return callback(null, {
  //             dataHex: bytecodeToDeploy,
  //             funAbi,
  //             funArgs,
  //             contractBytecode,
  //             contractName: contractName
  //           });
  //         }
  //       }
  //       // callbackStep,
  //       // callbackDeployLibrary
  //     );
  //     return;
  //   } else {
  //     dataHex = bytecodeToDeploy + dataHex;
  //   }
  // } else {
  dataHex = encodeFunctionId(funAbi) + dataHex;
  // }
  callback(null, {
    dataHex,
    funAbi,
    funArgs
    // contractBytecode,
    // contractName: contractName
  });
}

export const confirmationHandler = (
  plugin: any,
  dispatch: React.Dispatch<any>,
  confirmDialogContent: any,
  network: any,
  tx: any,
  gasEstimation: any,
  continueTxExecution: any,
  cancelCb: any
) => {
  if (network.name !== 'Main') {
    return continueTxExecution(null);
  }
  const amount = plugin.blockchain.fromWei(tx.value, true, 'ether');
  const content = confirmDialogContent(
    tx,
    network,
    amount,
    gasEstimation,
    plugin.blockchain.determineGasFees(tx),
    plugin.blockchain.determineGasPrice.bind(plugin.blockchain)
  );

  console.log(
    'confirmed transaction',
    plugin,
    dispatch,
    confirmDialogContent,
    network,
    tx,
    gasEstimation,
    continueTxExecution,
    cancelCb,
    content
  );

  // dispatch(
  // displayNotification(
  //   'Confirm transaction',
  //   content,
  //   'Confirm',
  //   'Cancel',
  //   () => {
  //     plugin.blockchain.config.setUnpersistedProperty(
  //       'doNotShowTransactionConfirmationAgain',
  //       plugin.REACT_API.confirmSettings
  //     );
  //     // TODO: check if this is check is still valid given the refactor
  //     if (!plugin.REACT_API.gasPriceStatus) {
  //       cancelCb('Given transaction fee is not correct');
  //     } else {
  //       continueTxExecution({
  //         maxFee: plugin.REACT_API.maxFee,
  //         maxPriorityFee: plugin.REACT_API.maxPriorityFee,
  //         baseFeePerGas: plugin.REACT_API.baseFeePerGas,
  //         gasPrice: plugin.REACT_API.gasPrice
  //       });
  //     }
  //   },
  //   () => {
  //     return cancelCb('Transaction canceled by user.');
  //   }
  // )
};

export const continueHandler = (
  dispatch: React.Dispatch<any>,
  // gasEstimationPrompt: (msg: string) => JSX.Element,
  error: any,
  continueTxExecution: any,
  cancelCb: any
) => {
  if (error) {
    const msg = typeof error !== 'string' ? error.message : error;

    console.log(
      'continueHandler',
      dispatch,
      // gasEstimationPrompt,
      msg,
      cancelCb
    );
    // dispatch(
    //   displayNotification(
    //     'Gas estimation failed',
    //     gasEstimationPrompt(msg),
    //     'Send Transaction',
    //     'Cancel Transaction',
    //     () => {
    //       continueTxExecution();
    //     },
    //     () => {
    //       cancelCb();
    //     }
    //   )
    // );
  } else {
    continueTxExecution();
  }
};

export const promptHandler = (
  dispatch: React.Dispatch<any>,
  // passphrasePrompt: any,
  okCb: any,
  cancelCb: any
) => {
  console.log('promptHandler', dispatch, okCb, cancelCb);
  // dispatch(
  //   displayNotification(
  //     'Passphrase requested',
  //     passphrasePrompt(
  //       'Personal mode is enabled. Please provide passphrase of account'
  //     ),
  //     'OK',
  //     'Cancel',
  //     okCb,
  //     cancelCb
  //   )
  // );
};

export function runOrCallContractMethod(
  contractName: any,
  contractAbi: any,
  funABI: any,
  contract: any,
  value: any,
  address: any,
  callType: any,
  lookupOnly: any,
  logMsg: any,
  logCallback: any,
  outputCb: any,
  confirmationCb: any,
  continueCb: any,
  promptCb: any
) {
  // contractsDetails is used to resolve libraries
  buildData(
    // contractName,
    // contractAbi,
    // {},
    // false,
    funABI,
    callType,
    (error: any, data: any) => {
      if (error) {
        console.log('error', error);
        // return logCallback(
        //   `${logMsg} errored: ${error.message ? error.message : error}`
        // );
      }
      if (!lookupOnly) {
        console.log('!lookup', logMsg);
        // logCallback(`${logMsg} pending ... `);
      } else {
        console.log('log', logMsg);
        // logCallback(`${logMsg}`);
      }
      // if (funABI.type === 'fallback') data.dataHex = value;

      if (data) {
        data.contractName = contractName;
        data.contractABI = contractAbi;
        data.contract = contract;
      }
      const useCall =
        funABI.stateMutability === 'view' || funABI.stateMutability === 'pure';
      console.log('before run call', useCall);
      runTx(
        { to: address, data, useCall },
        confirmationCb,
        continueCb,
        promptCb,
        (error: any, txResult: any, _address: any, returnValue: any) => {
          if (error) {
            console.log('error', error);
            // return logCallback(
            //   `${logMsg} errored: ${error.message ? error.message : error}`
            // );
          }
          if (lookupOnly) {
            console.log('tx return value w/ lookup', returnValue);
            // outputCb(returnValue);
          }
        }
      );
    }
    // (msg: any) => {
    //   console.log('msg', msg);
    //   // logCallback(msg);
    // },
    // (data: any, runTxCallback: any) => {
    //   // called for libraries deployment
    //   console.log('data and runTxCallback', data, runTxCallback);
    //   // runTx(data, confirmationCb, runTxCallback, promptCb, () => {
    //   //   /* Do nothing. */
    //   // });
    // }
  );
}

export const setDecodedResponse = (
  instanceIndex: number,
  response: any,
  funcIndex?: number
) => {
  return {
    type: 'SET_DECODED_RESPONSE',
    payload: {
      instanceIndex,
      funcIndex,
      response
    }
  };
};

export const runTransactions = (
  plugin: any,
  dispatch: React.Dispatch<any>,
  instanceIndex: number,
  lookupOnly: boolean,
  funcABI: FuncABI,
  inputsValues: string,
  contractName: string,
  contractABI: any,
  contract: any,
  address: any,
  logMsg: string,
  mainnetPrompt: any,
  // gasEstimationPrompt: (msg: string) => JSX.Element,
  // passphrasePrompt: (msg: string) => JSX.Element,
  funcIndex?: number
) => {
  let callinfo = '';
  if (lookupOnly) callinfo = 'call';
  else callinfo = 'transact';
  console.log('callinfo', callinfo);
  // _paq.push([
  //   'trackEvent',
  //   'udapp',
  //   callinfo,
  //   plugin.blockchain.getCurrentNetworkStatus().network.name
  // ]);

  const params = funcABI.type !== 'fallback' ? inputsValues : '';
  runOrCallContractMethod(
    contractName,
    contractABI,
    funcABI,
    contract,
    inputsValues,
    address,
    params,
    lookupOnly,
    logMsg,
    (msg: any) => {
      console.log('msg', msg);
      // const log = logBuilder(msg);
      // return terminalLogger(plugin, log);
    },
    (returnValue: any) => {
      const response = decodeResponse(returnValue, funcABI);

      dispatch(setDecodedResponse(instanceIndex, response, funcIndex));
    },
    (
      network: any,
      tx: any,
      gasEstimation: any,
      continueTxExecution: any,
      cancelCb: any
    ) => {
      console.log(
        'confirmationHandler log',
        network,
        tx,
        gasEstimation,
        continueTxExecution,
        cancelCb
      );
      confirmationHandler(
        plugin,
        dispatch,
        mainnetPrompt,
        network,
        tx,
        gasEstimation,
        continueTxExecution,
        cancelCb
      );
    },
    (error: any, continueTxExecution: any, cancelCb: any) => {
      console.log('continue handler log', error, continueTxExecution, cancelCb);
      continueHandler(
        dispatch,
        // gasEstimationPrompt,
        error,
        continueTxExecution,
        cancelCb
      );
    },
    (okCb: any, cancelCb: any) => {
      console.log('prompt handler log', okCb, cancelCb);
      promptHandler(
        dispatch,
        // passphrasePrompt,
        okCb,
        cancelCb
      );
    }
  );
};
