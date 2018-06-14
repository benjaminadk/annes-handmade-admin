module.exports = `

    type Product {
        id: ID
        variant: Int
        bead: Int
        title: String
        description: String
        images: [String]
        price: Float
        stock: Int
        createdOn: String
    }
    
    input ProductInput {
        variant: Int
        bead: Int
        title: String
        description: String
        images: [String]
        price: Float
        stock: Int
    }
    
    type s3Payload {
        requestUrl: String
        imageUrl: String
    }
    
    type UpdatePayload {
        success: Boolean
    }
    
    type DeletePayload {
        success: Boolean
    }
    
    input ImageKey {
        Key: String
    }
    
    type Query {
        getProductById(productId: ID!): Product
        getAllProducts: [Product]
    }
    
    type Mutation {
        s3Sign(filename: String!, filetype: String!): s3Payload
        createProduct(input: ProductInput!): Product
        updateProduct(productId: ID!, input: ProductInput!): UpdatePayload
        deleteProduct(productId: ID!, images: [ImageKey]!): DeletePayload
        deleteImage(productId: ID!, image: String!): DeletePayload
    }
`
