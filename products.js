const db = require('./db')
const cuid = require('cuid')

const productSchema = new db.Schema({
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true }
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true }
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true }
  },
  tags: [{
    title: { type: String, required: true }
  }]
}, { timestamps: true })

const Product = db.model('Product', productSchema)

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const query = tag ? { 'tags.title': tag } : {}
  
  return await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
    .exec()
}

async function get(_id) {
  return await Product.findById(_id).exec()
}

async function create(fields) {
  const product = await new Product(fields).save()
  return product
}

async function edit(_id, change) {
  const product = await Product.findByIdAndUpdate(_id, change, { new: true })
  return product
}

async function destroy(_id) {
  await Product.deleteOne({ _id })
}

module.exports = {
  get,
  list,
  create,
  edit,
  destroy
}