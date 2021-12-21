import { showWalletModal } from "@/state/wallet/actions";
import { useDispatch } from "react-redux";

const ConnectWalletAction: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col w-full text-center space-y-10">
      <div className="text-xl pt-4">
        Please connect your wallet to access this club.
      </div>
      <button
        className="w-full bg-white text-black rounded-custom py-4 hover:bg-opacity-90"
        onClick={() => dispatch(showWalletModal())}
      >
        Connect wallet
      </button>
    </div>
  );
};

export default ConnectWalletAction;
