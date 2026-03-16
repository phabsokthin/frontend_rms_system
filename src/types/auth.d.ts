export default interface UserAuth {
  _id: string;
  email: string;
  password: string;
  username?: string;
  email?: string;
  status?: boolean;
  id?: string;
  role?: string;
}
