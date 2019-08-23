import * as mongoose from 'mongoose';

export interface IInventoryDoc extends mongoose.Document {
  boxQuantity: number;
  boxContents: mongoose.Schema.Types.ObjectId[]
}

const inventorySchema = new mongoose.Schema({
  boxQuantity: Number,
  boxContents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }]
})

export default mongoose.model<IInventoryDoc>('inventory', inventorySchema)

