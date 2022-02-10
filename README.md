# Syndicate Web3 Dashboard

This is Syndicate Protocol's official web3 dashboard.

## Get started

Clone this repository

```sh

git clone https://github.com/SyndicateProtocol/Syndicate-Web3-Dashboard.git

```

Switch to the `Syndicate-Web3-Dashboard` directory and install packages

```sh
yarn install
```

Run the project in development mode

```sh
yarn dev
```

## Node Version

[Use NVM to install Node.js 16](https://github.com/nvm-sh/nvm). You can add this script to your `.bashrc` or `.zshrc` to auto-use the right version of Node.

```sh
enter_directory() {
  if [[ $PWD == $PREV_PWD ]]; then
    return
  fi

  PREV_PWD=$PWD
  [[ -f ".nvmrc" ]] && nvm use
}

export PROMPT_COMMAND=enter_directory
```

## Debugging

You can use the built-in VS Code by pressing CMD+SHIFT+D then "Run" Debug Next.js. You can add breakpoints in the code and the debugger will automatically pause there.

## Build your site

Use `yarn build` to build your site for production, and `yarn start` to preview it locally.

If you run into the "heap size limit" error run `export NODE_OPTIONS='--trace-warnings --max_old_space_size=10240'` before running `yarn build`.

To enable sourcemaps in the local build run `export NEXT_SOURCE_MAPS_ENABLED=1` before running `yarn build`.

## Deployment

Every pull request automatically generates a deploy preview on Netlify. All code merged into main is automatically deployed to the live site at:

Production: [https://rinkeby-web3-dev-environment.netlify.app/](https://rinkeby-web3-dev-environment.netlify.app) (to be updated to the new domain)

Staging: [https://staging--rinkeby-web3-dev-environment.netlify.app/](https://staging--rinkeby-web3-dev-environment.netlify.app)

The development workflow includes merging most changes into staging, completing thorough testing on Rinkeby, and then finalizing the merge into mainnet on a regular cadence (e.g. continuous Rinkeby merges, mainnet merges weekly or in case of an emergency).

## Smart Contract

The Syndicate smart contract is available on the Rinkeby test network at [0x9a894f95Fd40838B3F69F6494DB1Cc5Af3532Ea5](https://rinkeby.etherscan.io/address/0x9a894f95Fd40838B3F69F6494DB1Cc5Af3532Ea5). Documentation for the contract can be found in [Syndicate.md](https://github.com/SyndicateProtocol/Syndicate-Web3-Dashboard/blob/main/Syndicate.md).

## Resources

- [NextJS documentation](https://nextjs.org/docs)
- [Tailwind documentation](https://tailwindcss.com/docs/what-is-tailwind/)
- [Prettier documentation](https://prettier.io/docs/en/index.html)
- [ESLint documentation](https://eslint.org/docs/user-guide/configuring)

## License

This code is copyright Syndicate Inc. 2022
