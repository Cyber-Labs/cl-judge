const cors = require('cors')

const whitelist = ['http://localhost:3000', 'http://localhost:5000']
var corsOptionsDelegate = (req, callback) => {
  var corsOptions
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

exports.corsWithOptions = cors(corsOptionsDelegate)
