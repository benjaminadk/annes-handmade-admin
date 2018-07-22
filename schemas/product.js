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
        updateProduct(productId: ID!, input: ProductInput!): Payload
        deleteProduct(productId: ID!, images: [ImageKey]!): Payload
        deleteImage(productId: ID!, image: String!): Payload
    }
`
