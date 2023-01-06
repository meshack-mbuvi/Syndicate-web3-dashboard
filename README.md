# Syndicate Web3 Dashboard

This is Syndicate Protocol's official web3 dashboard.

## Netlify Status

Prod

[![Netlify Status](https://api.netlify.com/api/v1/badges/c29f01b4-2e04-4e73-9026-03ed3b4d9355/deploy-status)](https://app.netlify.com/sites/app-syndicate-io/deploys)

Staging

[![Netlify Status](https://api.netlify.com/api/v1/badges/f521541e-bc47-48ea-bfa0-18db794f417f/deploy-status)](https://app.netlify.com/sites/staging-app-syndicate-io/deploys)

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

[Use NVM to install Node.js 16](https://github.com/nvm-sh/nvm). On a Mac, this can be installed via Homebrew with `brew install nvm`.

You can add this script to your `.bashrc` or `.zshrc` to auto-use the right version of Node.

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

If you receive a compilation error of `Maximum call stack size exceeded` or the error `ERR_OSSL_EVP_UNSUPPORTED` when running `yarn dev`, it is likely because you are using Node 18 and not Node 16. You can check your node version with `node --version`.

We use Node 16 for compilation because we're running Netlify's Ubuntu Focal 20.04 build image, which [uses Node 16 by default](https://github.com/netlify/build-image/blob/focal/included_software.md).

## Debugging

You can use the built-in VS Code by pressing CMD+SHIFT+D then "Run" Debug Next.js. You can add breakpoints in the code and the debugger will automatically pause there.

## Build your site

Use `yarn build` to build your site for production, and `yarn start` to preview it locally.

If you run into the "heap size limit" error run `export NODE_OPTIONS='--trace-warnings --max_old_space_size=10240'` before running `yarn build`.

To enable sourcemaps in the local build run `export NEXT_SOURCE_MAPS_ENABLED=1` before running `yarn build`.

## Merging PR's -> Staging

When merging a PR into staging you should always use the **Squash and merge** strategy, this is likely not the default option, so you will have to click the drop down button next to the **Merge pull request** button to verify this.

In the event there is commit history you would like maintained then it should be rebased and merged **only** after ensuring the commit history is clean and descriptive in the branch.

## Merging Staging -> Main

When anything is merged into `V2-main` branch it will cause a production deploy of the syndicate frontend. As a general pattern staging should always be in a state where it can be deployed to main and therefore production without issue. This might mean using Split.io to add feature flags to code that isnt ready to be revealed yet.

To merge into `V2-main`, follow the steps below

- Create a PR from `V2-staging`
- When its ready to merge use the `Create a merge commit` merge strategy
- This will mean that `V2-main` now has a extra commit in its history
- We can then create a PR from `V2-main` into `V2-staging`, this will ensure they are now equal

## Hotfixes

Bugs happen! If after a recent deploy to production we see there is a bug the first step is to ascertain its severity. If it turns out this bug is blocking our users from interacting with our product in a meaningful way, a hotfix will likely be neccessary. To create a hotfix you can follow the steps below

- Check staging and main are in sync.
- Create a branch prefixed with `HOTFIX/...` and write the code neccessary
- Create a PR and point it to `V2-main`, (normally this would be `V2-staging`)
- Get sign off from the team
- Merge!
- Verify the fix has worked

After the hotfix has been deployed and verified, you will now need to create a PR from `V2-main` into `V2-staging` to re-sync them.

## Deployment

Every pull request automatically generates a deploy preview on Netlify. All code merged into main is automatically deployed to the live site at:

[Production](app.syndicate.io)

[Staging](https://staging.app.syndicate.io/)

The development workflow includes merging most changes into staging, completing thorough testing on Goerli, and then finalizing the merge into mainnet on a regular cadence (e.g. continuous Goerli merges, mainnet merges weekly or in case of an emergency).

## Smart Contract

Documentation for the contract can be found in [Syndicate.md](https://github.com/SyndicateProtocol/Syndicate-Web3-Dashboard/blob/main/Syndicate.md).

## Resources

- [NextJS documentation](https://nextjs.org/docs)
- [Tailwind documentation](https://tailwindcss.com/docs/what-is-tailwind/)
- [Prettier documentation](https://prettier.io/docs/en/index.html)
- [ESLint documentation](https://eslint.org/docs/user-guide/configuring)
- [Typescript](https://www.typescriptlang.org/docs/)

## License

This code is copyright Syndicate Inc. 2022.
