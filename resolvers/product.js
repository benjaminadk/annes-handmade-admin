const AWS = require('aws-sdk')
const KEYS = require('../config')

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'us-west-1',
  accessKeyId: KEYS.ACCESS_KEY_ID,
  secretAccessKey: KEYS.SECRET_ACCESS_KEY
})

module.exports = {
  Query: {
    getProductById: async (root, { productId }, { models }) => {
      const product = await models.Product.findById(productId)
      return product
    },

    getAllProducts: async (root, args, { models }) => {
      const products = await models.Product.find({})
      return products
    }
  },

  Mutation: {
    s3Sign: async (root, { filename, filetype }, context) => {
      const s3Params = {
        Bucket: 'shopping-site',
        Key: filename,
        Expires: 60,
        ContentType: filetype,
        ACL: 'public-read'
      }

      const requestUrl = await s3.getSignedUrl('putObject', s3Params)
      const imageUrl = `https://shopping-site.s3.amazonaws.com/${filename}`
      return { requestUrl, imageUrl }
    },

    createProduct: async (root, { input }, { models }) => {
      const { variant, bead, title, description, images, price, stock } = input
      const product = new models.Product({
        variant,
        bead,
        title,
        description,
        images,
        price,
        stock
      })
      const savedProduct = await product.save()
      return savedProduct
    },

    updateProduct: async (root, { productId, input }, { models }) => {
      const { variant, bead, title, description, images, price, stock } = input
      const filter = { _id: productId }
      const update = {
        $set: { variant, bead, title, description, images, price, stock }
      }
      const options = { upsert: true }
      try {
        await models.Product.findOneAndUpdate(filter, update, options)
        return {
          success: true
        }
      } catch (error) {
        return {
          success: false
        }
      }
    },

    deleteProduct: async (root, { productId, images }, { models }) => {
      try {
        const s3Params = {
          Bucket: 'shopping-site',
          Delete: {
            Objects: images
          }
        }
        s3.deleteObjects(s3Params, (err, data) => {
          if (err) console.log(JSON.stringify(err, null, 2))
        })
        await models.Product.deleteOne({ _id: productId })
        return { success: true }
      } catch (error) {
        return { success: false }
      }
    },

    deleteImage: async (root, { productId, image }, { models }) => {
      const params = {
        Bucket: 'shopping-site',
        Key: image
      }

      try {
        s3.deleteObject(params, function(err, data) {
          if (err) console.log(err)
          console.log(JSON.stringify(data, null, 2))
        })
        const filter = { _id: productId }
        const update = { $pull: { images: image } }
        await models.Product.findOneAndUpdate(filter, update)
        return {
          success: true
        }
      } catch (error) {
        return {
          success: false
        }
      }
    }
  }
}
