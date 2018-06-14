module.exports = `
    
    type User {
        id: ID
        username: String
        password: String
        jwt: String
        ships: [Shipping]
        bills: [Billing]
        cart: Cart
        createdOn: String
    }
    
    type Query {
     getAllUsers: [User]
    }
    

`
