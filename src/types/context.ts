import { Request, Response } from 'express';
import { Inventory } from '../data-sources'
interface IContextUser {
  admin: boolean;
  id: string;
}

export default interface Context {
  req: Request;
  res: Response;
  user: IContextUser
  dataSources: {
    inventory: Inventory
  }
}
