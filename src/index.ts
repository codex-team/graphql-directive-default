import type { GraphQLSchema } from 'graphql';
import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';
import getTypeName from './getTypeName';

/**
 * Result of directive creation function
 */
interface DirectiveCreateResult {
  /**
   * Generated types definitions
   */
  typeDefs: string;

  /**
   * Schema transformer function to apply directive on it
   *
   * @param schema - original schema
   */
  schemaTransformer: (schema: GraphQLSchema) => GraphQLSchema;
}

/**
 * Arguments for directive
 */
interface DefaultDirectiveArguments {
  /**
   * Provided default value
   */
  value: string;
}

/**
 * Creates type definitions and schema transformer for applying @default directive
 *
 * @param directiveName - custom directive name
 */
export default function createDirectiveDefault(directiveName = 'default'): DirectiveCreateResult {
  return {
    typeDefs: `directive @${directiveName}(value: String!) on FIELD_DEFINITION`,
    schemaTransformer: (schema: GraphQLSchema) => mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const directives = getDirectives(schema, fieldConfig);
        const directiveArgumentMap = directives[directiveName] as DefaultDirectiveArguments | undefined;
        const type = fieldConfig.astNode?.type;

        if (!type) {
          throw new Error('There is no astNode in fieldConfig');
        }
        const typeName = getTypeName(type);

        if (directiveArgumentMap) {
          const { resolve = defaultFieldResolver } = fieldConfig;

          fieldConfig.resolve = async (parent, args, context, info): Promise<unknown> => {
            const value = await resolve(parent, args, context, info);

            if (value === null || value === undefined) {
              const defaultValue = directiveArgumentMap.value;
              let parsedDefaultValue;


              switch (typeName) {
                case 'String':
                  parsedDefaultValue = defaultValue;
                  break;
                case 'Boolean':
                  parsedDefaultValue = Boolean(defaultValue);
                  break;
                case 'Int':
                case 'Float':
                  parsedDefaultValue = Number(defaultValue);
                  break;
                default:
                  try {
                    parsedDefaultValue = JSON.parse(defaultValue);
                  } catch {
                    parsedDefaultValue = defaultValue;
                  }
              }

              return parsedDefaultValue;
            }

            return value;
          };

          return fieldConfig;
        }
      },
    }),
  };
}
