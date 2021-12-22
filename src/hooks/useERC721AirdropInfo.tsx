import { ERC721_MERKLE_AIRDROP_CREATED } from "@/graphql/queries";
import { AppState } from "@/state";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  setLoadingERC721AirdropInfo,
  setERC721AirdropInfo,
  clearERC721AirdropInfo,
} from "@/state/erc721AirdropInfo/slice";

const useFetchAirdropInfo: any = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, web3 },
    },
    erc721MerkleProofSliceReducer: { erc721MerkleProof },
    erc721TokenSliceReducer: {
      erc721Token: { address: nftAddress },
    },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: AppState) => state);

  //   // Fetch existing airdops from the graph
  //   const {
  //     loading,
  //     data: airdropData = {},
  //     refetch,
  //   } = useQuery(ERC721_MERKLE_AIRDROP_CREATED, {
  //     variables: {
  //       where: {
  //         club: nftAddress.toLowerCase(),
  //         treeIndex: 0,
  //       },
  //     },
  //     skip: !account || skipQuery,
  //     context: { clientName: "graph" },
  //   });
  const [loading, setLoading] = useState(false);
  const [airdropData, setAirdropData] = useState([]);

  const getAirdropInfo = async () => {
    setLoading(true);
    const { MerkleDistributorModuleERC721 } = syndicateContracts;
    const events = await MerkleDistributorModuleERC721.getPastEvents(
      "MerkleAirdropCreated",
      {
        token: nftAddress,
        treeIndex: erc721MerkleProof.treeIndex.toString(),
      },
    );
    setAirdropData(events);
    setLoading(false);
  };

  useEffect(() => {
    if (erc721MerkleProof.accountIndex && account && nftAddress) {
      getAirdropInfo();
    }
  }, [erc721MerkleProof.accountIndex, account, nftAddress]);

  useEffect(() => {
    dispatch(setLoadingERC721AirdropInfo(true));
    if (airdropData?.length) {
      const airdropObj = airdropData[0];
      dispatch(
        setERC721AirdropInfo({
          ...airdropObj,
          endTime: parseInt(airdropObj.endTime),
          startTime: parseInt(airdropObj.startTime),
        }),
      );
      dispatch(setLoadingERC721AirdropInfo(false));
    } else {
      dispatch(clearERC721AirdropInfo());
    }
  }, [loading, airdropData]);

  return { loading };
};

export default useFetchAirdropInfo;
