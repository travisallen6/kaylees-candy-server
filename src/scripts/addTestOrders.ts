import connectToMongo from './connectToMongo';
import { Types } from 'mongoose'
import { config } from '../common'
import { Order, Product } from '../models';

void (async () => {
  await connectToMongo(config.mongodbUri)
  await Order.deleteMany({})
  const products = await Product.find({}).select('_id').lean().exec();
  const sampleProducts = [
    products.slice().map((product: any) => ({ productId: product, quantity: 1, price: 2 })),
    products.slice(0, 4).map((product: any) => ({ productId: product, quantity: 1, price: 2 })),
    products.slice(-3).map((product: any) => ({ productId: product, quantity: 1, price: 2 })),
  ]
  const allSaved = await Promise.all(sampleProducts.map((sampleProductArray, i) => {
    const order = new Order({
      customerId: new Types.ObjectId(),
      productsOrdered: sampleProductArray,
      paymentMethodSelected: 'cash',
      confirmation: '00000' + (i + 1)
    })
    return order.save();
  }))
  console.log(allSaved)
})()