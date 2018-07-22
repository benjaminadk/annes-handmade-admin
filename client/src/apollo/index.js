import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, concat } from 'apollo-link'

const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://annes-admin.herokuapp.com/graphql'
      : 'http://localhost:5001/graphql'
})
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: window.localStorage.getItem('TOKEN') || null
    }
  }))
  return forward(operation)
})
const link = concat(authMiddleware, httpLink)
const cache = new InMemoryCache()
const client = new ApolloClient({ link, cache })

export default client
