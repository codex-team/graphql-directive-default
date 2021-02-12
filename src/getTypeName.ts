import { TypeNode } from 'graphql';

/**
 * Returns type name unwrapped from NonNullType
 *
 * @param type - AST of the type to extract name
 */
export default function getTypeName(type: TypeNode): string {
  switch (type.kind) {
    case 'ListType':
      return 'ListType';
    case 'NonNullType':
      return getTypeName(type.type);
    case 'NamedType':
      return type.name.value;
  }
}
