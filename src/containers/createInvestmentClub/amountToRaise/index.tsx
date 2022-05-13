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
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TokenSelectModal from '@/components/tokenSelect/TokenSelectModal';
import { SUPPORTED_TOKENS } from '@/Networks';
import RaiseTokenAmount from './RaiseTokenAmount';

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

  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState<string>(tokenCap);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [defaultTokenDetails, setdefaultTokenDetails] = useState(
    SUPPORTED_TOKENS[1].filter((coin) => coin.default)[0]
  );

  const dispatch = useDispatch();

  const { setNextBtnDisabled } = useCreateInvestmentClubContext();

  const [showTokenSelectModal, setShowTokenSelectModal] = useState(false);

  // get input value
  const handleChange = (e) => {
    e.preventDefault();
    const value = numberInputRemoveCommas(e);
    setAmount(value);
    // push amount to the redux store.
    dispatch(setTokenCap(value));
  };

  const handleButtonClick = () => {
    setShowTokenSelectModal(true);
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
  }, [amount, editButtonClicked, setNextBtnDisabled]);

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
        <div className="flex pb-6 ml-5">
          <RaiseTokenAmount
            value={
              amount
                ? numberWithCommas(
                    // Checks if there are unnecessary zeros in the amount
                    amount.replace(/^0{2,}/, '0').replace(/^0(?!\.)/, '')
                  )
                : ''
            }
            title={'What’s the upper limit of the club’s raise?'}
            onChange={handleChange}
            handleButtonClick={handleButtonClick}
            error={error}
            placeholder={'1,000,000'}
            type={'text'}
            depositTokenLogo={depositTokenLogo}
            addSettingDisclaimer={true}
            moreInfo={
              'Accepting deposits beyond this amount will require an on-chain transaction with gas, so aim high.'
            }
            className={className}
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
