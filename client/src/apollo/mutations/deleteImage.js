import gql from 'graphql-tag'

export const DELETE_IMAGE_MUTATION = gql`
  mutation($productId: ID!, $image: String!) {
    deleteImage(productId: $productId, image: $image) {
      success
    }
  }
`
