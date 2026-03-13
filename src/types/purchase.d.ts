export default interface Purchase {
    _id: string;
    supplier_id: {
        _id: string;
        name: string;
        contact_person: string;
        phone: string;
        email: string;
        address: string;
        status: boolean;
        created_at: string;
        updated_at: string;
    };
    purchase_date: string;
    tax: number,
    discount: number;
    payment:number;
    
    items: {
        product_id: string;
        qty: number;
        price: number;
        subtotal: number;
    }[];
    currency: string;
    total_amount: number;
    payment_type_id: {
        _id: string;
        name: string;
        status: boolean;
        description: string;
        created_at: string;
        updated_at: string;
    }
    status: string;
    notes: string;
    created_at: string;
    updated_at: string;
}


