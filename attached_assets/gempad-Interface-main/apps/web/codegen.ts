import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    // schema: 'http://192.168.18.91:4350/graphql',
    // schema: 'http://172.27.192.1:4350/graphql',
    // schema: 'http://86.38.204.58:4000/graphql', // @todo @info bsc mainnet deployed graphql
    schema: 'https://api.gemlaunch.io/graphql', //mainnet is live now at https://api.gemlaunch.io
    documents: ['app/**/*.tsx', 'app/**/*.ts', 'components/**/*.ts', 'components/**/*.tsx'],
    generates: {
        'src/gql/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
            },
            config: {
                // enumsAsTypes: true,
                // immutableTypes: true,
                // useTypeImports: true,
                // defaultScalarType: "unknown",
                scalars: {
                    /** An ISO-8601 encoded date string. */
                    BigInt: 'bigint',
                    /** An ISO-8601 encoded UTC date string. */
                    DateTime: 'string',
                },
            },
        },
        './graphql.schema.json': {
            plugins: ['introspection'],
        },
    },
    // ignoreNoDocuments: true,
};

console.log('SCHEMA:', config.schema);

export default config;
