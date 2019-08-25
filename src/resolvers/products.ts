import { IContext, IProduct } from '../types'
import { productPipeline, remainingProductQuantitiesForIds } from '../pipelines'

class Resolvers {
  public async getProducts(
    parent: any,
    args: {},
    { dataSources: { inventory } }: IContext
  ) {
    const products = await inventory.aggregate(productPipeline)
    return products;
  }

  public async checkout(
    parent: any,
    args: { cart: IProduct[], waitList: IProduct[] },
    { dataSources: { inventory } }: IContext
  ) {
    const remainingProductsCheck = await inventory.aggregate(remainingProductQuantitiesForIds(args.cart.map(item => item._id))) as {
      _id: string
      quantityLeft: number
    }[]

    const idToRemaingQuantity: Map<string, number> = new Map();
    remainingProductsCheck.forEach(({ _id, quantityLeft }) => {
      idToRemaingQuantity.set(_id.toString(), quantityLeft)
    })

    const overOrderedProducts = args.cart.filter(cartItem => {
      const remainingQuantity = idToRemaingQuantity.get(cartItem._id)
      if (cartItem.quantitySelected > remainingQuantity) {
        return true;
      }
      return false;
    }).map(product => {
      product.quantityLeft = idToRemaingQuantity.get(product._id);
      return product;
    })

    if (overOrderedProducts.length > 0) {
      return {
        success: false,
        overOrderedProducts: overOrderedProducts
      };
    }
    return {
      success: true,
      overOrderedProducts: []
    }
  }
}

const resolvers = new Resolvers()

export default {
  Query: {
    products: resolvers.getProducts
  },
  Mutation: {
    checkout: resolvers.checkout
  }
}