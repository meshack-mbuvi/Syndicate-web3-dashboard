import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import NetworkMenuDropDown from './networkMenuDropdown';
import { Status } from '@/state/wallet/types';

export const Network: React.FC = () => {
  const {
    web3Reducer: {
      web3: { activeNetwork, status }
    }
  } = useSelector((state: AppState) => state);

  return (
    <div className="wallet-connect">
      {activeNetwork.chainId && status === Status.CONNECTED ? (
        <NetworkMenuDropDown />
      ) : null}
    </div>
  );
};

export default Network;
