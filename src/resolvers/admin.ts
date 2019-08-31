import { IContext } from "../types";
import { ForbiddenError } from "apollo-server-express";
import { orders as ordersPipeline } from '../pipelines/admin'
import autoBind = require("auto-bind");

class Resolvers {
  constructor() {
    autoBind(this)
  }
  private requireAdmin(user: IContext["user"]) {
    if (!user || !user.admin) {
      throw new ForbiddenError('Forbidden')
    }
  }

  public async orderSummary(
    parent: any,
    args: {},
    { user, models: { Order } }: IContext
  ) {
    this.requireAdmin(user)
    const orders = await Order.aggregate(ordersPipeline)
    return orders;
  }
}

const resolvers = new Resolvers()

export default {
  Query: {
    orderSummary: resolvers.orderSummary
  }
}