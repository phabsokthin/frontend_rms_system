export default interface Product {
    _id: string;
    name: string;
    category_id?: {
        _id: string;
        name: string;
    };
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
}

