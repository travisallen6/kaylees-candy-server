import * as mongoose from 'mongoose';

export interface IConfirmationDoc extends mongoose.Document {
  confirmationNumber: number;
}

const productSchema = new mongoose.Schema({
  confirmationNumber: Number
});

export default mongoose.model<IConfirmationDoc>('confirmation', productSchema)
