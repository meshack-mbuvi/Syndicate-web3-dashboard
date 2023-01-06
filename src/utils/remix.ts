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
  // followed by non-constant functions. Within those two groupings, functions
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
