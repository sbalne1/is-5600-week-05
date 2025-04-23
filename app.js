const express = require('express')
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')
const mongoose = require('./db')

const port = process.env.PORT || 3000
const app = express()

// Middleware
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(middleware.cors)

// Routes
app.get('/', api.handleRoot)

// Product Routes
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)

// Order Routes
app.get('/orders', api.listOrders)
app.get('/orders/:id', api.getOrder)
app.post('/orders', api.createOrder)
app.put('/orders/:id', api.editOrder)
app.delete('/orders/:id', api.deleteOrder)

// Error Handling
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message })
})

// Database connection and server start
mongoose.connection.on('connected', () => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    console.log('MongoDB connected successfully')
  })
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
  process.exit(1)
})