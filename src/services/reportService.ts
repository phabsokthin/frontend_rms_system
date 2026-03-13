import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Product from "../types/product";
import type ProfitAndLoss from "../types/profitAndLose";
import type Purchase from "../types/purchase";
import type SellOrderReport from "../types/sellReport";


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

  // profit and lose report
  async getProfitAndLoseReport(): Promise<ProfitAndLoss> {
    const response = await api.get(`${API_URL}report/profitAndlose-report`);
    return response.data; // keep both data and report
  },

};
