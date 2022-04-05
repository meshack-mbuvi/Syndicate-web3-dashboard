export const estimateGas = async (web3) => {
  return await web3.eth.getGasPrice().then((value) => {
    return value;
  });
};
