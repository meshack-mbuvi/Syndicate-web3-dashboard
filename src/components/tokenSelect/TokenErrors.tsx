export const TokenNoResultSection: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col justify-center space-y-2 text-center px-8">
      <p className="font-whyte text-white">No results found</p>
      <p className="text-sm font-whyte text-gray-3">
        Try searching a different name or <br />
        pasting the contract address
      </p>
    </div>
  );
};

export const TokenNotFoundSection: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col justify-center space-y-2 text-center px-8">
      <p className="font-whyte text-white">No matching token found</p>
      <p className="text-sm font-whyte text-gray-3">
        Try searching a different token
      </p>
    </div>
  );
};
