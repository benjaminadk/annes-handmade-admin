import gql from 'graphql-tag'

export const DELETE_PRODUCT_MUTATION = gql`
  mutation($productId: ID!, $images: [ImageKey]!) {
    deleteProduct(productId: $productId, images: $images) {
      success
    }
  }
`
