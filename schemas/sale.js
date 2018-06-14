module.exports = `
    
    type Sale {
        id: ID
        products: [Product]
        quantity: [Int]
        total: Float
        shippingAddress: Shipping
        shipped: Boolean
        createdOn: String
    }
    
    type TogglePayload {
        success: Boolean
    }
    
    type Query {
        getAllSales: [Sale]
    }
    
    type Mutation {
        toggleShipped(saleId: ID!, status: Boolean!): TogglePayload
    }
`
