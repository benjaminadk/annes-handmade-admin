import gql from 'graphql-tag'

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation($productId: ID!, $input: ProductInput!) {
    updateProduct(productId: $productId, input: $input) {
      success
    }
  }
`
