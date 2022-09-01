export const CONTRACT_ADDRESSES = Object.freeze({
  // Ethereum Mainnet
  1: {
    clubERC20Factory: '0x99116a5641DC89A7cb43a9A82694177538aa0391',
    clubERC20FactoryNative: '0x2372fd8d69da29b4b328b518c6d7e84f3aa25dc3', // clubERC20FactoryETH
    DepositTokenMintModule: '0x0449F65a5e09F0f30Aa504B8474D1D4d0e10B8B8',
    distributionsERC20: '0x493742eb36d12bb0ff5a146782af6dd69de7b7c3',
    distributionsETH: '0x3bbf7d441db87968ab891b724ee3cc00de3d850b',
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
    OwnerMintModule2: '0x06507C449B1E8EBB8247f44b715F9Fe4E51B365A',

    // Collectives
    ERC721Collective: '0x4d66954dc81b13314c90a5e87464248813b77422',
    ERC721CollectiveFactory: '0xc1d628b9170ad61ed12f317f2146f099eb4e4727',
    FixedRenderer: '0xf90D2d41b769C2d45e3904c35fD107e7F3c89d3C',
    GuardMixinManager: '0x19cf03a6f1190062eeafd70c42cbc5f7ecff05a8',
    EthPriceMintModule: '0x85da3727b0be6096654691d26939f62526ad7ffe',
    TimeRequirements: '0x4061ec995c6e25888713a8d3d723fc5e15d62875',
    MaxPerMemberERC721: '0xfdaf4240cb10aa0d022219fb25df5d478eb21d1d',
    MaxTotalSupplyERC721: '0x77c86b6d1b03751b8162a6c1133dd23677863150',
    GuardAlwaysAllow: '0x54B2b5A9835704EBEcc9AE13Feb937F89fffE124',
    GuardNeverAllow: '0x00C327dBd884662080A8eD3FD84f0e9bc39ccbF4'
  },

  // Rinkeby
  4: {
    clubERC20Factory: '0xBaE7eaA8317B3652dad3886caF454Da0706F53Ca',
    clubERC20FactoryNative: '0x04A8A99C80cC19E7a56342Fef2d8DAC6cd5f8dD4', // clubERC20FactoryETH
    DepositTokenMintModule: '0x9cAf7337F9fe05469FaaA3b388C479C6E8393276',
    distributionsERC20: '0x1f4c8eaee6dd0bfb71ff8e7bc8f52c1007025144',
    distributionsETH: '0xc8b57ba4baee9242fa583284480b6ca555b0b01b',
    ERC721MintPolicy: '0xbBca348239b6D620D0F9c21C1b641f36f62988D6',
    NativeMintModule: '0x15780803d56d0f574B9DB6f46c5dBA692c646ab6', // EthMintModule-
    MerkleDistributorModule: '0x72B7817075AC3263783296f33c8F053e848594a3',
    MerkleDistributorModuleERC721: '0xeC85E73048aaaBB2d7dD99f605E56E6Dc5A2a67B',
    mintPolicy: '0x00C327dBd884662080A8eD3FD84f0e9bc39ccbF4',
    policyMintERC20: '0x36d367884b5088465C0Ea2EaF52224a922DC71E6',
    PublicOnePerAddress: '0xce6E260226639F1dD446dc19F21bd66cbE613d0D',
    SingleTokenMintModule: '0x7f450D0B82f4785881736bcd7635bbDd0cbA7648',
    UtilityMintModule: '0xD193Cfbc267f23127E024A025233A8483b29C66e',
    OnePerAddressMintModule: '',
    OwnerMintModule: '0x60bfff0B6e064673B61f3eB9dEA5ED0f3BbB5471',
    OwnerMintModule2: '',

    // Collectives
    ERC721Collective: '0xc11960ebf2f6a894f728e40ce47ae2ec04a4cf0b',
    ERC721CollectiveFactory: '0x3140faab174f880703d75c3fca538c2f190cc58e',
    FixedRenderer: '0x6c4f220416751503e81e38deee9899082a803275',
    GuardMixinManager: '0xe868fa053925fe8bce31fc7d5272c4b4aa82477b',
    EthPriceMintModule: '0x89583ad6aba72c7c6de70ee9a290884abc4000c3',
    TimeRequirements: '0x07ccfbb36468cec5d64c1e3582546a6b5b52732d',
    MaxPerMemberERC721: '0x487e27ae8b6f68719eb64d46b5fe81bb04e28c46',
    MaxTotalSupplyERC721: '0x50ab2de08f81522fffe1156af22374d37222e14f',
    GuardAlwaysAllow: '0x1550A951Eb4a59cb1a92e231951A63e7C6936057',
    GuardNeverAllow: '0x701EAE459BF3E501852E11499117b2eC333EBdF9'
  },

  // Matic
  137: {
    clubERC20Factory: '0x3902AB762a94b8088b71eE5c84bC3C7d2075646B',
    clubERC20FactoryNative: '0xae6328C067bddFbA4963e2A1F52BaaF11a2e2588', // clubERC20FactoryETH
    DepositTokenMintModule: '0xa052E325e112A5a6DfF7F4115B2f6DAA15eDa2F3',
    distributionsERC20: '',
    distributionsETH: '',
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
    OwnerMintModule2: '',

    // Collectives
    ERC721Collective: '', // TODO
    ERC721CollectiveFactory: '', // TODO
    FixedRenderer: '', // TODO
    GuardMixinManager: '', // TODO
    EthPriceMintModule: '', // AllowModules // TODO
    TimeRequirements: '', // TODO
    MaxPerMemberERC721: '', // TODO
    MaxTotalSupplyERC721: '', // TODO
    GuardAlwaysAllow: '', // TODO
    GuardNeverAllow: '' // TODO
  }
});
