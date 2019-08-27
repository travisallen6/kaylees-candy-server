import { Schema, model, Document } from 'mongoose'

interface IOrderProduct {
  productId: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrderDoc extends Document {
  customerId: Schema.Types.ObjectId;
  productsOrdered: IOrderProduct[];
  paymentMethodSelected: string;
  confirmation: string;
}

const orderProductSchema = new Schema({
  productId: Schema.Types.ObjectId,
  quantity: Number,
  price: Number,
})

const addressSchema = new Schema({
  address: String,
  apartment: String,
  city: String,
  zip: String,
})

const orderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  productsOrdered: {
    type: [orderProductSchema],
    default: []
  },
  paymentMethodSelected: {
    type: String,
    enum: ['cash', 'check', 'venmo', 'paypal']
  },
  confirmation: String,
  address: addressSchema
}, { timestamps: true })

export default model<IOrderDoc>('order', orderSchema);

