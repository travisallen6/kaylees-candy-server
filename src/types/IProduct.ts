export default interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantityLeft: number;
  quantitySelected: number;
  inCart: boolean;
  onWaitList: boolean;
}