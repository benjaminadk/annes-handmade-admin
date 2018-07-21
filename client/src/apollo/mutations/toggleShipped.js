import gql from 'graphql-tag'

export const TOGGLE_SHIPPED_MUTATION = gql`
  mutation($saleId: ID!, $status: Boolean!) {
    toggleShipped(saleId: $saleId, status: $status) {
      success
    }
  }
`
