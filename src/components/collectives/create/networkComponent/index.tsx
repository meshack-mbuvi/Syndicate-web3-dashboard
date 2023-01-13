import { CTAButton, CTAType } from '@/components/CTAButton';
import IconGas from '@/components/icons/Gas';
import { B3, B4 } from '@/components/typography';
import { JazziconGenerator } from '@/features/auth/components/jazziconGenerator';
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
  args: any;
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
      className={`flex sm:flex-col justify-between flex-row -space-x-2 py-1 items-left align-middle`}
      onMouseEnter={toggleDropdown}
      onMouseLeave={toggleDropdown}
    >
      <div className="flex align-middle ml-4 mb-1 sm:ml-0">
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
          <div className="flex-shrink-0 ml-2 flex items-center">
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

        <div className="flex space-x-2 text-right" id={id}>
          <B3 extraClasses="flex text-gray-syn2 wordwrap" id={id}>
            {label}
          </B3>
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
      web3: { activeNetwork, ethersProvider },
      showNetworkDropdown,
      showWalletDropdown
    }
  } = useSelector((state: AppState) => state);

  const { data } = useFetchEnsAssets(account, ethersProvider);

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
    dispatch(setShowWalletDropdownMenu(false));
  };

  const handleShowWalletDropdown = () => {
    dispatch(setShowWalletDropdownMenu(!showWalletDropdown));
    dispatch(setShowNetworkDropdownMenu(false));
  };

  return (
    <div
      className="flex flex-col sm:flex-row w-full md:w-730 justify-between items-center p-4 bg-gray-syn9 border border-b-0 border-gray-syn7 rounded-3xl"
      style={{
        borderRadius: '40px 40px 0px 0px'
      }}
    >
      <div className={`flex flex-col sm:flex-row justify-between w-full`}>
        {account ? (
          <>
            <SharedItem
              id="accountButton"
              title="Wallet"
              showDropDown={true}
              icon={
                data?.avatar ? (
                  data.avatar
                ) : (
                  <JazziconGenerator address={account} diameterRem={1.25} />
                )
              }
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
      <div className="flex-shrink-1 pt-2 sm:pt-0 w-full sm:max-w-44 sm:w-auto">
        <CTAButton
          rounded={true}
          type={account ? CTAType.TRANSACTIONAL : CTAType.PRIMARY}
          disabled={account ? disabled : false}
          onClick={() => {
            if (account) {
              handleLaunch();
            } else {
              handleConnectWallet();
            }
          }}
        >
          {account ? 'Launch' : 'Connect wallet'}
        </CTAButton>
      </div>
    </div>
  );
};

export default NetworkComponent;
