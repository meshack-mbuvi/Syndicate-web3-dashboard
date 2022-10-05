export const estimateGas = async (web3: any): Promise<string> =>
  await web3.eth.getGasPrice().then((value: any) => value);
