import gql from 'graphql-tag'

export const GET_ALL_SALES_QUERY = gql`
  query {
    getAllSales {
      id
      products {
        variant
        title
        description
        images
        price
        stock
        createdOn
      }
      quantity
      total
      stripeId
      shippingAddress {
        title
        email
        firstName
        lastName
        street1
        street2
        city
        state
        zip
        notes
      }
      shipped
      createdOn
    }
  }
`
