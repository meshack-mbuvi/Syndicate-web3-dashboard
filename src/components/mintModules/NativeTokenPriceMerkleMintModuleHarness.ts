import { NativeTokenPriceMerkleMintModule } from '@/ClubERC20Factory/NativeTokenPriceMerkleMintModule';
import { getBasicMerkleProofQuery } from '@/graphql/backend_queries';

import { ApolloClient, ApolloQueryResult } from '@apollo/client';
import MintModuleHarness from './MintModuleHarness';

class NativeTokenPriceMerkleMintModuleHarness implements MintModuleHarness {
  collectiveAddress: string;
  nativeTokenPriceMerkleMintModule: NativeTokenPriceMerkleMintModule;
  apolloClient: ApolloClient<any>;
  isInitialized: boolean;
  mintPrice: string;
  merkleRoot: string;
  proof: string[];

  constructor(
    collectiveAddress: string,
    nativeTokenPriceMerkleMintModule: NativeTokenPriceMerkleMintModule,
    apolloClient: ApolloClient<any>
  ) {
    this.collectiveAddress = collectiveAddress;
    this.nativeTokenPriceMerkleMintModule = nativeTokenPriceMerkleMintModule;
    this.apolloClient = apolloClient;
    this.isInitialized = false;
    this.mintPrice = '0';
    this.merkleRoot = '';
    this.proof = [];
  }

  public async getContractValues(collective: string): Promise<void> {
    const results = await Promise.all<string>([
      this.nativeTokenPriceMerkleMintModule.nativePrice(collective),
      this.nativeTokenPriceMerkleMintModule.merkleRoot(collective)
    ]);

    this.mintPrice = results[0] || '0';
    this.merkleRoot = results[1] || '';
  }

  /**
   *
   * @param memberAddress The address of the member to get the proof for
   * @returns The account and
   */
  public async getProof(memberAddress: string): Promise<
    ApolloQueryResult<{
      getBasicMerkleProof: {
        account: string;
        proof: string[];
      };
    }>
  > {
    return await this.apolloClient.query({
      query: getBasicMerkleProofQuery,
      variables: {
        account: memberAddress,
        merkleRoot: this.merkleRoot
      }
    });
  }

  /**
   * Given a member adddress, fetch the proof and set the proof and account
   * @param memberAddress The address of the member to fetch the proof for
   * @returns
   */
  public async isEligible(memberAddress: string): Promise<{
    isEligible: boolean;
    reason?: string;
  }> {
    // Shadow commit
    if (this.isInitialized && this.merkleRoot == '') {
      return { isEligible: false, reason: 'Merkle root not set on contract' };
    } else {
      await this.getContractValues(this.collectiveAddress);
      if (this.merkleRoot == '') {
        return { isEligible: false, reason: 'Merkle root not set on contract' };
      }

      this.proof = await this.getProof(memberAddress)
        .then((res) => {
          return res.data?.getBasicMerkleProof.proof;
        })
        .catch(() => []);
      return this.proof.length == 0
        ? { isEligible: false, reason: 'No proof found' }
        : { isEligible: true };
    }
  }

  public async args(account: string): Promise<any[]> {
    if (await this.isEligible(account)) {
      return [this.collectiveAddress, this.proof, 1];
    }

    return [this.collectiveAddress, [], 1];
  }

  public async mint(
    tokenAddress: string,
    account: string,
    onTxConfirm: (hash: string) => void,
    onTxReceipt: () => void,
    onTxFail: (error: string) => void,
    amount?: string
  ): Promise<void> {
    await this.nativeTokenPriceMerkleMintModule.mint(
      account,
      this.mintPrice,
      tokenAddress,
      this.proof,
      amount ? amount : '1', // Default to mint a single token
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }
}

export default NativeTokenPriceMerkleMintModuleHarness;
