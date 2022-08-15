import HeaderSection from './HeaderSection';
import { TokenNoResultSection, TokenNotFoundSection } from './TokenErrors';
import {
  TokenItemsLoadingSection,
  TokenItemsSection
} from './TokenItemDetails';
import { TokenModalVariant } from './TokenSelectModal';
import { Token } from '@/types/token';
import { IndexReducerState } from './indexReducer';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';

interface ITokenSection {
  header?: string;
  tokenList: Token[];
  variant: TokenModalVariant;
  searchTerm: string;
  loading: boolean;
  activeOptions: IndexReducerState;
  noTokenFound: boolean;
  hasTokenError: boolean;
  handleTokenClick: (token: Token) => void;
  showImportBtn?: boolean;
}

const TokenSection: React.FC<ITokenSection> = ({
  header,
  searchTerm,
  tokenList,
  loading,
  variant,
  noTokenFound,
  hasTokenError,
  activeOptions,
  handleTokenClick,
  showImportBtn
}) => {
  const {
    createInvestmentClubSliceReducer: { tokenDetails, showTokenGateModal }
  } = useSelector((state: AppState) => state);
  return (
    <>
      {!searchTerm && (
        <HeaderSection
          title={header}
          classoverride={
            variant !== TokenModalVariant.RecentlyUsed
              ? 'mt-4'
              : tokenList.length
              ? 'mt-3'
              : ''
          }
        />
      )}

      {loading ? (
        <TokenItemsLoadingSection
          repeat={3}
          showInfoLoader={showTokenGateModal}
        />
      ) : (
        <>
          {tokenList?.length ? (
            <div className="mt-2">
              <TokenItemsSection
                tokenList={tokenList}
                handleItemClick={handleTokenClick}
                depositTokenSymbol={tokenDetails.depositTokenSymbol}
                activeItemIndex={activeOptions.index}
                listShift={activeOptions.shift}
                showImportBtn={showImportBtn}
              />
            </div>
          ) : noTokenFound ? (
            <TokenNoResultSection />
          ) : hasTokenError ? (
            <TokenNotFoundSection />
          ) : null}
        </>
      )}
    </>
  );
};

export default TokenSection;
