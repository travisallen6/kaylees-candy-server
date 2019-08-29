import { Request, Response } from 'express';
import { IOrderDoc, IUser, IInventoryDoc, ITimeSlot, IConfirmationDoc } from '../types'
import { Model } from 'mongoose'
interface IContextUser {
  admin: boolean;
  id: string;
}

export default interface Context {
  req: Request;
  res: Response;
  user: IContextUser;
  models: {
    Inventory: Model<IInventoryDoc>;
    User: Model<IUser>;
    Order: Model<IOrderDoc>;
    WaitlistProduct: Model<IOrderDoc>;
    TimeSlot: Model<ITimeSlot>;
    Confirmation: Model<IConfirmationDoc>
  }
}
