export default interface Supplier {
    _id: string;
    name: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
    status: boolean;
    created_at?: string;
    updated_at?: string;
}
