import type { CodegenConfig } from '@graphql-codegen/cli';

const graphConfig = {
  satsuma: {
    schema:
      `https://subgraph.satsuma-prod.com/${
        process.env.NEXT_PUBLIC_SATSUMA_KEY || ''
      }/syndicate/goerli/api` ||
      'https://subgraph.satsuma-prod.com/syndicate/goerli/api',
    documents: [
      'src/graphql/subgraph_queries.ts',
      'src/graphql/satsuma_mutations.ts',
      'src/graphql/subgraph_mutations.ts'
    ],
    generates: 'src/@types/subgraph/satsuma/generated-types.ts'
  },
  backend: {
    schema: 'https://graphql-api-usvsm2urta-uc.a.run.app/',
    documents: [
      'src/graphql/backend_queries.ts',
      'src/graphql/backend_mutations.ts',
      'src/graphql/merkleDistributor.ts'
    ],
    generates: 'src/@types/subgraph/backend/generated-types.ts'
  },
  thegraph: {
    schema:
      'https://api.thegraph.com/subgraphs/name/jewei1997/syndicate-dao-subgraph',
    documents: [
      'src/graphql/subgraph_queries.ts',
      'src/graphql/subgraph_mutations.ts'
    ],
    generates: 'src/@types/subgraph/thegraph/generated-types.ts'
  }
};

type schemaEnv = 'backend' | 'satsuma';

const schemaServer: string = process.env.NEXT_PUBLIC_SCHEMA_SERVER || '';

const SCHEMA_SERVER: schemaEnv = schemaServer
  ? (schemaServer as schemaEnv)
  : 'satsuma';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [graphConfig[SCHEMA_SERVER].schema]: {
      // Header is required for satsuma to work
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_SATSUMA_KEY ?? ''
      }
    }
  },
  documents: graphConfig[SCHEMA_SERVER].documents,
  generates: {
    [graphConfig[SCHEMA_SERVER].generates]: {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ]
    }
  }
};

export default config;
