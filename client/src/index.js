import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, concat } from 'apollo-link'
import Root from './Root'

const NODE = document.getElementById('root')
const theme = createMuiTheme()
const httpLink = new HttpLink({ uri: 'http://localhost:3001/graphql' })
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

ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </MuiThemeProvider>
  </ApolloProvider>,
  NODE
)
