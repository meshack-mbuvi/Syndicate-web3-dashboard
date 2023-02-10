import { ERC721Contract } from '@/ClubERC20Factory/ERC721Membership';
import { AppState } from '@/state';
import {
  clearERC721Claimed,
  setERC721Claimed,
  setLoadingERC721Claimed
} from '@/state/claimedERC721/slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useFetchERC721PublicClaim: any = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, web3 }
    },
    erc721TokenSliceReducer: { erc721Token },
    initializeContractsReducer: { syndicateContracts }
  } = useSelector((state: AppState) => state);

  const { address: nftAddress, publicUtilityClaimEnabled } = erc721Token;

  const [loading, setLoading] = useState(false);
  const [hasMinted, setHasMinted] = useState<boolean>(false);

  const getClaim = async () => {
    setLoading(true);
    setHasMinted(false);
    const { PublicOnePerAddressModule } = syndicateContracts;
    let _hasMinted = await PublicOnePerAddressModule.hasMinted(
      nftAddress,
      account
    );
    if (!_hasMinted) {
      const ERC721tokenContract = new ERC721Contract(
        nftAddress as string,
        web3
      );
      _hasMinted = parseInt(await ERC721tokenContract.balanceOf(account)) > 0;
    }
    setHasMinted(_hasMinted);
    setLoading(false);
  };

  useEffect(() => {
    if (account && nftAddress) {
      getClaim();
    }
  }, [account, nftAddress]);

  useEffect(() => {
    dispatch(setLoadingERC721Claimed(true));

    if (hasMinted && !publicUtilityClaimEnabled) {
      dispatch(
        setERC721Claimed({
          claimant: account,
          token: nftAddress,
          // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string'.
          index: null,
          // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string'.
          treeIndex: null,
          id: '',
          claimed: true
        })
      );
    } else {
      dispatch(clearERC721Claimed());
    }

    dispatch(setLoadingERC721Claimed(false));
  }, [loading, hasMinted, publicUtilityClaimEnabled]);

  return { loading, getClaim };
};

export default useFetchERC721PublicClaim;
