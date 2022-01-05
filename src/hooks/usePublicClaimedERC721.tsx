import { CLAIMED_ERC721 } from "@/graphql/queries";
import { AppState } from "@/state";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  setLoadingERC721Claimed,
  setERC721Claimed,
  clearERC721Claimed,
} from "@/state/claimedERC721/slice";
import { ERC721Contract } from "@/ClubERC20Factory/ERC721Membership";

const useFetchERC721PublicClaim: any = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, web3 },
    },
    erc721MerkleProofSliceReducer: { erc721MerkleProof },
    erc721TokenSliceReducer: { erc721Token },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: AppState) => state);

  const { address: nftAddress } = erc721Token;

  const [loading, setLoading] = useState(false);
  const [hasMinted, setHasMinted] = useState<boolean>(false);

  const getClaim = async () => {
    setLoading(true);
    const { PublicOnePerAddressModule } = syndicateContracts;
    let hasMinted = await PublicOnePerAddressModule.hasMinted(
      nftAddress,
      account,
    );
    if (!hasMinted) {
      const ERC721tokenContract = new ERC721Contract(
        nftAddress as string,
        web3,
      );
      hasMinted = parseInt(await ERC721tokenContract.balanceOf(account)) > 0;
    }
    setHasMinted(hasMinted);
    setLoading(false);
  };

  useEffect(() => {
    if (erc721MerkleProof.accountIndex >= 0 && account && nftAddress) {
      getClaim();
    }
  }, [erc721MerkleProof.accountIndex, account, nftAddress]);

  useEffect(() => {
    dispatch(setLoadingERC721Claimed(true));

    if (hasMinted) {
      dispatch(
        setERC721Claimed({
          claimant: account,
          token: nftAddress,
          index: null,
          treeIndex: null,
          id: "",
          claimed: true,
        }),
      );
    } else {
      dispatch(clearERC721Claimed());
    }

    dispatch(setLoadingERC721Claimed(false));
  }, [loading, hasMinted]);

  return { loading, getClaim };
};

export default useFetchERC721PublicClaim;
