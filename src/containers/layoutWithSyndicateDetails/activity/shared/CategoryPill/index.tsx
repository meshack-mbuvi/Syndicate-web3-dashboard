import { amplitudeLogger, Flow } from '@/components/amplitude';
import { TRANSACTION_CATEGORIZE } from '@/components/amplitude/eventNames';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { ANNOTATE_TRANSACTIONS } from '@/graphql/mutations';
import { getInput } from '@/hooks/useFetchRecentTransactions';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { setCurrentTransaction } from '@/state/erc20transactions';
import { TransactionCategory } from '@/state/erc20transactions/types';
import { useMutation } from '@apollo/client';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategoryPillDropDown from './CategoryPillDropdown';
interface ICategoryPill {
  outgoing?: boolean;
  category?: TransactionCategory;
  readonly?: boolean;
  renderedInline?: boolean;
  renderedInModal?: boolean;
  setInlineCategorising?: Dispatch<SetStateAction<boolean>>;
  transactionHash?: string;
  refetchTransactions?: () => void;
  bulkCategoriseTransactions?: (selectedCategory: string) => void;
  changeAdaptiveBackground?: (selectedCategory: string) => void;
  showLoader?: boolean;
  setActiveTransactionHash?: (transactionHashes: Array<string>) => void;
  uncategorisedIcon?: string;
  disableDropDown?: boolean;
  isOwner: boolean;
}

/**
 * category pill component used either in read-only mode or as a drop-down.
 * @param category category name. Can be any of the following: investment, deposit, investment-tokens, expense, or other. Defaults to "Uncategorized" if a category is not provided.
 * @param outgoing boolean (required) transaction type as either outgoing (true) or incoming (false)
 * @param readonly boolean check to use with a drop-down or not
 * @param showLoader boolean  check to determine if we show in-pill loader
 * @returns
 */
