import Confirmation from '../models/confirmation';
import connectToMongo from './connectToMongo'
import { config } from '../common'

void (async () => {
  await connectToMongo(config.mongodbUri);
  await Confirmation.deleteMany({});
  const inserted = await Confirmation.create({ confirmationNumber: 0 })
  // const products = await Product.find({});
  console.log(inserted)
})()