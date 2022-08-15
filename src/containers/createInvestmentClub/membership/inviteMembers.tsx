import { AddressUploader } from '@/components/uploaders/addressUploader';
import { AppState } from '@/state';
import { ethers } from 'ethers';
import {
  setMemberAddressesError,
  setMembershipAddresses,
  setAmountToMintPerAddress
} from '@/state/createInvestmentClub/slice';
import {
  removeNewLinesAndWhitespace,
  removeSubstring,
  countOccurrences
} from '@/utils/stringUtils';
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputFieldWithToken } from '@/components/inputs/inputFieldWithToken';
import {
  numberInputRemoveCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';

const InviteMembers: React.FC = () => {
  const {
    web3Reducer: {
      web3: { account, web3 }
    },
    createInvestmentClubSliceReducer: { investmentClubSymbol }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const { setNextBtnDisabled } = useCreateInvestmentClubContext();

  const [memberAddresses, setMemberAddresses] = useState('');
  const [selectedTextIndexes, setSelectedTextIndexes] = useState([]);

  const [rawMemberAddresses, setRawMemberAddresses] = useState([]);
  const [resolvedMemberAddresses, setResolvedMemberAddresses] = useState([]);
  const [resolutionProgress, setResolutionProgress] = useState(0);

  const [progressPercent, setProgressPercent] = useState(0);

  const [amountPerAddress, setAmountPerAddress] = useState('0');

  const handleMemberAddressesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;

    setMemberAddresses(value);
    const _addresses = removeNewLinesAndWhitespace(value);
    validateAddressArr(removeNewLinesAndWhitespace(_addresses).split(','));

    dispatchMembershipAddresses(_addresses);
  };

  const dispatchMembershipAddresses = (_addresses: string) => {
    if (_addresses.endsWith(',')) {
      const _address = _addresses.slice(0, -1);
      setRawMemberAddresses(_address.split(','));
      validateAddressArr(removeNewLinesAndWhitespace(_address).split(','));
    } else if (!_addresses.length) {
      setRawMemberAddresses([]);
      dispatch(setMembershipAddresses([]));
      dispatch(setMemberAddressesError(''));
      setProgressPercent(0);
    } else {
      setRawMemberAddresses(_addresses.split(','));
      validateAddressArr(removeNewLinesAndWhitespace(_addresses).split(','));
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === 'Comma') {
      const removeNewLines = removeNewLinesAndWhitespace(memberAddresses);
      const memberAddressesArr = removeNewLines.split(',');
      setMemberAddresses(memberAddressesArr.join(',\n'));
      event.preventDefault();
    }
  };

  const handleOnPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();

    const pastedAddresses = event.clipboardData.getData('text');
    const removeInvalidCharacters =
      removeNewLinesAndWhitespace(pastedAddresses);
    const newSplitArr = removeInvalidCharacters.split(',');
    setMemberAddresses((prev) => {
      const selection = prev.substring(
        selectedTextIndexes[0],
        selectedTextIndexes[1]
      );
      const remainingStr = removeNewLinesAndWhitespace(
        // remove selected text
        removeSubstring(prev, selection)
      );
      const newStr = remainingStr + newSplitArr.join();

      validateAddressArr(removeNewLinesAndWhitespace(newStr).split(','));

      dispatchMembershipAddresses(newStr);

      return newStr.split(',').join(',\n');
    });
  };

  const handleOnSelectText = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { selectionStart, selectionEnd } = event.target;
    setSelectedTextIndexes([selectionStart, selectionEnd]);
  };

  const validateAddressArr = (arr: string[]) => {
    // get last element in array
    const lastElement = arr[arr.length - 1];

    // create new copy of split array
    const newSplitArr = [...arr];

    // check if empty string
    if (!lastElement) {
      newSplitArr.pop();
    }

    const ensRegex = /^[-a-zA-Z0-9.-]{1,256}\.(eth|test)$/;

    const errors = newSplitArr?.reduce((accumulator, value) => {
      if (web3.utils.isAddress(value)) {
        // check if address added is the connected account (manager)
        if (
          account &&
          web3.utils.toChecksumAddress(value) ===
            web3.utils.toChecksumAddress(account)
        ) {
          // setContinueDisabled(true);
          accumulator.push(
            'You cannot add your own address (manager) to the list of members.'
          );
        }

        // handle duplicates
        if (countOccurrences(newSplitArr, value) > 1) {
          // setContinueDisabled(true);
          accumulator.push(`${value} has already been added (duplicate).`);
        }
      } else if (!value) {
        accumulator.push(`Please separate valid ERC20 addresses with commas`);
      } else if (ensRegex.test(value)) {
        // continue with ens address
      } else {
        // setContinueDisabled(true);
        accumulator.push(`${value} is not a valid ERC20 address`);
      }

      return accumulator;
    }, []);

    if (errors.length > 0) {
      errors.map((error) => {
        dispatch(setMemberAddressesError(error));
      });
    } else {
      dispatch(setMemberAddressesError(''));
    }
  };

  /** Amount per member address */
  const handleAmountPerAddressChange = (e) => {
    const amount = numberInputRemoveCommas(e);
    if (!amount || +amount <= 0) {
      setNextBtnDisabled(true);
    } else {
      setNextBtnDisabled(false);
    }
    setAmountPerAddress(amount >= 0 ? amount : '');
    dispatch(setAmountToMintPerAddress(amount));
  };

  // resolve ENS addresses
  const resolveENSAddress = useCallback(async (name: string) => {
    // using ethers here instead of web3.js because the getAddress method for
    // the latter appears to be depracated.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const address = await provider.resolveName(name);
    return address;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** start resolving any ENS name after we have read the
   * raw addresses from the uploaded file or text area */
  useEffect(() => {
    if (rawMemberAddresses.length) {
      rawMemberAddresses.map(async (address) => {
        if (address.indexOf('.eth') > 0) {
          resolveENSAddress(address)
            .then((addr) => {
              if (addr) {
                setResolvedMemberAddresses((prev) => [...prev, addr]);
                setResolutionProgress((prev) => prev + 1);
              } else {
                setResolutionProgress((prev) => prev + 1);
              }
            })
            .catch(() => {
              setResolutionProgress((prev) => prev + 1);
            });
        } else {
          setResolutionProgress((prev) => prev + 1);
          setResolvedMemberAddresses((prev) => [...prev, address]);
        }
      });
    }

    return () => {
      setResolvedMemberAddresses([]);
      setResolutionProgress(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawMemberAddresses]);

  /** only set membership addresses after
   * we are done resolving any possible ENS name */
  useEffect(() => {
    if (
      resolutionProgress > 0 &&
      resolutionProgress === rawMemberAddresses.length
    ) {
      dispatch(setMembershipAddresses([...new Set(resolvedMemberAddresses)]));
      setProgressPercent(100);
    }
  }, [
    resolvedMemberAddresses,
    resolutionProgress,
    rawMemberAddresses,
    dispatch
  ]);

  return (
    <div className="">
      <div className="text-xl pb-4">Invite members</div>
      <AddressUploader
        customClasses=""
        handleTextInputChange={handleMemberAddressesChange}
        helperText="Invite members by minting &amp; sending the community token to their wallets. You can distribute to more members anytime later. Add multiple addresses at once to minimize airdrop gas fees."
        textInputValue={memberAddresses}
        title="Member addresses"
        onPaste={handleOnPaste}
        onKeyUp={handleKeyUp}
        onSelect={handleOnSelectText}
        progressPercent={progressPercent}
        setProgressPercent={setProgressPercent}
        setRawMemberAddresses={setRawMemberAddresses}
      />

      <div className="mt-6">
        <div className="mb-2 text-white">Amount to mint (per address)</div>
        <InputFieldWithToken
          {...{
            symbol: `✺${investmentClubSymbol}`,
            placeholderLabel: '0',
            showClubSymbol: true,
            value: amountPerAddress
              ? numberWithCommas(
                  // Checks if there are unnecessary zeros in the amount
                  amountPerAddress
                    .replace(/^0{2,}/, '0')
                    .replace(/^0(?!\.)/, '')
                )
              : '',
            onChange: (e) => {
              if (isNaN(e.target.value.replace(/,/g, ''))) {
                return;
              }
              handleAmountPerAddressChange(e);
            }
          }}
        />
      </div>
    </div>
  );
};

export default InviteMembers;
