import gql from 'graphql-tag'

export const ADMIN_LOGIN = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      message
    }
  }
`
