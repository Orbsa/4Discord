const env = require('getenv')


module.exports = {
	prefix: env.string("PREFIX", "/"),
  token: env.string("TOKEN", "[INSERT BOT TOKEN]")
}
