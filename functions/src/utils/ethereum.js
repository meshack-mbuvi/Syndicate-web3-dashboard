import Web3 from "web3-eth";

const { ETH_API_URL } = process.env;

const web3 = new Web3(ETH_API_URL);

const signatureObjectSchema = {
  messageHash: (value) => /0x[a-z|0-9]+/.test(value),
  v: (value) => /0x[a-z|0-9]{2}/.test(value),
  r: (value) => /0x[a-z|0-9]+/.test(value),
  s: (value) => /0x[a-z|0-9]+/.test(value),
};
const messageSignatureSchema = {
  message: (value) => typeof value === "string",
  signature: (value) => /0x[a-z|0-9]+/.test(value),
};
const validate = (object, schema) =>
  Object.keys(schema)
    .filter((key) => !schema[key](object[key]))
    .map((key) => `${key} is missing or invalid.`);

export async function verifyMessageSignature(data) {
  /**
   * This function receives either of the following paramaters
   * and returns the signing Address of provided message
   * Option 1:
   *  Signature Object
   *  {
   *    messageHash: '0x...',
   *    v: '0x...'
   *    r: '0x..'
   *    s: '0x..'
   * }
   * Option 2:
   *  Message + Signature
   *  {
   *    message: '<Message Text>',
   *    signature: '0x..',
   *    preFixed: true | false
   * }
   * The preFixed parameter is optional because web3.js checks for this.
   * https://github.com/ChainSafe/web3.js/blob/5d027191c5cb7ffbcd44083528bdab19b4e14744/packages/web3-eth-accounts/src/index.js#L343
   */
  const signatureObjectErrors = validate(data, signatureObjectSchema);
  const messageSignatureErrors = validate(data, messageSignatureSchema);

  if (signatureObjectErrors.length == 0) {
    const signingAddress = await web3.accounts.recover(data);
    return { signingAddress };
  } else if (messageSignatureErrors.length == 0) {
    const signingAddress = await web3.accounts.recover(
      data.message,
      data.signature
    );
    return { signingAddress };
  } else {
    const message = `
    Invalid input use one of the below formats:
    Option #1 {
      messageHash: '0x...',
      v: '0x...'
      r: '0x..'
      s: '0x..'
    }
    Option #2 {
       message: '<Message Text>',
       signature: '0x..',
       preFixed: true | false
    }
    `;
    return { message };
  }
}
