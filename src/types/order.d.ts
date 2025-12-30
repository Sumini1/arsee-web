import { Product } from "@/validations/product-validation";

export type OrderFormState = {
  status?: string;
  errors?: {
    customer_name?: string[];
    table_id?: string[];
    status?: string[];
    _form?: string[];
  };
};

export type Cart = {
  product_id: string;
  quantity: number;
  total: number;
  notes: string;
  product: Product;
  order_id?: string;
};
