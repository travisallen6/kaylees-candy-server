import Db from './db';
import { Inventory } from '../models'

class InventoryDb extends Db {
  model = Inventory

  constructor() {
    super()
  }
}

export default InventoryDb;

