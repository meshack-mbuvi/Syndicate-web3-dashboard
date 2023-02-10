import axios from 'axios';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface GnosisTxInfo {
  transactionHash: string;
  blockNumber: number | undefined;
  isSuccessful: boolean;
}

export const getGnosisTxnInfo = async (
  txHash: string,
  activeNetwork: any
): Promise<GnosisTxInfo> => {
  const transactionInfo = await new Promise<GnosisTxInfo>(
    async (resolve, reject) => {
      let status: boolean | undefined;
      let txnInfo: GnosisTxInfo | undefined;

      while (status !== true && status !== false) {
        await sleep(10000);
        await axios
          .get(
            `${activeNetwork.gnosis.txServiceUrl}multisig-transactions/${txHash}`
          )
          .then(
            async (response) => {
              const result = response.data as GnosisTxInfo;
              status = result.isSuccessful;
              txnInfo = result;
            },
            async (error) => {
              console.log(error);
            }
          );
      }

      if (status) {
        resolve(txnInfo as GnosisTxInfo);
      } else {
        reject(txnInfo);
      }
    }
  );

  return transactionInfo;
};
