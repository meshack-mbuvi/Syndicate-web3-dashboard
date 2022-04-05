import { SkeletonLoader } from '@/components/skeletonLoader';
import { ANNOTATE_TRANSACTIONS } from '@/graphql/mutations';
import { useIsClubOwner } from '@/hooks/useClubOwner';
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
  disableDropDown
}) => {
  const dispatch = useDispatch();
  const {
    transactionsReducer: { currentTransaction },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const isManager = useIsClubOwner();
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
      icon: 'other-transaction.svg'
    },
    {
      text: 'Uncategorised',
      value: null,
      icon: uncategorisedIcon
        ? uncategorisedIcon
        : outgoing
        ? 'outgoing-transaction.svg'
        : 'incoming-transaction.svg'
    }
  ];
  const categoryPillOptions = [
    {
      text: 'Investment',
      value: 'INVESTMENT',
      icon: 'investment-transaction.svg'
    },
    {
      text: 'Expense',
      value: 'EXPENSE',
      icon: 'expense-transaction.svg'
    },

    {
      text: 'Investment tokens',
      value: 'INVESTMENT_TOKEN',
      icon: 'investment-tokens.svg'
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
    const onPageClickEvent = (e) => {
      if (
        categorySelect.current !== null &&
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
      setInlineCategorising(pillState);
    }
  };

  // inline-categorising mutation
  const [annotationMutation] = useMutation(ANNOTATE_TRANSACTIONS);

  const handleSelect = (value: TransactionCategory) => {
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
          transactionAnnotationList: inlineAnnotationData
        },
        context: { clientName: 'backend', chainId: activeNetwork.chainId }
      });
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
        !readonly && isManager ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={() => (readonly ? null : toggleDropdown())}
      ref={categorySelect}
      onMouseEnter={() => setPillActiveRowState(true)}
      onMouseLeave={() => setPillActiveRowState(false)}
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
          {isManager && (
            <img src="/images/activity/chevron-down.svg" alt="chevron-down" />
          )}
        </div>
      ) : null}
      {showDropdown && isManager && !showLoader ? (
        <div
          className="mt-2 absolute top-10 -left-2 transition-all duration-500 ease-in-out z-10"
          onMouseLeave={() => closeDropDown()}
        >
          <CategoryPillDropDown
            options={dropDownOptions}
            onSelect={handleSelect}
          />
        </div>
      ) : null}
    </div>
  );
};
