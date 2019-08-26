import { Schema, model, Document } from 'mongoose'

export interface IWaitlistProductDoc extends Document {
  customerId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  quantity: number
  paymentMethodSelected: string;
  confirmation: string;
  created: Date;
  updated: Date;
}

const waitlistProductSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  paymentMethodSelected: String,
  confirmation: String,
}, { timestamps: true })



export default model<IWaitlistProductDoc>('waitlist-product', waitlistProductSchema);

