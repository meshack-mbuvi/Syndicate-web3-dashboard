import Modal, { ModalStyle } from '@/components/modal';
import TokenSelectModal from '@/components/tokenSelect/TokenSelectModal';
import { SUPPORTED_TOKENS } from '@/Networks';
import { AppState } from '@/state';
import {
  setDepositTokenDetails,
  setTokenCap
} from '@/state/createInvestmentClub/slice';
import {
  numberInputRemoveCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RaiseTokenAmount from './RaiseTokenAmount';

const AmountToRaise: React.FC<{
  className?: string;
  editButtonClicked?: boolean;
  isReview?: boolean;
}> = ({ className, editButtonClicked, isReview }) => {
  const {
    createInvestmentClubSliceReducer: {
      tokenCap,
      tokenDetails: { depositTokenLogo }
    },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState<string>(tokenCap);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [defaultTokenDetails, setdefaultTokenDetails] = useState(
    SUPPORTED_TOKENS[1].filter((coin) => coin.default)[0]
  );

  const dispatch = useDispatch();

  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const [showTokenSelectModal, setShowTokenSelectModal] = useState(false);

  // get input value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = numberInputRemoveCommas(e);
    setAmount(value);
    // push amount to the redux store.
    dispatch(setTokenCap(value));
  };

  const handleButtonClick = (): void => {
    setShowTokenSelectModal(true);
  };

  // catch input field errors
  useEffect(() => {
    if (!amount || editButtonClicked) {
      setNextBtnDisabled?.(true);
    } else {
      setError('');
      setNextBtnDisabled?.(false);
    }
    amount ? dispatch(setTokenCap(amount)) : dispatch(setTokenCap('0'));
  }, [amount, editButtonClicked, setNextBtnDisabled]);

  useEffect(() => {
    // hotfix to bypass error when metamask is Unlocked
    if (!activeNetwork.chainId) return;

    setdefaultTokenDetails(
      SUPPORTED_TOKENS[activeNetwork.chainId].filter(
        (coin: any) => coin.default
      )[0]
    );
  }, [activeNetwork.chainId]);

  useEffect(() => {
    dispatch(
      setDepositTokenDetails({
        depositToken: defaultTokenDetails.address,
        depositTokenName: defaultTokenDetails.name,
        depositTokenSymbol: defaultTokenDetails.symbol,
        depositTokenLogo: defaultTokenDetails.logoURI,
        depositTokenDecimals: defaultTokenDetails.decimals || 18
      })
    );
  }, [defaultTokenDetails]);

  return (
    <>
      <Modal
        {...{
          modalStyle: ModalStyle.DARK,
          show: showDisclaimerModal,
          closeModal: (): void => {
            setShowDisclaimerModal(false);
          },
          showCloseButton: false,
          outsideOnClick: true,
          showHeader: false,
          alignment: 'align-top',
          margin: 'mt-48'
        }}
      >
        <div className="space-y-6">
          <p className="h3">Investing in crypto can be risky</p>
          <p className="text-sm text-gray-syn4 leading-5">
            Crypto is a new asset class and is subject to many risks including
            frequent price changes. All crypto assets are different. Each one
            has its own set of features and risks that could affect its value
            and how you&apos;re able to use it. Be sure to research any asset
            fully before selecting. Syndicate strongly encourages all groups to
            consult with their legal and tax advisors prior to launch.
          </p>
          <button
            className="bg-white rounded-custom w-full flex items-center justify-center py-4 px-8"
            onClick={(): void => setShowDisclaimerModal(false)}
          >
            <p className="text-black whitespace-nowrap text-base">Back</p>
          </button>
        </div>
      </Modal>
      <div className="flex pb-6">
        <RaiseTokenAmount
          value={
            tokenCap
              ? tokenCap
              : amount
              ? numberWithCommas(
                  // Checks if there are unnecessary zeros in the amount
                  amount.replace(/^0{2,}/, '0').replace(/^0(?!\.)/, '')
                )
              : ''
          }
          title={'What’s your fundraising goal?'}
          onChange={handleChange}
          handleButtonClick={handleButtonClick}
          error={error}
          placeholder={'1,000,000'}
          type={'text'}
          depositTokenLogo={depositTokenLogo}
          addSettingDisclaimer={false}
          className={className}
          nextBtnDisabled={nextBtnDisabled}
          isReview={isReview}
        />
      </div>

      <TokenSelectModal
        showModal={showTokenSelectModal}
        closeModal={(): void => setShowTokenSelectModal(false)}
        chainId={activeNetwork.chainId}
      />
    </>
  );
};

export default AmountToRaise;
