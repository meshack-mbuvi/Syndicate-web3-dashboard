export const CONTRACT_ADDRESSES = Object.freeze({
  // Ethereum Mainnet
  1: {
    clubERC20Factory: '0x99116a5641DC89A7cb43a9A82694177538aa0391',
    clubERC20FactoryNative: '0x2372fd8d69da29b4b328b518c6d7e84f3aa25dc3', // clubERC20FactoryETH
    erc20ClubFactory: '0x2da762e665fe9c220f7011d4ee9c2d15aaa27f9d',
    DepositTokenMintModule: '0x0449F65a5e09F0f30Aa504B8474D1D4d0e10B8B8',
    distributionsERC20: '0x2C33bf1a6778CBE0A9a7d91899e9810022bF185E',
    distributionsETH: '0x59c03ba498c76EAD610430cd277a28E5f1200329',
    ERC721MintPolicy: '0x543B8a295a485b50bA0db1D686Ab806656D7D542',
    NativeMintModule: '0x960fd5cfa6c36e9db131824ddf07df6322a053de', // EthMintModule-
    MerkleDistributorModule: '0x90543E032A7c8db9087Ab30F2a04929592700134',
    MerkleDistributorModuleERC721: '0xCaeE041fFa50165ba009EF2d7b00C1D2b0874a44',
    mintPolicy: '0x1CC6E7eD55538F77E13C057E9521de5D2f3000dd',
    policyMintERC20: '0xc92836BC3201F2784fae26875Ac1C1d5acA0aef2',
    PublicOnePerAddress: '0x4eD3fEDAaaBE0Da0D4a772A2210D0BfE5e475f91',
    SingleTokenMintModule: '0x81257650059f1bfB401797CBF9989C1F0a13a2b3',
    UtilityMintModule: '0x7D9cd3C538E8b1937a5056E74dA59E82226aB187',
    OnePerAddressMintModule: '0x7D9cd3C538E8b1937a5056E74dA59E82226aB187',
    OwnerMintModule: '0xA7c2400CBbeafFFaF77d3080bF8Ca50f51c8afC6',
    maxMemberMixin: '0xd2bab9d2bcce7e7358dd9aab21ca96b53739ee2c',
    maxTotalSupplyMixin: '0xf0ddd6634ead57c4216a1f5d3011bf78994617bb',
    tokenGatingMixin: '0x7a1bba6fa076ed5c9092ecf2e454a483db0e6b45',

    // Collectives
    ERC721Collective: '0x85a3cd3c350a0c7369F59E16d1c61D328E036Cfb',
    ERC721CollectiveFactory: '0xc1d628b9170ad61ed12f317f2146f099eb4e4727',
    FixedRenderer: '0xf90D2d41b769C2d45e3904c35fD107e7F3c89d3C',
    GuardMixinManager: '0x19cf03a6f1190062eeafd70c42cbc5f7ecff05a8',
    EthPriceMintModule: '0x85da3727b0be6096654691d26939f62526ad7ffe',
    TimeRequirements: '0x4061ec995c6e25888713a8d3d723fc5e15d62875',
    MaxPerMemberERC721: '0xfdaf4240cb10aa0d022219fb25df5d478eb21d1d',
    MaxTotalSupplyERC721: '0x77c86b6d1b03751b8162a6c1133dd23677863150',
    GuardAlwaysAllow: '0x54B2b5A9835704EBEcc9AE13Feb937F89fffE124',
    GuardNeverAllow: '0x00C327dBd884662080A8eD3FD84f0e9bc39ccbF4',
    nativeTokenPriceMerkleMintModule:
      '0xd200c8bca3ee5f264547489ed025a22e6aff88b4',

    // Precommit
    ERC20DealFactory: '', // TODO
    AllowancePrecommitModuleERC20: '', // TODO: add contract address for mainnet
    MinPerMemberERC20Mixin: '', // TODO
    DealTimeRequirements: '', // TODO
    GuardModuleAllowed: '', // TODO
    usdcContract: '' // TODO: add contract address for mainnet
  },

  // Goerli
  5: {
    clubERC20Factory: '',
    clubERC20FactoryNative: '',
    erc20ClubFactory: '0xed582132c33de5b5a661de3d2dce5fb8f2d8f33d',
    DepositTokenMintModule: '0x56b21198b67ffa1d2882463401bcdd810b11bb1c',
    distributionsERC20: '0x437694C7ad22cBf593C83173FBFBc8301a4e76d6',
    distributionsETH: '0x73FF69585B85E9bD24153972E2a034e1bd88043A',
    ERC721MintPolicy: '',
    NativeMintModule: '0xc6984ed3b22f212e0c8a3dc80454478b58f5c176', // EthMintModule-
    MerkleDistributorModule: '0x19cf03a6f1190062eeafd70c42cbc5f7ecff05a8',
    MerkleDistributorModuleERC721: '0x4d66954dc81b13314c90a5e87464248813b77422',
    mintPolicy: '',
    policyMintERC20: '',
    PublicOnePerAddress: '',
    SingleTokenMintModule: '',
    UtilityMintModule: '',
    OnePerAddressMintModule: '',
    OwnerMintModule: '0x5a25d511b8ccf2894950243d1c57ca9f1447caba',
    maxMemberMixin: '0x638d445d126053f071a834df6ca919dc4852a468',
    maxTotalSupplyMixin: '0x0efa30750e655f20c6e16248eb283b972e370c28',
    tokenGatingMixin: '0xf8ca1551b6878779e4f4e60ffff07ef74ac6051e',

    // Collectives
    ERC721Collective: '0x71847a69033cab33cdf266e0ee15452e4ff0e7f3',
    ERC721CollectiveFactory: '0x45a70092aa014a03b1412aa898859a83d286ff4e',
    FixedRenderer: '0x1b9ab6847667bdf00434eaa4e508bb565f1b3b61',
    GuardMixinManager: '0x4ad52d81ad5fb141fabfd2846525af10f45fb295',
    EthPriceMintModule: '0x09cf30f32ba0f0a5af9b32a5b6bad625e1698678', // AllowModules
    TimeRequirements: '0xc08bc955da8968327405642d65a7513ce5eb31ed',
    MaxPerMemberERC721: '0x960fd5cfa6c36e9db131824ddf07df6322a053de',
    MaxTotalSupplyERC721: '0x2372fd8d69da29b4b328b518c6d7e84f3aa25dc3',
    GuardAlwaysAllow: '0xd81d0cae5d4ac81b7aca5db7a76ec7d82260ca75',
    GuardNeverAllow: '0xab5390d3708c78e84b82de12d3e07d94145a3c0b',
    nativeTokenPriceMerkleMintModule:
      '0x124D5DcF3575b528de9c85dae6afA43bB7ba736b',

    // Precommit
    ERC20DealFactory: '0x2C74e40B2B2A383C58a48917a48b51835A85b923',
    AllowancePrecommitModuleERC20: '0x0a98468cf18DB558B1d6BF831C4895Db0F45837C',
    MinPerMemberERC20Mixin: '0x735150ED24728904B90198D6E4022Bcad6B5dD15',
    DealTimeRequirements: '0x5744686c44d3b9991463e9affba95beb7cbfda69',
    GuardModuleAllowed: '0xC32dF31446770f570c09ed882fEE7a45785dE4a5',
    usdcContract: '0xb6e77703b036bfb97dd40a22f021a85ae4a6d750' // can remove this once we add support for other ERC20s
  },

  // Matic
  137: {
    clubERC20Factory: '0x3902AB762a94b8088b71eE5c84bC3C7d2075646B',
    clubERC20FactoryNative: '0xae6328C067bddFbA4963e2A1F52BaaF11a2e2588', // clubERC20FactoryETH
    erc20ClubFactory: '0xc08bc955da8968327405642d65a7513ce5eb31ed',
    DepositTokenMintModule: '0xa052E325e112A5a6DfF7F4115B2f6DAA15eDa2F3',
    distributionsERC20: '0x909F853d24Ff9691F3cca44E8532B6D400387937',
    distributionsETH: '0x2C33bf1a6778CBE0A9a7d91899e9810022bF185E',
    NativeMintModule: '0xA84443aa452DaB22467376e2BEA9e98EB20aCA1b', // EthMintModule-
    ERC721Membership: '0x43A23837a14F3FafB7cb6e4924586C970108c9Be',
    ERC721MintPolicy: '0xf9b79c55865EdD9ECed42b9C49312b5E03230d5D',
    MerkleDistributorModule: '0xc0e779A917EFED7D6dB8D03b79915968651c6ce4',
    MerkleDistributorModuleERC721: '0x1D73B78249363c6B5Cb6A0AdD6a1Cf21D5390eF2',
    policyMintERC20: '0x945B46289483aB88ACE4E41646eEC12B3B702dda',
    PublicOnePerAddress: '0x0E580f047a6553ec066fedA7D5DA6CbB327D670b',
    SingleTokenMintModule: '',
    UtilityMintModule: '',
    OnePerAddressMintModule: '',
    OwnerMintModule: '0x4dd964Bb38828789de447787B3435D519E4E7282',
    maxMemberMixin: '0x0efa30750e655f20c6e16248eb283b972e370c28',
    maxTotalSupplyMixin: '0x2372fd8d69da29b4b328b518c6d7e84f3aa25dc3',
    tokenGatingMixin: '0x22a3d80299d4f2437611e1ca0b7c8d50f4816c6e',

    // Collectives
    ERC721Collective: '', // TODO
    ERC721CollectiveFactory: '', // TODO
    FixedRenderer: '', // TODO
    GuardMixinManager: '0x4ad52d81ad5fb141fabfd2846525af10f45fb295',
    EthPriceMintModule: '', // AllowModules // TODO
    TimeRequirements: '0xd81d0cae5d4ac81b7aca5db7a76ec7d82260ca75',
    MaxPerMemberERC721: '', // TODO
    MaxTotalSupplyERC721: '', // TODO
    GuardAlwaysAllow: '0x5eF43cd77a929A48E0B6fCEf614a460336e3070a',
    GuardNeverAllow: '0xb47FaFc19659Ada3B12c3D072Dd6768429aC2272',
    nativeTokenPriceMerkleMintModule:
      '0x0942a0f4a9e3f4ce890d86491b28b187b21bb219',

    // Precommit
    ERC20DealFactory: '', // TODO
    AllowancePrecommitModuleERC20: '', // TODO: add contract address for Polygon
    MinPerMemberERC20Mixin: '', // TODO
    DealTimeRequirements: '', // TODO
    GuardModuleAllowed: '', // TODO
    usdcContract: '' // TODO: add contract address for Polygon
  }
});
