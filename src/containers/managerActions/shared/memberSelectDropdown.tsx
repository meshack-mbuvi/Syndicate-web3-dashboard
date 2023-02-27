import { SearchInput } from '@/containers/managerActions/shared/searchInput';
import { clubMember } from '@/hooks/clubs/utils/types';
import { setMemberToUpdate } from '@/state/modifyCapTable/slice';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatAddress } from 'src/utils/formatAddress';

export interface IMember {
  clubTokens: string;
  memberAddress: string;
  ownershipShare: number;
  depositAmount: string;
  symbol: string;
  totalSupply: string;
}

interface IMemberSelectDropdown {
  membersData: clubMember[];
  setMemberAddress?: Dispatch<SetStateAction<string>>;
  setShowMembersList?: Dispatch<SetStateAction<boolean>>;
}

export const MemberSelectDropdown: React.FC<IMemberSelectDropdown> = ({
  membersData,
  setMemberAddress,
  setShowMembersList
}) => {
  const [membersList, setMembersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noMemberFound, setNoMemberFound] = useState(false);
  const dispatch = useDispatch();

  // handle member search
  useEffect(() => {
    if (searchTerm) {
      const searchKeyword = searchTerm.toLowerCase().trim();

      const searchResults = membersData.filter((member) => {
        const { memberAddress } = member;
        return memberAddress.toLowerCase().includes(searchKeyword);
      });
      if (searchResults.length) {
        // @ts-expect-error TS(2345): Argument of type 'IMember[]' is not assignable to ... Remove this comment to see the full error message
        setMembersList(searchResults);
        setNoMemberFound(false);
      } else {
        setMembersList([]);
        setNoMemberFound(true);
      }
    } else {
      // populate the list with all members if there is no search term.
      // @ts-expect-error TS(2345): Argument of type 'IMember[]' is not assignable to ... Remove this comment to see the full error message
      setMembersList(membersData);
    }
  }, [searchTerm, membersData]);

  const handleMemberClick = (member: any) => {
    // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    setMemberAddress(member.memberAddress);
    dispatch(setMemberToUpdate(member));
    // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    setShowMembersList(false);
  };

  return (
    <div
      className="flex flex-col p-4 rounded-1.5lg bg-black border-6 focus:outline-none"
      style={{ height: '312px', width: '400px' }}
    >
      <SearchInput
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        // web3={web3}
      />

      {noMemberFound ? null : (
        <div className="flex justify-between items-center px-2 text-gray-syn4 text-sm">
          <div className="text-gray-syn4">Member</div>
          <div className="text-gray-syn4">Club tokens (share)</div>
        </div>
      )}
      <div
        className={`mt-3 space-y-4 px-2 overflow-y-scroll h-full ${
          membersList.length <= 5 ? 'no-scroll-bar' : ''
        }`}
      >
        {membersList.length ? (
          membersList.map((member, index) => {
            const { memberAddress, ownershipShare, clubTokens } = member;
            return (
              <button
                className="flex justify-between items-center cursor-pointer w-full"
                onClick={() => handleMemberClick(member)}
                key={index}
              >
                <div className="flex justify-start text-white">
                  <img src="/images/user.svg" alt="" className="w-6 h-6 mr-3" />
                  {formatAddress(memberAddress, 6, 6)}
                </div>
                <div>
                  <span className="mr-2 text-white">
                    {floatedNumberWithCommas(clubTokens)}
                  </span>
                  <span className="text-gray-syn4">{`(${floatedNumberWithCommas(
                    ownershipShare
                  )}%)`}</span>
                </div>
              </button>
            );
          })
        ) : noMemberFound ? (
          <div className="flex flex-col justify-center w-full h-full items-center">
            <p className="text-sm font-whyte text-gray-syn4 text-center px-6">
              There are no members in this club that match your search.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
