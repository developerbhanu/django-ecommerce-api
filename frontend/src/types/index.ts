export interface Product {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  price: string;
  stock: number;
}

export interface CartItem {
  product: number;
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  order_id: string;
  created_at: string;
  items: OrderItem[];
  status: 'Pending' | 'Processing' | 'Completed' | 'Canceled';
  user: string;
  total_price: string;
}

export interface OrderItem {
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
}

export interface User {
  username: string;
  email: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
