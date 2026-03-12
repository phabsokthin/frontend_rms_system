import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Product from "../types/product";
import type SellOrderReport from "../types/sellReport";

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

export default {
  //get product report
  async getProductReport(): Promise<Product[]> {
    const response = await api.get(`${API_URL}report/product-report`);
    return response.data;
  },
  async getSellOrderReport(): Promise<SellOrderReportResponse> {
    const response = await api.get(`${API_URL}report/sell-report`);
    return response.data; // keep both data and report
  },
};
