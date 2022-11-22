import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { ClubERC20Factory } from '@/ClubERC20Factory/clubERC20Factory';
import { ClubERC20FactoryNative } from '@/ClubERC20Factory/clubERC20FactoryNative';
import { DepositTokenMintModuleContract } from '@/ClubERC20Factory/depositTokenMintModule';
import { DistributionsERC20 } from '@/ClubERC20Factory/distributionsERC20';
import { DistributionsETH } from '@/ClubERC20Factory/distributionsETH';
import { ERC20ClubFactory } from '@/ClubERC20Factory/ERC20ClubFactory';
import { MerkleDistributorModuleContract } from '@/ClubERC20Factory/merkleDistributorModule';
import { MerkleDistributorModuleERC721Contract } from '@/ClubERC20Factory/merkleDistributorModuleERC721';
import { ERC721MintPolicyContract } from '@/ClubERC20Factory/mintPolicyERC721';
import { NativeMintModuleContract } from '@/ClubERC20Factory/nativeMintModule';
import { OwnerMintModuleContract } from '@/ClubERC20Factory/ownerMintModule';
import { MintPolicyContract } from '@/ClubERC20Factory/policyMintERC20';
import { PublicMintWithFeeModuleContract } from '@/ClubERC20Factory/publicMintWithFeeModule';
import { PublicOnePerAddressModuleContract } from '@/ClubERC20Factory/publicOnePerAddressModule';
import { DepositExchangeMintModule } from '@/ClubERC20Factory/RugRadio/DepositExchangeTokenMintModule';
import { RugBonusTokenModule } from '@/ClubERC20Factory/RugRadio/RugBonusTokenModule';
import { RugERC20ClaimModule } from '@/ClubERC20Factory/RugRadio/RugERC20ClaimModule';
import { RugUtilityProperties } from '@/ClubERC20Factory/RugRadio/RugUtilityProperties';
import { RugUtilityMintModuleContract } from '@/ClubERC20Factory/rugUtilityMintModule';
import { MaxMemberCountMixin } from '@/ClubERC20Factory/maxMemberMixin';
import { MaxTotalSupplyMixin } from '@/ClubERC20Factory/maxTotalSupplyMixin';
import { TokenGatedMixin } from '@/ClubERC20Factory/tokenGatingMixin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ERC721CollectiveFactory } from '@/ClubERC20Factory/ERC721CollectiveFactory';
import { EthPriceMintModule } from '@/ClubERC20Factory/EthPriceMintModule';
import { FixedRenderer } from '@/ClubERC20Factory/FixedRenderer';
import { GuardMixinManager } from '@/ClubERC20Factory/GuardMixinManager';
import { MaxPerMemberERC721 } from '@/ClubERC20Factory/MaxPerMemberERC721';
import { MaxTotalSupplyERC721 } from '@/ClubERC20Factory/MaxTotalSupplyERC721';
import { TimeRequirements } from '@/ClubERC20Factory/TimeRequirements';
import { ERC721Collective } from '@/ClubERC20Factory/ERC721Collective';
import { PrecommitModule } from '@/ClubERC20Factory/PrecommitModule';

export interface ISyndicateContracts {
  clubERC20Factory: ClubERC20Factory;
  clubERC20FactoryNative: ClubERC20FactoryNative;
  distributionsERC20: DistributionsERC20;
  distributionsETH: DistributionsETH;
  erc20ClubFactory: ERC20ClubFactory;
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
  GenesisNFTContract: any;
  rugBonusClaimModule: RugBonusTokenModule;
  OwnerMintModule: OwnerMintModuleContract;
  depositExchangeMintModule: DepositExchangeMintModule;
  erc721Collective: ERC721Collective;
  erc721CollectiveFactory: ERC721CollectiveFactory;
  ethPriceMintModule: EthPriceMintModule;
  fixedRenderer: FixedRenderer;
  guardMixinManager: GuardMixinManager;
  maxPerMemberERC721: MaxPerMemberERC721;
  maxTotalSupplyERC721: MaxTotalSupplyERC721;
  timeRequirements: TimeRequirements;
  maxMemberCountMixin: MaxMemberCountMixin;
  maxTotalSupplyMixin: MaxTotalSupplyMixin;
  tokenGatedMixin: TokenGatedMixin;
  precommitModule: PrecommitModule;
}

interface InitialState {
  syndicateContracts: ISyndicateContracts;
}

const initialState: InitialState = {
  syndicateContracts: {
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ClubERC20Fa... Remove this comment to see the full error message
    clubERC20Factory: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'MintPolicyC... Remove this comment to see the full error message
    policyMintERC20: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ClubERC20Fa... Remove this comment to see the full error message
    clubERC20FactoryNative: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'Distributio... Remove this comment to see the full error message
    distributionsERC20: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'Distributio... Remove this comment to see the full error message
    distributionsETH: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ERC20ClubFa... Remove this comment to see the full error message
    erc20ClubFactory: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'MintPolicyC... Remove this comment to see the full error message
    mintPolicy: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'DepositToke... Remove this comment to see the full error message
    DepositTokenMintModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'DepositToke... Remove this comment to see the full error message
    SingleTokenMintModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'NativeMintM... Remove this comment to see the full error message
    NativeMintModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'MerkleDistr... Remove this comment to see the full error message
    MerkleDistributorModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'MerkleDistr... Remove this comment to see the full error message
    MerkleDistributorModuleERC721: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'PublicOnePe... Remove this comment to see the full error message
    PublicOnePerAddressModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ERC721MintP... Remove this comment to see the full error message
    mintPolicyERC721: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'RugUtilityM... Remove this comment to see the full error message
    RugUtilityMintModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'PublicMintW... Remove this comment to see the full error message
    PublicMintWithFeeModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'RugERC20Cla... Remove this comment to see the full error message
    RugClaimModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'RugUtilityP... Remove this comment to see the full error message
    RugUtilityProperty: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ClubERC20Co... Remove this comment to see the full error message
    RugToken: null,
    GenesisNFTContract: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'RugBonusTok... Remove this comment to see the full error message
    rugBonusClaimModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'OwnerMintMo... Remove this comment to see the full error message
    OwnerMintModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'DepositExch... Remove this comment to see the full error message
    depositExchangeMintModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ERC721Colle... Remove this comment to see the full error message
    erc721Collective: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ERC721Colle... Remove this comment to see the full error message
    erc721CollectiveFactory: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'EthPriceMin... Remove this comment to see the full error message
    ethPriceMintModule: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'FixedRender... Remove this comment to see the full error message
    fixedRenderer: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'GuardMixinM... Remove this comment to see the full error message
    guardMixinManager: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'MaxPerMembe... Remove this comment to see the full error message
    maxPerMemberERC721: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'MaxTotalSup... Remove this comment to see the full error message
    maxTotalSupplyERC721: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'TimeRequire... Remove this comment to see the full error message
    timeRequirements: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'MaxMemberCo... Remove this comment to see the full error message
    maxMemberCountMixin: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'MaxTotalSup... Remove this comment to see the full error message
    maxTotalSupplyMixin: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'TokenGatedM.... Remove this comment to see the full error message
    tokenGatedMixin: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'PrecommitM.... Remove this comment to see the full error message
    precommitModule: null
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
