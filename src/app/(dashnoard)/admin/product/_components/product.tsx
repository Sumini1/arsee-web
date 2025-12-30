"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Pencil, Trash2 } from "lucide-react";
import useDataTable from "@/hooks/use-data-table";

import { Product } from "@/validations/product-validation";
import Image from "next/image";
import { cn, convertIDR } from "@/lib/utils";
import { HEADER_TABLE_PRODUCT } from "@/constants/product-constant";
import DialogCreateProduct from "./dialog-create-product";
import DialogUpdateProduct from "./dialog-update-product";
import DialogDeleteProduct from "./dialog-delete-product";

export default function ProductManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `name.ilike.%${currentSearch}%, category.ilike.%${currentSearch}%`
        );
      }

      const result = await query;

      if (result.error)
        toast.error("Get Product failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Product;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) {
      setSelectedAction(null);
    }
  };

  const filteredData = useMemo(() => {
    return (products?.data || []).map((product: Product, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex items-center gap-2">
          <Image
            src={product.image_url as string}
            alt={product.name}
            width={40}
            height={40}
            className="rounded"
          />
          {product.name}
        </div>,
        product.category,
        <div>
          <p>Base: {convertIDR(product.price)}</p>
          <p>Discount: {product.discount}%</p>
          <p>
            After Discount:{" "}
            {convertIDR(
              product.price - (product.price * product.discount) / 100
            )}
          </p>
        </div>,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            product.is_available ? "bg-green-600" : "bg-red-600"
          )}
        >
          {product.is_available ? "Available" : "Not Available"}
        </div>,
        <DropdownAction
          product={[
            {
              label: (
                <span className="flex item-center gap-2">
                  <Pencil />
                  Edit
                </span>
              ),
              action: () => {
                setSelectedAction({
                  data: product,
                  type: "update",
                });
              },
            },
            {
              label: (
                <span className="flex item-center gap-2">
                  <Trash2 className="text-red-400" />
                  Delete
                </span>
              ),
              variant: "destructive",
              action: () => {
                setSelectedAction({
                  data: product,
                  type: "delete",
                });
              },
            },
          ]}
        />,
      ];
    });
  }, [products]);

  const totalPages = useMemo(() => {
    return products && products.count !== null
      ? Math.ceil(products.count / currentLimit)
      : 0;
  }, [products]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateProduct refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_PRODUCT}
        data={filteredData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateProduct
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={
          selectedAction?.type === "update" ? selectedAction.data : undefined
        }
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteProduct
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={
          selectedAction?.type === "delete" ? selectedAction.data : undefined
        }
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
