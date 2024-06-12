const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

const purchaseListSchema = new Schema({
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  products: [productSchema],
  total: { type: Number, required: true },
});

const PurchaseList =
  mongoose.models.PurchaseList ||
  mongoose.model("PurchaseList", purchaseListSchema);

module.exports = PurchaseList;
