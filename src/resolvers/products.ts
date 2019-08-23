import { IContext } from '../types'
import { productQuantity } from '../pipelines'

class Resolvers {
  public async getProducts(
    parent: any,
    args: {},
    { dataSources: { inventory } }: IContext
  ) {
    const products = await inventory.aggregate(productQuantity)
    return products;
  }
}

const resolvers = new Resolvers()

export default {
  Query: {
    products: resolvers.getProducts
  }
}