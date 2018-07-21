import gql from 'graphql-tag'

export const CREATE_PRODUCT_MUTATION = gql`
  mutation($input: ProductInput!) {
    createProduct(input: $input) {
      id
    }
  }
`
