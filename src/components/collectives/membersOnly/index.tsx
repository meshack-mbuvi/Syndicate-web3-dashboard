import { B3 } from '@/components/typography';
import { LockIcon } from '@/components/iconWrappers';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/state';
import { showWalletModal } from '@/state/wallet/actions';

const MembersOnly = () => {
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const handleConnectWallet = () => {
    dispatch(showWalletModal());
  };
  return (
    <>
      <div className="flex text-center">
        <div className="flex-grow-1 mr-1 pt-0.5">
          <LockIcon color={`text-white`} />
        </div>
        <p className="w-full text-center text-white">Members only</p>
      </div>
      {account ? (
        <B3 extraClasses="text-gray-syn4 font-light mt-2">
          Only holders of the NFT can view private data
        </B3>
      ) : (
        <B3
          extraClasses="text-blue font-light mt-2 cursor-pointer"
          onClick={handleConnectWallet}
        >
          Connect wallet
        </B3>
      )}
    </>
  );
};

export default MembersOnly;
