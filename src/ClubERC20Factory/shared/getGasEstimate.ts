export const estimateGas = async (web3) =>
  await web3.eth.getGasPrice().then((value) => value);
