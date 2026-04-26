
export default interface Staff {
    _id: string,
    first_name: string,
    last_name: string,
    phone: string,
    gender: string,
    email?: string,
    position: string,
    address: string,
    start_time?: string,
    end_time?: string,
    salary?: number,
    status: boolean,
    created_at?: string,
    updated_at?: string

}
