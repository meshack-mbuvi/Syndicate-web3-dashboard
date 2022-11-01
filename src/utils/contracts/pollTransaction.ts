/**
 * This function is used to poll a transaction with a specified transaction
 * until the transaction has been completed successfully.
 * @param transactionHash
 * @param callBack
 */
export const pollTransaction = (
  web3: any,
  transactionHash: string,
  callBack: (status: any) => void
): any => {
  if (!web3) return 0;

  const intervalId = setInterval(async () => {
    const receipt = await web3.eth.getTransactionReceipt(transactionHash);

    if (receipt) {
      clearInterval(intervalId);
      callBack(receipt?.status);
    }
  }, 10000); // 10 seconds

  return intervalId;
};
