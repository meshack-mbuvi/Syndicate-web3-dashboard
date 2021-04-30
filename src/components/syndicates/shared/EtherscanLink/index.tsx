import { ExternalLinkIcon } from "src/components/iconWrappers";

interface LinkProp {
  contractAddress: string | string[];
}

/** Link used to redirect the user to the Etherscan
 * This could point to either the syndicate contract
 * or the token contract when token transactions are involved.
 */
export const EtherscanLink = (props: LinkProp) => {
  const { contractAddress } = props;
  return (
    <a
      href={`https://etherscan.io/address/${contractAddress}`}
      target="_blank"
      className="text-blue-cyan px-2 flex"
      rel="noreferrer"
    >
      view on etherscan <ExternalLinkIcon className="ml-2" />
    </a>
  );
};
