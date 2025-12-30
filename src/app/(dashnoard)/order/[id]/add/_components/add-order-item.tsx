"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FILTER_PRODUCT } from "@/constants/order-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import CardProduct from "./card-product";
import LoadingCardProduct from "./loading-card-produck";
import CartSection from "./cart";
import { startTransition, useActionState, useState } from "react";
import { Cart } from "@/types/order";
import { Product } from "@/validations/product-validation";
import { addOrderItem } from "../../../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";


export default function AddOrderItem({ id }: { id: string }) {
  const supabase = createClient();
  const {
    currentPage,
    currentSearch,
    currentFilter,
    handleChangeFilter,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const { data: products, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["products", currentPage, currentSearch, currentFilter], // tambahkan currentFilter
    queryFn: async () => {
      const query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .order("created_at")
        .eq("is_available", true)
        .ilike("name", `%${currentSearch}%`);

      if (currentFilter) {
        query.eq("category", currentFilter);
      }

      const result = await query;

      if (result.error)
        toast.error("Get Product failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const { data: order } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const result = await supabase
        .from("orders")
        .select("id, customer_name, status, payment_token, tables (name, id)")
        .eq("order_id", id)
        .single();

      if (result.error)
        toast.error("Get Order data failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!id,
  });

  const [carts, setCarts] = useState<Cart[]>([]);
  const handleAddToCart = (
    product: Product,
    action: "increment" | "decrement"
  ) => {
    const existingItem = carts.find((item) => item.product_id === product.id);
    if (existingItem) {
      if (action === "decrement") {
        if (existingItem.quantity > 1) {
          setCarts(
            carts.map((item) =>
              item.product_id === product.id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    total: item.total - product.price,
                  }
                : item
            )
          );
        } else {
          setCarts(carts.filter((item) => item.product_id !== product.id));
        }
      } else {
        setCarts(
          carts.map((item) =>
            item.product_id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  total: item.total + product.price,
                }
              : item
          )
        );
      }
    } else {
      setCarts([
        ...carts,
        {
          product_id: product.id,
          quantity: 1,
          total: product.price,
          notes: "",
          product,
        },
      ]);
    }
  };


  const [addOrderItemState, addOrderItemAction, isPendingAddOrderItem] =
    useActionState(addOrderItem, INITIAL_STATE_ACTION);

  const handleOrder = async () => {
    const data = {
      order_id: id,
      items: carts.map((item) => ({
        order_id: order?.id ?? "",
        ...item,
        status: "pending",
      })),
    };

    startTransition(() => {
      addOrderItemAction(data);
    });
  };
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <div className="space-y-4 lg:w-2/3">
        <div className="flex flex-col items-center justify-between gap-4 w-full lg:flex-row">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <h1 className="text-2xl font-bold">ARSEE</h1>
            <div className="flex gap-2">
              {FILTER_PRODUCT.map((item) => (
                <Button
                  key={item.value}
                  onClick={() => handleChangeFilter(item.value)}
                  variant={currentFilter === item.value ? "default" : "outline"}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <Input
            placeholder="Search..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
        </div>
        {isLoadingProduct && !products ? (
          <LoadingCardProduct />
        ) : (
          <div className="grid grid-cols-3 w-full gap-4 ">
            {products?.data?.map((product) => (
              <CardProduct
                product={product}
                key={product.id}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
        {!isLoadingProduct && products?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <h1 className="text-2xl font-bold">No Product Found</h1>
          </div>
        )}
      </div>

      <div className="lg:w-1/3">
                <CartSection
          order={order}
          carts={carts}
          setCarts={setCarts}
          onAddToCart={handleAddToCart}
          isLoading={isPendingAddOrderItem}
          onOrder={handleOrder}
        />

      </div>
    </div>
  );
}
