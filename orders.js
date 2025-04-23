const db = require('./db')
const cuid = require('cuid')

const orderSchema = new db.Schema({
  _id: { type: String, default: cuid },
  buyerEmail: { 
    type: String, 
    required: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  products: [{
    type: String,
    ref: 'Product',
    required: true
  }],
  status: {
    type: String,
    enum: ['CREATED', 'PENDING', 'COMPLETED'],
    default: 'CREATED'
  }
}, { timestamps: true })

const Order = db.model('Order', orderSchema)

async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options
  const query = {}
  
  if (productId) query.products = productId
  if (status) query.status = status
  
  return await Order.find(query)
    .populate('products')
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .exec()
}

async function get(_id) {
  return await Order.findById(_id)
    .populate('products')
    .exec()
}

async function create(fields) {
  const order = await new Order(fields).save()
  return await order.populate('products')
}

async function edit(_id, change) {
  const order = await Order.findByIdAndUpdate(_id, change, { 
    new: true 
  }).populate('products')
  return order
}

async function destroy(_id) {
  await Order.deleteOne({ _id })
}

module.exports = {
  get,
  list,
  create,
  edit,
  destroy
