import { FunctionFragment } from 'ethers/lib/utils';
import qs from 'qs';

/* 
  Largely pased on helper functions from remix project and txn.xyz
  Copyright (c) 2016-2018 Contributors, released under MIT License 
  https://github.com/ethereum/remix-project/blob/master/LICENSE
  Copyright (c) 2022 Dawson Botsford
  https://github.com/dawsbot/txn.xyz/blob/master/LICENSE
  */

export const cleanupInputValue = (value: string): string =>
  value
    .trim()
    .replace(/^["|']/, '')
    .replace(/["|']$/, '');

export const getMultiValsString = (
  fields: Record<string, string | number | boolean>
): string[] | undefined => {
  const entries = Object.entries(fields);
  const valArrayTest: string[] = [];

  for (let j = 0; j < entries.length; j++) {
    const elVal = entries[j] ? entries[j][1] : '';
    valArrayTest.push(elVal.toString());
  }
  const valStringTest = valArrayTest.join('');

  if (valStringTest) {
    return valArrayTest;
  } else {
    return undefined;
  }
};

function isDecimalNumber(val: any) {
  if (val.startsWith?.('0x')) {
    return false;
  }
  return !isNaN(parseFloat(val)) && isFinite(val);
}

function parseObject(obj: any) {
  const result: Record<any, any> = {};
  let key, val;
  for (key in obj) {
    val = parseValue(obj[key]);
    if (val !== null) result[key] = val; // ignore null values
  }
  return result;
}

export function parseValue(val: any): string | string[] {
  if (typeof val == 'undefined' || val == '') {
    return '';
  } else if (val === 'false' || val === 'true') {
    return (val === 'true').toString();
  } else if (Array.isArray(val)) {
    // handle deeply-nested array data (like `proof` for a merkle `claim` fn)
    return val.map((subValue: any) => parseValue(subValue)).toString();
  } else if (val.startsWith?.('[') && val.endsWith?.(']')) {
    return JSON.parse(val.replace(/'/g, '"'));
  } else if (val.constructor === Object) {
    return parseObject(val).toString();
  } else if (isDecimalNumber(val)) {
    return Number(val).toString();
  }
  return val + '';
}

const qsOptions: qs.IStringifyOptions = {
  delimiter: ';'
};
export class EncodeURIComponent {
  /**
   * Encode a [deeply] nested object for use in a url
   */
  public static encode(queryObj: Array<unknown>): string {
    return qs.stringify(queryObj, qsOptions);
  }
  public static decode(str: string): Array<unknown> {
    const vals = Object.values(qs.parse(str, qsOptions));
    return vals;
  }
}

export const encodeParams = (
  params: Record<string, string>,
  fnParams: Record<string, any>,
  abiLeaf: FunctionFragment,
  pathPrefix: string,
  otherQueryParams: string
): string => {
  const query = new URLSearchParams(params).toString();
  if (Object.values(fnParams).length > 0) {
    const encodeableValues: Array<string> = Object.entries(fnParams)
      //assumes that we want placeholders in case not all fields are filled out
      // .filter(
      //   // remove empty strings
      //   ([, val]) => !(typeof val === 'string' && val.length === 0)
      // )
      .sort(
        // sort params to smart-contract ordering
        ([keyA], [keyB]) => {
          const firstIndex = abiLeaf.inputs.findIndex(
            (input) => input.name === keyA
          );
          const secondIndex = abiLeaf.inputs.findIndex(
            (input) => input.name === keyB
          );

          const i = firstIndex - secondIndex;
          return i;
        }
      )
      .map(([, value]) => value);

    return `${pathPrefix}?${otherQueryParams}&${query}&fnParams=${EncodeURIComponent.encode(
      encodeableValues
    )}`;
  }
  return `${pathPrefix}?${otherQueryParams}&${query}`;
};

export const computeEncodedUrl = (
  params: {
    mode: string;
    fn: string;
    contractAddress: string;
    fnParams: Record<string, any>;
    abiLeaf: FunctionFragment;
  },
  prefix: string,
  otherQueryParams: string
): string => {
  const { mode, fn, contractAddress, fnParams, abiLeaf } = params;
  if (params.fn) {
    const encodedFnParams: Record<string, any> = { ...fnParams };
    Object.entries(fnParams).forEach(([key, value]) => {
      // stringified array
      if (value.startsWith?.('[') && value.endsWith?.(']')) {
        try {
          encodedFnParams[key] = JSON.parse(value);
        } catch {
          encodedFnParams[key] = value.toString();
        }
      }
    });
    const url = encodeParams(
      {
        mode,
        contractAddress,
        fn
      },
      encodedFnParams,
      abiLeaf,
      prefix,
      otherQueryParams
    );
    return url;
  }
  return '';
};

export const mapValueToPlaceholder = (type: string): string => {
  switch (type) {
    case type.startsWith('uint') ? type : '':
      return '0';
      break;
    case 'address':
      return '0x...';
      break;
    case 'address[]':
      return '["0x...", "0x..."]';
      break;
    default:
      return type;
  }
};
