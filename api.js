const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {Request} req
 * @param {Response} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'))
}

/**
 * List all products
 * @param {Request} req
 * @param {Response} res
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  
  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })
  
  res.json(products)
}

/**
 * Get a single product
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function getProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.get(id)
  
  if (!product) return next()
  
  res.json(product)
}

/**
 * Create a new product
 * @param {Request} req
 * @param {Response} res
 */
async function createProduct(req, res) {
  const product = await Products.create(req.body)
  res.status(201).json(product)
}

/**
 * Update a product
 * @param {Request} req
 * @param {Response} res
 */
async function editProduct(req, res) {
  const change = req.body
  const product = await Products.edit(req.params.id, change)
  res.json(product)
}

/**
 * Delete a product
 * @param {Request} req
 * @param {Response} res
 */
async function deleteProduct(req, res) {
  await Products.destroy(req.params.id)
  res.json({ success: true })
}

/**
 * Create a new order
 * @param {Request} req
 * @param {Response} res
 */
async function createOrder(req, res) {
  const order = await Orders.create(req.body)
  res.status(201).json(order)
}

/**
 * List all orders
 * @param {Request} req
 * @param {Response} res
 */
async function listOrders(req, res) {
  const { offset = 0, limit = 25, productId, status } = req.query
  
  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status
  })
  
  res.json(orders)
}

/**
 * Get a single order
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function getOrder(req, res, next) {
  const { id } = req.params
  const order = await Orders.get(id)
  
  if (!order) return next()
  
  res.json(order)
}

/**
 * Update an order
 * @param {Request} req
 * @param {Response} res
 */
async function editOrder(req, res) {
  const change = req.body
  const order = await Orders.edit(req.params.id, change)
  res.json(order)
}

/**
 * Delete an order
 * @param {Request} req
 * @param {Response} res
 */
async function deleteOrder(req, res) {
  await Orders.destroy(req.params.id)
  res.json({ success: true })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  createOrder,
  listOrders,
  getOrder,
  editOrder,
  deleteOrder
})