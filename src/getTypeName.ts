import { TypeNode } from 'graphql';

/**
 * Returns type name unwrapped from ListType and NonNullType
 *
 * @param type - AST of the type to extract name
 */
export default function getTypeName(type: TypeNode): string {
  switch (type.kind) {
    case 'ListType':
    case 'NonNullType':
      return getTypeName(type.type);
    case 'NamedType':
      return type.name.value;
  }
}
