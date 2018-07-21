import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from 'react-apollo'
import client from './apollo'
import theme from './styles/theme'
import Baseline from './Baseline'

const NODE = document.getElementById('root')

ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Baseline />
      </BrowserRouter>
    </MuiThemeProvider>
  </ApolloProvider>,
  NODE
)
