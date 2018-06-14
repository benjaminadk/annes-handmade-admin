const bcrypt = require('bcrypt-nodejs')

module.exports = {
  Query: {
    getAdmin: async (root, args, { models }) => {
      return null
    }
  },

  Mutation: {
    login: async (root, { username, password }, { models }) => {
      const admin = await models.Admin.findOne({ username })
      if (!admin) {
        return {
          success: false,
          message: 'Invalid Username',
          admin: null
        }
      }
      const isMatch = await bcrypt.compare(password, admin.password)
      if (!isMatch) {
        return {
          success: false,
          message: 'Invalid Password',
          admin: null
        }
      } else {
        return {
          success: true,
          message: 'Login Successful',
          admin
        }
      }
    }
  }
}
