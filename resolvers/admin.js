const keys = require('../config')

module.exports = {
  Mutation: {
    login: async (root, { username, password }, { models }) => {
      const isAdmin = username === keys.ADMIN_USERNAME
      if (!isAdmin) {
        return {
          success: false,
          message: 'Invalid Username'
        }
      }
      const isMatch = password === keys.ADMIN_PASSWORD
      if (!isMatch) {
        return {
          success: false,
          message: 'Invalid Password'
        }
      } else {
        return {
          success: true,
          message: 'Login Successful'
        }
      }
    }
  }
}
