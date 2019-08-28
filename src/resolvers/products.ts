import { IContext, IProduct, IOverOrderedProduct } from '../types'
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
    const products = await Inventory.aggregate(productPipeline)
    return products;
  }

  public async checkout(
    parent: any,
    args: { cart: IProduct[] },
    { models: { Inventory, Order, WaitlistProduct }, user }: IContext
  ) {
    this.requireAuth(user)
    try {
      const waitListIdsToRemove = args.cart.filter(item => item.onWaitList > 0).map(item => item._id)
      await Order.deleteMany({ customerId: user.id, confirmation: { $exists: false } })
      await WaitlistProduct.deleteMany({ _id: { $nin: waitListIdsToRemove }, confirmation: { $exists: false } })

      const remainingProductsCheck = await Inventory.aggregate(remainingProductQuantitiesForIds(args.cart.map(item => item._id))) as {
        _id: string
        quantityLeft: number
      }[]

      const idToRemaingQuantity: Map<string, number> = new Map();
      remainingProductsCheck.forEach(({ _id, quantityLeft }) => {
        idToRemaingQuantity.set(_id.toString(), quantityLeft)
      })

      const [overOrderedItems, productsToSave, adjustedCart] = args.cart.reduce(([overOrdered, validItems, newCart], cartItem) => {
        const remainingQuantity = idToRemaingQuantity.get(cartItem._id)
        if (cartItem.inCart > remainingQuantity) {
          overOrdered.push(cartItem)
          newCart.push({ ...cartItem, inCart: remainingQuantity, quantityLeft: remainingQuantity, quantitySelected: 1 })
        } else {
          validItems.push(cartItem)
          newCart.push({ ...cartItem, quantitySelected: 1 })
        }
        return [overOrdered, validItems, newCart]
      }, [[], [], []])

      const waitlistConflicts = overOrderedItems.map(product => {
        const qtyLeft = idToRemaingQuantity.get(product._id);
        const defaultWaitlistQty = product.quantityLeft - qtyLeft + product.onWaitList
        product.quantityLeft = qtyLeft;
        return { ...product, defaultWaitlistQty };
      })

      const productsOrdered = [
        ...waitlistConflicts.filter(product => product.quantityLeft > 0).map(product => ({ productId: product._id, quantity: product.quantityLeft, price: product.price })),
        ...productsToSave.map(product => ({ productId: product._id, quantity: product.inCart, price: product.price }))
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
          adjustedCart,
          overOrderedProducts: waitlistConflicts.map(({ _id, defaultWaitlistQty, name, image, quantityLeft, price }) => ({ _id, defaultWaitlistQty, name, image, confirmed: quantityLeft, price }))
        };
      }
      return {
        success: true,
        adjustedCart,
        overOrderedProducts: []
      }
    } catch (error) {
      throw error;
    }
  }

  async updateWaitList(
    parent: any,
    args: { waitList: IOverOrderedProduct[] },
    { models: { WaitlistProduct }, user }: IContext,
  ) {
    this.requireAuth(user);
    const { waitList } = args;
    const [itemsToDelete, itemsToUpdate] = waitList.reduce(([remove, update], item) => {
      if (item.defaultWaitlistQty === 0) {
        remove.push(item)
      } else if (item.defaultWaitlistQty > 0) {
        update.push(item)
      }
      return [remove, update]
    }, [[], []])

    await Promise.all([
      ...itemsToDelete.map(item => {
        return WaitlistProduct.deleteMany({ customerId: user.id, productId: item._id })
      }),
      ...itemsToUpdate.map(item => {
        return WaitlistProduct.updateOne({ customerId: user.id, productId: item._id }, { quantity: item.defaultWaitlistQty, customerId: user.id, productId: item._id }, { upsert: true })
      })
    ])

    return { success: true };
  }

  public async addAddress(
    parent: any,
    args: { address: { address: string, city: string, zip: string, apartment: string } },
    { user, models: { Order } }: IContext
  ) {
    const { address } = args;
    this.requireAuth(user)
    try {
      const currentOrder = await Order.findOne({ customerId: user.id, confirmation: { $exists: false } })
      if (!currentOrder) throw new Error('Order not found');
      currentOrder.set('address', { ...address })
      await currentOrder.save();
      return { success: true }
    } catch (error) {
      console.warn(error)
      throw error;
    }
  }

  public async getTimeSlots(
    parent: any,
    args: {},
    { models: { TimeSlot }, user }: IContext,
  ) {
    this.requireAuth(user)
    const timeSlots = await TimeSlot.find({}).sort('date').exec();
    return timeSlots;
  }

  public async addDeliveryDate(
    parent: any,
    args: { date: string, time: string },
    { models: { Order }, user }: IContext
  ) {
    this.requireAuth(user);
    try {
      const { date, time } = args;
      const userOrder = await Order.findOne({ customerId: user.id, confirmation: { $exists: false } }).exec();
      if (!userOrder) {
        throw new Error('Order not found')
      }
      userOrder.set('deliveryDate', { date, time })
      await userOrder.save()
      return {
        success: true
      }
    } catch (error) {
      throw error;
    }
  }
}

const resolvers = new Resolvers()

export default {
  Query: {
    products: resolvers.getProducts,
    getTimeSlots: resolvers.getTimeSlots
  },
  Mutation: {
    checkout: resolvers.checkout,
    updateWaitList: resolvers.updateWaitList,
    addAddress: resolvers.addAddress,
    addDeliveryDate: resolvers.addDeliveryDate
  }
}