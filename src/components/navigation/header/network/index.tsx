import { useSelector } from "react-redux";
import { AppState } from "@/state";
import NetworkMenuDropDown from "./networkMenuDropdown";

export const Network: React.FC = () => {
  const {
    web3Reducer: { web3 },
  } = useSelector((state: AppState) => state);

  const { activeNetwork } = web3;

  return (
    <div className="wallet-connect">
      {activeNetwork.chainId ? <NetworkMenuDropDown web3={web3} /> : null}
    </div>
  );
};

export default Network;
