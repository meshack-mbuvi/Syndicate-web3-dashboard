import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import NetworkMenuDropDown from './networkMenuDropdown';

export const Network: React.FC = () => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  return (
    <div className="wallet-connect">
      {activeNetwork.chainId ? <NetworkMenuDropDown /> : null}
    </div>
  );
};

export default Network;
