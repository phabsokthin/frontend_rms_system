
export interface TopSellingProduct {
    totalSold: number;
    product_id: string;
    name: string;
    price: number;
    image: string;
    created_at: string
    category_id: string
    unit: string
    category: {
        id: string
        name: string
    }
}
