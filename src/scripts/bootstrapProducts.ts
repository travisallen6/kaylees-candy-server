import Product from '../models/product';
import connectToMongo from './connectToMongo'
import { config } from '../common'

/*

  6 caramel bars
  3 milk chocolate bars
  3 dark chocolate bars
  6 mint meltaways
  3 chocolate covered raisin boxes
  9 chocolate covered almond boxes

*/

const newProducts = [
  {
    name: 'Caramel Chocolate Bar',
    description: 'Creamy caramel hopelessly surrounded by chocolate.',
    price: 2,
    countPerBox: 6,
    image: '/caramel-bars.jpg'
  },
  {
    name: 'Premium Milk Chocolate Bar',
    description: 'Chocolate bars made from the finest cow\'s milk.',
    price: 2,
    countPerBox: 3,
    image: '/milk-chocolate-bar.jpg'
  },
  {
    name: 'Dark Chocolate Bar',
    description: 'Chocolate living life on the dark side',
    price: 2,
    countPerBox: 3,
    image: '/dark-chocolate-bar.jpg'
  },
  {
    name: 'Mint Meltaways',
    description: 'Individually wrapped mint infused chocolates.',
    price: 2,
    countPerBox: 6,
    image: '/mint-meltaways.jpg'
  },
  {
    name: 'Chocolate Covered Raisins',
    description: 'Fund "Raisin" has never tasted so good',
    price: 2,
    countPerBox: 3,
    image: '/chocolate-covered-raisins.jpg'
  },
  {
    name: 'Continental Almonds',
    description: 'Crunchy chocolate-covered almond deliciousness',
    price: 2,
    countPerBox: 9,
    image: '/continental-almonds.jpg'
  },

]
void (async () => {
  await connectToMongo(config.mongodbUri);
  await Product.deleteMany({});
  const inserted = await Product.insertMany(newProducts)
  // const products = await Product.find({});
  console.log(inserted)

})()