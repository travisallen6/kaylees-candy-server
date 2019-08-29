import { IContext } from '../types'
import { default as orderConfirmationTemplate, ICustomerOrder } from '../templates/order-confirmation';
import { nodemailer } from '../services'

class Resolvers {
  public async sendOrderConfirmationEmail(
    parent: any,
    args: { confirmationId: string },
    { user, models: { Order, User } }: IContext
  ) {
    const { confirmationId } = args;
    const { email } = await User.findById(user.id)
    const orders = await Order.findOne({ confirmation: confirmationId, customerId: user.id }).populate('productsOrdered.productId').lean().exec() as ICustomerOrder;
    const html = orderConfirmationTemplate(orders)
    await nodemailer.sendMail(email, `Sweet Confirmation #${confirmationId}`, html)
    return {
      success: true
    }
  }
}

const resolvers = new Resolvers();

export default {
  Mutation: {
    sendOrderConfirmation: resolvers.sendOrderConfirmationEmail
  }
}