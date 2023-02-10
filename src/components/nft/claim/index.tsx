import { ERC721Contract } from '@/ClubERC20Factory/ERC721Membership';
import useFetchERC721Claim from '@/hooks/useClaimedERC721';
import useFetchAirdropInfo from '@/hooks/useERC721AirdropInfo';
import useFetchERC721MerkleProof from '@/hooks/useERC721MerkleProof';
import useFetchERC721PublicClaim from '@/hooks/usePublicClaimedERC721';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { AppState } from '@/state';
import {
  clearERC721TokenDetails,
  setERC721Loading,
  setERC721TokenContract,
  setERC721TokenDetails
} from '@/state/erc721token/slice';
import { ERC721Token } from '@/state/erc721token/types';
import { getNativeTokenPrice } from '@/utils/api/transactions';
import { getWeiAmount } from '@/utils/conversions';
import { numberWithCommas } from '@/utils/formattedNumbers';
import { getFirstOrString } from '@/utils/stringUtils';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'react-tooltip-lite';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import ClaimCard from './claimCard';
import NFTCard from './nftCard';

const ClaimNFT: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3, activeNetwork }
    },
    erc721TokenSliceReducer: { erc721Token }
  } = useSelector((state: AppState) => state);

  const { loading: merkleLoading } = useFetchERC721MerkleProof();
  const { loading: claimedLoading } = useFetchERC721Claim();
  const { loading: airdropLoading } = useFetchAirdropInfo();
  const { loading: claimedPublicLoading } = useFetchERC721PublicClaim();
  const { loading: erc721Loading } = erc721Token;

  const [openseaLink, setOpenseaLink] = useState<string>('');
  const [explorerLink, setExplorerLink] = useState<string>('');
  const [unMinted, setUnMinted] = useState<number>(0);

  const [nativeBalance, setNativeBalance] = useState('');
  const [rawNativeBalance, setRawNativeBalance] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [currentAccount, setCurrentAccount] = useState<string>(' ');
  const [loading, setLoading] = useState<boolean>(true);
  const [loading721, setLoading721] = useState<boolean>(true);

  const nftAddress = getFirstOrString(router.query.nftAddress) || '';

  const updateMinted = (amount: number): void => {
    setUnMinted(unMinted - amount);
  };

  useEffect(() => {
    if (
      !airdropLoading &&
      !merkleLoading &&
      !claimedLoading &&
      !erc721Loading &&
      !claimedPublicLoading &&
      !loading721
    ) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [
    airdropLoading,
    merkleLoading,
    claimedLoading,
    erc721Loading,
    claimedPublicLoading,
    loading721
  ]);

  useEffect(() => {
    if (
      erc721Token.address &&
      nftAddress &&
      erc721Token.publicUtilityClaimEnabled
    ) {
      let collection = 'rug-radio-membership-pass';

      if (erc721Token.publicUtilityClaimEnabled) {
        collection = 'ruggenesis-nft';
      }
      setExplorerLink(
        `${activeNetwork.blockExplorer.baseUrl}/${erc721Token.address}`
      );

      setOpenseaLink(`https://opensea.io/collection/${collection}`);
    }
  }, [erc721Token.address, nftAddress, erc721Token.publicUtilityClaimEnabled]);

  const getNativeBalance = async (): Promise<void> => {
    if (account && web3) {
      const balance = await web3.eth.getBalance(account);
      const nativeBalance = await web3.utils.fromWei(balance, 'ether');
      setNativeBalance(nativeBalance);
      setRawNativeBalance(balance);
    }
  };

  useEffect(() => {
    void getNativeBalance();
  }, [account]);

  const getERC721TokenDetails = async (ERC721tokenContract: ERC721Contract) => {
    const { address } = ERC721tokenContract;
    const { mintPolicyERC721, PublicMintWithFeeModule } = syndicateContracts;

    const [name, owner, symbol, rendererAddr, currentSupply] =
      await Promise.all([
        ERC721tokenContract.name(),
        ERC721tokenContract.owner(),
        ERC721tokenContract.symbol(),
        ERC721tokenContract.rendererAddr(),
        ERC721tokenContract.currentSupply()
      ]).catch(() => Array(5).fill('') as string[]);

    const PUBLIC_ONE_PER_ADDRESS_MODULE =
      CONTRACT_ADDRESSES[activeNetwork.chainId]?.OnePerAddressMintModule;

    const PUBLIC_UTILITY_MINT_MODULE =
      CONTRACT_ADDRESSES[activeNetwork.chainId]?.UtilityMintModule;

    const tokenPrice = await getNativeTokenPrice(activeNetwork.chainId);
    let publicUtilityClaimEnabled = false;
    let publicSingleClaimEnabled = false;
    let merkleClaimEnabled = true;
    let publicSupply = 0;
    let nativePrice = '0';
    let maxPerAddress = 0;
    let defaultImage = ' ';
    let amountMinted = 0;
    let _startTime;
    if (address) {
      publicSingleClaimEnabled = await mintPolicyERC721.isModuleAllowed(
        address,
        PUBLIC_ONE_PER_ADDRESS_MODULE
      );

      // publicUtilityClaimEnabled = true;
      publicUtilityClaimEnabled = await mintPolicyERC721.isModuleAllowed(
        address,
        PUBLIC_UTILITY_MINT_MODULE
      );

      defaultImage =
        'https://daiakrtkievq7ofrm5xaoecjyjfmsybdd2nxxdm5ey74a4ku6ama.arweave.net/GBAFRmpBKw-4sWduBxBJwkrJYCMem3uNnSY_wHFU8Bg';

      publicSupply = 19000;

      if (publicUtilityClaimEnabled) {
        publicSingleClaimEnabled = false;
        merkleClaimEnabled = false;

        // get info bout the mint
        [publicSupply, nativePrice, amountMinted, maxPerAddress, _startTime] =
          await Promise.all([
            Number(await PublicMintWithFeeModule.publicSupply(address)),
            await PublicMintWithFeeModule.nativePrice(address),
            Number(
              await PublicMintWithFeeModule.amountMinted(address, account)
            ),
            Number(await PublicMintWithFeeModule.maxPerAddress(address)),
            Number(await PublicMintWithFeeModule.startTime(address))
          ]);

        setStartTime(_startTime);
        defaultImage =
          'https://gateway.pinata.cloud/ipfs/Qma5cZH8yBaSYtqAYW5TUbGdm4YrfZ1YXQUnNeFeYVKjsB';
      } else if (publicSingleClaimEnabled) {
        merkleClaimEnabled = false;
      }
    }

    const erc721: ERC721Token = {
      address,
      name,
      symbol,
      owner,
      maxSupply: publicSupply,
      currentSupply: Number(currentSupply),
      publicSupply,
      rendererAddr,
      loading: false,
      merkleClaimEnabled,
      publicSingleClaimEnabled,
      publicUtilityClaimEnabled,
      nativePrice,
      mintPrice: Number(getWeiAmount(nativePrice, 18, false)),
      priceUSD: parseFloat(
        (
          parseFloat(String(tokenPrice)) *
          parseFloat(String(getWeiAmount(nativePrice, 18, false)))
        ).toFixed(2)
      ),
      maxPerAddress,
      defaultImage,
      amountMinted
    };
    dispatch(setERC721TokenDetails(erc721));
    dispatch(setERC721Loading(false));
    setLoading721(false);
  };

  useEffect(() => {
    if (
      account !== currentAccount &&
      router.isReady &&
      web3?.utils &&
      web3?.utils.isAddress(nftAddress) &&
      syndicateContracts?.MerkleDistributorModuleERC721 &&
      // @ts-expect-error TS(2341): Property '_address' is private and only accessible... Remove this comment to see the full error message
      syndicateContracts?.mintPolicyERC721?.mintPolicyERC721Contract._address &&
      syndicateContracts?.PublicMintWithFeeModule
    ) {
      const ERC721tokenContract = new ERC721Contract(
        nftAddress as string,
        web3
      );
      setCurrentAccount(account);
      dispatch(setERC721TokenContract(ERC721tokenContract));
      dispatch(setERC721Loading(true));
      setLoading721(true);
      // get token details
      try {
        void getERC721TokenDetails(ERC721tokenContract);
        return;
      } catch (error) {
        return () => {
          dispatch(clearERC721TokenDetails());
        };
      }
    } else {
      return () => {
        dispatch(clearERC721TokenDetails());
      };
    }
  }, [
    nftAddress,
    account,
    currentAccount,
    router.isReady,
    syndicateContracts?.MerkleDistributorModuleERC721,
    // @ts-expect-error TS(2341): Property '_address' is private and only accessible... Remove this comment to see the full error message
    syndicateContracts?.mintPolicyERC721?.mintPolicyERC721Contract._address,
    syndicateContracts?.PublicMintWithFeeModule,
    web3?.utils
  ]);

  useEffect(() => {
    setUnMinted(erc721Token.maxSupply - erc721Token.currentSupply);
  }, [erc721Token.currentSupply]);

  return (
    <div className="w-full flex justify-center px-25.5">
      {loading ? (
        <div className="flex md:justify-between sm:justify-center w-full max-w-5.5xl md:flex-nowrap sm:flex-wrap">
          <div className="md:max-w-480 md:mb-0 sm:mb-8 md:w-5.21/12 sm:w-full">
            <div className="mb-14">
              <div className="h4 leading-4 mb-4 text-sm uppercase">
                <SkeletonLoader
                  width="20"
                  height="5"
                  borderRadius="rounded-1.5lg"
                />
              </div>
              <div className="flex space-x-6">
                <SkeletonLoader
                  width="full"
                  height="14"
                  borderRadius="rounded-1.5lg"
                />
              </div>
            </div>
            <div>
              <div className="mb-10 flex justify-between">
                <div className="w-1/2">
                  <SkeletonLoader
                    width="4/5"
                    height="16"
                    borderRadius="rounded-1.5lg"
                  />
                </div>
                <div className="w-1/2">
                  <SkeletonLoader
                    width="4/5"
                    height="16"
                    borderRadius="rounded-1.5lg"
                  />
                </div>
              </div>
              <SkeletonLoader
                width="full"
                height="60"
                borderRadius="rounded-1.5lg"
              />
            </div>
          </div>
          <SkeletonLoader
            width="100"
            height="100"
            borderRadius="rounded-1.5lg"
          />
        </div>
      ) : (
        <div className="flex md:justify-between sm:justify-center w-full max-w-5.5xl md:flex-nowrap sm:flex-wrap">
          <div className="md:max-w-480 md:mb-0 sm:mb-8 md:w-5.21/12 sm:w-full">
            <div className="mb-14">
              <div className="h4 leading-4 mb-4 text-sm uppercase">
                claim nft
              </div>
              <div className="flex space-x-6">
                <div className="text-4.5xl h1 leading-11.5">
                  {erc721Token.name}
                </div>
                <div className="align-center flex space-x-4 items-center">
                  {openseaLink && (
                    <a href={openseaLink} target="_blank" rel="noreferrer">
                      <Tooltip
                        content={<div>View collection on Opensea</div>}
                        arrow={false}
                        tipContentClassName="actionsTooltip"
                        background="#232529"
                        padding="12px 16px"
                        distance={13}
                      >
                        <img
                          className="h-4 w-4"
                          src="/images/nftClaim/opensea.svg"
                          alt="checkmark"
                        />
                      </Tooltip>
                    </a>
                  )}
                  <a href={explorerLink} target="_blank" rel="noreferrer">
                    <Tooltip
                      content={
                        <div>
                          View contract on {activeNetwork.blockExplorer.name}
                        </div>
                      }
                      arrow={false}
                      tipContentClassName="actionsTooltip"
                      background="#232529"
                      padding="12px 16px"
                      distance={13}
                    >
                      <img
                        className="h-4 w-4"
                        src="/images/nftClaim/etherscan.svg"
                        alt="checkmark"
                      />
                    </Tooltip>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-6 flex justify-between">
                <div className="w-1/2">
                  <div className="text-gray-lightManatee text-base leading-6 mb-2">
                    Remaining to mint
                  </div>
                  <div className="text-gray-lightManatee text-2xl">
                    <span className="text-white">
                      {numberWithCommas(unMinted)}
                    </span>{' '}
                    of {numberWithCommas(erc721Token.maxSupply)}
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="text-gray-lightManatee text-base leading-6 mb-2">
                    Mint price
                  </div>
                  {erc721Token.mintPrice ? (
                    <div className=" text-2xl flex space-x-4">
                      <div className="text-white">
                        {erc721Token.mintPrice}{' '}
                        {activeNetwork.nativeCurrency.symbol}
                      </div>
                      <div className="text-gray-lightManatee">
                        ${erc721Token.priceUSD}
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl">Only gas</div>
                  )}
                  <div className="text-gray-syn4 text-sm">
                    Wallet balance: {(+nativeBalance).toFixed(3)}{' '}
                    {activeNetwork.nativeCurrency.symbol}
                  </div>
                </div>
              </div>
              <ClaimCard
                {...{
                  handleMintUpdate: (amount) => {
                    updateMinted(amount);
                  },
                  openseaLink,
                  rawNativeBalance,
                  startTime
                }}
              ></ClaimCard>
            </div>
          </div>
          <NFTCard></NFTCard>
        </div>
      )}
    </div>
  );
};

export default ClaimNFT;
