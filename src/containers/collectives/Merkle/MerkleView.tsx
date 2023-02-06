import { H1, L1, B1 } from '@/components/typography';
import { useCallback, useMemo, useState } from 'react';
import { resolveEnsDomains } from '@/utils/api/ens';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import { useMutation } from '@apollo/client';
import {
  UseMutateAsyncFunction,
  useMutation as useRQMutation
} from '@tanstack/react-query';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { CTAButton, CTAType } from '@/components/CTAButton';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { TextArea } from '@/components/inputs/simpleTextArea';
import { CREATE_BASIC_MERKLE_TREE_MUTATION } from '@/graphql/backend_mutations';

export type MerkleLeafBase = {
  account: string;
};

export type MerkleLeafProof = {
  proof: string[];
};

export type ERC20MerkleLeaf = MerkleLeafBase & {
  amount: string;
};

export type GenericMerkleClaims<LeafT> = {
  [address: string]: MerkleLeafProof & LeafT;
};
function parseAddressesFromText(text: string): string[] {
  // split the addresses by comma, space, or newline and trim each one
  return text
    .split(/[,\s\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

const prepareAddresses = (
  addressesOrENSNames: string[],
  ensMap: Record<string, string>
): {
  addresses: string[];
  dedupedAddresses: string[];
  unresolvedEnsNames: string[];
} => {
  const seenAddresses = new Set<string>();
  const unresolvedEnsNames: string[] = [];
  const addresses: string[] = [];
  const dedupedAddresses: string[] = [];

  addressesOrENSNames.forEach((addressOrENSName) => {
    const lowercasedAddressOrENSName = addressOrENSName.toLowerCase();
    if (addressOrENSName.includes('.')) {
      const addressFromEns: string | undefined =
        ensMap[lowercasedAddressOrENSName]?.toLowerCase();

      if (addressFromEns !== undefined) {
        addresses.push(addressFromEns);
        if (seenAddresses.has(addressFromEns)) {
          return;
        }
        seenAddresses.add(addressFromEns);
        dedupedAddresses.push(addressFromEns);
      } else {
        unresolvedEnsNames.push(lowercasedAddressOrENSName);
      }
    } else {
      addresses.push(addressOrENSName);
      if (seenAddresses.has(lowercasedAddressOrENSName)) {
        return;
      }
      seenAddresses.add(lowercasedAddressOrENSName);
      dedupedAddresses.push(addressOrENSName);
    }
  });

  return {
    addresses,
    dedupedAddresses,
    unresolvedEnsNames
  };
};

type MerkleRootHookResponse = {
  merkleRoot: string | undefined;
  isLoading: boolean | undefined;
  error: Error | null;
  status: string;
  create: UseMutateAsyncFunction<
    { merkleRoot: string },
    Error,
    { addressesOrENSNames: string[] }
  >;
  parsedEnsNames: Record<string, string>;
};

const useCreateMerkleRoot = (): MerkleRootHookResponse => {
  const [ensMap, setEnsMap] = useState<Record<string, string>>({});

  const [
    createMerkleTree,
    { error: errorMerkleTreeMutation, loading: isLoadingMerkleTreeMutation }
  ] = useMutation(CREATE_BASIC_MERKLE_TREE_MUTATION, {
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND
    }
  });

  const { mutateAsync, data, status, error } = useRQMutation<
    { merkleRoot: string },
    Error,
    { addressesOrENSNames: string[] }
  >(async ({ addressesOrENSNames }) => {
    let prepared = prepareAddresses(addressesOrENSNames, ensMap);

    if (prepared.unresolvedEnsNames.length > 0) {
      const ensAddresses = await resolveEnsDomains(prepared.unresolvedEnsNames);

      setEnsMap((prev) => ({
        ...prev,
        ...ensAddresses
      }));

      prepared = prepareAddresses(addressesOrENSNames, {
        ...ensMap,
        ...ensAddresses
      });

      if (prepared.unresolvedEnsNames.length > 0) {
        throw new Error(`Could not resolve all ENS names`);
      }
    }

    const res = await createMerkleTree({
      variables: { accounts: prepared.dedupedAddresses }
    });

    if (errorMerkleTreeMutation) {
      throw new Error('Error creating merkle tree', errorMerkleTreeMutation);
    }

    return { merkleRoot: res?.data?.createBasicMerkleTree.merkleRoot };
  });

  return {
    merkleRoot: data?.merkleRoot,
    isLoading: isLoadingMerkleTreeMutation,
    error,
    status,
    create: mutateAsync,
    parsedEnsNames: ensMap
  };
};

const formatUpdateModuleRemixUrl = (
  contractAddress: string,
  collectiveAddress: string,
  chain: string,
  module: string,
  allowed: string
): string => {
  return `https://app.syndicate.io/collectives/${collectiveAddress}?chain=${chain}&mode=remix&contractAddress=${contractAddress}&fn=updateModule&fnParams=0=${collectiveAddress};1=${module};2=${allowed}`;
};

const formatUpdateMerkleRootUrl = (
  contractAddress: string,
  collectiveAddress: string,
  chain: string,
  merkleRoot: string
): string => {
  return `https://app.syndicate.io/collectives/${collectiveAddress}?chain=${chain}&mode=remix&contractAddress=${contractAddress}&fn=updateMerkleRoot&fnParams=0=${collectiveAddress};1=${merkleRoot}`;
};

export interface MerkleViewProps {
  collectiveAddress: string;
  chain: string;
}

const MerkleView = ({
  collectiveAddress,
  chain
}: MerkleViewProps): JSX.Element => {
  const {
    initializeContractsReducer: { syndicateContracts }
  } = useSelector((state: AppState) => state);

  const {
    merkleRoot,
    error: errorResponse,
    create,
    parsedEnsNames
  } = useCreateMerkleRoot();
  const [addressInput, addressInputSet] = useState('');
  const NativeTokenPriceMintModuleHarnessGoerli =
    syndicateContracts.nativeTokenPriceMerkleMintModule.address;

  const EthPriceMintModuleGoerli =
    syndicateContracts.ethPriceMintModule.address;
  const GuardMixinManager = syndicateContracts.guardMixinManager.address;

  const enableNativeTokenMintModuleCmd = formatUpdateModuleRemixUrl(
    GuardMixinManager,
    collectiveAddress,
    chain,
    NativeTokenPriceMintModuleHarnessGoerli,
    'true'
  );
  const disableEthPriceMintModuleCmd = formatUpdateModuleRemixUrl(
    GuardMixinManager,
    collectiveAddress,
    chain,
    EthPriceMintModuleGoerli,
    'false'
  );

  const {
    collectiveDetails: { collectiveName }
  } = useERC721Collective();

  const handleSubmit = useCallback(() => {
    if (addressInput.trim().length === 0) {
      return;
    }

    const addresses = parseAddressesFromText(addressInput);
    create({ addressesOrENSNames: addresses });
  }, [addressInput, create]);

  const parsedAddresses = useMemo(
    () => parseAddressesFromText(addressInput),
    [addressInput]
  );

  const parsedAddressesCount = useMemo(
    () => parsedAddresses.length,
    [parsedAddresses]
  );

  const handleRemoveInvalidENSNames = useCallback(() => {
    const addresses = parsedAddresses
      .filter((address) => {
        return (
          !address.includes('.') ||
          parsedEnsNames[address.toLowerCase()] !== undefined
        );
      })
      .join('\n');
    addressInputSet(addresses);
  }, [parsedAddresses, parsedEnsNames]);

  const showRemoveInvalidENSNames = useMemo(
    // show the button if the error message contains `Could not resolve all ENS names`
    () =>
      (errorResponse as { message: string })?.message?.includes(
        'Could not resolve all ENS names'
      ) ?? false,
    [errorResponse]
  );

  return (
    <div
      className="flex flex-col items-start gap-y-8"
      style={{
        maxWidth: 550,
        width: '100%'
      }}
    >
      <H1>{collectiveName}</H1>
      <div className="space-y-4">
        <L1>
          1. Enable native token distributing and disable ethpricemintmodule{' '}
        </L1>
        <div className="flex justify-between">
          <CTAButton type={CTAType.TRANSACTIONAL}>
            <a
              href={enableNativeTokenMintModuleCmd}
              target="_blank"
              rel="noreferrer"
            >
              Enable correct module
            </a>
          </CTAButton>
          <CTAButton type={CTAType.PRIMARY}>
            <a
              href={disableEthPriceMintModuleCmd}
              target="_blank"
              rel="noreferrer"
            >
              Disable default module
            </a>
          </CTAButton>
        </div>
      </div>
      <div className="relative w-full space-y-4">
        <L1>2. Add addresses to distribute to by generating merkle root</L1>
        <TextArea
          widthClass="w-full"
          placeholderLabel='Enter addresses or ENS names separated by new line or ","'
          value={addressInput}
          handleValueChange={addressInputSet}
          helperText="Paste addresses or ENS names here, separated by commas, spaces or new lines"
        />
      </div>
      <div className="flex flex-col sm:flex-row w-full gap-x-4 gap-y-2 items-center">
        <CTAButton
          type={CTAType.PRIMARY}
          onClick={handleSubmit}
          disabled={parsedAddressesCount === 0}
          fullWidth
        >
          Generate Merkle root
        </CTAButton>
      </div>
      {parsedAddressesCount > 0 && (
        <div style={{ textAlign: 'center', width: '100%' }}>
          {parsedAddressesCount} address
          {parsedAddressesCount === 1 ? '' : 'es'} found
        </div>
      )}
      <div className="space-y-4 w-full">
        <L1>3. Register new merkle root with contract</L1>
        {true && (
          <B1 className="text-center sm:text-left">
            Successfully created merkle root for these addresses!
          </B1>
        )}
        <CTAButton
          type={CTAType.PRIMARY}
          fullWidth
          disabled={merkleRoot ? false : true}
        >
          <a
            href={formatUpdateMerkleRootUrl(
              NativeTokenPriceMintModuleHarnessGoerli,
              collectiveAddress,
              chain,
              merkleRoot ?? ''
            )}
            target="_blank"
            rel="noreferrer"
          >
            Register Merkle Root with Contract
          </a>
        </CTAButton>
      </div>
      {errorResponse && (
        <div className="text-center sm:text-left w-full">
          Error: {(errorResponse as { message: string }).message}
          {showRemoveInvalidENSNames && (
            <>
              {' '}
              <CTAButton
                type={CTAType.PRIMARY}
                onClick={handleRemoveInvalidENSNames}
              >
                Remove invalid ENS names
              </CTAButton>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MerkleView;
