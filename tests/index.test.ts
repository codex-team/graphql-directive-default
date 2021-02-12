import {makeExecutableSchema} from "@graphql-tools/schema";
import createDirectiveDefault from "../src";
import { graphql } from "graphql";

describe('@default directive', () => {
  test('Should return default value if parent value is null or undefined', async() => {
    const schema = makeExecutableSchema({
      typeDefs: `
        directive @default(value: String!) on FIELD_DEFINITION

        type Query {
          nullValue: String! @default(value: "default value for null")
          undefinedValue: String! @default(value: "default value for undefined")
        }
      `,
      resolvers: {
        Query: {
          nullValue: () => null,
          undefinedValue: () => null
        }
      },
      schemaTransforms: [
        createDirectiveDefault().schemaTransformer
      ]
    });

    const { data, errors } = await graphql(
      schema,
        `
        query {
          nullValue
          undefinedValue
        }
      `,
    );

    expect(data?.nullValue).toBe('default value for null');
    expect(data?.undefinedValue).toBe('default value for undefined');
    expect(errors).toBeUndefined();
  })

  test('Shouldn`t return default value if value is defined', async() => {
    const schema = makeExecutableSchema({
      typeDefs: `
        directive @default(value: String!) on FIELD_DEFINITION

        type Query {
          value: String! @default(value: "default value")
        }
      `,
      resolvers: {
        Query: {
          value: () => 'val',
        }
      },
      schemaTransforms: [
        createDirectiveDefault().schemaTransformer
      ]
    });

    const { data, errors } = await graphql(
      schema,
        `
        query {
          value
        }
      `,
    );

    expect(data?.value).toBe('val');
    expect(errors).toBeUndefined();
  })

  test('Should return boolean default value', async() => {
    const schema = makeExecutableSchema({
      typeDefs: `
        directive @default(value: String!) on FIELD_DEFINITION

        type Query {
          value: Boolean! @default(value: "true")
        }
      `,
      resolvers: {
        Query: {
          value: () => null,
        }
      },
      schemaTransforms: [
        createDirectiveDefault().schemaTransformer
      ]
    });

    const { data, errors } = await graphql(
      schema,
        `
        query {
          value
        }
      `,
    );

    expect(data?.value).toBe(true);
    expect(errors).toBeUndefined();
  })

  test('Should return number default value', async() => {
    const schema = makeExecutableSchema({
      typeDefs: `
        directive @default(value: String!) on FIELD_DEFINITION

        type Query {
          value: Int! @default(value: "123")
        }
      `,
      resolvers: {
        Query: {
          value: () => null,
        }
      },
      schemaTransforms: [
        createDirectiveDefault().schemaTransformer
      ]
    });

    const { data, errors } = await graphql(
      schema,
      `
        query {
          value
        }
      `,
    );

    expect(data?.value).toBe(123);
    expect(errors).toBeUndefined();
  })

  test('Should return string default value even is provided default value parses as boolean or number', async() => {
    const schema = makeExecutableSchema({
      typeDefs: `
        directive @default(value: String!) on FIELD_DEFINITION

        type Query {
          valueInt: String! @default(value: "123")
          valueBoolean: String! @default(value: "true")
        }
      `,
      resolvers: {
        Query: {
          valueInt: () => null,
          valueBoolean: () => null,
        }
      },
      schemaTransforms: [
        createDirectiveDefault().schemaTransformer
      ]
    });

    const { data, errors } = await graphql(
      schema,
      `
        query {
          value
        }
      `,
    );

    expect(data?.value).toBe('123');
    expect(data?.value).toBe('true');
    expect(errors).toBeUndefined();
  })
});
