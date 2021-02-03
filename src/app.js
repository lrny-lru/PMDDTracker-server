const { NODE_ENV } = require('./config')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require('./error-handler')
//const validateBearerToken = require('./validate-bearer-token')
const tuckRouter = require('./router/tuck-router')

const app = express()


const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
//app.use(validateBearerToken)
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})
app.use(tuckRouter)

app.use(errorHandler)

module.exports = app