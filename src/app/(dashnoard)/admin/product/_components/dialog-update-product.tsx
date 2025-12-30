import { INITIAL_STATE_UPDATE_USER } from "@/constants/auth-constant";
import {
  UpdateUserForm,
  updateUserSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateProduct } from "../actions";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import { Profile } from "@/types/auth";
import { Dialog } from "@/components/ui/dialog";
import FormProduct from "./form-product";
import {
  Product,
  ProductForm,
  productFormSchema,
} from "@/validations/product-validation";
import { INITIAL_STATE_PRODUCT } from "@/constants/product-constant";

export default function DialogUpdateProduct({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: Product | undefined;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
  });

  const [updateProductState, updateProductAction, isPendingUpdateProduct] =
    useActionState(updateProduct, INITIAL_STATE_PRODUCT);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    if (currentData?.image_url !== data.image_url) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, key === "image_url" ? preview!.file ?? "" : value);
      });
      formData.append("old_imager_url", currentData?.image_url ?? "");
    } else {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    formData.append("id", currentData?.id ?? "");

    startTransition(() => {
      updateProductAction(formData);
    });
  });

  useEffect(() => {
    if (updateProductState?.status === "error") {
      toast.error("Update Product Failed", {
        description: updateProductState.errors?._form?.[0],
      });
    }

    if (updateProductState?.status === "success") {
      toast.success("Update Product Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateProductState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name as string);
      form.setValue("description", currentData.description as string);
      form.setValue("price", currentData.price.toString());
      form.setValue("discount", currentData.discount.toString());
      form.setValue("category", currentData.category as string);
      form.setValue("is_available", currentData.is_available.toString());
      form.setValue("image_url", currentData.image_url as string);
      setPreview({
        file: new File([], currentData.image_url as string),
        displayUrl: currentData.image_url as string,
      });
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormProduct
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateProduct}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      />
    </Dialog>
  );
}
