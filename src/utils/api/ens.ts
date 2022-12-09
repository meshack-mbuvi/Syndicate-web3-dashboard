const ensSubgraphUrl = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';

const query = `
query DomainsQuery($names: [String!]!) {
  domains(where: { name_in: $names }) {
    resolvedAddress {
      id
    }
    name
  }
}
`;

export type EnsResponse = {
  data?: {
    domains: {
      resolvedAddress: { id: string } | null;
      name: string;
    }[];
  };
  errors?: Array<{ message: string }>;
};

const resolveEnsDomainsBatch = async (
  ensNames: string[]
): Promise<Record<string, string>> => {
  const response: Response = await fetch(ensSubgraphUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables: { names: ensNames } })
  });

  const { data, errors } = (await response?.json()) as EnsResponse;

  if (errors) {
    throw new Error('No data returned from subgraph');
  }

  return (
    data?.domains?.reduce((acc, domain) => {
      if (domain.resolvedAddress !== null) {
        acc[domain.name] = domain.resolvedAddress.id;
      }
      return acc;
    }, {} as Record<string, string>) ?? {}
  );
};

export const resolveEnsDomains = async (
  ensNames: string[]
): Promise<{ [name: string]: string }> => {
  const batches = chunk(ensNames, 100);
  const results = await Promise.all(batches.map(resolveEnsDomainsBatch));
  return results.reduce((acc, batch) => {
    return { ...acc, ...batch };
  }, {} as Record<string, string>);
};

function chunk<T>(arr: T[], size: number): Array<Array<T>> {
  const chunks: Array<Array<T>> = [];
  let i = 0;
  while (i < arr.length) {
    chunks.push(arr.slice(i, i + size));
    i += size;
  }
  return chunks;
}
