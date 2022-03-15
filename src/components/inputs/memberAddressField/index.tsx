import { FC, useState, SetStateAction, Dispatch } from "react";
import { formatAddress } from "@/utils/formatAddress";
import {
  MemberSelectDropdown,
  IMember,
} from "@/containers/managerActions/shared/memberSelectDropdown";
interface IMemberField {
  memberAddress: string;
  className?: string;
  memberList: IMember[];
  setMemberAddress: Dispatch<SetStateAction<string>>;
}

export const MemberAddressField: FC<IMemberField> = ({
  memberAddress,
  className,
  memberList,
  setMemberAddress,
}) => {
  const [showMemberList, setShowMemberList] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowMemberList(!showMemberList)}
        className={`w-full flex items-center justify-between font-whyte text-base leading-6 bg-transparent p-4 rounded-md  border-1 border-gray-syn6 max-w-400 h-14 cursor-pointer outline-none text-white ${className}`}
      >
        <div className="flex">
          <img className="w-6 h-6" src="/images/user.svg" alt="user" />
          <span className="ml-2 text-white">{formatAddress(memberAddress, 6, 4)}</span>
        </div>
        <div>
          <img className="w-4 h-4" src="/images/double-chevron.svg" alt="" />
        </div>
      </button>
      {showMemberList && (
        <div className="absolute z-10 left-10 top-60">
          <MemberSelectDropdown
            membersData={memberList}
            setMemberAddress={setMemberAddress}
            setShowMembersList={setShowMemberList}
          />
        </div>
      )}
    </>
  );
};

export default MemberAddressField;