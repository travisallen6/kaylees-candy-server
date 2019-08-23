import { Inventory, Product } from '../models/';
import connectToMongo from './connectToMongo';
import { config } from '../common'

void (async () => {
  await connectToMongo(config.mongodbUri);
  await Inventory.deleteMany({});
  const allProducts = await Product.find({});
  const productIds = allProducts.map(product => product._id);
  const inventory = new Inventory({
    boxContents: productIds,
    boxQuantity: 2
  })
  const newInventory = await inventory.save()
  console.log(newInventory)
})() 