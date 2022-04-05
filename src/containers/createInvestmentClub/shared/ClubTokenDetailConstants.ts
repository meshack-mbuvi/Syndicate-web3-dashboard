import { isDev } from '@/utils/environment';

export const defaultTokenDetails = isDev
  ? {
      depositTokenAddress: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
      depositTokenSymbol: 'USDC',
      depositTokenLogo: '/images/TestnetTokenLogos/usdcIcon.svg',
      depositTokenName: 'Testnet USDC',
      depositTokenDecimals: 6
    }
  : {
      depositTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      depositTokenSymbol: 'USDC',
      depositTokenLogo: '/images/prodTokenLogos/usd-coin-usdc.svg',
      depositTokenName: 'USD Coin',
      depositTokenDecimals: 6
    };

export const coinList = isDev
  ? [
      {
        symbol: 'USDC',
        name: 'Testnet USDC',
        address: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
        decimals: 18,
        chainId: 4,
        logoURI: '/images/TestnetTokenLogos/usdcIcon.svg'
      },
      // {
      //   symbol: "dai",
      //   name: "Testnet DAI",
      //   address: "0xc3dbf84abb494ce5199d5d4d815b10ec29529ff8",
      //   decimals: 18,
      //   chainId: 14,
      //   logoURI: "/images/TestnetTokenLogos/daiIcon.svg",
      // },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        address: '',
        logoURI: '/images/ethereum-logo.png',
        decimal: 18,
        default: true
      }
    ]
  : [
      {
        name: 'USDCoin',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        decimals: 6,
        chainId: 1,
        logoURI: '/images/usdcicon.png'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        address: '',
        logoURI: '/images/ethereum-logo.png',
        decimal: 18,
        default: true
      }
    ];
