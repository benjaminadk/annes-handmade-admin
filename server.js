const express = require('express')
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
const { checkAuthHeaders } = require('./middleware/checkAuthHeaders')
const KEYS = require('./config')
require('./models/admin')
require('./models/product')
require('./models/sale')
require('./models/shipping')
require('./models/user')
require('./models/connect')
const models = require('./models')
const server = express()
const port = KEYS.PORT
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')))
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './resolvers'))
)
const schema = makeExecutableSchema({ typeDefs, resolvers })

server.use('*', cors({ origin: 'http://localhost:3000' }))

//webhook for credit card dispute stripe
// server.post('/webhook/dispute', bodyParser.raw({ type: '*/*' }), (req, res) => {
//   res.send(200)
//   const data = JSON.parse(req.body)
//   const SECRET = 'whsec_aQGh4GlirBr4A0jzOUA1R8my2OY8cSGt'
//   console.log(data)
// })

server.use(checkAuthHeaders)

server.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user
    }
  }))
)

server.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

server.listen(port, () => console.log(`SERVER LISTENING ON PORT: ${port}`))
