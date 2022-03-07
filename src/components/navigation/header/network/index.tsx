import { useSelector } from "react-redux";
import { AppState } from "@/state";
import NetworkMenuDropDown from "./networkMenuDropdown";

export const Network: React.FC = () => {
  const {
    web3Reducer: { web3 },
  } = useSelector((state: AppState) => state);

  return (
    <div className="wallet-connect">
      <NetworkMenuDropDown web3={web3} />
    </div>
  );
};

export default Network;
