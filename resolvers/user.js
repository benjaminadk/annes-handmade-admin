module.exports = {
  Query: {
    getAllUsers: async (root, args, { models }) => {
      const users = await models.User.find({})
      return users
    }
  },

  Mutation: {}
}
