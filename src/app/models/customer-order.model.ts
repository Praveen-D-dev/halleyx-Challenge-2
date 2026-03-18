export interface CustomerOrder {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}
