module.exports = {
  Query: {
    getAllSales: async (root, args, { models }) => {
      const sales = await models.Sale.find({})
        .populate([
          { path: 'products', model: 'product' },
          { path: 'shippingAddress', model: 'shipping' }
        ])
        .exec()
      return sales
    }
  },

  Mutation: {
    toggleShipped: async (root, { saleId, status }, { models }) => {
      const sale = await models.Sale.findById(saleId)
      sale.shipped = status
      await sale.save()
      return {
        success: true
      }
    }
  }
}
