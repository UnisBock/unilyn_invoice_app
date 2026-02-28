export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface ClientInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface InvoiceData {
  id?: number;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  client: ClientInfo;
  items: InvoiceItem[];
  taxRate: number;
  discount: number;
  notes: string;
  subtotal?: number;
  total?: number;
  created_at?: string;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
