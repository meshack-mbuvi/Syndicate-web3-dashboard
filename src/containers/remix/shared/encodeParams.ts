// import qs from 'qs';

import { FunctionFragment } from 'ethers/lib/utils';

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

export function parseValue(val: any): any {
  if (typeof val == 'undefined' || val == '') {
    return null;
  } else if (val === 'false' || val === 'true') {
    return val === 'true';
  } else if (Array.isArray(val)) {
    // handle deeply-nested array data (like `proof` for a merkle `claim` fn)
    return val.map((subValue: any) => parseValue(subValue));
  } else if (val.constructor === Object) {
    return parseObject(val);
  } else if (isDecimalNumber(val)) {
    return Number(val);
  }
  return val;
}

// const qsOptions: qs.IStringifyOptions = {
//   delimiter: ','
// };
// export class EncodeURIComponent {
//   /**
//    * Encode a [deeply] nested object for use in a url
//    * Assumes Array.each is defined
//    */
//   public static encode(queryObj: Array<unknown>): string {
//     return qs.stringify(queryObj, qsOptions);
//   }
//   public static decode(str: string): Array<unknown> {
//     const vals = Object.values(qs.parse(str, qsOptions));
//     return vals.map((val) => {
//       return parseValue(val);
//     });
//   }
// }

export const encodeParams = (
  params: Record<string, string>,
  fnParams: Record<string, any>,
  abiLeaf: FunctionFragment,
  pathPrefix: string,
  otherQueryParams: string
): string => {
  const query = new URLSearchParams(params).toString();
  if (Object.values(fnParams).length > 0) {
    const encodeableValues: string = Object.entries(fnParams)
      .filter(
        // remove empty strings
        ([, val]) => !(typeof val === 'string' && val.length === 0)
      )
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
      .map(([, value]) => value)
      .join();

    return `${pathPrefix}?${otherQueryParams}&${query}&fnParams=${encodeURIComponent(
      encodeableValues
    )}`;
  }
  return `${pathPrefix}?${otherQueryParams}&${query}`;
};

export const computeEncodedUrl = (
  params: {
    mode: string;
    chainName: string;
    fn: string;
    contractAddress: string;
    fnParams: Record<string, any>;
    abiLeaf: FunctionFragment;
  },
  prefix: string,
  otherQueryParams: string
): string => {
  const { mode, fn, contractAddress, fnParams, chainName, abiLeaf } = params;
  if (params.fn) {
    const encodedFnParams: Record<string, any> = { ...fnParams };
    Object.entries(fnParams).forEach(([key, value]) => {
      // stringified array
      if (value.startsWith?.('[') && value.endsWith?.(']')) {
        encodedFnParams[key] = JSON.parse(value);
      }
    });
    const url = encodeParams(
      {
        mode,
        chainName,
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
