/** List of tokens */
export const coinsList = [
  // stablecoins
  {
    symbol: 'usdc',
    name: 'USD Coin',
    contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    icon: '/images/prodTokenLogos/usd-coin-usdc.svg',
    decimal: 6,
    default: true
  },
  {
    symbol: 'dai',
    name: 'Dai',
    contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    icon: '/images/prodTokenLogos/dai-dai.svg',
    decimal: 18,
    default: true
  },
  {
    symbol: 'usdt',
    name: 'Tether',
    contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    icon: '/images/prodTokenLogos/tether-usdt.svg',
    decimal: 6,
    default: true
  },
  {
    symbol: 'busd',
    name: 'Binance USD',
    contractAddress: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    icon: '/images/prodTokenLogos/binance-usd-busd.svg',
    decimal: 18,
    default: true
  },
  {
    symbol: 'husd',
    name: 'HUSD',
    contractAddress: '0xdf574c24545e5ffecb9a659c229253d4111d87e1',
    icon: '/images/prodTokenLogos/husd-husd.svg',
    decimal: 8,
    default: true
  },

  {
    symbol: 'lusd',
    name: 'Liquity USD',
    contractAddress: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
    icon: '/images/prodTokenLogos/liquity-usd-lusd.png',
    decimal: 18
  },
  {
    symbol: 'eurs',
    name: 'STASIS EURO',
    contractAddress: '0xdB25f211AB05b1c97D595516F45794528a807ad8',
    icon: '/images/prodTokenLogos/stasis-euro-eurs.webp',
    decimal: 2
  },
  {
    symbol: 'rsr',
    name: 'Reserve Rights',
    contractAddress: '0x8762db106b2c2a0bccb3a80d1ed41273552616e8',
    icon: '/images/prodTokenLogos/reserve-rights-rsr.svg',
    decimal: 18
  },
  {
    symbol: 'fei',
    name: 'Fei Protocol',
    contractAddress: '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
    icon: '/images/prodTokenLogos/fei-protocol-fei.webp',
    decimal: 18
  },
  {
    symbol: 'unistake',
    name: 'Unistake',
    contractAddress: '0x9ed8e7c9604790f7ec589f99b94361d8aab64e5e',
    icon: '/images/prodTokenLogos/unistake-unistake.png',
    decimal: 18
  },
  {
    symbol: 'lit',
    name: 'Litentry',
    contractAddress: '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
    icon: '/images/prodTokenLogos/litentry-lit.webp',
    decimal: 18
  },
  {
    symbol: 'xft',
    name: 'Offshift',
    contractAddress: '0xabe580e7ee158da464b51ee1a83ac0289622e6be',
    icon: '/images/prodTokenLogos/offshift-xft.png',
    decimal: 18
  },
  {
    symbol: 'bca',
    name: 'Bitcoiva',
    contractAddress: '0xc222e5b89309fab5faf55a3b3bd9082be834916c',
    icon: '/images/prodTokenLogos/bitcoiva-bca.png',
    decimal: 6
  },
  {
    symbol: '8pay',
    name: '8Pay',
    contractAddress: '0xfeea0bdd3d07eb6fe305938878c0cadbfa169042',
    icon: '/images/prodTokenLogos/8pay-8pay.jpeg',
    decimal: 18
  },
  {
    symbol: 'bec',
    name: 'Betherchip',
    contractAddress: '0x59c033ec65e6b9c501c1ee34fb42f2575da4b517',
    icon: '/images/prodTokenLogos/betherchip-bec.webp',
    decimal: 18
  },
  {
    symbol: 'dvi',
    name: 'Dvision Network',
    contractAddress: '0x10633216e7e8281e33c86f02bf8e565a635d9770',
    icon: '/images/prodTokenLogos/dvision-network-dvi.webp',
    decimal: 18
  },
  {
    symbol: 'erc20',
    name: 'ERC20',
    contractAddress: '0xc3761eb917cd790b30dad99f6cc5b4ff93c4f9ea',
    icon: '/images/prodTokenLogos/erc20-erc20.webp',
    decimal: 18
  },
  {
    symbol: 'corx',
    name: 'CorionX',
    contractAddress: '0x26a604dffe3ddab3bee816097f81d3c4a2a4cf97',
    icon: '/images/prodTokenLogos/corionx-corx.png',
    decimal: 8
  },
  {
    symbol: 'frax',
    name: 'Frax',
    contractAddress: '0x853d955acef822db058eb8505911ed77f175b99e',
    icon: '/images/prodTokenLogos/frax-frax.webp',
    decimal: 18
  },
  {
    symbol: 'asta',
    name: 'ASTA',
    contractAddress: '0xf2ddae89449b7d26309a5d54614b1fc99c608af5',
    icon: '/images/prodTokenLogos/asta-asta.png',
    decimal: 18
  },
  {
    symbol: 'tru',
    name: 'TrueFi',
    contractAddress: '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
    icon: '/images/prodTokenLogos/truefi-tru.png',
    decimal: 8
  },
  {
    symbol: 'uncx',
    name: 'UniCrypt',
    contractAddress: '0xadb2437e6f65682b85f814fbc12fec0508a7b1d0',
    icon: '/images/prodTokenLogos/unicrypt-uncx.png',
    decimal: 18
  },
  {
    symbol: 'gix',
    name: 'GoldFinX',
    contractAddress: '0xbd434a09191d401da3283a5545bb3515d033b8c4',
    icon: '/images/prodTokenLogos/goldFinX-gix.png',
    decimal: 18
  },
  {
    symbol: 'usdk',
    name: 'USDK',
    contractAddress: '0x1c48f86ae57291f7686349f12601910bd8d470bb',
    icon: '/images/prodTokenLogos/usdk-usdk.png',
    decimal: 18
  },
  {
    symbol: 'xpt',
    name: 'XPToken.io',
    contractAddress: '0xf0814d0e47f2390a8082c4a1bd819fdde50f9bfc',
    icon: '/images/prodTokenLogos/xtoken-xpt.png',
    decimal: 8
  },
  {
    symbol: 'scs',
    name: 'Speedcash',
    contractAddress: '0x81995ff7aee5c780192b47e0b42a7a86692d1415',
    icon: '/images/prodTokenLogos/speedcash-scs.png',
    decimal: 18
  },
  {
    symbol: 'zum',
    name: 'ZUM TOKEN',
    contractAddress: '0xe0b9bcd54bf8a730ea5d3f1ffce0885e911a502c',
    icon: '/images/prodTokenLogos/zumtoken-zum.png',
    decimal: 8
  },
  {
    symbol: 'obr',
    name: 'OBR',
    contractAddress: '0x595643d83b35df38e29058976c04000acfa31570',
    icon: '/images/prodTokenLogos/obr-obr.png',
    decimal: 18
  },
  {
    symbol: 'axis',
    name: 'AXIS Token',
    contractAddress: '0xf0c5831ec3da15f3696b4dad8b21c7ce2f007f28',
    icon: '/images/prodTokenLogos/axis-axis.png',
    decimal: 8
  },
  {
    symbol: 'epay',
    name: 'EthereumPay',
    contractAddress: '0x2b5ca2f9510cf1e3595ff219f24d75d4244585ea',
    icon: '/images/prodTokenLogos/ethereumpay-epay.png',
    decimal: 18
  },
  {
    symbol: 'sup8eme',
    name: 'SUP8EME',
    contractAddress: '0x47935edfb3cdd358c50f6c0add1cc24662e30f5f',
    icon: '/images/prodTokenLogos/sup8eme-sup8eme.png',
    decimal: 6
  },
  {
    symbol: 'swiss',
    name: 'swiss.finance',
    contractAddress: '0x692eb773e0b5b7a79efac5a015c8b36a2577f65c',
    icon: '/images/prodTokenLogos/swissfinance-swiss.png',
    decimal: 18
  },
  {
    symbol: 'lotto',
    name: 'Lotto',
    contractAddress: '0xb0dfd28d3cf7a5897c694904ace292539242f858',
    icon: '/images/prodTokenLogos/lotto-lotto.webp',
    decimal: 18
  },
  {
    symbol: 'ust',
    name: 'TerraUSD',
    contractAddress: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
    icon: '/images/prodTokenLogos/terrausd-ust.webp',
    decimal: 18
  },
  {
    symbol: 'mark',
    name: 'Benchmark Protocol',
    contractAddress: '0x67c597624b17b16fb77959217360b7cd18284253',
    icon: '/images/prodTokenLogos/benchmark-protocol-mark.jpeg',
    decimal: 9
  },
  {
    symbol: 'mts',
    name: 'Metis',
    contractAddress: '0xa9598333b99d14d90bc81cad8af82c4c70625e75',
    icon: '/images/prodTokenLogos/metis-mts.png',
    decimal: 18
  },
  {
    symbol: 'tap',
    name: 'Tapmydata',
    contractAddress: '0x7f1f2d3dfa99678675ece1c243d3f7bc3746db5d',
    icon: '/images/prodTokenLogos/tapmydata-tap.png',
    decimal: 18
  },
  {
    symbol: 'DTH',
    name: 'Dether',
    contractAddress: '0x5adc961d6ac3f7062d2ea45fefb8d8167d44b190',
    icon: '/images/prodTokenLogos/dether-dth.webp',
    decimal: 18
  },
  {
    symbol: 'smbswap',
    name: 'SimbCoin Swap',
    contractAddress: '0x53bd789f2cdb846b227d8ffc7b46ed4263231fdf',
    icon: '/images/prodTokenLogos/simbCoinswap-smbswap.png',
    decimal: 18
  },
  {
    symbol: 'ucap',
    name: 'Unicap.Finance',
    contractAddress: '0xbaa70614c7aafb568a93e62a98d55696bcc85dfe',
    icon: '/images/prodTokenLogos/unicap-finance-ucap.png',
    decimal: 18
  },
  {
    symbol: 'usdn',
    name: 'Neutrino USD',
    contractAddress: '0x674C6Ad92Fd080e4004b2312b45f796a192D27a0',
    icon: '/images/prodTokenLogos/neutrino-usdn.webp',
    decimal: 18
  },
  {
    symbol: 'axiav3',
    name: 'Axia',
    contractAddress: '0x793786e2dd4cc492ed366a94b88a3ff9ba5e7546',
    icon: '/images/prodTokenLogos/axia-axia.png',
    decimal: 18
  },
  {
    symbol: 'voice',
    name: 'Voice Token',
    contractAddress: '0x2e2364966267b5d7d2ce6cd9a9b5bd19d9c7c6a9',
    icon: '/images/prodTokenLogos/voice-voice.png',
    decimal: 18
  },
  {
    symbol: 'sca',
    name: 'Scaleswap Token',
    contractAddress: '0x1fbd3df007eb8a7477a1eab2c63483dcc24effd6',
    icon: '/images/prodTokenLogos/scaleswap-sca.png',
    decimal: 18
  },
  {
    symbol: 'ubin',
    name: 'Ubiner',
    contractAddress: '0xb9eceb9f717852ad0d936b46155cb0c0f43cbe8e',
    icon: '/images/prodTokenLogos/ubiner-ubin.png',
    decimal: 18
  },
  {
    symbol: 'ubx',
    name: 'UBIX Network',
    contractAddress: '0xf5b5efc906513b4344ebabcf47a04901f99f09f3',
    icon: '/images/prodTokenLogos/UBIX-ubx.webp',
    decimal: 0
  },
  {
    symbol: 'dynmt',
    name: 'Dynamite Token',
    contractAddress: '0x3b7f247f21bf3a07088c2d3423f64233d4b069f7',
    icon: '/images/prodTokenLogos/dynamite-dynmt.png',
    decimal: 2
  },
  {
    symbol: 'yvs',
    name: 'YVS Finance',
    contractAddress: '0xec681f28f4561c2a9534799aa38e0d36a83cf478',
    icon: '/images/prodTokenLogos/yvsfinance-yvs.png',
    decimal: 18
  },
  {
    symbol: 'caps',
    name: 'Ternoa',
    contractAddress: '0x03be5c903c727ee2c8c4e9bc0acc860cca4715e2',
    icon: '/images/prodTokenLogos/ternoa-caps.png',
    decimal: 18
  },
  {
    symbol: 'bup',
    name: 'BuildUp',
    contractAddress: '0xb04dfdb8271ed2d5e13858562c44a77d3ceb9e57',
    icon: '/images/prodTokenLogos/buildup-bup.png',
    decimal: 18
  },
  {
    symbol: 'enj',
    name: 'Enjin Coin',
    contractAddress: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
    icon: '/images/prodTokenLogos/enjin-coin-enj.webp',
    decimal: 18
  },
  {
    symbol: 'gusd',
    name: 'Gemini Dollar',
    contractAddress: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
    icon: '/images/prodTokenLogos/gemini-dollar-gusd.webp',
    decimal: 2
  },
  {
    symbol: 'don',
    name: 'Don-key',
    contractAddress: '0x217ddead61a42369a266f1fb754eb5d3ebadc88a',
    icon: '/images/prodTokenLogos/donkey-don.png',
    decimal: 18
  },
  {
    symbol: 'clv',
    name: 'Clover Finance',
    contractAddress: '0x80c62fe4487e1351b47ba49809ebd60ed085bf52',
    icon: '/images/prodTokenLogos/clover-finance-clv.webp',
    decimal: 18
  },
  {
    symbol: 'enol',
    name: 'Ethanol',
    contractAddress: '0x63d0eea1d7c0d1e89d7e665708d7e8997c0a9ed6',
    icon: '/images/prodTokenLogos/ethanol-enol.png',
    decimal: 18
  },
  {
    symbol: 'fcd',
    name: 'Future Cash Digital',
    contractAddress: '0x74db83feba1574fec860413eb509d1ddfb1b730b',
    icon: '/images/prodTokenLogos/futurecashdigital-fcd.png',
    decimal: 18
  },
  {
    symbol: 'jem',
    name: 'Jem',
    contractAddress: '0x21cf09bc065082478dcc9ccb5fd215a978dc8d86',
    icon: '/images/prodTokenLogos/jem-jem.png',
    decimal: 18
  },
  {
    symbol: 'krg',
    name: 'Karaganda Token',
    contractAddress: '0x32a8cd4d04d5f2e5de30ad73ef0a377eca2fdd98',
    icon: '/images/prodTokenLogos/karaganda-krg.jpeg',
    decimal: 18
  },
  {
    symbol: 'lst',
    name: 'Libartysharetoken',
    contractAddress: '0x355376d6471e09a4ffca8790f50da625630c5270',
    icon: '/images/prodTokenLogos/libartysharetoken-lst.png',
    decimal: 18
  },
  {
    symbol: 'xcf',
    name: 'Cenfura Token',
    contractAddress: '0x010d14d36c3ea6570d240ae3ac9d660398f7c48e',
    icon: '/images/prodTokenLogos/cenfura-xcf.png',
    decimal: 18
  },
  {
    symbol: 'ppay',
    name: 'Plasma Finance',
    contractAddress: '0x054d64b73d3d8a21af3d764efd76bcaa774f3bb2',
    icon: '/images/prodTokenLogos/plasma-finance-ppay.webp',
    decimal: 18
  },
  {
    symbol: 'bund',
    name: 'Bundles',
    contractAddress: '0x8d3e855f3f55109d473735ab76f753218400fe96',
    icon: '/images/prodTokenLogos/bundles-bund.png',
    decimal: 18
  },
  {
    symbol: 'bfi',
    name: 'BitDefi',
    contractAddress: '0x2b2b0559081c41e962777b5049632fdb30f7e652',
    icon: '/images/prodTokenLogos/bitdefi-bfi.png',
    decimal: 8
  },
  {
    symbol: 'yfd',
    name: 'Your Finance Decentralized',
    contractAddress: '0x4f4f0ef7978737ce928bff395529161b44e27ad9',
    icon: '/images/prodTokenLogos/yfd-yfd.webp',
    decimal: 18
  },
  {
    symbol: 'sand',
    name: 'The Sandbox',
    contractAddress: '0x3845badade8e6dff049820680d1f14bd3903a5d0',
    icon: '/images/prodTokenLogos/sandbox-sand.webp',
    decimal: 18
  },
  {
    symbol: 'tusd',
    name: 'TrueUSD',
    contractAddress: '0x0000000000085d4780B73119b644AE5ecd22b376',
    icon: '/images/prodTokenLogos/true-usd-tusd.webp',
    decimal: 18
  },
  {
    symbol: 'susd',
    name: 'sUSD',
    contractAddress: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    icon: '/images/prodTokenLogos/susd-susd.webp',
    decimal: 18
  },
  {
    symbol: 'bel',
    name: 'Bella Protocol',
    contractAddress: '0xa91ac63d040deb1b7a5e4d4134ad23eb0ba07e14',
    icon: '/images/prodTokenLogos/bella-protocol-bel.webp',
    decimal: 18
  },
  {
    symbol: 'dis',
    name: 'TosDis',
    contractAddress: '0x220b71671b649c03714da9c621285943f3cbcdc6',
    icon: '/images/prodTokenLogos/tosdis-dis.png',
    decimal: 18
  },
  {
    symbol: 'btnyx',
    name: 'BitOnyx Token',
    contractAddress: '0x8fb6c8a44a4e23fd1f5a936818b39083b4cdc865',
    icon: '/images/prodTokenLogos/bitonyx-btnyx.png',
    decimal: 18
  },
  {
    symbol: 'load',
    name: 'LOAD Network',
    contractAddress: '0xa883e72c12473ded50a5fbffa60e4000fa5fe3c8',
    icon: '/images/prodTokenLogos/loadnetwork-load.png',
    decimal: 8
  },
  {
    symbol: 'mveda',
    name: 'MedicalVeda',
    contractAddress: '0xcbe7142f5c16755d8683ba329efa1abf7b54482d',
    icon: '/images/prodTokenLogos/medicalVeda-mveda.png',
    decimal: 8
  },
  {
    symbol: 'camp',
    name: 'Camp',
    contractAddress: '0xe9e73e1ae76d17a16cc53e3e87a9a7da78834d37',
    icon: '/images/prodTokenLogos/ccamp-camp.png',
    decimal: 18
  },
  {
    symbol: 'gfarm2',
    name: 'Gains Farm',
    contractAddress: '0x831091da075665168e01898c6dac004a867f1e1b',
    icon: '/images/prodTokenLogos/gainsfarm-gfarm2.png',
    decimal: 18
  },
  {
    symbol: 'tat',
    name: 'Tatcoin',
    contractAddress: '0x37ee79e0b44866876de2fb7f416d0443dd5ae481',
    icon: '/images/prodTokenLogos/tatcoin-tat.png',
    decimal: 18
  },
  {
    symbol: 'feg',
    name: 'FEG Token',
    contractAddress: '0x389999216860ab8e0175387a0c90e5c52522c945',
    icon: '/images/prodTokenLogos/fegtoken-feg.webp',
    decimal: 9
  },
  {
    symbol: 'swagg',
    name: 'Swagg Network',
    contractAddress: '0xa19a40fbd7375431fab013a4b08f00871b9a2791',
    icon: '/images/prodTokenLogos/swaggnetwork-swagg.png',
    decimal: 4
  },
  {
    symbol: 'cbc',
    name: 'CBC.network',
    contractAddress: '0x26db5439f651caf491a87d48799da81f191bdb6b',
    icon: '/images/prodTokenLogos/cbc-network-cbc.png',
    decimal: 8
  },
  {
    symbol: 'chr',
    name: 'Chromia',
    contractAddress: '0x8a2279d4a90b6fe1c4b30fa660cc9f926797baa2',
    icon: '/images/prodTokenLogos/chromia-chr.webp',
    decimal: 6
  },
  {
    symbol: 'avt',
    name: 'Aventus',
    contractAddress: '0x0d88ed6e74bbfd96b831231638b66c05571e824f',
    icon: '/images/prodTokenLogos/aventus-avt.png',
    decimal: 18
  },
  {
    symbol: 'yficg',
    name: 'YFI Credits Group',
    contractAddress: '0x9080e92296a176883aab1d7d1b7e50bc055b0caa',
    icon: '/images/prodTokenLogos/yficreditsgroup-yficg.png',
    decimal: 18
  },
  {
    symbol: 'twi',
    name: 'Trade.win',
    contractAddress: '0xdad26bce7dcf59cd03a2455558e4dd73e1c07b66',
    icon: '/images/prodTokenLogos/tradewin-twi.png',
    decimal: 18
  },
  {
    symbol: 'BDT',
    name: 'BlackDragon Token',
    contractAddress: '0x4efe8665e564bf454ccf5c90ee16817f7485d5cf',
    icon: '/images/prodTokenLogos/blackdragon-bdt.png',
    decimal: 18
  },
  {
    symbol: 'lmy',
    name: 'Lunch Money',
    contractAddress: '0x66fd97a78d8854fec445cd1c80a07896b0b4851f',
    icon: '/images/prodTokenLogos/lunchmoney-lmy.png',
    decimal: 18
  },
  {
    symbol: 'utu',
    name: 'UTU Coin',
    contractAddress: '0xa58a4f5c4bb043d2cc1e170613b74e767c94189b',
    icon: '/images/prodTokenLogos/utucoin-utu.png',
    decimal: 18
  },
  {
    symbol: 'awx',
    name: 'AurusDeFi',
    contractAddress: '0xa51fc71422a30fa7ffa605b360c3b283501b5bf6',
    icon: '/images/prodTokenLogos/aurusDeFi-awx.png',
    decimal: 18
  },
  {
    symbol: 'hyve',
    name: 'Hyve',
    contractAddress: '0xd794dd1cada4cf79c9eebaab8327a1b0507ef7d4',
    icon: '/images/prodTokenLogos/hyve-hyve.png',
    decimal: 18
  },
  {
    symbol: 'yfiii',
    name: 'YFIII',
    contractAddress: '0x649ebf73043ffcc70a59855ecd8a568fd996415a',
    icon: '/images/prodTokenLogos/yfiii-yfiii.png',
    decimal: 18
  },
  {
    symbol: 'cpr',
    name: 'CIPHER',
    contractAddress: '0x20ae0ca9d42e6ffeb1188f341a7d63450452def6',
    icon: '/images/prodTokenLogos/cipher-cpr.png',
    decimal: 18
  },
  {
    symbol: 'pax',
    name: 'Paxos Standard',
    contractAddress: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    icon: '/images/prodTokenLogos/paxos-standard-pax.webp',
    decimal: 18
  },
  {
    symbol: 'marsh',
    name: 'Unmarshal',
    contractAddress: '0x5a666c7d92e5fa7edcb6390e4efd6d0cdd69cf37',
    icon: '/images/prodTokenLogos/unmarshal-marsh.webp',
    decimal: 18
  },
  {
    symbol: 'yyfi',
    name: 'YYFI.Protocol',
    contractAddress: '0xaf20b44c1c651d1d29cfb916ee2a0630b828eb7a',
    icon: '/images/prodTokenLogos/yyfiprotocol-yyfi.webp',
    decimal: 18
  },
  {
    symbol: 'now',
    name: 'ChangeNOW',
    contractAddress: '0xe9a95d175a5f4c9369f3b74222402eb1b837693b',
    icon: '/images/prodTokenLogos/changenow-now.png',
    decimal: 8
  }
];
