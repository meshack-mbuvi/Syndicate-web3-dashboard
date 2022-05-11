import Fade from '@/components/Fade';
import Modal, { ModalStyle } from '@/components/modal';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import {
  setTokenCap,
  setDepositTokenDetails
} from '@/state/createInvestmentClub/slice';
import {
  numberInputRemoveCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import Image from 'next/image';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdvancedInputField } from '../shared/AdvancedInputField';
import TokenSelectModal from '@/components/tokenSelect/TokenSelectModal';
import { SUPPORTED_TOKENS } from '@/Networks';
import RaiseTokenAmount from './RaiseTokenAmount';
import { defaultTokenDetails } from '@/containers/createInvestmentClub/shared/ClubTokenDetailConstants';

const AmountToRaise: React.FC<{
  className?: string;
  editButtonClicked?: boolean;
}> = ({ className, editButtonClicked }) => {
  const {
    createInvestmentClubSliceReducer: {
      tokenCap,
      tokenDetails: { depositTokenLogo, depositTokenSymbol }
    },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const [error, setError] = useState<string | React.ReactNode>('');
  const [amount, setAmount] = useState<string>(tokenCap);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [defaultTokenDetails, setdefaultTokenDetails] = useState(
    SUPPORTED_TOKENS[1].filter((coin) => coin.default)[0]
  );

  const dispatch = useDispatch();

  const { setNextBtnDisabled } = useCreateInvestmentClubContext();

  const usdcRef = useRef(null);

  const [showTokenSelectModal, setShowTokenSelectModal] = useState(false);

  const coinList = useMemo(
    () => SUPPORTED_TOKENS[activeNetwork.chainId] ?? SUPPORTED_TOKENS[1],
    [activeNetwork.chainId]
  );

  useEffect(() => {
    let [_defaultTokenDetails] = coinList.filter((coin) => coin.default);
    setdefaultTokenDetails(_defaultTokenDetails);
  }, [coinList, activeNetwork]);
  const extraAddonContent = (
    <button
      className="flex justify-center items-center cursor-pointer pl-5 pr-4 py-2"
      ref={usdcRef}
      onClick={() => setShowTokenSelectModal(true)}
    >
      <div className="mr-2 flex items-center justify-center">
        <Image
          src={depositTokenLogo || defaultTokenDetails.depositTokenLogo}
          width={20}
          height={20}
        />
      </div>
      <div className="uppercase">
        <span>{depositTokenSymbol}</span>
      </div>
      <div className="inline-flex ml-4">
        <img className="w-5 h-5" src="/images/double-chevron.svg" alt="" />
      </div>
    </button>
  );

  // get input value
  const handleChange = (e) => {
    e.preventDefault();
    const value = numberInputRemoveCommas(e);
    setAmount(value);
    // push amount to the redux store.
    dispatch(setTokenCap(value));
  };

  // catch input field errors
  useEffect(() => {
    if (!amount || +amount === 0 || editButtonClicked) {
      setNextBtnDisabled(true);
    } else {
      setError('');
      setNextBtnDisabled(false);
    }
    amount ? dispatch(setTokenCap(amount)) : dispatch(setTokenCap('0'));
  }, [amount, dispatch, editButtonClicked, setNextBtnDisabled]);

  useEffect(() => {
    dispatch(
      setDepositTokenDetails({
        depositToken: defaultTokenDetails.address,
        depositTokenName: defaultTokenDetails.name,
        depositTokenSymbol: defaultTokenDetails.symbol,
        depositTokenLogo: defaultTokenDetails.logoURI,
        depositTokenDecimals: defaultTokenDetails.decimals
      })
    );
  }, [defaultTokenDetails]);

  return (
    <>
      <Modal
        {...{
          modalStyle: ModalStyle.DARK,
          show: showDisclaimerModal,
          closeModal: () => {
            setShowDisclaimerModal(false);
          },
          customWidth: 'w-100',
          customClassName: 'p-8',
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
            onClick={() => setShowDisclaimerModal(false)}
          >
            <p className="text-black whitespace-nowrap text-base">Back</p>
          </button>
        </div>
      </Modal>
      <Fade delay={500}>
        <h3 className="ml-5 mb-6">
          What’s the upper limit of the club’s raise?
        </h3>
        <div className="flex pb-6 ml-5">
          <AdvancedInputField
            {...{
              value: amount
                ? numberWithCommas(
                    // Checks if there are unnecessary zeros in the amount
                    amount.replace(/^0{2,}/, '0').replace(/^0(?!\.)/, '')
                  )
                : numberWithCommas(''),
              onChange: handleChange,
              error: error,
              hasError: Boolean(error),
              placeholder: 'Unlimited',
              type: 'text',
              isNumber: true,
              focus,
              addSettingDisclaimer: true,
              extraAddon: extraAddonContent,
              moreInfo: (
                <div>
                  Accepting deposits beyond this amount will require an on-chain
                  transaction with gas, so aim high.
                </div>
              ),
              className: className
            }}
          />
        </div>
      </Fade>
      <TokenSelectModal
        showModal={showTokenSelectModal}
        closeModal={() => setShowTokenSelectModal(false)}
        chainId={activeNetwork.chainId}
      />
    </>
  );
};

export default AmountToRaise;
