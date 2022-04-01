import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/state';
import ClaimCard from './claimCard';
import NFTCard from './nftCard';
import { ERC721Token } from '@/state/erc721token/types';
import { ERC721Contract } from '@/ClubERC20Factory/ERC721Membership';
import {
  setERC721TokenDetails,
  setERC721TokenContract,
  setERC721Loading,
  clearERC721TokenDetails
} from '@/state/erc721token/slice';
import useFetchERC721MerkleProof from '@/hooks/useERC721MerkleProof';
import useFetchERC721Claim from '@/hooks/useClaimedERC721';
import useFetchERC721PublicClaim from '@/hooks/usePublicClaimedERC721';
import useFetchAirdropInfo from '@/hooks/useERC721AirdropInfo';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import { useRouter } from 'next/router';
import Tooltip from 'react-tooltip-lite';
import { isDev } from '@/utils/environment';
import { numberWithCommas } from '@/utils/formattedNumbers';
import { getWeiAmount } from '@/utils/conversions';
import { getEthereumTokenPrice } from '@/utils/api/transactions';

const ClaimNFT: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3 }
    },
    erc721TokenSliceReducer: { erc721Token }
  } = useSelector((state: AppState) => state);

  const { loading: merkleLoading } = useFetchERC721MerkleProof();
  const { loading: claimedLoading } = useFetchERC721Claim();
  const { loading: airdropLoading } = useFetchAirdropInfo();
  const { loading: claimedPublicLoading } = useFetchERC721PublicClaim();
  const { loading: erc721Loading } = erc721Token;

  const [openseaLink, setOpenseaLink] = useState<string>('');
  const [etherScanLink, setEtherscanLink] = useState<string>('');
  const [unMinted, setUnMinted] = useState<number>(0);

  const [ethBalance, setEthBalance] = useState('');
  const [rawEthBalance, setRawEthBalance] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [currentAccount, setCurrentAccount] = useState<string>(' ');
  const [loading, setLoading] = useState<boolean>(true);
  const [loading721, setLoading721] = useState<boolean>(true);

  const { nftAddress } = router.query;

  const updateMinted = (amount) => {
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

      if (isDev) {
        setEtherscanLink(
          `https://rinkeby.etherscan.io/address/${erc721Token.address}`
        );
        setOpenseaLink('');
        // setOpenseaLink(`https://testnets.opensea.io/collection/${collection}`);
      } else {
        setEtherscanLink(`https://etherscan.io/address/${erc721Token.address}`);
        setOpenseaLink(`https://opensea.io/collection/${collection}`);
        // setOpenseaLink(`https://opensea.io/collection/${erc721Token.address}`);
      }
    }
  }, [erc721Token.address, nftAddress, erc721Token.publicUtilityClaimEnabled]);

  const getEthBalance = async () => {
    if (account) {
      const balance = await web3.eth.getBalance(account);
      const ethBalance = await web3.utils.fromWei(balance, 'ether');
      setEthBalance(ethBalance);
      setRawEthBalance(balance);
    }
  };

  useEffect(() => {
    getEthBalance();
  }, [account]);

  const getERC721TokenDetails = async (ERC721tokenContract) => {
    const { address } = ERC721tokenContract;
    const { mintPolicyERC721, PublicMintWithFeeModule } = syndicateContracts;

    const [name, owner, symbol, rendererAddr, currentSupply] =
      await Promise.all([
        ERC721tokenContract.name(),
        ERC721tokenContract.owner(),
        ERC721tokenContract.symbol(),
        ERC721tokenContract.rendererAddr(),
        ERC721tokenContract.currentSupply()
      ]);

    const PUBLIC_ONE_PER_ADDRESS_MODULE =
      process.env.NEXT_PUBLIC_ONE_PER_ADDRESS_MODULE;

    const PUBLIC_UTILITY_MINT_MODULE =
      process.env.NEXT_PUBLIC_UTILITY_MINT_MODULE;

    const tokenPrice = await getEthereumTokenPrice();
    let publicUtilityClaimEnabled = false;
    let publicSingleClaimEnabled = false;
    let merkleClaimEnabled = true;
    let publicSupply = 0;
    let ethPrice = '0';
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
        [publicSupply, ethPrice, amountMinted, maxPerAddress, _startTime] =
          await Promise.all([
            Number(await PublicMintWithFeeModule.publicSupply(address)),
            await PublicMintWithFeeModule.ethPrice(address),
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
      currentSupply,
      publicSupply,
      rendererAddr,
      loading: false,
      merkleClaimEnabled,
      publicSingleClaimEnabled,
      publicUtilityClaimEnabled,
      ethPrice,
      mintPrice: Number(getWeiAmount(ethPrice, 18, false)),
      priceUSD: parseFloat(
        (
          parseFloat(String(tokenPrice)) *
          parseFloat(String(getWeiAmount(ethPrice, 18, false)))
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
      web3.utils.isAddress(nftAddress) &&
      syndicateContracts?.MerkleDistributorModuleERC721 &&
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
        getERC721TokenDetails(ERC721tokenContract);
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
    syndicateContracts?.mintPolicyERC721?.mintPolicyERC721Contract._address,
    syndicateContracts?.PublicMintWithFeeModule
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
                  <a href={etherScanLink} target="_blank" rel="noreferrer">
                    <Tooltip
                      content={<div>View contract on Etherscan</div>}
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
                        {erc721Token.mintPrice} ETH
                      </div>
                      <div className="text-gray-lightManatee">
                        ${erc721Token.priceUSD}
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl">Only gas</div>
                  )}
                  <div className="text-gray-syn4 text-sm">
                    Wallet balance: {(+ethBalance).toFixed(3)} ETH
                  </div>
                </div>
              </div>
              <ClaimCard
                {...{
                  handleMintUpdate: (amount) => {
                    updateMinted(amount);
                  },
                  openseaLink,
                  rawEthBalance,
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
