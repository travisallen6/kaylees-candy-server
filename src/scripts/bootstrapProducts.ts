import Product from '../models/product';
import connectToMongo from './connectToMongo'
import { config } from '../common'

/**
 * 6 milk chocolate with almond bars
 * 3 W.F. Crisp Bars
 * 3 Premium milk chocolate bars
 * 3 Mint meltaways
 * 12 Continental Almonds
 * 3 Caramel whirls
 *
 * name: String,
  description: String,
  price: Number,
  countPerBox: Number,
  image: String
 */

const newProducts = [
  {
    name: 'Milk Chocolate with Almond Bars',
    description: 'Milk chocolate and almonds walk into a bar...',
    price: 2,
    countPerBox: 6,
    image: '~/assets/butterfinger.png'
  },
  {
    name: 'W.F. Crisp Bars',
    description: 'Similar to those candy bars that start with a K and end with a rackle.',
    price: 2,
    countPerBox: 3,
    image: '~/assets/klondike.png'
  },
  {
    name: 'Premium Milk Chocolate Bar',
    description: 'Chocolate bars made from the finest cow\'s milk.',
    price: 2,
    countPerBox: 3,
    image: '~/assets/snickers.png'
  },
  {
    name: 'Mint Meltaways',
    description: 'Individually wrapped mint infused chocolates.',
    price: 2,
    countPerBox: 3,
    image: '~/assets/butterfinger.png'
  },
  {
    name: 'Continental Almonds',
    description: 'Crunchy chocolate-covered almond deliciousness',
    price: 2,
    countPerBox: 12,
    image: '~/assets/klondike.png'
  },
  {
    name: 'Caramel Whirls',
    description: 'Individually wrapped caramels covered in chocolate. Quite whirly too.',
    price: 2,
    countPerBox: 3,
    image: '~/assets/snickers.png'
  },
]
void (async () => {
  await connectToMongo(config.mongodbUri);
  await Product.deleteMany({});
  const inserted = await Product.insertMany(newProducts)
  // const products = await Product.find({});
  console.log(inserted)

})()