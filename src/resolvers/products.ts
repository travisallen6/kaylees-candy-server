import { IContext, IProduct, IUser } from '../types'
import { productPipeline, remainingProductQuantitiesForIds } from '../pipelines'
import { AuthenticationError } from 'apollo-server-express';
import autoBind = require('auto-bind');

class Resolvers {
  constructor() {
    autoBind(this)
  }
  private requireAuth(user: any) {
    if (!user) throw new AuthenticationError('Unauthenticated')
  }

  public async getProducts(
    parent: any,
    args: {},
    { models: { Inventory }, user }: IContext
  ) {
    this.requireAuth(user)
    const products = await Inventory.aggregate(productPipeline)
    return products;
  }

  public async checkout(
    parent: any,
    args: { cart: IProduct[], waitList: IProduct[] },
    { models: { Inventory, Order, WaitlistProduct }, user }: IContext
  ) {
    this.requireAuth(user)
    try {
      const remainingProductsCheck = await Inventory.aggregate(remainingProductQuantitiesForIds(args.cart.map(item => item._id))) as {
        _id: string
        quantityLeft: number
      }[]

      const idToRemaingQuantity: Map<string, number> = new Map();
      remainingProductsCheck.forEach(({ _id, quantityLeft }) => {
        idToRemaingQuantity.set(_id.toString(), quantityLeft)
      })

      const [overOrderedItems, productsToSave] = args.cart.reduce(([overOrdered, validItems], cartItem) => {
        const remainingQuantity = idToRemaingQuantity.get(cartItem._id)
        if (cartItem.inCart > remainingQuantity) {
          overOrdered.push(cartItem)
        } else {
          validItems.push(cartItem)
        }
        return [overOrdered, validItems]
      }, [[], []])

      const waitlistConflicts = overOrderedItems.map(product => {
        product.quantityLeft = idToRemaingQuantity.get(product._id);
        return product;
      })

      const productsOrdered = [
        ...waitlistConflicts.filter(product => product.quantityLeft > 0).map(product => ({ productId: product._id, quantity: product.quantityLeft, price: product.price })),
        ...productsToSave.map(product => ({ productId: product._id, quantity: product.quantityLeft, price: product.price }))
      ]
      const userOrder = new Order({
        customerId: user.id,
        productsOrdered,
      })

      const waitlistProductsToCreate = args.cart.filter(product => product.onWaitList > 0).map(product => ({ customerId: user.id, productId: product._id, quantity: product.onWaitList }))

      await Promise.all([
        userOrder.save(),
        WaitlistProduct.insertMany(waitlistProductsToCreate)
      ])

      if (waitlistConflicts.length > 0) {
        return {
          success: false,
          overOrderedProducts: waitlistConflicts
        };
      }
      return {
        success: true,
        overOrderedProducts: []
      }
    } catch (error) {
      console.log(error)
      throw error;
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