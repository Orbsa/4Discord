const env = require('getenv')

module.exports = {
  token: env.string("TOKEN", "[INSERT BOT TOKEN]")
}
