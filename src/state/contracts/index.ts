import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { ClubERC20Factory } from '@/ClubERC20Factory/clubERC20Factory';
import { ClubERC20FactoryNative } from '@/ClubERC20Factory/clubERC20FactoryNative';
import { DepositTokenMintModuleContract } from '@/ClubERC20Factory/depositTokenMintModule';
import { DistributionsERC20 } from '@/ClubERC20Factory/distributionsERC20';
import { DistributionsETH } from '@/ClubERC20Factory/distributionsETH';
import { NativeMintModuleContract } from '@/ClubERC20Factory/nativeMintModule';
import { MerkleDistributorModuleContract } from '@/ClubERC20Factory/merkleDistributorModule';
import { MerkleDistributorModuleERC721Contract } from '@/ClubERC20Factory/merkleDistributorModuleERC721';
import { ERC721MintPolicyContract } from '@/ClubERC20Factory/mintPolicyERC721';
import { OwnerMintModuleContract } from '@/ClubERC20Factory/ownerMintModule';
import { MintPolicyContract } from '@/ClubERC20Factory/policyMintERC20';
import { PublicMintWithFeeModuleContract } from '@/ClubERC20Factory/publicMintWithFeeModule';
import { PublicOnePerAddressModuleContract } from '@/ClubERC20Factory/publicOnePerAddressModule';
import { DepositExchangeMintModule } from '@/ClubERC20Factory/RugRadio/DepositExchangeTokenMintModule';
import { RugBonusTokenModule } from '@/ClubERC20Factory/RugRadio/RugBonusTokenModule';
import { RugERC20ClaimModule } from '@/ClubERC20Factory/RugRadio/RugERC20ClaimModule';
import { RugUtilityProperties } from '@/ClubERC20Factory/RugRadio/RugUtilityProperties';
import { RugUtilityMintModuleContract } from '@/ClubERC20Factory/rugUtilityMintModule';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ERC721CollectiveFactory } from '@/ClubERC20Factory/ERC721CollectiveFactory';

export interface ISyndicateContracts {
  clubERC20Factory: ClubERC20Factory;
  clubERC20FactoryNative: ClubERC20FactoryNative;
  distributionsERC20: DistributionsERC20;
  distributionsETH: DistributionsETH;
  policyMintERC20: MintPolicyContract;
  mintPolicy: MintPolicyContract;
  DepositTokenMintModule: DepositTokenMintModuleContract;
  SingleTokenMintModule: DepositTokenMintModuleContract;
  NativeMintModule: NativeMintModuleContract;
  MerkleDistributorModule: MerkleDistributorModuleContract;
  MerkleDistributorModuleERC721: MerkleDistributorModuleERC721Contract;
  PublicOnePerAddressModule: PublicOnePerAddressModuleContract;
  mintPolicyERC721: ERC721MintPolicyContract;
  RugUtilityMintModule: RugUtilityMintModuleContract;
  PublicMintWithFeeModule: PublicMintWithFeeModuleContract;
  RugClaimModule: RugERC20ClaimModule;
  RugUtilityProperty: RugUtilityProperties;
  RugToken: ClubERC20Contract;
  GenesisNFTContract;
  rugBonusClaimModule: RugBonusTokenModule;
  OwnerMintModule: OwnerMintModuleContract;
  depositExchangeMintModule: DepositExchangeMintModule;
  erc721CollectiveFactory: ERC721CollectiveFactory;
}

interface InitialState {
  syndicateContracts: ISyndicateContracts;
}

const initialState: InitialState = {
  syndicateContracts: {
    clubERC20Factory: null,
    policyMintERC20: null,
    clubERC20FactoryNative: null,
    distributionsERC20: null,
    distributionsETH: null,
    mintPolicy: null,
    DepositTokenMintModule: null,
    SingleTokenMintModule: null,
    NativeMintModule: null,
    MerkleDistributorModule: null,
    MerkleDistributorModuleERC721: null,
    PublicOnePerAddressModule: null,
    mintPolicyERC721: null,
    RugUtilityMintModule: null,
    PublicMintWithFeeModule: null,
    RugClaimModule: null,
    RugUtilityProperty: null,
    RugToken: null,
    GenesisNFTContract: null,
    rugBonusClaimModule: null,
    OwnerMintModule: null,
    depositExchangeMintModule: null,
    erc721CollectiveFactory: null
  }
};

const initializeContractsSlice = createSlice({
  name: 'Initialize Contracts',
  initialState,
  reducers: {
    setContracts(state, action: PayloadAction<ISyndicateContracts>) {
      state.syndicateContracts = action.payload;
    }
  }
});

export const { setContracts } = initializeContractsSlice.actions;
export default initializeContractsSlice.reducer;
