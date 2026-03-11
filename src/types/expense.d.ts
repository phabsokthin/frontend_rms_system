export default interface Expense {
  _id: string;
  category_id?: {
    _id: string;
    name: string;
    description: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    __v: number;
  };
  name: string;
  description: string;
  amount: number;
  payment_type_id?: {
    _id: string;
    name: string;
    status: boolean;
    description: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    __v: number;
  };
  expense_date: string; // ISO date string
  status: string
  currency: string; // e.g., "KHR", "USD"
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  __v: number;
}
