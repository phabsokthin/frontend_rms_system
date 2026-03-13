// Define types
type CurrencyReport = {
  sales: number;
  expenses: number;
  profit: number;
  loss: number;
};

type TotalsReport = {
  sales: number;
  expenses: number;
  profit: number;
  loss: number;
};

type Report = {
  totals: TotalsReport;
  byCurrency: {
    usd?: CurrencyReport;
    khr?: CurrencyReport;
  };
};

type SellOrderItem = {
  product_id: string;
  qty: number;
  price: number;
  subtotal: number;
};

type SellOrder = {
  _id: string;
  table_id: string;
  staff_id: string;
  customer_id: string;
  tax: number;
  discount: number;
  items: SellOrderItem[];
  total_amount: string;
  payment: number;
  payment_type_id: string;
  status: string;
  currency: string;
  notes: string;
  order_time: string;
  created_at: string;
  updated_at: string;
  __v: number;
};

type Expense = {
  _id: string;
  category_id: string | null;
  name: string;
  description: string;
  amount: number;
  payment_type_id: string;
  expense_date: string;
  status: string;
  currency: string;
  created_at: string;
  updated_at: string;
  __v: number;
};

export default interface ProfitAndLoss {
  report: Report;
  sellOrders: SellOrder[];
  expenses: Expense[];
}
