const express = require('express')
const compression = require('compression')
const sslRedirect = require('heroku-ssl-redirect')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const {
  fileLoader,
  mergeResolvers,
  mergeTypes
} = require('merge-graphql-schemas')
const cors = require('cors')
const path = require('path')
const KEYS = require('./config')
require('./models/connect')
const models = require('./models')
const server = express()
const port = KEYS.PORT
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')))
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './resolvers'))
)
const schema = makeExecutableSchema({ typeDefs, resolvers })

server.use(compression())
server.use(sslRedirect())
server.use(cors())

server.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      models
    }
  })
)

server.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static('client/build'))
  server.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'))
  })
}

server.listen(port, () => console.log(`SERVER LISTENING ON PORT: ${port}`))
