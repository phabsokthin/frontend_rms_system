export default interface Table {
    _id: string;
    table_number: string;
    capacity: number;
    status?: boolean;
    location: string;
    draft?: string;
    created_at?: string;
    updated_at?: string;
}
