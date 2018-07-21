import gql from 'graphql-tag'

export const GET_ALL_PRODUCTS_QUERY = gql`
  query {
    getAllProducts {
      id
      variant
      bead
      title
      description
      images
      price
      stock
      createdOn
    }
  }
`