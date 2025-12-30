import { zodResolver } from "@hookform/resolvers/zod";

import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import { createProduct } from "../actions";
import FormProduct from "./form-product";
import {
  ProductForm,
  productFormSchema,
} from "@/validations/product-validation";
import {
  INITIAL_PRODUCT,
  INITIAL_STATE_PRODUCT,
} from "@/constants/product-constant";

export default function DialogCreateProduct({
  refetch,
}: {
  refetch: () => void;
}) {
  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: INITIAL_PRODUCT,
  });

  const [createProductState, createProductAction, isPendingCreateProduct] =
    useActionState(createProduct, INITIAL_STATE_PRODUCT);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "image_url") {
        if (preview?.file) {
          formData.append(key, preview.file);
        }
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // Debug: Log FormData
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    startTransition(() => {
      createProductAction(formData);
    });
  });

  useEffect(() => {
    if (createProductState?.status === "error") {
      toast.error("Create Product Failed", {
        description: createProductState.errors?._form?.[0],
      });
    }

    if (createProductState?.status === "success") {
      toast.success("Create Product Success");
      form.reset();
      setPreview(undefined);
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createProductState]);

  return (
    <FormProduct
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateProduct}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
}
