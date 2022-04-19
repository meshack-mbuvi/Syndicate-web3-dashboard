import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';

describe('Landing page', () => {
  it('Should have a the Join the Revolution text', () => {
    cy.on('window:before:load', (win) => {
      const provider = new HDWalletProvider({
        privateKeys: Cypress.env('ETH_PRIVATE_KEY'),
        mnemonic: Cypress.env('mnemonicPhrase'),
        providerOrUrl: Cypress.env('providerOrUrl'),
        numberOfAddresses: Cypress.env('numberOfAddresses'),
        derivationPath: Cypress.env('derivationPath')
      });
      win.web3 = new Web3(provider);
    });
    cy.visit('http://localhost:3000');
    cy.get(`#${CSS.escape('__next')}`).contains('Join the Revolution');
  });
});
