import { CLAIMED_ERC721 } from "@/graphql/queries";
import { AppState } from "@/state";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  setLoadingERC721Claimed,
  setERC721Claimed,
  clearERC721Claimed,
} from "@/state/claimedERC721/slice";

const useFetchERC721Claim: any = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, web3 },
    },
    erc721MerkleProofSliceReducer: { erc721MerkleProof },
    erc721TokenSliceReducer: {
      erc721Token: {
        address: nftAddress,
        publicSingleClaimEnabled,
        publicUtilityClaimEnabled,
      },
    },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: AppState) => state);

  const [loading, setLoading] = useState(false);
  const [claimData, setClaimData] = useState([]);

  const getClaim = async () => {
    setLoading(true);
    const { MerkleDistributorModuleERC721 } = syndicateContracts;
    const events = await MerkleDistributorModuleERC721.getPastEvents(
      "TokensClaimed",
      {
        token: nftAddress.toLowerCase(),
        claimant: account.toLowerCase(),
      },
    );
    setClaimData(events);
    setLoading(false);
  };

  useEffect(() => {
    if (erc721MerkleProof.accountIndex >= 0 && account && nftAddress) {
      getClaim();
    }
  }, [erc721MerkleProof.accountIndex, account, nftAddress]);

  useEffect(() => {
    dispatch(setLoadingERC721Claimed(true));

    if (
      claimData?.length &&
      !publicSingleClaimEnabled &&
      !publicUtilityClaimEnabled
    ) {
      const claim = claimData.filter(
        (_claim) =>
          _claim.returnValues?.treeIndex ===
          erc721MerkleProof?.treeIndex?.toString(),
      );

      if (claim.length) {
        const { claimant, token, index, treeIndex } = claim[0].returnValues;
        dispatch(
          setERC721Claimed({
            claimant,
            token,
            index,
            treeIndex,
            id: "",
            claimed: true,
          }),
        );
      } else {
        dispatch(clearERC721Claimed());
      }

      dispatch(setLoadingERC721Claimed(false));
    } else {
      dispatch(clearERC721Claimed());
    }
  }, [loading, publicSingleClaimEnabled, publicUtilityClaimEnabled]);

  return { loading, getClaim };
};

export default useFetchERC721Claim;
