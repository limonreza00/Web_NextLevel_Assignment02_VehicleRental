export interface UserPayload {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "customer";
}
