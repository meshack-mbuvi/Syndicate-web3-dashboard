import CreateClubButton from '@/components/createClubButton';
import { AppState } from '@/state';
import { showWalletModal } from '@/state/wallet/actions';
import { Status } from '@/state/wallet/types';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const walletNoClubs = {
  noun: 'You’re not in any investment clubs yet',
  verb: 'Clubs you create or join will appear here'
};

const walletNotConnected = {
  noun: 'Invest together with an investment club',
  verb: 'Transform any wallet into a web3 investment club'
};

const PortfolioEmptyState: React.FC = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, status }
    }
  } = useSelector((state: AppState) => state);

  const [emptyState, setEmptyState] = useState(walletNoClubs);

  useEffect(() => {
    const cacheWallet = Boolean(localStorage.getItem('cache'));

    if (!account && status === Status.DISCONNECTED && !cacheWallet) {
      dispatch(showWalletModal());
    }
  }, [account, status]);

  useEffect(() => {
    if (!account) {
      setEmptyState(walletNotConnected);
    } else {
      setEmptyState(walletNoClubs);
    }
  }, [account]);

  return (
    <div className="text-center flex-col" style={{ marginTop: '196px' }}>
      <div className="flex flex-col justify-start items-center mt-20">
        <img
          style={{ marginBottom: '30.42px' }}
          src="images/syndicateStatusIcons/newPortfolioEmptyIcon.svg"
          alt="empty icon"
        />
        <span className="text-lg md:text-2xl">{emptyState.noun}</span>
        <p className="text-gray-syn4 pt-2.5">{emptyState.verb}</p>
        <div className="mt-6">
          <CreateClubButton />
        </div>
      </div>
    </div>
  );
};

export default PortfolioEmptyState;
