export interface Table {
  _id: string;
  table_number: string;
  capacity: number;
  status?: boolean;
  location: string;
  draft?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
  _id: string;
  first_name: string;
  last_name: string;
  phone: string;
  gender: string;
  email: string;
  position: string;
  address: string;
  start_time: string;
  end_time: string;
  salary: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentType {
  _id: string;
  name: string;
  status: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id: {
    name: string;
    category_id: string;
    code: string;
    description: string;
    price: number;
    cost: number;
    profit: number;
    qty: number;
    is_manage_stock: boolean;
    status: boolean;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
  };
  qty: number;
  price: number;
  subtotal: number;
}

export default interface SellOrder {
  _id: string;

  table_id?: Table;
  staff_id?: Staff;
  customer_id?: Customer;
  payment_type_id?: PaymentType;

  items?: OrderItem[];

  tax: number;
  discount: number;
  total_amount: string;

  currency?: string;
  notes?: string;

  status: string;
  order_time?: string;
  payment: number;

  created_at?: string;
  updated_at?: string;
}