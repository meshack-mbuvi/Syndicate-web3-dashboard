import { CtaButton } from '@/components/CTAButton';
import IconGas from '@/components/icons/Gas';
import { B3, B4 } from '@/components/typography';
import useFetchEnsAssets from '@/hooks/useFetchEnsAssets';
import useGasDetails, { ContractMapper } from '@/hooks/useGasDetails';
import { AppState } from '@/state';
import {
  setShowNetworkDropdownMenu,
  setShowWalletDropdownMenu
} from '@/state/wallet/actions';
import { formatAddress } from '@/utils/formatAddress';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type NetworkType = {
  account: string;
  disabled: boolean;
  contract: ContractMapper;
  args;
  handleLaunch: () => void;
  handleConnectWallet: () => void;
};

type IProps = {
  title: string;
  icon?: string | React.ReactElement;
  label: string | React.ReactElement;
  showDropDown?: boolean;
  onClick?: () => void;
  id?: string;
  isClickable?: boolean;
};

const SharedItem: React.FC<IProps> = ({
  title,
  icon,
  label,
  onClick,
  showDropDown = false,
  id,
  isClickable = true
}) => {
  const [hovered, setHovered] = useState(false);

  const toggleDropdown = () => {
    setHovered(!hovered);
  };

  return (
    <div
      className={`flex justify-between xs:flex-col xs:space-y-2 align-middle`}
      onMouseEnter={toggleDropdown}
      onMouseLeave={toggleDropdown}
    >
      <div className="flex align-middle">
        <B4 extraClasses="text-gray-syn4 align-middle">{title}</B4>
      </div>
      <div
        className="flex space-x-2 items-center"
        // eslint-disable-next-line jsx-a11y/aria-role
        role={`${isClickable ? 'button' : ''}`}
        tabIndex={0}
        id={id}
        onClick={onClick}
        onKeyPress={onClick}
      >
        {icon ? (
          <div className="flex-shrink-0">
            {typeof icon === 'string' ? (
              <img
                src={icon}
                alt=""
                width={20}
                height={20}
                className="min-w-full flex-shrink-0"
              />
            ) : (
              icon
            )}
          </div>
        ) : null}

        <div className="flex space-x-2 text-right">
          <B3 extraClasses="flex text-gray-syn2 wordwrap">{label}</B3>
          <div
            className={`flex items-center w-4 ${
              isClickable ? 'cursor-pointer' : ''
            }`}
          >
            <img
              src="/images/chevron-down.svg"
              width="9"
              alt="down-arrow"
              className={`${showDropDown && hovered ? '' : 'hidden'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NetworkComponent: React.FC<NetworkType> = ({
  account,
  disabled,
  contract,
  args,
  handleLaunch,
  handleConnectWallet
}) => {
  const {
    web3Reducer: {
      web3: { activeNetwork, ensResolver },
      showNetworkDropdown,
      showWalletDropdown
    }
  } = useSelector((state: AppState) => state);

  const { data } = useFetchEnsAssets(ensResolver);

  const formattedAddress = formatAddress(account.toLowerCase(), 6, 4);
  const { gas, fiatAmount } = useGasDetails({
    contract,
    withFiatCurrency: true,
    args,
    skipQuery: false
  });

  const dispatch = useDispatch();

  const handleShowNetworkDropdown = () => {
    dispatch(setShowNetworkDropdownMenu(!showNetworkDropdown));
  };

  const handleShowWalletDropdown = () => {
    dispatch(setShowWalletDropdownMenu(!showWalletDropdown));
  };

  return (
    <div
      className="flex flex-col w-full sm:w-auto md:w-730 sm:space-x-6 sm:flex-row justify-between space-y-4 sm:space-y-0 md:justify-between pl-6 p-4 bg-black border border-b-0 border-gray-syn7 rounded-3xl"
      style={{
        borderRadius: '40px 40px 0px 0px'
      }}
    >
      <div
        className={`flex flex-col xs:flex-row xs:space-y-0 space-y-5 justify-between w-full sm:space-y-0 md:space-x-6`}
      >
        {account ? (
          <>
            <SharedItem
              id="accountButton"
              title="Wallet"
              showDropDown={true}
              icon={data?.avatar || '/images/jazzicon.png'}
              label={
                <B3>
                  <span className="text-gray-syn4">
                    {formattedAddress.slice(0, 2)}
                  </span>
                  {formattedAddress.slice(2)}
                </B3>
              }
              onClick={handleShowWalletDropdown}
            />

            <SharedItem
              title="Network"
              id="networkButton"
              showDropDown={true}
              icon={`${activeNetwork.logo}`}
              label={`${activeNetwork.displayName}`}
              onClick={handleShowNetworkDropdown}
            />
          </>
        ) : null}

        <SharedItem
          title="Est. gas"
          icon={<IconGas fill="white" />}
          label={`${gas.toFixed(4)} ${activeNetwork.nativeCurrency.symbol} ${
            fiatAmount
              ? `~ ${Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(+fiatAmount)}`
              : ''
          }`}
          isClickable={false}
        />
      </div>
      <div className="flex-shrink-1 w-full sm:max-w-44 sm:w-auto">
        <CtaButton
          extraClasses="rounded-full"
          disabled={account ? disabled : false}
          greenCta={account ? true : false}
          onClick={() => {
            if (account) {
              handleLaunch();
            } else {
              handleConnectWallet();
            }
          }}
        >
          {account ? 'Launch' : 'Connect wallet'}
        </CtaButton>
      </div>
    </div>
  );
};

export default NetworkComponent;
