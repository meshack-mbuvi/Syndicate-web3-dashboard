export const estimateGas = async (web3: any) =>
  await web3.eth.getGasPrice().then((value: any) => value);
