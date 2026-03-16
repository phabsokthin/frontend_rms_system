import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Product from "../types/product";
import type ProfitAndLoss from "../types/profitAndLose";
import type Purchase from "../types/purchase";
import type SellOrderReport from "../types/sellReport";
import type { TopSellingProduct } from "../types/topSellingProduct";


//sell order response
interface SellOrderReportResponse {
  message: string;
  data: SellOrderReport[];
  report: {
    overall: {
      totalOrders: number;
      totalAmount: number;
      totalPayment: number;
      totalBalance: number;
    };
    byCurrency: Record<
      string,
      {
        totalOrders: number;
        totalAmount: number;
        totalPayment: number;
        totalBalance: number;
      }
    >;
  };
}

// purchase response

interface PurchaseReportResponse {
  message: string;
  data: Purchase[];
  report: {
    overall: {
      totalOrders: number;
      totalAmount: number;
      totalPayment: number;
      totalBalance: number;
    };
    byCurrency: Record<
      string,
      {
        totalOrders: number;
        totalAmount: number;
        totalPayment: number;
        totalBalance: number;
      }
    >;
  };
}


export default {
  //get product report
  async getProductReport(): Promise<Product[]> {
    const response = await api.get(`${API_URL}report/product-report`);
    return response.data;
  },

  //get sell report
  async getSellOrderReport(): Promise<SellOrderReportResponse> {
    const response = await api.get(`${API_URL}report/sell-report`);
    return response.data; // keep both data and report
  },

  //get purchase report
  async getPurchaseReport(): Promise<PurchaseReportResponse> {
    const response = await api.get(`${API_URL}report/purchase-report`);
    return response.data; // keep both data and report
  },

// Define the function with optional start/end dates
async getProfitAndLoseReport(start?: string, end?: string): Promise<ProfitAndLoss> {
  // Build query params
  const params: Record<string, string> = {};
  if (start) params.start = start; // e.g., "2026-03-01"
  if (end) params.end = end;     // e.g., "2026-03-15"

  const response = await api.get(`${API_URL}report/profitAndlose-report`, { params });
  return response.data; // returns { report, sellOrders, expenses, customers }
},

  // top selling product
  async getTopSellingProducts(): Promise<TopSellingProduct[]> {
    const response = await api.get(`${API_URL}report/top-selling-product`);
    return response.data;
  },


};
