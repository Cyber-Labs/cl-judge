const dotenv = require('dotenv')

if (!process.env.NODE_ENV) {
  let result = dotenv.config()
  if (result.error) {
    console.log(result.error)
  }
}

const host = process.env.HOST
const port = process.env.PORT || 5000

const server = require('./routes')
server.listen(port, () => {
  console.log(`Server is running on host: ${host} and port: ${port}`)
})
