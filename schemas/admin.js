module.exports = `

    type Admin {
        id: ID
    }

    type LoginPayload {
        success: Boolean
        message: String
    }
    
    type Mutation {
        login(username: String!, password: String!): LoginPayload
    }
`
