import axios from 'axios';

export const getGnosisTxnInfo = async (txHash: any, activeNetwork: any) => {
  // eslint-disable-next-line no-async-promise-executor
  const transactionInfo = await new Promise(async (resolve, reject) => {
    let status;
    let txnInfo;

    function sleep(ms: any) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (status !== true && status !== false) {
      await sleep(10000);
      await axios
        .get(
          `${activeNetwork.gnosis.txServiceUrl}multisig-transactions/${txHash}`
        )
        .then(
          async (response) => {
            const result = response.data;
            // resolve(result);
            status = result.isSuccessful;
            txnInfo = result;
          },
          async (error) => {
            console.log(error);
          }
        );
    }

    if (status) {
      resolve(txnInfo);
    } else {
      reject(txnInfo);
    }
  });

  return transactionInfo;
};
