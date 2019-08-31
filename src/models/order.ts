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
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product'
  },
  quantity: Number,
  price: Number,
})

const addressSchema = new Schema({
  address: String,
  apartment: String,
  city: String,
  zip: String,
})

const deliveryDateSchema = new Schema({
  date: String,
  time: String
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
  payment: {
    type: String,
    enum: ['cash', 'check', 'venmo', 'paypal', 'default'],
    default: 'default'
  },
  confirmation: String,
  address: addressSchema,
  deliveryDate: deliveryDateSchema,
  confirmedAt: Date
}, { timestamps: true })

export default model<IOrderDoc>('order', orderSchema);

