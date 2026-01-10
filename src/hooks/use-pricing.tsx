import { Product } from "@/validations/product-validation";
import { useMemo } from "react";

export function usePricing(
  orderProduct: {
    products: Product;
    quantity: number;
    nominal: number;
  }[]
) {
  const totalPrice = useMemo(() => {
    let total = 0;

    orderProduct.forEach((item) => {
      total += item.nominal;
    });

    return total;
  }, [orderProduct]);

  const tax = useMemo(() => {
    return Math.round(totalPrice * 0.12);
  }, [totalPrice]);

  const service = useMemo(() => {
    return Math.round(totalPrice * 0.05);
  }, [totalPrice]);

  const grandTotal = useMemo(() => {
    return totalPrice + tax + service;
  }, [totalPrice, tax, service]);

  return {
    grandTotal,
    totalPrice,
    tax,
    service,
  };
}
