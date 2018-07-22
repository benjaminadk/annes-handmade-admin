module.exports = `
    
    type Sale {
        id: ID
        products: [Product]
        quantity: [Int]
        total: Float
        stripeId: String
        shippingAddress: Shipping
        shipped: Boolean
        createdOn: String
    }
    
    type Query {
        getAllSales: [Sale]
    }
    
    type Mutation {
        toggleShipped(saleId: ID!, status: Boolean!): Payload
    }
`
