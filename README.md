# GraphQL @default directive

A quick start template for a new TypeScript library

[![NPM version](https://img.shields.io/npm/v/@codexteam/graphql-directive-default?style=flat-square)](https://www.npmjs.com/package/@codexteam/graphql-directive-default)
[![License](https://img.shields.io/npm/l/@codexteam/graphql-directive-default?style=flat-square)](https://www.npmjs.com/package/@codexteam/graphql-directive-default)

## Installation

```shell
npm i @codexteam/graphql-directive-default

# OR via yarn

yarn add @codexteam/graphql-directive-default
```

## How to use

1. Import lib

```ts
import createDirectiveDefault from '@codexteam/graphql-directive-default';
```

2. Add directive to `schemaTransforms`

```ts
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaTransforms: [
        createDirectiveDefault().schemaTransformer,
    ],
});
```

3. Add directive definitions to GraphQL types

```graphql
directive @default(value: String!) on FIELD_DEFINITION
```

4. Now you can add directive to your field definition

```graphql
type Query {
    valueString: String! @default(value: "default value") # will return "default value"
    valueBoolean: Boolean! @default(value: "true") # will return true
    valueInt: Int! @default(value: "0") # will return 0
    valueArray: [String]! @default(value: "[]") # will return empty array
}
```

## Contributing Guide

Feel free to open new issues and submit Pull Requests

## About team

We are CodeX and we build products for developers and makers.

Follow us on Twitter: [twitter.com/codex_team](https://twitter.com/codex_team)

Feel free to contact: <a href="mailto:team@codex.so?subject=Editor.js feedback">team@codex.so</a>

[codex.so](https://codex.so)
