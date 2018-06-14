module.exports = `

    type Admin {
        id: ID
        username: String
        password: String
    }
    
    type LoginPayload {
        success: Boolean
        message: String
        admin: Admin
    }
    
    type Query {
        getAdmin: Admin
    }
    
    type Mutation {
        login(username: String!, password: String!): LoginPayload
    }
`
