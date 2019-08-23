import { Schema, model, Document } from 'mongoose'

interface IOrderProduct {
  productId: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IOrderDoc extends Document {
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

const orderSchema = new Schema({
  customerId: Schema.Types.ObjectId,
  productsOrdered: [orderProductSchema],
  paymentMethodSelected: {
    type: String,
    enum: ['cash', 'check', 'venmo', 'paypal']
  },
  confirmation: String
})

export default model<IOrderDoc>('order', orderSchema);

