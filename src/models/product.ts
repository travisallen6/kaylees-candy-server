import * as mongoose from 'mongoose';

interface IProductDoc extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  countPerBox: number;
  image: String;
}

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  countPerBox: Number,
  image: String
});

export default mongoose.model<IProductDoc>('product', productSchema)