export const CategoryPill: React.FC<ICategoryPill> = ({
  category,
  outgoing,
  readonly,
  setInlineCategorising,
  renderedInline,
  renderedInModal,
  transactionHash,
  refetchTransactions,
  bulkCategoriseTransactions,
  changeAdaptiveBackground,
  showLoader = false,
  setActiveTransactionHash,
  uncategorisedIcon,
  disableDropDown,
  isOwner
}) => {
  const dispatch = useDispatch();
  const {
    transactionsReducer: { currentTransaction },
    web3Reducer: {
      web3: { activeNetwork, account }
    },
    erc20TokenSliceReducer: { erc20Token }
  } = useSelector((state: AppState) => state);

  const categorySelect = useRef(null);
  const [pillIcon, setPillIcon] = useState<string>('');
  const [pillText, setPillText] = useState<string>('');

  // drop down
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>('');
  const [dropDownOptions, setDropdownOptions] = useState<any[]>([]);

  // all category pill dropdown options
  const commonPillOptions = [
    {
      text: 'Other',
      value: 'OTHER',
      icon: '/images/activity/other-transaction.svg'
    },
    {
      text: 'Uncategorised',
      value: null,
      icon: uncategorisedIcon
        ? uncategorisedIcon
        : outgoing
        ? '/images/activity/outgoing-transaction.svg'
        : '/images/activity/incoming-transaction.svg'
    }
  ];
  const categoryPillOptions = [
    {
      text: 'Investment',
      value: 'INVESTMENT',
      icon: '/images/activity/investment-transaction.svg'
    },
    {
      text: 'Expense',
      value: 'EXPENSE',
      icon: '/images/activity/expense-transaction.svg'
    },

    {
      text: 'Investment tokens',
      value: 'INVESTMENT_TOKEN',
      icon: '/images/activity/investment-tokens.svg'
    }
  ];

  // initial selected category
  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  // text and icon to show based on category
  useEffect(() => {
    // set modal header color according to selected category
    if (changeAdaptiveBackground) {
      changeAdaptiveBackground(selectedCategory);
    }

    switch (selectedCategory) {
      case 'EXPENSE':
        setPillIcon('expense-transaction.svg');
        setPillText('Expense');
        break;
      case 'INVESTMENT':
        setPillIcon('investment-transaction.svg');
        setPillText('Investment');
        break;
      case 'DEPOSIT':
        setPillIcon('deposit-transaction.svg');
        setPillText('Deposit');
        break;
      case 'INVESTMENT_TOKEN':
        setPillIcon('investment-tokens.svg');
        setPillText('Investment token');
        break;
      case 'OFF_CHAIN_INVESTMENT':
        setPillIcon('offchain-investment.svg');
        setPillText('Off-chain investment');
        break;
      case 'OTHER':
        setPillIcon('other-transaction.svg');
        setPillText('Other');
        break;
      case 'SELECT_CATEGORY':
        setPillIcon('select-category.svg');
        setPillText('Select category');
        break;
      case 'TOKEN':
        setPillIcon('token.svg');
        setPillText('Token');
        break;
      case 'COLLECTIBLE':
        setPillIcon('collectibleIcon.svg');
        setPillText('Collectible');
        break;
      case 'DISTRIBUTION':
        setPillIcon('distribution.svg');
        setPillText('Distribution');
        break;
      default:
        if (bulkCategoriseTransactions) {
          setPillIcon('select-category.svg');
          setPillText('Select category');
        } else {
          setPillIcon(
            outgoing ? 'outgoing-transaction.svg' : 'incoming-transaction.svg'
          );
          setPillText('Uncategorised');
        }

        break;
    }
  }, [selectedCategory, outgoing]);

  useEffect(() => {
    let specificOptions = categoryPillOptions;
    if (outgoing === true) {
      specificOptions = categoryPillOptions.slice(0, 2);
    } else if (outgoing === false) {
      specificOptions = categoryPillOptions.slice(2);
    }
    setDropdownOptions(
      // @ts-expect-error TS(2769): No overload matches this call.
      specificOptions.concat(commonPillOptions).filter((option) => {
        if (selectedCategory === 'OFF_CHAIN_INVESTMENT') {
          return option.value !== 'INVESTMENT';
        } else {
          return option.value !== selectedCategory;
        }
      })
    );
  }, [outgoing, selectedCategory]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // close drop down when clicking outside of it.
  useEffect(() => {
    const onPageClickEvent = (e: any) => {
      if (
        categorySelect.current !== null &&
        // @ts-expect-error TS(2339): Property 'contains' does not exist on type 'never'... Remove this comment to see the full error message
        !categorySelect.current.contains(e.target)
      ) {
        setShowDropdown(!showDropdown);
        return;
      }
    };

    if (showDropdown) {
      window.addEventListener('click', onPageClickEvent);
    }

    return () => {
      window.removeEventListener('click', onPageClickEvent);
    };
  }, [showDropdown]);

  // when the pill is rendered inside the transactions table, we want to
  // distinguish between when the row is clicked and when the pill is selected
  const setPillActiveRowState = (pillState: boolean) => {
    if (renderedInline) {
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setInlineCategorising(pillState);
    }
  };

  // inline-categorising mutation
  const [annotationMutation] = useMutation(ANNOTATE_TRANSACTIONS);

  const handleSelect = (value: TransactionCategory) => {
    amplitudeLogger(TRANSACTION_CATEGORIZE, {
      flow: Flow.CLUB_MANAGE,
      transaction_category: value
    });
    if (Object.keys(currentTransaction).length) {
      dispatch(
        setCurrentTransaction({ ...currentTransaction, category: value })
      );
    }
    setSelectedCategory(value);

    // annotate selected transaction and refetch.
    if ((renderedInline || renderedInModal) && refetchTransactions) {
      if (renderedInline) setPillActiveRowState(false);
      const inlineAnnotationData = [
        {
          transactionCategory: value,
          transactionId: transactionHash
        }
      ];
      annotationMutation({
        variables: {
          transactionAnnotationList: inlineAnnotationData,
          chainId: activeNetwork.chainId,
          input: getInput(`${erc20Token.address}:${account}`)
        },
        context: {
          clientName: SUPPORTED_GRAPHS.BACKEND,
          chainId: activeNetwork.chainId
        }
      });
      // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
      if (setActiveTransactionHash) setActiveTransactionHash([transactionHash]);
      refetchTransactions();
    } else if (bulkCategoriseTransactions) {
      bulkCategoriseTransactions(value);
    }
  };

  // close dropdown functionality when used within the activity table (renderedInline)
  useEffect(() => {
    if (readonly && renderedInline && showDropdown) {
      setShowDropdown(false);
    }
    if (disableDropDown) {
      setShowDropdown(false);
    }
  }, [readonly, renderedInline, showDropdown, disableDropDown]);

  const closeDropDown = () => {
    if (renderedInline && readonly) {
      setShowDropdown(false);
      return;
    }
    setShowDropdown(!disableDropDown);
  };

  return (
    <div
      className={`relative flex justify-between items-center rounded-full border-1 border-gray-syn6 ${
        !readonly && isOwner ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={() => (readonly ? null : toggleDropdown())}
      ref={categorySelect}
      onMouseEnter={() => setPillActiveRowState(true)}
      onMouseLeave={() => setPillActiveRowState(false)}
      onKeyDown={() => null}
      tabIndex={0}
      role="button"
    >
      <div className="flex justify-start items-center">
        {!showLoader ? (
          <div className="flex-shrink-0 h-8 w-8 mr-2 my-1 ml-1">
            <img src={`/images/activity/${pillIcon}`} alt="transaction-icon" />
          </div>
        ) : (
          <div className="inline-flex pl-1 pr-1 ">
            <SkeletonLoader
              margin="m-0"
              borderRadius="rounded-2xl"
              width="8"
              height="8"
            />
          </div>
        )}
        {!showLoader ? (
          <div className={`whitespace-nowrap py-2 ${readonly && 'pr-3'}`}>
            <span className="text-base">{pillText}</span>
          </div>
        ) : (
          <div className="pr-3 align-middle items-center">
            <SkeletonLoader borderRadius="rounded-md" width="40" height="6" />
          </div>
        )}
      </div>

      {!(readonly || showLoader) ? (
        <div className="ml-2 mr-3">
          {isOwner && (
            <img src="/images/activity/chevron-down.svg" alt="chevron-down" />
          )}
        </div>
      ) : null}
      {showDropdown && isOwner && !showLoader ? (
        <div
          className="mt-2 absolute top-10 -left-2 transition-all duration-500 ease-in-out z-10"
          onMouseLeave={() => closeDropDown()}
        >
          <CategoryPillDropDown
            options={dropDownOptions}
            // @ts-expect-error TS(2322): Type '(value: TransactionCategory) => void' is not... Remove this comment to see the full error message
            onSelect={handleSelect}
          />
        </div>
      ) : null}
    </div>
  );
};
