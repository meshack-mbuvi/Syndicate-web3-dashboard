const WalletNotConnected: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom p-10">
        <div className="w-full flex justify-center mb-6">
          <img
            src="/images/exclamation.svg"
            className="h-12 w-12"
            alt="error"
          />
        </div>
        <p className="font-semibold text-2xl text-center">
          Wallet Not Connected
        </p>
        <p className="text-sm my-5 font-normal text-gray-dim text-center">
          Connect a wallet account to continue
        </p>
      </div>
    </div>
  )
};

export default WalletNotConnected;
